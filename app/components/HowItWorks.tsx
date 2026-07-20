"use client";

import { useState } from "react";
import type { FC } from "react";

// ---------------------------------------------------------------------------
// Phase data
// ---------------------------------------------------------------------------

type PhaseColor = "blue" | "cyan" | "teal";

interface Phase {
  number: number;
  name: string;
  caption: string;
  color: PhaseColor;
  highlighted?: boolean;
  detail: string;
  condition: string;
  subsystem: string;
}

const PHASES: Phase[] = [
  {
    number: 1,
    name: "SocketInventory",
    caption: "Enumerate every open TCP connection on the source pod.",
    color: "blue",
    detail:
      "Walks the pod's network namespace to build a full inventory of open TCP sockets, including remote endpoints, sequence numbers, and connection state. Nothing is paused yet.",
    condition: "SocketInventoryComplete=True",
    subsystem: "Network (eBPF)",
  },
  {
    number: 2,
    name: "Validating",
    caption: "Admission checks: is this pod migratable? Detect CNI, storage tier, GitOps.",
    color: "blue",
    detail:
      "Evaluates the pod against admission criteria: CRIU capability label on the source node, storage tier classification, CNI compatibility, and GitOps controller detection. A failure here leaves the source pod untouched.",
    condition: "ValidationPassed=True",
    subsystem: "Compute (CRIU)",
  },
  {
    number: 3,
    name: "DestinationPrewarm",
    caption: "Stage the destination node's netns and overlay.",
    color: "blue",
    detail:
      "Creates the target network namespace, reserves the pod's IP on the destination via FDB entries, and triggers the storage pre-sync. Runs while the pod keeps serving traffic.",
    condition: "DestinationReady=True",
    subsystem: "Network (eBPF) + Storage",
  },
  {
    number: 4,
    name: "PreCopyMemory",
    caption: "Iteratively copy dirty memory pages while the pod keeps running.",
    color: "blue",
    detail:
      "CRIU 4.2 iterative pre-copy tracks dirty pages in rounds, shrinking the final freeze delta with each pass. The pod remains live throughout. Multiple rounds are run until the dirty-page rate drops below the threshold or the round limit is reached.",
    condition: "PreCopyComplete=True",
    subsystem: "Compute (CRIU)",
  },
  {
    number: 5,
    name: "ZeroWindowArm",
    caption: "eBPF zero-window hold pauses TCP senders on both sides (flow control, no RST).",
    color: "blue",
    detail:
      "An eBPF TC hook rewrites the TCP receive-window field to zero on both the source and destination sides. This uses standard TCP flow control to pause in-flight data without resetting connections. No RST is sent.",
    condition: "ZeroWindowArmed=True",
    subsystem: "Network (eBPF)",
  },
  {
    number: 6,
    name: "FinalFreezeStateCapture",
    caption: "Brief freeze. CRIU dumps memory + TCP state. Target ≤100 ms; budget ≤500 ms.",
    color: "cyan",
    highlighted: true,
    detail:
      "The pod is frozen. CRIU writes the final memory image and captures full TCP socket state (sequence numbers, congestion window, options). This is the only interval where the pod does not serve traffic. The freeze window is bounded by the 500 ms budget enforced in the PodMigration spec.",
    condition: "StateCaptureDone=True",
    subsystem: "Compute (CRIU) + Network (eBPF)",
  },
  {
    number: 7,
    name: "OverlayHandoff",
    caption: "Inject route/neighbor entries so the pod's IP now resolves to the destination.",
    color: "teal",
    detail:
      "Updates the host route and ARP/NDP neighbor tables so the pod's IP routes to the destination node (kindnet host-routed substrate of record; no VXLAN overlay). The eBPF relay bridges the two sides until CRIU restore is complete and sockets are reattached.",
    condition: "OverlayConverged=True",
    subsystem: "Network (eBPF)",
  },
  {
    number: 8,
    name: "Restore + SocketReattach",
    caption: "CRIU restores the process tree and re-attaches sockets on the destination.",
    color: "teal",
    detail:
      "CRIU restores the full process tree from the checkpoint image on the destination node. Sockets re-attach to the relay using the captured sequence numbers, achieving seq_delta=0 — first proven at Sprint 46 for a single held TCP connection in Strict mode — so no adjustment is needed at the peer.",
    condition: "ProcessRestored=True",
    subsystem: "Compute (CRIU)",
  },
  {
    number: 9,
    name: "DisengageHold",
    caption: "Once the relay is armed and the overlay converged, release the zero-window hold.",
    color: "teal",
    detail:
      "The eBPF hook that held the zero-window advertisement is removed. TCP flow control resumes normally and in-flight data completes delivery. The eBPF sequence-translation relay remains active until TCPVerifying passes.",
    condition: "HoldDisengaged=True",
    subsystem: "Network (eBPF)",
  },
  {
    number: 10,
    name: "TCPVerifying",
    caption: "Confirm seq_delta=0 and connection-count parity (first proven at Sprint 46; single held connection).",
    color: "teal",
    detail:
      "Reads the PM_SEQ_XLAT map from the eBPF relay and verifies that every migrated socket shows a sequence delta of zero, comparing connection count against the Phase 1 inventory. seq_delta=0 / Strict-mode held-TCP survival was first proven at Sprint 46: a single held connection survived a worker node A -> worker node B migration byte-exact (1/1 byte-exact, seq_delta 0/0, freeze 602ms). A single documented end-to-end run, not a statistical corpus — the broader bar (many concurrent flows, multi-container, statistical repeatability across declared CNIs) is still ahead.",
    condition: "TCPSequenceContinuityVerified=True",
    subsystem: "Network (eBPF)",
  },
  {
    number: 11,
    name: "ServiceVerifying",
    caption: "Run the application probe (for example SELECT 1) and traffic verification.",
    color: "teal",
    detail:
      "Executes the pod's readiness probe and the configured application probe (for PostgreSQL: SELECT 1). Traffic is verified as flowing through the restored connections before the source is considered eligible for deletion.",
    condition: "TrafficVerified=True",
    subsystem: "Compute (CRIU)",
  },
  {
    number: 12,
    name: "CutoverComplete → Complete",
    caption: "Only now is the source pod deleted (gated on TrafficVerified=True). Audit record preserved.",
    color: "teal",
    detail:
      "The source pod is deleted only after TrafficVerified=True is set (ADR-0012). The PodMigration CR is transitioned to Complete and the audit record — including all phase timestamps and traffic-verification results — is preserved for inspection.",
    condition: "MigrationComplete=True",
    subsystem: "Compute (CRIU)",
  },
];

// ---------------------------------------------------------------------------
// Colour helpers
// ---------------------------------------------------------------------------

function badgeBg(phase: Phase): string {
  if (phase.highlighted) return "bg-pm-cyan-400 text-pm-navy-900";
  if (phase.color === "blue") return "bg-blue-600 text-white";
  return "bg-teal-600 text-white";
}

function connectorColor(phase: Phase): string {
  if (phase.color === "blue") return "bg-blue-600/40";
  if (phase.highlighted) return "bg-pm-cyan-400/40";
  return "bg-teal-600/40";
}

function cardBorder(phase: Phase): string {
  if (phase.highlighted)
    return "border border-pm-cyan-400/60 bg-pm-cyan-400/5 shadow-[0_0_20px_rgba(34,211,238,0.12)]";
  if (phase.color === "blue") return "border border-blue-600/30 bg-blue-950/30";
  return "border border-teal-600/30 bg-teal-950/20";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const HowItWorks: FC = () => {
  const [activePhase, setActivePhase] = useState<number | null>(null);

  const active = activePhase !== null ? PHASES[activePhase - 1] : null;

  return (
    <section
      id="how-it-works"
      className="bg-pm-navy-900 py-24 sm:py-32"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        {/* ---------------------------------------------------------------- */}
        {/* Section header                                                    */}
        {/* ---------------------------------------------------------------- */}
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-pm-cyan-300">
          12-Phase Migration State Machine
        </p>
        <h2
          id="how-it-works-heading"
          className="mb-6 text-3xl font-bold leading-tight tracking-tight text-pm-white sm:text-4xl"
        >
          How a migration works
        </h2>
        <p className="mb-6 max-w-2xl text-lg leading-relaxed text-pm-white-muted">
          Every PodMotion migration runs a 12-phase migration state machine.
          Each phase writes a Kubernetes status condition before it acts —
          crash-safe and auditable. The 12 steps below trace the migration
          pipeline; TCP-preservation phases run when{" "}
          <code>tcpPreservationMode</code> is opted in (default <code>None</code>;
          BestEffort or Strict). For exactly what is proven, on which substrate,
          in which mode, and how far the scope goes, see the compatibility matrix
          at the top of the page.
        </p>
        <p className="mb-16 max-w-2xl text-lg leading-relaxed text-pm-white-muted">
          In plain terms: PodMotion picks up a running app from one machine and sets it down on another, restored on the destination node — no stop-and-restart. Keeping the same pod IP across that move depends on your CNI and cloud network, so it is not something every provider can support.
        </p>

        {/* ---------------------------------------------------------------- */}
        {/* Legend                                                            */}
        {/* ---------------------------------------------------------------- */}
        <div className="mb-10 flex flex-wrap items-center gap-6 text-sm">
          <span className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-blue-600" />
            <span className="text-pm-white-muted">Pre-freeze (steps 1–5)</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-pm-cyan-400" />
            <span className="text-pm-white-muted">FinalFreezeStateCapture (step 6)</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-teal-500" />
            <span className="text-pm-white-muted">
              Restoration &amp; verify (steps 7–12)
            </span>
          </span>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* MOBILE: vertical stepper                                          */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex flex-col gap-0 lg:hidden">
          {PHASES.map((phase, idx) => (
            <div key={phase.number} className="flex gap-4">
              {/* Left spine */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  aria-pressed={activePhase === phase.number}
                  aria-label={`Phase ${phase.number}: ${phase.name}`}
                  onClick={() =>
                    setActivePhase(
                      activePhase === phase.number ? null : phase.number
                    )
                  }
                  className={[
                    "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pm-cyan-400",
                    badgeBg(phase),
                    phase.highlighted
                      ? "ring-2 ring-pm-cyan-400 ring-offset-2 ring-offset-pm-navy-900"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {phase.number}
                </button>
                {idx < PHASES.length - 1 && (
                  <div className="mt-1 h-full w-0.5 bg-white/10" />
                )}
              </div>

              {/* Right content */}
              <div className="mb-4 flex-1">
                <button
                  type="button"
                  onClick={() =>
                    setActivePhase(
                      activePhase === phase.number ? null : phase.number
                    )
                  }
                  className="w-full text-left"
                  aria-expanded={activePhase === phase.number}
                >
                  <p
                    className={[
                      "font-semibold leading-snug",
                      phase.highlighted ? "text-pm-cyan-300" : "text-pm-white",
                    ].join(" ")}
                  >
                    {phase.name}
                  </p>
                  <p className="mt-0.5 text-sm text-pm-white-muted">
                    {phase.caption}
                  </p>
                </button>

                {activePhase === phase.number && active && (
                  <div
                    className={[
                      "mt-3 rounded-lg p-4 text-sm leading-relaxed text-pm-white-muted",
                      cardBorder(phase),
                    ].join(" ")}
                  >
                    <p>{active.detail}</p>
                    <p className="mt-3 font-mono text-xs text-pm-cyan-300">
                      Status condition: {active.condition}
                    </p>
                    <p className="mt-1 text-xs text-pm-white-muted/60">
                      Subsystem: {active.subsystem}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* DESKTOP: horizontal scrolling rail                               */}
        {/* ---------------------------------------------------------------- */}
        <div className="hidden lg:block">
          {/* Phase rail */}
          <div
            className="overflow-x-auto pb-4"
            role="list"
            aria-label="Migration phases"
          >
            <div className="flex min-w-max items-start gap-0">
              {PHASES.map((phase, idx) => (
                <div
                  key={phase.number}
                  className="flex items-start"
                  role="listitem"
                >
                  {/* Phase node */}
                  <div className="flex flex-col items-center" style={{ width: 88 }}>
                    <button
                      type="button"
                      aria-pressed={activePhase === phase.number}
                      aria-label={`Phase ${phase.number}: ${phase.name}`}
                      onClick={() =>
                        setActivePhase(
                          activePhase === phase.number ? null : phase.number
                        )
                      }
                      className={[
                        "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pm-cyan-400",
                        badgeBg(phase),
                        phase.highlighted
                          ? "ring-2 ring-pm-cyan-400 ring-offset-2 ring-offset-pm-navy-900"
                          : "",
                        activePhase === phase.number
                          ? "scale-110 shadow-lg"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {phase.number}
                    </button>
                    <p
                      className={[
                        "mt-2 text-center text-xs font-semibold leading-tight",
                        phase.highlighted
                          ? "text-pm-cyan-300"
                          : "text-pm-white",
                      ].join(" ")}
                      style={{ maxWidth: 80 }}
                    >
                      {phase.name}
                    </p>
                  </div>

                  {/* Connector */}
                  {idx < PHASES.length - 1 && (
                    <div
                      className={[
                        "mt-4 h-0.5 flex-shrink-0",
                        connectorColor(phase),
                      ].join(" ")}
                      style={{ width: 20 }}
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          {active && (
            <div
              className={[
                "mt-6 rounded-xl p-6 transition-all",
                cardBorder(active),
              ].join(" ")}
              role="region"
              aria-label={`Phase ${active.number} detail`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3
                    className={[
                      "text-lg font-bold",
                      active.highlighted
                        ? "text-pm-cyan-300"
                        : "text-pm-white",
                    ].join(" ")}
                  >
                    Phase {active.number} — {active.name}
                  </h3>
                  <p className="mt-1 text-sm text-pm-white-muted">
                    {active.caption}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close phase detail"
                  onClick={() => setActivePhase(null)}
                  className="text-pm-white-muted/60 hover:text-pm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pm-cyan-400"
                >
                  ✕
                </button>
              </div>
              <p className="mt-4 leading-relaxed text-pm-white-muted">
                {active.detail}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <span className="font-mono text-pm-cyan-300">
                  {active.condition}
                </span>
                <span className="text-pm-white-muted/60">
                  Subsystem: {active.subsystem}
                </span>
              </div>
            </div>
          )}

          {!active && (
            <p className="mt-4 text-center text-sm text-pm-white-muted/40">
              Click any phase for details.
            </p>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Callout: invariant                                                */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-12 border-l-4 border-blue-500 bg-blue-950/40 py-4 pl-5 pr-4">
          <p className="text-sm font-semibold text-blue-300">
            Safety invariant (ADR-0012)
          </p>
          <p className="mt-1 text-pm-white-muted">
            The source pod is never deleted until the destination is verified
            serving (ADR-0012).
          </p>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Callout: failure mode                                             */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-4 border-l-4 border-amber-500 bg-amber-950/30 py-4 pl-5 pr-4">
          <p className="text-sm font-semibold text-amber-300">
            Failure mode
          </p>
          <p className="mt-1 text-pm-white-muted">
            If any phase before Cutover fails, PodMotion rolls back — the
            destination is discarded and your pod keeps running on its original
            node.
          </p>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Proof section (P6)                                               */}
        {/* ---------------------------------------------------------------- */}
        <div id="proof" className="mt-24">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-pm-cyan-300">
            Proof Results
          </p>
          <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-pm-white sm:text-4xl">
            The proof: a running, stateful pod moved across nodes and restored on the destination node
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed text-pm-white-muted">
            The full proof record — what was proven, on which substrate, in which
            migration mode, and how far the scope goes — lives in the{" "}
            <a
              href="#proof-strip"
              className="underline underline-offset-2 hover:text-pm-white"
            >
              compatibility matrix at the top of the page
            </a>
            . Each row states its own CNI, workload, mode, and the exact
            conditions of the run, with a link to the committed proof doc.
          </p>

          {/* Honesty footnote */}
          <p className="mt-8 border-t border-white/10 pt-6 text-sm italic text-pm-white-muted/70">
            Broader coverage — many concurrent flows, multi-container, N-flow
            Service-routed transparency, and additional CNIs — remains on the
            roadmap, not yet proven.{" "}
            <a
              href="https://github.com/podmotion-io/podmotion/milestones"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-pm-white"
            >
              We publish limits, not just wins.
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

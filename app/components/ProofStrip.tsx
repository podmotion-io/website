import React from "react";

function CheckIcon() {
  return (
    <svg
      className="inline-block w-7 h-7 text-green-400 mr-3 flex-shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M7 12.5l3.5 3.5 6-7" />
    </svg>
  );
}

interface ChipProps {
  children: React.ReactNode;
  title?: string;
}

function MetricChip({ children, title }: ChipProps) {
  return (
    <span
      className="inline-flex items-center px-3 py-1.5 rounded-full bg-pm-navy-700 border border-pm-navy-600 text-pm-white text-sm font-mono font-medium whitespace-nowrap"
      title={title}
    >
      {children}
    </span>
  );
}

function BadgeChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-pm-navy-700 border border-pm-navy-600 text-pm-white-subtle text-xs font-medium whitespace-nowrap">
      {children}
    </span>
  );
}

export function ProofStrip() {
  return (
    <section
      id="proof-strip"
      className="bg-pm-navy-800 py-12 px-4"
      aria-label="PodMotion compatibility matrix: CNI, workload, migration mode, and proof status"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">

        {/* Matrix intro */}
        <p className="text-pm-white-subtle text-xs text-center max-w-2xl font-mono tracking-wide">
          What is proven, on what substrate, and how far the scope goes. Each row states its own CNI, workload, migration mode, and the exact conditions of the run.
        </p>

        {/* At-a-glance headline */}
        <div className="flex items-center justify-center text-center">
          <CheckIcon />
          <p className="text-xl sm:text-2xl font-semibold text-pm-white leading-snug">
            A live TCP connection survived a migration byte-exact &mdash; 1/1 byte-exact, seq_delta 0/0 &mdash; first proven Sprint 46
          </p>
        </div>

        {/* Headline metrics */}
        <div className="flex flex-wrap justify-center gap-3">
          <MetricChip
            title="Strict-mode held-TCP survival with zero TCP sequence delta was first proven end-to-end at Sprint 46: a single held connection survived a worker node A -> worker node B migration byte-exact (1/1 connections byte-exact, seq_delta 0/0, freeze 602ms) on a real multi-node cluster. The committed proof doc records no CNI, no architecture, and no run count. The broader bar — many concurrent flows, multi-container, statistical repeatability across declared CNIs — is still ahead. See docs/proof/sprint46-proof.md."
          >
            seq_delta=0&nbsp;(held&nbsp;TCP):&nbsp;first&nbsp;proven&nbsp;Sprint&nbsp;46&nbsp;&mdash;&nbsp;single&nbsp;connection&nbsp;&middot;&nbsp;full&nbsp;multi-flow&nbsp;bar&nbsp;still&nbsp;ahead
          </MetricChip>
          <MetricChip>freeze p50 312&thinsp;ms&thinsp;/&thinsp;p99 487&thinsp;ms&thinsp;(n=10, NS#4)</MetricChip>
          <MetricChip>0 RST</MetricChip>
          <MetricChip>kernel 6.8&nbsp;&middot;&nbsp;no patches</MetricChip>
        </div>

        {/* Compatibility matrix — CNI x workload x migration mode x status */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <caption className="sr-only">
              PodMotion proof matrix: substrate/CNI, workload, migration mode, and status
            </caption>
            <thead>
              <tr className="text-pm-white-subtle text-xs uppercase tracking-wide font-mono">
                <th className="px-3 py-2 border-b border-pm-navy-600">Substrate / CNI</th>
                <th className="px-3 py-2 border-b border-pm-navy-600">Workload</th>
                <th className="px-3 py-2 border-b border-pm-navy-600">Mode</th>
                <th className="px-3 py-2 border-b border-pm-navy-600">Status &amp; evidence</th>
              </tr>
            </thead>
            <tbody className="align-top">

              {/* Proven — current multi-node cluster */}
              <tr>
                <td colSpan={4} className="px-3 pt-5 pb-1 text-pm-white text-xs font-mono uppercase tracking-wide">
                  Proven &mdash; current multi-node cluster
                </td>
              </tr>
              <tr className="border-b border-pm-navy-700">
                <td className="px-3 py-3 text-pm-white-subtle">Multi-node cluster, worker node A&nbsp;&rarr;&nbsp;worker node B. The committed proof doc records no CNI and no architecture.</td>
                <td className="px-3 py-3 text-pm-white-subtle">Redis &mdash; single held TCP connection under load</td>
                <td className="px-3 py-3 text-pm-white font-mono">Strict</td>
                <td className="px-3 py-3 text-pm-white-subtle">
                  <span className="text-pm-white font-semibold">Proven byte-exact &mdash; Sprint 46.</span> PodMigration phase=Complete; 1/1 connections verified byte-exact (seq_delta 0/0), freeze 602ms, elapsed 33s, OVERALL_RESULT=PASS. First evidence a live TCP connection survives a PodMotion migration byte-exact. A single documented end-to-end run, not a statistical corpus &mdash; the broader bar (many concurrent flows, multi-container, statistical repeatability across declared CNIs) is still ahead. Source pod never deleted before TrafficVerified. See docs/proof/sprint46-proof.md.
                </td>
              </tr>
              <tr className="border-b border-pm-navy-700">
                <td className="px-3 py-3 text-pm-white-subtle">Same multi-node cluster, worker node A&nbsp;&rarr;&nbsp;worker node B. No CNI, architecture, or run count recorded.</td>
                <td className="px-3 py-3 text-pm-white-subtle">Postgres &mdash; continuous write load, ReadWriteMany re-attach</td>
                <td className="px-3 py-3 text-pm-white font-mono">None</td>
                <td className="px-3 py-3 text-pm-white-subtle">
                  <span className="text-pm-white font-semibold">Proven &mdash; Sprint 46.</span> phase=Complete; the shared ReadWriteMany volume re-attached on the destination node, the row counter advanced 8&nbsp;&rarr;&nbsp;16 with 0 post-migration write errors, freeze 766ms, elapsed 43s, OVERALL_RESULT=PASS. Exercises ReadWriteMany re-attach only (tcpPreservationMode None) &mdash; it does not exercise or imply live block-storage migration, which remains deferred to v1.2. See docs/proof/sprint46-proof.md.
                </td>
              </tr>
              <tr className="border-b border-pm-navy-700">
                <td className="px-3 py-3 text-pm-white-subtle">Flannel CNI &mdash; KVM/libvirt kubeadm cluster (Kubernetes v1.35.x, containerd runtime), worker node A&nbsp;&rarr;&nbsp;worker node B</td>
                <td className="px-3 py-3 text-pm-white-subtle">nginx</td>
                <td className="px-3 py-3 text-pm-white font-mono">Cold</td>
                <td className="px-3 py-3 text-pm-white-subtle">
                  <span className="text-pm-white font-semibold">Proven in a live run &mdash; Sprint 49.</span> A real multi-node migration reached phase=Complete, verified in-run on the KVM cluster; Sprint 49 code is merged to main. Committed publication-safe proof docs end at sprint46-proof.md &mdash; this is a verified in-run result, not a committed proof doc, and implies no GA or mainline availability.
                </td>
              </tr>

              {/* In supported scope — not yet proven */}
              <tr>
                <td colSpan={4} className="px-3 pt-5 pb-1 text-pm-white text-xs font-mono uppercase tracking-wide">
                  In supported scope &mdash; not yet proven
                </td>
              </tr>
              <tr className="border-b border-pm-navy-700">
                <td className="px-3 py-3 text-pm-white-subtle">Cilium</td>
                <td className="px-3 py-3 text-pm-white-subtle">Live migration</td>
                <td className="px-3 py-3 text-pm-white-subtle font-mono">&mdash;</td>
                <td className="px-3 py-3 text-pm-white-subtle">
                  In supported CNI scope per ADR-0318 (Accepted 2026-07-10, superseding ADR-0082&nbsp;&sect;2 and ADR-0313) &mdash; but cutover-gated, not yet reachable: the live-migration reachability proof is gated behind the storage-cutover work. No live-migration proof yet.
                </td>
              </tr>
              <tr className="border-b border-pm-navy-700">
                <td className="px-3 py-3 text-pm-white-subtle">Calico (Tigera Operator, alternative CNI candidate in the substrate)</td>
                <td className="px-3 py-3 text-pm-white-subtle font-mono">&mdash;</td>
                <td className="px-3 py-3 text-pm-white-subtle font-mono">&mdash;</td>
                <td className="px-3 py-3 text-pm-white-subtle">
                  Planned, not yet proven. Sprint 48 holds a compatibility plan only; no passing live-migration proof.
                </td>
              </tr>

              {/* Historical single-host kind baselines */}
              <tr>
                <td colSpan={4} className="px-3 pt-5 pb-1 text-pm-white text-xs font-mono uppercase tracking-wide">
                  Historical single-host kind baselines
                </td>
              </tr>
              <tr className="border-b border-pm-navy-700">
                <td className="px-3 py-3 text-pm-white-subtle">Single-host two-node kind cluster (pm-control + pm-worker Docker containers), inter-node path via Flannel VXLAN overlay on one physical machine &mdash; arm64 / Ubuntu 24.04 / kernel 6.8</td>
                <td className="px-3 py-3 text-pm-white-subtle">Live PostgreSQL (pgbench proof corpus)</td>
                <td className="px-3 py-3 text-pm-white-subtle font-mono">&mdash;</td>
                <td className="px-3 py-3 text-pm-white-subtle">
                  <span className="text-pm-white font-semibold">NS#4.</span> 0 failed transactions observed &mdash; 10 proof runs, 8 pgbench connections, failed_transactions=0.
                </td>
              </tr>
              <tr className="border-b border-pm-navy-700">
                <td className="px-3 py-3 text-pm-white-subtle">Same single-host two-node kind host &mdash; Flannel VXLAN overlay, arm64 / Ubuntu 24.04 / kernel 6.8</td>
                <td className="px-3 py-3 text-pm-white-subtle">Redis active-write (historical arm64 PoC)</td>
                <td className="px-3 py-3 text-pm-white-subtle font-mono">&mdash;</td>
                <td className="px-3 py-3 text-pm-white-subtle">
                  <span className="text-pm-white font-semibold">Sprint 30 &middot; 2026-06-13.</span> 18/18 ACs PASS. n=1, single migration, single connection, client on host (not in pod); not weighted at parity with the NS#4 10-run statistical corpus. Next goal (Phase C) seq_delta=0 not yet proven end-to-end.
                </td>
              </tr>
              <tr className="border-b border-pm-navy-700">
                <td className="px-3 py-3 text-pm-white-subtle">Single-host two-node kind cluster (worker&nbsp;&rarr;&nbsp;control-plane) &mdash; kindnet CNI (host-routed, no VXLAN overlay), amd64 / Ubuntu 24.04 / kernel 6.17</td>
                <td className="px-3 py-3 text-pm-white-subtle">Redis</td>
                <td className="px-3 py-3 text-pm-white font-mono">Cold (None)</td>
                <td className="px-3 py-3 text-pm-white-subtle">
                  <span className="text-pm-white font-semibold">Sprint 31, NP-AMD64-BASELINE &middot; 2026-06-15.</span> amd64 cold migration proven (tcpPreservationMode=None). 22/22 gates, freeze=199ms, redis key pm-sprint31-key present in replacement pod, source pod deleted post-TrafficVerified, EndpointSliceCleanupVerified. Kernel 6.17 is correct for this host &mdash; NS#4 and Sprint 30 used a separate arm64 host at kernel 6.8 with Flannel VXLAN.
                </td>
              </tr>
              <tr className="border-b border-pm-navy-700">
                <td className="px-3 py-3 text-pm-white-subtle">Single-host two-node kind cluster &mdash; Flannel CNI, amd64 / Ubuntu 24.04 / CRIU 4.2 / kernel 6.17</td>
                <td className="px-3 py-3 text-pm-white-subtle">Cold-path CRIU restore baseline &mdash; no PVCs, BestEffort TCP</td>
                <td className="px-3 py-3 text-pm-white font-mono">Cold</td>
                <td className="px-3 py-3 text-pm-white-subtle">
                  <span className="text-pm-white font-semibold">Sprint 32 &middot; 2026-06-16.</span> n=1, single end-to-end run, worker&nbsp;&rarr;&nbsp;control-plane. 21/22 gate criteria PASS. CRIU restore completed with &ldquo;Restore finished successfully&rdquo;; restored PID moved into destination pod cgroup with file descriptors intact; source pod intact throughout, never deleted before TrafficVerified (ADR-0012). GC-21 (destination pod Kubernetes Running phase) is expected fail &mdash; iptables-restore post-resume fails in kind network namespaces, a pre-existing kind substrate behavior scoped out per ADR-0166. Gate close commit: 8c16993.
                </td>
              </tr>
              <tr className="border-b border-pm-navy-700">
                <td className="px-3 py-3 text-pm-white-subtle">Single-host two-node kind cluster &mdash; kindnet CNI (host-routed, no VXLAN overlay), amd64 / kernel 6.17 / containerd 1.7.24 / Kubernetes v1.32.0</td>
                <td className="px-3 py-3 text-pm-white-subtle">redis:7-alpine</td>
                <td className="px-3 py-3 text-pm-white font-mono">Cold</td>
                <td className="px-3 py-3 text-pm-white-subtle">
                  <span className="text-pm-white font-semibold">Sprint 33 &middot; 2026-06-16.</span> End-to-end cold-path live migration in BestEffort transfer mode, n=1, redis:7-alpine checkpointed on worker and restored on control-plane, ~13s wall-clock, 22/22 gates. Phase=Complete, TrafficVerified=True reached BEFORE the source pod was deleted; restored Redis answered PING with PONG. Cold-path scope only &mdash; the cold-path mechanism is proven end-to-end; zero-TCP-sequence-delta (seq_delta) is NOT claimed here.
                </td>
              </tr>
              <tr className="border-b border-pm-navy-700">
                <td className="px-3 py-3 text-pm-white-subtle">Same cluster as the Sprint 33 cold-path proof</td>
                <td className="px-3 py-3 text-pm-white-subtle">gRPC control-plane security hardening</td>
                <td className="px-3 py-3 text-pm-white-subtle font-mono">&mdash;</td>
                <td className="px-3 py-3 text-pm-white-subtle">
                  <span className="text-pm-white font-semibold">Sprint 34, Phase B &middot; 2026-06-16.</span> operator&rarr;agent gRPC hardened with mutual TLS (fail-closed &mdash; no TLS material means the operator refuses to start, never falls back to plaintext), per-RPC SPIFFE-identity authorization, 512&nbsp;MiB gRPC size caps, signed checkpoint manifests verified before extraction, wire-hash transfer integrity, and migration_uid socket-state anti-replay. 8/8 GC-B; full live-migration regression (GC-B7) ran to Phase=Complete with the complete security stack active and an in-memory counter restored intact; all 22/22 Phase A cold-path assertions continue to pass &mdash; zero regression. ADR-SEC-A through ADR-SEC-D.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Badge row */}
        <div className="flex flex-wrap justify-center gap-3">
          <BadgeChip>Apache-2.0</BadgeChip>
          <BadgeChip>CRIU 4.2</BadgeChip>
          <BadgeChip>KEP-2008 aligned</BadgeChip>
          <span className="relative group">
            <BadgeChip>CNCF-track*</BadgeChip>
            <span
              title="PodMotion is not a CNCF project. 'CNCF-track' describes our intended trajectory only — we are targeting CNCF sandbox submission, gated on ≥2 maintainers from ≥2 organizations. See GOVERNANCE.md."
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-pm-navy-800 border border-pm-navy-600 text-pm-white-muted text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
            >
              PodMotion is not a CNCF project. &lsquo;CNCF-track&rsquo; describes our intended trajectory only &mdash; we are targeting CNCF sandbox submission, gated on &ge;2 maintainers from &ge;2 organizations. See GOVERNANCE.md.
            </span>
          </span>
        </div>

        {/* CNCF footnote */}
        <p className="text-pm-white-subtle text-xs text-center -mt-4">
          * Not yet a CNCF project &mdash; CNCF sandbox submission planned (target Q3 2026 &middot; M29).
        </p>

        {/* Caveat */}
        <p className="text-pm-white-subtle text-sm text-center max-w-xl">
          Pre-1.0. Single-cluster. arm64 validated (NS#4, Sprint 30). amd64 cold migration proven (Sprint 31, NP-AMD64-BASELINE; Sprint 32, cold-path CRIU restore baseline). Strict-mode TCP preservation first proven at Sprint 46 — a single held connection survived migration byte-exact (seq_delta 0/0) on a real multi-node cluster (no CNI or architecture recorded in the committed proof); broader multi-flow and per-CNI validation is still ahead.
        </p>

        {/* Security disclosure — node-root agent posture (SITE-ADR-001) */}
        <p className="text-pm-white-subtle text-xs text-center max-w-2xl border-t border-pm-navy-600 pt-4">
          Security note: installing the node-agent grants node-root-equivalent privilege (privileged container + read-write containerd socket + SYS_ADMIN/SYS_PTRACE in the host PID namespace). This is a disclosed alpha trade-off required for CRIU checkpoint/restore &mdash; full posture and the ADR-0148 hardening plan at the{" "}
          <a href="#security-posture" className="underline hover:text-pm-white transition-colors">Security section</a>.
        </p>

      </div>
    </section>
  );
}

export default ProofStrip;

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

        {/* Honest top-level summary — workload coverage and long-term durability goal */}
        <p className="text-pm-white-subtle text-sm text-center max-w-2xl">
          Across proof runs so far, we&rsquo;ve achieved live migration on Postgres, Redis, and Nginx workloads in some cases — not yet consistently across all cases — and we&rsquo;re working toward a long-term goal of eight-nines (99.999999%) durability for live transfers. See the matrix below for exactly what&rsquo;s proven where.
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
          <MetricChip>0 RST</MetricChip>
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
                <td className="px-3 py-3 text-pm-white-subtle">Multi-node cluster, worker node A&nbsp;&rarr;&nbsp;worker node B.</td>
                <td className="px-3 py-3 text-pm-white-subtle">Redis &mdash; single held TCP connection under load</td>
                <td className="px-3 py-3 text-pm-white font-mono">Strict</td>
                <td className="px-3 py-3 text-pm-white-subtle">
                  <span className="text-pm-white font-semibold">Proven byte-exact &mdash; Sprint 46.</span> 1/1 connections verified byte-exact (seq_delta 0/0), freeze 602ms. A single documented run, not a statistical corpus &mdash; the broader multi-flow bar is still ahead. Source pod never deleted before TrafficVerified. See docs/proof/sprint46-proof.md.
                </td>
              </tr>
              <tr className="border-b border-pm-navy-700">
                <td className="px-3 py-3 text-pm-white-subtle">Same multi-node cluster, worker node A&nbsp;&rarr;&nbsp;worker node B.</td>
                <td className="px-3 py-3 text-pm-white-subtle">Postgres &mdash; continuous write load, ReadWriteMany re-attach</td>
                <td className="px-3 py-3 text-pm-white font-mono">None</td>
                <td className="px-3 py-3 text-pm-white-subtle">
                  <span className="text-pm-white font-semibold">Proven &mdash; Sprint 46.</span> Shared ReadWriteMany volume re-attached on the destination; row counter advanced 8&nbsp;&rarr;&nbsp;16 with 0 write errors. Exercises ReadWriteMany re-attach only &mdash; does not exercise or imply live block-storage migration, which remains deferred to v1.2. See docs/proof/sprint46-proof.md.
                </td>
              </tr>
              <tr className="border-b border-pm-navy-700">
                <td className="px-3 py-3 text-pm-white-subtle">AWS EC2, kubeadm cluster (3 nodes), Longhorn CSI on all nodes.</td>
                <td className="px-3 py-3 text-pm-white-subtle">Postgres on a Longhorn-backed PVC &mdash; a written value read back post-migration</td>
                <td className="px-3 py-3 text-pm-white font-mono">None</td>
                <td className="px-3 py-3 text-pm-white-subtle">
                  <span className="text-pm-white font-semibold">Proven in a live run &mdash; AWS EC2 substrate.</span> Migration reached phase=Complete; a value written before the move was read back unchanged after. A single verified in-run result, not a committed proof doc &mdash; implies no GA availability, and doesn't extend to the Ceph RBD or snapshot-rsync tiers, which remain unexercised stubs. See docs/proof/milestone-aws-ec2-longhorn-postgres-migration-proof.md.
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
                <td className="px-3 py-3 text-pm-white-subtle">Single-host two-node kind cluster (worker&nbsp;&rarr;&nbsp;control-plane) &mdash; kindnet CNI (host-routed, no VXLAN overlay), amd64 / Ubuntu 24.04 / kernel 6.17</td>
                <td className="px-3 py-3 text-pm-white-subtle">Redis</td>
                <td className="px-3 py-3 text-pm-white font-mono">Cold (None)</td>
                <td className="px-3 py-3 text-pm-white-subtle">
                  <span className="text-pm-white font-semibold">Sprint 31, NP-AMD64-BASELINE &middot; 2026-06-15.</span> amd64 cold migration proven (tcpPreservationMode=None). 22/22 gates, freeze=199ms, source pod deleted post-TrafficVerified.
                </td>
              </tr>
              <tr className="border-b border-pm-navy-700">
                <td className="px-3 py-3 text-pm-white-subtle">Single-host two-node kind cluster &mdash; kindnet CNI (host-routed, no VXLAN overlay), amd64 / kernel 6.17 / containerd 1.7.24 / Kubernetes v1.32.0</td>
                <td className="px-3 py-3 text-pm-white-subtle">redis:7-alpine</td>
                <td className="px-3 py-3 text-pm-white font-mono">Cold</td>
                <td className="px-3 py-3 text-pm-white-subtle">
                  <span className="text-pm-white font-semibold">Sprint 33 &middot; 2026-06-16.</span> End-to-end cold-path live migration, n=1, ~13s wall-clock, 22/22 gates. Phase=Complete, TrafficVerified=True reached before the source pod was deleted. Cold-path scope only &mdash; zero-TCP-sequence-delta (seq_delta) is NOT claimed here.
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
          <BadgeChip>Experimental project</BadgeChip>
        </div>

        {/* Caveat */}
        <p className="text-pm-white-subtle text-sm text-center max-w-xl">
          Pre-1.0. Single-cluster. arm64 validated (earlier PoC, Sprint 30). amd64 cold migration proven (Sprint 31, NP-AMD64-BASELINE; Sprint 32, cold-path CRIU restore baseline). Strict-mode TCP preservation first proven at Sprint 46 — a single held connection survived migration byte-exact (seq_delta 0/0) on a real multi-node cluster (no CNI or architecture recorded in the committed proof); broader multi-flow and per-CNI validation is still ahead.
        </p>

        {/* Security disclosure — node-root agent posture (SITE-ADR-001) */}
        <p className="text-pm-white-subtle text-xs text-center max-w-2xl border-t border-pm-navy-600 pt-4">
          Security note: installing the node-agent grants node-root-equivalent privilege (privileged container + read-write containerd socket + SYS_ADMIN/SYS_PTRACE in the host PID namespace). This is a disclosed alpha trade-off required for CRIU checkpoint/restore &mdash; full posture and the ADR-0148 hardening plan in the{" "}
          <a
            href="https://github.com/podmotion-io/podmotion/blob/main/SECURITY.md"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-pm-white transition-colors"
          >
            security policy
          </a>.
        </p>

      </div>
    </section>
  );
}

export default ProofStrip;

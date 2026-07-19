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
      aria-label="NS#4, Sprint 30, Sprint 31, Sprint 32, Sprint 33, Sprint 34, and Sprint 46 proof results"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">

        {/* Shared scope line — each badge carries its own platform caveat */}
        <p className="text-pm-white-subtle text-xs text-center font-mono tracking-wide uppercase">
          kind-cluster proofs: single-host two-node kind cluster (Docker containers) &mdash; historical arm64 / Ubuntu 24.04 / kernel 6.8 / Flannel VXLAN (NS#4, Sprint 30) &middot; amd64 / kernel 6.17 / kindnet host-routed, no VXLAN overlay (Sprint 31, Sprint 32, Sprint 33, Sprint 34) &middot; Sprint 46: a real multi-node cluster (nodes pm-w1, pm-w2) &mdash; the committed proof doc records no CNI and no architecture
        </p>

        {/* NS#4 ProofBadge */}
        <div className="flex items-center justify-center text-center">
          <CheckIcon />
          <p className="text-xl sm:text-2xl font-semibold text-pm-white leading-snug">
            NS#4 &mdash; Proven on live PostgreSQL&nbsp;&middot;&nbsp;0 failed transactions observed (pgbench proof corpus)&nbsp;&middot;&nbsp;10/10 runs&nbsp;&middot;&nbsp;8 connections
          </p>
        </div>

        {/* NS#4 caveat */}
        <p className="text-pm-white-subtle text-xs text-center max-w-xl -mt-4">
          NS#4: 10 proof runs, 8 pgbench connections, failed_transactions=0. Topology: single-host two-node kind cluster (pm-control + pm-worker Docker containers), inter-node path via Flannel VXLAN overlay on one physical machine. arm64 / Ubuntu 24.04 / kernel 6.8.
        </p>

        {/* Metrics row */}
        <div className="flex flex-wrap justify-center gap-3">
          <MetricChip
            title="Strict-mode held-TCP survival with zero TCP sequence delta was first proven end-to-end at Sprint 46: a single held connection survived a pm-w1 -> pm-w2 migration byte-exact (1/1 connections byte-exact, seq_delta 0/0, freeze 602ms) on a real multi-node cluster. The committed proof doc records no CNI, no architecture, and no run count. The broader bar — many concurrent flows, multi-container, statistical repeatability across declared CNIs — is still ahead. See docs/proof/sprint46-proof.md."
          >
            seq_delta=0&nbsp;(held&nbsp;TCP):&nbsp;first&nbsp;proven&nbsp;Sprint&nbsp;46&nbsp;&mdash;&nbsp;single&nbsp;connection&nbsp;&middot;&nbsp;full&nbsp;multi-flow&nbsp;bar&nbsp;still&nbsp;ahead
          </MetricChip>
          <MetricChip>freeze p50 312&thinsp;ms&thinsp;/&thinsp;p99 487&thinsp;ms&thinsp;(n=10)</MetricChip>
          <MetricChip>0 RST</MetricChip>
          <MetricChip>kernel 6.8&nbsp;&middot;&nbsp;no patches</MetricChip>
        </div>

        {/* Sprint 30 — Redis active-write ProofBadge */}
        <div className="flex items-center justify-center text-center">
          <CheckIcon />
          <p className="text-xl sm:text-2xl font-semibold text-pm-white leading-snug">
            Sprint 30 &mdash; Redis active-write (historical arm64 PoC):&nbsp;18/18 ACs PASS&nbsp;&middot;&nbsp;next goal (Phase C) seq_delta=0 not yet proven end-to-end&nbsp;&middot;&nbsp;2026-06-13
          </p>
        </div>

        {/* Sprint 30 scope caveat */}
        <p className="text-pm-white-subtle text-xs text-center max-w-xl -mt-4">
          Sprint 30 Redis: n=1, single migration, single connection, client on host (not in pod). Not weighted at parity with the NS#4 10-run statistical corpus. Topology: single-host two-node kind cluster, inter-node path via Flannel VXLAN overlay on one physical machine. arm64 / Ubuntu 24.04 / kernel 6.8.
        </p>

        {/* Sprint 31 — NP-AMD64-BASELINE ProofBadge */}
        <div className="flex items-center justify-center text-center">
          <CheckIcon />
          <p className="text-xl sm:text-2xl font-semibold text-pm-white leading-snug">
            Sprint 31 &mdash; NP-AMD64-BASELINE:&nbsp;amd64 cold migration proven&nbsp;&middot;&nbsp;Redis key survived&nbsp;&middot;&nbsp;22/22 gates&nbsp;&middot;&nbsp;2026-06-15
          </p>
        </div>

        {/* Sprint 31 scope caveat */}
        <p className="text-pm-white-subtle text-xs text-center max-w-xl -mt-4">
          Sprint 31: cold migration (tcpPreservationMode=None), n=1, Redis workload, freeze=199ms, redis key pm-sprint31-key present in replacement pod, source pod deleted post-TrafficVerified, EndpointSliceCleanupVerified. Topology: single-host two-node kind cluster (worker→control-plane migration), kindnet CNI (host-routed, no VXLAN overlay) on one physical machine. amd64 / Ubuntu 24.04 / kernel 6.17. Note: kernel 6.17 is correct for this host — NS#4 and Sprint 30 used a separate arm64 host at kernel 6.8 with Flannel VXLAN.
        </p>

        {/* Sprint 32 — Cold-path CRIU restore baseline ProofBadge */}
        <div className="flex items-center justify-center text-center">
          <CheckIcon />
          <p className="text-xl sm:text-2xl font-semibold text-pm-white leading-snug">
            Sprint 32 &mdash; Cold-path CRIU restore baseline:&nbsp;CRIU &ldquo;Restore finished successfully&rdquo;&nbsp;&middot;&nbsp;21/22 gates&nbsp;&middot;&nbsp;2026-06-16
          </p>
        </div>

        {/* Sprint 32 scope caveat */}
        <p className="text-pm-white-subtle text-xs text-center max-w-xl -mt-4">
          Sprint 32 (n=1, single end-to-end run): cold-path pod migration, worker&nbsp;&rarr;&nbsp;control-plane, no PVCs, BestEffort TCP. 21/22 gate criteria PASS. CRIU restore completed with &ldquo;Restore finished successfully&rdquo;; restored PID moved into destination pod cgroup with file descriptors intact; source pod intact throughout, never deleted before TrafficVerified (ADR-0012). GC-21 (destination pod Kubernetes Running phase) is expected fail — iptables-restore post-resume fails in kind network namespaces, a pre-existing kind substrate behavior scoped out per ADR-0166. Gate close commit: 8c16993. Topology: single-host two-node kind cluster, amd64 / Ubuntu 24.04 / CRIU 4.2 / kernel 6.17 / kindnet CNI (host-routed, no VXLAN overlay).
        </p>

        {/* Sprint 33 — End-to-end cold-path live migration ProofBadge */}
        <div className="flex items-center justify-center text-center">
          <CheckIcon />
          <p className="text-xl sm:text-2xl font-semibold text-pm-white leading-snug">
            Sprint 33 &mdash; End-to-end cold-path live migration:&nbsp;redis:7-alpine worker&nbsp;&rarr;&nbsp;control-plane&nbsp;&middot;&nbsp;~13s wall-clock&nbsp;&middot;&nbsp;22/22 gate&nbsp;&middot;&nbsp;2026-06-16
          </p>
        </div>

        {/* Sprint 33 scope caveat */}
        <p className="text-pm-white-subtle text-xs text-center max-w-xl -mt-4">
          Sprint 33: cold-path migration in BestEffort transfer mode, n=1, redis:7-alpine checkpointed on worker and restored on control-plane. Phase=Complete, TrafficVerified=True reached BEFORE the source pod was deleted; restored Redis answered PING with PONG. Cold-path scope only &mdash; the cold-path mechanism is proven end-to-end; zero-TCP-sequence-delta (seq_delta) is NOT claimed here. Topology: single-host two-node kind cluster, kindnet CNI (host-routed, no VXLAN overlay) / amd64 / kernel 6.17 / containerd 1.7.24 / Kubernetes v1.32.0.
        </p>

        {/* Sprint 34 — gRPC control-plane security hardening ProofBadge */}
        <div className="flex items-center justify-center text-center">
          <CheckIcon />
          <p className="text-xl sm:text-2xl font-semibold text-pm-white leading-snug">
            Sprint 34 &mdash; gRPC control-plane security hardening:&nbsp;mTLS fail-closed&nbsp;&middot;&nbsp;SPIFFE per-RPC authz&nbsp;&middot;&nbsp;signed checkpoints&nbsp;&middot;&nbsp;anti-replay&nbsp;&middot;&nbsp;8/8 GC-B&nbsp;&middot;&nbsp;2026-06-16
          </p>
        </div>

        {/* Sprint 34 scope caveat */}
        <p className="text-pm-white-subtle text-xs text-center max-w-xl -mt-4">
          Sprint 34 Phase B: operator&rarr;agent gRPC hardened with mutual TLS (fail-closed &mdash; no TLS material means the operator refuses to start, never falls back to plaintext), per-RPC SPIFFE-identity authorization, 512&nbsp;MiB gRPC size caps, signed checkpoint manifests verified before extraction, wire-hash transfer integrity, and migration_uid socket-state anti-replay. Full live-migration regression (GC-B7) ran to Phase=Complete with the complete security stack active and an in-memory counter restored intact; all 22/22 Phase A cold-path assertions continue to pass &mdash; zero regression. Same cluster as the Sprint 33 cold-path proof. ADR-SEC-A through ADR-SEC-D.
        </p>

        {/* Sprint 46 — Redis held TCP connection survives migration ProofBadge */}
        <div className="flex items-center justify-center text-center">
          <CheckIcon />
          <p className="text-xl sm:text-2xl font-semibold text-pm-white leading-snug">
            Sprint 46 &mdash; Redis held TCP connection under load survived migration byte-exact:&nbsp;pm-w1&nbsp;&rarr;&nbsp;pm-w2 to phase=Complete&nbsp;&middot;&nbsp;1/1 connections byte-exact (seq_delta 0/0)&nbsp;&middot;&nbsp;freeze 602ms&nbsp;&middot;&nbsp;elapsed 33s
          </p>
        </div>

        {/* Sprint 46 Redis scope caveat */}
        <p className="text-pm-white-subtle text-xs text-center max-w-xl -mt-4">
          Sprint 46 (Strict TCP preservation, single held connection under load): a Redis workload migrated pm-w1&nbsp;&rarr;&nbsp;pm-w2, PodMigration phase=Complete, and the established TCP connection survived with 1/1 connections verified byte-exact (seq_delta 0/0), freeze 602ms, elapsed 33s, OVERALL_RESULT=PASS. This is the first evidence a live TCP connection survives a PodMotion migration byte-exact. Scope: a real multi-node cluster (nodes pm-w1, pm-w2); the committed proof doc records no CNI, no architecture, and no run count &mdash; a single documented end-to-end run, not a statistical corpus. Source pod never deleted before TrafficVerified. See docs/proof/sprint46-proof.md.
        </p>

        {/* Sprint 46 — Postgres write-load ReadWriteMany re-attach ProofBadge */}
        <div className="flex items-center justify-center text-center">
          <CheckIcon />
          <p className="text-xl sm:text-2xl font-semibold text-pm-white leading-snug">
            Sprint 46 &mdash; Postgres under continuous write load migrated pm-w1&nbsp;&rarr;&nbsp;pm-w2 to phase=Complete&nbsp;&middot;&nbsp;0 post-migration write errors&nbsp;&middot;&nbsp;row counter 8&nbsp;&rarr;&nbsp;16&nbsp;&middot;&nbsp;freeze 766ms&nbsp;&middot;&nbsp;elapsed 43s
          </p>
        </div>

        {/* Sprint 46 Postgres scope caveat */}
        <p className="text-pm-white-subtle text-xs text-center max-w-xl -mt-4">
          Sprint 46 (single migration): a Postgres workload under continuous write load on ReadWriteMany storage migrated pm-w1&nbsp;&rarr;&nbsp;pm-w2 to phase=Complete; the shared ReadWriteMany volume re-attached on the destination node, the row counter advanced 8&nbsp;&rarr;&nbsp;16 with 0 post-migration write errors, freeze 766ms, elapsed 43s, OVERALL_RESULT=PASS. This exercises ReadWriteMany re-attach only (tcpPreservationMode None) &mdash; it does not exercise or imply live block-storage migration, which remains deferred to v1.2. Same real multi-node cluster (pm-w1, pm-w2); no CNI, architecture, or run count recorded. See docs/proof/sprint46-proof.md.
        </p>

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
          Pre-1.0. Single-cluster. arm64 validated (NS#4, Sprint 30). amd64 cold migration proven (Sprint 31, NP-AMD64-BASELINE; Sprint 32, cold-path CRIU restore baseline). Strict-mode TCP preservation first proven at Sprint 46 — a single held connection survived migration byte-exact (seq_delta 0/0) on a real multi-node cluster (no CNI or architecture recorded in the committed proof); broader multi-flow and per-CNI validation is still ahead — see roadmap.
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

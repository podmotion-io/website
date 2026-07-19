import React from 'react';

type Tier = 'shipped' | 'in-progress' | 'planned' | 'future';

interface Milestone {
  id: string;
  tier: Tier;
  title: string;
  theme: string;
  gate?: string;
  size?: string;
  progress?: string;
  flag?: string;
}

const TIER_TONE: Record<Tier, {
  rail: string; dot: string; chipBg: string; chipText: string; chipRing: string; label: string;
}> = {
  shipped: {
    rail: 'border-l-emerald-400',
    dot: 'bg-emerald-400',
    chipBg: 'bg-emerald-500/10', chipText: 'text-emerald-300', chipRing: 'ring-emerald-500/30',
    label: 'Shipped',
  },
  'in-progress': {
    rail: 'border-l-pm-cyan-500',
    dot: 'bg-pm-cyan-400',
    chipBg: 'bg-pm-cyan-500/10', chipText: 'text-pm-cyan-300', chipRing: 'ring-pm-cyan-500/30',
    label: 'In progress',
  },
  planned: {
    rail: 'border-l-indigo-400',
    dot: 'bg-indigo-400',
    chipBg: 'bg-indigo-500/10', chipText: 'text-indigo-300', chipRing: 'ring-indigo-500/30',
    label: 'Planned',
  },
  future: {
    rail: 'border-l-slate-500',
    dot: 'bg-slate-500',
    chipBg: 'bg-slate-500/10', chipText: 'text-slate-300', chipRing: 'ring-slate-500/30',
    label: 'Future',
  },
};

const milestones: Milestone[] = [
  // ── SHIPPED ────────────────────────────────────────────────
  {
    id: 'M1–M18',
    tier: 'shipped',
    title: 'Foundation: cold + iterative-pre-copy migration, all storage tiers, the full operator',
    theme:
      '5 CRDs and a 12-phase migration state machine; CRIU dump/restore; iterative pre-copy dirty-page sync; four-tier live storage cutover (deferred to v1.2); eBPF zero-window hold and TCP_REPAIR; scheduler/descheduler plugins; AWS ALB/NLB integration; controller-manager hardened security context (runAsNonRoot, RuntimeDefault seccomp, readOnlyRootFilesystem, drop ALL); observability; and post-copy lazy-pages. Released as v0.1.0-alpha (2026-06-09). OperatorHub (OLM bundle) is NOT included in v0.1.0-alpha — planned separately (see M18-OLM below).',
    gate: 'nginx HTTP 200, Redis key persistence, PostgreSQL row integrity across nodes; cold path E2E green.',
  },
  {
    id: 'S32',
    tier: 'shipped',
    title: 'Sprint 32 — cold-path live pod migration baseline (CRIU checkpoint/restore)',
    theme:
      'CRIU 4.2 checkpoint/restore of a running pod on the amd64/Flannel-CNI substrate (n=1, first successful cold-path baseline): CRIU restore completed successfully (restore.log: Restore finished successfully), the restored process was correctly re-cgrouped on the destination node with its file descriptors intact, and the source pod remained intact until TrafficVerified, never deleted before TrafficVerified (ADR-0012). Topology: two-node kind cluster, amd64 / Ubuntu 24.04 / CRIU 4.2 / kernel 6.17 / Flannel CNI, containerd NRI plugin (60s plugin_request_timeout). Baseline only — multi-run repeatability, alternate CNIs (Calico / Cilium), ARM64, and non-kind clusters are NOT yet validated and are upcoming work.',
    gate: '21/22 gate criteria PASS — see docs/proof/sprint32-proof.md (gate close commit 8c16993).',
    flag: 'GC-21 (destination pod Kubernetes Running phase) is an expected fail per ADR-0166: pre-existing kind-netns iptables-restore behavior, out of scope. n=1.',
  },
  {
    id: 'S33',
    tier: 'shipped',
    title: 'Sprint 33 — cold-path end-to-end live migration (authoritative proof)',
    theme:
      'A running, stateful redis:7-alpine pod migrated across nodes on stock upstream Kubernetes v1.32, restored functional and running in about 13 seconds, with an in-memory counter (gcb7:counter=42) restored intact. BestEffort transfer mode (tcpPreservationMode default None). Proof substrate of record: kind profile podmotion-s33-cold / 2 nodes / amd64 / Linux 6.17 / containerd 1.7.24 / Kubernetes v1.32.0 / CNI kindnet (host-routed, no VXLAN overlay).',
    gate: '22/22 Phase A migration assertions pass; TrafficVerified=True before source pod deletion (ADR-0012) — see docs/proof/sprint33-proof.md.',
    flag: 'The Sprint 33 cold-path proof verifies L3/L4 IP reachability after restore, not survival of an established TCP connection. Live TCP-connection survival (seq_delta=0, Strict mode) was first proven separately at Sprint 46 (see S46) — for a single held connection on a real multi-node cluster; the full multi-flow guarantee is still ahead.',
  },
  {
    id: 'S34',
    tier: 'shipped',
    title: 'Sprint 34 — gRPC control-plane security hardening (zero migration regression)',
    theme:
      'Security hardening of the gRPC control plane on the same amd64 / Linux 6.17 / kindnet cluster: mTLS fail-closed, per-RPC SPIFFE authz, gRPC size caps (512 MiB) plus decompression cap (2 GiB), signed checkpoint manifests verified before extract, transfer-integrity wire-hash, and socket anti-replay bound to migration_uid.',
    gate: '8/8 security gate criteria (GC-B1–GC-B8) pass with all 22 Phase A migration assertions still passing — see docs/proof/sprint34-proof.md.',
  },
  {
    id: 'S46',
    tier: 'shipped',
    title: 'Sprint 46 — a held TCP connection survives migration byte-exact (first Strict-mode proof)',
    theme:
      'On a real multi-node cluster (two worker nodes), a Redis workload holding a live TCP connection under load migrated worker node A → worker node B to PodMigration phase=Complete with the established connection preserved byte-exact — 1/1 connections verified byte-exact, seq_delta 0/0, freeze 602ms, elapsed 33s. A companion Postgres workload under continuous write load on ReadWriteMany storage migrated to phase=Complete with the shared volume re-attaching on the destination node, the row counter advancing 8 → 16, 0 post-migration write errors, freeze 766ms. This is the first evidence a live TCP connection survives a PodMotion migration byte-exact. The committed proof doc records no CNI, no architecture, and no run count — each result is a single documented end-to-end run, not a statistical corpus; the Postgres path exercises ReadWriteMany re-attach only and does not imply live block-storage migration (deferred to v1.2). Source pod never deleted before TrafficVerified (ADR-0012).',
    gate: 'Redis held-connection (R7/R8) and Postgres write-load (R9) OVERALL_RESULT=PASS — see docs/proof/sprint46-proof.md.',
    flag: 'Single documented run per workload on a cluster whose CNI/architecture the proof doc does not record — not yet the multi-flow, multi-container, statistically repeatable beta-gate bar. Sprints 47–50 have no committed proof at HEAD and are not shown as proven results.',
  },

  // ── IN PROGRESS ────────────────────────────────────────────
  {
    id: 'M19',
    tier: 'in-progress',
    title: 'GitOps-aware migration',
    theme:
      'Migrate below the controller layer with zero spec mutation — Argo CD and Flux see no drift. Admission-webhook label injection, scheduler MAX-score routing, NRI restore hook, and self-protecting PodMigration resources (ADR-0046).',
    gate: 'Migration completes with Argo CD / Flux reconciliation paused for the freeze window only, then resumed — no drift alert.',
  },

  // ── PLANNED (v1.0-gate track, M20–M27) ────────────────────
  {
    id: 'M18-OLM',
    tier: 'planned',
    title: 'OperatorHub (OLM bundle) — not available in v0.1.0-alpha',
    theme:
      'Package PodMotion as an OLM bundle and publish to OperatorHub. Not shipped in v0.1.0-alpha; install via Helm or kubectl apply (see Getting Started). This milestone is planned and has not yet been executed.',
    gate: 'OLM bundle published to OperatorHub; `kubectl get csv` reports Succeeded.',
    flag: 'Not available in v0.1.0-alpha — planned, not yet executed.',
  },
  {
    id: 'M22',
    tier: 'planned',
    title: 'Multi-container consistent checkpoint — the "every container" half',
    theme:
      'Consistent freeze/dump/restore ordering across ALL containers in a pod — app, service-mesh sidecar (Envoy/Istio), and log shipper — with shared-namespace coupling preserved. The single largest currently-unproven capability and the highest-risk milestone. Kicks off external security-audit procurement.',
    gate:
      'A 3-container pod with a real service-mesh sidecar migrates across nodes; every container reports zero internal disruption and seq_delta=0 on its own connections; reproduced 10× clean.',
    size: 'L',
    progress: '→ ~45%',
    flag: 'Tier-0 prerequisite: the v1.0 gate is INVALID unless M22 AND M23 have both landed.',
  },
  {
    id: 'M23',
    tier: 'planned',
    title: 'Conntrack/NAT state migration + N-flow transparency — the "every client" half',
    theme:
      'Migrate kernel conntrack/NAT state on both nodes so Service-routed traffic (ClusterIP/NodePort, iptables + IPVS) survives — overlay seq-preservation alone does NOT survive the kernel conntrack path. Integrates storage cutover into the freeze window, preserving open fd/offset/inode and advisory-lock state.',
    gate:
      'seq_delta=0, zero RST, zero reconnect for ≥100 concurrent Service-routed flows under load across a live migration, with storage fd/lock state preserved.',
    size: 'L',
    progress: '→ ~65%',
    flag: 'Tier-0 prerequisite: pairs with M22 to gate every v1.0-gate run.',
  },
  {
    id: 'M24',
    tier: 'planned',
    title: 'CNI matrix to production + LB connection tracking',
    theme:
      'Per-CNI transparency parity — each CNI independently re-proves N-flow seq preservation and conntrack migration (there is no CNI-generic transparency). Without Cilium the transparency guarantee is false for a large share of production; this is realistically a multi-quarter epic.',
    gate:
      'seq_delta=0 multi-container migration green on Calico VXLAN, Cilium eBPF, and Flannel VXLAN independently, plus one external-LB (ALB or NLB) north-south flow surviving migration.',
    size: 'XL',
    progress: '→ ~80%',
  },
  {
    id: 'M25',
    tier: 'planned',
    title: 'IPv6 + encrypted-overlay transparency',
    theme:
      'AF_INET6 FDB/neighbor injection for dual-stack and v6-only clients, plus WireGuard/IPSec encrypted-overlay VTEP discovery — completing "all clients" across IP families and encryption (ADR-0048 / ADR-0057). WireGuard/encrypted-overlay gate has NOT been executed: operator was never deployed into a WireGuard cluster; all runs timed out empty; seq_delta N/A. IPv6 and encrypted-overlay transparency are not proven and must not be implied.',
    gate:
      'seq_delta=0 live migration proven for an IPv6 client AND for a WireGuard-encrypted overlay cluster. Gate status: FAILED — operator never deployed; runs timed out empty; seq_delta N/A.',
    size: 'XL',
    flag: 'GATE FAILED: WireGuard/encrypted-overlay gate was not executed — operator never deployed into a WireGuard cluster; all runs timed out empty; seq_delta N/A. IPv6 and encrypted-overlay do not carry over from the Flannel VXLAN proof. Scope also unresolved: v1.0-gate-blocking vs post-v1.0 epic — flagged for review.',
  },
  {
    id: 'M20',
    tier: 'planned',
    title: 'Istio service-mesh certification',
    theme:
      'Sidecar-mode multi-process checkpoint (istio-proxy + pilot-agent + app), iptables-redirect preservation, SPIFFE SVID continuity, Envoy xDS reconnect gate, and ambient/ztunnel mode with PeerAuthentication STRICT.',
    gate: 'EnvoyXdsSynced and SVID continuity hold across migration; STRICT mTLS mesh unaffected.',
  },
  {
    id: 'M21',
    tier: 'planned',
    title: 'Automated certification matrix + agentic version validation',
    theme:
      'A tiered certification-matrix config, a GitHub Actions version-watcher, and an automated testing pipeline (≥2/3 runs PASS per matrix row) with cosign-signed signoff and a make beta-gate target.',
    gate: 'make beta-gate passes; all Tier-1 matrix entries signed off within 30 days.',
  },
  {
    id: 'M26',
    tier: 'planned',
    title: 'Observability + scheduler/descheduler E2E + deterministic CI matrix',
    theme:
      'Per-migration seq_delta, flow-loss, blackout-duration, and per-container consistency metrics; an unattended scheduler/descheduler-driven multi-migration run. No new raw capability — this makes the guarantee provable and self-driving.',
    gate:
      'Observability stack emits the per-migration metrics; scheduler/descheduler drives an unattended multi-migration run clean.',
    size: 'L',
    progress: '→ ~90%',
  },
  {
    id: 'M27',
    tier: 'planned',
    title: 'First true-v1.0-gate AWS run + chaos gate',
    theme:
      'First randomized AWS run (EKS + self-managed EC2) against the real workload set — multi-container + service-mesh sidecar + Service-routed + dual-stack — exercising all 8 beta-gate workload types with fault injection.',
    gate:
      'One full randomized AWS gate run completes against the multi-container + Service + dual-stack workload set with zero unexplained failures.',
    size: 'M',
    progress: '→ ~92%',
  },

  // ── PLANNED (security hardening track) ────────────────────
  {
    id: 'SEC-1',
    tier: 'planned',
    title: 'Agent privilege containment',
    theme:
      'CISOs evaluating the full security posture — including what is implemented today vs. what is accepted but not yet shipped — should see the #security-posture section for the complete honest snapshot. Trace-derived custom seccomp profile (SCMP_ACT_ERRNO deny-by-default), capability drop to the minimal CRIU set, read-only containerd socket in steady-state, and hostPID:false default flip gated on validation across 8 beta workloads. ADR-0148 Accepted (2026-06-14), unimplemented; supersedes the REJECTED ADR-0106.',
    flag: 'Accepted (2026-06-14), not yet implemented (ADR-0148).',
  },
  {
    id: 'SEC-2',
    tier: 'planned',
    title: 'Checkpoint encryption at rest and in flight',
    theme:
      'In-flight AES-256-GCM via a CheckpointCrypto provider interface — none/aes-gcm/aws-kms/gcp-kms/azure-kms/vault — so plaintext never touches disk. ADR-0160 Draft. Today checkpoints are PLAINTEXT on tmpfs; the encryption code path is a passthrough stub, not wired into the CRIU writer.',
    flag: 'Draft (ADR-0160). Today checkpoints are plaintext — encryption is NOT implemented.',
  },
  {
    id: 'SEC-3',
    tier: 'planned',
    title: 'Admission-webhook + agent TLS lifecycle',
    theme:
      'cert-manager-issued webhook TLS and gRPC mTLS enforcement (ADR-0159 Draft / ADR-0079 Accepted). webhook.certManager.enabled defaults true but the chart ships no Certificate/Issuer, so a vanilla install crashloops (ADR-0159 Draft); all webhooks use failurePolicy: Fail (Ignore prohibited, ADR-0079 Accepted). gRPC mTLS currently fails open.',
    flag: 'Draft (ADR-0159). webhook.certManager.enabled defaults true but no Certificate/Issuer is shipped — vanilla install crashloops. mTLS currently fails open.',
  },
  {
    id: 'SEC-4',
    tier: 'planned',
    title: 'Supply-chain + RBAC + compliance baseline',
    theme:
      'cosign image signing, SBOM, default least-privilege ClusterRoles in the Helm chart, structured per-migration audit log, CNCF Security TAG self-assessment, and an optional FIPS-validated crypto build (ADR-0077 (supersedes ADR-0103)/0078/0161). Compliance horizon (ADR-0161 Draft, post-beta planning, none implemented): CNCF Security TAG self-assessment and default RBAC pre-GA; SOC 2 Type II and ISO 27001 readiness GA+3-6mo; HIPAA/PCI DSS alignment GA+12mo; FedRAMP Moderate with FIPS-140-2 build path GA+18mo (ADR-0161 C6).',
    flag: 'Pre-GA roadmap (ADR-0161 Draft). No default RBAC, no SBOM/signing, no audit log shipped today.',
  },

  // ── FUTURE (gate, launch, v1.0) ────────────────────────────
  {
    id: 'M28',
    tier: 'future',
    title: 'Beta gate — 80 runs, zero errors, zero warnings',
    theme:
      'Converts "demonstrated" into a statistically defensible guarantee: 80 consecutive randomized runs against the full workload matrix on amd64, with zero errors and zero warnings.',
    gate:
      '80 consecutive randomized runs, zero errors, zero warnings, against the full workload matrix on amd64.',
    size: 'L',
    progress: '→ ~95% (amd64)',
  },
  {
    id: 'M29',
    tier: 'future',
    title: 'CNCF sandbox + external security audit + public launch',
    theme:
      'Public v0.1.0 release with a clean external audit and a credibility demo (live seq_delta=0 tcpdump + sidecar migration). Gated on supply-chain, DCO, vendor-neutrality, and trademark ADRs being accepted (ADR-0077/0090/0091/0092).',
    gate:
      'CNCF sandbox application submitted with a clean external audit and the credibility demo published — filed only once ≥2 maintainers from ≥2 orgs exist.',
    size: 'M',
    flag: 'Structurally non-solo: requires a second maintainer before submission. Target Q3 2026, gated on ≥2 maintainers from ≥2 orgs. Current maintainers: 1 (Chad N. Ingle).',
  },
  {
    id: 'M30',
    tier: 'future',
    title: 'API stabilization + v1.0 matrix freeze',
    theme:
      'Freeze the API v1alpha1 → v1beta1 → v1 with a conversion webhook (ADR-0075); adopt a live-only posture (cold-mode admission rejection, ADR-0076); ship v0.2.0 → v0.3.0 → v1beta1 → v1.0.0; recruit a second maintainer and document 3+ public production adopters.',
    gate:
      'v1.0.0 released with a frozen v1 API, the full workload matrix green in CI every release, a clean re-audit, and a proven conversion path from the earliest public release.',
    size: 'L',
    progress: '100% (amd64 scope)',
    flag: 'The path to incubation is structurally non-solo — requires a second maintainer + documented adopters.',
  },
];

const primaryGoal = {
  definition:
    'Complete bilateral transparency for live pod migration across nodes within a single cluster.',
  guarantees: [
    'Every container in the pod is unaware it moved — every app container, every sidecar, every log shipper.',
    'Every client with an open TCP connection is unaware the pod moved.',
    'seq_delta=0 — exact TCP sequence-number preservation.',
    'No RST, no reconnect, no retry, no client-side reconnect logic required.',
  ],
  doneWhen:
    'On every release, CI is green across the full matrix with seq_delta=0 and zero RST/reconnect, every container unaware — validated by 80 randomized zero-error runs and a clean external audit, behind a frozen v1 API.',
  scope:
    'Single-cluster · amd64 · no kernel patches for the v1.0 gate.',
};

const betaGate = {
  headlineStat: '80',
  headlineLabel: 'consecutive randomized runs · zero errors · zero warnings',
  subhead:
    'A hard gate. No beta is cut until every run passes clean against the full workload matrix on amd64.',
  workloadTypes: [
    'Stateless web (NGINX, Node.js/Go HTTP under wrk/k6)',
    'SQL database (PostgreSQL incl. replication; MySQL/MariaDB)',
    'Redis / KV (standalone + 6-node cluster)',
    'Message broker (NATS / RabbitMQ)',
    'gRPC streaming',
    'WebSocket server',
    'Mixed multi-container (Helm web + DB + cache)',
    'Long-running compute',
  ],
  environments: [
    'AWS arm64 — EKS on Graviton (m7g/c7g/r7g)',
    'AWS amd64 — EKS on x86-64 (m7i/c7i/r7i)',
    'Local arm64 — multi-node Multipass/QEMU on Apple Silicon',
    'Local amd64 — multi-node QEMU under Rosetta / dedicated x86-64',
  ],
  randomizationAxes: [
    'Architecture: arm64 + amd64',
    'Pod memory: 64MB / 256MB / 1GB / 4GB',
    'Write rate: idle / 10 MB/s / 100 MB/s',
    'Open TCP connections: 0 / 10 / 1000',
    'PVC size: none / 1GB / 100GB',
    'Concurrent migrations: 1 / 4 / 8',
    'Node count: 3 / 6 / 12',
  ],
  matrixDims: [
    'CNIs: Calico VXLAN · Cilium eBPF · Flannel VXLAN',
    'Clouds: EKS · self-managed EC2 · kubeadm/kind',
    'K8s versions: N · N-1 · N-2',
    'IP families: IPv4 + IPv6 · ClusterIP/NodePort · ALB/NLB',
  ],
  validity:
    'The gate is invalid if run before M22 and M23 land, or against the weaker single-flow / single-container definition instead of the true v1.0 set (multi-container + Service-routed + dual-stack).',
};

const versions = [
  { v: 'v0.1.0-alpha', label: 'Current — cold + pre-copy, all storage tiers', current: true },
  { v: 'v0.2.0', label: 'Stabilization, adopter onboarding' },
  { v: 'v0.3.0', label: 'Primary-goal hardening' },
  { v: 'v1beta1', label: 'API freeze + conversion webhook' },
  { v: 'v1.0.0', label: 'Frozen v1 API · full matrix green in CI' },
];

const deferred = [
  { label: 'Live-storage dual-engine / concurrent', note: 'v1.2 epic (ADR-0044)' },
  { label: 'GPU / device-attached migration', note: 'permanently feature-gated (ADR-0032)' },
  { label: 'ARM64 production validation', note: 'fast-follow after amd64 v1.0' },
  { label: 'flannel host-gw backend', note: 'post-v1.0 community candidate' },
  { label: 'Argo Rollouts / Flagger integration', note: 'document divergence (ADR-0055)' },
];

const permanentlyOut = [
  { label: 'Windows containers / nodes', note: 'out of scope for beta' },
  { label: 'Cold-mode as a product posture', note: 'out of scope for beta; live-only — cold is the proven foundation, not a shipped mode (ADR-0076)' },
];

const longTermRoadmap = [
  { label: 'Multi-cluster / cross-cluster migration', note: 'long-term roadmap — separate capability track (ADR-0034)' },
];

function MilestoneCard({ m }: { m: Milestone }) {
  const tone = TIER_TONE[m.tier];
  return (
    <li
      className={`relative rounded-xl border border-pm-navy-700 bg-pm-navy-900 p-5 sm:p-6 border-l-4 ${tone.rail} transition-colors hover:border-pm-cyan-500 focus-within:border-pm-cyan-500`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-pm-navy-800 px-2 py-0.5 font-mono text-xs font-medium text-pm-cyan-300 ring-1 ring-inset ring-pm-navy-600">
          {m.id}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${tone.chipBg} ${tone.chipText} ring-1 ring-inset ${tone.chipRing}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${tone.dot}${m.tier === 'in-progress' ? ' animate-pulse' : ''}`}
          />
          {tone.label}
        </span>
        {m.size && (
          <span className="rounded-md bg-pm-navy-800 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-pm-slate-400">
            {m.size}
          </span>
        )}
        {m.progress && (
          <span className="ml-auto font-mono text-xs text-pm-slate-400">{m.progress}</span>
        )}
      </div>

      <h4 className="mt-3 text-base font-semibold text-pm-white">{m.title}</h4>

      <p className="mt-1.5 text-sm leading-relaxed text-pm-slate-300">{m.theme}</p>

      {m.gate && (
        <div className="mt-3 rounded-lg border border-pm-navy-700 bg-pm-navy-950/60 px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">Gate</p>
          <p className="mt-0.5 font-mono text-xs leading-relaxed text-pm-slate-300">{m.gate}</p>
        </div>
      )}

      {m.flag && (
        <p className="mt-2 text-xs font-medium text-amber-300/90">▲ {m.flag}</p>
      )}
    </li>
  );
}

export default function Roadmap() {
  return (
    <section id="roadmap" aria-labelledby="roadmap-heading" className="bg-pm-navy-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* HEADER */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-pm-cyan-400">Roadmap</p>
          <h2 id="roadmap-heading" className="mt-2 text-3xl font-bold tracking-tight text-pm-white sm:text-4xl">
            The path to v1.0
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-pm-slate-300">
            One goal: live-migrate a running multi-container pod across nodes, and neither the
            containers nor any client with an open TCP connection notices. Everything below is measured
            against that single, falsifiable bar — milestone by milestone, gate by gate.
          </p>
        </div>

        {/* GOAL CARD */}
        <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-pm-cyan-500/25 bg-pm-cyan-500/[0.06] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-pm-cyan-400">The v1.0 goal</p>
          <p className="mt-2 text-base font-medium text-pm-white">{primaryGoal.definition}</p>
          <ul className="mt-5 space-y-2.5">
            {primaryGoal.guarantees.map(g => (
              <li key={g} className="flex gap-3 text-sm leading-relaxed text-pm-slate-200">
                <svg aria-hidden className="mt-0.5 h-4 w-4 flex-shrink-0 text-pm-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                </svg>
                <span>{g}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-lg border border-pm-navy-700 bg-pm-navy-950/50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">Done when</p>
            <p className="mt-1 font-mono text-xs leading-relaxed text-pm-slate-300">{primaryGoal.doneWhen}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {primaryGoal.scope.split(' · ').map(s => (
              <span key={s} className="rounded-md bg-pm-navy-800 px-2.5 py-1 font-mono text-xs text-pm-slate-400">{s}</span>
            ))}
          </div>
        </div>

        {/* TIER LEGEND */}
        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {(['shipped', 'in-progress', 'planned', 'future'] as Tier[]).map(t => (
            <span key={t} className="inline-flex items-center gap-2 text-xs font-medium text-pm-slate-300">
              <span className={`h-2 w-2 rounded-full ${TIER_TONE[t].dot}`} />
              {TIER_TONE[t].label}
            </span>
          ))}
        </div>

        {/* TIER GROUPS */}
        {(['shipped', 'in-progress', 'planned', 'future'] as Tier[]).map(t => {
          const group = milestones.filter(m => m.tier === t);
          return (
            <div key={t} className="mx-auto mt-14 max-w-4xl first:mt-12">
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${TIER_TONE[t].dot}`} />
                <h3 className="text-lg font-semibold text-pm-white">{TIER_TONE[t].label}</h3>
                <span className="text-sm text-pm-slate-500">{group.length} milestone{group.length === 1 ? '' : 's'}</span>
              </div>
              <ol className="mt-5 space-y-4">
                {group.map(m => <MilestoneCard key={m.id} m={m} />)}
              </ol>
            </div>
          );
        })}

        {/* VALIDATION FOOTPRINT (BETA GATE) */}
        <div className="mx-auto mt-16 max-w-5xl rounded-2xl border border-pm-navy-700 bg-pm-navy-900 p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-pm-cyan-400">How we prove it</p>
          <h3 className="mt-2 text-2xl font-bold text-pm-white">The beta gate</h3>

          <div className="mt-6 flex items-baseline gap-4 border-b border-pm-navy-700 pb-6">
            <span className="font-mono text-5xl font-bold text-pm-cyan-400 sm:text-6xl">{betaGate.headlineStat}</span>
            <span className="text-sm leading-relaxed text-pm-slate-300">{betaGate.headlineLabel}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-pm-slate-300">{betaGate.subhead}</p>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-pm-slate-500">8 workload types</p>
              <ul className="mt-3 space-y-2">
                {betaGate.workloadTypes.map(w => (
                  <li key={w} className="flex gap-2 text-sm text-pm-slate-300">
                    <span aria-hidden className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-pm-cyan-500" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-pm-slate-500">Every environment must pass</p>
              <ul className="mt-3 space-y-2">
                {betaGate.environments.map(e => (
                  <li key={e} className="flex gap-2 text-sm text-pm-slate-300">
                    <span aria-hidden className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-pm-slate-500">Randomized across</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {betaGate.randomizationAxes.map(a => (
                <span key={a} className="rounded-full bg-pm-navy-800 px-3 py-1 font-mono text-xs text-pm-slate-300 ring-1 ring-inset ring-pm-navy-600">{a}</span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-pm-slate-500">v1.0 matrix dimensions</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {betaGate.matrixDims.map(d => (
                <span key={d} className="rounded-full bg-pm-cyan-500/10 px-3 py-1 font-mono text-xs text-pm-cyan-300 ring-1 ring-inset ring-pm-cyan-500/30">{d}</span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-3 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-3">
            <span aria-hidden className="mt-0.5 text-indigo-300">ⓘ</span>
            <p className="text-xs leading-relaxed text-indigo-200/90">{betaGate.validity}</p>
          </div>
        </div>

        {/* VERSION ROADMAP STRIP */}
        <div className="mx-auto mt-16 max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-pm-cyan-400">Releases</p>
          <h3 className="mt-2 text-2xl font-bold text-pm-white">Version roadmap</h3>
          <ol className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-0">
            {versions.map((rel, i) => (
              <li key={rel.v} className="flex flex-1 flex-col">
                <div className="flex items-center">
                  <span className={`flex h-3 w-3 flex-shrink-0 rounded-full ${rel.current ? 'bg-pm-cyan-400 ring-4 ring-pm-cyan-500/20' : 'bg-pm-navy-600'}`} />
                  {i < versions.length - 1 && <span className="hidden h-px flex-1 bg-pm-navy-700 sm:block" />}
                </div>
                <div className="mt-3 pr-4">
                  <span className={`font-mono text-sm font-semibold ${rel.current ? 'text-pm-cyan-300' : 'text-pm-slate-200'}`}>{rel.v}</span>
                  <p className="mt-1 text-xs leading-relaxed text-pm-slate-400">{rel.label}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* OUT-OF-SCOPE / DEFERRED */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-pm-slate-500">Deferred to post-v1.0</p>
            <div className="mt-3 flex flex-col gap-2">
              {deferred.map(c => (
                <span key={c.label} className="inline-flex flex-wrap items-center gap-1.5 rounded-lg border border-pm-navy-700 bg-pm-navy-900 px-3 py-2 text-xs">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-indigo-400/70" />
                  <span className="font-medium text-pm-slate-300">{c.label}</span>
                  <span className="text-pm-slate-500">— {c.note}</span>
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-pm-cyan-600">Long-term roadmap</p>
            <div className="mt-3 flex flex-col gap-2">
              {longTermRoadmap.map(c => (
                <span key={c.label} className="inline-flex flex-wrap items-center gap-1.5 rounded-lg border border-pm-navy-700 bg-pm-navy-900 px-3 py-2 text-xs">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-pm-cyan-700" />
                  <span className="font-medium text-pm-slate-300">{c.label}</span>
                  <span className="text-pm-slate-500">— {c.note}</span>
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-pm-slate-500">Out of scope for beta</p>
            <div className="mt-3 flex flex-col gap-2">
              {permanentlyOut.map(c => (
                <span key={c.label} className="inline-flex flex-wrap items-center gap-1.5 rounded-lg border border-pm-navy-700 bg-pm-navy-900 px-3 py-2 text-xs">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-pm-slate-600" />
                  <span className="font-medium text-pm-slate-300">{c.label}</span>
                  <span className="text-pm-slate-500">— {c.note}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

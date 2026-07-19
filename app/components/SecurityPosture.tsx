'use client';

import React from 'react';

// ── Badge contract (SITE-ADR-001) ────────────────────────────────────────────
// Implemented     = Accepted ADR + committed proof artifact + not dead code
// Accepted-unimpl = Accepted ADR, no shipped code / proof artifact
// Draft           = ADR in Draft status — plan, not a commitment
// Dead-code       = Accepted ADR, code path never wired (sub-case of Accepted-unimpl)
// ─────────────────────────────────────────────────────────────────────────────

type BadgeKind = 'implemented' | 'accepted-unimpl' | 'draft' | 'dead-code';

const BADGES: Record<BadgeKind, { label: string; bg: string; text: string; ring: string }> = {
  implemented: { label: 'Implemented', bg: 'bg-emerald-500/10', text: 'text-emerald-300', ring: 'ring-emerald-500/30' },
  'accepted-unimpl': { label: 'Accepted — unimplemented', bg: 'bg-indigo-500/10', text: 'text-indigo-300', ring: 'ring-indigo-500/30' },
  draft: { label: 'Draft — plan, not a commitment', bg: 'bg-slate-500/10', text: 'text-slate-300', ring: 'ring-slate-500/30' },
  'dead-code': { label: 'Accepted-but-superseded (dead code)', bg: 'bg-amber-500/10', text: 'text-amber-300', ring: 'ring-amber-500/30' },
};

function Badge({ kind }: { kind: BadgeKind }) {
  const b = BADGES[kind];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${b.bg} ${b.text} ${b.ring}`}>
      {b.label}
    </span>
  );
}

// ── Section 1 — current posture ───────────────────────────────────────────────

interface PostureRow {
  surface: string;
  status: BadgeKind;
  statusLabel: string;
  state: string;
  milestone: string;
  flag?: string;
}

const POSTURE_ROWS: PostureRow[] = [
  {
    surface: 'RBAC',
    status: 'implemented',
    statusLabel: 'ADR-0078 — proof: clusterrole.yaml + clusterrolebinding.yaml',
    state:
      'Default least-privilege ClusterRoles ship in the v0.1.0-alpha Helm chart and bind automatically on install: podmotion-manager-role → podmotion-operator ServiceAccount (unconditional ClusterRoleBinding, no enable/disable gate) and podmotion-agent-role → podmotion-agent ServiceAccount. Operators do not hand-provision RBAC.',
    milestone: 'Shipped (v0.1.0-alpha)',
  },
  {
    surface: 'Agent privilege model',
    status: 'implemented',
    statusLabel: 'ADR-0148 SD-1 — proof: charts/podmotion/templates/daemonset.yaml',
    state:
      'The main agent container runs privileged: false. It drops ALL capabilities and adds only the trace-derived minimum CRIU + eBPF need: SYS_PTRACE, SYS_ADMIN, CHECKPOINT_RESTORE, DAC_READ_SEARCH, SYS_RESOURCE, NET_ADMIN, NET_RAW, KILL — plus BPF and PERFMON on kernels ≥ 5.8. privileged: true is confined to one long-lived sidecar (the netns-broker, the sole long-lived privileged container) plus short-lived init containers.',
    flag:
      'Disclosed alpha trade-off, still NOT hardened: the pod runs hostPID: true and hostNetwork: true, the agent keeps SYS_ADMIN + SYS_PTRACE and mounts the containerd socket read-write, and seccomp is Unconfined by default (seccompProfile.enabled: false). A compromised agent is therefore still effectively node-root. SD-1 capability minimization is the first hardening step; deny-by-default seccomp, hostPID reduction, and a read-only containerd socket are accepted but not yet implemented.',
    milestone: 'Shipped (v0.1.0-alpha)',
  },
  {
    surface: 'Controller-manager hardening',
    status: 'implemented',
    statusLabel: 'Helm chart template (v0.1.0-alpha)',
    state:
      'runAsNonRoot: true, seccomp: RuntimeDefault, readOnlyRootFilesystem: true, capabilities drop: ALL. Shipped in the v0.1.0-alpha chart.',
    milestone: 'Shipped (v0.1.0-alpha)',
  },
  {
    surface: 'Security disclosure process',
    status: 'implemented',
    statusLabel: 'ADR-0077 §4 — SECURITY.md live on GitHub',
    state:
      'SECURITY.md authored and public on GitHub. GitHub private advisory intake, 72h ack target, 90-day fix target.',
    milestone: 'Shipped (repo public, Sprint 32 close)',
  },
  {
    surface: 'Checkpoint data at rest',
    status: 'dead-code',
    statusLabel: 'ADR-0029 never-wired → ADR-0160 Draft',
    state:
      'Plaintext on tmpfs /run/podmotion/checkpoints/<ref>/ mode 0700, wiped on reboot. AES-256-GCM NOT implemented — ADR-0029 recorded encryption on-by-default but was never wired into the CRIU writer. ADR-0160 (Draft) is the single forward plan (CheckpointCrypto: none/aes-gcm/aws-kms/gcp-kms/azure-kms/vault).',
    milestone: 'Sprint 33+ (platform-readiness)',
    flag: 'Checkpoints are plaintext today — encryption NOT implemented.',
  },
  {
    surface: 'gRPC agent communication',
    status: 'draft',
    statusLabel: 'ADR-0079 Accepted; ADR-0159 Draft; ADR-0161 C4 Draft',
    state:
      'Listens :9090, PLAINTEXT by default. mTLS is opt-in and fails open in the shipped v0.1.0-alpha chart — enabling it does not guarantee channel enforcement. (Sprint 34 proved a fail-closed mTLS build on the gate cluster — see Section 1b — but that lifecycle is not yet the chart default.)',
    milestone: 'Sprint 33+ / GA+6mo',
    flag: 'mTLS fails open — plaintext by default in the shipped v0.1.0-alpha chart.',
  },
  {
    surface: 'Admission webhook TLS',
    status: 'draft',
    statusLabel: 'ADR-0159 Draft; ADR-0079 Accepted',
    state:
      'webhook.certManager.enabled defaults true but the chart ships no Certificate/Issuer → a vanilla install crashloops. failurePolicy: Fail on all 5 webhooks (Ignore prohibited, ADR-0079).',
    milestone: 'Sprint 33+',
    flag: 'Vanilla install crashloops — no Certificate/Issuer ships in the v0.1.0-alpha chart.',
  },
  {
    surface: 'Supply chain',
    status: 'accepted-unimpl',
    statusLabel: 'ADR-0077 Accepted, unimplemented',
    state:
      'NO SBOM, NO signed images, NO SLSA provenance, NO published checksums for v0.1.0-alpha — treat artifacts as unverified. Plan: cosign keyless signing, CycloneDX SBOM (syft), SLSA L2 provenance, grype release-gate.',
    milestone: 'Pre-GA',
    flag: 'No signed artifacts, no SBOM, no SLSA provenance in v0.1.0-alpha.',
  },
  {
    surface: 'Audit logging',
    status: 'draft',
    statusLabel: 'ADR-0161 C1 Draft',
    state:
      'Empty stub — no structured per-migration audit record, no CheckpointWritten event. PhaseTransition Kubernetes events ARE emitted.',
    milestone: 'Pre-GA (Sprint 33-35)',
    flag: 'Audit log is a stub — no structured per-migration records today.',
  },
];

// ── Section 1b — Sprint 34 proven gRPC controls ───────────────────────────────

const PROVEN_ROWS: { control: string; gate: string; proven: string; adr: string }[] = [
  {
    control: 'mTLS enforced + fail-closed',
    gate: 'GC-B1',
    proven:
      'Operator→agent gRPC requires mutual TLS. Deleting the TLS secret puts the operator into CrashLoopBackOff — it never serves or dials in plaintext.',
    adr: 'ADR-SEC-A',
  },
  {
    control: 'Per-RPC SPIFFE authorization',
    gate: 'GC-B2',
    proven:
      'Peer SPIFFE identity is extracted from its certificate and classified into a role; each RPC is gated by role. Wrong-role or unauthenticated callers get PermissionDenied. Enforced per RPC, not only at connection setup.',
    adr: 'ADR-SEC-A',
  },
  {
    control: 'gRPC size caps (512 MiB) + decompress cap (2 GiB)',
    gate: 'GC-B3',
    proven:
      'A 537 MB message is rejected with ResourceExhausted against the 512 MiB cap on both server and client. Checkpoint-tar decompression is independently capped at 2 GiB.',
    adr: 'ADR-SEC-A',
  },
  {
    control: 'Checkpoint manifest signing',
    gate: 'GC-B4',
    proven:
      'A checkpoint with an invalid manifest signature is rejected with PermissionDenied. Verification runs before extraction — unverified bytes never reach the staging extract step.',
    adr: 'ADR-SEC-B',
  },
  {
    control: 'Transfer integrity (wire hash)',
    gate: 'GC-B5',
    proven:
      'A wire-hash mismatch on the transferred checkpoint is rejected with DataLoss before decompression, so corrupt or tampered payloads are never expanded on disk.',
    adr: 'ADR-SEC-B',
  },
  {
    control: 'migration_uid anti-replay',
    gate: 'GC-B6',
    proven:
      'A validly signed checkpoint carrying a stale migration_uid is rejected with PermissionDenied. Socket state is bound to its migration, so a signed checkpoint cannot be replayed into another.',
    adr: 'ADR-SEC-B / ADR-SEC-D',
  },
  {
    control: 'SPIFFE identity verification on operator dial',
    gate: 'GC-B2',
    proven:
      'The operator dials by node IP; the agent certificate carries only a SPIFFE URI SAN. A custom VerifyPeerCertificate verifies the chain against RootCAs and exact-matches spiffe://podmotion.io/ns/<ns>/sa/podmotion-agent — identity verification, not coordinate binding. Logged peer-verified four times per migration.',
    adr: 'ADR-SEC-C',
  },
  {
    control: 'Full live migration with the security stack active',
    gate: 'GC-B7 / GC-B8',
    proven:
      'With every control above active, migration gcb7-final-migration ran to Phase=Complete and the workload’s in-memory counter (gcb7:counter=42) was restored intact. TrafficVerified=True was reached before the source pod was deleted; the checkpoint tmpfs held mode 0700 throughout. All 22/22 Phase A cold-path assertions still pass — zero regression.',
    adr: 'GC-B7 / GC-B8',
  },
];

// ── Section 2 — remediation roadmap ───────────────────────────────────────────

const ROADMAP_ITEMS: { gap: string; adr: string; status: BadgeKind; milestone: string; doneWhen: string }[] = [
  {
    gap: 'Agent runtime confinement: the main agent already runs privileged:false with a trace-derived minimum capability set (ADR-0148 SD-1, shipped). Remaining work over that minimized surface: a deny-by-default seccomp profile (Unconfined today), hostPID reduction, and a read-only containerd socket.',
    adr: 'ADR-0148',
    status: 'accepted-unimpl',
    milestone: 'M-SEC-1',
    doneWhen:
      'Chart ships a trace-derived Localhost seccomp profile plus hostPID:false and a read-only containerd socket, validated across the beta workload set (ADR-0148 C6).',
  },
  {
    gap: 'Checkpoint encryption at rest: checkpoints are plaintext on tmpfs today. ADR-0029 was dead code from acceptance; ADR-0160 is the forward plan.',
    adr: 'ADR-0160',
    status: 'draft',
    milestone: 'Sprint 33+',
    doneWhen: 'CheckpointCrypto provider wired so plaintext never touches disk; key ref recorded in MigrationCheckpoint.status.',
  },
  {
    gap: 'Webhook + agent TLS lifecycle: cert-manager path is stubbed and gRPC mTLS fails open in the chart. No Certificate/Issuer ships.',
    adr: 'ADR-0159 (Draft) / ADR-0079 (Accepted)',
    status: 'draft',
    milestone: 'Sprint 33+',
    doneWhen: 'cert-manager inject-ca-from auto-injects caBundle with no manual patch; gRPC mTLS fails CLOSED by default.',
  },
  {
    gap: 'Supply chain integrity: no signed images, no SBOM, no SLSA provenance for any released artifact.',
    adr: 'ADR-0077 (supersedes ADR-0103)',
    status: 'accepted-unimpl',
    milestone: 'Pre-GA',
    doneWhen: 'Signed images (cosign keyless) + CycloneDX SBOM (syft) + SLSA L2 provenance verifiable for every release artifact.',
  },
  {
    gap: 'Structured audit log: audit/ is a stub; no per-migration CheckpointWritten event is emitted.',
    adr: 'ADR-0161 C1',
    status: 'draft',
    milestone: 'Pre-GA (Sprint 33-35)',
    doneWhen: 'Structured per-migration audit record emitted; CheckpointWritten event present and queryable.',
  },
  {
    gap: 'CNCF Security TAG self-assessment: blocking gate for sandbox submission. Not filed yet.',
    adr: 'ADR-0161 C5',
    status: 'draft',
    milestone: 'Pre-M29 (BLOCKING sandbox gate)',
    doneWhen: 'CNCF Security TAG self-assessment submitted and accepted as part of the sandbox application.',
  },
];

// ── Section 3 — sprint security log ───────────────────────────────────────────

const SPRINT_LOG: { sprint: string; date: string; work: string; adrs: string }[] = [
  {
    sprint: 'Sprint 34 (Phase B)',
    date: '2026-06-16',
    work:
      'gRPC control-plane hardening PROVEN — 8/8 gate criteria (GC-B1…GC-B8): fail-closed mTLS, per-RPC SPIFFE authz, 512 MiB size caps + 2 GiB decompress cap, signed checkpoint manifests verified before extraction, wire-hash transfer integrity, migration_uid anti-replay. Full live-migration regression ran to Phase=Complete with the stack active; 22/22 Phase A assertions still pass. These controls harden the operator↔agent gRPC channel on the gate cluster; cert lifecycle, checkpoint-at-rest encryption, SBOM, and default RBAC remained unimplemented at this gate. (Default least-privilege ClusterRoles have since shipped in the v0.1.0-alpha chart — see the RBAC row above.)',
    adrs: 'ADR-SEC-A / -B / -C / -D',
  },
  {
    sprint: 'M-SEC-1',
    date: '2026-06-14',
    work:
      'ADR-0148 Agent Privilege Containment ACCEPTED; supersedes REJECTED ADR-0106. Decision advance only. (SD-1 capability minimization — main agent privileged:false with a trace-derived minimum capability set — has since shipped in the v0.1.0-alpha chart daemonset; deny-by-default seccomp, hostPID reduction, and read-only containerd socket remain accepted but unimplemented. See the privilege row above.)',
    adrs: 'ADR-0148 Draft → Accepted; ADR-0106 Rejected',
  },
  {
    sprint: 'Sprint 32',
    date: '2026-06-16',
    work:
      'Sprint 32 GATE PASS 21/22 (GC-21 expected fail per ADR-0166 — kind substrate). Cold-path CRIU restore baseline proven on amd64. ADR-0183 r1 ACCEPTED: CRIU wrapper host install via DaemonSet init container with image-digest verification (r0 security hard-block resolved in r1). No additional security controls shipped; no privilege reduction this sprint.',
    adrs: 'ADR-0183 r1 + ADR-0184…0191 Accepted (correctness/restore path); ADR-0187 Superseded',
  },
  {
    sprint: 'Pre-Sprint 33 (Draft)',
    date: '2026-06',
    work:
      'ADR-0159 (cert-manager/ACME webhook TLS), ADR-0160 (checkpoint encryption), ADR-0161 (compliance planning C1-C5) drafted. Planning advances only — no decisions accepted, no code shipped.',
    adrs: 'ADR-0159 / ADR-0160 / ADR-0161 Draft',
  },
];

// ── Compliance frameworks (ADR-0161, Draft — condensed) ───────────────────────

const COMPLIANCE_ROWS: { framework: string; gap: string; adrs: string; milestone: string; blocking?: boolean }[] = [
  { framework: 'CNCF Security TAG self-assessment', gap: 'not drafted/submitted (gates sandbox graduation)', adrs: 'ADR-0159/0160/0161', milestone: 'Pre-GA (Sprint 33-35)', blocking: true },
  { framework: 'SOC 2 Type II', gap: 'no structured audit log, RBAC not audit-mapped, checkpoints plaintext', adrs: 'ADR-0161 C1/C2/C3, ADR-0078', milestone: 'GA+3mo readiness' },
  { framework: 'ISO 27001', gap: 'inherits SOC 2 gaps', adrs: 'ADR-0161', milestone: 'GA+6mo gap analysis' },
  { framework: 'HIPAA', gap: 'checkpoints plaintext, audit stub', adrs: 'ADR-0160, ADR-0161 C1/C3', milestone: 'GA+12mo alignment' },
  { framework: 'PCI DSS v4.0', gap: 'checkpoint storage location not exposed in MigrationCheckpoint status', adrs: 'ADR-0160, ADR-0161 C3/C5/C6', milestone: 'GA+12mo alignment' },
  { framework: 'FedRAMP Moderate', gap: 'no FIPS build path', adrs: 'ADR-0161 C4/C6 (FIPS)', milestone: 'GA+18mo' },
  { framework: 'NIS2 (EU)', gap: 'no SBOM/signing/SLSA', adrs: 'ADR-0077, ADR-0159, ADR-0160', milestone: 'post-GA' },
  { framework: 'CSA STAR', gap: 'follows SOC 2', adrs: 'ADR-0161', milestone: 'post-SOC2' },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function SecurityPosture() {
  return (
    <section id="security-posture" aria-labelledby="security-posture-heading" className="bg-pm-navy-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* HEADER */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-pm-cyan-400">Security posture</p>
          <h2 id="security-posture-heading" className="mt-2 text-3xl font-bold tracking-tight text-pm-white sm:text-4xl">
            Honest security disclosure
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-pm-slate-300">
            PodMotion is an alpha-stage project. This page tells security evaluators, CISOs, and CNCF
            TAG-Security reviewers exactly what is and is not implemented in v0.1.0-alpha today — traced
            to ADRs, not marketing copy. Every claim carries an ADR citation and a badge
            (Implemented / Accepted-unimplemented / Draft).
          </p>
        </div>

        {/* BADGE LEGEND */}
        <div className="mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2"><Badge kind="implemented" /><span className="text-xs text-pm-slate-400">Accepted ADR + committed proof artifact</span></div>
          <div className="flex items-center gap-2"><Badge kind="accepted-unimpl" /><span className="text-xs text-pm-slate-400">Accepted design, no shipped code</span></div>
          <div className="flex items-center gap-2"><Badge kind="dead-code" /><span className="text-xs text-pm-slate-400">Accepted ADR, code path never wired</span></div>
          <div className="flex items-center gap-2"><Badge kind="draft" /><span className="text-xs text-pm-slate-400">ADR not yet accepted — a plan</span></div>
        </div>

        {/* ── SECTION 1 ── Current posture ─────────────────────────────────── */}
        <div className="mx-auto mt-16 max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-pm-cyan-400">Section 1</p>
          <h3 className="mt-1 text-2xl font-bold text-pm-white">Current security posture</h3>
          <p className="mt-2 text-sm leading-relaxed text-pm-slate-400">
            Every row is ADR-traced. Amber flags mark the disclosed alpha trade-offs that are not yet hardened.
          </p>

          <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/[0.06] px-4 py-4 text-sm leading-relaxed text-pm-slate-300">
            Primary adoption blocker, stated plainly: ADR-0148 SD-1 shipped in the v0.1.0-alpha chart, so
            the main agent container runs privileged:false with capabilities dropped to a trace-derived
            minimum, and privileged:true is confined to the netns-broker sidecar and short-lived init
            containers. The agent is still highly privileged: the pod runs hostPID:true and hostNetwork:true,
            the agent keeps SYS_ADMIN + SYS_PTRACE and mounts the containerd socket read-write, and seccomp
            is Unconfined by default. A compromised agent is therefore still effectively node-root. This is a
            deliberate, disclosed alpha trade-off required for CRIU checkpoint/restore; deny-by-default
            seccomp, hostPID reduction, and a read-only containerd socket are accepted but not yet
            implemented. See the privilege row below.
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {POSTURE_ROWS.map((row) => (
              <div
                key={row.surface}
                className={`rounded-xl border bg-pm-navy-900 p-5 sm:p-6 ${
                  row.status === 'implemented' ? 'border-emerald-500/30'
                  : row.status === 'dead-code' ? 'border-amber-500/30'
                  : row.status === 'draft' ? 'border-slate-600/50'
                  : 'border-pm-navy-700'
                }`}
              >
                <div className="flex flex-wrap items-start gap-3">
                  <span className="rounded-md bg-pm-navy-800 px-2 py-0.5 font-mono text-xs font-medium text-pm-cyan-300 ring-1 ring-inset ring-pm-navy-600">
                    {row.surface}
                  </span>
                  <Badge kind={row.status} />
                  <span className="ml-auto font-mono text-xs text-pm-slate-400">{row.milestone}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-pm-slate-300">{row.state}</p>
                <p className="mt-2 text-xs text-pm-slate-400">{row.statusLabel}</p>
                {row.flag && (
                  <p className="mt-2 text-xs font-medium text-amber-300/90">&#9650; {row.flag}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 1b ── Sprint 34 proven gRPC controls ─────────────────── */}
        <div className="mx-auto mt-20 max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-pm-cyan-400">Section 1b</p>
          <h3 className="mt-1 text-2xl font-bold text-pm-white">Sprint 34 proven — gRPC control plane</h3>
          <p className="mt-2 text-sm leading-relaxed text-pm-slate-400">
            Sprint 34 Phase B hardened the operator→agent gRPC control plane and proved each control against a
            gate criterion (GC-B1…GC-B8) on the gate cluster (kind, kindnet, amd64, kernel 6.17). The full
            live-migration regression ran with the complete stack active — zero regression, 22/22 Phase A
            cold-path assertions still pass.
          </p>
          <div className="mt-6 rounded-lg border border-emerald-500/30 bg-emerald-500/[0.06] px-4 py-4 text-sm leading-relaxed text-pm-slate-300">
            Scope note: these controls are proven on the gate cluster and harden the operator↔agent gRPC
            channel specifically. The shipping v0.1.0-alpha chart posture, certificate lifecycle, checkpoint
            encryption at rest, and SBOM/signed-image supply chain remain as stated in the rows above and
            below — not yet implemented.
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {PROVEN_ROWS.map((row) => (
              <div key={row.control} className="rounded-xl border border-emerald-500/30 bg-pm-navy-900 p-5 sm:p-6">
                <div className="flex flex-wrap items-start gap-3">
                  <span className="rounded-md bg-pm-navy-800 px-2 py-0.5 font-mono text-xs font-medium text-pm-cyan-300 ring-1 ring-inset ring-pm-navy-600">
                    {row.control}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
                    {row.gate} PASS
                  </span>
                  <span className="ml-auto font-mono text-xs text-pm-slate-400">{row.adr}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-pm-slate-300">{row.proven}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs italic text-pm-slate-500">
            Honest boundary: certificate issuance/rotation is not yet automated; checkpoint encryption at
            rest, SBOM, signed images, and SLSA provenance remain not implemented.
          </p>
        </div>

        {/* ── SECTION 2 ── Remediation roadmap ─────────────────────────────── */}
        <div className="mx-auto mt-20 max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-pm-cyan-400">Section 2</p>
          <h3 className="mt-1 text-2xl font-bold text-pm-white">Remediation roadmap (ADR-linked)</h3>
          <p className="mt-2 text-sm leading-relaxed text-pm-slate-400">
            Ordered by risk priority. Each item states the gap, the owning ADR, its status, the target
            milestone, and the proof criterion that defines done.
          </p>

          <ol className="mt-8 flex flex-col gap-4">
            {ROADMAP_ITEMS.map((item, idx) => (
              <li key={item.adr} className="rounded-xl border border-pm-navy-700 bg-pm-navy-900 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-pm-navy-800 font-mono text-xs font-bold text-pm-cyan-300 ring-1 ring-pm-navy-600">
                    {idx + 1}
                  </span>
                  <span className="rounded-md bg-pm-navy-800 px-2 py-0.5 font-mono text-xs font-medium text-pm-cyan-300 ring-1 ring-inset ring-pm-navy-600">
                    {item.adr}
                  </span>
                  <Badge kind={item.status} />
                  <span className="ml-auto font-mono text-xs text-pm-slate-400">{item.milestone}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-pm-slate-300">{item.gap}</p>
                <div className="mt-3 rounded-lg border border-pm-navy-700 bg-pm-navy-950/60 px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">Done looks like</p>
                  <p className="mt-0.5 font-mono text-xs leading-relaxed text-pm-slate-300">{item.doneWhen}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* ── SECTION 2.5 ── Compliance framework planning (ADR-0161, Draft) ─ */}
        <div className="mx-auto mt-20 max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-pm-cyan-400">Section 2.5</p>
          <h3 className="mt-1 text-2xl font-bold text-pm-white">Compliance framework planning (ADR-0161, Draft)</h3>
          <div className="mt-4 rounded-xl border border-slate-600/50 bg-slate-500/[0.06] px-5 py-4">
            <p className="text-sm leading-relaxed text-slate-200/90">
              PodMotion is infrastructure software, not a certified service — it cannot itself be certified.
              ADR-0161 (Draft, post-beta) exists so PodMotion does not structurally block a customer&apos;s
              certification and makes auditor evidence collection possible. Everything below is Draft / not
              implemented today — a structural-readiness map, not a certification claim.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-xl border border-pm-navy-700">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-pm-navy-700 bg-pm-navy-900">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">Framework</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">Current gap</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">Controlling ADR(s)</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">Status</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pm-navy-800 bg-pm-navy-950/40">
                {COMPLIANCE_ROWS.map((row) => (
                  <tr key={row.framework} className="align-top">
                    <td className="px-4 py-4 font-mono text-xs font-medium text-pm-cyan-300 whitespace-nowrap">{row.framework}</td>
                    <td className="px-4 py-4 text-xs leading-relaxed text-pm-slate-300">{row.gap}</td>
                    <td className="px-4 py-4 font-mono text-xs text-pm-slate-400">{row.adrs}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <Badge kind="draft" />
                        {row.blocking && (
                          <span className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-0.5 text-[11px] font-medium text-red-300 ring-1 ring-inset ring-red-500/30">
                            BLOCKING
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-pm-slate-400 whitespace-nowrap">{row.milestone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs italic text-pm-slate-500">
            ADR-0161 architectural controls C1–C6 (audit log, RBAC-gated CR ops, checkpoint encryption,
            gRPC mTLS, storage-location control, FIPS crypto path) are all Draft / not implemented. A CISO
            can hand this table to a compliance team as a structural-readiness map, not a certification claim.
          </p>
        </div>

        {/* ── SECTION 3 ── Sprint-by-sprint security progress ──────────────── */}
        <div className="mx-auto mt-20 max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-pm-cyan-400">Section 3</p>
          <h3 className="mt-1 text-2xl font-bold text-pm-white">Sprint-by-sprint security progress</h3>
          <p className="mt-2 text-sm leading-relaxed text-pm-slate-400">
            Records security-design decision advances and proven controls. An entry does not by itself mean a
            control shipped in the chart — read the row.
          </p>

          <div className="mt-8 overflow-x-auto rounded-xl border border-pm-navy-700">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-pm-navy-700 bg-pm-navy-900">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">Sprint / Milestone</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">Date</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">Security work</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">ADRs advanced</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pm-navy-800 bg-pm-navy-950/40">
                {SPRINT_LOG.map((row) => (
                  <tr key={row.sprint} className="align-top">
                    <td className="whitespace-nowrap px-4 py-4 font-mono text-xs font-medium text-pm-cyan-300">{row.sprint}</td>
                    <td className="whitespace-nowrap px-4 py-4 font-mono text-xs text-pm-slate-400">{row.date}</td>
                    <td className="px-4 py-4 text-xs leading-relaxed text-pm-slate-300">{row.work}</td>
                    <td className="px-4 py-4 font-mono text-xs text-pm-slate-400">{row.adrs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs italic text-pm-slate-500">This log is updated at each sprint closure.</p>
        </div>

        {/* ── SECTION 4 ── Security contact and disclosure ─────────────────── */}
        <div className="mx-auto mt-20 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-pm-cyan-400">Section 4</p>
          <h3 className="mt-1 text-2xl font-bold text-pm-white">Security contact and disclosure</h3>

          <div className="mt-6 rounded-2xl border border-pm-navy-700 bg-pm-navy-900 p-6 sm:p-8">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/[0.06] px-4 py-3">
              <p className="text-sm leading-relaxed text-emerald-200/90">
                <span className="font-semibold">SECURITY.md</span> is authored (ADR-0077 §4) and publicly
                available on the{' '}
                <a href="https://github.com/podmotion-io/podmotion" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-100">
                  podmotion-io/podmotion repository
                </a>.
              </p>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-pm-slate-500">How to report a vulnerability</p>
              <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-pm-slate-300">
                <li>
                  Open a <strong className="text-pm-white">GitHub private security advisory</strong> on the
                  repository with a description and reproduction steps. Use GPG encryption if the report
                  includes a working exploit.
                </li>
                <li>
                  <strong className="text-pm-white">Do NOT open a public issue</strong> for any potential
                  security vulnerability. Public disclosure before a coordinated patch harms all users.
                </li>
              </ul>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-pm-navy-700 bg-pm-navy-950/60 px-4 py-3 text-center">
                <p className="font-mono text-2xl font-bold text-pm-cyan-400">72h</p>
                <p className="mt-1 text-xs text-pm-slate-400">acknowledgment target</p>
              </div>
              <div className="rounded-lg border border-pm-navy-700 bg-pm-navy-950/60 px-4 py-3 text-center">
                <p className="font-mono text-2xl font-bold text-pm-cyan-400">90d</p>
                <p className="mt-1 text-xs text-pm-slate-400">fix target</p>
              </div>
              <div className="rounded-lg border border-pm-navy-700 bg-pm-navy-950/60 px-4 py-3 text-center">
                <p className="font-mono text-2xl font-bold text-pm-cyan-400">CVE</p>
                <p className="mt-1 text-xs text-pm-slate-400">credit in release notes</p>
              </div>
            </div>

            <div className="mt-4 flex gap-3 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-3">
              <span aria-hidden className="mt-0.5 text-indigo-300">&#9432;</span>
              <p className="text-xs leading-relaxed text-indigo-200/90">
                72h acknowledgment and 90-day fix are best-effort targets under single-maintainer staffing
                (ADR-0091). Coordinated disclosure with simultaneous patch and public release is the default;
                timeline may extend for high-complexity vulnerabilities.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <a href="https://docs.podmotion.io/docs/architecture/security" target="_blank" rel="noopener noreferrer" className="text-sm text-pm-cyan-300 underline transition-colors hover:text-pm-cyan-400">
                Full security architecture documentation
              </a>
              <a href="https://github.com/podmotion-io/podmotion/blob/main/SECURITY.md" target="_blank" rel="noopener noreferrer" className="text-sm text-pm-cyan-300 underline transition-colors hover:text-pm-cyan-400">
                SECURITY.md on GitHub
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

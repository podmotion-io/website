'use client';

import React from 'react';

// ── Badge contract (SITE-ADR-001) ────────────────────────────────────────────
// Implemented       = Accepted ADR + committed proof artifact + not dead code
// Accepted-unimpl   = Accepted ADR, no shipped code / proof artifact
// Draft             = ADR in Draft status — plan, not a commitment
// Dead-code         = Accepted ADR, code path never wired (sub-case of Accepted-unimpl)
// ─────────────────────────────────────────────────────────────────────────────

type BadgeKind = 'implemented' | 'accepted-unimpl' | 'draft' | 'dead-code';

interface BadgeSpec {
  kind: BadgeKind;
  label: string;
  bg: string;
  text: string;
  ring: string;
}

const BADGES: Record<BadgeKind, BadgeSpec> = {
  implemented: {
    kind: 'implemented',
    label: 'Implemented',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-300',
    ring: 'ring-emerald-500/30',
  },
  'accepted-unimpl': {
    kind: 'accepted-unimpl',
    label: 'Accepted — unimplemented',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-300',
    ring: 'ring-indigo-500/30',
  },
  draft: {
    kind: 'draft',
    label: 'Draft — plan, not a commitment',
    bg: 'bg-slate-500/10',
    text: 'text-slate-300',
    ring: 'ring-slate-500/30',
  },
  'dead-code': {
    kind: 'dead-code',
    label: 'Accepted-but-superseded (dead code from acceptance)',
    bg: 'bg-amber-500/10',
    text: 'text-amber-300',
    ring: 'ring-amber-500/30',
  },
};

function Badge({ kind }: { kind: BadgeKind }) {
  const b = BADGES[kind];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${b.bg} ${b.text} ${b.ring}`}
    >
      {b.label}
    </span>
  );
}

function AmberFlag({ text }: { text: string }) {
  return (
    <p className="mt-1.5 text-xs font-medium text-amber-300/90">&#9650; {text}</p>
  );
}

// ── Section 1 data ────────────────────────────────────────────────────────────

interface PostureRow {
  surface: string;
  currentState: string;
  note?: string;
  remediationAdr: string;
  adrStatus: BadgeKind;
  adrStatusLabel?: string;
  targetMilestone: string;
  flagText?: string;
}

const POSTURE_ROWS: PostureRow[] = [
  {
    surface: 'Checkpoint data at rest',
    currentState:
      'Plaintext on tmpfs /run/podmotion/checkpoints/<ref>/ mode 0700, wiped on reboot. AES-256-GCM NOT implemented.',
    note:
      'ADR-0029 recorded encryption on-by-default but was never wired into the CRIU writer — it was dead code from acceptance. ADR-0160 (Draft) is the single authoritative forward plan (CheckpointCrypto provider interface: none/aes-gcm/aws-kms/gcp-kms/azure-kms/vault).',
    remediationAdr: 'ADR-0029 (dead code) -> ADR-0160',
    adrStatus: 'dead-code',
    adrStatusLabel:
      'ADR-0029 Accepted-but-superseded/never-wired; ADR-0160 Draft',
    targetMilestone: 'Sprint 33+ (platform-readiness)',
    flagText: 'Checkpoints are plaintext today — encryption NOT implemented.',
  },
  {
    surface: 'gRPC agent communication (operator <-> node-agent)',
    currentState:
      'Listens :9090, PLAINTEXT by default. mTLS is opt-in and FAILS OPEN: enabling it does not guarantee channel enforcement in v0.1.0-alpha.',
    remediationAdr: 'ADR-0079 (webhook TLS) + ADR-0159 (cert-manager/ACME) + ADR-0161 C4',
    adrStatus: 'draft',
    adrStatusLabel:
      'ADR-0079 Accepted; ADR-0159 Draft; ADR-0161 Draft',
    targetMilestone: 'Sprint 33+ / GA+6mo',
    flagText: 'mTLS fails open — plaintext by default in v0.1.0-alpha.',
  },
  {
    surface: 'Admission webhook TLS',
    currentState:
      'webhook.certManager.enabled defaults true but chart ships no Certificate/Issuer -> vanilla install crashloops. failurePolicy: Fail on all 5 webhooks (Ignore is prohibited, ADR-0079).',
    remediationAdr: 'ADR-0159 + ADR-0079',
    adrStatus: 'draft',
    adrStatusLabel: 'ADR-0159 Draft; ADR-0079 Accepted',
    targetMilestone: 'Sprint 33+',
    flagText:
      'Vanilla install crashloops — no Certificate/Issuer ships in v0.1.0-alpha chart.',
  },
  {
    surface: 'RBAC',
    currentState:
      'NO default least-privilege ClusterRoles ship in v0.1.0-alpha. Operators provision bindings manually.',
    remediationAdr: 'ADR-0078',
    adrStatus: 'accepted-unimpl',
    adrStatusLabel:
      'ADR-0078 Accepted (boundary defined, default chart roles unimplemented)',
    targetMilestone: 'Pre-GA (Sprint 33-35, ADR-0161 C2)',
    flagText: 'No default RBAC ships today — manual operator provisioning required.',
  },
  {
    surface: 'Node-agent privilege model',
    currentState:
      'Ships privileged: true, hostPID: true, RW containerd socket, no seccomp profile (Unconfined), tolerates all taints incl. control-plane. Capabilities in use: SYS_PTRACE, SYS_ADMIN, NET_ADMIN, DAC_OVERRIDE, CHOWN, SETUID, SETGID, CHECKPOINT_RESTORE.',
    note:
      'ADR-0148 supersedes the REJECTED ADR-0106. Target: privileged:false; drop ALL; add [SYS_PTRACE, SYS_ADMIN, NET_ADMIN, BPF, PERFMON] (k>=5.8); allowPrivilegeEscalation:true (CRIU parasite/ptrace, kernel-justified); hostPID:false via NRI-supplied PID; readOnlyRootFilesystem:true; trace-derived SCMP_ACT_ERRNO deny-by-default Localhost seccomp; RO containerd socket steady-state; migration-node taint/nodeSelector isolation.',
    remediationAdr: 'ADR-0148',
    adrStatus: 'accepted-unimpl',
    adrStatusLabel: 'ADR-0148 Accepted (tier-14 thrix 2026-06-14), unimplemented',
    targetMilestone: 'M-SEC-1',
    flagText:
      'Node-agent runs privileged:true + hostPID:true today — ADR-0148 hardening NOT yet implemented.',
  },
  {
    surface: 'Supply chain',
    currentState:
      'NO SBOM, NO signed images, NO SLSA provenance, NO published checksums for v0.1.0-alpha. Treat artifacts as unverified.',
    note:
      'Plan: cosign keyless signing, CycloneDX SBOM (syft), SLSA L2 provenance, grype release-gate.',
    remediationAdr: 'ADR-0077 (supersedes ADR-0103)',
    adrStatus: 'accepted-unimpl',
    adrStatusLabel: 'ADR-0077 Accepted, unimplemented',
    targetMilestone: 'Pre-GA',
    flagText: 'No signed artifacts, no SBOM, no SLSA provenance in v0.1.0-alpha.',
  },
  {
    surface: 'Audit logging',
    currentState:
      'Empty stub. No structured per-migration audit record; no CheckpointWritten event. PhaseTransition Kubernetes events ARE emitted.',
    remediationAdr: 'ADR-0161 C1',
    adrStatus: 'draft',
    adrStatusLabel: 'ADR-0161 Draft',
    targetMilestone: 'Pre-GA (Sprint 33-35)',
    flagText: 'Audit log is a stub — no structured per-migration records today.',
  },
  {
    surface: 'Controller-manager hardening',
    currentState:
      'runAsNonRoot: true, seccomp: RuntimeDefault, readOnlyRootFilesystem: true, capabilities drop: ALL. Shipped in v0.1.0-alpha chart.',
    remediationAdr: 'Chart template (Helm values, v0.1.0-alpha)',
    adrStatus: 'implemented',
    adrStatusLabel: 'Implemented — proof artifact: Helm chart template in repository',
    targetMilestone: 'Shipped (v0.1.0-alpha)',
  },
  {
    surface: 'Security disclosure process',
    currentState:
      'SECURITY.md authored (ADR-0077 s4), repo is public — SECURITY.md is live on GitHub. GitHub private advisory + 72h ack, 90-day fix target.',
    remediationAdr: 'ADR-0077 s4',
    adrStatus: 'implemented',
    adrStatusLabel: 'Accepted and public — SECURITY.md live on GitHub',
    targetMilestone: 'Shipped (repo public as of Sprint 32 close)',
  },
];

// ── Section 1b data — Sprint 34 Phase B proven controls ───────────────────────

interface ProvenRow {
  control: string;
  gateCriterion: string;
  proven: string;
  adr: string;
}

const PROVEN_ROWS: ProvenRow[] = [
  {
    control: 'mTLS enforced + fail-closed',
    gateCriterion: 'GC-B1',
    proven:
      'Operator→agent gRPC requires mutual TLS. Deleting the TLS secret puts the operator into CrashLoopBackOff — it refuses to start and never serves or dials in plaintext.',
    adr: 'ADR-SEC-A',
  },
  {
    control: 'Per-RPC SPIFFE authorization',
    gateCriterion: 'GC-B2',
    proven:
      "Peer SPIFFE identity is extracted from its certificate and classified into a role; each RPC is gated by role. An unauthenticated or wrong-role caller is rejected with PermissionDenied ('role not permitted'). Enforced per RPC, not only at connection setup.",
    adr: 'ADR-SEC-A',
  },
  {
    control: 'gRPC message size caps (512 MiB)',
    gateCriterion: 'GC-B3',
    proven:
      'A 537 MB message is rejected with ResourceExhausted against the 512 MiB cap on both server and client limits. Checkpoint-tar decompression is independently capped at 2 GiB.',
    adr: 'ADR-SEC-A',
  },
  {
    control: 'Checkpoint manifest signing',
    gateCriterion: 'GC-B4',
    proven:
      'A checkpoint with an invalid manifest signature is rejected with PermissionDenied. Verification occurs before extraction — unverified bytes never reach the staging extract step.',
    adr: 'ADR-SEC-B',
  },
  {
    control: 'Transfer integrity (wire hash)',
    gateCriterion: 'GC-B5',
    proven:
      'A wire-hash mismatch on the transferred checkpoint is rejected with DataLoss before decompression, so corrupt or tampered payloads are never expanded on disk.',
    adr: 'ADR-SEC-B',
  },
  {
    control: 'migration_uid socket-state anti-replay',
    gateCriterion: 'GC-B6',
    proven:
      'A checkpoint bearing a valid signature but a stale migration_uid is rejected with PermissionDenied. Socket state is bound to the specific migration, so a legitimately signed checkpoint from one migration cannot be replayed into another.',
    adr: 'ADR-SEC-B / ADR-SEC-D',
  },
  {
    control: 'SPIFFE identity verification on operator dial',
    gateCriterion: 'GC-B2',
    proven:
      "The operator dials by node IP; the agent certificate carries only a SPIFFE URI SAN. Resolution is identity verification, not coordinate binding: a custom VerifyPeerCertificate verifies the chain against RootCAs and exact-matches spiffe://podmotion.io/ns/<ns>/sa/podmotion-agent. Proven live — the operator logs peer-verified four times per migration.",
    adr: 'ADR-SEC-C',
  },
  {
    control: 'Full live migration regression with security stack active',
    gateCriterion: 'GC-B7 / GC-B8',
    proven:
      'With every control above active, migration gcb7-final-migration ran to Phase=Complete and the stateful workload’s in-memory counter (gcb7:counter=42) was restored intact. TrafficVerified=True was reached before the source pod was deleted; the checkpoint tmpfs remained mode 0700 throughout. All 22/22 Phase A cold-path assertions continue to pass — zero regression.',
    adr: 'GC-B7 / GC-B8',
  },
];

// ── Section 2 data ────────────────────────────────────────────────────────────

interface RoadmapItem {
  gap: string;
  adr: string;
  adrStatus: BadgeKind;
  targetMilestone: string;
  doneWhen: string;
}

const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    gap: 'Agent privilege containment: node-agent runs privileged:true with 8 capabilities and no seccomp. Must be reduced to the minimal CRIU/eBPF set with a deny-by-default seccomp profile.',
    adr: 'ADR-0148',
    adrStatus: 'accepted-unimpl',
    targetMilestone: 'M-SEC-1',
    doneWhen:
      'Chart ships privileged:false with 5-capability set (SYS_PTRACE, SYS_ADMIN, NET_ADMIN, BPF, PERFMON) + trace-derived Localhost seccomp profile, validated across 8 beta workloads (ADR-0148 C6).',
  },
  {
    gap: 'Checkpoint encryption at rest: checkpoints are plaintext on tmpfs today. ADR-0029 was dead code from acceptance; ADR-0160 is the authoritative forward plan.',
    adr: 'ADR-0160',
    adrStatus: 'draft',
    targetMilestone: 'Sprint 33+',
    doneWhen:
      'CheckpointCrypto provider wired so plaintext never touches disk; key ref recorded in MigrationCheckpoint.status.',
  },
  {
    gap: 'Webhook + agent TLS lifecycle: cert-manager path is stubbed and gRPC mTLS fails open. No Certificate/Issuer ships in the chart.',
    adr: 'ADR-0159 (Draft) / ADR-0079 (Accepted)',
    adrStatus: 'draft',
    targetMilestone: 'Sprint 33+',
    doneWhen:
      'cert-manager inject-ca-from auto-injects caBundle with no manual patch; gRPC mTLS fails CLOSED.',
  },
  {
    gap: 'Default RBAC: no least-privilege ClusterRoles ship in the Helm chart. Operators provision bindings manually.',
    adr: 'ADR-0078 / ADR-0161 C2',
    adrStatus: 'accepted-unimpl',
    targetMilestone: 'Pre-GA',
    doneWhen:
      'migration-operator and migration-reader ClusterRoles shipped in the chart with no manual provisioning required.',
  },
  {
    gap: 'Supply chain integrity: no signed images, no SBOM, no SLSA provenance for any released artifact.',
    adr: 'ADR-0077 (supersedes ADR-0103)',
    adrStatus: 'accepted-unimpl',
    targetMilestone: 'Pre-GA',
    doneWhen:
      'Signed images (cosign keyless) + CycloneDX SBOM (syft) + SLSA L2 provenance verifiable for every release artifact.',
  },
  {
    gap: 'Structured audit log: audit/ directory is a stub; no per-migration CheckpointWritten event is emitted.',
    adr: 'ADR-0161 C1',
    adrStatus: 'draft',
    targetMilestone: 'Pre-GA (Sprint 33-35)',
    doneWhen:
      'Structured per-migration audit record emitted; CheckpointWritten event present and queryable.',
  },
  {
    gap: 'CNCF Security TAG self-assessment: required blocking gate for sandbox submission. No assessment filed yet.',
    adr: 'ADR-0161 C5',
    adrStatus: 'draft',
    targetMilestone: 'Pre-M29 (BLOCKING sandbox gate)',
    doneWhen:
      'CNCF Security TAG self-assessment submitted and accepted as part of sandbox application.',
  },
];

// ── Section 3 data ────────────────────────────────────────────────────────────

interface SprintLogRow {
  sprint: string;
  date: string;
  securityWork: string;
  adrsAdvanced: string;
}

const SPRINT_LOG: SprintLogRow[] = [
  {
    sprint: 'Sprint 34 (Phase B)',
    date: '2026-06-16',
    securityWork:
      'gRPC control-plane security hardening PROVEN — 8/8 Phase B gate criteria (GC-B1 through GC-B8). mTLS enforced + fail-closed (operator CrashLoopBackOff with no TLS material, never falls back to plaintext); per-RPC SPIFFE-identity authorization (wrong-role caller rejected PermissionDenied); 512 MiB gRPC size caps + 2 GiB decompression cap (537 MB rejected ResourceExhausted); signed checkpoint manifests verified before extraction (bad signature rejected PermissionDenied); wire-hash transfer integrity (mismatch rejected DataLoss before decompression); migration_uid socket-state anti-replay (stale UID rejected PermissionDenied). Full live-migration regression (GC-B7) ran to Phase=Complete with the full security stack active, in-memory counter restored intact; all 22/22 Phase A cold-path assertions still pass — zero regression. TrafficVerified=True before source teardown and checkpoint tmpfs 0700 held throughout (GC-B8). These controls harden the operator↔agent gRPC channel on the gate cluster; cert lifecycle, checkpoint-at-rest encryption, SBOM, and default RBAC remain unimplemented.',
    adrsAdvanced:
      'ADR-SEC-A (mTLS + per-RPC authz + size caps); ADR-SEC-B (signed checkpoint provenance + anti-replay); ADR-SEC-C (SPIFFE identity verification on operator dial); ADR-SEC-D (migration_uid CR-binding namespace resolution)',
  },
  {
    sprint: 'M-SEC-1',
    date: '2026-06-14',
    securityWork:
      'ADR-0148 Agent Privilege Containment ACCEPTED via tier-14 thrix (2 Opus architects + 7 agents); supersedes REJECTED ADR-0106; per-capability justification table + trace-derived seccomp strategy ratified. Decision advance only — no code shipped.',
    adrsAdvanced: 'ADR-0148 Draft -> Accepted; ADR-0106 Rejected',
  },
  {
    sprint: 'Sprint 32',
    date: '2026-06-16',
    securityWork:
      'Sprint 32 GATE PASS 21/22 (GC-21 expected fail per ADR-0166 — kind substrate). Cold-path CRIU restore baseline proven on amd64. ADR-0183 r1 ACCEPTED: CRIU wrapper host install via DaemonSet init container to /opt/podmotion/bin with image-digest verification; Security hard block (r0) resolved in r1 after Security Reviewer DECLINE on initial proposal (missing digest verification). ADR-0166 scope exclusion confirmed by Security Reviewer: iptables-restore post-resume in kind netns is a substrate defect, not a PodMotion security surface. No additional security controls shipped; no privilege reduction in this sprint. Gate close commit: 8c16993.',
    adrsAdvanced: 'ADR-0183 r1 Accepted (image-digest verification); ADR-0184, ADR-0185 r1, ADR-0186, ADR-0187a, ADR-0188, ADR-0189, ADR-0190, ADR-0191 Accepted (correctness/restore path); ADR-0187 Superseded',
  },
  {
    sprint: 'Pre-Sprint 33 (Draft)',
    date: '2026-06',
    securityWork:
      'ADR-0159 (cert-manager/ACME webhook TLS), ADR-0160 (checkpoint encryption), ADR-0161 (compliance planning C1-C5) drafted, feeding platform-readiness workstream. These are planning advances — no decisions ratified, no code shipped.',
    adrsAdvanced: 'ADR-0159 Draft; ADR-0160 Draft; ADR-0161 Draft',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function SecurityPosture() {
  return (
    <section
      id="security-posture"
      aria-labelledby="security-posture-heading"
      className="bg-pm-navy-950 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* HEADER */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-pm-cyan-400">
            Security posture
          </p>
          <h2
            id="security-posture-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-pm-white sm:text-4xl"
          >
            Honest security disclosure
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-pm-slate-300">
            PodMotion is an alpha-stage project. This page tells security evaluators, CISOs,
            and CNCF TAG-Security reviewers exactly what is and is not implemented today —
            traced to ADRs, not marketing copy. Every claim is backed by an ADR citation and
            a three-state badge (Implemented / Accepted-unimplemented / Draft).
          </p>
        </div>

        {/* BADGE LEGEND */}
        <div className="mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2">
            <Badge kind="implemented" />
            <span className="text-xs text-pm-slate-400">Accepted ADR + committed proof artifact + not dead code</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge kind="accepted-unimpl" />
            <span className="text-xs text-pm-slate-400">Ratified design, no shipped code</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge kind="dead-code" />
            <span className="text-xs text-pm-slate-400">Accepted ADR, code path never wired</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge kind="draft" />
            <span className="text-xs text-pm-slate-400">ADR not yet ratified — plan, not a commitment</span>
          </div>
        </div>

        {/* ── SECTION 1 ── Current security posture ───────────────────────── */}
        <div className="mx-auto mt-16 max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-pm-cyan-400">
            Section 1
          </p>
          <h3 className="mt-1 text-2xl font-bold text-pm-white">
            Current security posture
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-pm-slate-400">
            Every row is ADR-traced. Amber flags appear on every row where the control is not
            yet implemented.
          </p>

          <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/[0.06] px-4 py-4 text-sm leading-relaxed text-pm-slate-300">
            Primary adoption blocker, stated plainly: the node-agent DaemonSet runs privileged:true with hostPID:true, a read-write containerd socket, and Unconfined seccomp on every node including control-plane nodes. A compromised agent is effectively node-root (RW containerd socket + SYS_ADMIN + SYS_PTRACE in the host PID namespace). This is a deliberate, disclosed alpha trade-off required for CRIU checkpoint/restore; ADR-0148 (Accepted, unimplemented) is the hardening plan to remove it. See the privilege row below.
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {POSTURE_ROWS.map((row) => (
              <div
                key={row.surface}
                className={`rounded-xl border bg-pm-navy-900 p-5 sm:p-6 ${
                  row.adrStatus === 'implemented'
                    ? 'border-emerald-500/30'
                    : row.adrStatus === 'dead-code'
                    ? 'border-amber-500/30'
                    : row.adrStatus === 'draft'
                    ? 'border-slate-600/50'
                    : 'border-pm-navy-700'
                }`}
              >
                {/* Surface + badge row */}
                <div className="flex flex-wrap items-start gap-3">
                  <span className="rounded-md bg-pm-navy-800 px-2 py-0.5 font-mono text-xs font-medium text-pm-cyan-300 ring-1 ring-inset ring-pm-navy-600">
                    {row.surface}
                  </span>
                  <Badge kind={row.adrStatus} />
                </div>

                {/* Grid: current state | ADR | milestone */}
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">
                      Current state
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-pm-slate-300">
                      {row.currentState}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">
                      Remediation ADR
                    </p>
                    <p className="mt-1 font-mono text-xs leading-relaxed text-pm-slate-300">
                      {row.remediationAdr}
                    </p>
                    {row.adrStatusLabel && (
                      <p className="mt-1 text-xs text-pm-slate-400">
                        {row.adrStatusLabel}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">
                      Target milestone
                    </p>
                    <p className="mt-1 font-mono text-xs text-pm-slate-300">
                      {row.targetMilestone}
                    </p>
                  </div>
                </div>

                {/* Expanded note */}
                {row.note && (
                  <div className="mt-3 rounded-lg border border-pm-navy-700 bg-pm-navy-950/60 px-3 py-2">
                    <p className="text-xs leading-relaxed text-pm-slate-400">{row.note}</p>
                  </div>
                )}

                {/* Amber flag */}
                {row.flagText && <AmberFlag text={row.flagText} />}
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 1b ── Sprint 34 Phase B — proven control-plane security ─ */}
        <div className="mx-auto mt-20 max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-pm-cyan-400">
            Section 1b
          </p>
          <h3 className="mt-1 text-2xl font-bold text-pm-white">
            Current security posture — Sprint 34 proven (gRPC control plane)
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-pm-slate-400">
            Sprint 34 Phase B hardened the operator&rarr;agent gRPC control plane and proved each
            control against a gate criterion (GC-B1 through GC-B8) on the same cluster as the
            Sprint 33 cold-path proof. Every claim below traces to the Sprint 34 gate record and a
            security ADR (ADR-SEC-A through ADR-SEC-D). The full live-migration regression ran with
            the complete security stack active — zero regression; all 22/22 Phase A cold-path
            assertions continue to pass.
          </p>

          <div className="mt-6 rounded-lg border border-emerald-500/30 bg-emerald-500/[0.06] px-4 py-4 text-sm leading-relaxed text-pm-slate-300">
            Scope note: these controls are proven on the gate cluster (kind, kindnet, amd64,
            kernel 6.17) as the Sprint 34 Phase B deliverable. They harden the operator&harr;agent
            gRPC channel specifically. The shipping v0.1.0-alpha Helm chart posture, certificate
            lifecycle (issuance/rotation), checkpoint encryption at rest, SBOM/signed-image supply
            chain, and default RBAC remain as stated in the rows above and below — those are not yet
            implemented.
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {PROVEN_ROWS.map((row) => (
              <div
                key={row.control}
                className="rounded-xl border border-emerald-500/30 bg-pm-navy-900 p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start gap-3">
                  <span className="rounded-md bg-pm-navy-800 px-2 py-0.5 font-mono text-xs font-medium text-pm-cyan-300 ring-1 ring-inset ring-pm-navy-600">
                    {row.control}
                  </span>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset bg-emerald-500/10 text-emerald-300 ring-emerald-500/30">
                    {row.gateCriterion} PASS
                  </span>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-4">
                  <div className="sm:col-span-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">
                      Proven (Sprint 34 gate record)
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-pm-slate-300">
                      {row.proven}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">
                      Security ADR
                    </p>
                    <p className="mt-1 font-mono text-xs text-pm-slate-300">{row.adr}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs italic text-pm-slate-500">
            Honest boundary: certificate issuance/rotation is not yet automated (fail-closed posture
            must currently be maintained across rotation by hand); checkpoint encryption at rest,
            SBOM, signed images, and SLSA provenance remain not implemented. See the rows above and
            the roadmap below.
          </p>
        </div>

        {/* ── SECTION 2 ── Remediation roadmap ────────────────────────────── */}
        <div className="mx-auto mt-20 max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-pm-cyan-400">
            Section 2
          </p>
          <h3 className="mt-1 text-2xl font-bold text-pm-white">
            Remediation roadmap (ADR-linked)
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-pm-slate-400">
            Ordered by risk priority. Each item states the gap in plain language, the owning
            ADR, the current ADR status, the target milestone, and the proof criterion that
            defines done.
          </p>

          <ol className="mt-8 flex flex-col gap-4">
            {ROADMAP_ITEMS.map((item, idx) => (
              <li
                key={item.adr}
                className="rounded-xl border border-pm-navy-700 bg-pm-navy-900 p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-pm-navy-800 font-mono text-xs font-bold text-pm-cyan-300 ring-1 ring-pm-navy-600">
                    {idx + 1}
                  </span>
                  <span className="rounded-md bg-pm-navy-800 px-2 py-0.5 font-mono text-xs font-medium text-pm-cyan-300 ring-1 ring-inset ring-pm-navy-600">
                    {item.adr}
                  </span>
                  <Badge kind={item.adrStatus} />
                  <span className="ml-auto font-mono text-xs text-pm-slate-400">
                    {item.targetMilestone}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-pm-slate-300">{item.gap}</p>

                <div className="mt-3 rounded-lg border border-pm-navy-700 bg-pm-navy-950/60 px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">
                    Done looks like
                  </p>
                  <p className="mt-0.5 font-mono text-xs leading-relaxed text-pm-slate-300">
                    {item.doneWhen}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* ── SECTION 2.5 ── Compliance framework planning (ADR-0161, Draft) ── */}
        <div className="mx-auto mt-20 max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-pm-cyan-400">
            Section 2.5
          </p>
          <h3 className="mt-1 text-2xl font-bold text-pm-white">
            Compliance framework planning (ADR-0161, Draft)
          </h3>

          {/* Mandatory leading disclaimer — SITE-ADR-001 Rule 1, verbatim-locked */}
          <div className="mt-4 rounded-xl border border-slate-600/50 bg-slate-500/[0.06] px-5 py-4">
            <p className="text-sm leading-relaxed text-slate-200/90">
              PodMotion is infrastructure software, not a certified service — it cannot itself be
              certified. ADR-0161 (Draft, post-beta) exists so PodMotion does not structurally block a
              customer&apos;s certification and makes auditor evidence collection possible. Nothing below
              is implemented today.
            </p>
          </div>

          {/* Framework table */}
          <div className="mt-8 overflow-x-auto rounded-xl border border-pm-navy-700">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-pm-navy-700 bg-pm-navy-900">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">Framework</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">What it means for PodMotion</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">Current gap</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">Controlling ADR(s)</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">Status</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">Target milestone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pm-navy-800 bg-pm-navy-950/40">
                {/* Row 1 — CNCF Security TAG self-assessment (BLOCKING) */}
                <tr className="align-top">
                  <td className="px-4 py-4 font-mono text-xs font-medium text-pm-cyan-300 whitespace-nowrap">CNCF Security TAG self-assessment</td>
                  <td className="px-4 py-4 text-xs leading-relaxed text-pm-slate-300">Required for sandbox graduation; gates on ADR-0159 + ADR-0160</td>
                  <td className="px-4 py-4 text-xs leading-relaxed text-pm-slate-300">not drafted/submitted</td>
                  <td className="px-4 py-4 font-mono text-xs text-pm-slate-400">ADR-0159, ADR-0160, ADR-0161</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <Badge kind="draft" />
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset bg-red-500/10 text-red-300 ring-red-500/30">
                        BLOCKING
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-pm-slate-400 whitespace-nowrap">Pre-GA (Sprint 33-35)</td>
                </tr>
                {/* Row 2 — SOC 2 Type II */}
                <tr className="align-top">
                  <td className="px-4 py-4 font-mono text-xs font-medium text-pm-cyan-300 whitespace-nowrap">SOC 2 Type II</td>
                  <td className="px-4 py-4 text-xs leading-relaxed text-pm-slate-300">audit log per migration op, checkpoint encryption, RBAC-controlled CRs, auditable operator</td>
                  <td className="px-4 py-4 text-xs leading-relaxed text-pm-slate-300">no structured audit log, no default RBAC, checkpoints plaintext</td>
                  <td className="px-4 py-4 font-mono text-xs text-pm-slate-400">ADR-0161 C1/C2/C3, ADR-0078</td>
                  <td className="px-4 py-4"><Badge kind="draft" /></td>
                  <td className="px-4 py-4 font-mono text-xs text-pm-slate-400 whitespace-nowrap">GA+3mo readiness</td>
                </tr>
                {/* Row 3 — ISO 27001 */}
                <tr className="align-top">
                  <td className="px-4 py-4 font-mono text-xs font-medium text-pm-cyan-300 whitespace-nowrap">ISO 27001</td>
                  <td className="px-4 py-4 text-xs leading-relaxed text-pm-slate-300">overlaps SOC 2; small gap once SOC 2 controls in place</td>
                  <td className="px-4 py-4 text-xs leading-relaxed text-pm-slate-300">inherits SOC 2 gaps</td>
                  <td className="px-4 py-4 font-mono text-xs text-pm-slate-400">ADR-0161</td>
                  <td className="px-4 py-4"><Badge kind="draft" /></td>
                  <td className="px-4 py-4 font-mono text-xs text-pm-slate-400 whitespace-nowrap">GA+6mo gap analysis</td>
                </tr>
                {/* Row 4 — HIPAA */}
                <tr className="align-top">
                  <td className="px-4 py-4 font-mono text-xs font-medium text-pm-cyan-300 whitespace-nowrap">HIPAA</td>
                  <td className="px-4 py-4 text-xs leading-relaxed text-pm-slate-300">checkpoint encryption (ADR-0160), access logging; no structural block on a BAA</td>
                  <td className="px-4 py-4 text-xs leading-relaxed text-pm-slate-300">checkpoints plaintext, audit stub</td>
                  <td className="px-4 py-4 font-mono text-xs text-pm-slate-400">ADR-0160, ADR-0161 C1/C3</td>
                  <td className="px-4 py-4"><Badge kind="draft" /></td>
                  <td className="px-4 py-4 font-mono text-xs text-pm-slate-400 whitespace-nowrap">GA+12mo alignment</td>
                </tr>
                {/* Row 5 — PCI DSS v4.0 */}
                <tr className="align-top">
                  <td className="px-4 py-4 font-mono text-xs font-medium text-pm-cyan-300 whitespace-nowrap">PCI DSS v4.0</td>
                  <td className="px-4 py-4 text-xs leading-relaxed text-pm-slate-300">checkpoint storage configurable/auditable, no cardholder data outside CDE, network segmentation</td>
                  <td className="px-4 py-4 text-xs leading-relaxed text-pm-slate-300">checkpoint storage location not exposed in MigrationCheckpoint status</td>
                  <td className="px-4 py-4 font-mono text-xs text-pm-slate-400">ADR-0160, ADR-0161 C3/C5/C6</td>
                  <td className="px-4 py-4"><Badge kind="draft" /></td>
                  <td className="px-4 py-4 font-mono text-xs text-pm-slate-400 whitespace-nowrap">GA+12mo alignment</td>
                </tr>
                {/* Row 6 — FedRAMP Moderate */}
                <tr className="align-top">
                  <td className="px-4 py-4 font-mono text-xs font-medium text-pm-cyan-300 whitespace-nowrap">FedRAMP Moderate</td>
                  <td className="px-4 py-4 text-xs leading-relaxed text-pm-slate-300">FIPS 140-2 validated crypto, continuous monitoring, SSP</td>
                  <td className="px-4 py-4 text-xs leading-relaxed text-pm-slate-300">no FIPS build path</td>
                  <td className="px-4 py-4 font-mono text-xs text-pm-slate-400">ADR-0161 C4/C6 (FIPS)</td>
                  <td className="px-4 py-4"><Badge kind="draft" /></td>
                  <td className="px-4 py-4 font-mono text-xs text-pm-slate-400 whitespace-nowrap">GA+18mo</td>
                </tr>
                {/* Row 7 — NIS2 (EU) */}
                <tr className="align-top">
                  <td className="px-4 py-4 font-mono text-xs font-medium text-pm-cyan-300 whitespace-nowrap">NIS2 (EU)</td>
                  <td className="px-4 py-4 text-xs leading-relaxed text-pm-slate-300">incident reporting, supply chain</td>
                  <td className="px-4 py-4 text-xs leading-relaxed text-pm-slate-300">no SBOM/signing/SLSA</td>
                  <td className="px-4 py-4 font-mono text-xs text-pm-slate-400">ADR-0160 audit trail, ADR-0159 cert lifecycle, ADR-0077</td>
                  <td className="px-4 py-4"><Badge kind="draft" /></td>
                  <td className="px-4 py-4 font-mono text-xs text-pm-slate-400 whitespace-nowrap">post-GA</td>
                </tr>
                {/* Row 8 — CSA STAR */}
                <tr className="align-top">
                  <td className="px-4 py-4 font-mono text-xs font-medium text-pm-cyan-300 whitespace-nowrap">CSA STAR</td>
                  <td className="px-4 py-4 text-xs leading-relaxed text-pm-slate-300">documentation-based once SOC 2 in place</td>
                  <td className="px-4 py-4 text-xs leading-relaxed text-pm-slate-300">follows SOC 2</td>
                  <td className="px-4 py-4 font-mono text-xs text-pm-slate-400">ADR-0161</td>
                  <td className="px-4 py-4"><Badge kind="draft" /></td>
                  <td className="px-4 py-4 font-mono text-xs text-pm-slate-400 whitespace-nowrap">post-SOC2</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ADR-0161 architectural controls (C1–C6) */}
          <h4 className="mt-12 text-lg font-bold text-pm-white">
            ADR-0161 architectural controls (C1–C6)
          </h4>
          <div className="mt-4 overflow-x-auto rounded-xl border border-pm-navy-700">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-pm-navy-700 bg-pm-navy-900">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">Control</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">Framework controls</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pm-navy-800 bg-pm-navy-950/40">
                <tr className="align-top">
                  <td className="px-4 py-4 font-mono text-xs font-medium text-pm-cyan-300">C1 Structured audit log per migration op</td>
                  <td className="px-4 py-4 font-mono text-xs leading-relaxed text-pm-slate-300">SOC 2 CC6, HIPAA §164.312(b), PCI DSS Req 10, FedRAMP AU-2/AU-3</td>
                  <td className="px-4 py-4 text-xs text-amber-300/90">stub today</td>
                </tr>
                <tr className="align-top">
                  <td className="px-4 py-4 font-mono text-xs font-medium text-pm-cyan-300">C2 RBAC-gated PodMigration CR ops</td>
                  <td className="px-4 py-4 font-mono text-xs leading-relaxed text-pm-slate-300">SOC 2 CC6, PCI DSS Req 7/8, FedRAMP AC-2/AC-3</td>
                  <td className="px-4 py-4 text-xs text-amber-300/90">no default RBAC ships</td>
                </tr>
                <tr className="align-top">
                  <td className="px-4 py-4 font-mono text-xs font-medium text-pm-cyan-300">C3 Checkpoint encryption at rest+in transit (ADR-0160)</td>
                  <td className="px-4 py-4 font-mono text-xs leading-relaxed text-pm-slate-300">HIPAA §164.312(a)(2)(iv), PCI DSS Req 3.4, FedRAMP SC-28, SOC 2 CC9</td>
                  <td className="px-4 py-4 text-xs text-amber-300/90">plaintext today</td>
                </tr>
                <tr className="align-top">
                  <td className="px-4 py-4 font-mono text-xs font-medium text-pm-cyan-300">C4 gRPC mTLS operator&#8596;agent (ADR-0159/ADR-0161-C4)</td>
                  <td className="px-4 py-4 font-mono text-xs leading-relaxed text-pm-slate-300">SOC 2 CC6, FedRAMP SC-8, HIPAA §164.312(e)(2)(ii), PCI DSS Req 4.2</td>
                  <td className="px-4 py-4 text-xs text-amber-300/90">fails open today</td>
                </tr>
                <tr className="align-top">
                  <td className="px-4 py-4 font-mono text-xs font-medium text-pm-cyan-300">C5 Checkpoint data residency / storage location control</td>
                  <td className="px-4 py-4 font-mono text-xs leading-relaxed text-pm-slate-300">GDPR Art.44, FedRAMP SC-28, PCI DSS Req 3</td>
                  <td className="px-4 py-4 text-xs text-amber-300/90">not exposed in MigrationCheckpoint.status</td>
                </tr>
                <tr className="align-top">
                  <td className="px-4 py-4 font-mono text-xs font-medium text-pm-cyan-300">C6 FIPS 140-2 validated crypto path</td>
                  <td className="px-4 py-4 font-mono text-xs leading-relaxed text-pm-slate-300">FedRAMP SC-13, NIST SP 800-175B</td>
                  <td className="px-4 py-4 text-xs text-amber-300/90">no FIPS build</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mandatory closing attestation — SITE-ADR-001 Rule 4, verbatim-locked */}
          <p className="mt-4 text-xs italic text-pm-slate-500">
            Every framework above is Draft / not implemented. A CISO can hand this table to a
            compliance team as a structural-readiness map, not a certification claim.
          </p>
        </div>

        {/* ── SECTION 3 ── Sprint-by-sprint security progress ─────────────── */}
        <div className="mx-auto mt-20 max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-pm-cyan-400">
            Section 3
          </p>
          <h3 className="mt-1 text-2xl font-bold text-pm-white">
            Sprint-by-sprint security progress
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-pm-slate-400">
            Records ADR decision advances only — thrix passage, status transitions, supersessions.
            An entry here does not mean a control shipped; it means a decision was ratified.
          </p>

          <div className="mt-8 overflow-x-auto rounded-xl border border-pm-navy-700">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-pm-navy-700 bg-pm-navy-900">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">
                    Sprint / Milestone
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">
                    Security work completed
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-pm-slate-500">
                    ADRs advanced
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pm-navy-800 bg-pm-navy-950/40">
                {SPRINT_LOG.map((row) => (
                  <tr key={row.sprint} className="align-top">
                    <td className="whitespace-nowrap px-4 py-4 font-mono text-xs font-medium text-pm-cyan-300">
                      {row.sprint}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 font-mono text-xs text-pm-slate-400">
                      {row.date}
                    </td>
                    <td className="px-4 py-4 text-xs leading-relaxed text-pm-slate-300">
                      {row.securityWork}
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-pm-slate-400">
                      {row.adrsAdvanced}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs italic text-pm-slate-500">
            This log is updated at each sprint closure.
          </p>
        </div>

        {/* ── SECTION 4 ── Security contact and disclosure ─────────────────── */}
        <div className="mx-auto mt-20 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-pm-cyan-400">
            Section 4
          </p>
          <h3 className="mt-1 text-2xl font-bold text-pm-white">
            Security contact and disclosure
          </h3>

          <div className="mt-6 rounded-2xl border border-pm-navy-700 bg-pm-navy-900 p-6 sm:p-8">

            {/* SECURITY.md note */}
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/[0.06] px-4 py-3">
              <p className="text-sm leading-relaxed text-emerald-200/90">
                <span className="font-semibold">SECURITY.md</span> is authored (ADR-0077 s4) and
                publicly available on the{' '}
                <a
                  href="https://github.com/podmotion-io/podmotion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-emerald-100"
                >
                  podmotion-io/podmotion repository
                </a>
                .
              </p>
            </div>

            {/* Reporting */}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-pm-slate-500">
                How to report a vulnerability
              </p>
              <ul className="mt-3 space-y-2.5">
                <li className="flex gap-3 text-sm leading-relaxed text-pm-slate-300">
                  <svg
                    aria-hidden
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-pm-cyan-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                  </svg>
                  <span>
                    Open a{' '}
                    <strong className="text-pm-white">GitHub private security advisory</strong>{' '}
                    on the repository with a description and reproduction steps. Use GPG encryption if the report
                    includes a working exploit.
                  </span>
                </li>
                <li className="flex gap-3 text-sm leading-relaxed text-pm-slate-300">
                  <svg
                    aria-hidden
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                  <span>
                    <strong className="text-pm-white">Do NOT open a public issue</strong> for any
                    potential security vulnerability. Public disclosure before a coordinated patch
                    release harms all users.
                  </span>
                </li>
              </ul>
            </div>

            {/* SLA */}
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

            {/* Single-maintainer honesty (ADR-0091) */}
            <div className="mt-4 flex gap-3 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-3">
              <span aria-hidden className="mt-0.5 text-indigo-300">&#9432;</span>
              <p className="text-xs leading-relaxed text-indigo-200/90">
                72h acknowledgment and 90-day fix are best-effort targets under single-maintainer
                staffing (ADR-0091). Coordinated disclosure with simultaneous patch and public
                release is the default process; timeline may extend for high-complexity
                vulnerabilities.
              </p>
            </div>

            {/* Links */}
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="https://docs.podmotion.io/docs/architecture/security"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-pm-cyan-300 underline transition-colors hover:text-pm-cyan-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 3h6v6" />
                  <path d="M10 14 21 3" />
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                </svg>
                Full security architecture documentation
              </a>
              <a
                href="https://github.com/podmotion-io/podmotion/blob/main/SECURITY.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-pm-cyan-300 underline transition-colors hover:text-pm-cyan-400"
              >
                SECURITY.md on GitHub
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

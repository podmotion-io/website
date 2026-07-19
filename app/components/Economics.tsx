'use client';

import React, { useState } from 'react';
import { TrendingDown, Info, AlertTriangle } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string;
  plain: string;
  source: string;
}

interface ExecSavingsRowProps {
  category: string;
  midsize: string;
  enterprise: string;
}

// ── Shared metric data (plain-language translations for both audiences) ────────

const metrics: MetricCardProps[] = [
  {
    label: 'Server capacity actually in use',
    value: '8–13%',
    plain:
      'For every $100 you spend on cloud compute, roughly $87–$92 sits in reserve — paid for, idle, waiting for a peak that rarely arrives.',
    source: 'CAST AI, 4,000-cluster study (2025–2026)',
  },
  {
    label: 'Organizations where overprovisioning is the #1 cost driver',
    value: '70%',
    plain:
      'The root cause is structural, not a configuration problem. You cannot consolidate servers if moving an app requires restarting it.',
    source: 'CNCF FinOps Microsurvey, Dec 2023',
  },
  {
    label: 'Average cost of a major infrastructure incident',
    value: '$794K',
    plain:
      'Typical organization: 25 high-priority incidents per year. Industry research attributes 79% of production incidents to recent system changes (Komodor 2025) — including routine maintenance events. PodMotion\'s thesis: fewer restart-driven change events means fewer incident triggers. This figure is the single input used in the incident-cost row of the savings model below — it appears here as a shared reference metric and in that row as a per-incident unit cost; it is not two independent data points.',
    source: 'PagerDuty State of Digital Operations 2024, n=500 IT leaders',
  },
  {
    label: 'Cloud discount available for interruptible capacity',
    value: '60–90%',
    plain:
      'Cloud providers sell spare capacity at steep discounts. Most enterprises cannot use it for anything important, because the provider can reclaim it on as little as 30 seconds’ notice — which means a restart.',
    source: 'AWS / GCP / Azure published spot pricing, June 2026 (varies by instance type and region)',
  },
];

// ── Finance & Leadership savings data ─────────────────────────────────────────

const execSavingsRows: ExecSavingsRowProps[] = [
  { category: 'Cloud compute — server consolidation', midsize: '$52K–$201K', enterprise: '$525K–$2.1M' },
  { category: 'Cloud compute — discounted spare capacity', midsize: '$84K–$168K', enterprise: '$420K–$840K' },
  { category: 'Monitoring and observability vendor fees', midsize: '$38K–$116K', enterprise: '$190K–$580K' },
  { category: 'Database vendor licensing (where applicable)', midsize: '$0–$340K', enterprise: '$1.1M–$1.8M' },
  { category: 'Engineering labor — maintenance windows', midsize: '$54K–$135K', enterprise: '$270K–$540K' },
  { category: 'Incident cost reduction', midsize: '$159K–$397K', enterprise: '$794K–$1.98M' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function MetricCard({ label, value, plain, source }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-pm-navy-700 bg-pm-navy-900 p-6 flex flex-col gap-3">
      <p className="text-sm font-medium text-pm-slate-400 uppercase tracking-wider leading-snug">
        {label}
      </p>
      <p className="text-4xl font-bold text-pm-cyan-400 leading-none">{value}</p>
      <p className="text-sm text-pm-slate-300 leading-relaxed">{plain}</p>
      <p className="text-xs text-pm-slate-400 italic mt-auto pt-2 border-t border-pm-navy-700">
        {source}
      </p>
    </div>
  );
}

function ExecSavingsRow({ category, midsize, enterprise }: ExecSavingsRowProps) {
  return (
    <tr className="border-b border-pm-navy-700 last:border-b-0">
      <td className="py-4 pr-6 text-sm text-pm-slate-300 align-top">{category}</td>
      <td className="py-4 pr-6 text-sm font-mono font-semibold text-pm-cyan-400 align-top whitespace-nowrap">
        {midsize}
      </td>
      <td className="py-4 text-sm font-mono font-semibold text-pm-cyan-300 align-top whitespace-nowrap">
        {enterprise}
      </td>
    </tr>
  );
}

// ── Finance & Leadership tab ──────────────────────────────────────────────────

function ExecPanel() {
  return (
    <div className="space-y-14">

      {/* Prior art */}
      <div className="rounded-xl border border-pm-cyan-500/20 bg-pm-navy-900/60 p-8">
        <h3 className="text-lg font-semibold text-white mb-3">
          This problem was already solved once — for the previous generation of infrastructure
        </h3>
        <p className="text-base text-pm-slate-300 leading-relaxed">
          In the early 2000s, physical data centers ran at 5–15% utilization for the same reason
          Kubernetes clusters do today: moving a running workload meant shutting it down first. Once
          live server migration arrived, teams went from one workload per server to ten or fifteen,
          maintenance windows shrank from weekends to minutes, and infrastructure costs fell —
          without touching application code. Container infrastructure is at the same inflection
          point, and PodMotion applies the same capability class to the current generation. The
          three cost mechanisms in the savings model below — compute, vendor licensing, and
          maintenance — all follow from a single change: applications no longer have to restart to
          move.
        </p>
      </div>

      {/* Savings table */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Projected annual savings — planning model
        </h3>
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
          Modeled projection — not a PodMotion-measured outcome
        </p>
        <p className="text-sm text-pm-slate-400 mb-6">
          <strong className="text-pm-slate-300">Mid-size:</strong> 100–200 servers, standard
          cloud on-demand pricing, 3-person infrastructure team, four maintenance cycles per
          year.&nbsp;&nbsp;
          <strong className="text-pm-slate-300">Enterprise:</strong> 500–2,000 servers, mixed
          workload, commercial database licensing applicable, 8+ person infrastructure team.
          All figures are modeled projections from publicly available industry research (CAST AI
          2025–2026, PagerDuty 2024, Komodor 2025, AWS/GCP/Azure published pricing June 2026,
          Fairwinds 2026 upgrade ops data). Not measured outcomes from PodMotion deployments.
        </p>
        <div className="overflow-x-auto rounded-xl border border-pm-navy-700">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-pm-navy-700 bg-pm-navy-800">
                <th className="py-4 px-4 text-left text-xs font-semibold uppercase tracking-wider text-pm-slate-400">
                  Savings category
                </th>
                <th className="py-4 px-4 text-left text-xs font-semibold uppercase tracking-wider text-pm-cyan-400">
                  Mid-size / yr
                </th>
                <th className="py-4 px-4 text-left text-xs font-semibold uppercase tracking-wider text-pm-cyan-300">
                  Enterprise / yr
                </th>
              </tr>
            </thead>
            <tbody className="bg-pm-navy-900">
              {execSavingsRows.map((row) => (
                <ExecSavingsRow key={row.category} {...row} />
              ))}
              <tr className="border-t-2 border-pm-cyan-500/40 bg-pm-navy-800">
                <td className="py-5 px-4 text-sm font-bold text-white">
                  Projected total (non-cumulative categories)
                </td>
                <td className="py-5 px-4 text-base font-bold font-mono text-pm-cyan-400">
                  $387K–$1.36M
                </td>
                <td className="py-5 px-4 text-base font-bold font-mono text-pm-cyan-300">
                  $3.3M–$7.8M
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-pm-slate-400">
          <strong className="text-pm-slate-300">How to read the total:</strong> Database licensing
          is excluded from the totals above — it applies only to organizations with per-processor
          commercial contracts, and overlaps with the compute row when the same nodes are
          decommissioned. Spot/preemptible compute and on-demand compute are alternative
          scenarios, not additive. Add them separately based on your actual workload split. Review
          which rows apply to your environment before summing.
        </p>
      </div>

    </div>
  );
}

// ── Platform Engineering tab ──────────────────────────────────────────────────

function TechPanel() {
  return (
    <div className="space-y-16">

      {/* Mechanism lead */}
      <div className="max-w-4xl space-y-6">
        <h3 className="text-2xl font-semibold text-white tracking-tight">
          The restart penalty is a structural constraint, not a config problem
        </h3>
        <p className="text-pm-slate-300 leading-relaxed">
          Every Kubernetes cost tool today — Karpenter, CAST AI, cluster-autoscaler — operates at
          one moment in the pod lifecycle: between workloads. They can right-size a new node before
          scheduling, but they cannot compact a running cluster without restarting the pods on it.
          That is the over-provisioning floor you cannot breach: operators keep headroom to absorb
          the restart storm, so clusters run at{' '}
          <span className="text-pm-cyan-400 font-medium">8–13% average CPU utilization</span>{' '}
          (CAST AI, 4,000-cluster dataset, 2025–2026) while the bill scales to the node ceiling.
        </p>
        <p className="text-pm-slate-300 leading-relaxed">
          Live pod migration changes the unit of compaction from "restart event" to "in-flight
          transfer." PodMotion moves a running pod — memory state, open connections, in-flight
          requests — to another node without terminating it. This is incremental to Karpenter and
          CAST AI: they bin-pack at scheduling time; PodMotion handles runtime compaction, closing
          the gap between what was optimal at pod start and what the cluster needs an hour later.
        </p>
      </div>

      {/* Three savings vectors */}
      <div className="max-w-4xl space-y-6">
        <h3 className="text-xl font-semibold text-white">Three independent savings vectors</h3>
        <p className="text-pm-slate-400 text-sm">
          Each vector is independently real. PodMotion activates all three simultaneously.
        </p>

        <div className="bg-pm-navy-800 border border-pm-navy-700 rounded-lg p-6 space-y-3">
          <div className="flex items-start gap-4">
            <span className="text-pm-cyan-400 font-mono text-sm mt-0.5 shrink-0">01</span>
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-lg">
                Compute — node reduction and spot adoption
              </h4>
              <p className="text-pm-slate-300 leading-relaxed">
                Runtime compaction means fewer nodes carry the same workload. The theoretical
                consolidation ceiling is roughly 80% fewer nodes — but workload variance,
                memory profiles, and burst headroom mean modeled outcomes land in the{' '}
                <span className="text-pm-cyan-400 font-medium">20–40% node reduction</span>{' '}
                range for typical clusters (incremental over existing Karpenter/CAST AI compaction).
              </p>
              <p className="text-pm-slate-300 leading-relaxed">
                Spot/preemptible instances run at steep discounts to on-demand — AWS ~60–72%, GCP
                ~60–91%, Azure ~60–90% at published June 2026 rates — but stateful and
                latency-sensitive workloads cannot use them today because eviction means restart.
                PodMotion intercepts the eviction signal and migrates the pod to an on-demand node
                before reclamation, so the workload never restarts. The race it must win is the
                eviction window, and that window is the binding constraint: ~120 s on AWS but only
                ~30 s on GCP and Azure. Migration must complete inside that window, which requires
                per-workload profiling before production use.{' '}
                <code className="text-pm-cyan-400 bg-pm-navy-900 px-1.5 py-0.5 rounded">
                  tcpPreservationMode=Strict
                </code>{' '}
                (opt-in) preserves long-lived TCP sessions; the default (None) does not preserve
                TCP connections. Stateful spot use via live migration is mechanically sound but not
                yet validated at production scale.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-pm-navy-800 border border-pm-navy-700 rounded-lg p-6 space-y-3">
          <div className="flex items-start gap-4">
            <span className="text-pm-cyan-400 font-mono text-sm mt-0.5 shrink-0">02</span>
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-lg">
                Licensing — per-node billing drops with node count
              </h4>
              <p className="text-pm-slate-300 leading-relaxed">
                Most K8s observability and security tools bill per node: Datadog Infrastructure
                (per host), Dynatrace (host-unit / DPS model), Sysdig (per node). A 30% node
                reduction produces a 30% bill reduction on the next cycle — no config change,
                no renegotiation. For workloads subject to per-processor database licensing,
                live migration enables node isolation and affinity consolidation of licensed
                workloads onto a smaller core footprint. Database-specific compliance is outside
                PodMotion's scope; the savings are a side-effect of node reduction.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-pm-navy-800 border border-pm-navy-700 rounded-lg p-6 space-y-3">
          <div className="flex items-start gap-4">
            <span className="text-pm-cyan-400 font-mono text-sm mt-0.5 shrink-0">03</span>
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-lg">
                Operational — maintenance windows, drain risk, incidents
              </h4>
              <p className="text-pm-slate-300 leading-relaxed">
                Node drain during patching is a scheduled restart storm. Every pod on a draining
                node is evicted and rescheduled; stateful workloads and long-lived connection
                pools turn drain into a risk event requiring a maintenance window, on-call
                coverage, and rollback readiness. PodMotion replaces drain-triggered eviction
                with live migration — nodes empty while workloads continue running. The
                PagerDuty State of Digital Operations 2024 report cites a median{' '}
                <span className="text-pm-cyan-400 font-medium">$794K per major incident</span>{' '}
                for enterprise-scale orgs. Restart-driven incidents during patch cycles are a
                documented contributor.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What validation shows */}
      <div className="max-w-4xl space-y-6">
        <h3 className="text-xl font-semibold text-white">What the validation actually shows</h3>

        <div className="bg-pm-navy-800 border border-pm-navy-700 rounded-lg p-4 mb-4">
          <p className="text-xs text-pm-slate-400 leading-relaxed">
            <span className="font-semibold text-pm-slate-300">Proof scope:</span>{' '}
            the current authoritative end-to-end proof runs on a standing 3-node KVM/kubeadm
            cluster — amd64, Kubernetes&nbsp;v1.35.x (containerd), Cilium CNI&nbsp;v1.17.6 (geneve
            tunnel), CRIU&nbsp;4.2. No production deployments exist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-pm-navy-800 border border-green-700/40 rounded-lg p-5 space-y-3">
            <div className="text-xs uppercase tracking-widest text-green-400 font-medium">
              Proven now — single held connection
            </div>
            <ul className="space-y-2 text-pm-slate-300 text-sm leading-relaxed list-disc list-inside">
              <li>
                <code className="text-pm-cyan-400 font-mono">seq_delta=0</code> for a held TCP
                connection: a live redis connection under load migrated from one node to another in
                Strict mode with a measured TCP sequence delta of 0/0 (snd=0, rcv=0), 1/1
                connections verified byte-exact, reaching phase=Complete in 33&nbsp;s with a
                602&nbsp;ms freeze. Measured, not hard-coded.
              </li>
              <li>
                Single-flow TCP preservation with{' '}
                <code className="text-pm-cyan-400 font-mono">tcpPreservationMode=Strict</code>{' '}
                (opt-in) — the session survives without client-side reconnect logic.{' '}
                <code className="text-pm-cyan-400 font-mono">tcpPreservationMode</code> defaults to{' '}
                <code className="text-pm-cyan-400 font-mono">None</code>; TCP connections are not
                preserved by default.
              </li>
              <li>
                CRD-only interface — migration is initiated via a{' '}
                <code className="text-pm-cyan-400 font-mono">PodMigration</code> CR; there is no
                kubectl plugin in v0.1.0-alpha.
              </li>
            </ul>
          </div>

          <div className="bg-pm-navy-800 border border-amber-700/40 rounded-lg p-5 space-y-3">
            <div className="text-xs uppercase tracking-widest text-amber-400 font-medium">
              Not yet proven / modeled
            </div>
            <ul className="space-y-2 text-pm-slate-300 text-sm leading-relaxed list-disc list-inside">
              <li>
                The full goal — every container unaware, every client unaware, seq_delta=0
                end-to-end across multiple flows and containers — is not yet proven. This is a
                single-connection result; it does not carry to all flows or all workloads.
              </li>
              <li>
                The 80-run figure is a planned beta certification — 8 workload types &times; 5 runs
                &times; 2 environments (randomized AWS + local VM), targeting zero errors and zero
                warnings. It is planned, not yet executed.
              </li>
              <li>
                20–40% node reduction — extrapolated from utilization data and migration mechanics;
                no production cluster measurements yet.
              </li>
              <li>
                Spot adoption economics — discount rates are published and real; stateful spot use
                via live migration is mechanically sound but not validated at production scale.
              </li>
              <li>
                Storage migration (PVCs) is deferred to v1.2; it is not available in v0.1.0-alpha.
              </li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Economics() {
  const [activeTab, setActiveTab] = useState<'exec' | 'tech'>('exec');

  return (
    <section
      id="economics"
      className="relative w-full bg-pm-navy-950 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,transparent,transparent 39px,#22D3EE 39px,#22D3EE 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,#22D3EE 39px,#22D3EE 40px)',
        }}
      />

      <div className="relative mx-auto max-w-7xl">

        {/* Section badge */}
        <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-pm-cyan-500/30 bg-pm-navy-800 px-4 py-1.5">
          <TrendingDown className="h-4 w-4 text-pm-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-pm-cyan-400">
            Economics
          </span>
        </div>

        {/* Section header */}
        <div className="mb-10 max-w-3xl">
          <h2 className="text-4xl font-bold text-white leading-tight mb-5">
            The restart penalty is a hidden tax<br className="hidden sm:block" />
            on every Kubernetes cluster you run.
          </h2>
          <p className="text-lg text-pm-slate-300 leading-relaxed">
            Kubernetes clusters average 8–13% CPU utilization. The other 87–92% is reserved
            headroom that exists because moving a running application has always required
            restarting it first — and that restart is the problem. PodMotion removes it.
          </p>
        </div>

        {/* Audience tab toggle */}
        <div className="mb-12 flex gap-1 rounded-xl border border-pm-navy-700 bg-pm-navy-900 p-1 w-fit">
          <button
            onClick={() => setActiveTab('exec')}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
              activeTab === 'exec'
                ? 'bg-pm-cyan-500 text-pm-navy-950 shadow'
                : 'text-pm-slate-300 hover:text-white'
            }`}
          >
            Business Case
          </button>
          <button
            onClick={() => setActiveTab('tech')}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
              activeTab === 'tech'
                ? 'bg-pm-cyan-500 text-pm-navy-950 shadow'
                : 'text-pm-slate-300 hover:text-white'
            }`}
          >
            Technical Deep Dive
          </button>
        </div>

        {/* Shared metric cards */}
        <div className="mb-16 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>

        {/* Tab panels */}
        {activeTab === 'exec' ? <ExecPanel /> : <TechPanel />}

        {/* Shared disclaimer footer */}
        <div className="mt-16 flex items-start gap-3 rounded-lg border border-pm-navy-600 bg-pm-navy-800/60 px-5 py-4">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-pm-slate-400" />
          <p className="text-xs text-pm-slate-400 leading-relaxed">
            <span className="font-semibold text-pm-slate-300">Disclaimer.</span> All financial
            figures on this page are modeled projections for planning purposes only, derived from
            publicly available industry research (CAST AI 2025–2026, CNCF FinOps Microsurvey
            Dec 2023, PagerDuty State of Digital Operations 2024, Komodor 2025 Enterprise
            Kubernetes Report, and published AWS/Datadog/Dynatrace/Sysdig/Oracle pricing as
            of June 2026). Actual savings depend on workload profile, cluster topology, instance
            mix, existing licensing agreements, and operational context.
          </p>
        </div>

        {/* Alpha scope notice — at bottom, not top */}
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-5 py-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />
          <p className="text-sm text-amber-200 leading-relaxed">
            <span className="font-semibold">Alpha software — single declared substrate.</span>{' '}
            PodMotion v0.1.0-alpha's current end-to-end proof runs on a standing 3-node KVM/kubeadm
            cluster: amd64, Kubernetes v1.35.x (containerd), Cilium CNI v1.17.6 (geneve tunnel),
            CRIU 4.2. That proof covers a single held TCP connection; broad multi-flow,
            multi-container coverage is not yet proven. Additional CNIs and cloud environments are
            on the roadmap. No production PodMotion deployments exist; no measured production
            savings data exists. Storage migration (PVCs) is deferred to v1.2.
          </p>
        </div>

      </div>
    </section>
  );
}

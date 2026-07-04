'use client';

import React, { useState } from 'react';
import { TrendingDown, Server, Shield, Wrench, Info, AlertTriangle } from 'lucide-react';

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
    <div className="space-y-16">

      {/* Historical anchor */}
      <div className="rounded-xl border border-pm-cyan-500/20 bg-pm-navy-900/60 p-8">
        <h3 className="text-lg font-semibold text-white mb-3">
          This problem has been solved before — for a different generation of infrastructure
        </h3>
        <p className="text-base text-pm-slate-300 leading-relaxed mb-4">
          In the early 2000s, physical data centers ran at 5–15% server utilization for exactly
          the same reason: moving a running server required shutting it down first. Once engineers
          solved live server migration — the ability to move a running machine between physical
          hosts with no downtime — the economics changed completely. Data center teams went from
          one workload per server to ten or fifteen. Maintenance windows shrank from nights and
          weekends to minutes. Infrastructure costs dropped dramatically without touching a single
          line of application code.
        </p>
        <p className="text-base text-pm-slate-300 leading-relaxed">
          Container infrastructure is at the same inflection point today. The workloads are
          different. The structural constraint is identical. PodMotion is the same capability
          class, applied to the current generation.
        </p>
      </div>

      {/* Mechanism cards */}
      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-xl border border-pm-navy-700 bg-pm-navy-900 p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-pm-cyan-500/10 ring-1 ring-pm-cyan-500/30">
              <Server className="h-5 w-5 text-pm-cyan-400" />
            </span>
            <h3 className="font-semibold text-white">Cloud compute bill</h3>
          </div>
          <p className="text-sm text-pm-slate-300 leading-relaxed mb-4">
            When applications can move between servers without restarting, you need fewer servers
            to run the same workloads. Industry research documents 20–40% server count reductions
            from improved placement — a direct, proportional reduction in your compute bill.
          </p>
          <p className="text-sm text-pm-slate-300 leading-relaxed">
            Cloud providers also sell spare capacity at 60–90% discounts depending on provider
            and instance type. The catch: they can reclaim it on as little as 30 seconds'
            notice (AWS gives about two minutes; Google Cloud and Azure about 30 seconds),
            which currently means your application restarts. With live migration, the application
            moves to a different server before reclamation happens — making that deeply discounted
            capacity usable for production workloads.{' '}
            <span className="text-pm-slate-400 italic">
              Timing requires per-workload validation before production use.
            </span>
          </p>
        </div>

        <div className="rounded-xl border border-pm-navy-700 bg-pm-navy-900 p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-pm-cyan-500/10 ring-1 ring-pm-cyan-500/30">
              <Shield className="h-5 w-5 text-pm-cyan-400" />
            </span>
            <h3 className="font-semibold text-white">Vendor licensing fees</h3>
          </div>
          <p className="text-sm text-pm-slate-300 leading-relaxed mb-4">
            Most monitoring and observability vendors charge by the server. Fewer servers means a
            smaller bill — automatically, with no renegotiation required. At published rates, a
            20–40% server reduction on a 100-server footprint projects to{' '}
            <span className="text-pm-cyan-400 font-semibold">$38K–$116K per year</span> in
            monitoring savings alone.
          </p>
          <p className="text-sm text-pm-slate-300 leading-relaxed">
            For organizations with per-processor commercial database licensing, physically
            decommissioning servers removes processors from the license count. Consult your
            database vendor contract for how server reduction affects your specific license
            obligations.
          </p>
        </div>

        <div className="rounded-xl border border-pm-navy-700 bg-pm-navy-900 p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-pm-cyan-500/10 ring-1 ring-pm-cyan-500/30">
              <Wrench className="h-5 w-5 text-pm-cyan-400" />
            </span>
            <h3 className="font-semibold text-white">Maintenance and incident cost</h3>
          </div>
          <p className="text-sm text-pm-slate-300 leading-relaxed mb-4">
            Every infrastructure maintenance event is a change event — and research puts 79% of
            production incidents as originating from a recent change. Four maintenance cycles per
            year consumes{' '}
            <span className="text-pm-cyan-400 font-semibold">$54K–$135K</span> for a mid-size
            team,{' '}
            <span className="text-pm-cyan-400 font-semibold">$270K–$540K</span> at enterprise
            scale (8+ person infra team at fully loaded SRE rates), before factoring in the
            incidents those changes trigger.
          </p>
          <p className="text-sm text-pm-slate-300 leading-relaxed">
            When servers can be taken out of rotation without stopping the applications on them,
            maintenance windows shrink from multi-hour events to minutes. Fewer change events means
            fewer incident triggers. The average incident costs{' '}
            <span className="text-pm-cyan-400 font-semibold">$794K</span> (PagerDuty, 2024) — a
            reduction in change-related incidents is the highest-leverage outcome in this model.
            The table assumes one such incident avoided per year at enterprise scale (a fraction
            of one for mid-size), held to $794K each — not a percentage applied to the full
            incident count. Note: this is the same $794K figure shown in the metric cards above;
            it is one input used in two places in the model, not two independent data sources.
          </p>
        </div>
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
          Every Kubernetes cost optimization tool that exists today — Karpenter, CAST AI,
          cluster-autoscaler — operates at one moment in the pod lifecycle: between workloads.
          They can right-size a new node before scheduling. They cannot compact a running cluster
          without restarting the pods that live on it.
        </p>
        <p className="text-pm-slate-300 leading-relaxed">
          That constraint is the source of the over-provisioning floor you cannot breach. The
          scheduler cannot move a running pod; it can only evict and reschedule. So operators
          maintain headroom to absorb the restart storm — spare capacity that sits idle between
          compaction events. The result is a cluster that runs at{' '}
          <span className="text-pm-cyan-400 font-medium">8–13% average CPU utilization</span>{' '}
          (CAST AI, 4,000-cluster dataset, 2025–2026) while the bill scales to the node ceiling,
          not the workload floor.
        </p>
        <p className="text-pm-slate-300 leading-relaxed">
          Live pod migration changes the unit of compaction from "restart event" to "in-flight
          transfer." PodMotion moves a running pod — memory state, open connections, in-flight
          requests — from one node to another without terminating it. The node being drained
          empties. The scheduler fills the remaining nodes. No restart. No headroom tax.
        </p>
        <p className="text-pm-slate-300 leading-relaxed">
          This is incremental to what Karpenter and CAST AI already do. They handle bin-packing
          at scheduling time. PodMotion handles runtime compaction — closing the gap between what
          was optimal at pod start and what the cluster actually needs an hour later.
        </p>

        {/* Utilization callout */}
        <div className="border border-pm-cyan-500/30 bg-pm-navy-800 rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-widest text-pm-slate-400 font-medium">
              Typical K8s utilization
            </div>
            <div className="text-4xl font-bold text-white">8–13%</div>
            <div className="text-sm text-pm-slate-400">
              Average CPU across 4,000 clusters (CAST AI, 2025–2026)
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-widest text-pm-slate-400 font-medium">
              The structural gap
            </div>
            <div className="text-4xl font-bold text-pm-cyan-400">Runtime compaction</div>
            <div className="text-sm text-pm-slate-400">
              PodMotion closes the gap between scheduling-time optimization and runtime
              compaction — the missing primitive in every existing K8s cost tool. Not a
              K8s utilization projection; the 70–80% figure is from early-2000s VM-era
              datacenter consolidation studies.
            </div>
          </div>
        </div>
        <p className="text-sm text-pm-slate-400 italic">
          Historical VM utilization benchmarks from public datacenter operations literature
          (IBM Research, 2003–2008). Kubernetes figures: CAST AI State of Kubernetes Cost
          Optimization, 2025–2026. PodMotion utilization improvement is a modeled projection,
          not a measured production outcome.
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
                Spot/preemptible instances run at steep discounts to on-demand, but stateful
                and latency-sensitive workloads cannot use them today: eviction means restart —
                connection loss and potential data integrity risk. PodMotion intercepts the
                eviction signal, migrates the pod to an on-demand node before reclamation, and
                re-evaluates for spot placement on the next cycle. The workload never restarts.
                The race PodMotion has to win is the eviction window — and that window differs
                sharply by provider:
              </p>

              <div className="overflow-x-auto rounded-lg border border-pm-navy-700">
                <table className="w-full min-w-[480px] text-sm">
                  <thead>
                    <tr className="border-b border-pm-navy-700 bg-pm-navy-900">
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-pm-slate-400">
                        Provider
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-pm-cyan-400">
                        Typical discount
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-pm-slate-400">
                        Eviction window
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-pm-slate-400 hidden md:table-cell">
                        Signal mechanism
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-pm-navy-800 divide-y divide-pm-navy-700">
                    <tr>
                      <td className="px-4 py-3 text-pm-slate-300 font-medium">AWS Spot</td>
                      <td className="px-4 py-3 text-pm-cyan-400 font-mono">60–72%</td>
                      <td className="px-4 py-3 text-pm-slate-300 font-mono">~120 s</td>
                      <td className="px-4 py-3 text-xs text-pm-slate-400 hidden md:table-cell">
                        EC2 instance metadata interruption notice
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-pm-slate-300 font-medium">GCP Spot VMs</td>
                      <td className="px-4 py-3 text-pm-cyan-400 font-mono">60–91%</td>
                      <td className="px-4 py-3 text-pm-slate-300 font-mono">~30 s</td>
                      <td className="px-4 py-3 text-xs text-pm-slate-400 hidden md:table-cell">
                        ACPI G2 soft-off shutdown signal
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-pm-slate-300 font-medium">Azure Spot</td>
                      <td className="px-4 py-3 text-pm-cyan-400 font-mono">60–90%</td>
                      <td className="px-4 py-3 text-pm-slate-300 font-mono">~30 s</td>
                      <td className="px-4 py-3 text-xs text-pm-slate-400 hidden md:table-cell">
                        Scheduled Events API eviction notice
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-pm-slate-400 text-xs leading-relaxed">
                Discounts vary by instance type, region, and market conditions; ranges reflect
                published rates as of June 2026. The 30-second GCP/Azure window is the binding
                constraint — migration must complete inside it, which requires per-workload
                migration-vs-eviction-window profiling before production use.{' '}
                <code className="text-pm-cyan-400 bg-pm-navy-900 px-1.5 py-0.5 rounded">
                  tcpPreservationMode=Strict
                </code>{' '}
                (opt-in) preserves long-lived TCP sessions; default (None) handles stateless
                HTTP with no additional configuration. Stateful spot use via live migration is
                mechanically sound but not yet validated at production scale.
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

      {/* Historical analogy — trademark-clean */}
      <div className="max-w-4xl">
        <div className="border border-pm-cyan-500/20 bg-pm-navy-800/60 rounded-lg p-6 space-y-4">
          <h4 className="text-pm-cyan-400 font-semibold text-sm uppercase tracking-widest">
            Prior art: what live migration did to VM economics
          </h4>
          <p className="text-pm-slate-300 leading-relaxed">
            Live VM migration — moving a running virtual machine between physical hosts without
            downtime — transformed datacenter economics in the early 2000s. Before it existed,
            infrastructure teams maintained large capacity buffers because workloads could not
            move; hardware around them had to be available at all times. Utilization ratios of
            10–15% were common because headroom was structural, not optional.
          </p>
          <p className="text-pm-slate-300 leading-relaxed">
            Once live migration existed, operators consolidated running VMs onto fewer physical
            hosts, reclaimed freed hardware, and performed maintenance without scheduling
            downtime. Consolidation ratios moved from 1:1 toward 10:1 and beyond. Server
            utilization at 70–80% became achievable. The hardware footprint for the same workload
            set shrank by 60–80%.
          </p>
          <p className="text-pm-slate-300 leading-relaxed">
            Kubernetes today is at that same inflection point. The scheduler is excellent at
            placement decisions at pod-start time. It has no mechanism to compact a running
            cluster. PodMotion is the missing runtime compaction primitive.
          </p>
        </div>
      </div>

      {/* What validation shows */}
      <div className="max-w-4xl space-y-6">
        <h3 className="text-xl font-semibold text-white">What the validation actually shows</h3>

        <div className="bg-pm-navy-800 border border-pm-navy-700 rounded-lg p-4 mb-4">
          <p className="text-xs text-pm-slate-400 leading-relaxed">
            <span className="font-semibold text-pm-slate-300">Proof scope:</span>{' '}
            current authoritative end-to-end proof (Sprint&nbsp;33/34) ran on amd64 / Linux&nbsp;6.17 /
            containerd&nbsp;1.7.24 / Kubernetes&nbsp;v1.32.0 / kindnet (host-routed, no VXLAN overlay),
            kind profile <code className="text-pm-cyan-400 font-mono">podmotion-s33-cold</code>. The
            earlier arm64 / Ubuntu&nbsp;24.04 / kernel&nbsp;6.8 / Flannel VXLAN run is a historical
            Multipass k3s PoC (NS#4 / Sprint&nbsp;30), not the current substrate. No production deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-pm-navy-800 border border-green-700/40 rounded-lg p-5 space-y-3">
            <div className="text-xs uppercase tracking-widest text-amber-400 font-medium">
              Feln goal — not proven in v0.1.0-alpha
            </div>
            <ul className="space-y-2 text-pm-slate-300 text-sm leading-relaxed list-disc list-inside">
              <li>
                <code className="text-pm-cyan-400 font-mono">seq_delta=0</code> is the{' '}
                <span className="font-semibold text-pm-slate-200">Feln goal</span> (Phase&nbsp;C
                target), not an achieved result. The current proven path is cold-path
                BestEffort checkpoint/restore; TCP connections are <span className="font-semibold text-pm-slate-200">not</span> preserved
                by default. The historical NS#4 PoC run (10 pgbench migrations, -c&nbsp;8 -j&nbsp;8
                -T&nbsp;600) reported zero sequence-number gaps, but that is a non-authoritative
                Multipass k3s PoC (Sprint&nbsp;30), not a current measured production result
              </li>
              <li>
                p99 freeze window 487&nbsp;ms (NS#4, 10 runs); pgbench sustained write workload,
                earlier arm64/k3s PoC on kind bridge / Flannel VXLAN topology (historical, not the
                current Sprint&nbsp;33/34 kindnet substrate)
              </li>
              <li>
                TCP connection preservation with{' '}
                <code className="text-pm-cyan-400 font-mono">tcpPreservationMode=Strict</code>{' '}
                (opt-in) — single-flow sessions survive without client-side reconnect logic;
                proven on one TCP flow (Sprint&nbsp;30 Redis run).{' '}
                <code className="text-pm-cyan-400 font-mono">tcpPreservationMode</code> defaults
                to <code className="text-pm-cyan-400 font-mono">None</code>
              </li>
              <li>
                Proven run counts: 10 (NS#4 pgbench) and 1 (Sprint&nbsp;30 Redis). The 80-run
                figure is the M28 beta gate, which requires M22 (multi-container) and M23
                (conntrack) to pass first and has not yet been executed
              </li>
              <li>
                CRD-only interface — migration initiated via{' '}
                <code className="text-pm-cyan-400 font-mono">PodMigration</code> CR; no kubectl
                plugin in this release
              </li>
            </ul>
          </div>

          <div className="bg-pm-navy-800 border border-amber-700/40 rounded-lg p-5 space-y-3">
            <div className="text-xs uppercase tracking-widest text-amber-400 font-medium">
              Modeled — not yet measured in production
            </div>
            <ul className="space-y-2 text-pm-slate-300 text-sm leading-relaxed list-disc list-inside">
              <li>
                20–40% node reduction — extrapolated from utilization data and migration
                mechanics; no production cluster measurements yet
              </li>
              <li>
                Spot adoption economics — discount rates are published and real; stateful spot
                use via live migration is mechanically sound but not validated at production scale
              </li>
              <li>
                amd64 validation in progress; arm64 / k3s (Multipass) and kind is the only
                validated runtime today
              </li>
              <li>
                Storage migration (PVCs) deferred to v1.2; not available in v0.1.0-alpha
              </li>
            </ul>
          </div>
        </div>

        {/* Savings table — tech version with basis column */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Modeled savings by category</h3>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
            Modeled projection — not a PodMotion-measured outcome
          </p>
          <p className="text-pm-slate-400 text-sm mb-6">
            Figures are modeled projections from published utilization benchmarks and vendor
            pricing (CAST AI 2025–2026, PagerDuty 2024, Komodor 2025, AWS/GCP/Azure published
            pricing June 2026, Fairwinds 2026 upgrade ops data). Not measured production outcomes.
            Actual savings depend on workload profile, current utilization baseline, cloud region,
            and negotiated contract rates.
          </p>
          <div className="overflow-x-auto rounded-xl border border-pm-navy-700">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-pm-navy-700 bg-pm-navy-800">
                  <th className="py-4 px-4 text-left text-xs font-semibold uppercase tracking-wider text-pm-slate-400">
                    Category
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold uppercase tracking-wider text-pm-cyan-400">
                    Mid-size / yr<div className="text-pm-slate-500 font-normal normal-case">30–200 nodes</div>
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold uppercase tracking-wider text-pm-cyan-300">
                    Enterprise / yr<div className="text-pm-slate-500 font-normal normal-case">500–2,000 nodes</div>
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold uppercase tracking-wider text-pm-slate-400 hidden lg:table-cell">
                    Technical basis
                  </th>
                </tr>
              </thead>
              <tbody className="bg-pm-navy-900 divide-y divide-pm-navy-700">
                <tr>
                  <td className="px-4 py-4 text-pm-slate-300">Compute (on-demand)</td>
                  <td className="px-4 py-4 text-pm-cyan-400 font-mono font-semibold">$52K–$201K</td>
                  <td className="px-4 py-4 text-pm-cyan-300 font-mono font-semibold">$525K–$2.1M</td>
                  <td className="px-4 py-4 text-xs text-pm-slate-400 hidden lg:table-cell">
                    20–40% node reduction (incremental over Karpenter/CAST AI); CAST AI/Sedai
                    case studies; $300–600/node/mo AWS m6i.2xlarge on-demand
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-pm-slate-300">Compute (spot/preemptible)</td>
                  <td className="px-4 py-4 text-pm-cyan-400 font-mono font-semibold">$84K–$168K</td>
                  <td className="px-4 py-4 text-pm-cyan-300 font-mono font-semibold">$420K–$840K</td>
                  <td className="px-4 py-4 text-xs text-pm-slate-400 hidden lg:table-cell">
                    60–90% spot discount (provider/instance dependent); requires
                    migration-vs-eviction-window profiling per workload (AWS ~120s,
                    GCP/Azure ~30s) before production use
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-pm-slate-300">Observability licensing</td>
                  <td className="px-4 py-4 text-pm-cyan-400 font-mono font-semibold">$38K–$116K</td>
                  <td className="px-4 py-4 text-pm-cyan-300 font-mono font-semibold">$190K–$580K</td>
                  <td className="px-4 py-4 text-xs text-pm-slate-400 hidden lg:table-cell">
                    Per-node billing (Datadog, Dynatrace, Sysdig) at published rates; scales
                    proportionally with node reduction
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-pm-slate-300">Database licensing (where applicable)</td>
                  <td className="px-4 py-4 text-pm-cyan-400 font-mono font-semibold">$0–$340K</td>
                  <td className="px-4 py-4 text-pm-cyan-300 font-mono font-semibold">$1.1M–$1.8M</td>
                  <td className="px-4 py-4 text-xs text-pm-slate-400 hidden lg:table-cell">
                    Requires physical node decommissioning, not density improvement alone;
                    savings are zero unless nodes are actually removed from the fleet
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-pm-slate-300">SRE / maintenance window labor</td>
                  <td className="px-4 py-4 text-pm-cyan-400 font-mono font-semibold">$54K–$135K</td>
                  <td className="px-4 py-4 text-pm-cyan-300 font-mono font-semibold">$270K–$540K</td>
                  <td className="px-4 py-4 text-xs text-pm-slate-400 hidden lg:table-cell">
                    4–6 wk per minor upgrade × 4/yr × $109/hr loaded SRE rate; Fairwinds 2026
                    upgrade ops data
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-pm-slate-300">Incident cost reduction</td>
                  <td className="px-4 py-4 text-pm-cyan-400 font-mono font-semibold">$159K–$397K</td>
                  <td className="px-4 py-4 text-pm-cyan-300 font-mono font-semibold">$794K–$1.98M</td>
                  <td className="px-4 py-4 text-xs text-pm-slate-400 hidden lg:table-cell">
                    $794K median incident (PagerDuty 2024) × change-related incidents
                    avoided per yr: mid-size 0.2–0.5, enterprise 1.0–2.5. 79% of
                    incidents trace to system changes (Komodor 2025). No PodMotion telemetry yet.
                  </td>
                </tr>
              </tbody>
              <tfoot>
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
                  <td className="py-5 px-4 text-xs text-pm-slate-400 hidden lg:table-cell">
                    Database licensing is additive only if applicable; do not sum blindly
                  </td>
                </tr>
              </tfoot>
            </table>
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
            PodMotion v0.1.0-alpha is proven end-to-end on amd64 / Linux 6.17 / containerd 1.7.24 /
            Kubernetes v1.32.0 / kindnet (host-routed, no VXLAN overlay), kind profile
            podmotion-s33-cold (Sprint 33/34). The earlier arm64 / Ubuntu 24.04 / kernel 6.8 /
            Flannel VXLAN run is a historical k3s PoC, not the current proof. Flannel VXLAN and
            cloud CNIs are on the roadmap. No production PodMotion deployments exist; no measured
            production savings data exists. Storage migration (PVCs) deferred to v1.2.
          </p>
        </div>

      </div>
    </section>
  );
}

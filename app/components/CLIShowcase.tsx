'use client';

import React, { useState } from "react";

type TabName = "dryrun" | "apply" | "watch" | "describe" | "cancel" | "gitops";

interface TabCard {
  name: TabName;
  label: string;
  description: string;
  syntax: string;
  terminalLabel: string;
  output: string;
}

const TABS: TabCard[] = [
  {
    name: "dryrun",
    label: "Dry Run",
    description:
      "Start with dryRun: true to get a freeze-window estimate without moving the pod. The controller runs the estimation pipeline — dirty page sampling, storage tier detection, freeze budget projection — and writes the result to status.dryRunEstimate. The source pod is never touched. Use this as the safe evaluator entry point before committing to a live migration.",
    syntax: `apiVersion: migration.podmotion.io/v1alpha1
kind: PodMigration
metadata:
  name: estimate-api-server-001
  namespace: production
spec:
  podName: api-server-7d9f8b-xkq2p
  podNamespace: production
  targetNodeName: worker-node-3
  tcpPreservationMode: None   # default; opt-in to Strict for long-lived TCP sessions
  dryRun: true`,
    terminalLabel: "kubectl apply (dry run)",
    output: `$ kubectl apply -f estimate-api-server-001.yaml
podmigration.migration.podmotion.io/estimate-api-server-001 created

$ kubectl get podmigration estimate-api-server-001 -w
NAME                        PHASE            AGE
estimate-api-server-001     Pending          1s
estimate-api-server-001     DryRunComplete   4s

$ kubectl get podmigration estimate-api-server-001 -o jsonpath='{.status.dryRunEstimate}'
{
  "estimatedFreezeDurationMs": 312,
  "dirtyPageRateMBps": "18.4",
  "storageTier": 0,
  "migratable": true
}`,
  },
  {
    name: "apply",
    label: "Apply",
    description:
      "Trigger a live migration by applying a PodMigration custom resource. Set tcpPreservationMode: Strict only for workloads with long-lived TCP sessions that must survive the cutover — this enables hard rollback if TCPSequenceContinuityVerified=False (ADR-0019 Amendment A). The default (None) is appropriate for most stateless and short-connection workloads. The source pod is never deleted before TrafficVerified (ADR-0012).",
    syntax: `apiVersion: migration.podmotion.io/v1alpha1
kind: PodMigration
metadata:
  name: migrate-api-server-001
  namespace: production
spec:
  podName: api-server-7d9f8b-xkq2p
  podNamespace: production
  targetNodeName: worker-node-3
  tcpPreservationMode: None   # default; use Strict for long-lived TCP sessions`,
    terminalLabel: "kubectl apply",
    output: `$ kubectl apply -f migrate-api-server-001.yaml
podmigration.migration.podmotion.io/migrate-api-server-001 created`,
  },
  {
    name: "watch",
    label: "Watch",
    description:
      "Watch migration phases progress in real time. PodMotion drives the workload through phases from SocketInventory to Complete. The controller updates the PodMigration status block after each phase transition. The source pod is never deleted before TrafficVerified (ADR-0012).",
    syntax: "kubectl get podmigration migrate-api-server-001 -w",
    terminalLabel: "kubectl get podmigration -w",
    output: `$ kubectl get podmigration migrate-api-server-001 -w
NAME                      PHASE                      AGE
migrate-api-server-001    SocketInventory             2s
migrate-api-server-001    Validating                  4s
migrate-api-server-001    PreCopyMemory               7s
migrate-api-server-001    PreCopyMemory               12s
migrate-api-server-001    PreCopyMemory               17s
migrate-api-server-001    FinalFreezeStateCapture     21s
migrate-api-server-001    CutoverComplete             21s
migrate-api-server-001    Complete                    22s`,
  },
  {
    name: "describe",
    label: "Describe",
    description:
      "Inspect the full PodMigration status block, phase conditions, freeze window duration, and seq_delta proof. All migration observability lives in the CR — no separate tooling required.",
    syntax: "kubectl describe podmigration migrate-api-server-001",
    terminalLabel: "kubectl describe podmigration",
    output: `$ kubectl describe podmigration migrate-api-server-001
Name:         migrate-api-server-001
Namespace:    production
Labels:       <none>
API Version:  migration.podmotion.io/v1alpha1
Kind:         PodMigration

Spec:
  Pod Name:                api-server-7d9f8b-xkq2p
  Pod Namespace:           production
  Target Node Name:        worker-node-3
  TCP Preservation Mode:   None

Status:
  Phase:                   Complete
  Source Node Name:        worker-node-1
  Destination Node Name:   worker-node-3
  Pre Copy Stats:
    Rounds Completed:      3
    Freeze Duration Ms:    298

  Conditions:
    Type                             Status   Reason
    ----                             ------   ------
    SocketInventoryComplete          True     PhaseComplete
    OverlayReady                     True     OverlayHandoffComplete
    RelayArmed                       True     RelayProgramsActive
    TCPSequenceContinuityVerified    True     SeqDeltaZero
    SocketsLive                      True
    ProcessResumedAfterSocketsLive   True
    TrafficVerified                  True     PhaseComplete`,
  },
  {
    name: "cancel",
    label: "Cancel",
    description:
      "Cancel an in-progress migration by deleting the PodMigration CR. The finalizer ensures PodMotion initiates rollback before the object is removed: the source pod is restored to running, the destination pod is cleaned up, and existing TCP connections are preserved on the source node. The source pod is never deleted before TrafficVerified (ADR-0012) — cancellation before that phase leaves the source pod fully intact.",
    syntax: "kubectl delete podmigration migrate-api-server-001",
    terminalLabel: "kubectl delete podmigration",
    output: `$ kubectl delete podmigration migrate-api-server-001
podmigration.migration.podmotion.io "migrate-api-server-001" deleted

$ kubectl get podmigration migrate-api-server-001 -w
NAME                      PHASE          AGE
migrate-api-server-001    Cancelling     8s
migrate-api-server-001    RolledBack     10s
# Object removed after finalizer releases

# Source pod is still running on worker-node-1 — no disruption`,
  },
  {
    name: "gitops",
    label: "GitOps",
    description:
      "PodMigration CRs are plain Kubernetes manifests. Apply them through any GitOps pipeline — Argo CD, Flux, or plain CI. The controller reconciles the CR the moment it lands in the cluster regardless of how it was delivered.",
    syntax: `# Argo CD Application (excerpt)
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: migrations
  namespace: argocd
spec:
  source:
    repoURL: https://git.example.com/ops/migrations
    path: podmigrations/production
    targetRevision: main
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: false   # migrations are one-shot; do not auto-recreate`,
    terminalLabel: "argocd app sync",
    output: `$ argocd app sync migrations
TIMESTAMP  GROUP                  KIND            NAMESPACE   NAME                     STATUS   HEALTH
...        migration.podmotion.io  PodMigration    production  migrate-api-server-001   Synced   Progressing

$ kubectl get podmigration -n production
NAME                      PHASE       AGE
migrate-api-server-001    Complete    45s`,
  },
];

export default function CLIShowcase() {
  const [activeTab, setActiveTab] = useState<TabName>("dryrun");
  const [copied, setCopied] = useState(false);

  const card = TABS.find((t) => t.name === activeTab)!;

  function handleCopy() {
    navigator.clipboard.writeText(card.syntax).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <section id="cli" className="bg-pm-navy-900 py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl text-pm-white font-bold">The CRD interface</h2>
          <p className="text-pm-white-muted text-lg mt-4">
            Every migration is a <code className="text-pm-cyan-300">PodMigration</code> custom resource.
            Start with <code className="text-pm-cyan-300">dryRun: true</code> for a freeze-window estimate,
            then apply without it to migrate — watch phases complete. Our Feln goal of{" "}
            <code className="text-pm-cyan-300">seq_delta=0</code> (zero TCP sequence delta) is the
            milestone we are proving next; it is not yet proven. No new tooling required.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex gap-2 mb-8 flex-wrap" role="tablist" aria-label="CRD interface examples">
          {TABS.map((tab) => (
            <button
              key={tab.name}
              role="tab"
              aria-selected={activeTab === tab.name}
              aria-controls={`tab-panel-${tab.name}`}
              id={`tab-btn-${tab.name}`}
              onClick={() => { setActiveTab(tab.name); setCopied(false); }}
              className={
                activeTab === tab.name
                  ? "bg-pm-navy-700 text-pm-white border border-pm-cyan-300/40 px-4 py-2 rounded-md text-sm font-medium"
                  : "text-pm-white-muted hover:text-pm-white border border-pm-navy-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active tab panel */}
        {TABS.map((tab) => (
          <div
            key={tab.name}
            id={`tab-panel-${tab.name}`}
            role="tabpanel"
            aria-labelledby={`tab-btn-${tab.name}`}
            hidden={activeTab !== tab.name}
            className="bg-pm-navy-800 border border-pm-navy-700 rounded-2xl p-8"
          >
            {/* Syntax block with copy button */}
            <div className="flex items-start gap-3 mb-6">
              <pre className="bg-pm-navy-950 rounded-lg p-4 overflow-x-auto font-mono text-sm text-slate-100 border border-pm-navy-600 flex-1 whitespace-pre">
                <code>{tab.syntax}</code>
              </pre>
              <button
                className="mt-0 shrink-0 text-xs text-pm-white-muted hover:text-pm-white bg-pm-navy-700 px-3 py-1.5 rounded-md transition-colors"
                aria-label={`Copy ${tab.label} example`}
                onClick={handleCopy}
              >
                {copied && activeTab === tab.name ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Description */}
            <p className="text-pm-white-muted text-sm leading-relaxed">{tab.description}</p>

            {/* Simulated terminal output */}
            <div className="mt-6">
              <div
                className="flex items-center gap-1.5 px-4 py-3 bg-pm-navy-950 rounded-t-lg border-b border-pm-navy-700"
                aria-hidden="true"
              >
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-auto text-xs text-pm-white-muted font-mono">{tab.terminalLabel}</span>
              </div>
              <pre className="bg-pm-navy-950 rounded-b-lg p-4 font-mono text-sm text-slate-100 min-h-24 overflow-x-auto whitespace-pre">
                <code>{tab.output}</code>
              </pre>
            </div>
          </div>
        ))}

        {/* Bottom notes */}
        <p className="text-center text-pm-white-muted text-sm mt-12">
          The <code className="text-pm-cyan-300">PodMigration</code> CR is the
          complete control plane — compatible with kubectl, Argo CD, Flux, and
          any Kubernetes-native pipeline.
        </p>
        <p className="text-center text-pm-slate-300/60 text-xs mt-4">
          A kubectl plugin is planned for a future release. In v0.1.0-alpha, all
          migrations are managed via the PodMigration custom resource.
        </p>
      </div>
    </section>
  );
}

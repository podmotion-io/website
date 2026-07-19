'use client';

import React, { useState } from "react";

type InstallTab = "helm" | "kubectl" | "operatorhub";

export default function GettingStarted() {
  const [activeTab, setActiveTab] = useState<InstallTab>("helm");

  return (
    <section id="get-started" className="bg-pm-navy-950 py-24">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-pm-white font-bold text-3xl lg:text-4xl">Get started</h2>
        <p className="text-pm-white-muted mt-4">
          Install the operator, run your first migration, verify it. Three steps.
        </p>

        {/* Beginner on-ramp — plain-language framing before any jargon */}
        <div
          className="bg-pm-navy-800 border border-pm-navy-700 rounded-lg p-4 text-pm-slate-300 text-sm mt-6"
          role="note"
          aria-label="Plain-language introduction"
        >
          New to this? PodMotion moves a running container from one machine to another while keeping every open network connection alive — without restarting it or dropping in-flight requests. The steps below use Kubernetes terms, but that one idea is the whole point.
        </div>

        {/* Always-visible prereq callout — NOT an accordion */}
        <div
          className="bg-amber-950/40 border border-amber-500/30 rounded-lg p-4 text-amber-200 text-sm mt-8"
          role="note"
          aria-label="Prerequisites"
        >
          <strong>Prerequisites:</strong> Requires CRIU 4.2, Linux kernel 5.15+ (validated only on 6.8; 6.8 strongly recommended), Kubernetes 1.27+, and arm64 nodes (amd64 validation in progress). Single-cluster only in v0.x.
        </div>

        {/* S1-1: Kernel capability prerequisites */}
        <div
          className="bg-pm-navy-800 border border-pm-navy-600 rounded-lg p-4 text-pm-slate-300 text-sm mt-6"
          role="note"
          aria-label="Kernel prerequisites"
        >
          <strong className="text-pm-white">Kernel prerequisites:</strong> Live process migration
          requires direct kernel access. The per-node agent DaemonSet uses{" "}
          <code className="text-pm-cyan-300">hostPID</code>,{" "}
          <code className="text-pm-cyan-300">SYS_PTRACE</code>, and{" "}
          <code className="text-pm-cyan-300">CHECKPOINT_RESTORE</code> to drive CRIU, plus{" "}
          <code className="text-pm-cyan-300">NET_ADMIN</code> for the eBPF TCP relay.
          Store sensitive configuration in Kubernetes Secrets — not environment variables — so
          checkpoint images contain no plaintext credentials.
          See{" "}
          <a
            href="https://github.com/podmotion-io/podmotion/blob/main/SECURITY.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pm-cyan-400 underline hover:text-pm-cyan-300"
          >
            SECURITY.md 
          </a>{" "}
          for hardening guidance.
        </div>

        {/* S1-2: mTLS / plaintext fallback — WARNING block */}
        <div
          className="bg-red-950/40 border border-red-500/40 rounded-lg p-4 text-red-200 text-sm mt-4"
          role="alert"
          aria-label="Security warning: plaintext gRPC"
        >
          <strong className="text-red-100">Warning:</strong> Default: gRPC port :9090 uses
          plaintext unless TLS certificates are configured. See{" "}
          <a
            href="https://github.com/podmotion-io/podmotion/blob/main/SECURITY.md"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-red-100"
          >
            Security Architecture 
          </a>{" "}
          to enable mTLS before deploying to non-isolated environments.
        </div>

        {/* Step 1 — Install */}
        <div className="mt-16" id="get-started-step-1">
          <div className="flex items-baseline gap-4">
            <span className="text-pm-cyan-300 font-mono text-5xl font-bold opacity-30 select-none">1</span>
            <h3 className="text-pm-white font-bold text-xl">Install PodMotion</h3>
          </div>

          <div className="flex flex-row gap-2 mt-6" role="tablist" aria-label="Install method">
            <button
              role="tab"
              aria-selected={activeTab === "helm"}
              aria-controls="tab-panel-helm"
              id="tab-helm"
              onClick={() => setActiveTab("helm")}
              className={
                activeTab === "helm"
                  ? "px-4 py-2 rounded-md text-sm font-medium transition-colors bg-pm-navy-700 text-pm-white border border-pm-cyan-300/40"
                  : "px-4 py-2 rounded-md text-sm font-medium transition-colors text-pm-white-muted hover:text-pm-white border border-transparent"
              }
            >
              Helm
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "kubectl"}
              aria-controls="tab-panel-kubectl"
              id="tab-kubectl"
              onClick={() => setActiveTab("kubectl")}
              className={
                activeTab === "kubectl"
                  ? "px-4 py-2 rounded-md text-sm font-medium transition-colors bg-pm-navy-700 text-pm-white border border-pm-cyan-300/40"
                  : "px-4 py-2 rounded-md text-sm font-medium transition-colors text-pm-white-muted hover:text-pm-white border border-transparent"
              }
            >
              kubectl
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "operatorhub"}
              aria-controls="tab-panel-operatorhub"
              id="tab-operatorhub"
              onClick={() => setActiveTab("operatorhub")}
              disabled
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors text-pm-white-muted border border-transparent opacity-40 cursor-not-allowed"
              aria-disabled="true"
              title="OperatorHub support is planned — not available in v0.1.0-alpha"
            >
              OperatorHub <span className="text-xs">(planned)</span>
            </button>
          </div>

          <div
            id="tab-panel-helm"
            role="tabpanel"
            aria-labelledby="tab-helm"
            hidden={activeTab !== "helm"}
          >
            <p className="text-pm-white-muted text-xs mt-4 mb-2 italic">
              Install from local chart (not yet published to a public repository).
            </p>
            <pre className="bg-pm-navy-800 rounded-lg p-4 overflow-x-auto font-mono text-sm text-slate-100 border border-pm-navy-600">
              <code>{`helm install podmotion ./charts/podmotion -n podmotion-system --create-namespace`}</code>
            </pre>
          </div>

          <div
            id="tab-panel-kubectl"
            role="tabpanel"
            aria-labelledby="tab-kubectl"
            hidden={activeTab !== "kubectl"}
          >
            <p className="text-pm-white-muted text-xs mt-4 mb-2 italic">
              Note: install.yaml is not published for v0.1.0-alpha. Clone the repo and install from the local chart instead: <code className="font-mono">./charts/podmotion</code>
            </p>
            <pre className="bg-pm-navy-800 rounded-lg p-4 overflow-x-auto font-mono text-sm text-slate-100 border border-pm-navy-600 mt-2">
              <code>{`kubectl apply -f https://github.com/podmotion-io/podmotion/releases/latest/download/install.yaml`}</code>
            </pre>
          </div>

          <div
            id="tab-panel-operatorhub"
            role="tabpanel"
            aria-labelledby="tab-operatorhub"
            hidden={activeTab !== "operatorhub"}
          >
            <p className="text-pm-white-muted text-sm mt-4">
              OperatorHub (OLM bundle) support is planned — not available in v0.1.0-alpha.
              Use Helm or kubectl to install.
            </p>
          </div>

          <p className="text-pm-white-muted text-sm mt-8">
            Installs the operator, the per-node agent DaemonSet, five CRDs, and
            the admission webhooks.
          </p>
        </div>

        {/* Step 2 — Migrate */}
        <div className="mt-16" id="get-started-step-2">
          <div className="flex items-baseline gap-4">
            <span className="text-pm-cyan-300 font-mono text-5xl font-bold opacity-30 select-none">2</span>
            <h3 className="text-pm-white font-bold text-xl">Migrate a pod</h3>
          </div>

          <pre className="bg-pm-navy-800 rounded-lg p-4 overflow-x-auto font-mono text-sm text-slate-100 border border-pm-navy-600 mt-6">
            <code>{`kubectl apply -f - <<EOF
apiVersion: migration.podmotion.io/v1alpha1
kind: PodMigration
metadata:
  name: migrate-my-pod
  namespace: default
spec:
  podName: my-pod
  podNamespace: default
  targetNodeName: worker-2      # optional: pin destination node
  tcpPreservationMode: None
EOF`}</code>
          </pre>

          <p className="text-pm-white-muted text-sm mt-3">
            Applies a <code>PodMigration</code> CR — the CRD-only interface in v0.1.0-alpha.
            The operator picks it up and drives the 22-value MigrationPhase state machine to Complete. Set{" "}
            <code className="font-mono text-pm-cyan-300">tcpPreservationMode: Strict</code>{" "}
            to preserve long-lived TCP sessions across the migration (opt-in).
          </p>

          {/* dryRun callout */}
          <div
            className="bg-pm-navy-800 border border-pm-cyan-300/20 rounded-lg p-4 text-pm-slate-300 text-sm mt-4"
            role="note"
            aria-label="Evaluate safely with dryRun"
          >
            <strong className="text-pm-white">Evaluate safely first:</strong> set{" "}
            <code className="text-pm-cyan-300">spec.dryRun: true</code> in your PodMigration CR
            to run a DryRunEstimate — PodMotion will report the estimated freeze window without
            moving the pod.
          </div>
        </div>

        {/* Step 3 — Verify */}
        <div className="mt-16" id="get-started-step-3">
          <div className="flex items-baseline gap-4">
            <span className="text-pm-cyan-300 font-mono text-5xl font-bold opacity-30 select-none">3</span>
            <h3 className="text-pm-white font-bold text-xl">Verify it worked</h3>
          </div>

          <pre className="bg-pm-navy-800 rounded-lg p-4 overflow-x-auto font-mono text-sm text-slate-100 border border-pm-navy-600 mt-6">
            <code>{`kubectl get podmigration migrate-my-pod
kubectl describe podmigration migrate-my-pod`}</code>
          </pre>

          <p className="text-pm-white-muted text-sm mt-3">
            Confirm that the pod
            now runs on the destination node.{" "}
            <code>seq_delta=0</code> (zero TCP sequence delta) with connection
            parity was first proven at Sprint 46 for a single held connection on a
            real multi-node cluster; the full multi-flow guarantee is not yet proven.
            The <code>describe</code> output
            shows the <code>status.conditions</code> relevant to the migration
            mode. In Strict mode the aggregate TCP result is{" "}
            <code className="font-mono text-pm-cyan-300">TCPVerified</code>{" "}
            (True only when its sub-conditions{" "}
            <code className="font-mono text-pm-cyan-300">TCPSequenceContinuityVerified</code>{" "}
            and{" "}
            <code className="font-mono text-pm-cyan-300">ConnectionCountParity</code>{" "}
            are both True); application reachability is reported by{" "}
            <code className="font-mono text-pm-cyan-300">ServiceVerified</code>.
            In the default None mode, TCP/socket conditions are skipped entirely.
            Run <code>kubectl describe podmigration &lt;name&gt;</code> to see
            the exact set for your migration.
          </p>
        </div>

        {/* Next-steps cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16" aria-label="Next steps">
          <a href="https://docs.podmotion.io" target="_blank" rel="noopener noreferrer" className="bg-pm-navy-800 border border-pm-navy-700 rounded-xl p-6 hover:border-pm-cyan-300/40 transition-colors group">
            <strong className="text-pm-white font-semibold text-base mb-1 block">Read the docs</strong>
            <span className="text-pm-white-muted text-sm block">Full reference documentation</span>
            <span className="text-pm-cyan-300 group-hover:translate-x-1 transition-transform inline-block mt-2">→</span>
          </a>
          <a href="#cli" className="bg-pm-navy-800 border border-pm-navy-700 rounded-xl p-6 hover:border-pm-cyan-300/40 transition-colors group">
            <strong className="text-pm-white font-semibold text-base mb-1 block">The CRD interface</strong>
            <span className="text-pm-white-muted text-sm block">PodMigration CR examples and status patterns</span>
            <span className="text-pm-cyan-300 group-hover:translate-x-1 transition-transform inline-block mt-2">→</span>
          </a>
          <a href="https://github.com/podmotion-io/podmotion#readme" target="_blank" rel="noopener noreferrer" className="bg-pm-navy-800 border border-pm-navy-700 rounded-xl p-6 hover:border-pm-cyan-300/40 transition-colors group">
            <strong className="text-pm-white font-semibold text-base mb-1 block">Understand the architecture </strong>
            <span className="text-pm-white-muted text-sm block">Operator, agents, CRDs, and the 22-value MigrationPhase state machine</span>
            <span className="text-pm-cyan-300 group-hover:translate-x-1 transition-transform inline-block mt-2">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

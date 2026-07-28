import type { FC } from "react";

const About: FC = () => {
  return (
    <section
      id="about"
      className="bg-pm-navy-900 py-24 sm:py-32"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        {/* Section eyebrow */}
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-pm-cyan-300">
          Open Source · Apache-2.0
        </p>

        {/* Project origin — full width */}
        <div className="flex flex-col gap-6">
          <h2
            id="about-heading"
            className="text-3xl font-bold leading-tight tracking-tight text-pm-white sm:text-4xl"
          >
            About the project
          </h2>
          <p className="text-lg leading-relaxed text-pm-white-muted">
            PodMotion was born from a gap in the Kubernetes ecosystem. When a
            pod crashes or gets evicted, it takes its state with it — its
            memory, its open files, and every TCP connection its clients were
            holding. The scheduler starts a new replica somewhere else, and
            those connections get a RST. Every retry, every reconnect, every
            client-side timeout is a consequence of that assumption being baked
            into the platform.
          </p>
          <p className="text-lg leading-relaxed text-pm-white-muted">
            This project started as a proof of concept: could CRIU actually
            move a running, stateful process across nodes and restore it
            functional? Preserving the original pod IP was a deliberate
            non-goal — not every cloud provider or CNI can hand one node the
            IP block that belongs to another. The answer —
            proven end-to-end on our two-node kind (Kubernetes-in-Docker, a
            local test-cluster tool) proof substrate (stock upstream Kubernetes v1.32) in about 13
            seconds, with an in-memory counter restored intact across nodes and
            the source pod never deleted until traffic is verified (ADR-0012) —
            is yes. Live TCP-connection survival —{" "}
            <code className="rounded bg-pm-navy-700 px-1.5 py-0.5 font-mono text-sm text-pm-cyan-300">
              seq_delta=0
            </code>
            , no RST, no reconnect — was first proven at Sprint 46, where a single
            held connection survived a migration byte-exact (seq_delta 0/0, Strict
            mode) on a real multi-node cluster; the full guarantee across many
            concurrent flows and declared CNIs is not yet proven. No application
            changes required.
          </p>
          <p className="text-lg leading-relaxed text-pm-white-muted">
            What started as a proof of concept has grown into a real system in
            progress: a 12-phase migration state machine, five CRDs, a scheduler
            plugin, a CNI plugin, and a growing open-source project. Live
            migration between nodes remains the flagship goal, and it&apos;s
            also becoming the foundation for two more things we&apos;re working
            toward — moving containers between different hosting platforms and
            back (for example AWS ECS and EC2/Docker, or EKS and EC2), and full
            pod backup that&apos;s ready for restore. Both are early roadmap
            items, not available in v0.1.0-alpha. Built in the open. Apache-2.0.
            Founded and built by a team with deep roots in Kubernetes, federal
            systems, and enterprise transformation.
          </p>
        </div>

        {/* Team cards */}
        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {/* Chad */}
            <div className="rounded-xl border border-pm-navy-600 bg-pm-navy-800 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.4),0_8px_24px_rgba(0,0,0,0.3)]">
              <div className="mb-3 flex items-center gap-3">
                <img
                  src="/images/chad.jpg"
                  alt="Chad N. Ingle"
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
                <div>
                  <p className="text-sm font-semibold leading-tight text-pm-white">Chad N. Ingle</p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-pm-cyan-300">Founder &amp; CTO</p>
                  <p className="mt-0.5 text-xs text-pm-white-muted">Principal DevOps Architect, Effectual</p>
                </div>
              </div>
              <p className="mb-4 text-xs leading-relaxed text-pm-white-muted">
                28+ years in platform engineering, cloud architecture, and enterprise transformation.
                Principal DevOps Architect at{" "}
                <a href="https://effectual.ai/" target="_blank" rel="noopener noreferrer" className="text-pm-cyan-300 underline hover:text-pm-cyan-500">Effectual</a>
                , co-founder of{" "}
                <a href="https://bluebutterfly.ai/" target="_blank" rel="noopener noreferrer" className="text-pm-cyan-300 underline hover:text-pm-cyan-500">Blue Butterfly AI</a>
                , founder of{" "}
                <a href="https://oanministries.org/" target="_blank" rel="noopener noreferrer" className="text-pm-cyan-300 underline hover:text-pm-cyan-500">OAN Ministries</a>
                . Builds net-new products focused on rebuilding security from the ground up — the hands-on, people-first builder behind PodMotion.
              </p>
              <a href="https://www.linkedin.com/in/chadingle/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-pm-cyan-300 underline hover:text-pm-cyan-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                LinkedIn
              </a>
            </div>

            {/* Salle */}
            <div className="rounded-xl border border-pm-navy-600 bg-pm-navy-800 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.4),0_8px_24px_rgba(0,0,0,0.3)]">
              <div className="mb-3 flex items-center gap-3">
                <img
                  src="/images/salle.jpg"
                  alt="Salle Ingle"
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
                <div>
                  <p className="text-sm font-semibold leading-tight text-pm-white">Salle Ingle</p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-pm-cyan-300">Founder</p>
                  <p className="mt-0.5 text-xs text-pm-white-muted">Chief AI Strategist</p>
                </div>
              </div>
              <p className="mb-4 text-xs leading-relaxed text-pm-white-muted">
                27+ years in technology leadership, including Principal Architect at McKinsey &amp; Company leading generative-AI workflow teams for Fortune 500s. Expert in enterprise multi-cloud and on-premise architecture across data centers, AWS, Azure, and GCP. Founder of{" "}
                <a href="https://bluebutterfly.ai/" target="_blank" rel="noopener noreferrer" className="text-pm-cyan-300 underline hover:text-pm-cyan-500">Blue Butterfly AI</a>
                ; drives PodMotion's cloud-certification strategy and enterprise go-to-market.
              </p>
              <a href="https://www.linkedin.com/in/salleingle/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-pm-cyan-300 underline hover:text-pm-cyan-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                LinkedIn
              </a>
            </div>

            {/* Jonathan Baier */}
            <div className="rounded-xl border border-pm-navy-600 bg-pm-navy-800 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.4),0_8px_24px_rgba(0,0,0,0.3)]">
              <div className="mb-3 flex items-center gap-3">
                <img
                  src="/images/jon.jpeg"
                  alt="Jonathan Baier"
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
                <div>
                  <p className="text-sm font-semibold leading-tight text-pm-white">Jonathan Baier</p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-pm-cyan-300">Co-Founder &amp; Chief AI Scientist</p>
                  <p className="mt-0.5 text-xs text-pm-white-muted">Active Contributor &amp; Agentic AI Lead</p>
                </div>
              </div>
              <p className="mb-4 text-xs leading-relaxed text-pm-white-muted">
                20+ years leading AI, cloud, and engineering transformations — Moody's, ADP, and his firm Cyberify Services. Published Kubernetes/GenAI author with four US patents; PodMotion's agentic AI lead, working with Chad since 2012.
              </p>
              <a href="https://www.linkedin.com/in/jonathanbaier/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-pm-cyan-300 underline hover:text-pm-cyan-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                LinkedIn
              </a>
            </div>

            {/* David King */}
            <div className="rounded-xl border border-pm-navy-600 bg-pm-navy-800 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.4),0_8px_24px_rgba(0,0,0,0.3)]">
              <div className="mb-3 flex items-center gap-3">
                <img
                  src="/images/david.jpeg"
                  alt="David King"
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
                <div>
                  <p className="text-sm font-semibold leading-tight text-pm-white">David King</p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-pm-cyan-300">Co-Founder &amp; CISO</p>
                  <p className="mt-0.5 text-xs text-pm-white-muted">NAVWAR Branch Lead, US Space Force</p>
                </div>
              </div>
              <p className="mb-4 text-xs leading-relaxed text-pm-white-muted">
                Decades of DoD high-security systems experience as NAVWAR Branch Lead, US Space Force, on the next-generation GPS Command &amp; Control system (OCX). At PodMotion he's the compliance and security skeptic DoD and high-assurance customers expect.
              </p>
              <a href="https://www.linkedin.com/in/david-king-98877517/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-pm-cyan-300 underline hover:text-pm-cyan-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                LinkedIn
              </a>
            </div>

        </div>
        {/* Known Limitations */}
        <div className="mt-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-pm-cyan-300">
            Engineering Transparency
          </p>
          <h3 className="mb-2 text-2xl font-bold leading-tight tracking-tight text-pm-white">
            Known Limitations (v0.1.0-alpha)
          </h3>
          <p className="mb-8 text-base leading-relaxed text-pm-white-muted max-w-2xl">
            These are the honest boundaries of what v0.1.0-alpha does and does not do. Naming them precisely is
            engineering discipline — CNCF TAG reviewers treat explicit scope boundaries as a credibility signal,
            not a weakness.
          </p>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <li className="rounded-xl border border-pm-navy-600 bg-pm-navy-800 p-5">
              <p className="mb-1 text-sm font-semibold text-pm-white">Single declared substrate</p>
              <p className="text-sm leading-relaxed text-pm-white-muted">
                The authoritative current end-to-end proof ran on amd64 / Linux 6.17 /
                containerd 1.7.24 / Kubernetes v1.32.0 / kindnet (host-routed, no VXLAN overlay) —
                kind profile podmotion-s33-cold (Sprint 33 + 34). An earlier arm64/k3s PoC exists
                but is historical, not the current proof. Live TCP preservation (Strict mode) was
                first proven separately at Sprint 46 for a single held connection (seq_delta 0/0) on
                a real multi-node cluster; broader multi-flow, multi-CNI validation is not yet proven.
              </p>
            </li>
            <li className="rounded-xl border border-pm-navy-600 bg-pm-navy-800 p-5">
              <p className="mb-1 text-sm font-semibold text-pm-white">Single-container pod only</p>
              <p className="text-sm leading-relaxed text-pm-white-muted">
                Multi-container consistent checkpoint (M22) is in progress. v0.1.0-alpha supports
                pods with exactly one container; multi-container pods are out of scope until M22 lands.
              </p>
            </li>
            <li className="rounded-xl border border-pm-navy-600 bg-pm-navy-800 p-5">
              <p className="mb-1 text-sm font-semibold text-pm-white">Single TCP flow only</p>
              <p className="text-sm leading-relaxed text-pm-white-muted">
                conntrack/NAT migration (M23) is not yet built. The eBPF relay preserves one
                active TCP flow per migration. Multi-flow support is planned for a future milestone.
              </p>
            </li>
            <li className="rounded-xl border border-pm-navy-600 bg-pm-navy-800 p-5">
              <p className="mb-1 text-sm font-semibold text-pm-white">CPU-feature portability</p>
              <p className="text-sm leading-relaxed text-pm-white-muted">
                CRIU checkpoints are not CPU-feature portable across microarchitecture generations.
                A checkpoint taken on a node with AVX-512 (Skylake) will SIGILL on a node without
                it (Haswell). Fix is targeted for Sprint 33+ (ADR-0153).
              </p>
            </li>
            <li className="rounded-xl border border-pm-navy-600 bg-pm-navy-800 p-5">
              <p className="mb-1 text-sm font-semibold text-pm-white">No production deployments</p>
              <p className="text-sm leading-relaxed text-pm-white-muted">
                v0.1.0-alpha has not been run in a production environment. Most proof runs are
                on kind clusters; the Sprint 46 live-TCP proof ran on a real multi-node cluster.
                Production readiness is a future milestone, not a current claim.
              </p>
            </li>
            <li className="rounded-xl border border-pm-navy-600 bg-pm-navy-800 p-5">
              <p className="mb-1 text-sm font-semibold text-pm-white">kindnet substrate only</p>
              <p className="text-sm leading-relaxed text-pm-white-muted">
                The current end-to-end proof ran on kindnet (host-routed, no VXLAN overlay).
                Flannel VXLAN and other CNIs (Calico, Cilium, Weave) are on the roadmap, not proof.
                No authoritative end-to-end proof file exists for any CNI other than kindnet.
              </p>
            </li>
            <li className="rounded-xl border border-pm-navy-600 bg-pm-navy-800 p-5">
              <p className="mb-1 text-sm font-semibold text-pm-white">Storage migration deferred</p>
              <p className="text-sm leading-relaxed text-pm-white-muted">
                Persistent volume migration is deferred to v1.2. v0.1.0-alpha does not migrate
                PVCs or storage state; workloads relying on local storage are out of scope. One
                tier has been exercised past design in development — a Longhorn-backed Postgres
                PVC reached a verified in-run migration (phase=Complete / TrafficVerified=True)
                on the KVM cluster — but that is a single dev-cluster run, not a committed proof
                and not part of the shipped alpha; the Ceph RBD and snapshot-rsync tiers remain
                unexercised stubs.
              </p>
            </li>
            <li className="rounded-xl border border-pm-navy-600 bg-pm-navy-800 p-5 sm:col-span-2 lg:col-span-3">
              <p className="mb-2 text-sm font-semibold text-pm-white">Alpha security posture</p>
              <p className="mb-2 text-sm leading-relaxed text-pm-white-muted">
                The node-agent DaemonSet runs <code className="rounded bg-pm-navy-700 px-1 py-0.5 font-mono text-xs text-pm-cyan-300">privileged: true</code> with <code className="rounded bg-pm-navy-700 px-1 py-0.5 font-mono text-xs text-pm-cyan-300">hostPID: true</code>, a read-write mount of the containerd Unix socket, and no seccomp profile. Required capabilities include SYS_PTRACE, SYS_ADMIN, NET_ADMIN, DAC_OVERRIDE, CHOWN, SETUID, SETGID, and CHECKPOINT_RESTORE. This is a node-root surface area necessary for live CRIU checkpoint-restore and eBPF relay in the current implementation.
              </p>
              <p className="mb-2 text-sm leading-relaxed text-pm-white-muted">
                Checkpoints are written in plaintext to tmpfs at <code className="rounded bg-pm-navy-700 px-1 py-0.5 font-mono text-xs text-pm-cyan-300">/run/podmotion/checkpoints/&lt;ref&gt;/</code> (mode 0700, wiped on node reboot). AES-256-GCM checkpoint encryption is not implemented in v0.1.0-alpha. ADR-0029 (Accepted but never wired in — dead code) is superseded by ADR-0160 (Draft), which defines a CheckpointCrypto provider interface (none/aes-gcm/aws-kms/gcp-kms/azure-kms/vault). Checkpoints are plaintext today.
              </p>
              <p className="mb-2 text-sm leading-relaxed text-pm-white-muted">
                mTLS between operator and node-agent is opt-in via Helm values. In v0.1.0-alpha the implementation fails open: enabling mTLS does not guarantee channel enforcement. The channel is plaintext by default.
              </p>
              <p className="mb-2 text-sm leading-relaxed text-pm-white-muted">
                Structured audit logging is not implemented in v0.1.0-alpha. The <code className="rounded bg-pm-navy-700 px-1 py-0.5 font-mono text-xs text-pm-cyan-300">audit/</code> directory is a stub. PhaseTransition events are emitted; audit records are not.
              </p>
              <p className="text-sm leading-relaxed text-pm-white-muted">
                ADR-0148 (Accepted, unimplemented) defines the post-1.0 hardening roadmap: capability drop to the minimum CRIU/eBPF set (drop ALL; add SYS_PTRACE, SYS_ADMIN, NET_ADMIN, BPF, PERFMON), read-only containerd socket steady-state, hostPID:false via NRI-supplied PID, a trace-derived deny-by-default seccomp profile, and readOnlyRootFilesystem. gRPC mTLS enforcement is a separate workstream (ADR-0159/ADR-0161-C4), not ADR-0148. The controller-manager is already hardened: <code className="rounded bg-pm-navy-700 px-1 py-0.5 font-mono text-xs text-pm-cyan-300">runAsNonRoot</code>, <code className="rounded bg-pm-navy-700 px-1 py-0.5 font-mono text-xs text-pm-cyan-300">seccomp: RuntimeDefault</code>, <code className="rounded bg-pm-navy-700 px-1 py-0.5 font-mono text-xs text-pm-cyan-300">readOnlyRootFilesystem</code>, <code className="rounded bg-pm-navy-700 px-1 py-0.5 font-mono text-xs text-pm-cyan-300">drop: ALL</code>.
              </p>
            </li>
          </ul>
        </div>

      </div>
    </section>
  );
};

export default About;

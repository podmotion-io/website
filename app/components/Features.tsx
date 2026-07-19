import React from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

interface FeatureCardProps {
  title: string;
  body: React.ReactNode;
  deepLinkHref: string;
  deepLinkLabel: string;
}

interface AudienceCardProps {
  audience: string;
  question: string;
  answer: string;
  ctaLabel: string;
  ctaHref: string;
}

// ── Available feature cards (v0.1.0-alpha) ───────────────────────────────────

const availableFeatureCards: FeatureCardProps[] = [
  {
    title: 'Bounded freeze, never a restart',
    body: (
      <>
        PodMotion uses CRIU to checkpoint a running pod and restore it on
        another node, completing end-to-end in about 13 seconds in our cold-path
        proof run. The source pod is never deleted until the destination is
        verified serving (ADR-0012) — if anything fails, the migration rolls
        back and your pod keeps running where it was. This is real live migration
        with a verified traffic gate, not a stop-and-restart dressed up as zero
        downtime.
        <br />
        <span className="feature-card__scope">
          Proof substrate: amd64 / Linux 6.17 / containerd 1.7.24 / Kubernetes
          v1.32.0 / kindnet (host-routed, no VXLAN overlay).
        </span>
      </>
    ),
    deepLinkHref: '/#how-it-works',
    deepLinkLabel: 'How it works →',
  },
  {
    title: 'In-memory state restored intact across nodes',
    body: (
      <>
        No application changes required. PodMotion moves the running pod and
        restores it reachable at its original pod IP, with in-memory state
        carried across the node boundary — the Sprint 34 regression run restored
        an in-memory counter (<code>gcb7:counter=42</code>) intact on the
        destination node. The current proof verifies L3/L4 IP reachability after
        restore.
        <br />
        <span className="feature-card__scope">
          Next goal (not yet proven): live TCP-connection survival with{' '}
          <code>seq_delta=0</code> — containers and clients both unaware the pod
          moved. That guarantee is the milestone we are proving next; it is not
          yet proven.
        </span>
        <br />
        <span className="feature-card__scope">
          Proven end-to-end on a single declared substrate: amd64 / Linux 6.17 /
          kindnet (host-routed). Flannel VXLAN and cloud CNIs are on the roadmap,
          not proof.
        </span>
        <br />
        <span className="feature-card__scope">
          TCP preservation is opt-in via{' '}
          <code>tcpPreservationMode</code> (default: <code>None</code>;
          BestEffort or Strict opt-in). Strict mode is not yet proven. Source pod
          is never deleted before TrafficVerified (ADR-0012).
        </span>
      </>
    ),
    deepLinkHref: '/#ns4',
    deepLinkLabel: 'See the proof →',
  },
  {
    title: 'GitOps-safe',
    body: (
      <>
        PodMotion never mutates your Deployment, StatefulSet, or ReplicaSet
        spec. It works below the controller layer using an admission webhook, a
        scheduler plugin, and an NRI restore hook — so Argo&nbsp;CD and Flux see
        no drift. In the narrow case where a GitOps controller would race the
        migration, PodMotion sets an annotation that pauses reconciliation for
        the freeze window only, then removes it — no manual step, no spec change
        (ADR-0046). Declare the migration in Git as a{' '}
        <code>PodMigration</code> resource — Argo&nbsp;CD or Flux apply it like
        any other manifest.
      </>
    ),
    deepLinkHref: 'https://github.com/podmotion-io/podmotion#readme',
    deepLinkLabel: 'Architecture overview  →',
  },
];

// ── Roadmap feature card (NOT available in v0.1.0-alpha) ─────────────────────

const roadmapFeatureCard: FeatureCardProps = {
  title: 'Volumes follow the pod',
  body: (
    <>
      Storage migration (persistent volumes / PVCs) is deferred to v1.2 and is
      NOT available in v0.1.0-alpha. Pods with PVCs can still migrate if the
      volume is RWX and re-attachable on the destination node — the admission
      webhook blocks configurations that would not transfer safely. A four-tier
      strategy (Longhorn dual-engine, Ceph RBD <code>rbd migrate</code>,
      snapshot-clone-rsync, and RWX re-attach) is designed and scoped for
      v1.2. Deferred to v1.2.{' '}
      <span className="feature-card__warning">
        NOT available in current alpha — see the roadmap.
      </span>
    </>
  ),
  deepLinkHref: 'https://github.com/podmotion-io/podmotion#readme',
  deepLinkLabel: 'Storage tiers  →',
};

// ── Audience cards data ───────────────────────────────────────────────────────

const audienceCards: AudienceCardProps[] = [
  {
    audience: 'Platform / SRE',
    question: 'What is actually proven today?',
    answer:
      'A complete end-to-end live migration of a running, stateful pod across nodes on Kubernetes v1.32, restored reachable at its original pod IP in about 13 seconds, with in-memory state intact and 22/22 migration assertions passing.',
    ctaLabel: 'See the proof →',
    ctaHref: '/#ns4',
  },
  {
    audience: 'App developer',
    question: 'Will my app break during a migration?',
    answer:
      'You change nothing — PodMotion moves the pod and restores it reachable at its original IP. Live TCP-connection survival is the goal we are proving next; it is not yet proven.',
    ctaLabel: 'How it works →',
    ctaHref: '/#how-it-works',
  },
  {
    audience: 'DevOps / GitOps',
    question: 'Is it GitOps-compatible?',
    answer:
      'Yes. A migration is a standard Kubernetes resource — apply it from Git, Argo CD, or Flux.',
    ctaLabel: 'Install with Helm →',
    ctaHref: '/#get-started',
  },
  {
    audience: 'Engineering leadership',
    question: 'Is this production-ready?',
    answer:
      'Not yet. Pre-1.0 (v0.1.0-alpha), single-cluster, end-to-end proven on amd64 / Linux 6.17 / kindnet — with a public, milestone-by-milestone path to v1.0.',
    ctaLabel: 'See the roadmap →',
    ctaHref: 'https://github.com/podmotion-io/podmotion/milestones',
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function FeatureCard({ title, body, deepLinkHref, deepLinkLabel }: FeatureCardProps) {
  return (
    <div className="feature-card">
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__body">{body}</p>
      <a href={deepLinkHref} className="feature-card__link">
        {deepLinkLabel}
      </a>
    </div>
  );
}

function AudienceCard({
  audience,
  question,
  answer,
  ctaLabel,
  ctaHref,
}: AudienceCardProps) {
  return (
    <div className="audience-card">
      <span className="audience-card__label">{audience}</span>
      <p className="audience-card__question">{question}</p>
      <p className="audience-card__answer">{answer}</p>
      <a href={ctaHref} className="audience-card__cta">
        {ctaLabel}
      </a>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function Features() {
  return (
    <section id="features" aria-labelledby="features-heading">
      {/* ── Feature cards band ── */}
      <div className="features-band">
        <header className="features-band__header">
          <h2 id="features-heading" className="features-band__title">
            What makes it possible
          </h2>
          <p className="features-band__intro">
            Three properties available in v0.1.0-alpha that make a running pod
            portable.
          </p>
        </header>

        <div className="features-grid">
          {availableFeatureCards.map((card) => (
            <FeatureCard key={card.title} {...card} />
          ))}
        </div>

        {/* ── Roadmap section break ── */}
        <div className="roadmap-divider" aria-label="Roadmap section">
          <span className="roadmap-divider__label">
            Roadmap — Not Available in v0.1.0-alpha
          </span>
        </div>

        <div className="features-grid">
          <FeatureCard {...roadmapFeatureCard} />
        </div>
      </div>

      {/* ── Audience router band ── */}
      <div id="audiences" className="audiences-band">
        <div className="audiences-grid">
          {audienceCards.map((card) => (
            <AudienceCard key={card.audience} {...card} />
          ))}
        </div>
      </div>

      {/* ── Scoped styles ── */}
      <style>{`
        /* ── Band layout ── */
        .features-band {
          padding: 5rem 1.5rem 4rem;
          max-width: 72rem;
          margin: 0 auto;
        }

        .features-band__header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .features-band__title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--pm-text-primary, #E2E8F8);
          margin: 0 0 0.75rem;
        }

        .features-band__intro {
          font-size: 1.125rem;
          color: var(--pm-text-secondary, #8897B8);
          margin: 0;
        }

        /* ── Feature card grid: 2-col desktop, 1-col mobile ── */
        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }

        @media (min-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* ── Feature card ── */
        .feature-card {
          background-color: var(--pm-navy-700, #141B2E);
          border: 1px solid var(--pm-navy-600, #2A3550);
          border-radius: 0.75rem;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          transition: border-color 200ms ease;
        }

        .feature-card:hover {
          border-color: var(--pm-blue-500, #22D3EE);
        }

        .feature-card__title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--pm-text-primary, #E2E8F8);
          margin: 0;
          line-height: 1.4;
        }

        .feature-card__body {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: var(--pm-text-secondary, #8897B8);
          margin: 0;
          flex: 1;
        }

        .feature-card__body code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            'Liberation Mono', 'Courier New', monospace;
          font-size: 0.875em;
          color: var(--pm-cyan, #22D3EE);
          background-color: var(--pm-surface-3, #232E47);
          padding: 0.1em 0.35em;
          border-radius: 0.25rem;
        }

        .feature-card__scope {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.8125rem;
          font-style: italic;
          color: var(--pm-text-muted, #6475A0);
          line-height: 1.5;
        }

        .feature-card__warning {
          color: var(--pm-warning, #F59E0B);
        }

        .feature-card__link {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--pm-cyan, #22D3EE);
          text-decoration: none;
          margin-top: auto;
          transition: color 150ms ease;
        }

        .feature-card__link:hover {
          color: var(--pm-cyan-bright, #5EEAFF);
        }

        /* ── Roadmap divider ── */
        .roadmap-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 2.5rem 0 1.5rem;
        }

        .roadmap-divider::before,
        .roadmap-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background-color: var(--pm-navy-600, #2A3550);
        }

        .roadmap-divider__label {
          font-size: 0.8125rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--pm-warning, #F59E0B);
          white-space: nowrap;
        }

        /* ── Audience band ── */
        .audiences-band {
          background-color: var(--pm-bg-void, #05070F);
          padding: 4rem 1.5rem;
        }

        .audiences-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          max-width: 72rem;
          margin: 0 auto;
        }

        @media (min-width: 640px) {
          .audiences-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (min-width: 1024px) {
          .audiences-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        /* ── Audience card ── */
        .audience-card {
          background-color: var(--pm-navy-700, #141B2E);
          border: 1px solid var(--pm-navy-600, #2A3550);
          border-radius: 0.75rem;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          transition: border-color 200ms ease;
        }

        .audience-card:hover {
          border-color: var(--pm-blue-500, #22D3EE);
        }

        .audience-card__label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--pm-cyan, #22D3EE);
        }

        .audience-card__question {
          font-size: 1rem;
          font-weight: 600;
          color: var(--pm-text-primary, #E2E8F8);
          margin: 0;
          line-height: 1.4;
        }

        .audience-card__answer {
          font-size: 0.9375rem;
          line-height: 1.65;
          color: var(--pm-text-secondary, #8897B8);
          margin: 0;
          flex: 1;
        }

        .audience-card__cta {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--pm-cyan, #22D3EE);
          text-decoration: none;
          margin-top: auto;
          padding-top: 0.5rem;
          transition: color 150ms ease;
        }

        .audience-card__cta:hover {
          color: var(--pm-cyan-bright, #5EEAFF);
        }
      `}</style>
    </section>
  );
}

export default Features;

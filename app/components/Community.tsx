import React from 'react';

interface CommunityCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkLabel: string;
  href: string;
}

function CommunityCard({ icon, title, description, linkLabel, href }: CommunityCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 rounded-xl border border-pm-navy-700 bg-pm-navy-900 p-6 transition-colors hover:border-pm-cyan-500 hover:bg-pm-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pm-cyan-500"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-pm-navy-800 text-pm-cyan-400 group-hover:bg-pm-navy-700">
          {icon}
        </span>
        <h3 className="text-base font-semibold text-pm-white">{title}</h3>
      </div>
      <p className="flex-1 text-sm leading-relaxed text-pm-slate-300">{description}</p>
      <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-pm-cyan-400 group-hover:text-pm-cyan-300">
        {linkLabel}
        <svg
          aria-hidden="true"
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </span>
    </a>
  );
}

const REPO_BASE = 'https://github.com/podmotion-io/podmotion';

const cards: CommunityCardProps[] = [
  {
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
      </svg>
    ),
    title: 'GitHub',
    description:
      'Browse source, open issues, and follow the project. All development happens in the open under Apache-2.0.',
    linkLabel: 'Star on GitHub ',
    href: REPO_BASE,
  },
  {
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    ),
    title: 'Contributing',
    description:
      'Read the contributor guide to set up a local cluster, run the integration harness, and submit a pull request.',
    linkLabel: 'Read CONTRIBUTING ',
    href: `${REPO_BASE}/blob/main/CONTRIBUTING.md`,
  },
  {
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      </svg>
    ),
    title: 'Security Disclosure',
    description:
      'Report security vulnerabilities to security@podmotion.io. We acknowledge within 72 hours. See our Security Architecture page and SECURITY.md for scope and coordinated disclosure policy. Note: inter-component gRPC on :9090 defaults to plaintext — enable mTLS before production use.',
    linkLabel: 'SECURITY.md ',
    href: 'https://github.com/podmotion-io/podmotion/blob/main/SECURITY.md',
  },
  {
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z" />
      </svg>
    ),
    title: 'Discussions',
    description:
      'Ask questions, share use cases, and propose ideas in GitHub Discussions. This is the primary support channel for the project. A real-time channel (Discord or Slack) is planned but not yet available.',
    linkLabel: 'Open Discussions ',
    href: `${REPO_BASE}/discussions`,
  },
  {
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8ZM6 1v3M10 1v3M14 1v3" />
      </svg>
    ),
    title: 'Code of Conduct',
    description:
      'PodMotion adopts the Contributor Covenant. All community spaces — GitHub Issues, Discussions, PRs, and events — are covered. Violations may be reported to the maintainer.',
    linkLabel: 'Read CODE_OF_CONDUCT.md ',
    href: `${REPO_BASE}/blob/main/CODE_OF_CONDUCT.md`,
  },
];

type OutOfScopeChip = {
  label: string;
  note: string;
};

const outOfScopeChips: OutOfScopeChip[] = [
  { label: 'Windows nodes', note: 'out of scope' },
  { label: 'GPU workloads', note: 'deferred' },
  { label: 'Multi-cluster migration', note: 'long-term roadmap' },
];

export default function Community() {
  return (
    <section id="community" aria-labelledby="community-heading" className="bg-pm-navy-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-pm-cyan-400">Community</p>
          <h2
            id="community-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-pm-white sm:text-4xl"
          >
            Join the project
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-pm-slate-300">
            Apache-2.0, vendor-neutral, and built in the open. An experimental Kubernetes
            project shaped by transparent research, public proof, and community review.
          </p>
        </div>

        {/* Status strip */}
        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-2 rounded-xl border border-pm-navy-700 bg-pm-navy-900 px-6 py-4">
          <span className="text-xs font-medium text-pm-slate-400">Current status:</span>
          {[
            'v0.1.0-alpha',
            'experimental',
            'single-cluster',
            'amd64 validated (arm64 post-v1.0)',
            'community governed',
          ].map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center rounded-full bg-pm-navy-800 px-3 py-1 text-xs font-medium text-pm-slate-300 ring-1 ring-inset ring-pm-navy-600"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* v1.0 progress bar */}
        <div className="mx-auto mt-6 max-w-4xl rounded-xl border border-pm-navy-700 bg-pm-navy-900 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-pm-slate-200">Path to v1.0 readiness</span>
            <span className="text-sm font-semibold text-pm-cyan-400">~45% · M22 of M30</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={45}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Path to v1.0 readiness: approximately 45 percent complete, milestone 22 of 30"
            className="mt-3 h-2 w-full overflow-hidden rounded-full bg-pm-navy-800"
          >
            <div
              className="h-full rounded-full bg-pm-cyan-500"
              style={{ width: '45%' }}
            />
          </div>
          <p className="mt-2 text-xs text-pm-slate-500">
            See the full{' '}
            <a
              href="https://github.com/podmotion-io/podmotion/milestones"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pm-cyan-400 hover:text-pm-cyan-300 underline underline-offset-2"
            >
              milestones
            </a>{' '}
            for gate conditions and the validation footprint.
          </p>
        </div>

        {/* Community cards */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <CommunityCard key={card.title} {...card} />
          ))}
        </div>

        {/* Governance honesty callout */}
        <div className="mx-auto mt-10 max-w-4xl rounded-xl border border-amber-800/40 bg-amber-950/30 px-6 py-5">
          <div className="flex gap-3">
            <svg
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-amber-300">Governance commitment</p>
              <p className="mt-1 text-sm leading-relaxed text-amber-200/80">
                PodMotion will grow through documented ownership, transparent decisions,
                independent maintainers, and a clear path toward durable multi-organization stewardship.
              </p>
            </div>
          </div>
        </div>

        {/* Support note */}
        <div className="mx-auto mt-6 max-w-4xl rounded-xl border border-pm-navy-700 bg-pm-navy-900 px-6 py-4">
          <div className="flex gap-3">
            <svg
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-pm-slate-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm leading-relaxed text-pm-slate-300">
              Support is community-based via{' '}
              <a
                href={`${REPO_BASE}/discussions`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pm-cyan-400 hover:text-pm-cyan-300 underline underline-offset-2"
              >
                GitHub Discussions
              </a>{' '}
              and{' '}
              <a
                href={`${REPO_BASE}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pm-cyan-400 hover:text-pm-cyan-300 underline underline-offset-2"
              >
                Issues
              </a>
              ; commercial support is not currently available.
            </p>
          </div>
        </div>

        {/* Out-of-scope chips */}
        <div className="mx-auto mt-8 max-w-4xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-pm-slate-500">
            Explicitly out of scope
          </p>
          <div className="flex flex-wrap gap-2">
            {outOfScopeChips.map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-pm-navy-700 bg-pm-navy-900 px-3 py-1 text-xs text-pm-slate-400"
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-pm-slate-600"
                />
                <span className="font-medium text-pm-slate-300">{chip.label}</span>
                <span className="text-pm-slate-500">— {chip.note}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

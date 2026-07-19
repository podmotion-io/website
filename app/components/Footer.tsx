import React from 'react';

const REPO_BASE = 'https://github.com/podmotion-io/podmotion';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

const columns: FooterColumn[] = [
  {
    heading: 'Product',
    links: [
      { label: 'How It Works', href: '/#how-it-works' },
      { label: 'Features', href: '/#features' },
      { label: 'CLI', href: '/#cli' },
      { label: 'Architecture', href: 'https://github.com/podmotion-io/podmotion#readme', external: true },
    ],
  },
  {
    heading: 'Community',
    links: [
      { label: 'GitHub', href: REPO_BASE, external: true },
      { label: 'Discussions', href: `${REPO_BASE}/discussions`, external: true },
      { label: 'Contributing', href: `${REPO_BASE}/blob/main/CONTRIBUTING.md`, external: true },
      { label: 'Governance', href: `${REPO_BASE}/blob/main/GOVERNANCE.md`, external: true },
      { label: 'Code of Conduct', href: `${REPO_BASE}/blob/main/CODE_OF_CONDUCT.md`, external: true },
    ],
  },
  {
    heading: 'Project',
    links: [
      { label: 'NS#4 Proof', href: '/#ns4' },
      { label: 'Milestones', href: 'https://github.com/podmotion-io/podmotion/milestones', external: true },
      { label: 'Security Policy', href: `${REPO_BASE}/blob/main/SECURITY.md`, external: true },
      { label: 'License (Apache-2.0)', href: `${REPO_BASE}/blob/main/LICENSE`, external: true },
    ],
  },
];

function UndyingNodeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-7 flex-shrink-0"
    >
      {/* Outer node ring */}
      <circle cx="16" cy="16" r="14" stroke="#22d3ee" strokeWidth="1.5" />
      {/* Pod square (source) */}
      <rect x="5" y="12" width="8" height="8" rx="1.5" fill="#164e63" stroke="#22d3ee" strokeWidth="1.25" />
      {/* Pod square (destination, arriving) */}
      <rect x="19" y="12" width="8" height="8" rx="1.5" fill="#0e7490" stroke="#22d3ee" strokeWidth="1.25" />
      {/* Migration arrow */}
      <path
        d="M14 16h4m0 0-2-2m2 2-2 2"
        stroke="#22d3ee"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* TCP connection line that survives */}
      <path
        d="M9 11 Q16 6 23 11"
        stroke="#06b6d4"
        strokeWidth="1"
        strokeDasharray="2 1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer
      id="footer"
      aria-label="Site footer"
      className="bg-pm-navy-950 border-t border-pm-navy-800"
    >
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <a
              href="/#top"
              className="inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pm-cyan-500 rounded"
              aria-label="PodMotion home"
            >
              <UndyingNodeIcon />
              <span className="text-lg font-bold tracking-tight text-pm-white">PodMotion</span>
            </a>
            <p className="text-sm leading-relaxed text-pm-slate-400">
              Live-migrate running pods.<br />
              Keep every TCP connection.
            </p>
            <a
              href={REPO_BASE}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="PodMotion on GitHub"
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-pm-navy-700 bg-pm-navy-900 px-3 py-2 text-sm text-pm-slate-300 transition-colors hover:border-pm-cyan-700 hover:text-pm-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pm-cyan-500"
            >
              <GitHubIcon />
              <span>podmotion-io/podmotion</span>
            </a>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-semibold uppercase tracking-widest text-pm-slate-500">
                {col.heading}
              </p>
              <ul role="list" className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="text-sm text-pm-slate-400 transition-colors hover:text-pm-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pm-cyan-500 rounded"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-pm-navy-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/* Copyright */}
            <p className="text-sm text-pm-slate-500">
              &copy; 2026 PodMotion Authors &middot; Apache-2.0 &middot; A{' '}
              <a
                href="https://corveth.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pm-slate-400 underline hover:text-pm-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pm-cyan-500 rounded"
              >
                Corveth LLC
              </a>{' '}
              project
            </p>

            {/* Version pill + CNCF disclaimer */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center rounded-full bg-pm-navy-800 px-2.5 py-0.5 text-xs font-medium text-pm-cyan-400 ring-1 ring-inset ring-pm-navy-700">
                v0.1.0-alpha
              </span>
              <span className="text-xs text-pm-slate-600">
                PodMotion is not affiliated with the CNCF
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import React from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface BulletProps {
  title: string;
  body: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const BULLETS: BulletProps[] = [
  {
    title: 'Proof you can re-run.',
    body: 'Every performance and correctness claim ships with reproducible evidence, not marketing numbers — verify it, don’t trust it.',
  },
  {
    title: 'Adversarial by design.',
    body: 'The security posture was pressure-tested against a hostile threat model throughout the build, not hardened after the fact.',
  },
  {
    title: 'Decisions on the record.',
    body: 'Every material architectural choice is a written decision record — what was weighed and why. No black boxes.',
  },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function HowItWasBuilt() {
  return (
    <section
      id="how-it-was-built"
      aria-labelledby="how-it-was-built-heading"
      className="bg-pm-navy-950 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* 1 — Eyebrow + headline */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-pm-cyan-400">
            How It Was Built
          </p>
          <h2
            id="how-it-was-built-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-pm-white sm:text-4xl"
          >
            Two Breakthroughs, One Project
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-pm-slate-300">
            PodMotion made pods immortal — and the way it was built left a trail you can re-run.
          </p>
        </div>

        {/* 2 — Narrative paragraphs */}
        <div className="mx-auto mt-12 max-w-3xl space-y-6 text-base leading-relaxed text-pm-slate-300">
          <p>
            PodMotion set out to do something the industry treats as impossible: move a running
            container between nodes without dropping a single connection — zero TCP sequence delta,
            live. Making pods immortal was only half of it. Work this unforgiving had to be built
            differently — by one person directing a fleet of AI agents, held to a far higher bar than
            AI-assisted work usually meets.
          </p>
          <p>
            Most AI-assisted work lets agents write code and calls it done. PodMotion didn&rsquo;t.
            Every architectural decision, every security claim, and every performance number had to
            earn its place against evidence before it shipped. What that produced is fully public: an
            unusually deep trail of decision records, reproducible proofs, and adversarial security
            reviews — the kind of paper trail you expect from a mature, audited platform, not a young
            project.
          </p>
          <p>
            That trail isn&rsquo;t a polish pass. It&rsquo;s the exhaust of how the system was built —
            rigor baked into the process, not bolted on after. Two firsts, built at once.
          </p>
        </div>

        {/* 3 — Three bullet cards */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-3">
          {BULLETS.map((bullet) => (
            <div
              key={bullet.title}
              className="rounded-xl border border-pm-navy-700 bg-pm-navy-900 p-6"
            >
              <h3 className="text-base font-semibold text-pm-white">{bullet.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-pm-slate-300">{bullet.body}</p>
            </div>
          ))}
        </div>

        {/* 4 — Closing CTA */}
        <div className="mx-auto mt-16 max-w-2xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://github.com/podmotion-io/podmotion"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-pm-navy-700 bg-pm-navy-900 px-5 py-2.5 text-sm font-medium text-pm-white transition-colors hover:border-pm-cyan-500 hover:bg-pm-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pm-cyan-500"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
              </svg>
              View on GitHub
            </a>
            <a
              href="https://docs.podmotion.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-pm-cyan-500 px-5 py-2.5 text-sm font-semibold text-pm-navy-950 transition-colors hover:bg-pm-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pm-cyan-500"
            >
              Read the docs
              <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

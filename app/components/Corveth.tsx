import type { FC } from "react";

/**
 * Placeholder section — wired into app/page.tsx but never designed.
 * Unblocks the static build; replace with real Corveth/drex content.
 */
const Corveth: FC = () => {
  return (
    <section
      id="corveth"
      className="bg-pm-navy-950 py-24 sm:py-32"
      aria-labelledby="corveth-heading"
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-pm-cyan-300">
          Methodology
        </p>
        <h2
          id="corveth-heading"
          className="mb-6 text-3xl font-bold leading-tight tracking-tight text-pm-white sm:text-4xl"
        >
          Built by the drex
        </h2>
        <p className="max-w-3xl text-lg leading-relaxed text-pm-white-muted">
          PodMotion is built using Corveth — an ADR-paired, multi-agent engineering
          methodology (the &quot;AI Drex&quot;): every architectural decision is written and
          ratified by an independent reviewer quorum before code is written, every sprint
          gate is verified against that decision, and a permanent security review persona
          sits on every panel. Full writeup coming soon at{" "}
          <a
            href="https://corveth.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pm-cyan-300 underline hover:text-pm-cyan-500"
          >
            corveth.ai
          </a>
          .
        </p>
      </div>
    </section>
  );
};

export default Corveth;

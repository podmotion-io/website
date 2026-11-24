import React from "react";

export default function Vethyam() {
  return (
    <section
      id="vethyam"
      aria-labelledby="vethyam-heading"
      className="border-y border-pm-navy-700 bg-pm-navy-900 py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_0.85fr] lg:px-12">
        <div>
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-pm-cyan-300">
            New CNI · experimental · under construction
          </p>
          <h2
            id="vethyam-heading"
            className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-pm-white sm:text-5xl"
          >
            Vethyam keeps pod identity attached while the workload moves.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pm-slate-300">
            PodMotion is building <strong className="text-pm-white">Vethyam</strong>, a
            purpose-built Kubernetes CNI designed to help preserve pod IP addressing
            across migrations. It will work alongside PodMotion&apos;s checkpoint/restore
            engine where the destination network can accept or retain the pod&apos;s identity.
          </p>
        </div>

        <div className="rounded-xl border border-pm-navy-600 bg-pm-navy-800 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.4),0_8px_24px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between border-b border-pm-navy-600 pb-4">
            <span className="font-mono text-sm font-semibold text-pm-white">vethyam/roadmap</span>
            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-amber-200">
              planning
            </span>
          </div>
          <dl className="mt-5 space-y-5">
            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-pm-cyan-300">Goal</dt>
              <dd className="mt-1 text-sm leading-relaxed text-pm-slate-300">
                Preserve pod IP reachability and make destination-side cutover deterministic.
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-pm-cyan-300">Status</dt>
              <dd className="mt-1 text-sm leading-relaxed text-pm-slate-300">
                Not implemented or proven. Cloud and CNI interoperability remains to be designed and tested.
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-pm-cyan-300">Relationship</dt>
              <dd className="mt-1 text-sm leading-relaxed text-pm-slate-300">
                Vethyam will complement PodMotion; the migration engine and CNI are separate projects.
              </dd>
            </div>
          </dl>
          <a
            href="https://github.com/podmotion-io/podmotion/milestones"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-pm-cyan-300 hover:text-pm-cyan-100"
          >
            Follow the roadmap <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

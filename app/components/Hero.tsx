'use client';

import React from 'react';

// ---------------------------------------------------------------------------
// Terminal block
// ---------------------------------------------------------------------------
const TerminalBlock: React.FC = () => (
  <div
    style={{
      background: 'var(--pm-surface-1, #141B2E)',
      border: '1px solid var(--pm-border, #2A3550)',
      borderRadius: 'var(--pm-radius-md, 10px)',
      overflow: 'hidden',
      boxShadow: 'var(--pm-shadow-card, 0 1px 2px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3))',
      width: '100%',
      maxWidth: '540px',
    }}
    aria-label="Terminal: PodMigration CR example"
    role="region"
  >
    {/* Window chrome bar */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '10px 16px',
        background: 'var(--pm-surface-2, #1B2438)',
        borderBottom: '1px solid var(--pm-border, #2A3550)',
      }}
    >
      <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#3A4866', display: 'inline-block' }} />
      <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#3A4866', display: 'inline-block' }} />
      <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#3A4866', display: 'inline-block' }} />
      <span
        style={{
          marginLeft: 'auto',
          fontFamily: "'JetBrains Mono', 'SF Mono', ui-monospace, Consolas, monospace",
          fontSize: '11px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--pm-text-muted, #94A3B8)',
          fontWeight: 600,
          lineHeight: 1.4,
        }}
      >
        kubectl apply
      </span>
    </div>

    {/* Terminal body */}
    <div
      style={{
        padding: '20px 24px',
        fontFamily: "'JetBrains Mono', 'SF Mono', ui-monospace, Consolas, monospace",
        fontSize: '13px',
        lineHeight: '1.7',
        color: 'var(--pm-text-primary, #F1F5F9)',
      }}
    >
      {/* Command line */}
      <div>
        <span style={{ color: 'var(--pm-text-subtle, #64748B)', userSelect: 'none' }}>$ </span>
        <span style={{ color: 'var(--pm-text-primary, #F1F5F9)' }}>
          kubectl apply -f podmigration.yaml
        </span>
      </div>

      {/* Comment */}
      <div style={{ color: 'var(--pm-text-subtle, #64748B)', fontStyle: 'italic', marginTop: '4px' }}>
        {'# kind: PodMigration · tcpPreservationMode: BestEffort (default None)'}
      </div>

      {/* Result line */}
      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: 'var(--pm-success, #34D399)' }}>✓</span>
        <span>
          <span style={{ color: 'var(--pm-text-primary, #F1F5F9)' }}>Migration complete</span>
          <span style={{ color: 'var(--pm-text-muted, #94A3B8)' }}> · </span>
          <span style={{ color: 'var(--pm-text-secondary, #CBD5E1)' }}>~</span>
          <span style={{ color: 'var(--pm-warning, #FBBF24)', fontWeight: 500 }}>13</span>
          <span style={{ color: 'var(--pm-text-secondary, #CBD5E1)' }}> s (cold-path proof run)</span>
        </span>
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Hero section
// ---------------------------------------------------------------------------
const Hero: React.FC = () => {
  return (
    <section
      id="top"
      aria-label="PodMotion hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #05070F 0%, #0A0E1A 45%, #0F1525 100%)',
        paddingBlock: 'clamp(48px, 5vw, 80px) clamp(64px, 8vw, 128px)',
        paddingInline: 'clamp(20px, 4vw, 48px)',
      }}
    >
      {/* Radial glow behind the mark (right column area) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          right: '10%',
          transform: 'translate(30%, -50%)',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.10) 0%, rgba(34,211,238,0.03) 50%, transparent 75%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Constrained content wrapper */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '1200px',
          marginInline: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
          gap: 'clamp(48px, 6vw, 80px)',
          alignItems: 'center',
        }}
      >
        {/* ----------------------------------------------------------------
            LEFT COLUMN — text content
        ---------------------------------------------------------------- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "'JetBrains Mono', 'SF Mono', ui-monospace, Consolas, monospace",
              fontSize: '13px',
              fontWeight: 400,
              lineHeight: 1.4,
              letterSpacing: '0.08em',
              color: '#93C5FD',  // text-pm-blue-300 equivalent — blue-300
              margin: 0,
            }}
          >
            Experimental Kubernetes project · entirely LLM-built · v0.1.0-alpha
          </p>

          {/* H1 */}
          <h1
            style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontSize: 'clamp(2.25rem, 5vw + 0.5rem, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
              color: '#F1F5F9',
              margin: 0,
            }}
          >
            Live-migrate running pods.{' '}
            <br />
            Move them across platforms entirely.
          </h1>

          {/* Mission subhead — both pillars, co-equal, condensed */}
          <p
            style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontSize: '18px',
              fontWeight: 400,
              lineHeight: 1.65,
              letterSpacing: 0,
              color: '#CBD5E1',
              margin: 0,
              maxWidth: '58ch',
            }}
          >
            This is an experimental open-source project built in the open, primarily by Claude
            and other large language models with human direction and review. The codebase is
            alpha-quality and evolving quickly: treat proof results as scoped evidence, not
            production guarantees. PodMotion is currently exploring live migration and pod IP
            preservation; Vethyam is a new CNI being designed to help complete that work.
          </p>

          {/* CTA row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            {/* Primary CTA */}
            <a
              href="#get-started"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: '52px',
                padding: '0 28px',
                borderRadius: '10px',
                background: '#22D3EE',
                color: '#05070F',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                fontSize: '15px',
                fontWeight: 600,
                lineHeight: 1,
                textDecoration: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 220ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 220ms cubic-bezier(0.4, 0, 0.2, 1)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = '#5EEAFF';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  '0 0 0 1px rgba(34,211,238,0.4), 0 0 24px rgba(34,211,238,0.25)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = '#22D3EE';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
              }}
            >
              Get started
            </a>

            {/* Ghost CTA */}
            <a
              href="#proof"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: '52px',
                padding: '0 24px',
                borderRadius: '10px',
                background: 'transparent',
                color: '#CBD5E1',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                fontSize: '15px',
                fontWeight: 600,
                lineHeight: 1,
                textDecoration: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 220ms cubic-bezier(0.4, 0, 0.2, 1), background 220ms cubic-bezier(0.4, 0, 0.2, 1)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#22D3EE';
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(34,211,238,0.10)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#CBD5E1';
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              }}
            >
              See the proof
            </a>

            {/* Text link */}
            <a
              href="https://github.com/podmotion-io/podmotion"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#22D3EE',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'color 120ms cubic-bezier(0.4, 0, 0.2, 1)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#5EEAFF';
                (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#22D3EE';
                (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none';
              }}
            >
              Star on GitHub →
            </a>
          </div>

          {/* Terminal block */}
          <TerminalBlock />
        </div>

        {/* ----------------------------------------------------------------
            RIGHT COLUMN — PodMotion logo lockup
        ---------------------------------------------------------------- */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontSize: 'clamp(1.125rem, 1.5vw + 0.75rem, 1.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: '#F1F5F9',
              margin: 0,
              marginBottom: '14px',
              textAlign: 'center',
            }}
          >
            Kubernetes Pods Made Immortal<sup style={{ fontSize: '0.5em', marginLeft: '2px' }}>&reg;</sup>
          </p>
          <p className="text-center text-pm-cyan-300 font-light tracking-[0.25em] uppercase text-sm mb-2 select-none">
            Live migration + cross-platform portability, one engine
          </p>
          <p className="text-center text-pm-text-muted font-light tracking-[0.15em] uppercase text-xs mb-10 select-none">
            seq_delta=0 — first proven at Sprint 46 (single held connection); full multi-flow bar ahead
          </p>
          {/* UndyingNodeMark — 280×280 quantum omnipresence / concentric rings */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Radial glow */}
            <div style={{ position: 'absolute', width: '256px', height: '256px', borderRadius: '50%', background: 'rgba(34,211,238,0.10)', filter: 'blur(48px)' }}/>
            <svg width="280" height="280" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative', zIndex: 10 }}>
              {/* Outer ring */}
              <circle cx="140" cy="140" r="130" stroke="#22D3EE" strokeWidth="1" strokeOpacity="0.15"/>
              {/* Mid ring */}
              <circle cx="140" cy="140" r="90" stroke="#22D3EE" strokeWidth="1" strokeOpacity="0.25"/>
              {/* Inner ring */}
              <circle cx="140" cy="140" r="50" stroke="#22D3EE" strokeWidth="1.5" strokeOpacity="0.4"/>
              {/* Core */}
              <circle cx="140" cy="140" r="16" fill="#22D3EE" fillOpacity="0.15" stroke="#22D3EE" strokeWidth="1.5"/>
              <circle cx="140" cy="140" r="6" fill="#22D3EE"/>
              {/* Cardinal satellite nodes — N, E, S, W */}
              <circle cx="140" cy="10" r="5" fill="#22D3EE" fillOpacity="0.6"/>
              <circle cx="270" cy="140" r="5" fill="#22D3EE" fillOpacity="0.6"/>
              <circle cx="140" cy="270" r="5" fill="#22D3EE" fillOpacity="0.6"/>
              <circle cx="10" cy="140" r="5" fill="#22D3EE" fillOpacity="0.6"/>
              {/* Diagonal nodes */}
              <circle cx="232" cy="48" r="3.5" fill="#22D3EE" fillOpacity="0.35"/>
              <circle cx="232" cy="232" r="3.5" fill="#22D3EE" fillOpacity="0.35"/>
              <circle cx="48" cy="232" r="3.5" fill="#22D3EE" fillOpacity="0.35"/>
              <circle cx="48" cy="48" r="3.5" fill="#22D3EE" fillOpacity="0.35"/>
              {/* Spoke lines from core to cardinal nodes */}
              <line x1="140" y1="124" x2="140" y2="15" stroke="#22D3EE" strokeWidth="0.5" strokeOpacity="0.2"/>
              <line x1="156" y1="140" x2="265" y2="140" stroke="#22D3EE" strokeWidth="0.5" strokeOpacity="0.2"/>
              <line x1="140" y1="156" x2="140" y2="265" stroke="#22D3EE" strokeWidth="0.5" strokeOpacity="0.2"/>
              <line x1="124" y1="140" x2="15" y2="140" stroke="#22D3EE" strokeWidth="0.5" strokeOpacity="0.2"/>
              {/* Pulse ring — animated */}
              <circle cx="140" cy="140" r="50" stroke="#22D3EE" strokeWidth="1" strokeOpacity="0.6">
                <animate attributeName="r" values="50;130;50" dur="4s" repeatCount="indefinite"/>
                <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="4s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

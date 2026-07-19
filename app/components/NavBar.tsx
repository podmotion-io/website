'use client';

import { useState, useEffect } from 'react';

interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Features', href: '/#features' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Economics', href: '/#economics' },
  { label: 'CLI', href: '/#cli' },
  { label: 'Roadmap', href: '/#roadmap' },
  { label: 'Community', href: '/#community' },
  { label: 'About', href: '/#about' },
  { label: 'Security', href: '/#security-posture' },
  { label: 'Docs', href: 'https://docs.podmotion.io', external: true },
];

const GITHUB_URL = 'https://github.com/podmotion-io/podmotion';


export default function NavBar(): React.ReactElement {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 8);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const closeMobile = (): void => setMobileOpen(false);

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: '64px',
          backgroundColor: scrolled
            ? 'rgba(10, 14, 26, 0.95)'
            : 'rgba(10, 14, 26, 0.90)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: scrolled
            ? '1px solid #2A3550'
            : '1px solid transparent',
          transition:
            'background-color 220ms cubic-bezier(0.4,0,0.2,1), border-color 220ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div
          style={{
            width: 'min(100% - 40px, 1200px)',
            marginInline: 'auto',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* ── Left: wordmark ── */}
          <a
            href="/#top"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
            aria-label="PodMotion — home"
          >
            {/* UndyingNodeMark — 32×32 pod-in-flight glyph */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Source pod — rounded rect */}
              <rect x="2" y="10" width="12" height="12" rx="3" fill="#0B1527" stroke="#22D3EE" strokeWidth="1.5"/>
              {/* Destination pod — rounded rect */}
              <rect x="18" y="10" width="12" height="12" rx="3" fill="#0B1527" stroke="#22D3EE" strokeWidth="1.5" opacity="0.5"/>
              {/* Migration path — dashed line */}
              <line x1="14" y1="16" x2="18" y2="16" stroke="#22D3EE" strokeWidth="1.5" strokeDasharray="2 2"/>
              {/* Live state indicator — cyan square */}
              <rect x="14.5" y="14.5" width="3" height="3" rx="0.5" fill="#22D3EE"/>
            </svg>
            <span style={{ whiteSpace: 'nowrap' }}><span style={{ fontWeight: 700, color: '#22D3EE', letterSpacing: '-0.02em' }}>Pod</span><span style={{ fontWeight: 300, color: '#F1F5F9', letterSpacing: '-0.02em' }}>Motion</span></span>
          </a>

          {/* ── Brand co-mark: "a Corveth project" pill badge — PodMotion stays primary; ── */}
          {/* ── this reads as a distinct, unambiguous "powered by" mark, not nav text.  ── */}
          <a
            href="https://corveth.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="pm-corveth-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              marginLeft: '4px',
              padding: '4px 10px 4px 8px',
              borderRadius: '999px',
              background: 'rgba(148,163,184,0.07)',
              border: '1px solid rgba(148,163,184,0.16)',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.02em',
              color: '#94A3B8',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'color 120ms cubic-bezier(0.4,0,0.2,1), background-color 120ms cubic-bezier(0.4,0,0.2,1), border-color 120ms cubic-bezier(0.4,0,0.2,1)',
            }}
            aria-label="A Corveth project — corveth.ai"
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = '#F1F5F9';
              el.style.background = 'rgba(148,163,184,0.13)';
              el.style.borderColor = 'rgba(148,163,184,0.28)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = '#94A3B8';
              el.style.background = 'rgba(148,163,184,0.07)';
              el.style.borderColor = 'rgba(148,163,184,0.16)';
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: '#22D3EE',
                flexShrink: 0,
              }}
            />
            a Corveth project
          </a>

          {/* ── Desktop nav ── */}
          <nav
            aria-label="Primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
            }}
            className="pm-desktop-nav"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  color: '#CBD5E1',
                  fontSize: '13px',
                  fontWeight: 400,
                  textDecoration: 'none',
                  padding: '5px 9px',
                  borderRadius: '6px',
                  transition:
                    'color 120ms cubic-bezier(0.4,0,0.2,1), background-color 120ms cubic-bezier(0.4,0,0.2,1)',
                  fontFamily:
                    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    '#F1F5F9';
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    'rgba(34,211,238,0.06)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    '#CBD5E1';
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    'transparent';
                }}
              >
                {link.label}
              </a>
            ))}

            {/* Divider before action buttons */}
            <span style={{ width: '1px', height: '18px', backgroundColor: '#2A3550', margin: '0 6px', flexShrink: 0 }} aria-hidden="true" />

            {/* Get started — ghost button */}
            <a
              href="/#get-started"
              style={{
                color: '#22D3EE',
                fontSize: '13px',
                fontWeight: 500,
                textDecoration: 'none',
                padding: '5px 13px',
                border: '1px solid #22D3EE',
                borderRadius: '10px',
                transition:
                  'color 120ms cubic-bezier(0.4,0,0.2,1), background-color 120ms cubic-bezier(0.4,0,0.2,1), box-shadow 120ms cubic-bezier(0.4,0,0.2,1)',
                fontFamily:
                  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.backgroundColor = 'rgba(34,211,238,0.10)';
                el.style.boxShadow =
                  '0 0 0 1px rgba(34,211,238,0.4), 0 0 24px rgba(34,211,238,0.15)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.backgroundColor = 'transparent';
                el.style.boxShadow = 'none';
              }}
            >
              Get started
            </a>

            {/* GitHub ↗ */}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#CBD5E1',
                fontSize: '13px',
                fontWeight: 400,
                textDecoration: 'none',
                padding: '5px 9px',
                borderRadius: '6px',
                transition:
                  'color 120ms cubic-bezier(0.4,0,0.2,1), background-color 120ms cubic-bezier(0.4,0,0.2,1)',
                fontFamily:
                  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#F1F5F9';
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  'rgba(34,211,238,0.06)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#CBD5E1';
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  'transparent';
              }}
            >
              GitHub &nbsp;↗
            </a>
          </nav>

          {/* ── Hamburger (mobile only) ── */}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="pm-mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: '#CBD5E1',
              borderRadius: '6px',
            }}
            className="pm-hamburger"
          >
            {mobileOpen ? (
              /* X icon */
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <line
                  x1="4"
                  y1="4"
                  x2="16"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="16"
                  y1="4"
                  x2="4"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              /* Hamburger icon */
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <line
                  x1="3"
                  y1="6"
                  x2="17"
                  y2="6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="3"
                  y1="10"
                  x2="17"
                  y2="10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="3"
                  y1="14"
                  x2="17"
                  y2="14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ── Mobile menu drawer ── */}
      {mobileOpen && (
        <>
          {/* Scrim */}
          <div
            aria-hidden="true"
            onClick={closeMobile}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 40,
              backgroundColor: 'rgba(5,7,15,0.85)',
            }}
          />

          {/* Drawer */}
          <nav
            id="pm-mobile-menu"
            aria-label="Mobile primary navigation"
            style={{
              position: 'fixed',
              top: '64px',
              left: 0,
              right: 0,
              zIndex: 45,
              backgroundColor: '#0A0E1A',
              borderBottom: '1px solid #2A3550',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                style={{
                  color: '#CBD5E1',
                  fontSize: '16px',
                  fontWeight: 400,
                  textDecoration: 'none',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  display: 'block',
                  transition:
                    'color 120ms cubic-bezier(0.4,0,0.2,1), background-color 120ms cubic-bezier(0.4,0,0.2,1)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    '#F1F5F9';
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    'rgba(34,211,238,0.06)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    '#CBD5E1';
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    'transparent';
                }}
              >
                {link.label}
              </a>
            ))}

            {/* Get started — ghost button (mobile) */}
            <a
              href="/#get-started"
              onClick={closeMobile}
              style={{
                color: '#22D3EE',
                fontSize: '16px',
                fontWeight: 500,
                textDecoration: 'none',
                padding: '12px 16px',
                border: '1px solid #22D3EE',
                borderRadius: '10px',
                display: 'block',
                marginTop: '8px',
                textAlign: 'center',
                transition:
                  'background-color 120ms cubic-bezier(0.4,0,0.2,1)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  'rgba(34,211,238,0.10)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  'transparent';
              }}
            >
              Get started
            </a>

            {/* GitHub ↗ (mobile) */}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobile}
              style={{
                color: '#CBD5E1',
                fontSize: '16px',
                fontWeight: 400,
                textDecoration: 'none',
                padding: '12px 16px',
                borderRadius: '6px',
                display: 'block',
                transition:
                  'color 120ms cubic-bezier(0.4,0,0.2,1), background-color 120ms cubic-bezier(0.4,0,0.2,1)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#F1F5F9';
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  'rgba(34,211,238,0.06)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#CBD5E1';
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  'transparent';
              }}
            >
              GitHub &nbsp;↗
            </a>
          </nav>
        </>
      )}

      {/* Scoped styles for responsive show/hide */}
      <style>{`
        @media (max-width: 1023px) {
          .pm-desktop-nav { display: none !important; }
          .pm-hamburger { display: flex !important; align-items: center; justify-content: center; }
        }
        @media (max-width: 480px) {
          .pm-corveth-badge { display: none !important; }
        }
      `}</style>
    </>
  );
}

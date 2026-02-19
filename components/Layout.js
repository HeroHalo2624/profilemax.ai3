// Layout.js - Main app shell with navigation
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const NAV_ITEMS = [
  { href: '/', label: 'Analyze' },
  { href: '/messages', label: 'Messages' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/support', label: 'Support' },
]

export default function Layout({ children }) {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top nav */}
      <nav style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(30,30,30,0.95)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 60,
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: 16 }}>⚡</span>
              </div>
              <span style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: 18,
                color: 'var(--text)',
              }}>
                ProfileMax <span style={{ color: 'var(--accent)' }}>AI</span>
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', gap: 4 }} className="desktop-nav">
            {NAV_ITEMS.map(item => (
              <Link key={item.href} href={item.href} style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontFamily: 'Syne, sans-serif',
                fontWeight: 600,
                fontSize: 14,
                color: router.pathname === item.href ? 'var(--accent)' : 'var(--text-muted)',
                background: router.pathname === item.href ? 'var(--accent-dim)' : 'transparent',
                textDecoration: 'none',
                transition: 'var(--transition)',
              }}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text)',
              cursor: 'pointer',
              padding: 8,
              display: 'none',
            }}
            className="mobile-menu-btn"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div style={{
            borderTop: '1px solid var(--border)',
            padding: '12px 20px',
          }}>
            {NAV_ITEMS.map(item => (
              <Link key={item.href} href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'block',
                  padding: '10px 0',
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 600,
                  fontSize: 15,
                  color: router.pathname === item.href ? 'var(--accent)' : 'var(--text)',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--border)',
                }}>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Main content */}
      <main style={{ flex: 1, paddingBottom: 60 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '20px 0',
        textAlign: 'center',
        color: 'var(--text-dim)',
        fontSize: 13,
        fontFamily: 'DM Sans, sans-serif',
      }}>
        <div className="container">
          ProfileMax AI — Free forever.{' '}
          <Link href="/support" style={{ color: 'var(--accent)' }}>Support the project ☕</Link>
        </div>
      </footer>

      <style jsx global>{`
        @media (max-width: 600px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </div>
  )
}

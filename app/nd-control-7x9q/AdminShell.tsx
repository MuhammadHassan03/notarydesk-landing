'use client'
// Sidebar layout. Hides itself on the login page so login has no chrome.
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BASE = '/nd-control-7x9q'

const NAV = [
  { href: `${BASE}/dashboard`,     label: 'Dashboard',      icon: '▦' },
  { href: `${BASE}/users`,         label: 'Users',          icon: '◎' },
  { href: `${BASE}/broadcast`,     label: 'Broadcast',      icon: '📡' },
  { href: `${BASE}/announcements`, label: 'Announcements',  icon: '📢' },
  { href: `${BASE}/flags`,         label: 'Feature Flags',  icon: '⚑'  },
  { href: `${BASE}/tickets`,       label: 'Support',        icon: '🎫' },
]

const S = {
  wrap:   { display:'flex', minHeight:'100vh', background:'#010409', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' } as React.CSSProperties,
  aside:  { width:220, flexShrink:0, background:'#0d1117', borderRight:'1px solid #21262d', display:'flex', flexDirection:'column' as const, padding:'24px 0' },
  logo:   { padding:'0 16px 20px', borderBottom:'1px solid #21262d', marginBottom:8 },
  logoBadge: { width:32, height:32, background:'#1d4ed8', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' },
  main:   { flex:1, overflow:'auto', padding:'32px 36px' },
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname()

  // Login page: no sidebar, just the page
  if (path === `${BASE}/login`) return <>{children}</>

  return (
    <div style={S.wrap}>
      <aside style={S.aside}>
        {/* Logo */}
        <div style={S.logo}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={S.logoBadge}>
              <span style={{ color:'#fff', fontWeight:700, fontSize:14 }}>N</span>
            </div>
            <div>
              <div style={{ color:'#e6edf3', fontSize:13, fontWeight:600 }}>NotaryDesk</div>
              <div style={{ color:'#484f58', fontSize:10 }}>Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding:'8px', flex:1 }}>
          {NAV.map(({ href, label, icon }) => {
            const active = path.startsWith(href)
            return (
              <Link key={href} href={href} style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'9px 12px', borderRadius:8, marginBottom:2,
                background: active ? '#161b22' : 'transparent',
                color: active ? '#e6edf3' : '#8b949e',
                fontWeight: active ? 600 : 400,
                fontSize:13, textDecoration:'none',
              }}>
                <span style={{ width:16, textAlign:'center', fontSize:13 }}>{icon}</span>
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Sign out */}
        <div style={{ padding:'8px 8px 0', borderTop:'1px solid #21262d', marginTop:8, paddingTop:12 }}>
          <form action={`/api${BASE}/logout`} method="POST">
            <button type="submit" style={{
              width:'100%', padding:'9px 12px', borderRadius:8,
              background:'transparent', border:'none',
              color:'#484f58', fontSize:12, cursor:'pointer',
              display:'flex', alignItems:'center', gap:10, textAlign:'left',
            }}>
              <span style={{ width:16, textAlign:'center' }}>→</span>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main style={S.main}>{children}</main>
    </div>
  )
}
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, X } from 'lucide-react'
import type { NavItem, BrandConfig } from './types'

interface SidebarProps {
  navItems: NavItem[]
  brand: BrandConfig
  bottomNavItem?: NavItem
  bottomContent?: React.ReactNode
  /** Profile block at bottom: label (e.g. name), optional subtext (e.g. email) */
  profileLabel?: string
  profileSubtext?: string
  onProfileClick?: () => void
  onSignOut?: () => void
  isCollapsed: boolean
  onToggle: () => void
  isMobile?: boolean
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar(props: SidebarProps) {
  const {
    navItems,
    brand,
    bottomNavItem,
    bottomContent,
    profileLabel,
    profileSubtext,
    onProfileClick,
    onSignOut,
    isCollapsed,
    onToggle: _onToggle,
    isMobile = false,
    isMobileOpen = false,
    onMobileClose,
  } = props
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const collapsed = isMobile ? false : isCollapsed
  const displayCollapsed = isMobile ? false : (collapsed && !isHovered && !isPinned)
  const { name, subtitle, icon: BrandIcon, logoColor = '#2CA85A', logoUrl } = brand

  const iconCell = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: displayCollapsed ? 'center' : 'flex-start',
    gap: displayCollapsed ? 0 : '0.625rem',
    padding: '0.5rem 0.625rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontSize: '0.8125rem',
    fontWeight: isActive ? 600 : 400,
    color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
    background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
    transition: 'background 0.12s, color 0.12s',
    overflow: 'hidden',
    whiteSpace: 'nowrap' as const,
  })

  const inner = (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: displayCollapsed ? 'center' : 'flex-start',
          gap: '0.625rem',
          padding: displayCollapsed ? '1.125rem 0 1rem' : '1.125rem 0.875rem 1rem 1.25rem',
          flexShrink: 0,
          position: 'relative',
          cursor: 'pointer',
          minHeight: '4.5rem',
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (!isMobile && (isHovered || isPinned)) {
            setIsPinned((p) => !p)
          }
          navigate('/')
          if (isMobile && onMobileClose) onMobileClose()
        }}
      >
        <div
          style={{
            background: logoUrl ? 'transparent' : logoColor,
            borderRadius: '0.625rem',
            width: '2.125rem',
            height: '2.125rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {logoUrl ? (
            <img src={logoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <BrandIcon size={18} color="#fff" strokeWidth={2.5} />
          )}
        </div>
        {!displayCollapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#FFFFFF', fontSize: '0.9375rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
              {name}
            </div>
            {subtitle && (
              <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.5625rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.125rem', whiteSpace: 'nowrap' }}>
                {subtitle}
              </div>
            )}
          </div>
        )}
        {isMobile && (
          <button
            onClick={(e) => { e.stopPropagation(); onMobileClose?.() }}
            style={{ position: 'absolute', top: '0.625rem', right: '0.625rem', width: '1.75rem', height: '1.75rem', borderRadius: '0.4375rem', border: '0.0625rem solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>
      <div style={{ height: '0.0625rem', background: 'rgba(255,255,255,0.08)', marginInline: displayCollapsed ? '0.625rem' : '1rem', transition: 'margin 0.22s cubic-bezier(0.4,0,0.2,1)' }} />
      <nav style={{ flex: 1, padding: '0.5rem 0.625rem 0', display: 'flex', flexDirection: 'column', gap: '0.125rem', overflowY: 'auto', scrollbarWidth: 'none' }}>
        {navItems.map(({ icon: Icon, label, path, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end ?? path === '/'}
            title={displayCollapsed ? label : undefined}
            style={({ isActive }) => iconCell(isActive)}
            onClick={(e) => { e.stopPropagation(); if (isMobile && onMobileClose) onMobileClose() }}
            onMouseEnter={(e) => { const el = e.currentTarget; if (!el.style.background.includes('0.12')) { el.style.background = 'rgba(255,255,255,0.07)'; el.style.color = 'rgba(255,255,255,0.85)' } }}
            onMouseLeave={(e) => { const el = e.currentTarget; if (!el.style.background.includes('0.12')) { el.style.background = 'transparent'; el.style.color = 'rgba(255,255,255,0.55)' } }}
          >
            <Icon size={15} strokeWidth={1.75} style={{ flexShrink: 0 }} />
            {!displayCollapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
          </NavLink>
        ))}
      </nav>
      {(bottomNavItem || bottomContent) && (
        <div style={{ padding: '0.75rem 0.625rem 1.25rem', flexShrink: 0 }}>
          <div style={{ height: '0.0625rem', background: 'rgba(255,255,255,0.08)', marginBottom: '0.625rem' }} />
          {bottomNavItem && (
            <NavLink
              to={bottomNavItem.path}
              title={displayCollapsed ? bottomNavItem.label : undefined}
              onClick={(e) => { e.stopPropagation(); if (isMobile && onMobileClose) onMobileClose() }}
              style={({ isActive }) => ({ display: 'flex', alignItems: 'center', justifyContent: displayCollapsed ? 'center' : 'flex-start', gap: displayCollapsed ? 0 : '0.625rem', padding: '0.5rem 0.625rem', borderRadius: '0.5rem', textDecoration: 'none', fontSize: '0.8125rem', fontWeight: isActive ? 600 : 400, color: isActive ? '#fff' : 'rgba(255,255,255,0.5)', background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent', marginBottom: '0.5rem', overflow: 'hidden', whiteSpace: 'nowrap', transition: 'background 0.12s, color 0.12s' })}
            >
              <bottomNavItem.icon size={15} strokeWidth={1.75} style={{ flexShrink: 0 }} />
              {!displayCollapsed && <span>{bottomNavItem.label}</span>}
            </NavLink>
          )}
          {bottomContent}
        </div>
      )}
      {profileLabel != null && (
        <div style={{ padding: '0.75rem 0.625rem 1rem', flexShrink: 0, borderTop: '0.0625rem solid rgba(255,255,255,0.08)' }}>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onProfileClick?.(); if (isMobile && onMobileClose) onMobileClose() }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: displayCollapsed ? 'center' : 'flex-start',
              gap: displayCollapsed ? 0 : '0.625rem',
              width: '100%',
              padding: '0.5rem 0.625rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.9)',
              cursor: 'pointer',
              textAlign: 'left',
              overflow: 'hidden',
              transition: 'background 0.12s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
          >
            <div
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '0.5rem',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6875rem',
                fontWeight: 600,
                flexShrink: 0,
                color: '#fff',
              }}
            >
              {profileLabel.slice(0, 2).toUpperCase()}
            </div>
            {!displayCollapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profileLabel}</div>
                {profileSubtext && <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.55)', marginTop: '0.0625rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profileSubtext}</div>}
              </div>
            )}
          </button>
          {onSignOut && (displayCollapsed ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSignOut(); if (isMobile && onMobileClose) onMobileClose() }}
              title="Sign out"
              style={{ marginTop: '0.375rem', width: '100%', padding: '0.5rem 0', borderRadius: '0.375rem', border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'color 0.12s, background 0.12s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
            >
              <LogOut size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSignOut(); if (isMobile && onMobileClose) onMobileClose() }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '0.375rem',
                width: '100%',
                padding: '0.375rem 0.625rem',
                borderRadius: '0.375rem',
                border: 'none',
                background: 'transparent',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'color 0.12s, background 0.12s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
            >
              <LogOut size={14} />
              Sign out
            </button>
          ))}
        </div>
      )}
    </>
  )

  if (isMobile) {
    return (
      <>
        <div onClick={onMobileClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 49, opacity: isMobileOpen ? 1 : 0, pointerEvents: isMobileOpen ? 'auto' : 'none', transition: 'opacity 0.22s' }} />
        <aside style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: '16rem', zIndex: 50, background: '#1A3C6E', display: 'flex', flexDirection: 'column', overflow: 'hidden', transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: isMobileOpen ? '0.25rem 0 1.5rem rgba(0,0,0,0.3)' : 'none' }}>
          {inner}
        </aside>
      </>
    )
  }

  return (
    <aside
      style={{ width: displayCollapsed ? '4rem' : '12.5rem', flexShrink: 0, display: 'flex', flexDirection: 'column', background: 'transparent', overflow: 'hidden', transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      <div
        role="presentation"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ width: '100%', minHeight: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}
      >
        {inner}
      </div>
    </aside>
  )
}

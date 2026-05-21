import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, X, ChevronDown, ChevronRight, Search } from 'lucide-react'
import type { NavItem, BrandConfig } from './types'
import { ConfirmModal } from '@/components/ConfirmModal'
import { assets } from '@/config/assets'

const NAV_ICON_SIZE = 15
const NAV_ICON_STROKE = 1.75
const ICON_SLOT_WIDTH = '0.9375rem'
const SIDEBAR_WIDTH_EXPANDED = '15rem'
const SIDEBAR_WIDTH_COLLAPSED = '4rem'
const SIDEBAR_WIDTH_MOBILE = '18rem'

const SIDEBAR_NAV_CSS = `
.sidebar-nav-item,
.sidebar-nav-sublink {
  color: rgba(255, 255, 255, 0.55);
  background: transparent;
  transition: background 0.12s, color 0.12s;
}
.sidebar-nav-item--active,
.sidebar-nav-sublink--active {
  background: var(--sidebar-nav-active-bg) !important;
  color: var(--sidebar-nav-active-fg) !important;
  font-weight: 600;
}
.sidebar-nav-item:hover:not(.sidebar-nav-item--active),
.sidebar-nav-sublink:hover:not(.sidebar-nav-sublink--active) {
  background: rgba(255, 255, 255, 0.07) !important;
  color: rgba(255, 255, 255, 0.85) !important;
}
`

function navItemClass(active: boolean) {
  return active ? 'sidebar-nav-item sidebar-nav-item--active' : 'sidebar-nav-item'
}

function navSubLinkClass(active: boolean) {
  return active ? 'sidebar-nav-sublink sidebar-nav-sublink--active' : 'sidebar-nav-sublink'
}

function isPathUnder(parentPath: string, pathname: string): boolean {
  return pathname === parentPath || (parentPath !== '/' && pathname.startsWith(parentPath + '/'))
}

const subLinkBaseStyle = {
  paddingRight: '0.625rem',
  paddingTop: '0.375rem',
  paddingBottom: '0.375rem',
  borderRadius: '0.5rem',
  textDecoration: 'none' as const,
  fontSize: '0.8125rem',
  transition: 'background 0.12s, color 0.12s',
  overflow: 'hidden' as const,
  textOverflow: 'ellipsis' as const,
  whiteSpace: 'nowrap' as const,
  display: 'block' as const,
}

interface SidebarProps {
  navItems: NavItem[]
  brand: BrandConfig
  bottomNavItem?: NavItem
  bottomContent?: ReactNode
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
  const location = useLocation()
  const [isHovered, setIsHovered] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false)
  const pathname = location.pathname
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(() =>
    new Set(
      navItems
        .filter((item) => item.children?.length && isPathUnder(item.path, location.pathname))
        .map((item) => item.path)
    )
  )
  const query = searchQuery.trim().toLowerCase()
  const filteredNavItems = query
    ? navItems
        .map((item) => {
          if (!item.children?.length) {
            return item.label.toLowerCase().includes(query) ? item : null
          }
          const matchingChildren = item.children.filter((c) => c.label.toLowerCase().includes(query))
            if (item.label.toLowerCase().includes(query)) {
              return { ...item, children: item.children }
            }
            if (matchingChildren.length) {
              return { ...item, children: matchingChildren }
            }
            return null
        })
        .filter((item): item is NavItem => item != null)
    : navItems
  useEffect(() => {
    if (searchQuery.trim()) return
    navItems.forEach((item) => {
      if (!item.children?.length || item.path === '/') return
      if (isPathUnder(item.path, pathname)) {
        setExpandedPaths((prev) => (prev.has(item.path) ? prev : new Set(prev).add(item.path)))
      }
    })
  }, [pathname, navItems, searchQuery])
  const toggleExpanded = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }, [])
  const collapsed = isMobile ? false : isCollapsed
  const displayCollapsed = isMobile ? false : (collapsed && !isHovered && !isPinned)
  const effectiveExpandedPaths = query
    ? new Set(filteredNavItems.filter((i) => i.children?.length).map((i) => i.path))
    : expandedPaths
  const showChildren = useCallback(
    (item: NavItem) => Boolean(item.children?.length && !displayCollapsed && effectiveExpandedPaths.has(item.path)),
    [displayCollapsed, effectiveExpandedPaths]
  )
  const { name, subtitle, icon: BrandIcon, logoUrl } = brand

  const iconCell = useCallback(
    () => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: displayCollapsed ? 'center' : 'flex-start',
      gap: displayCollapsed ? 0 : '0.625rem',
      padding: '0.5rem 0.625rem',
      borderRadius: '0.5rem',
      textDecoration: 'none',
      fontSize: '0.8125rem',
      overflow: 'hidden',
      whiteSpace: 'nowrap' as const,
    }),
    [displayCollapsed]
  )

  const navThemeStyle = {
    ['--sidebar-nav-active-bg' as string]: assets.logo,
    ['--sidebar-nav-active-fg' as string]: assets.onPrimary,
  }

  const inner = (
    <>
      <style>{SIDEBAR_NAV_CSS}</style>
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
            background: logoUrl ? 'transparent' : assets.logo,
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
            <BrandIcon size={18} color={assets.onPrimary} strokeWidth={2.5} />
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
            onClick={(e) => { e.stopPropagation(); if (isMobile && onMobileClose) onMobileClose() }}
            style={{ position: 'absolute', top: '0.625rem', right: '0.625rem', width: '1.75rem', height: '1.75rem', borderRadius: '0.4375rem', border: '0.0625rem solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>
      <div
        role="presentation"
        onClick={() => {
          if (!isMobile && (isHovered || isPinned)) setIsPinned((p) => !p)
        }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, cursor: 'pointer' }}
      >
      <div style={{ height: '0.0625rem', background: 'rgba(255,255,255,0.08)', marginInline: displayCollapsed ? '0.625rem' : '1rem', transition: 'margin 0.22s cubic-bezier(0.4,0,0.2,1)' }} />
      {displayCollapsed ? (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            ...iconCell(),
            margin: '0.5rem 0.625rem 0.375rem',
            cursor: 'default',
            background: 'rgba(255,255,255,0.08)',
          }}
          title="Search"
        >
          <Search
            size={NAV_ICON_SIZE}
            strokeWidth={NAV_ICON_STROKE}
            color="rgba(255,255,255,0.5)"
            style={{ flexShrink: 0 }}
          />
        </div>
      ) : (
        <div onClick={(e) => e.stopPropagation()} style={{ flexShrink: 0, padding: '0.5rem 0.75rem 0.375rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.375rem 0.625rem',
              borderRadius: '0.5rem',
              background: 'rgba(255,255,255,0.08)',
              border: '0.0625rem solid rgba(255,255,255,0.12)',
            }}
          >
            <Search size={14} color="rgba(255,255,255,0.5)" strokeWidth={2} style={{ flexShrink: 0 }} />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              aria-label="Search navigation"
              style={{
                flex: 1,
                minWidth: 0,
                border: 'none',
                background: 'transparent',
                color: '#fff',
                fontSize: '0.8125rem',
                outline: 'none',
              }}
            />
          </div>
        </div>
      )}
      <nav
        className="sidebar-nav"
        style={{
          flex: 1,
          padding: '0.5rem 0.625rem 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.125rem',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          ...navThemeStyle,
        }}
      >
        {filteredNavItems.map((item) => {
          const { icon: Icon, label, path, end, children } = item
          const isParentWithChildren = Boolean(children?.length)
          const expanded = showChildren(item)
          const parentActive = isPathUnder(path, pathname)

          const handleParentRowAction = () => {
            toggleExpanded(path)
            if (!expanded) navigate(path)
            if (isMobile && onMobileClose) onMobileClose()
          }

          if (isParentWithChildren) {
            const rowEl = (
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={expanded}
                  aria-label={expanded ? `Collapse ${label}` : `Expand ${label}`}
                  title={displayCollapsed ? label : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleParentRowAction()
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleParentRowAction()
                    }
                  }}
                  className={navItemClass(parentActive)}
                  style={{
                    ...iconCell(),
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '0.5rem',
                    minHeight: '2.25rem',
                    paddingRight: displayCollapsed ? undefined : '0.375rem',
                    cursor: 'pointer',
                  }}
                >
                  {displayCollapsed ? (
                    <Icon size={NAV_ICON_SIZE} strokeWidth={NAV_ICON_STROKE} style={{ flexShrink: 0 }} />
                  ) : (
                    <>
                      <span
                        style={{
                          width: ICON_SLOT_WIDTH,
                          minWidth: ICON_SLOT_WIDTH,
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                        }}
                      >
                        <Icon size={NAV_ICON_SIZE} strokeWidth={NAV_ICON_STROKE} />
                      </span>
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
                      <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.45)' }}>
                        {expanded ? <ChevronDown size={14} strokeWidth={2} /> : <ChevronRight size={14} strokeWidth={2} />}
                      </span>
                    </>
                  )}
                </div>
              )
            if (displayCollapsed) {
              return (
                <NavLink
                  key={path}
                  to={path}
                  end
                  title={label}
                  className={({ isActive }) => navItemClass(isActive || parentActive)}
                  style={iconCell}
                  onClick={(e) => { e.stopPropagation(); if (isMobile && onMobileClose) onMobileClose() }}
                >
                  <Icon size={NAV_ICON_SIZE} strokeWidth={NAV_ICON_STROKE} style={{ flexShrink: 0 }} />
                </NavLink>
              )
            }
            return (
              <div key={path} style={{ display: 'flex', flexDirection: 'column', gap: '0.0625rem' }}>
                {rowEl}
                {expanded &&
                  children!.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      end
                      title={displayCollapsed ? child.label : undefined}
                      onClick={(e) => { e.stopPropagation(); if (isMobile && onMobileClose) onMobileClose() }}
                      className={({ isActive }) => navSubLinkClass(isActive)}
                      style={{
                        ...subLinkBaseStyle,
                        paddingLeft: displayCollapsed ? '0.5rem' : '2rem',
                      }}
                    >
                      {child.label}
                    </NavLink>
                  ))}
              </div>
            )
          }

          return (
            <NavLink
              key={path}
              to={path}
              end={end ?? path === '/'}
              title={displayCollapsed ? label : undefined}
              className={({ isActive }) => navItemClass(isActive)}
              style={iconCell}
              onClick={(e) => { e.stopPropagation(); if (isMobile && onMobileClose) onMobileClose() }}
            >
              <Icon size={NAV_ICON_SIZE} strokeWidth={NAV_ICON_STROKE} style={{ flexShrink: 0 }} />
              {!displayCollapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
            </NavLink>
          )
        })}
      </nav>
      {(bottomNavItem || bottomContent) && (
        <div style={{ padding: '0.75rem 0.625rem 1.25rem', flexShrink: 0 }}>
          <div style={{ height: '0.0625rem', background: 'rgba(255,255,255,0.08)', marginBottom: '0.625rem' }} />
          {bottomNavItem && (
            <NavLink
              to={bottomNavItem.path}
              title={displayCollapsed ? bottomNavItem.label : undefined}
              onClick={(e) => { e.stopPropagation(); if (isMobile && onMobileClose) onMobileClose() }}
              className={({ isActive }) => navItemClass(isActive)}
              style={{ ...iconCell(), marginBottom: '0.5rem' }}
            >
              <bottomNavItem.icon size={NAV_ICON_SIZE} strokeWidth={NAV_ICON_STROKE} style={{ flexShrink: 0 }} />
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
            onClick={(e) => {
              e.stopPropagation()
              navigate('/profile')
              onProfileClick?.()
              if (isMobile && onMobileClose) onMobileClose()
            }}
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
              className="sidebar-signout-btn"
              onClick={(e) => { e.stopPropagation(); setShowSignOutConfirm(true) }}
              title="Sign out"
              style={{ marginTop: '0.375rem', width: '100%', padding: '0.5rem 0', borderRadius: '0.375rem', border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <LogOut size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="sidebar-signout-btn"
              onClick={(e) => { e.stopPropagation(); setShowSignOutConfirm(true) }}
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
              }}
            >
              <LogOut size={14} />
              Sign out
            </button>
          ))}
        </div>
      )}
      </div>
    </>
  )

  const signOutConfirmModal = (
    <ConfirmModal
      open={showSignOutConfirm}
      onClose={() => setShowSignOutConfirm(false)}
      onConfirm={() => {
        setShowSignOutConfirm(false)
        onSignOut?.()
        if (isMobile && onMobileClose) onMobileClose()
      }}
      title="Sign out?"
      message="Are you sure you want to sign out?"
      confirmLabel="Sign out"
      cancelLabel="Cancel"
      variant="danger"
    />
  )

  if (isMobile) {
    return (
      <>
        <div onClick={onMobileClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 49, opacity: isMobileOpen ? 1 : 0, pointerEvents: isMobileOpen ? 'auto' : 'none', transition: 'opacity 0.22s' }} />
        <aside style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: SIDEBAR_WIDTH_MOBILE, zIndex: 50, background: assets.sidebar, display: 'flex', flexDirection: 'column', overflow: 'hidden', transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: isMobileOpen ? '0.25rem 0 1.5rem rgba(0,0,0,0.3)' : 'none' }}>
          {inner}
        </aside>
        {signOutConfirmModal}
      </>
    )
  }

  return (
    <>
      <aside
        style={{ width: displayCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED, flexShrink: 0, display: 'flex', flexDirection: 'column', background: 'transparent', overflow: 'hidden', transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)' }}
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
      {signOutConfirmModal}
    </>
  )
}

import { Bell, ChevronDown, Search, Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'

interface TopBarProps {
  title: string | ((pathname: string) => string)
  userName?: string
  centerSlot?: React.ReactNode
  searchPlaceholder?: string
  rightSlot?: React.ReactNode
  languageLabel?: string
  onLanguageClick?: () => void
  onMobileMenuOpen: () => void
  isMobile?: boolean
}

export function TopBar({
  title,
  userName,
  centerSlot,
  searchPlaceholder,
  rightSlot,
  languageLabel,
  onLanguageClick,
  onMobileMenuOpen,
  isMobile = false,
}: TopBarProps) {
  const location = useLocation()
  const pathname = location.pathname
  const titleText = typeof title === 'function' ? title(pathname) : title

  if (isMobile) {
    return (
      <header
        style={{
          background: '#FFFFFF',
          borderBottom: '0.0625rem solid #E8ECF0',
          height: '3.25rem',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1rem',
          gap: '0.625rem',
          flexShrink: 0,
        }}
      >
        <button
          onClick={onMobileMenuOpen}
          style={{
            width: '2.125rem',
            height: '2.125rem',
            borderRadius: '0.5rem',
            border: '0.0625rem solid #E8ECF0',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <Menu size={16} color="#374151" strokeWidth={2} />
        </button>
        <span
          style={{
            flex: 1,
            fontSize: '1rem',
            fontWeight: 700,
            color: '#111827',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {titleText}
        </span>
        {languageLabel != null && onLanguageClick && (
          <button
            onClick={onLanguageClick}
            style={{
              height: '2rem',
              padding: '0 0.5rem',
              borderRadius: '0.4375rem',
              border: '0.0625rem solid #E8ECF0',
              background: '#fff',
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: '#374151',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            🌐 {languageLabel}
          </button>
        )}
        {rightSlot ?? (
          <>
            <button
              style={{
                position: 'relative',
                width: '2rem',
                height: '2rem',
                borderRadius: '0.4375rem',
                border: '0.0625rem solid #E8ECF0',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <Bell size={14} color="#6B7280" strokeWidth={1.75} />
              <span
                style={{
                  position: 'absolute',
                  top: '0.4375rem',
                  right: '0.4375rem',
                  width: '0.375rem',
                  height: '0.375rem',
                  borderRadius: '50%',
                  background: '#EF4444',
                  border: '0.09375rem solid #fff',
                }}
              />
            </button>
            <div
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '0.5rem',
                background: '#1A3C6E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.625rem',
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
                letterSpacing: '0.02em',
                cursor: 'pointer',
              }}
            >
              {userName ? userName.slice(0, 2).toUpperCase() : '?'}
            </div>
          </>
        )}
      </header>
    )
  }

  const centerContent =
    centerSlot ??
    (searchPlaceholder != null && (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#F4F7FB',
          border: '0.0625rem solid #E8ECF0',
          borderRadius: '0.5rem',
          padding: '0 0.75rem',
          height: '2.125rem',
          width: '11.25rem',
          flexShrink: 0,
        }}
      >
        <Search size={13} color="#9CA3AF" style={{ flexShrink: 0 }} />
        <input
          placeholder={searchPlaceholder}
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: '0.75rem',
            color: '#6B7280',
            width: '100%',
          }}
        />
      </div>
    ))

  return (
    <header
      style={{
        background: '#FFFFFF',
        borderBottom: '0.0625rem solid #E8ECF0',
        height: '3.5rem',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.25rem',
        gap: '0.75rem',
        flexShrink: 0,
      }}
    >
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <span
          style={{
            color: '#111827',
            fontSize: '1rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block',
          }}
        >
          {titleText}
        </span>
      </div>
      {centerContent}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {languageLabel != null && onLanguageClick && (
          <button
            onClick={onLanguageClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              height: '2rem',
              padding: '0 0.625rem',
              borderRadius: '0.4375rem',
              border: '0.0625rem solid #E8ECF0',
              background: '#fff',
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: '#374151',
              cursor: 'pointer',
            }}
          >
            🌐 {languageLabel}
          </button>
        )}
        {rightSlot ?? (
          <>
            <button
              style={{
                position: 'relative',
                width: '2rem',
                height: '2rem',
                borderRadius: '0.4375rem',
                border: '0.0625rem solid #E8ECF0',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <Bell size={14} color="#6B7280" strokeWidth={1.75} />
              <span
                style={{
                  position: 'absolute',
                  top: '0.4375rem',
                  right: '0.4375rem',
                  width: '0.375rem',
                  height: '0.375rem',
                  borderRadius: '50%',
                  background: '#EF4444',
                  border: '0.09375rem solid #fff',
                }}
              />
            </button>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4375rem',
                cursor: 'pointer',
                padding: '0.1875rem 0.5rem 0.1875rem 0.1875rem',
                borderRadius: '0.5rem',
                border: '0.0625rem solid #E8ECF0',
                background: '#fff',
                height: '2rem',
              }}
            >
              <div
                style={{
                  width: '1.625rem',
                  height: '1.625rem',
                  borderRadius: '0.375rem',
                  background: '#1A3C6E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  color: '#fff',
                  flexShrink: 0,
                  letterSpacing: '0.02em',
                }}
              >
                {userName ? userName.slice(0, 2).toUpperCase() : '?'}
              </div>
              {userName != null && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: '#1F2937',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {userName}
                </span>
              )}
              <ChevronDown
                size={12}
                color="#9CA3AF"
                strokeWidth={2}
                style={{ flexShrink: 0 }}
              />
            </div>
          </>
        )}
      </div>
    </header>
  )
}

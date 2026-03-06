import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  path: string
  label: string
  icon: LucideIcon
  end?: boolean
}

export interface BrandConfig {
  name: string
  subtitle?: string
  icon: LucideIcon
  logoColor?: string
  /** When set, shown as logo image instead of icon. Use @/config/assets for a single source of truth. */
  logoUrl?: string
}

export interface AppLayoutConfig {
  navItems: NavItem[]
  brand: BrandConfig
  getPageTitle?: (pathname: string) => string
  fullScreenPaths?: string[]
  fontFamily?: string
  outerBg?: string
  contentCardBg?: string
}

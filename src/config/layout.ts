import { LayoutDashboard, Settings, User, FileText, BarChart3 } from 'lucide-react'
import type { AppLayoutConfig } from '@/layout'
import { assets } from './assets'

/**
 * App shell config: brand, nav items, and page titles.
 * Extend navItems and getPageTitle when you add more pages.
 * Image/logo URLs are centralized in @/config/assets.
 */
export const layoutConfig: Omit<AppLayoutConfig, 'getPageTitle'> = {
  brand: {
    name: 'Auth Basement',
    subtitle: 'For Any Webapp',
    icon: LayoutDashboard,
    logoColor: '#2CA85A',
    logoUrl: assets.logoUrl || undefined,
  },
  navItems: [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { path: '/reports', label: 'Reports', icon: BarChart3, end: true },
    { path: '/documents', label: 'Documents', icon: FileText, end: true },
    { path: '/profile', label: 'Profile', icon: User, end: true },
    { path: '/settings', label: 'Settings', icon: Settings, end: true },
  ],
}

export function getPageTitle(pathname: string): string {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/reports': 'Reports',
    '/documents': 'Documents',
    '/profile': 'Profile',
    '/settings': 'Settings',
  }
  return titles[pathname] ?? 'App'
}

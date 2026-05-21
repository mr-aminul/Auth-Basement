import { LayoutDashboard, Settings, User, FileText, BarChart3, ShieldCheck } from 'lucide-react'
import type { AppLayoutConfig } from '@/layout'
import { assets } from '@/config/assets'

/**
 * App shell config: brand, nav items, and page titles.
 * Extend navItems and getPageTitle when you add more pages.
 */
export const layoutConfig: Omit<AppLayoutConfig, 'getPageTitle'> = {
  brand: {
    name: 'Auth Basement',
    subtitle: 'For Any Webapp',
    icon: ShieldCheck,
    logoUrl: assets.logoUrl || undefined,
  },
  navItems: [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { path: '/reports', label: 'Reports', icon: BarChart3, end: true },
    {
      path: '/documents',
      label: 'Documents',
      icon: FileText,
      end: false,
      children: [
        { path: '/documents/page-1', label: 'Page 1' },
        { path: '/documents/page-2', label: 'Page 2' },
        { path: '/documents/page-3', label: 'Page 3' },
      ],
    },
    { path: '/profile', label: 'Profile', icon: User, end: true },
    { path: '/settings', label: 'Settings', icon: Settings, end: true },
  ],
}

export function getPageTitle(pathname: string): string {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/reports': 'Reports',
    '/documents': 'Documents',
    '/documents/page-1': 'Page 1',
    '/documents/page-2': 'Page 2',
    '/documents/page-3': 'Page 3',
    '/profile': 'Profile',
    '/settings': 'Settings',
  }
  return titles[pathname] ?? 'App'
}

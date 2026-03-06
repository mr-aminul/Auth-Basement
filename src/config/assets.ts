import type { CSSProperties } from 'react'

/**
 * Central place for image and logo URLs. Update these once to change them app-wide.
 *
 * Assets:
 * - logoUrl: Logo image URL (sidebar, header). Leave empty for icon-only branding.
 * - loginBackgroundValue: Login/sign-up background. Use a color (#hex, rgb), gradient
 *   (e.g. linear-gradient(...)), or image URL (http/https). CSS is applied automatically.
 * - layoutBackgroundValue: App layout background. Same options as loginBackgroundValue.
 *
 * Helper:
 * - getBackgroundStyle(value): Returns style props for a given value (image URL vs color/gradient).
 */
export const assets = {
  logoUrl: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/microsoft-365.webp' as string,
  loginBackgroundValue:
    'https://i.pinimg.com/736x/21/16/59/21165977ebcdc14db9ac23044c721820.jpg',
  layoutBackgroundValue:
    '#040D31',
} as const

export type AssetsConfig = typeof assets

const isImageUrl = (v: string) => /^(https?:|\/)/.test(v.trim())

export function getBackgroundStyle(value: string): CSSProperties {
  if (!value) return {}
  if (isImageUrl(value)) {
    return {
      backgroundImage: `url('${value}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }
  }
  return { background: value }
}

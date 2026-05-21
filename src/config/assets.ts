import type { CSSProperties } from 'react'
import { createPalette, type ThemePalette } from '@/config/theme'

/**
 * Rebrand: set `brandColor` only. Layout background, sidebar, logo badge, accents,
 * and content surfaces are derived as shades of this color.
 *
 * Optional overrides:
 * - logoUrl: image instead of icon in the sidebar
 * - loginBackgroundValue: login left panel (defaults to brandColor; can be image/gradient)
 */
export const brandColor = '#040D31'

const palette: ThemePalette = createPalette(brandColor)

export const assets = {
  logoUrl: '' as string,
  loginBackgroundValue: brandColor,
  ...palette,
  /** @deprecated Use `background` — kept for existing imports */
  layoutBackgroundValue: palette.background,
  /** @deprecated Use `primary` */
  themePrimary: palette.primary,
  /** @deprecated Use `logo` */
  themeLogo: palette.logo,
  /** @deprecated Use `onPrimary` */
  themePrimaryContrast: palette.onPrimary,
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

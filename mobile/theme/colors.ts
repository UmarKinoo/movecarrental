/**
 * MOVE design tokens — aligned with customer/ (Next.js) branding.
 */
export const colors = {
  ink: '#0E1A14',
  inkMuted: 'rgba(14, 26, 20, 0.54)',
  lime: '#DDFF00',
  limeMuted: '#bde000',
  limeTint: '#f3f9d4',
  paper: '#ffffff',
  bone: '#f5f5f0',
  background: '#f5f5f0',
  border: '#e5e5e0',
  text: '#0E1A14',
  textMuted: '#70757a',
  textSecondary: '#a1a1a1',
  error: '#d32f2f',
  success: '#1f9201',
  price: '#0E1A14',
  switchTrackOn: '#c5e600',
  secondary: '#6b7280',
  overlay: 'rgba(0, 0, 0, 0.7)',
  headerBadge: '#DDFF00',
  headerBadgeText: '#0E1A14',
  materialBlue: '#0E1A14',
} as const

export type BrandColors = typeof colors

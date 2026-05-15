/**
 * Transparent (or cut-out) fleet images for marketing UI.
 * Add new entries here as you receive PNGs from design — use the same paths in cards, hero, etc.
 */
export type FleetCarAsset = {
  src: string
  alt: string
  width: number
  height: number
  label?: string
  tag?: string
}

export const fleetCars = {
  allionHero: {
    src: '/cars/toyota-allion-hero.png',
    alt: 'Toyota Allion sedan',
    width: 1536,
    height: 1024,
    label: 'Toyota Allion',
    tag: 'Fleet · 2025',
  },
} as const satisfies Record<string, FleetCarAsset>

export type FleetCarAssetKey = keyof typeof fleetCars

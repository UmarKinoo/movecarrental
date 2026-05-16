import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

/** Horizontal lockup — source asset is 1024×240 */
const LOGO_WIDTH = 1024
const LOGO_HEIGHT = 240
const LOGO_ASPECT = LOGO_WIDTH / LOGO_HEIGHT

type MoveLogoProps = {
  /** Rendered width in px; height follows aspect ratio */
  width?: number
  className?: string
  priority?: boolean
}

/**
 * Full MOVE wordmark (lime mark + OVE) from /public/brand/move-logo.png.
 * Best on dark (ink) backgrounds — asset has a black field that blends with ink.
 */
export function MoveLogo({ width = 88, className, priority }: MoveLogoProps) {
  const height = Math.round(width / LOGO_ASPECT)

  return (
    <Image
      src="/brand/move-logo.png"
      alt="MOVE"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      unoptimized
      className={cn('h-auto w-auto max-w-full object-contain', className)}
      style={{ width, height }}
    />
  )
}

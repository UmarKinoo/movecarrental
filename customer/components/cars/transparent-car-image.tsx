import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

type TransparentCarImageProps = {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  className?: string
  imageClassName?: string
  sizes?: string
}

/**
 * Renders a cut-out / transparent fleet PNG with a soft ground shadow.
 * Uses unoptimized so Next.js does not re-encode to WebP/JPEG (that drops alpha).
 */
export function TransparentCarImage({
  src,
  alt,
  width,
  height,
  priority,
  className,
  imageClassName,
  sizes = '(max-width: 1024px) 100vw, 560px',
}: TransparentCarImageProps) {
  return (
    <div className={cn('relative flex w-full min-w-0 items-end justify-center', className)}>
      <div
        className="pointer-events-none absolute bottom-[6%] left-1/2 z-0 h-[10%] w-[72%] -translate-x-1/2 rounded-full bg-ink/20 blur-2xl"
        aria-hidden
      />
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        unoptimized
        sizes={sizes}
        className={cn(
          'relative z-10 block h-auto w-full max-w-none object-contain object-bottom',
          imageClassName,
        )}
      />
    </div>
  )
}

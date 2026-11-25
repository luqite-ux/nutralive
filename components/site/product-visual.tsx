import { cn } from '@/lib/utils'
import type { Crop } from '@/lib/products'

type Props = {
  image?: string
  crop?: Crop
  tint: string
  alt: string
  className?: string
  priority?: boolean
}

export function ProductVisual({ image, crop, tint, alt, className, priority }: Props) {
  if (image) {
    return (
      <div className={cn('relative overflow-hidden bg-porcelain', className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image || '/placeholder.svg'}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 size-full object-cover"
          style={
            crop
              ? { transform: `scale(${crop.zoom})`, transformOrigin: `${crop.x}% ${crop.y}%` }
              : undefined
          }
        />
      </div>
    )
  }

  return (
    <div
      role="img"
      aria-label={`${alt} (illustrative color swatch)`}
      className={cn('relative flex items-center justify-center overflow-hidden bg-porcelain', className)}
      style={{ backgroundImage: `radial-gradient(circle at 50% 50%, ${tint}26, transparent 62%)` }}
    >
      <div
        className="aspect-square w-[46%] rounded-full border-[6px] border-white/90 shadow-[0_12px_30px_-10px_rgba(22,54,26,0.35)]"
        style={{ backgroundImage: `radial-gradient(circle at 34% 28%, ${tint}d9, ${tint})` }}
      />
    </div>
  )
}

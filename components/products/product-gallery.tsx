'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export type GalleryItem = {
  url: string
  alt: string
  caption?: string
}

export function ProductHeroGallery({
  productName,
  images,
}: {
  productName: string
  images: string[]
}) {
  const heroImages = images.slice(0, 3)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const currentUrl = heroImages[selectedIdx] || heroImages[0] || ''

  const step = useCallback(
    (delta: number) => {
      if (heroImages.length <= 1) return
      setSelectedIdx((i) => (i + delta + heroImages.length) % heroImages.length)
    },
    [heroImages.length],
  )

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') step(-1)
      else if (e.key === 'ArrowRight') step(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen, step])

  return (
    <div>
      <button
        type="button"
        onClick={() => currentUrl && setLightboxOpen(true)}
        aria-label={`Zoom ${productName} main image`}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-3xl border border-sage bg-cream focus-visible:outline-2 focus-visible:outline-leaf"
      >
        {currentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentUrl}
            alt={`${productName} — primary view ${selectedIdx + 1}`}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-forest">{productName}</div>
        )}
        {currentUrl && (
          <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-forest shadow-md">
            <ZoomIn className="size-3.5" aria-hidden="true" /> Click to zoom
          </span>
        )}
      </button>

      {heroImages.length > 1 && (
        <div className="mt-4 grid grid-cols-3 gap-3" role="tablist" aria-label={`${productName} main images`}>
          {heroImages.map((url, idx) => (
            <button
              key={url}
              type="button"
              role="tab"
              aria-selected={idx === selectedIdx}
              aria-label={`Show ${productName} view ${idx + 1}`}
              onClick={() => setSelectedIdx(idx)}
              className={cn(
                'relative aspect-[4/3] overflow-hidden rounded-xl border-2 bg-cream transition-all focus-visible:outline-2 focus-visible:outline-leaf',
                idx === selectedIdx
                  ? 'border-forest ring-2 ring-leaf/30'
                  : 'border-sage opacity-80 hover:border-leaf hover:opacity-100',
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`${productName} thumbnail ${idx + 1}`}
                loading="lazy"
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-h-[92vh] max-w-5xl overflow-auto bg-white p-4 sm:p-6">
          <DialogTitle className="font-sans text-lg text-forest-deep">{productName}</DialogTitle>
          <DialogDescription>
            Image {selectedIdx + 1} of {heroImages.length}
          </DialogDescription>
          <div className="relative flex items-center justify-center">
            {heroImages.length > 1 && (
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous image"
                className="absolute left-2 z-10 flex size-10 items-center justify-center rounded-full border border-sage bg-white/95 text-forest shadow hover:bg-cream"
              >
                <ChevronLeft className="size-5" />
              </button>
            )}
            {currentUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentUrl}
                alt={`${productName} zoomed view ${selectedIdx + 1}`}
                className="mx-auto max-h-[75vh] w-auto max-w-full rounded-xl border border-sage object-contain"
              />
            )}
            {heroImages.length > 1 && (
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next image"
                className="absolute right-2 z-10 flex size-10 items-center justify-center rounded-full border border-sage bg-white/95 text-forest shadow hover:bg-cream"
              >
                <ChevronRight className="size-5" />
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function ProductDetailGallery({
  productName,
  items,
}: {
  productName: string
  items: GalleryItem[]
}) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  const step = useCallback(
    (delta: number) => {
      if (activeIdx === null || items.length <= 1) return
      setActiveIdx((activeIdx + delta + items.length) % items.length)
    },
    [activeIdx, items.length],
  )

  useEffect(() => {
    if (activeIdx === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') step(-1)
      else if (e.key === 'ArrowRight') step(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIdx, step])

  if (items.length === 0) return null
  const activeItem = activeIdx !== null ? items[activeIdx] : null

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item, idx) => (
          <figure
            key={`${item.url}-${idx}`}
            className="overflow-hidden rounded-3xl border border-sage bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <button
              type="button"
              onClick={() => setActiveIdx(idx)}
              aria-label={`Zoom ${item.alt}`}
              className="group relative block aspect-[4/3] w-full overflow-hidden bg-cream focus-visible:outline-2 focus-visible:outline-leaf"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={item.alt}
                loading="lazy"
                className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-forest shadow">
                <ZoomIn className="size-3.5" aria-hidden="true" /> Zoom
              </span>
            </button>
            {item.caption && (
              <figcaption className="border-t border-sage px-5 py-3.5 text-sm text-muted-foreground">
                {item.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      <Dialog open={activeIdx !== null} onOpenChange={(o) => !o && setActiveIdx(null)}>
        <DialogContent className="max-h-[92vh] max-w-5xl overflow-auto bg-white p-4 sm:p-6">
          <DialogTitle className="font-sans text-lg text-forest-deep">{productName}</DialogTitle>
          <DialogDescription>
            {activeItem?.caption || activeItem?.alt} ({(activeIdx ?? 0) + 1} / {items.length})
          </DialogDescription>
          <div className="relative flex items-center justify-center">
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous image"
                className="absolute left-2 z-10 flex size-10 items-center justify-center rounded-full border border-sage bg-white/95 text-forest shadow hover:bg-cream"
              >
                <ChevronLeft className="size-5" />
              </button>
            )}
            {activeItem && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeItem.url}
                alt={activeItem.alt}
                className="mx-auto max-h-[75vh] w-auto max-w-full rounded-xl border border-sage object-contain"
              />
            )}
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next image"
                className="absolute right-2 z-10 flex size-10 items-center justify-center rounded-full border border-sage bg-white/95 text-forest shadow hover:bg-cream"
              >
                <ChevronRight className="size-5" />
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

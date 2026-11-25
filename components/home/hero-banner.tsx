'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IMG, CONTAINER } from '@/lib/site'
import { cn } from '@/lib/utils'

type Slide = {
  image: string
  side: 'left' | 'right'
  eyebrow: string
  title: string
  description: string
  primary: { label: string; href: string }
  secondary: { label: string; href: string }
  position: string
  alt: string
}

const SLIDES: Slide[] = [
  {
    image: IMG.banner1,
    side: 'left',
    eyebrow: 'Nutralive Co.,Ltd · Nanjing, China',
    title: 'Standardized Botanical Extracts & Functional Ingredients',
    description:
      'Herbal extracts, amino acids, functional ingredients and USDA NOP organic ingredients for food, dietary supplement, cosmetic and pharmaceutical manufacturers worldwide.',
    primary: { label: 'Browse Products', href: '/products' },
    secondary: { label: 'Request a Quote', href: '/contact#rfq' },
    position: '75% center',
    alt: 'Petri dishes of blue phycocyanin, green chlorella, golden turmeric and red beet root powders beside a vial of amber oil and green leaves',
  },
  {
    image: IMG.banner2,
    side: 'right',
    eyebrow: 'Quality & Compliance',
    title: 'HPLC-Verified Purity & Five International Certifications',
    description:
      'Each lot is tested in our HPLC and GC laboratory and shipped with COA and SPEC. ISO 9001, ISO 22000, HACCP, Halal and USDA NOP Organic.',
    primary: { label: 'View Quality System', href: '/quality' },
    secondary: { label: 'Request a Quote', href: '/contact#rfq' },
    position: '25% center',
    alt: 'Bright analytical laboratory with an HPLC instrument and glassware filled with green and amber solutions',
  },
  {
    image: IMG.banner3,
    side: 'left',
    eyebrow: 'Custom Processing & OEM',
    title: 'Custom Granulation, Premixes, Tablets & Hard Capsules',
    description:
      'From instantized granules and premix blends to herbal extract tablets and two-piece hard capsules, produced to your formula and packaged in your format.',
    primary: { label: 'Custom Processing', href: '/custom-processing' },
    secondary: { label: 'Request Samples', href: '/contact#rfq' },
    position: '75% center',
    alt: 'Green and amber capsules, herbal tablets, a dish of white granules, foil sample pouches and amber bottles',
  },
]

const INTERVAL = 7000

export function HeroBanner() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [hovering, setHovering] = useState(false)
  const reducedRef = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedRef.current = mq.matches
    if (mq.matches) setPlaying(false)
  }, [])

  const go = useCallback((i: number) => setIndex((i + SLIDES.length) % SLIDES.length), [])

  useEffect(() => {
    if (!playing || hovering) return
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL)
    return () => window.clearTimeout(t)
  }, [index, playing, hovering])

  return (
    <section
      id="hero-banner"
      aria-roledescription="carousel"
      aria-label="Featured NutraLive capabilities"
      className="relative overflow-hidden bg-cream"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="relative">
        {SLIDES.map((s, i) => {
          const active = i === index
          const Heading = i === 0 ? 'h1' : 'h2'
          return (
            <div
              key={s.title}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${SLIDES.length}`}
              aria-hidden={!active}
              className={cn(
                'transition-opacity duration-700',
                active
                  ? 'relative z-10 opacity-100'
                  : 'pointer-events-none absolute inset-0 z-0 opacity-0',
              )}
            >
              {/* Mobile (<lg): clean stacked layout — unobstructed banner photo on top, copy below */}
              <div className="relative aspect-[16/10] w-full overflow-hidden lg:absolute lg:inset-0 lg:aspect-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image || '/placeholder.svg'}
                  alt={s.alt}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="size-full object-cover"
                  style={{ objectPosition: s.position }}
                />
              </div>
              <div className={cn(CONTAINER, 'relative flex items-center lg:min-h-[680px]')}>
                <div
                  className={cn(
                    'w-full pt-6 pb-20 lg:py-20',
                    s.side === 'right' ? 'lg:ml-auto lg:max-w-[39%]' : 'lg:max-w-[44%]',
                  )}
                >
                  <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-sage bg-white/90 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-forest">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-leaf" />
                    {s.eyebrow}
                  </p>
                  <Heading className="text-balance text-3xl font-semibold leading-[1.1] sm:text-5xl lg:text-[3.25rem]">
                    {s.title}
                  </Heading>
                  <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-foreground sm:text-lg">
                    {s.description}
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Button asChild size="lg" className="bg-forest text-white hover:bg-forest-deep">
                      <Link href={s.primary.href} tabIndex={active ? 0 : -1}>
                        {s.primary.label} <ArrowRight />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="border-forest bg-white/90 text-forest hover:bg-white">
                      <Link href={s.secondary.href} tabIndex={active ? 0 : -1}>
                        {s.secondary.label}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <div className="absolute inset-x-0 bottom-5 z-20">
          <div className={cn(CONTAINER, 'flex items-center justify-between gap-4')}>
            <div className="flex items-center gap-2 rounded-full border border-sage bg-white/90 p-1.5">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8 rounded-full text-forest"
                aria-label="Previous slide"
                onClick={() => go(index - 1)}
              >
                <ChevronLeft />
              </Button>
              <div className="flex items-center gap-1.5 px-1">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.title}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === index}
                    onClick={() => go(i)}
                    className={cn(
                      'h-2 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf',
                      i === index ? 'w-7 bg-forest' : 'w-2 bg-forest/30 hover:bg-forest/60',
                    )}
                  />
                ))}
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8 rounded-full text-forest"
                aria-label="Next slide"
                onClick={() => go(index + 1)}
              >
                <ChevronRight />
              </Button>
            </div>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="size-10 rounded-full border-sage bg-white/90 text-forest"
              aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
              onClick={() => setPlaying((p) => !p)}
            >
              {playing ? <Pause /> : <Play />}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

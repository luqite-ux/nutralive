import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { PILLARS } from '@/components/home/custom-processing-showcase'
import { Button } from '@/components/ui/button'
import { CUSTOMER_GALLERIES } from '@/lib/customer-galleries'
import { CONTAINER, IMG } from '@/lib/site'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nutralive.com').replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'Custom Processing — Granulation, Premix, Tableting & Hard Capsules',
  description:
    'NutraLive custom granulation, premix blending, herbal extract tableting and hard capsule filling for supplement, food, cosmetic and pharmaceutical manufacturers.',
  alternates: { canonical: `${SITE_URL}/custom-processing` },
}

const DETAILS: Record<string, string[]> = {
  Granulation: ['Instantized amino acid granules', 'Improved flow and dispersion', 'Suitable for powders and stick packs'],
  'Premix Blending': ['Multi-ingredient premixes', 'Built to your formula and dosage target', 'Packed in drums or pouches'],
  'Herbal Extract Tableting': ['Herbal extract tablets', 'Your size, weight and active specification', 'OEM / private-label supply'],
  'Hard Capsule Filling': ['Two-piece hard capsules', 'Powders, blends and granules', 'OEM / private-label supply'],
}

const STEPS = [
  { t: 'Share your brief', d: 'Formula, target dosage form, packaging format and volume.' },
  { t: 'Development sample', d: 'We prepare a sample in NutraLive-labelled packaging for your evaluation.' },
  { t: 'Specification sign-off', d: 'Agree the specification, test methods and documents.' },
  { t: 'Production & shipment', d: 'Batches are produced from 500 kg, tested and exported.' },
]

export default function CustomProcessingPage() {
  return (
    <>
      <PageHero
        eyebrow="Custom Processing"
        title="From ingredient to finished dosage form"
        description="Granulation, premix blending, herbal extract tableting and hard capsule filling for global supplement, food, cosmetic and pharmaceutical manufacturers."
        crumbs={[{ label: 'Custom Processing' }]}
      />

      <section className="bg-white py-14 lg:py-20">
        <div className={CONTAINER}>
          <ul className="grid gap-6 md:grid-cols-2">
            {PILLARS.map((p, i) => (
              <li key={p.title}>
                <Reveal delay={(i % 2) * 80} className="h-full">
                  <article className="h-full rounded-3xl border border-sage bg-cream p-7">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-white text-forest ring-1 ring-sage">
                      <p.icon className="size-6" aria-hidden="true" />
                    </span>
                    <h2 className="mt-5 text-2xl font-semibold">{p.title}</h2>
                    <p className="mt-2 text-muted-foreground">{p.text}</p>
                    <ul className="mt-4 space-y-2 text-sm text-forest-deep">
                      {DETAILS[p.title]?.map((d) => (
                        <li key={d} className="flex items-start gap-2">
                          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-leaf" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-sage bg-cream py-14 lg:py-20">
        <div className={CONTAINER}>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <figure className="overflow-hidden rounded-3xl border border-sage bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMG.packaging}
                alt="NutraLive-labelled sample bottles and aluminum foil pouches"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="border-t border-sage px-5 py-4 text-sm text-muted-foreground">
                NutraLive sample packaging: labelled bottles and aluminum foil pouches.
              </figcaption>
            </figure>
            <div>
              <SectionHeading
                eyebrow="How it works"
                title="A clear path from brief to export"
                description="Custom batches start from 500 kg. Standard ingredients are available from 25 kg."
              />
              <ol className="mt-8 space-y-4">
                {STEPS.map((s, i) => (
                  <li key={s.t} className="flex gap-4 rounded-2xl border border-sage bg-white p-5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-sans text-base font-semibold text-forest-deep">{s.t}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Button asChild size="lg" className="mt-8 bg-forest hover:bg-forest-deep">
                <Link href="/contact#rfq">
                  Discuss your project <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>

          {CUSTOMER_GALLERIES.packaging.length > 0 && (
            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {CUSTOMER_GALLERIES.packaging.map((photo) => (
                <li key={photo.id} className="overflow-hidden rounded-2xl border border-sage bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}

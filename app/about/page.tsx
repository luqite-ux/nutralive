import type { Metadata } from 'next'
import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import { GlobalPartnerSectors } from '@/components/home/global-partner-sectors'
import { CUSTOMER_GALLERIES } from '@/lib/customer-galleries'
import { COMPANY, CONTAINER } from '@/lib/site'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nutraliveingredients.com').replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'About NutraLive — Nutralive Co.,Ltd, Nanjing',
  description:
    'Nutralive Co.,Ltd was founded in 2019 in Nanjing, China. Research, production and global supply of herbal extracts, amino acids, functional ingredients and organic ingredients.',
  alternates: { canonical: `${SITE_URL}/about` },
}

const FACTS = [
  { k: 'Founded', v: String(COMPANY.founded) },
  { k: 'Headquarters', v: 'Nanjing, China' },
  { k: 'Certifications', v: '5' },
  { k: 'Export markets', v: COMPANY.markets.join(', ') },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={`${COMPANY.legalName}: ${COMPANY.tagline}`}
        description="Research, production and global supply of standardized botanical and functional ingredients."
        crumbs={[{ label: 'About' }]}
      />

      <section className="bg-white py-14 lg:py-20">
        <div className={`${CONTAINER} grid gap-10 lg:grid-cols-[1.2fr_1fr]`}>
          <div className="space-y-5 text-lg leading-relaxed text-foreground/90">
            <p>
              {COMPANY.legalName}, trading as {COMPANY.brand}, was founded in {COMPANY.founded} in Nanjing, China. We
              specialize in the research, production and global supply of herbal extracts, amino acids, functional
              ingredients and USDA NOP organic ingredients.
            </p>
            <p>
              Beyond standardized raw materials, we offer custom processing — granulation, premix blending, herbal
              extract tableting and hard capsule filling — for food, dietary supplement, cosmetic and pharmaceutical
              manufacturers.
            </p>
            <p>
              Our partners include end-use manufacturers, contract manufacturers, wholesalers and distributors across
              Europe, the United States, Asia and Southeast Asia.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-4 self-start">
            {FACTS.map((f) => (
              <div key={f.k} className="rounded-2xl border border-sage bg-cream p-5">
                <dt className="text-xs font-semibold uppercase tracking-wider text-leaf-dark">{f.k}</dt>
                <dd className="mt-1 font-sans text-lg font-semibold text-forest-deep">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-y border-sage bg-cream py-14 lg:py-20">
        <div className={CONTAINER}>
          <SectionHeading
            eyebrow="Production Facilities"
            title="Extraction workshop & cleanroom manufacturing"
            description="Stainless-steel extraction tanks, spray-drying and cleanroom blending lines supporting standardized commercial lots."
          />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CUSTOMER_GALLERIES.factory.map((photo) => (
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

          <div className="mt-16">
            <SectionHeading
              eyebrow="Warehousing & Export Logistics"
              title="25 kg fiber-drum storage & international dispatch"
              description="Palletized bulk inventory and export-ready container loading for global supply."
            />
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[...CUSTOMER_GALLERIES.warehouse, ...CUSTOMER_GALLERIES.logistics].map((photo) => (
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
          </div>
        </div>
      </section>

      <GlobalPartnerSectors />
    </>
  )
}

import type { Metadata } from 'next'
import { Atom, Bug, FlaskConical } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { CertificateGallery } from '@/components/site/certificate-gallery'
import { CUSTOMER_GALLERIES } from '@/lib/customer-galleries'
import { CONTAINER, IMG } from '@/lib/site'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nutraliveingredients.com').replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'Quality — Certifications, HPLC/GC Lab & Qualification Process',
  description:
    'ISO 9001:2015, ISO 22000:2018, HACCP, Halal and USDA NOP Organic certificates, plus HPLC, GC and microbiology testing at NutraLive.',
  alternates: { canonical: `${SITE_URL}/quality` },
}

const LAB = [
  { icon: FlaskConical, t: 'HPLC', d: 'Assay and purity of active compounds such as curcuminoids, berberine and polyphenols.' },
  { icon: Atom, t: 'GC', d: 'Gas chromatography for oils, tocopherols and volatile components.' },
  { icon: Bug, t: 'Microbiology', d: 'Total plate count, yeast and mold, and pathogen screening per specification.' },
]

const PROCESS = [
  'Ingredient and specification request',
  'Raw material and source review',
  'Supplier document check (certificates, SDS, flow chart)',
  'Sample preparation and labelling',
  'Laboratory testing against specification',
  'COA and SPEC issued with the sample',
  'Customer evaluation and feedback',
  'Specification and packaging agreement',
  'Pilot or first commercial batch',
  'Batch release testing, COA and export shipment',
]

export default function QualityPage() {
  return (
    <>
      <PageHero
        eyebrow="Quality"
        title="Certified systems, laboratory-tested lots"
        description="Five international certifications, an in-house HPLC, GC and microbiology laboratory, and a ten-point supplier qualification process."
        crumbs={[{ label: 'Quality' }]}
      />

      <section className="bg-white py-14 lg:py-20">
        <div className={CONTAINER}>
          <SectionHeading
            eyebrow="Certificates"
            title="Five certifications, individually documented"
            description="Every original certificate is presented individually. Click any preview to inspect the full document."
          />
          <div className="mt-10">
            <CertificateGallery />
          </div>
        </div>
      </section>

      <section className="border-y border-sage bg-cream py-14 lg:py-20">
        <div className={CONTAINER}>
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="QC Laboratory"
                title="HPLC, GC and microbiology testing"
                description="Every lot is checked against its specification and issued with a COA."
              />
              <ul className="mt-8 space-y-4">
                {LAB.map((l) => (
                  <li key={l.t} className="flex gap-4 rounded-2xl border border-sage bg-white p-5">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-forest">
                      <l.icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-sans text-base font-semibold text-forest-deep">{l.t}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{l.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <figure className="overflow-hidden rounded-3xl border border-sage bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMG.labHplc}
                alt="HPLC analytical instrument and workstation in the QC laboratory"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="border-t border-sage px-5 py-4 text-sm text-muted-foreground">
                HPLC instrument used for assay and purity testing.
              </figcaption>
            </figure>
          </div>

          {CUSTOMER_GALLERIES.lab.length > 0 && (
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {CUSTOMER_GALLERIES.lab.map((photo) => (
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

      <section className="bg-white py-14 lg:py-20">
        <div className={CONTAINER}>
          <SectionHeading
            eyebrow="Qualification"
            title="Ten-point supplier qualification process"
            description="From first inquiry to export shipment, each stage is documented."
          />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS.map((p, i) => (
              <li key={p}>
                <Reveal delay={(i % 5) * 50} className="h-full">
                  <div className="h-full rounded-2xl border border-sage bg-cream p-5">
                    <span className="font-display text-3xl italic text-leaf-dark">{String(i + 1).padStart(2, '0')}</span>
                    <p className="mt-2 text-sm font-medium leading-snug text-forest-deep">{p}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}

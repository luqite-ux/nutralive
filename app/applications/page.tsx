import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { Reveal } from '@/components/site/reveal'
import { SECTOR_ICONS } from '@/components/home/health-applications'
import { SECTORS } from '@/lib/sectors'
import { getProducts } from '@/lib/catalog'
import { CONTAINER } from '@/lib/site'
import { Button } from '@/components/ui/button'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nutralive.com').replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'Applications — Six Health Sectors',
  description:
    'NutraLive ingredients matched to skin care, joint health, cardiovascular health, cognition improvement, sports nutrition and vision protection.',
  alternates: { canonical: `${SITE_URL}/applications` },
}

export default async function ApplicationsPage() {
  const products = await getProducts('en')

  return (
    <>
      <PageHero
        eyebrow="Applications"
        title="Six health sectors, matched to ingredients"
        description="Browse the ingredients we supply for each health application and open any item for specifications and a product-specific quote."
        crumbs={[{ label: 'Applications' }]}
      />
      <section className="bg-white py-14 lg:py-20">
        <div className={`${CONTAINER} space-y-8`}>
          {SECTORS.map((s) => {
            const Icon = SECTOR_ICONS[s.slug]
            const matched = products.filter((p) => p.sectors.includes(s.slug))
            return (
              <Reveal key={s.slug}>
                <article
                  id={s.slug}
                  className="scroll-mt-28 grid gap-8 rounded-3xl border border-sage bg-cream p-7 lg:grid-cols-[1fr_1.3fr] lg:p-10"
                >
                  <div>
                    <span className="flex size-14 items-center justify-center rounded-2xl bg-white text-forest ring-1 ring-sage">
                      <Icon className="size-7" aria-hidden="true" />
                    </span>
                    <h2 className="mt-5 text-3xl font-semibold">{s.name}</h2>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{s.summary}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {s.focus.map((f) => (
                        <li key={f} className="rounded-full border border-sage bg-white px-3 py-1 text-sm text-forest-deep">
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-leaf-dark">
                      Matched ingredients ({matched.length})
                    </h3>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                      {matched.map((p) => (
                        <li key={p.slug}>
                          <Link
                            href={`/products/${p.slug}`}
                            className="group flex h-full flex-col rounded-xl border border-sage bg-white p-4 transition-colors hover:border-forest focus-visible:outline-2 focus-visible:outline-leaf"
                          >
                            <span className="font-semibold text-forest-deep group-hover:underline">{p.name}</span>
                            <span className="mt-1 text-sm text-muted-foreground">{p.spec}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            )
          })}
          <div className="rounded-3xl border border-sage bg-white p-8 text-center">
            <h2 className="text-2xl font-semibold">Developing a new formula?</h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              Share your target benefit and dosage form. We will suggest ingredients and custom processing options.
            </p>
            <Button asChild size="lg" className="mt-6 bg-forest hover:bg-forest-deep">
              <Link href="/contact#rfq">
                Request a quote <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

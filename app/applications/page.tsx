import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { Reveal } from '@/components/site/reveal'
import { SECTOR_ICONS } from '@/components/home/health-applications'
import { SECTORS } from '@/lib/sectors'
import { getProducts } from '@/lib/catalog'
import { CONTAINER } from '@/lib/site'
import { Button } from '@/components/ui/button'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nutraliveingredients.com').replace(/\/$/, '')

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
        description="Browse the core ingredients we supply for each health application and open any item for full specifications and a product-specific quote."
        crumbs={[{ label: 'Applications' }]}
      />
      <section className="bg-white py-14 lg:py-20">
        <div className={`${CONTAINER} space-y-10`}>
          {SECTORS.map((s) => {
            const Icon = SECTOR_ICONS[s.slug]
            const matched = products.filter((p) => p.sectors.includes(s.slug))
            return (
              <Reveal key={s.slug}>
                <article
                  id={s.slug}
                  className="scroll-mt-28 overflow-hidden rounded-3xl border border-sage bg-cream p-7 lg:p-10"
                >
                  <div className="flex flex-col gap-6 border-b border-sage pb-7 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-4">
                        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-forest ring-1 ring-sage">
                          <Icon className="size-6" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-leaf-dark">
                            {matched.length} Core Ingredients
                          </p>
                          <h2 className="text-2xl font-semibold sm:text-3xl">{s.name}</h2>
                        </div>
                      </div>
                      <p className="mt-4 leading-relaxed text-muted-foreground">{s.summary}</p>
                    </div>
                    <ul className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
                      {s.focus.map((f) => (
                        <li key={f} className="rounded-full border border-sage bg-white px-3.5 py-1.5 text-xs font-medium text-forest-deep">
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {matched.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/products/${p.slug}`}
                          className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sage bg-white transition-all hover:-translate-y-0.5 hover:border-forest hover:shadow-md focus-visible:outline-2 focus-visible:outline-leaf"
                        >
                          <div className="aspect-[16/10] w-full overflow-hidden bg-cream">
                            {p.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={p.image}
                                alt={p.name}
                                loading="lazy"
                                className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                              />
                            ) : null}
                          </div>
                          <div className="flex flex-1 flex-col p-4">
                            <span className="line-clamp-2 font-semibold leading-snug text-forest-deep group-hover:underline">
                              {p.name}
                            </span>
                            <span className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{p.spec}</span>
                            <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-semibold text-forest">
                              View specs <ArrowUpRight className="size-3.5" aria-hidden="true" />
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
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

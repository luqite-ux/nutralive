import Link from 'next/link'
import { ArrowRight, Bone, Brain, Dumbbell, Eye, HeartPulse, Sparkles, type LucideIcon } from 'lucide-react'
import { SECTORS } from '@/lib/sectors'
import { getProducts } from '@/lib/catalog'
import type { SectorSlug } from '@/lib/products'
import { CONTAINER } from '@/lib/site'
import { SectionHeading } from '@/components/site/section-heading'
import { Reveal } from '@/components/site/reveal'

export const SECTOR_ICONS: Record<SectorSlug, LucideIcon> = {
  'skin-care': Sparkles,
  'joint-health': Bone,
  'cardiovascular-health': HeartPulse,
  'cognition-improvement': Brain,
  'sports-nutrition': Dumbbell,
  'vision-protection': Eye,
}

export async function HealthApplications() {
  const products = await getProducts('en')

  return (
    <section id="health-applications" className="bg-white py-20 lg:py-28">
      <div className={CONTAINER}>
        <Reveal>
          <SectionHeading
            eyebrow="Health Applications"
            title="Ingredients matched to six health sectors"
            description="Start from the benefit your formula targets and see which NutraLive ingredients fit."
          />
        </Reveal>
        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SECTORS.map((s, i) => {
            const Icon = SECTOR_ICONS[s.slug]
            const matched = products.filter((p) => p.sectors.includes(s.slug)).slice(0, 4)
            return (
              <li key={s.slug}>
                <Reveal delay={(i % 3) * 70} className="h-full">
                  <article className="flex h-full flex-col rounded-2xl border border-sage bg-cream p-6 transition-colors hover:border-leaf/60">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-white text-forest ring-1 ring-sage">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 font-sans text-xl font-semibold text-forest-deep">{s.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.summary}</p>
                    {matched.length > 0 && (
                      <div className="mt-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-leaf-dark">Matched ingredients</p>
                        <ul className="mt-2 flex flex-wrap gap-1.5">
                          {matched.map((p) => (
                            <li key={p.slug}>
                              <Link
                                href={`/products/${p.slug}`}
                                className="inline-block rounded-full border border-sage bg-white px-2.5 py-1 text-xs font-medium text-forest-deep transition-colors hover:border-forest focus-visible:outline-2 focus-visible:outline-leaf"
                              >
                                {p.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <Link
                      href={`/applications#${s.slug}`}
                      className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-forest hover:underline focus-visible:outline-2 focus-visible:outline-leaf"
                    >
                      Explore {s.name} <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </article>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

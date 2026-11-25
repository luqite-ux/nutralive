import { Factory, Globe2, Handshake, Store, type LucideIcon } from 'lucide-react'
import { COMPANY, CONTAINER } from '@/lib/site'
import { SectionHeading } from '@/components/site/section-heading'
import { Reveal } from '@/components/site/reveal'

const PARTNERS: { title: string; text: string; icon: LucideIcon }[] = [
  {
    title: 'End-Use Manufacturers',
    text: 'Food, dietary supplement, cosmetic and pharmaceutical brands sourcing ingredients for their own products.',
    icon: Factory,
  },
  {
    title: 'Contract Manufacturers',
    text: 'CMOs and OEM producers needing consistent specifications, COA per lot and custom-processed inputs.',
    icon: Handshake,
  },
  {
    title: 'Wholesalers & Distributors',
    text: 'Regional distributors stocking herbal extracts, amino acids and functional ingredients in 25 kg formats.',
    icon: Store,
  },
]

const STEPS = [
  { n: '1', title: 'Spec Inquiry', text: 'Tell us the ingredient, specification and volume.' },
  { n: '2', title: 'Sample & COA', text: 'Evaluate a sample with the matching COA and SPEC.' },
  { n: '3', title: 'Bulk / OEM Production', text: 'Stock supply or custom-processed batches.' },
  { n: '4', title: 'Global Export', text: 'Packed in fiber drums and shipped worldwide.' },
]

export function GlobalPartnerSectors() {
  return (
    <section id="global-partner-sectors" className="bg-white py-20 lg:py-28">
      <div className={CONTAINER}>
        <Reveal>
          <SectionHeading
            eyebrow="Global Partners"
            title="Supplying manufacturers and distributors worldwide"
            description={`We export to ${COMPANY.markets.slice(0, 3).join(', ')} and ${COMPANY.markets[3]}.`}
          />
        </Reveal>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {PARTNERS.map((p, i) => (
            <li key={p.title}>
              <Reveal delay={i * 80} className="h-full">
                <article className="h-full rounded-2xl border border-sage bg-cream p-6">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-white text-forest ring-1 ring-sage">
                    <p.icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-sans text-xl font-semibold text-forest-deep">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-6">
          <ul className="flex flex-wrap items-center gap-2" aria-label="Export markets">
            <li className="mr-1 inline-flex items-center gap-1.5 text-sm font-semibold text-forest">
              <Globe2 className="size-4" aria-hidden="true" /> Markets:
            </li>
            {COMPANY.markets.map((m) => (
              <li key={m} className="rounded-full border border-sage bg-white px-3 py-1 text-sm font-medium text-forest-deep">
                {m}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-14">
          <h3 className="font-sans text-xl font-semibold text-forest-deep">Four-step sourcing workflow</h3>
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {STEPS.map((s) => (
              <li key={s.n} className="relative rounded-2xl border border-sage bg-white p-5">
                <span className="flex size-9 items-center justify-center rounded-full bg-forest text-sm font-bold text-white">
                  {s.n}
                </span>
                <h4 className="mt-4 text-base font-semibold text-forest-deep">{s.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}

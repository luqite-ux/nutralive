import { Clock, FileCheck2, FlaskConical, Mail, MapPin, Package, Phone } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { COMPANY, CONTAINER, FAQS } from '@/lib/site'
import { SectionHeading } from '@/components/site/section-heading'
import { RfqForm } from '@/components/site/rfq-form'
import { Reveal } from '@/components/site/reveal'

const HIGHLIGHTS = [
  { icon: Package, text: 'MOQ from 25 kg; custom and OEM batches from 500 kg' },
  { icon: FlaskConical, text: 'Free or paid samples for qualified inquiries' },
  { icon: FileCheck2, text: 'COA and SPEC with every lot' },
  { icon: Clock, text: '7–10 day lead time on standard items' },
]

export function FaqAndRfq() {
  return (
    <section id="faq-and-rfq" className="bg-cream py-20 lg:py-28">
      <div className={CONTAINER}>
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Sourcing questions, answered"
            description="Order terms, samples, documents and custom processing at a glance."
          />
        </Reveal>

        <Reveal className="mt-10">
          <Accordion type="single" collapsible className="rounded-2xl border border-sage bg-white px-6">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`} className="border-sage">
                <AccordionTrigger className="text-left text-base font-semibold text-forest-deep hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <div id="rfq" className="mt-20 grid gap-8 lg:grid-cols-2 lg:items-stretch">
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-3xl border border-sage bg-white p-7 lg:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf-dark">Contact & RFQ</p>
              <h2 className="mt-2 text-3xl font-semibold leading-tight">Request a quote or sample</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {COMPANY.legalName} (brand: {COMPANY.brand}) was founded in {COMPANY.founded} in Nanjing, China. We
                research, produce and export herbal extracts, amino acids, functional ingredients and USDA NOP organic
                ingredients, plus custom granulation, premix blending, tableting and hard capsule filling for
                manufacturers worldwide.
              </p>

              <ul className="mt-6 space-y-4 text-sm">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-forest" aria-hidden="true" />
                  <span>
                    <span className="block font-semibold text-forest-deep">Headquarters</span>
                    {COMPANY.address}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 size-5 shrink-0 text-forest" aria-hidden="true" />
                  <span>
                    <span className="block font-semibold text-forest-deep">Phone</span>
                    {COMPANY.phones.map((p, i) => (
                      <span key={p.href}>
                        {i > 0 && <span aria-hidden="true"> / </span>}
                        <a href={p.href} className="hover:underline">
                          {p.label}
                        </a>
                      </span>
                    ))}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 size-5 shrink-0 text-forest" aria-hidden="true" />
                  <span>
                    <span className="block font-semibold text-forest-deep">Email</span>
                    <a href={`mailto:${COMPANY.email}`} className="hover:underline">
                      {COMPANY.email}
                    </a>
                  </span>
                </li>
              </ul>

              <div className="mt-7 rounded-2xl border border-sage bg-cream p-5">
                <p className="text-sm font-semibold text-forest-deep">Sourcing support</p>
                <ul className="mt-3 space-y-3">
                  {HIGHLIGHTS.map((h) => (
                    <li key={h.text} className="flex items-start gap-3 text-sm text-foreground">
                      <h.icon className="mt-0.5 size-4 shrink-0 text-leaf-dark" aria-hidden="true" />
                      {h.text}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-auto pt-6 text-xs text-muted-foreground">
                Serving end-use manufacturers, contract manufacturers, wholesalers and distributors in{' '}
                {COMPANY.markets.join(', ')}.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100} className="h-full">
            <div className="h-full rounded-3xl border border-sage bg-white p-7 shadow-[0_24px_60px_-34px_rgba(22,54,26,0.4)] lg:p-9">
              <h3 className="text-2xl font-semibold">Send your inquiry</h3>
              <p className="mt-1 mb-6 text-sm text-muted-foreground">We reply to every commercial inquiry by email.</p>
              <RfqForm idPrefix="home-rfq" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

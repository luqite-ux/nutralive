import type { Metadata } from 'next'
import { Mail, MapPin, Phone } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { RfqForm } from '@/components/site/rfq-form'
import { COMPANY, CONTAINER } from '@/lib/site'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nutralive.com').replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'Contact & Request a Quote',
  description:
    'Contact Nutralive Co.,Ltd in Nanjing, China, or send a request for quote for herbal extracts, amino acids, functional ingredients and custom processing.',
  alternates: { canonical: `${SITE_URL}/contact` },
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Request a quote or sample"
        description="Tell us the ingredient, specification and quantity. Our sourcing team replies promptly by email."
        crumbs={[{ label: 'Contact' }]}
      />
      <section className="bg-white py-14 lg:py-20">
        <div className={`${CONTAINER} grid gap-10 lg:grid-cols-[1fr_1.2fr]`}>
          <div className="space-y-6">
            <div className="rounded-3xl border border-sage bg-cream p-7">
              <h2 className="text-2xl font-semibold">{COMPANY.legalName}</h2>
              <p className="mt-1 font-display italic text-forest">{COMPANY.tagline}</p>
              <ul className="mt-6 space-y-5 text-sm">
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
                    {COMPANY.phones.map((p) => (
                      <a key={p.href} href={p.href} className="block hover:underline">
                        {p.label}
                      </a>
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
            </div>
            <p className="text-sm text-muted-foreground">
              Serving end-use manufacturers, contract manufacturers, wholesalers and distributors in{' '}
              {COMPANY.markets.join(', ')}.
            </p>
          </div>
          <div id="rfq" className="scroll-mt-28 rounded-3xl border border-sage bg-white p-7 shadow-[0_24px_60px_-34px_rgba(22,54,26,0.4)] lg:p-9">
            <h2 className="text-2xl font-semibold">Send your inquiry</h2>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">All fields marked with * are required for a faster quotation.</p>
            <RfqForm idPrefix="contact-rfq" />
          </div>
        </div>
      </section>
    </>
  )
}

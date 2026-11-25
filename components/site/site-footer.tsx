import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Logo } from './logo'
import { Copyright } from './copyright'
import { COMPANY, CONTAINER, NAV_LINKS } from '@/lib/site'

const FOOTER_CATEGORIES = [
  { slug: 'herbal-extracts', name: 'Herbal Extracts' },
  { slug: 'amino-acids', name: 'Amino Acids' },
  { slug: 'functional-ingredients', name: 'Functional Ingredients' },
  { slug: 'organic-ingredients', name: 'Organic Ingredients' },
] as const

export function SiteFooter() {
  return (
    <footer className="border-t border-sage bg-cream">
      <div className={`${CONTAINER} grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]`}>
        <div>
          <Logo />
          <p className="mt-4 font-display text-lg italic text-forest">{COMPANY.tagline}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Herbal extracts, amino acids, functional ingredients and USDA NOP organic ingredients, with custom
            processing for global food, supplement, cosmetic and pharmaceutical manufacturers.
          </p>
        </div>

        <nav aria-label="Quick links">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-forest-deep">Quick Links</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-foreground/80 hover:text-forest hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Product categories">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-forest-deep">Products</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {FOOTER_CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/products?category=${c.slug}`}
                  className="text-foreground/80 hover:text-forest hover:underline"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-forest-deep">Nanjing Headquarters</h2>
          <ul className="mt-4 space-y-3 text-sm text-foreground/85">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-leaf" aria-hidden="true" />
              <address className="not-italic leading-relaxed">{COMPANY.address}</address>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-leaf" aria-hidden="true" />
              <span className="flex flex-col">
                {COMPANY.phones.map((p) => (
                  <a key={p.href} href={p.href} className="hover:text-forest hover:underline">
                    {p.label}
                  </a>
                ))}
              </span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-leaf" aria-hidden="true" />
              <a href={`mailto:${COMPANY.email}`} className="hover:text-forest hover:underline">
                {COMPANY.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sage">
        <div className={`${CONTAINER} flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between`}>
          <Copyright />
          <p>ISO 9001 · ISO 22000 · HACCP · Halal · USDA NOP Organic</p>
        </div>
      </div>
    </footer>
  )
}

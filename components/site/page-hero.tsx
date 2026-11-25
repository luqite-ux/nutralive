import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { CONTAINER } from '@/lib/site'
import { SectionHeading } from './section-heading'

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs = [],
}: {
  eyebrow?: string
  title: string
  description?: string
  crumbs?: { label: string; href?: string }[]
}) {
  return (
    <section className="border-b border-sage bg-gradient-to-b from-cream to-white">
      <div className={`${CONTAINER} py-14 lg:py-20`}>
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-forest hover:underline">
                Home
              </Link>
            </li>
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5" aria-hidden="true" />
                {c.href ? (
                  <Link href={c.href} className="hover:text-forest hover:underline">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current={i === crumbs.length - 1 ? 'page' : undefined} className="text-forest-deep">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} description={description} />
      </div>
    </section>
  )
}

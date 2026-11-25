import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getCategories, getProducts } from '@/lib/catalog'
import { CONTAINER, IMG } from '@/lib/site'
import { SectionHeading } from '@/components/site/section-heading'
import { Reveal } from '@/components/site/reveal'

const FALLBACK_IMAGES: Record<string, string> = {
  'herbal-extracts': IMG.turmeric,
  'amino-acids': IMG.banner3,
  'functional-ingredients': IMG.tocopherol,
  'organic-ingredients': IMG.beetroot,
}

export async function CategoryMatrix() {
  const [categories, products] = await Promise.all([getCategories('en'), getProducts('en')])
  const countByCat = new Map<string, number>()
  const firstImgByCat = new Map<string, string>()
  for (const p of products) {
    countByCat.set(p.category, (countByCat.get(p.category) ?? 0) + 1)
    if (!firstImgByCat.has(p.category) && p.image) firstImgByCat.set(p.category, p.image)
  }

  return (
    <section id="category-matrix" className="bg-cream py-20 lg:py-28">
      <div className={CONTAINER}>
        <Reveal>
          <SectionHeading
            eyebrow="Product Range"
            title="Four ingredient categories, one qualified supplier"
            description="Browse photographed core products or search our full specification catalog across all four categories."
          />
        </Reveal>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => {
            const img = c.image || firstImgByCat.get(c.slug) || FALLBACK_IMAGES[c.slug] || IMG.turmeric
            const count = countByCat.get(c.slug) ?? 0
            return (
              <li key={c.slug}>
                <Reveal delay={i * 80} className="h-full">
                  <Link
                    href={`/products?category=${c.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sage bg-white transition-all hover:-translate-y-1 hover:border-leaf/60 hover:shadow-[0_18px_40px_-20px_rgba(22,54,26,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
                  >
                    <div className="aspect-[5/4] w-full overflow-hidden bg-cream">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`${c.name} representative sample`}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-sans text-xl font-semibold text-forest-deep">{c.name}</h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
                      <p className="mt-auto flex items-center justify-between pt-5 text-sm font-semibold text-forest">
                        <span>{count} core products</span>
                        <ArrowUpRight
                          className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </p>
                    </div>
                  </Link>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

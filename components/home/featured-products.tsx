import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getProducts } from '@/lib/catalog'
import { CONTAINER } from '@/lib/site'
import { SectionHeading } from '@/components/site/section-heading'
import { ProductCard } from '@/components/site/product-card'
import { Reveal } from '@/components/site/reveal'

export async function FeaturedProducts() {
  const allProducts = await getProducts('en')
  const products = allProducts.slice(0, 8)

  return (
    <section id="featured-products" className="bg-cream py-20 lg:py-28">
      <div className={CONTAINER}>
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Featured Ingredients"
              title="Representative products with real specifications"
              description="Photographed stock ingredients from our catalog. Open any product for full specifications, gallery photos, MOQ, sample and COA details."
            />
            <Button asChild variant="outline" className="border-forest text-forest">
              <Link href="/products">
                View all {allProducts.length} products <ArrowRight />
              </Link>
            </Button>
          </div>
        </Reveal>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <li key={p.slug}>
              <Reveal delay={(i % 4) * 70} className="h-full">
                <ProductCard product={p} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

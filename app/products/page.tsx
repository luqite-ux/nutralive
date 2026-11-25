import type { Metadata } from 'next'
import { PageHero } from '@/components/site/page-hero'
import { ProductExplorer } from '@/components/products/product-explorer'
import { getCategories, getFullIngredientDatabase, getProducts, type CategorySlug } from '@/lib/catalog'
import { CONTAINER } from '@/lib/site'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nutralive.com').replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'Products — Herbal Extracts, Amino Acids & Functional Ingredients',
  description:
    'Browse NutraLive photographed core products and search our full ingredient specification index across herbal extracts, amino acids, functional ingredients and USDA NOP organic ingredients.',
  alternates: { canonical: `${SITE_URL}/products` },
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const [{ category }, categories, products] = await Promise.all([
    searchParams,
    getCategories('en'),
    getProducts('en'),
  ])
  const fullDatabase = getFullIngredientDatabase()
  const initial = categories.some((c) => c.slug === category) ? (category as CategorySlug) : 'all'

  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Ingredients & specification catalog"
        description="Filter our photographed core products by category or search our complete ingredient specification index by name, CAS number, assay or application."
        crumbs={[{ label: 'Products' }]}
      />
      <section className="bg-white py-12 lg:py-16">
        <div className={CONTAINER}>
          <ProductExplorer
            categories={categories}
            products={products}
            fullDatabase={fullDatabase}
            initialCategory={initial}
          />
        </div>
      </section>
    </>
  )
}

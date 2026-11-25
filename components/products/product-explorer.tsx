'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/site/product-card'
import type { CatalogCategory, CatalogProduct, CategorySlug, FullIngredientRow } from '@/lib/catalog'
import { cn } from '@/lib/utils'

type Filter = 'all' | CategorySlug

export function ProductExplorer({
  categories,
  products,
  fullDatabase,
  initialCategory = 'all',
}: {
  categories: CatalogCategory[]
  products: CatalogProduct[]
  fullDatabase: FullIngredientRow[]
  initialCategory?: Filter
}) {
  const [category, setCategory] = useState<Filter>(initialCategory)
  const [query, setQuery] = useState('')
  const [dbQuery, setDbQuery] = useState('')

  function selectCategory(next: Filter) {
    setCategory(next)
    const url = next === 'all' ? '/products' : `/products?category=${next}`
    window.history.replaceState(null, '', url)
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false
      if (!q) return true
      return [p.name, p.cas ?? '', p.spec, p.source, p.form, ...p.uses, ...Object.values(p.specs)]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [category, products, query])

  const filteredDb = useMemo(() => {
    const q = dbQuery.trim().toLowerCase()
    if (!q) return fullDatabase
    return fullDatabase.filter((row) =>
      [row.name, row.category, row.spec, row.cas ?? '', row.source ?? '', row.method ?? '']
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }, [dbQuery, fullDatabase])

  return (
    <div className="space-y-16">
      <div>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
            <FilterPill active={category === 'all'} onClick={() => selectCategory('all')}>
              All ({products.length})
            </FilterPill>
            {categories.map((c) => (
              <FilterPill key={c.slug} active={category === c.slug} onClick={() => selectCategory(c.slug)}>
                {c.name} ({products.filter((p) => p.category === c.slug).length})
              </FilterPill>
            ))}
          </div>
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, CAS, spec or use"
              aria-label="Search core products"
              className="h-11 border-sage bg-white pl-9 pr-9"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-forest"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        <p className="mt-5 text-sm text-muted-foreground" role="status" aria-live="polite">
          Showing {results.length} of {products.length} photographed core products
        </p>

        {results.length > 0 ? (
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-2xl border border-sage bg-cream px-6 py-12 text-center">
            <p className="font-semibold text-forest-deep">No core products match your filter.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Search the complete {fullDatabase.length}-item ingredient specification index below or send us your target spec.
            </p>
            <Button asChild className="mt-5 bg-forest hover:bg-forest-deep">
              <Link href="/contact#rfq">Request a quote</Link>
            </Button>
          </div>
        )}
      </div>

      {fullDatabase.length > 0 && (
        <section id="full-ingredient-index" className="border-t border-sage pt-14">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf-dark">Complete Supply Catalog</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-forest-deep">
                Full Ingredient Specification Index ({fullDatabase.length} items)
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Search our broader portfolio of herbal extracts, amino acids, functional actives and organic ingredients. Request a COA or quote for any listed specification.
              </p>
            </div>
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                type="search"
                value={dbQuery}
                onChange={(e) => setDbQuery(e.target.value)}
                placeholder="Filter full index by name, spec or CAS"
                aria-label="Filter full ingredient index"
                className="h-11 border-sage bg-white pl-9 pr-9"
              />
              {dbQuery && (
                <button
                  type="button"
                  onClick={() => setDbQuery('')}
                  aria-label="Clear index search"
                  className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-forest"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Showing {filteredDb.length} of {fullDatabase.length} catalog specifications
          </p>

          {/* Mobile cards (< md) to ensure zero 390px horizontal overflow */}
          <ul className="mt-4 space-y-3 md:hidden">
            {filteredDb.slice(0, 60).map((row, idx) => (
              <li key={`${row.name}-${idx}`} className="rounded-xl border border-sage bg-white p-4">
                <p className="font-semibold text-forest-deep">{row.name}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-leaf-dark">{row.category}</p>
                <p className="mt-2 text-sm text-foreground/85">{row.spec}</p>
                {row.cas && <p className="mt-1 text-xs text-muted-foreground">CAS: {row.cas}</p>}
              </li>
            ))}
          </ul>

          {/* Desktop specification table (md+) */}
          <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-sage bg-white md:block">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">NutraLive full ingredient specification index</caption>
              <thead className="bg-cream text-xs uppercase tracking-wider text-forest-deep">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Ingredient</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Category</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Specification</th>
                  <th scope="col" className="px-4 py-3 font-semibold">CAS / Source</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-right">Inquiry</th>
                </tr>
              </thead>
              <tbody>
                {filteredDb.map((row, idx) => (
                  <tr key={`${row.name}-${idx}`} className="border-t border-sage align-top hover:bg-cream/60">
                    <th scope="row" className="px-4 py-3 font-semibold text-forest-deep">
                      {row.name}
                      {row.organic && (
                        <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-forest">Organic</span>
                      )}
                    </th>
                    <td className="px-4 py-3 text-foreground/80">{row.category}</td>
                    <td className="px-4 py-3 text-foreground/80">{row.spec}</td>
                    <td className="px-4 py-3 text-foreground/80">{row.cas || row.source || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/contact#rfq`}
                        className="text-xs font-semibold text-forest hover:underline"
                      >
                        Request Quote
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf',
        active
          ? 'border-forest bg-forest text-white'
          : 'border-sage bg-white text-forest-deep hover:border-forest',
      )}
    >
      {children}
    </button>
  )
}

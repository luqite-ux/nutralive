import { CONTAINER, IMG } from '@/lib/site'
import { SectionHeading } from '@/components/site/section-heading'
import { Reveal } from '@/components/site/reveal'

const ITEMS = [
  {
    title: 'HPLC / GC Laboratory',
    image: IMG.labHplc,
    alt: 'HPLC analytical instrument stack with a workstation in the NutraLive QC laboratory',
    caption: 'HPLC instrument used for assay and purity testing of active compounds.',
  },
  {
    title: 'Extraction Workshop',
    image: IMG.factory,
    alt: 'Stainless-steel extraction tanks in a bright production workshop',
    caption: 'Stainless-steel extraction tanks and a clean epoxy-floor workshop.',
  },
  {
    title: '25 kg Fiber-Drum Warehouse',
    image: IMG.warehouse,
    alt: 'Stacked 25 kg fiber drums on blue pallets in a warehouse',
    caption: 'Finished ingredients packed in 25 kg fiber drums on pallets, ready for export.',
  },
]

export function FacilityQcEvidence() {
  return (
    <section id="facility-qc-evidence" className="bg-cream py-20 lg:py-28">
      <div className={CONTAINER}>
        <Reveal>
          <SectionHeading
            eyebrow="Facility & QC"
            title="Production, laboratory and warehouse"
            description="HPLC, GC and microbiology testing support every lot before it is packed and exported."
          />
        </Reveal>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {ITEMS.map((item, i) => (
            <li key={item.title}>
              <Reveal delay={i * 90} className="h-full">
                <figure className="h-full overflow-hidden rounded-2xl border border-sage bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image || '/placeholder.svg'}
                    alt={item.alt}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <figcaption className="p-5">
                    <h3 className="font-sans text-lg font-semibold text-forest-deep">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.caption}</p>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

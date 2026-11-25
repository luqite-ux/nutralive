import Link from 'next/link'
import { ArrowRight, Boxes, FlaskConical, Pill, Tablets, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CONTAINER, IMG } from '@/lib/site'
import { SectionHeading } from '@/components/site/section-heading'
import { Reveal } from '@/components/site/reveal'

export const PILLARS: { title: string; text: string; icon: LucideIcon }[] = [
  {
    title: 'Granulation',
    text: 'Instantized granules for improved flow and dispersion in powders and stick packs.',
    icon: Boxes,
  },
  {
    title: 'Premix Blending',
    text: 'Homogeneous multi-ingredient premixes blended to your formula and dosage target.',
    icon: FlaskConical,
  },
  {
    title: 'Herbal Extract Tableting',
    text: 'Compressed herbal extract tablets produced to your size, weight and active specification.',
    icon: Tablets,
  },
  {
    title: 'Hard Capsule Filling',
    text: 'Two-piece hard capsule filling for powders, blends and granules.',
    icon: Pill,
  },
]

export function CustomProcessingShowcase() {
  return (
    <section id="custom-processing" className="bg-cream py-20 lg:py-28">
      <div className={`${CONTAINER} grid items-center gap-12 lg:grid-cols-2`}>
        <Reveal>
          <SectionHeading
            eyebrow="Custom Processing"
            title="From ingredient to finished dosage form"
            description="Send your formula and target format. NutraLive processes and packs it for private-label and contract manufacturing, from 500 kg."
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {PILLARS.map((p) => (
              <li key={p.title} className="rounded-2xl border border-sage bg-white p-5">
                <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-forest">
                  <p.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-sans text-base font-semibold text-forest-deep">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-8 bg-forest hover:bg-forest-deep">
            <Link href="/custom-processing">
              Explore custom processing <ArrowRight />
            </Link>
          </Button>
        </Reveal>

        <Reveal delay={120}>
          <figure className="overflow-hidden rounded-3xl border border-sage bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={IMG.packaging || '/placeholder.svg'}
              alt="NutraLive-labelled sample bottles and aluminum foil pouches"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
            <figcaption className="border-t border-sage px-5 py-4 text-sm text-muted-foreground">
              NutraLive sample bottles and aluminum foil pouches, shipped with COA and SPEC.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}

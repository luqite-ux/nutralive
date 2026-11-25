import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  as: Tag = 'h2',
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  as?: 'h1' | 'h2'
  className?: string
}) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p
          className={cn(
            'mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-forest',
            align === 'center' && 'justify-center',
          )}
        >
          <span aria-hidden="true" className="size-1.5 rounded-full bg-leaf" />
          {eyebrow}
        </p>
      )}
      <Tag className="text-balance text-3xl font-semibold leading-tight md:text-4xl lg:text-[2.6rem]">
        {title}
      </Tag>
      {description && (
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
    </div>
  )
}

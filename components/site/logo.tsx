import Link from 'next/link'
import { IMG } from '@/lib/site'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="NutraLive home" className={cn('inline-flex shrink-0 items-center', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={IMG.logo || '/placeholder.svg'}
        alt="NutraLive"
        width={220}
        height={50}
        className="h-9 w-auto object-contain sm:h-10"
      />
    </Link>
  )
}

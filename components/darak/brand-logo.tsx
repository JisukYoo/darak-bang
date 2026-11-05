import Image from 'next/image'
import { cn } from '@/lib/utils'

type BrandLogoProps = {
  size?: 'sm' | 'md'
  showWordmark?: boolean
  className?: string
}

export function BrandLogo({ size = 'md', showWordmark = true, className }: BrandLogoProps) {
  const emblem = size === 'sm' ? 'size-9 rounded-xl' : 'size-11 rounded-2xl'

  return (
    <span className={cn('flex shrink-0 items-center gap-2', className)}>
      <Image
        src="/logo.webp"
        alt={showWordmark ? '' : '온다락방'}
        width={44}
        height={44}
        priority
        className={cn('shrink-0 bg-card shadow-sm ring-1 ring-border', emblem)}
      />
      {showWordmark && (
        <span
          className={cn(
            'flex items-baseline font-logo font-bold leading-none',
            size === 'sm' ? 'text-2xl' : 'text-[1.7rem]',
          )}
        >
          <span className="text-warm">온</span>
          <span className="text-brand-ink">다락방</span>
        </span>
      )}
    </span>
  )
}

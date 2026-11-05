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
        src="/logo.png"
        alt={showWordmark ? '' : '온다락방'}
        width={44}
        height={44}
        priority
        className={cn('shrink-0 shadow-sm ring-1 ring-border', emblem)}
      />
      {showWordmark && (
        <span
          className={cn(
            'flex items-baseline font-bold tracking-tight leading-none',
            size === 'sm' ? 'text-lg' : 'text-xl',
          )}
        >
          <span className="relative text-warm">
            온
            <span
              aria-hidden
              className="absolute -top-1 -right-0.5 size-1.5 rounded-full bg-warm/70 shadow-[0_0_8px_var(--warm)]"
            />
          </span>
          <span className="text-foreground">다락방</span>
        </span>
      )}
    </span>
  )
}

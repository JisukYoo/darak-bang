import { cn } from '@/lib/utils'
import type { Member } from '@/lib/darak-data'

const tones = [
  'bg-secondary text-secondary-foreground',
  'bg-highlight text-accent-foreground',
  'bg-muted text-foreground',
]

export function MemberAvatar({
  member,
  size = 'md',
  className,
}: {
  member: Pick<Member, 'initial' | 'tone' | 'name'>
  size?: 'sm' | 'md'
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-medium',
        size === 'sm' ? 'size-7 text-xs' : 'size-10 text-sm',
        tones[member.tone % tones.length],
        className,
      )}
    >
      {member.initial}
    </span>
  )
}

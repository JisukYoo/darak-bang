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
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-medium',
        size === 'sm' ? 'size-7 text-xs' : size === 'lg' ? 'size-16 text-xl' : 'size-10 text-sm',
        tones[member.tone % tones.length],
        className,
      )}
    >
      {member.initial}
    </span>
  )
}

export function CoupleAvatars({
  members,
  size = 'md',
  ringClassName = 'ring-card',
}: {
  members: Pick<Member, 'initial' | 'tone' | 'name' | 'id'>[]
  size?: 'sm' | 'md' | 'lg'
  ringClassName?: string
}) {
  return (
    <span className="flex shrink-0 items-center" aria-hidden>
      {members.map((m, i) => (
        <MemberAvatar
          key={m.id}
          member={m}
          size={size}
          className={cn('ring-2', ringClassName, i > 0 && (size === 'lg' ? '-ml-5' : '-ml-3'))}
        />
      ))}
    </span>
  )
}

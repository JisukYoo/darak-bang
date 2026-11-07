'use client'

import { useEffect, useState } from 'react'
import { BookOpen, Gift, HandHeart, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Tab, useApp } from './app-provider'
import { MemberAvatar } from './member-avatar'

const items: { id: Exclude<Tab, 'profile'>; label: string; icon: typeof Home }[] = [
  { id: 'home', label: '홈', icon: Home },
  { id: 'bible', label: '성경', icon: BookOpen },
  { id: 'prayer', label: '기도·묵상', icon: HandHeart },
  { id: 'gift', label: '전도선물', icon: Gift },
]

const SCROLL_DELTA = 8
const TOP_ZONE = 48
const BOTTOM_ZONE = 24

function useHideOnScroll(resetKey: string) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    setHidden(false)
    let lastY = window.scrollY
    let ticking = false

    const update = () => {
      ticking = false
      const y = window.scrollY
      const atTop = y < TOP_ZONE
      const atBottom = window.innerHeight + y >= document.documentElement.scrollHeight - BOTTOM_ZONE

      if (atTop || atBottom) {
        setHidden(false)
      } else if (y - lastY > SCROLL_DELTA) {
        setHidden(true)
      } else if (lastY - y > SCROLL_DELTA) {
        setHidden(false)
      } else {
        return
      }
      lastY = y
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [resetKey])

  return hidden
}

export function BottomNav() {
  const { tab, setTab, me } = useApp()
  const profileActive = tab === 'profile'
  const hidden = useHideOnScroll(tab)

  return (
    <nav
      aria-label="주요 메뉴"
      data-hidden={hidden || undefined}
      className={cn(
        'pointer-events-none sticky bottom-0 z-30 flex justify-center px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]',
        'transition-transform duration-300 ease-out motion-reduce:transition-none',
        'data-[hidden]:translate-y-[calc(100%+1rem)] data-[hidden]:focus-within:translate-y-0',
      )}
    >
      <ul className="pointer-events-auto flex w-full max-w-md items-center gap-1 rounded-full bg-foreground p-1.5 text-background shadow-xl shadow-foreground/25">
        {items.map(({ id, label, icon: Icon }) => {
          const active = tab === id
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => setTab(id)}
                aria-current={active ? 'page' : undefined}
                aria-label={label}
                title={label}
                className={cn(
                  'flex h-12 w-full items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  active ? 'bg-background/15' : 'text-background/70 hover:text-background',
                )}
              >
                <Icon
                  className="size-6"
                  strokeWidth={active ? 2.4 : 1.8}
                  fill={active ? 'currentColor' : 'none'}
                  fillOpacity={active ? 0.25 : 0}
                  aria-hidden
                />
              </button>
            </li>
          )
        })}
        <li className="flex-1">
          <button
            type="button"
            onClick={() => setTab('profile')}
            aria-current={profileActive ? 'page' : undefined}
            aria-label="내 정보"
            title="내 정보"
            className={cn(
              'flex h-12 w-full items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              profileActive && 'bg-background/15',
            )}
          >
            <MemberAvatar
              member={me}
              size="sm"
              className={cn('ring-2 transition', profileActive ? 'ring-primary' : 'ring-transparent')}
            />
          </button>
        </li>
      </ul>
    </nav>
  )
}

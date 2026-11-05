'use client'

import { BookOpen, Gift, HandHeart, Home, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Tab, useApp } from './app-provider'

const items: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: '홈', icon: Home },
  { id: 'bible', label: '성경', icon: BookOpen },
  { id: 'prayer', label: '기도·묵상', icon: HandHeart },
  { id: 'gift', label: '전도선물', icon: Gift },
  { id: 'profile', label: '내 정보', icon: UserRound },
]

export function BottomNav() {
  const { tab, setTab } = useApp()

  return (
    <nav
      aria-label="주요 메뉴"
      className="sticky bottom-0 z-30 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ id, label, icon: Icon }) => {
          const active = tab === id
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => setTab(id)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex w-full flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-12 items-center justify-center rounded-full transition-colors',
                    active && 'bg-secondary',
                  )}
                >
                  <Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} aria-hidden />
                </span>
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

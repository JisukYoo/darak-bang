'use client'

import { useState } from 'react'
import { BrandLogo } from './brand-logo'
import { Bell, Check, ChevronDown, RefreshCw } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useApp } from './app-provider'

export function TopBar() {
  const { church, group, groups, churchId, groupId, selectGroup, selectChurch } = useApp()
  const [open, setOpen] = useState(false)
  const churchGroups = groups.filter((g) => g.churchId === churchId)

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-background/90 px-5 py-3 backdrop-blur">
      <div className="flex min-w-0 items-center gap-3">
      <BrandLogo size="sm" />
      <span aria-hidden className="h-10 w-px shrink-0 bg-border" />
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-w-0 flex-col items-start rounded-lg text-left"
        aria-haspopup="dialog"
      >
        <span className="truncate text-xs text-muted-foreground">{church?.name}</span>
        <span className="flex items-center gap-1 tracking-tight text-lg font-semibold">
          <span className="truncate">{group?.name}</span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        </span>
        <span className="sr-only">다락방 전환</span>
      </button>
      </div>
      <button
        type="button"
        className="relative flex size-10 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-border"
        aria-label="알림 2개"
      >
        <Bell className="size-4.5" aria-hidden />
        <span className="absolute top-2 right-2.5 size-2 rounded-full bg-accent ring-2 ring-card" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-4 rounded-2xl bg-card p-5">
          <DialogHeader>
            <DialogTitle className="tracking-tight text-lg">다락방 전환</DialogTitle>
            <DialogDescription>{church?.name}의 다락방</DialogDescription>
          </DialogHeader>
          <ul className="flex flex-col gap-1.5">
            {churchGroups.map((g) => (
              <li key={g.id}>
                <button
                  type="button"
                  onClick={() => {
                    selectGroup(g.id)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left transition',
                    g.id === groupId ? 'bg-secondary text-secondary-foreground' : 'hover:bg-muted',
                  )}
                >
                  <span className="flex flex-col">
                    <span className="font-medium">{g.name}</span>
                    <span className="text-xs text-muted-foreground">{g.schedule}</span>
                  </span>
                  {g.id === groupId && <Check className="size-4" aria-label="현재 선택됨" />}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              selectChurch(null)
            }}
            className="flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <RefreshCw className="size-4" aria-hidden />
            다른 교회 · 다락방 선택
          </button>
        </DialogContent>
      </Dialog>
    </header>
  )
}

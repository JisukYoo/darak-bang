'use client'

import { HandHeart } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { members } from '@/lib/darak-data'
import { useApp } from './app-provider'
import { MemberAvatar } from './member-avatar'

export function PrayingDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { posts, togglePray, setTab } = useApp()
  const praying = posts.filter((p) => p.prayedByMe)

  return (
    <Dialog open={open} onOpenChange={(next) => onOpenChange(next)}>
      <DialogContent className="max-h-[80dvh] gap-4 overflow-y-auto rounded-2xl bg-card p-5">
        <DialogHeader>
          <DialogTitle className="text-lg tracking-tight">함께 기도 중인 제목</DialogTitle>
          <DialogDescription>내가 기도하겠다고 표시한 나눔이에요.</DialogDescription>
        </DialogHeader>
        {praying.length ? (
          <ul className="flex flex-col gap-2">
            {praying.map((p) => {
              const author = members.find((m) => m.id === p.authorId)
              return (
                <li key={p.id} className="flex flex-col gap-2 rounded-xl bg-background p-3.5">
                  <div className="flex items-center gap-2">
                    {author && <MemberAvatar member={author} className="size-7 text-xs" />}
                    <span className="text-sm font-semibold">{author?.name}</span>
                    <span className="text-xs text-muted-foreground">{p.createdAt}</span>
                  </div>
                  <p className="line-clamp-4 text-sm leading-relaxed whitespace-pre-line text-pretty">{p.content}</p>
                  <button
                    type="button"
                    onClick={() => togglePray(p.id)}
                    className="flex w-fit items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground"
                  >
                    <HandHeart className="size-3.5" aria-hidden />
                    기도 중 해제
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <button
            type="button"
            onClick={() => {
              onOpenChange(false)
              setTab('prayer')
            }}
            className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground"
          >
            나눔 탭에서 함께 기도할 제목을 찾아보세요
          </button>
        )}
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { useState } from 'react'
import { Pin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useApp } from './app-provider'

export function NoticeComposeDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { addNotice } = useApp()
  const [pinned, setPinned] = useState(true)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] gap-4 overflow-y-auto rounded-2xl bg-card p-5" key={String(open)}>
        <DialogHeader>
          <DialogTitle className="text-lg tracking-tight">공지 작성</DialogTitle>
          <DialogDescription>다락방 멤버 모두에게 보여요. 멤버들은 댓글로 답할 수 있어요.</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            const data = new FormData(e.currentTarget)
            const get = (key: string) => String(data.get(key) ?? '').trim()
            const title = get('title')
            const body = get('body')
            if (!title || !body) return
            addNotice({
              title,
              body,
              pinned,
              address: get('address') || undefined,
              commentPrompt: get('prompt') || undefined,
            })
            onOpenChange(false)
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notice-title">제목</Label>
            <Input id="notice-title" name="title" required placeholder="예) 이번 주는 리더 가정에서 모여요" className="h-11 rounded-xl bg-background" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notice-body">내용</Label>
            <Textarea id="notice-body" name="body" required rows={4} className="rounded-xl bg-background text-base leading-relaxed" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notice-address">
              모이는 곳 <span className="font-normal text-muted-foreground">(선택)</span>
            </Label>
            <Input id="notice-address" name="address" placeholder="주소를 남기면 지도 바로가기가 생겨요" className="h-11 rounded-xl bg-background" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notice-prompt">
              댓글로 받을 내용 <span className="font-normal text-muted-foreground">(선택)</span>
            </Label>
            <Input id="notice-prompt" name="prompt" placeholder="예) 주차 신청할 차량번호를 남겨주세요" className="h-11 rounded-xl bg-background" />
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={pinned}
            onClick={() => setPinned((v) => !v)}
            className={cn(
              'flex items-center gap-3 rounded-xl border p-3 text-left text-sm transition',
              pinned ? 'border-primary bg-secondary text-secondary-foreground' : 'text-muted-foreground',
            )}
          >
            <Pin className="size-4" aria-hidden />
            <span className="flex-1">맨 위에 고정하기</span>
            <span className={cn('h-5 w-9 rounded-full p-0.5 transition', pinned ? 'bg-primary' : 'bg-muted')}>
              <span className={cn('block size-4 rounded-full bg-card shadow transition', pinned && 'translate-x-4')} />
            </span>
          </button>
          <Button type="submit" className="h-11 rounded-xl">
            공지 올리기
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

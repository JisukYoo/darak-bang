'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { type FeedPost, members } from '@/lib/darak-data'
import { useApp } from './app-provider'

export function PostEditDialog({ post, onOpenChange }: { post: FeedPost | null; onOpenChange: (open: boolean) => void }) {
  const { editPost, me } = useApp()
  // Keep the last post rendered while the dialog animates closed; remounting the popup mid-close leaves it stuck open.
  const [shown, setShown] = useState(post)
  if (post && post !== shown) setShown(post)

  const partnerId = shown?.coAuthorId && (shown.authorId === me.id ? shown.coAuthorId : shown.authorId)
  const partner = members.find((m) => m.id === partnerId)

  return (
    <Dialog open={!!post} onOpenChange={(open) => onOpenChange(open)}>
      <DialogContent className="gap-4 rounded-2xl bg-card p-5">
        <DialogHeader>
          <DialogTitle className="text-lg tracking-tight">
            {shown?.coAuthorId ? '부부 기도제목 수정' : '기도제목 수정'}
          </DialogTitle>
          <DialogDescription>
            {partner ? `${partner.name}님과 함께 편집하는 글이에요. 저장하면 두 분 모두에게 반영돼요.` : '수정한 내용은 바로 반영돼요.'}
          </DialogDescription>
        </DialogHeader>
        {shown && (
          <form
            key={shown.id}
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              const content = String(new FormData(e.currentTarget).get('content') ?? '').trim()
              if (!content) return
              editPost(shown.id, content)
              onOpenChange(false)
            }}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-content" className="sr-only">
                내용
              </Label>
              <Textarea
                id="edit-content"
                name="content"
                required
                rows={6}
                defaultValue={shown.content}
                className="rounded-xl bg-background text-base leading-relaxed"
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" className="h-11 flex-1 rounded-xl" onClick={() => onOpenChange(false)}>
                취소
              </Button>
              <Button type="submit" className="h-11 flex-1 rounded-xl">
                저장하기
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { type FeedPost, members } from '@/lib/darak-data'
import { useApp } from './app-provider'

export function PostEditDialog({ post, onOpenChange }: { post: FeedPost | null; onOpenChange: (open: boolean) => void }) {
  const { editPost, me } = useApp()
  const partnerId = post?.coAuthorId && (post.authorId === me.id ? post.coAuthorId : post.authorId)
  const partner = members.find((m) => m.id === partnerId)

  return (
    <Dialog open={!!post} onOpenChange={onOpenChange}>
      <DialogContent className="gap-4 rounded-2xl bg-card p-5" key={post?.id}>
        <DialogHeader>
          <DialogTitle className="text-lg tracking-tight">
            {post?.coAuthorId ? '부부 기도제목 수정' : '기도제목 수정'}
          </DialogTitle>
          <DialogDescription>
            {partner ? `${partner.name}님과 함께 편집하는 글이에요. 저장하면 두 분 모두에게 반영돼요.` : '수정한 내용은 바로 반영돼요.'}
          </DialogDescription>
        </DialogHeader>
        {post && (
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              const content = String(new FormData(e.currentTarget).get('content') ?? '').trim()
              if (!content) return
              editPost(post.id, content)
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
                defaultValue={post.content}
                className="rounded-xl bg-background text-base leading-relaxed"
              />
            </div>
            <Button type="submit" className="h-11 rounded-xl">
              저장하기
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

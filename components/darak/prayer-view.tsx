'use client'

import { useState } from 'react'
import { BookMarked, HandHeart, PenLine, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { type FeedPost, members } from '@/lib/darak-data'
import { useApp } from './app-provider'
import { CoupleAvatars, MemberAvatar } from './member-avatar'
import { PostEditDialog } from './post-edit-dialog'

type FeedType = FeedPost['type']

const tabs: { id: FeedType; label: string }[] = [
  { id: 'prayer', label: '기도제목' },
  { id: 'meditation', label: '말씀 묵상' },
]

export function PrayerView() {
  const { posts } = useApp()
  const [active, setActive] = useState<FeedType>('prayer')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<FeedPost | null>(null)
  const feed = posts.filter((p) => p.type === active)

  return (
    <div className="flex flex-col gap-5 px-5 pt-2 pb-8">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="tracking-tight text-2xl font-semibold">함께 기도하고 묵상해요</h1>
          <p className="text-sm text-muted-foreground">서로의 짐을 지는 다락방</p>
        </div>
      </div>

      <div role="tablist" aria-label="게시판 선택" className="grid grid-cols-2 rounded-2xl bg-muted p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls="feed-panel"
            onClick={() => setActive(t.id)}
            className={cn(
              'rounded-xl py-2.5 text-sm font-medium transition',
              active === t.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul id="feed-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="flex flex-col gap-3">
        {feed.map((post) => (
          <FeedCard key={post.id} post={post} onEdit={setEditing} />
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        className="fixed right-[max(1.25rem,calc(50%-14rem+1.25rem))] bottom-24 z-20 flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition active:scale-95"
      >
        <PenLine className="size-4" aria-hidden />
        {active === 'prayer' ? '기도제목 나누기' : '묵상 나누기'}
      </button>

      <NewPostDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultType={active} onCreated={setActive} />
      <PostEditDialog post={editing} onOpenChange={(open) => !open && setEditing(null)} />
    </div>
  )
}

function FeedCard({ post, onEdit }: { post: FeedPost; onEdit: (post: FeedPost) => void }) {
  const { togglePray, canEditPost } = useApp()
  const author = members.find((m) => m.id === post.authorId) ?? members[0]
  const coAuthor = members.find((m) => m.id === post.coAuthorId)
  const editor = members.find((m) => m.id === post.editedBy)

  return (
    <li className="flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
      <div className="flex items-center gap-3">
        {coAuthor ? <CoupleAvatars members={[author, coAuthor]} /> : <MemberAvatar member={author} />}
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="flex items-center gap-1.5 text-sm font-medium">
            {coAuthor ? `${author.name} · ${coAuthor.name}` : author.name}
            {coAuthor && (
              <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                부부
              </span>
            )}
          </span>
          <span className="text-xs text-muted-foreground">
            {post.createdAt}
            {coAuthor && editor && ` · ${editor.name} 수정`}
          </span>
        </div>
        {canEditPost(post) && (
          <button
            type="button"
            onClick={() => onEdit(post)}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="수정하기"
          >
            <Pencil className="size-4" aria-hidden />
          </button>
        )}
      </div>
      {post.verse && (
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-highlight px-3 py-1 tracking-tight text-xs font-semibold text-accent-foreground">
          <BookMarked className="size-3.5" aria-hidden />
          {post.verse}
        </span>
      )}
      <p className="text-[15px] leading-relaxed whitespace-pre-line text-pretty">{post.content}</p>
      <div className="flex items-center justify-between border-t pt-3">
        <button
          type="button"
          onClick={() => togglePray(post.id)}
          aria-pressed={post.prayedByMe}
          className={cn(
            'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition active:scale-95',
            post.prayedByMe
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
          )}
        >
          <HandHeart className={cn('size-4', post.prayedByMe && 'animate-in zoom-in-50')} aria-hidden />
          {post.type === 'prayer' ? '함께 기도해요' : '아멘'}
          <span className="tabular-nums">{post.prayCount}</span>
        </button>
        <span className="text-xs text-muted-foreground">
          {post.prayedByMe ? (post.type === 'prayer' ? '기도하고 있어요' : '공감했어요') : ''}
        </span>
      </div>
    </li>
  )
}

function NewPostDialog({
  open,
  onOpenChange,
  defaultType,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultType: FeedType
  onCreated: (type: FeedType) => void
}) {
  const { addPost, spouse, me } = useApp()
  const [type, setType] = useState<FeedType>(defaultType)
  const [together, setTogether] = useState(true)
  const asCouple = type === 'prayer' && !!spouse && together

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) setType(defaultType)
        onOpenChange(next)
      }}
    >
      <DialogContent className="gap-4 rounded-2xl bg-card p-5" key={String(open) + defaultType}>
        <DialogHeader>
          <DialogTitle className="tracking-tight text-lg">새 글 나누기</DialogTitle>
          <DialogDescription>다락방 멤버들에게만 공개돼요.</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            const data = new FormData(e.currentTarget)
            const content = String(data.get('content')).trim()
            if (!content) return
            const verse = String(data.get('verse') ?? '').trim()
            addPost({
              type,
              content,
              verse: type === 'meditation' && verse ? verse : undefined,
              coAuthorId: asCouple ? spouse?.id : undefined,
            })
            onCreated(type)
            onOpenChange(false)
          }}
        >
          <div role="radiogroup" aria-label="글 종류" className="grid grid-cols-2 gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={type === t.id}
                onClick={() => setType(t.id)}
                className={cn(
                  'rounded-xl border py-2.5 text-sm font-medium transition',
                  type === t.id ? 'border-primary bg-secondary text-secondary-foreground' : 'text-muted-foreground',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          {type === 'prayer' && spouse && (
            <button
              type="button"
              role="switch"
              aria-checked={together}
              onClick={() => setTogether((v) => !v)}
              className={cn(
                'flex items-center gap-3 rounded-xl border p-3 text-left transition',
                together ? 'border-primary bg-secondary text-secondary-foreground' : 'text-muted-foreground',
              )}
            >
              <CoupleAvatars members={[me, spouse]} size="sm" ringClassName="ring-background" />
              <span className="flex flex-1 flex-col">
                <span className="text-sm font-medium">{spouse.name}님과 함께 쓰기</span>
                <span className="text-xs opacity-80">부부 모두 수정할 수 있어요</span>
              </span>
              <span className={cn('h-5 w-9 shrink-0 rounded-full p-0.5 transition', together ? 'bg-primary' : 'bg-muted')}>
                <span className={cn('block size-4 rounded-full bg-card shadow transition', together && 'translate-x-4')} />
              </span>
            </button>
          )}
          {type === 'meditation' && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="post-verse">오늘의 말씀</Label>
              <Input id="post-verse" name="verse" placeholder="예) 빌립보서 4:6" className="h-11 rounded-xl bg-background" />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="post-content">{type === 'prayer' ? '기도제목' : '묵상 내용'}</Label>
            <Textarea
              id="post-content"
              name="content"
              required
              rows={5}
              placeholder={
                type === 'prayer'
                  ? '함께 기도해 주었으면 하는 제목을 나눠주세요.'
                  : '말씀을 통해 받은 은혜와 적용을 나눠주세요.'
              }
              className="rounded-xl bg-background text-base leading-relaxed"
            />
          </div>
          <Button type="submit" className="h-11 rounded-xl">
            나누기
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

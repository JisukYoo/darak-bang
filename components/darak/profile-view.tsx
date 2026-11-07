'use client'

import { useState } from 'react'
import { Bookmark, ChevronRight, Church, HandHeart, Heart, LogOut, Pencil, Users } from 'lucide-react'
import { type FeedPost, members } from '@/lib/darak-data'
import { useApp } from './app-provider'
import { CoupleAvatars, MemberAvatar } from './member-avatar'
import { PostEditDialog } from './post-edit-dialog'
import { PrayingDialog } from './praying-dialog'

export function ProfileView() {
  const { church, group, bookmarks, posts, selectChurch, setTab, setProfileView, me, spouse } = useApp()
  const [editing, setEditing] = useState<FeedPost | null>(null)
  const [prayingOpen, setPrayingOpen] = useState(false)
  const myPrayers = posts.filter((p) => p.prayedByMe).length
  const couplePrayers = spouse
    ? posts.filter((p) => p.type === 'prayer' && p.coAuthorId && [p.authorId, p.coAuthorId].includes(me.id))
    : []

  return (
    <div className="flex flex-col gap-6 px-5 pt-2 pb-8">
      <section className="flex items-center gap-4">
        {spouse ? (
          <CoupleAvatars members={[me, spouse]} size="lg" ringClassName="ring-background" />
        ) : (
          <MemberAvatar member={me} className="size-16 text-xl" />
        )}
        <div className="flex flex-col">
          <h1 className="tracking-tight text-2xl font-semibold">{me.name}</h1>
          <p className="text-sm text-muted-foreground">
            {group?.name} · {me.role}
          </p>
          {spouse && (
            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-primary">
              <Heart className="size-3" aria-hidden />
              {spouse.name}님과 부부
            </p>
          )}
        </div>
      </section>

      {spouse && (
        <section aria-labelledby="couple-title" className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 id="couple-title" className="tracking-tight text-lg font-semibold">
              우리 부부 기도제목
            </h2>
            <span className="text-xs text-muted-foreground">둘 다 수정할 수 있어요</span>
          </div>
          {couplePrayers.length ? (
            <ul className="flex flex-col gap-2">
              {couplePrayers.map((p) => {
                const editor = members.find((m) => m.id === p.editedBy)
                return (
                  <li key={p.id} className="flex flex-col gap-2 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
                    <p className="text-[15px] leading-relaxed whitespace-pre-line text-pretty">{p.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {p.createdAt}
                        {editor && ` · ${editor.name} 수정`}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditing(p)}
                        className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground"
                      >
                        <Pencil className="size-3" aria-hidden />
                        수정
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <button
              type="button"
              onClick={() => setTab('prayer')}
              className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground"
            >
              {spouse.name}님과 함께 기도제목을 나눠 보세요
            </button>
          )}
        </section>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setPrayingOpen(true)}
          className="flex flex-col gap-1 rounded-2xl bg-card p-4 text-left shadow-sm ring-1 ring-border transition active:scale-[0.98]"
        >
          <span className="flex w-full items-center gap-1.5 text-xs text-muted-foreground">
            <HandHeart className="size-3.5" aria-hidden />함께 기도 중
            <ChevronRight className="ml-auto size-3.5" aria-hidden />
          </span>
          <span className="text-xl font-semibold">{myPrayers}개</span>
        </button>
        <button
          type="button"
          onClick={() => setProfileView('saved')}
          className="flex flex-col gap-1 rounded-2xl bg-card p-4 text-left shadow-sm ring-1 ring-border transition active:scale-[0.98]"
        >
          <span className="flex w-full items-center gap-1.5 text-xs text-muted-foreground">
            <Bookmark className="size-3.5" aria-hidden />저장한 말씀
            <ChevronRight className="ml-auto size-3.5" aria-hidden />
          </span>
          <span className="text-xl font-semibold">{bookmarks.length}구절</span>
        </button>
      </div>

      <section aria-label="소속" className="flex flex-col divide-y overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border">
        <div className="flex items-center gap-3 p-4 text-sm">
          <Church className="size-4 text-muted-foreground" aria-hidden />
          <span className="flex-1">{church?.name}</span>
          <span className="text-muted-foreground">{church?.location}</span>
        </div>
        <div className="flex items-center gap-3 p-4 text-sm">
          <Users className="size-4 text-muted-foreground" aria-hidden />
          <span className="flex-1">{group?.name}</span>
          <span className="text-muted-foreground">{group?.memberCount}명</span>
        </div>
        <button
          type="button"
          onClick={() => selectChurch(null)}
          className="flex items-center gap-3 p-4 text-left text-sm text-destructive"
        >
          <LogOut className="size-4" aria-hidden />
          다른 교회 · 다락방으로 변경
        </button>
      </section>
      <PostEditDialog post={editing} onOpenChange={(open) => !open && setEditing(null)} />
      <PrayingDialog open={prayingOpen} onOpenChange={setPrayingOpen} />
    </div>
  )
}

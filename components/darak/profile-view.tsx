'use client'

import { Bookmark, Church, HandHeart, LogOut, Users } from 'lucide-react'
import { bibleBooks, bibleText, members } from '@/lib/darak-data'
import { useApp } from './app-provider'
import { MemberAvatar } from './member-avatar'

export function ProfileView() {
  const { church, group, bookmarks, posts, selectChurch, setTab } = useApp()
  const me = members[0]
  const myPrayers = posts.filter((p) => p.prayedByMe).length

  const savedVerses = bookmarks.map((key) => {
    const [bookId, ch, v] = key.split('-')
    const book = bibleBooks.find((b) => b.id === bookId)
    return { key, ref: `${book?.name} ${ch}:${v}`, text: bibleText[`${bookId}-${ch}`]?.[Number(v) - 1] }
  })

  return (
    <div className="flex flex-col gap-6 px-5 pt-2 pb-8">
      <section className="flex items-center gap-4">
        <MemberAvatar member={me} className="size-16 text-xl" />
        <div className="flex flex-col">
          <h1 className="tracking-tight text-2xl font-semibold">{me.name}</h1>
          <p className="text-sm text-muted-foreground">
            {group?.name} · {me.role}
          </p>
        </div>
      </section>

      <dl className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
          <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <HandHeart className="size-3.5" aria-hidden />함께 기도 중
          </dt>
          <dd className="text-xl font-semibold">{myPrayers}개</dd>
        </div>
        <div className="flex flex-col gap-1 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
          <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Bookmark className="size-3.5" aria-hidden />저장한 말씀
          </dt>
          <dd className="text-xl font-semibold">{bookmarks.length}구절</dd>
        </div>
      </dl>

      <section aria-labelledby="saved-title" className="flex flex-col gap-3">
        <h2 id="saved-title" className="tracking-tight text-lg font-semibold">
          저장한 말씀
        </h2>
        {savedVerses.length ? (
          <ul className="flex flex-col gap-2">
            {savedVerses.map((v) => (
              <li key={v.key} className="flex flex-col gap-1 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
                <span className="text-xs font-semibold text-primary">{v.ref}</span>
                <p className="tracking-tight text-[15px] leading-relaxed">{v.text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <button
            type="button"
            onClick={() => setTab('bible')}
            className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground"
          >
            성경을 읽으며 마음에 남는 구절을 저장해 보세요
          </button>
        )}
      </section>

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
    </div>
  )
}

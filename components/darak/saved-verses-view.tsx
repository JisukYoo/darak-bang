'use client'

import { BookmarkX, ChevronLeft } from 'lucide-react'
import { bibleBooks, bibleText } from '@/lib/darak-data'
import { useApp } from './app-provider'

export function useSavedVerses() {
  const { bookmarks } = useApp()
  return bookmarks.map((key) => {
    const [bookId, ch, v] = key.split('-')
    const book = bibleBooks.find((b) => b.id === bookId)
    return { key, ref: `${book?.name} ${ch}:${v}`, text: bibleText[`${bookId}-${ch}`]?.[Number(v) - 1] }
  })
}

export function SavedVersesView() {
  const { setProfileView, setTab, toggleBookmark } = useApp()
  const verses = useSavedVerses()

  return (
    <div className="flex flex-col gap-5 px-5 pt-2 pb-8">
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setProfileView('main')}
          className="-ml-1 flex w-fit items-center gap-0.5 text-sm font-medium text-muted-foreground"
        >
          <ChevronLeft className="size-4" aria-hidden />내 정보
        </button>
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">저장한 말씀</h1>
          <span className="text-sm text-muted-foreground">{verses.length}구절</span>
        </div>
      </div>

      {verses.length ? (
        <ul className="flex flex-col gap-2">
          {verses.map((v) => (
            <li key={v.key} className="flex flex-col gap-2 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">{v.ref}</span>
                <button
                  type="button"
                  onClick={() => toggleBookmark(v.key)}
                  aria-label={`${v.ref} 저장 해제`}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary"
                >
                  <BookmarkX className="size-4" aria-hidden />
                </button>
              </div>
              <p className="text-[15px] leading-relaxed text-pretty">{v.text}</p>
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
    </div>
  )
}

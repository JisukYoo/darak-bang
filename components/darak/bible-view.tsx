'use client'

import { useMemo, useState } from 'react'
import { Bookmark, ChevronLeft, ChevronRight, Copy, Highlighter, Search, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { bibleBooks, bibleText } from '@/lib/darak-data'
import { useApp } from './app-provider'

export function BibleView() {
  const { bookmarks, toggleBookmark, highlights, toggleHighlight } = useApp()
  const [bookId, setBookId] = useState('jhn')
  const [chapter, setChapter] = useState(15)
  const [selected, setSelected] = useState<number | null>(null)
  const [query, setQuery] = useState('')
  const [chapterPickerOpen, setChapterPickerOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const book = bibleBooks.find((b) => b.id === bookId)!
  const chapterKey = `${bookId}-${chapter}`
  const verses = bibleText[chapterKey]

  const results = useMemo(() => {
    const q = query.trim()
    if (q.length < 1) return []
    return Object.entries(bibleText).flatMap(([key, list]) => {
      const [bId, ch] = key.split('-')
      const b = bibleBooks.find((x) => x.id === bId)!
      return list
        .map((text, i) => ({ key, bookId: bId, chapter: Number(ch), verse: i + 1, text, ref: `${b.name} ${ch}:${i + 1}` }))
        .filter((r) => r.text.includes(q) || r.ref.includes(q))
    })
  }, [query])

  const goTo = (nextBook: string, nextChapter: number, verse?: number) => {
    setBookId(nextBook)
    setChapter(nextChapter)
    setSelected(verse ?? null)
    setQuery('')
  }

  const selectedKey = selected ? `${chapterKey}-${selected}` : null

  return (
    <div className="flex flex-col gap-4 pt-2 pb-8">
      <div className="flex flex-col gap-3 px-5">
        <h1 className="tracking-tight text-2xl font-semibold">성경</h1>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="키워드 또는 구절 검색 (예: 평강, 요한복음 3)"
            aria-label="성경 검색"
            className="h-12 rounded-xl bg-card pl-11 text-base"
          />
        </div>
      </div>

      {query.trim() ? (
        <section aria-label="검색 결과" className="flex flex-col gap-2 px-5">
          <p className="text-sm text-muted-foreground">
            검색 결과 <span className="font-semibold text-foreground">{results.length}</span>건
          </p>
          <ul className="flex flex-col gap-2">
            {results.map((r) => (
              <li key={`${r.key}-${r.verse}`}>
                <button
                  type="button"
                  onClick={() => goTo(r.bookId, r.chapter, r.verse)}
                  className="flex w-full flex-col gap-1 rounded-2xl bg-card p-4 text-left shadow-sm ring-1 ring-border transition hover:ring-primary/40"
                >
                  <span className="text-xs font-semibold text-primary">{r.ref}</span>
                  <span className="tracking-tight text-[15px] leading-relaxed">{r.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]" role="tablist" aria-label="성경 선택">
            {bibleBooks.map((b) => (
              <button
                key={b.id}
                type="button"
                role="tab"
                aria-selected={b.id === bookId}
                onClick={() => goTo(b.id, b.id === 'psa' ? 23 : b.id === 'jhn' ? 15 : b.id === 'php' ? 4 : 1)}
                className={cn(
                  'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition',
                  b.id === bookId ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground ring-1 ring-border',
                )}
              >
                {b.name}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between px-5">
            <button
              type="button"
              onClick={() => chapter > 1 && goTo(bookId, chapter - 1)}
              disabled={chapter <= 1}
              className="flex size-9 items-center justify-center rounded-full bg-card ring-1 ring-border disabled:opacity-40"
              aria-label="이전 장"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setChapterPickerOpen(true)}
              className="flex flex-col items-center rounded-xl px-4 py-1"
              aria-haspopup="dialog"
            >
              <span className="text-xs text-muted-foreground">{book.testament} · 개역한글</span>
              <span className="tracking-tight text-xl font-semibold">
                {book.name} {chapter}장
              </span>
            </button>
            <button
              type="button"
              onClick={() => chapter < book.chapters && goTo(bookId, chapter + 1)}
              disabled={chapter >= book.chapters}
              className="flex size-9 items-center justify-center rounded-full bg-card ring-1 ring-border disabled:opacity-40"
              aria-label="다음 장"
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>

          <article className="mx-5 rounded-3xl bg-card px-5 py-6 shadow-sm ring-1 ring-border">
            {verses ? (
              <ol className="flex flex-col gap-1">
                {verses.map((text, i) => {
                  const n = i + 1
                  const key = `${chapterKey}-${n}`
                  const isSelected = selected === n
                  const isHighlighted = highlights.includes(key)
                  const isBookmarked = bookmarks.includes(key)
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        onClick={() => setSelected(isSelected ? null : n)}
                        aria-pressed={isSelected}
                        className={cn(
                          'flex w-full gap-3 rounded-lg px-2 py-1.5 text-left tracking-tight text-[17px] leading-loose transition-colors',
                          isHighlighted && 'bg-highlight/70',
                          isSelected && 'ring-2 ring-primary/50',
                        )}
                      >
                        <sup className="mt-3 w-4 shrink-0 font-sans text-[11px] font-semibold text-primary">{n}</sup>
                        <span className="flex-1 text-pretty">
                          {text}
                          {isBookmarked && (
                            <Bookmark className="ml-1 inline size-3.5 fill-accent text-accent" aria-label="북마크됨" />
                          )}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ol>
            ) : (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <p className="tracking-tight text-lg">본문을 준비 중이에요</p>
                <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                  미리보기에서는 창세기 1장, 시편 23장, 요한복음 3·15장, 빌립보서 4장을 읽을 수 있어요.
                </p>
              </div>
            )}
          </article>
        </>
      )}

      {selectedKey && !query.trim() && (
        <div
          role="toolbar"
          aria-label="구절 작업"
          className="sticky bottom-20 z-20 mx-5 flex items-center gap-1 rounded-2xl bg-foreground p-1.5 text-background shadow-lg animate-in fade-in-0 slide-in-from-bottom-2"
        >
          <span className="px-3 text-sm font-medium">
            {book.name} {chapter}:{selected}
          </span>
          <div className="ml-auto flex items-center gap-1">
            <ToolbarButton
              label={highlights.includes(selectedKey) ? '형광펜 해제' : '형광펜'}
              active={highlights.includes(selectedKey)}
              onClick={() => toggleHighlight(selectedKey)}
            >
              <Highlighter className="size-4" aria-hidden />
            </ToolbarButton>
            <ToolbarButton
              label={bookmarks.includes(selectedKey) ? '북마크 해제' : '북마크'}
              active={bookmarks.includes(selectedKey)}
              onClick={() => toggleBookmark(selectedKey)}
            >
              <Bookmark className="size-4" aria-hidden />
            </ToolbarButton>
            <ToolbarButton
              label={copied ? '복사됨' : '복사'}
              onClick={() => {
                navigator.clipboard?.writeText(`${verses?.[selected! - 1]} (${book.name} ${chapter}:${selected})`)
                setCopied(true)
                setTimeout(() => setCopied(false), 1500)
              }}
            >
              <Copy className="size-4" aria-hidden />
            </ToolbarButton>
            <ToolbarButton label="닫기" onClick={() => setSelected(null)}>
              <X className="size-4" aria-hidden />
            </ToolbarButton>
          </div>
        </div>
      )}

      <Dialog open={chapterPickerOpen} onOpenChange={setChapterPickerOpen}>
        <DialogContent className="max-h-[80dvh] gap-4 overflow-y-auto rounded-2xl bg-card p-5">
          <DialogHeader>
            <DialogTitle className="tracking-tight text-lg">{book.name} · 장 선택</DialogTitle>
          </DialogHeader>
          <ul className="grid grid-cols-6 gap-2">
            {Array.from({ length: book.chapters }, (_, i) => i + 1).map((n) => {
              const available = Boolean(bibleText[`${bookId}-${n}`])
              return (
                <li key={n}>
                  <button
                    type="button"
                    onClick={() => {
                      goTo(bookId, n)
                      setChapterPickerOpen(false)
                    }}
                    className={cn(
                      'flex aspect-square w-full items-center justify-center rounded-lg text-sm transition',
                      n === chapter
                        ? 'bg-primary font-semibold text-primary-foreground'
                        : available
                          ? 'bg-secondary font-medium text-secondary-foreground'
                          : 'bg-muted text-muted-foreground hover:text-foreground',
                    )}
                    aria-label={`${n}장${available ? ' (본문 있음)' : ''}`}
                  >
                    {n}
                  </button>
                </li>
              )
            })}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ToolbarButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string
  active?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'flex size-9 items-center justify-center rounded-xl transition',
        active ? 'bg-accent text-accent-foreground' : 'hover:bg-background/15',
      )}
    >
      {children}
    </button>
  )
}

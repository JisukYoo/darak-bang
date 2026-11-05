'use client'

import { useState } from 'react'
import { BookMarked, ChevronDown } from 'lucide-react'
import { allBibleBooks, formatVerseRef } from '@/lib/bible-books'
import { cn } from '@/lib/utils'

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1)

export function VersePicker({ name = 'verse' }: { name?: string }) {
  const [bookIndex, setBookIndex] = useState(0)
  const [chapter, setChapter] = useState(1)
  const [verse, setVerse] = useState(1)
  const [endVerse, setEndVerse] = useState(0)

  const book = allBibleBooks[bookIndex]
  const verseCount = book.verses[chapter - 1] ?? 1
  const reference = formatVerseRef(book.name, chapter, verse, endVerse || undefined)

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1.5 text-sm font-medium">오늘의 말씀</legend>
      <div className="grid grid-cols-[1.6fr_1fr_1fr] gap-2">
        <PickerSelect
          label="성경"
          value={bookIndex}
          onChange={(i) => {
            setBookIndex(i)
            setChapter(1)
            setVerse(1)
            setEndVerse(0)
          }}
        >
          {(['구약', '신약'] as const).map((t) => (
            <optgroup key={t} label={t}>
              {allBibleBooks.map((b, i) =>
                b.testament === t ? (
                  <option key={b.name} value={i}>
                    {b.name}
                  </option>
                ) : null,
              )}
            </optgroup>
          ))}
        </PickerSelect>
        <PickerSelect
          label="장"
          value={chapter}
          onChange={(c) => {
            setChapter(c)
            setVerse(1)
            setEndVerse(0)
          }}
        >
          {range(book.verses.length).map((c) => (
            <option key={c} value={c}>
              {c}장
            </option>
          ))}
        </PickerSelect>
        <PickerSelect
          label="절"
          value={verse}
          onChange={(n) => {
            setVerse(n)
            if (endVerse && endVerse <= n) setEndVerse(0)
          }}
        >
          {range(verseCount).map((n) => (
            <option key={n} value={n}>
              {n}절
            </option>
          ))}
        </PickerSelect>
      </div>
      <div className="flex items-center gap-2">
        <PickerSelect label="끝 절 (선택)" value={endVerse} onChange={setEndVerse} className="flex-1">
          <option value={0}>한 절만</option>
          {range(verseCount)
            .filter((n) => n > verse)
            .map((n) => (
              <option key={n} value={n}>
                {n}절까지
              </option>
            ))}
        </PickerSelect>
        <output
          aria-live="polite"
          className="flex min-w-0 flex-1 items-center gap-1.5 self-end rounded-xl bg-highlight px-3 py-2.5 text-sm font-semibold text-accent-foreground"
        >
          <BookMarked className="size-4 shrink-0" aria-hidden />
          <span className="truncate">{reference}</span>
        </output>
      </div>
      <input type="hidden" name={name} value={reference} />
    </fieldset>
  )
}

function PickerSelect({
  label,
  value,
  onChange,
  children,
  className,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={cn('flex min-w-0 flex-col gap-1', className)}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-11 w-full appearance-none rounded-xl border border-input bg-background pr-8 pl-3 text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
      </span>
    </label>
  )
}

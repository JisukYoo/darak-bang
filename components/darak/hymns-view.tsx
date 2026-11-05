'use client'

import { useState } from 'react'
import { ArrowLeft, Link2, Music2, Play, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { type Hymn, parseYouTubeId, presetHymns, thumbnailUrl } from '@/lib/hymns'
import { useApp } from './app-provider'

export function HymnsView() {
  const { setHomeView } = useApp()
  const [hymns, setHymns] = useState<Hymn[]>(presetHymns)
  const [currentId, setCurrentId] = useState(presetHymns[0].id)
  const current = hymns.find((h) => h.id === currentId) ?? hymns[0]

  function addHymn(hymn: Hymn) {
    setHymns((prev) => [hymn, ...prev])
    setCurrentId(hymn.id)
  }

  function removeHymn(id: string) {
    setHymns((prev) => {
      const next = prev.filter((h) => h.id !== id)
      if (id === currentId && next[0]) setCurrentId(next[0].id)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-5 px-5 pt-2 pb-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setHomeView('dashboard')}
          className="flex size-9 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-border"
          aria-label="홈으로 돌아가기"
        >
          <ArrowLeft className="size-4" aria-hidden />
        </button>
        <div>
          <h1 className="tracking-tight text-xl font-semibold">찬양</h1>
          <p className="text-xs text-muted-foreground">이번 주 모임에서 함께 부를 곡</p>
        </div>
      </div>

      {current && <Player hymn={current} />}

      <AddLinkForm onAdd={addHymn} />

      <section aria-labelledby="playlist-title" className="flex flex-col gap-3">
        <h2 id="playlist-title" className="tracking-tight text-lg font-semibold">
          찬양 목록 <span className="text-sm font-normal text-muted-foreground">{hymns.length}곡</span>
        </h2>
        <ul className="flex flex-col gap-2">
          {hymns.map((hymn) => {
            const active = hymn.id === current?.id
            return (
              <li
                key={hymn.id}
                className={cn(
                  'flex items-center gap-3 rounded-2xl p-2 pr-3 ring-1 transition-colors',
                  active ? 'bg-secondary ring-primary/40' : 'bg-card ring-border',
                )}
              >
                <button
                  type="button"
                  onClick={() => setCurrentId(hymn.id)}
                  aria-current={active ? 'true' : undefined}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumbnailUrl(hymn.videoId)} alt="" className="size-full object-cover" loading="lazy" />
                    <span className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                      <span className="flex size-7 items-center justify-center rounded-full bg-card/90 text-foreground">
                        {active ? <Music2 className="size-3.5" aria-hidden /> : <Play className="size-3.5 fill-current" aria-hidden />}
                      </span>
                    </span>
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-xs font-medium text-primary">
                      {hymn.number ? `새찬송가 ${hymn.number}장` : '추가한 링크'}
                    </span>
                    <span className="truncate font-medium">{hymn.title}</span>
                    {active && <span className="text-xs text-muted-foreground">재생 중</span>}
                  </span>
                </button>
                {hymn.custom && (
                  <button
                    type="button"
                    onClick={() => removeHymn(hymn.id)}
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label={`${hymn.title} 삭제`}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

function Player({ hymn }: { hymn: Hymn }) {
  return (
    <section aria-label="찬양 플레이어" className="flex flex-col gap-3">
      <div className="aspect-video w-full overflow-hidden rounded-3xl bg-foreground shadow-md">
        <iframe
          key={hymn.videoId}
          src={`https://www.youtube-nocookie.com/embed/${hymn.videoId}?rel=0&playsinline=1`}
          title={hymn.title}
          className="size-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <div className="flex flex-col gap-0.5 px-1">
        <p className="text-xs font-medium text-primary">{hymn.number ? `새찬송가 ${hymn.number}장` : 'YouTube'}</p>
        <p className="text-lg font-semibold tracking-tight text-pretty">{hymn.title}</p>
      </div>
    </section>
  )
}

function AddLinkForm({ onAdd }: { onAdd: (hymn: Hymn) => void }) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const videoId = parseYouTubeId(url)
    if (!videoId) {
      setError('올바른 유튜브 링크를 입력해주세요.')
      return
    }
    onAdd({
      id: `custom-${videoId}-${Date.now()}`,
      title: title.trim() || '새로 추가한 찬양',
      videoId,
      custom: true,
    })
    setUrl('')
    setTitle('')
    setError(null)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-2xl bg-card p-4 ring-1 ring-border">
      <div className="flex items-center gap-2">
        <Link2 className="size-4 text-primary" aria-hidden />
        <h2 className="text-sm font-semibold">유튜브 링크로 추가하기</h2>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="hymn-url" className="sr-only">
          유튜브 링크
        </label>
        <input
          id="hymn-url"
          type="url"
          inputMode="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            setError(null)
          }}
          placeholder="https://youtu.be/..."
          aria-invalid={!!error}
          aria-describedby={error ? 'hymn-url-error' : undefined}
          className="h-11 rounded-xl bg-background px-3 text-sm ring-1 ring-border outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
          required
        />
        {error && (
          <p id="hymn-url-error" className="text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <label htmlFor="hymn-title" className="sr-only">
          곡 제목
        </label>
        <input
          id="hymn-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="곡 제목 (선택)"
          className="h-11 min-w-0 flex-1 rounded-xl bg-background px-3 text-sm ring-1 ring-border outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
        />
        <Button type="submit" className="h-11 rounded-xl px-4">
          <Plus className="size-4" aria-hidden />
          추가
        </Button>
      </div>
    </form>
  )
}

'use client'

import { useState } from 'react'
import { ArrowLeft, Check, Copy, MapPin, MessageCircle, Pin, SendHorizontal, Trash2 } from 'lucide-react'
import { members } from '@/lib/darak-data'
import { useApp } from './app-provider'
import { MemberAvatar } from './member-avatar'

export function NoticeDetailView() {
  const { activeNotice: notice, comments, setHomeView } = useApp()

  if (!notice) {
    return (
      <div className="flex flex-col items-center gap-3 px-5 py-16 text-center text-sm text-muted-foreground">
        공지를 찾을 수 없어요
        <button type="button" onClick={() => setHomeView('dashboard')} className="font-medium text-primary">
          홈으로
        </button>
      </div>
    )
  }

  const author = members.find((m) => m.id === notice.authorId) ?? members[0]
  const thread = comments.filter((c) => c.noticeId === notice.id)

  return (
    <div className="flex flex-col gap-5 px-5 pt-2 pb-8">
      <button
        type="button"
        onClick={() => setHomeView('dashboard')}
        className="flex size-9 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-border"
        aria-label="홈으로 돌아가기"
      >
        <ArrowLeft className="size-4" aria-hidden />
      </button>

      <article className="flex flex-col gap-4">
        <header className="flex flex-col gap-3">
          {notice.pinned && (
            <span className="flex w-fit items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
              <Pin className="size-3" aria-hidden />
              고정 공지
            </span>
          )}
          <h1 className="text-2xl font-semibold tracking-tight text-balance">{notice.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MemberAvatar member={author} size="sm" />
            <span className="font-medium text-foreground">{author.name}</span>
            {author.role && <span>{author.role}</span>}
            <span aria-hidden>·</span>
            <span>{notice.date}</span>
          </div>
        </header>

        <p className="text-[15px] leading-relaxed whitespace-pre-line text-pretty">{notice.body}</p>

        {notice.address && <AddressCard address={notice.address} />}
      </article>

      <CommentThread noticeId={notice.id} prompt={notice.commentPrompt} thread={thread} />
    </div>
  )
}

function AddressCard({ address }: { address: string }) {
  const [copied, setCopied] = useState(false)
  const query = encodeURIComponent(address)

  return (
    <section aria-label="모임 장소" className="flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          <MapPin className="size-4" aria-hidden />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">모이는 곳</span>
          <span className="text-sm font-medium text-pretty">{address}</span>
        </div>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard?.writeText(address)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }}
          className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs font-medium"
        >
          {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
          {copied ? '복사됨' : '복사'}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <a
          href={`https://map.naver.com/p/search/${query}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-muted py-2.5 text-center text-sm font-medium transition hover:bg-secondary"
        >
          네이버 지도
        </a>
        <a
          href={`https://map.kakao.com/link/search/${query}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-muted py-2.5 text-center text-sm font-medium transition hover:bg-secondary"
        >
          카카오맵
        </a>
      </div>
    </section>
  )
}

function CommentThread({
  noticeId,
  prompt,
  thread,
}: {
  noticeId: string
  prompt?: string
  thread: ReturnType<typeof useApp>['comments']
}) {
  const { me, addComment, deleteComment } = useApp()
  const [draft, setDraft] = useState('')

  const submit = () => {
    const content = draft.trim()
    if (!content) return
    addComment(noticeId, content)
    setDraft('')
  }

  return (
    <section aria-labelledby="comments-title" className="flex flex-col gap-3 border-t pt-5">
      <h2 id="comments-title" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
        <MessageCircle className="size-5" aria-hidden />
        댓글 <span className="text-primary tabular-nums">{thread.length}</span>
      </h2>

      {prompt && (
        <p className="rounded-xl bg-highlight/60 px-4 py-3 text-sm font-medium text-accent-foreground">
          {'리더 요청 · '}
          {prompt}
        </p>
      )}

      {thread.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {thread.map((c) => {
            const author = members.find((m) => m.id === c.authorId) ?? members[0]
            const mine = c.authorId === me.id
            return (
              <li key={c.id} className="flex gap-3">
                <MemberAvatar member={author} size="sm" className="mt-0.5" />
                <div className="flex min-w-0 flex-1 flex-col gap-1 rounded-2xl rounded-tl-sm bg-card px-3.5 py-2.5 ring-1 ring-border">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold">{author.name}</span>
                    <span className="text-muted-foreground">{c.createdAt}</span>
                    {mine && (
                      <button
                        type="button"
                        onClick={() => deleteComment(c.id)}
                        className="ml-auto text-muted-foreground hover:text-destructive"
                        aria-label="댓글 삭제"
                      >
                        <Trash2 className="size-3.5" aria-hidden />
                      </button>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-pretty break-words">{c.content}</p>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="py-4 text-center text-sm text-muted-foreground">첫 댓글을 남겨주세요</p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        className="sticky bottom-20 flex items-end gap-2 rounded-2xl bg-card p-2 shadow-md ring-1 ring-border"
      >
        <label htmlFor="comment-input" className="sr-only">
          댓글 입력
        </label>
        <textarea
          id="comment-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' || e.shiftKey) return
            if (e.nativeEvent.isComposing || e.keyCode === 229) return
            e.preventDefault()
            submit()
          }}
          rows={1}
          placeholder={prompt ?? '댓글을 남겨주세요'}
          className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition disabled:opacity-40"
          aria-label="댓글 등록"
        >
          <SendHorizontal className="size-4" aria-hidden />
        </button>
      </form>
    </section>
  )
}

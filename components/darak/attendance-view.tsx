'use client'

import { useState } from 'react'
import { ArrowLeft, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { type AttendanceStatus, members } from '@/lib/darak-data'
import { useApp } from './app-provider'
import { MemberAvatar } from './member-avatar'

const options: { value: Exclude<AttendanceStatus, 'unmarked'>; label: string; active: string }[] = [
  { value: 'present', label: '출석', active: 'bg-primary text-primary-foreground' },
  { value: 'online', label: '온라인·지각', active: 'bg-accent text-accent-foreground' },
  { value: 'absent', label: '결석', active: 'bg-foreground/80 text-background' },
]

export function AttendanceView() {
  const { attendance, setAttendance, markAll, setHomeView, group } = useApp()
  const [saved, setSaved] = useState(false)

  const total = members.length
  const counts = {
    present: members.filter((m) => attendance[m.id] === 'present').length,
    online: members.filter((m) => attendance[m.id] === 'online').length,
    absent: members.filter((m) => attendance[m.id] === 'absent').length,
  }
  const attended = counts.present + counts.online
  const percent = Math.round((attended / total) * 100)

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
          <h1 className="font-serif text-xl font-semibold">출석체크</h1>
          <p className="text-xs text-muted-foreground">11월 7일 금요일 · {group?.name}</p>
        </div>
      </div>

      <section aria-label="출석 요약" className="flex flex-col gap-4 rounded-3xl bg-card p-5 shadow-sm ring-1 ring-border">
        <div className="flex items-end justify-between">
          <p className="text-sm leading-relaxed text-muted-foreground">
            오늘 <span className="font-serif text-3xl font-semibold text-foreground">{attended}</span>
            <span className="text-foreground"> / {total}명</span> 참석했어요
          </p>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-sm font-semibold text-secondary-foreground">
            {percent}%
          </span>
        </div>
        <div className="flex h-2.5 overflow-hidden rounded-full bg-muted" role="img" aria-label={`출석 ${counts.present}명, 온라인 또는 지각 ${counts.online}명, 결석 ${counts.absent}명`}>
          <span className="bg-primary transition-all" style={{ width: `${(counts.present / total) * 100}%` }} />
          <span className="bg-accent transition-all" style={{ width: `${(counts.online / total) * 100}%` }} />
        </div>
        <dl className="grid grid-cols-3 text-center text-xs text-muted-foreground">
          <div className="flex flex-col gap-0.5">
            <dt className="flex items-center justify-center gap-1.5">
              <span className="size-2 rounded-full bg-primary" aria-hidden />출석
            </dt>
            <dd className="text-base font-semibold text-foreground">{counts.present}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="flex items-center justify-center gap-1.5">
              <span className="size-2 rounded-full bg-accent" aria-hidden />온라인·지각
            </dt>
            <dd className="text-base font-semibold text-foreground">{counts.online}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="flex items-center justify-center gap-1.5">
              <span className="size-2 rounded-full bg-muted-foreground/40" aria-hidden />결석
            </dt>
            <dd className="text-base font-semibold text-foreground">{counts.absent}</dd>
          </div>
        </dl>
      </section>

      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold">멤버 {total}명</h2>
        <button
          type="button"
          onClick={() => markAll('present')}
          className="flex items-center gap-1.5 text-sm font-medium text-primary"
        >
          <CheckCheck className="size-4" aria-hidden />
          모두 출석
        </button>
      </div>

      <ul className="flex flex-col gap-2">
        {members.map((member) => {
          const status = attendance[member.id]
          return (
            <li key={member.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm ring-1 ring-border">
              <MemberAvatar member={member} />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">{member.name}</span>
                {member.role && <span className="text-xs text-muted-foreground">{member.role}</span>}
              </div>
              <div role="radiogroup" aria-label={`${member.name} 출석 상태`} className="flex gap-0.5 rounded-full bg-muted p-0.5">
                {options.map((opt) => {
                  const active = status === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => {
                        setAttendance(member.id, opt.value)
                        setSaved(false)
                      }}
                      className={cn(
                        'rounded-full px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
                        active ? opt.active : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {opt.value === 'online' ? '온라인' : opt.label}
                    </button>
                  )
                })}
              </div>
            </li>
          )
        })}
      </ul>

      <Button className="h-12 rounded-xl text-base" onClick={() => setSaved(true)}>
        {saved ? '저장되었어요' : '출석 저장하기'}
      </Button>
      <p className="sr-only" aria-live="polite">
        {saved ? '출석이 저장되었습니다' : ''}
      </p>
    </div>
  )
}

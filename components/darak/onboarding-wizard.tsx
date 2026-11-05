'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, Check, Church, MapPin, Plus, Search, Users, CalendarClock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useApp } from './app-provider'

export function OnboardingWizard() {
  const { churchId, selectChurch } = useApp()
  const step = churchId ? 2 : 1

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex flex-col gap-5 px-5 pt-8 pb-4">
        <div className="flex items-center justify-between">
          {step === 2 ? (
            <button
              type="button"
              onClick={() => selectChurch(null)}
              className="flex size-9 items-center justify-center rounded-full bg-card text-foreground shadow-sm ring-1 ring-border"
              aria-label="교회 선택으로 돌아가기"
            >
              <ArrowLeft className="size-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt=""
                width={40}
                height={40}
                priority
                className="size-10 rounded-xl"
              />
              <span className="tracking-tight text-lg font-semibold text-primary">다락방</span>
            </div>
          )}
          <StepIndicator step={step} />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-primary">{step}단계 / 2</p>
          <h1 className="tracking-tight text-2xl leading-snug font-semibold text-balance">
            {step === 1 ? '어느 교회에 출석하고 계신가요?' : '함께할 다락방을 선택해 주세요'}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            {step === 1
              ? '교회를 선택하면 해당 교회의 다락방 목록을 보여드려요.'
              : '이미 있는 다락방에 참여하거나, 새 다락방을 만들 수 있어요.'}
          </p>
        </div>
      </header>
      <div className="flex flex-1 flex-col px-5 pb-8">
        {step === 1 ? <ChurchStep /> : <GroupStep />}
      </div>
    </div>
  )
}

function StepIndicator({ step }: { step: number }) {
  return (
    <ol className="flex items-center gap-1.5" aria-label="진행 단계">
      {[1, 2].map((n) => (
        <li
          key={n}
          aria-current={n === step ? 'step' : undefined}
          className={cn(
            'h-1.5 rounded-full transition-all',
            n === step ? 'w-8 bg-primary' : n < step ? 'w-4 bg-primary/50' : 'w-4 bg-border',
          )}
        >
          <span className="sr-only">{n}단계</span>
        </li>
      ))}
    </ol>
  )
}

function ChurchStep() {
  const { churches, selectChurch, addChurch } = useApp()
  const [query, setQuery] = useState('')
  const [registering, setRegistering] = useState(false)

  const filtered = churches.filter(
    (c) => c.name.includes(query.trim()) || c.location.includes(query.trim()),
  )

  if (registering) {
    return (
      <form
        className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border"
        onSubmit={(e) => {
          e.preventDefault()
          const data = new FormData(e.currentTarget)
          const id = addChurch({
            name: String(data.get('name')),
            location: String(data.get('location')),
            denomination: String(data.get('denomination') || '교단 미입력'),
          })
          selectChurch(id)
        }}
      >
        <h2 className="tracking-tight text-lg font-semibold">새 교회 등록</h2>
        <Field id="church-name" name="name" label="교회 이름" placeholder="예) 은혜샘교회" required />
        <Field id="church-location" name="location" label="지역" placeholder="예) 서울 마포구" required />
        <Field id="church-denom" name="denomination" label="교단 (선택)" placeholder="예) 대한예수교장로회" />
        <div className="flex gap-2 pt-1">
          <Button type="button" variant="outline" className="h-11 flex-1 rounded-xl" onClick={() => setRegistering(false)}>
            취소
          </Button>
          <Button type="submit" className="h-11 flex-1 rounded-xl">
            등록하고 계속
          </Button>
        </div>
      </form>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="교회 이름 또는 지역 검색"
          aria-label="교회 검색"
          className="h-12 rounded-xl bg-card pl-11 text-base"
        />
      </div>

      <ul className="flex flex-col gap-2">
        {filtered.map((church) => (
          <li key={church.id}>
            <button
              type="button"
              onClick={() => selectChurch(church.id)}
              className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 text-left shadow-sm ring-1 ring-border transition hover:ring-primary/40 active:scale-[0.99]"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <Church className="size-5" aria-hidden />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-medium">{church.name}</span>
                <span className="truncate text-sm text-muted-foreground">
                  {church.location} · {church.denomination}
                </span>
              </span>
              <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
            </button>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            {'"'}{query}{'"'}에 해당하는 교회가 없어요.
          </li>
        )}
      </ul>

      <button
        type="button"
        onClick={() => setRegistering(true)}
        className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/40 p-4 text-sm font-medium text-primary transition hover:bg-secondary"
      >
        <Plus className="size-4" aria-hidden />
        찾는 교회가 없나요? 새 교회 등록
      </button>
    </div>
  )
}

function GroupStep() {
  const { church, churchId, groups, selectGroup, addGroup } = useApp()
  const [picked, setPicked] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const churchGroups = groups.filter((g) => g.churchId === churchId)

  if (creating) {
    return (
      <form
        className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border"
        onSubmit={(e) => {
          e.preventDefault()
          const data = new FormData(e.currentTarget)
          const id = addGroup({
            churchId: churchId!,
            name: String(data.get('name')),
            leader: String(data.get('leader')),
            schedule: String(data.get('schedule')),
            location: String(data.get('location')),
          })
          selectGroup(id)
        }}
      >
        <div className="flex flex-col gap-1">
          <h2 className="tracking-tight text-lg font-semibold">새 다락방 만들기</h2>
          <p className="text-sm text-muted-foreground">{church?.name}</p>
        </div>
        <Field id="g-name" name="name" label="다락방 이름" placeholder="예) 요셉 다락방" required />
        <Field id="g-leader" name="leader" label="리더" placeholder="예) 김은혜" required />
        <Field id="g-schedule" name="schedule" label="모임 일정" placeholder="예) ��주 금요일 오후 8시" required />
        <Field id="g-location" name="location" label="모임 장소" placeholder="예) 교육관 3층 다락방실" required />
        <div className="flex gap-2 pt-1">
          <Button type="button" variant="outline" className="h-11 flex-1 rounded-xl" onClick={() => setCreating(false)}>
            취소
          </Button>
          <Button type="submit" className="h-11 flex-1 rounded-xl">
            만들고 시작하기
          </Button>
        </div>
      </form>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm text-secondary-foreground">
        <Church className="size-4" aria-hidden />
        <span className="font-medium">{church?.name}</span>
        <span className="text-secondary-foreground/70">· {church?.location}</span>
      </div>

      <ul className="flex flex-col gap-2" role="radiogroup" aria-label="다락방 목록">
        {churchGroups.map((g) => {
          const active = picked === g.id
          return (
            <li key={g.id}>
              <button
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setPicked(g.id)}
                className={cn(
                  'flex w-full flex-col gap-2 rounded-2xl bg-card p-4 text-left shadow-sm ring-1 transition',
                  active ? 'ring-2 ring-primary' : 'ring-border hover:ring-primary/40',
                )}
              >
                <span className="flex items-center justify-between">
                  <span className="tracking-tight text-base font-semibold">{g.name}</span>
                  <span
                    className={cn(
                      'flex size-5 items-center justify-center rounded-full border',
                      active ? 'border-primary bg-primary text-primary-foreground' : 'border-input',
                    )}
                  >
                    {active && <Check className="size-3" aria-hidden />}
                  </span>
                </span>
                <span className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Users className="size-3.5" aria-hidden /> 리더 {g.leader} · {g.memberCount}명
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarClock className="size-3.5" aria-hidden /> {g.schedule}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" aria-hidden /> {g.location}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
        {churchGroups.length === 0 && (
          <li className="rounded-2xl border border-dashed p-6 text-center text-sm leading-relaxed text-muted-foreground">
            아직 등록된 다락방이 없어요.
            <br />첫 번째 다락방을 만들어 보세요.
          </li>
        )}
      </ul>

      <button
        type="button"
        onClick={() => setCreating(true)}
        className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/40 p-4 text-sm font-medium text-primary transition hover:bg-secondary"
      >
        <Plus className="size-4" aria-hidden />
        새 다락방 만들기
      </button>

      <div className="mt-auto pt-4">
        <Button
          className="h-12 w-full rounded-xl text-base"
          disabled={!picked}
          onClick={() => picked && selectGroup(picked)}
        >
          이 다락방으로 시작하기
        </Button>
      </div>
    </div>
  )
}

function Field({
  id,
  label,
  ...props
}: { id: string; label: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} className="h-11 rounded-xl bg-background text-base" {...props} />
    </div>
  )
}

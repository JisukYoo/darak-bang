'use client'

import { useState } from 'react'
import {
  BookOpenText,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  Clock,
  HandHeart,
  ImageIcon,
  ImagePlus,
  MapPin,
  Music2,
  Pin,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { members } from '@/lib/darak-data'
import { photoSrc } from '@/lib/photo-storage'
import { useBanner, usePhotos } from '@/hooks/use-photos'
import { useApp } from './app-provider'
import { BannerPicker } from './banner-picker'
import { MemberAvatar } from './member-avatar'
import { PhotoUploadButton } from './photo-upload-button'

export function Dashboard() {
  return (
    <div className="flex flex-col gap-6 px-5 pt-2 pb-8">
      <div className="flex flex-col gap-0.5">
        <p className="text-sm text-muted-foreground">11월 5일 수요일</p>
        <h1 className="tracking-tight text-2xl font-semibold text-balance">평안한 하루예요, 은혜님</h1>
      </div>
      <GatheringCard />
      <QuickActions />
      <PhotoStrip />
      <NoticeSection />
    </div>
  )
}

function PhotoStrip() {
  const { groupId, setHomeView } = useApp()
  const { photos, isLoading, upload } = usePhotos(groupId)
  const recent = photos.slice(0, 6)

  return (
    <section aria-labelledby="photos-title" className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 id="photos-title" className="tracking-tight text-lg font-semibold">
          함께한 순간
        </h2>
        <button type="button" onClick={() => setHomeView('photos')} className="text-sm font-medium text-primary">
          {photos.length > 0 ? `사진첩 ${photos.length}장` : '사진첩'}
        </button>
      </div>
      <ul className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
        <li className="shrink-0 snap-start">
          <PhotoUploadButton
            onUpload={upload}
            variant="secondary"
            aria-label="사진 올리기"
            className="flex size-24 flex-col gap-1 rounded-2xl text-xs"
          >
            <ImagePlus className="size-5" aria-hidden />
            올리기
          </PhotoUploadButton>
        </li>
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="size-24 shrink-0 animate-pulse rounded-2xl bg-muted" />
            ))
          : recent.map((photo) => (
              <li key={photo.pathname} className="shrink-0 snap-start">
                <button
                  type="button"
                  onClick={() => setHomeView('photos')}
                  className="block size-24 overflow-hidden rounded-2xl bg-muted"
                  aria-label="사진첩에서 보기"
                >
                  <img src={photoSrc(photo.pathname)} alt="" loading="lazy" className="size-full object-cover" />
                </button>
              </li>
            ))}
      </ul>
    </section>
  )
}

function GatheringCard() {
  const { group, groupId, setHomeView } = useApp()
  const { bannerPath } = useBanner(groupId)
  const [pickerOpen, setPickerOpen] = useState(false)

  return (
    <section
      aria-labelledby="gathering-title"
      className="relative isolate overflow-hidden rounded-3xl bg-primary px-6 pt-8 pb-6 text-primary-foreground shadow-md"
    >
      {bannerPath && (
        <>
          <img
            src={photoSrc(bannerPath)}
            alt=""
            className="absolute inset-0 -z-10 size-full object-cover animate-in fade-in-0 duration-500"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-foreground/30 via-foreground/45 to-foreground/75" aria-hidden />
        </>
      )}
      <button
        type="button"
        onClick={() => setPickerOpen(true)}
        className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition hover:bg-primary-foreground/25"
      >
        <ImageIcon className="size-3.5" aria-hidden />
        배경
      </button>
      <BannerPicker open={pickerOpen} onOpenChange={setPickerOpen} />
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-xs font-medium tracking-widest text-primary-foreground/75 uppercase">다음 모임</p>
        <h2 id="gathering-title" className="tracking-tight text-3xl font-semibold">
          11월 7일 금요일
        </h2>
        <p className="text-sm text-primary-foreground/80">이번 주 나눔 · 요한복음 15장</p>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 rounded-xl bg-primary-foreground/10 px-3 py-2.5">
          <Clock className="size-4 shrink-0" aria-hidden />
          <dt className="sr-only">시간</dt>
          <dd>{group?.schedule.replace(/^매주 \S+ /, '') ?? '오후 8시'}</dd>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-primary-foreground/10 px-3 py-2.5">
          <MapPin className="size-4 shrink-0" aria-hidden />
          <dt className="sr-only">장소</dt>
          <dd className="truncate">{group?.location}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center">
          {members.slice(0, 4).map((m) => (
            <MemberAvatar key={m.id} member={m} size="sm" className="-mr-2 ring-2 ring-primary" />
          ))}
          <span className="ml-4 text-xs text-primary-foreground/80">외 11명 참석 예정</span>
        </div>
        <button
          type="button"
          onClick={() => setHomeView('attendance')}
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm transition active:scale-95"
        >
          출석체크
        </button>
      </div>
    </section>
  )
}

function QuickActions() {
  const { setHomeView, setTab } = useApp()

  const actions = [
    { label: '출석체크', icon: ClipboardCheck, onClick: () => setHomeView('attendance') },
    { label: '찬양', icon: Music2, onClick: () => setHomeView('hymns') },
    { label: '기도제목', icon: HandHeart, onClick: () => setTab('prayer') },
    { label: '말씀읽기', icon: BookOpenText, onClick: () => setTab('bible') },
  ]

  return (
    <section aria-label="바로가기">
      <ul className="grid grid-cols-4 gap-2">
        {actions.map(({ label, icon: Icon, onClick }) => (
          <li key={label}>
            <button
              type="button"
              onClick={onClick}
              className="flex w-full flex-col items-center gap-2 rounded-2xl bg-card py-4 text-xs font-medium shadow-sm ring-1 ring-border transition hover:ring-primary/40 active:scale-95"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <Icon className="size-5" aria-hidden />
              </span>
              {label}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function NoticeSection() {
  const { notices } = useApp()
  const [openId, setOpenId] = useState<string | null>(notices[0]?.id ?? null)
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? notices : notices.slice(0, 2)

  return (
    <section id="notices" aria-labelledby="notice-title" className="flex scroll-mt-20 flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 id="notice-title" className="tracking-tight text-lg font-semibold">
          공지사항
        </h2>
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="text-sm font-medium text-primary"
          aria-expanded={showAll}
        >
          {showAll ? '접기' : `전체 ${notices.length}개 보기`}
        </button>
      </div>
      <ul className="flex flex-col gap-2">
        {visible.map((notice) => {
          const open = openId === notice.id
          return (
            <li
              key={notice.id}
              className={cn(
                'overflow-hidden rounded-2xl ring-1 transition-colors',
                notice.pinned ? 'bg-highlight/50 ring-accent/40' : 'bg-card ring-border',
              )}
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? null : notice.id)}
                aria-expanded={open}
                className="flex w-full items-start gap-3 p-4 text-left"
              >
                <span
                  className={cn(
                    'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg',
                    notice.pinned ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground',
                  )}
                >
                  {notice.pinned ? <Pin className="size-4" aria-hidden /> : <CalendarDays className="size-4" aria-hidden />}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="font-medium text-pretty">{notice.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {notice.pinned && '고정 · '}
                    {notice.date}
                  </span>
                </span>
                <ChevronDown
                  className={cn('mt-1 size-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
                  aria-hidden
                />
              </button>
              {open && (
                <p className="px-4 pb-4 pl-15 text-sm leading-relaxed text-muted-foreground animate-in fade-in-0 slide-in-from-top-1">
                  {notice.body}
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

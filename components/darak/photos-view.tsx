'use client'

import { useState } from 'react'
import { ArrowLeft, ImagePlus, Loader2, PanelTop, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { photoSrc } from '@/lib/photo-storage'
import { type GroupPhoto, useBanner, usePhotos } from '@/hooks/use-photos'
import { useApp } from './app-provider'
import { PhotoUploadButton } from './photo-upload-button'

export function PhotosView() {
  const { groupId, group, setHomeView } = useApp()
  const { photos, isLoading, error, upload, remove } = usePhotos(groupId)
  const { bannerPath, setBanner } = useBanner(groupId)
  const [selected, setSelected] = useState<GroupPhoto | null>(null)

  return (
    <div className="flex flex-col gap-5 px-5 pt-2 pb-8">
      <div className="flex items-center justify-between gap-3">
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
            <h1 className="tracking-tight text-xl font-semibold">함께한 순간</h1>
            <p className="text-xs text-muted-foreground">{group?.name} 사진첩 · {photos.length}장</p>
          </div>
        </div>
        <PhotoUploadButton onUpload={upload} className="rounded-full" size="sm">
          <ImagePlus className="size-4" aria-hidden />
          사진 올리기
        </PhotoUploadButton>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : error ? (
        <p className="rounded-2xl bg-card p-6 text-center text-sm text-muted-foreground ring-1 ring-border">
          사진을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-card px-6 py-12 text-center ring-1 ring-border">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
            <ImagePlus className="size-6" aria-hidden />
          </span>
          <p className="font-medium">아직 올라온 사진이 없어요</p>
          <p className="text-sm text-muted-foreground text-pretty">모임에서 함께 찍은 사진을 올려 추억을 나눠보세요.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-3 gap-1.5">
          {photos.map((photo) => (
            <li key={photo.pathname} className="relative">
              <button
                type="button"
                onClick={() => setSelected(photo)}
                className="block aspect-square w-full overflow-hidden rounded-xl bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                aria-label={`${formatDate(photo.uploadedAt)}에 올린 사진 크게 보기`}
              >
                <img src={photoSrc(photo.pathname)} alt="" loading="lazy" className="size-full object-cover transition hover:scale-105" />
              </button>
              {bannerPath === photo.pathname && (
                <span className="pointer-events-none absolute top-1.5 left-1.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                  배너
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <PhotoLightbox
          photo={selected}
          isBanner={bannerPath === selected.pathname}
          onClose={() => setSelected(null)}
          onSetBanner={async () => {
            await setBanner(selected.pathname)
            setSelected(null)
          }}
          onDelete={async () => {
            if (bannerPath === selected.pathname) await setBanner(null)
            await remove(selected.pathname)
            setSelected(null)
          }}
        />
      )}
    </div>
  )
}

function PhotoLightbox({
  photo,
  isBanner,
  onClose,
  onSetBanner,
  onDelete,
}: {
  photo: GroupPhoto
  isBanner: boolean
  onClose: () => void
  onSetBanner: () => Promise<void>
  onDelete: () => Promise<void>
}) {
  const [busy, setBusy] = useState<'banner' | 'delete' | null>(null)

  const run = async (kind: 'banner' | 'delete', action: () => Promise<void>) => {
    setBusy(kind)
    try {
      await action()
    } finally {
      setBusy(null)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="사진 보기"
      className="fixed inset-0 z-50 flex flex-col bg-foreground/90 animate-in fade-in-0"
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-3 text-background">
        <span className="text-sm">{formatDate(photo.uploadedAt)}</span>
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="flex size-9 items-center justify-center rounded-full bg-background/15"
          aria-label="닫기"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-1 items-center justify-center px-4" onClick={onClose}>
        <img src={photoSrc(photo.pathname)} alt="다락방 모임 사진" className="max-h-full w-full rounded-2xl object-contain" />
      </div>
      <div className="mx-auto flex w-full max-w-md gap-2 px-4 pt-3 pb-6">
        <Button
          type="button"
          className="flex-1 rounded-full"
          disabled={isBanner || busy !== null}
          onClick={() => run('banner', onSetBanner)}
        >
          {busy === 'banner' ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <PanelTop className="size-4" aria-hidden />}
          {isBanner ? '현재 홈 배너' : '홈 배너로 설정'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className={cn('rounded-full')}
          disabled={busy !== null}
          onClick={() => run('delete', onDelete)}
          aria-label="사진 삭제"
        >
          {busy === 'delete' ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Trash2 className="size-4" aria-hidden />}
        </Button>
      </div>
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
}

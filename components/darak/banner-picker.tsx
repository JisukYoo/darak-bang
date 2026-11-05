'use client'

import { Check, ImagePlus, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { photoSrc } from '@/lib/photo-storage'
import { useBanner, usePhotos } from '@/hooks/use-photos'
import { useApp } from './app-provider'
import { PhotoUploadButton } from './photo-upload-button'

export function BannerPicker({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { groupId } = useApp()
  const { photos, isLoading, upload } = usePhotos(groupId)
  const { bannerPath, setBanner } = useBanner(groupId)

  const choose = async (pathname: string | null) => {
    await setBanner(pathname)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl">
        <DialogHeader>
          <DialogTitle>배너 배경 사진</DialogTitle>
          <DialogDescription>사진첩에서 고르거나 새 사진을 올려 홈 배너 배경으로 써보세요.</DialogDescription>
        </DialogHeader>

        <div className="grid max-h-72 grid-cols-3 gap-1.5 overflow-y-auto">
          <button
            type="button"
            onClick={() => choose(null)}
            className={cn(
              'flex aspect-square flex-col items-center justify-center gap-1 rounded-xl bg-primary text-xs font-medium text-primary-foreground',
              !bannerPath && 'ring-2 ring-ring ring-offset-2 ring-offset-background',
            )}
            aria-pressed={!bannerPath}
          >
            <RotateCcw className="size-4" aria-hidden />
            기본 색상
          </button>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted" />)
            : photos.map((photo) => {
                const active = bannerPath === photo.pathname
                return (
                  <button
                    key={photo.pathname}
                    type="button"
                    onClick={() => choose(photo.pathname)}
                    aria-pressed={active}
                    aria-label="이 사진을 배너 배경으로"
                    className={cn(
                      'relative aspect-square overflow-hidden rounded-xl bg-muted',
                      active && 'ring-2 ring-ring ring-offset-2 ring-offset-background',
                    )}
                  >
                    <img src={photoSrc(photo.pathname)} alt="" loading="lazy" className="size-full object-cover" />
                    {active && (
                      <span className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-3" aria-hidden />
                      </span>
                    )}
                  </button>
                )
              })}
        </div>

        <PhotoUploadButton
          onUpload={async (file) => {
            const pathname = await upload(file)
            await choose(pathname)
          }}
          className="w-full rounded-full"
        >
          <ImagePlus className="size-4" aria-hidden />
          새 사진 올려서 설정하기
        </PhotoUploadButton>
        <Button type="button" variant="ghost" className="sr-only" onClick={() => onOpenChange(false)}>
          닫기
        </Button>
      </DialogContent>
    </Dialog>
  )
}

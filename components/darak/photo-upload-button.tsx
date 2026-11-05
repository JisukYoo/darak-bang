'use client'

import { useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = Omit<React.ComponentProps<typeof Button>, 'onClick' | 'type'> & {
  onUpload: (file: File) => Promise<unknown>
}

export function PhotoUploadButton({ onUpload, children, disabled, ...props }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return
    setUploading(true)
    setError(null)
    try {
      for (const file of Array.from(files)) await onUpload(file)
    } catch (e) {
      setError(e instanceof Error ? e.message : '업로드에 실패했어요.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Button type="button" disabled={disabled || uploading} onClick={() => inputRef.current?.click()} {...props}>
        {uploading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        {uploading ? '올리는 중…' : children}
      </Button>
      {error && (
        <p
          role="alert"
          onClick={() => setError(null)}
          className="fixed inset-x-0 bottom-24 z-[60] mx-auto w-fit max-w-[90%] rounded-full bg-foreground px-4 py-2 text-sm text-background shadow-lg animate-in fade-in-0 slide-in-from-bottom-2"
        >
          {error}
        </p>
      )}
    </>
  )
}

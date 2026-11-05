'use client'

import { useCallback } from 'react'
import useSWR from 'swr'

export type GroupPhoto = { pathname: string; uploadedAt: string }

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Request failed')
  return res.json()
}

export function usePhotos(groupId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<{ photos: GroupPhoto[] }>(
    groupId ? `/api/photos?groupId=${groupId}` : null,
    fetcher,
  )

  const upload = useCallback(
    async (file: File) => {
      if (!groupId) throw new Error('No group')
      const body = new FormData()
      body.append('file', file)
      body.append('groupId', groupId)
      const res = await fetch('/api/photos', { method: 'POST', body })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? '업로드에 실패했어요.')
      await mutate()
      return json.pathname as string
    },
    [groupId, mutate],
  )

  const remove = useCallback(
    async (pathname: string) => {
      if (!groupId) return
      await mutate(
        async (current) => {
          const res = await fetch('/api/photos', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupId, pathname }),
          })
          if (!res.ok) throw new Error('삭제에 실패했어요.')
          return { photos: (current?.photos ?? []).filter((p) => p.pathname !== pathname) }
        },
        {
          optimisticData: (current) => ({
            photos: (current?.photos ?? []).filter((p) => p.pathname !== pathname),
          }),
          rollbackOnError: true,
          revalidate: false,
        },
      )
    },
    [groupId, mutate],
  )

  return { photos: data?.photos ?? [], error, isLoading, upload, remove }
}

export function useBanner(groupId: string | null) {
  const { data, isLoading, mutate } = useSWR<{ pathname: string | null }>(
    groupId ? `/api/banner?groupId=${groupId}` : null,
    fetcher,
  )

  const setBanner = useCallback(
    async (pathname: string | null) => {
      if (!groupId) return
      await mutate(
        async () => {
          const res = await fetch('/api/banner', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupId, pathname }),
          })
          if (!res.ok) throw new Error('배경 변경에 실패했어요.')
          return res.json()
        },
        { optimisticData: { pathname }, rollbackOnError: true, revalidate: false },
      )
    },
    [groupId, mutate],
  )

  return { bannerPath: data?.pathname ?? null, isLoading, setBanner }
}

import { del, list, put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import { MAX_PHOTO_BYTES, isGroupPhoto, isValidGroupId, photosPrefix } from '@/lib/photo-storage'

export async function GET(request: NextRequest) {
  const groupId = request.nextUrl.searchParams.get('groupId')
  if (!isValidGroupId(groupId)) {
    return NextResponse.json({ error: 'Invalid group' }, { status: 400 })
  }

  try {
    const { blobs } = await list({ prefix: photosPrefix(groupId), limit: 200 })
    const photos = blobs
      .map((blob) => ({ pathname: blob.pathname, uploadedAt: blob.uploadedAt }))
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    return NextResponse.json({ photos })
  } catch (error) {
    console.error('List photos error:', error)
    return NextResponse.json({ error: 'Failed to load photos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const groupId = formData.get('groupId')

    if (!isValidGroupId(groupId)) {
      return NextResponse.json({ error: 'Invalid group' }, { status: 400 })
    }
    if (!(file instanceof File) || !file.type.startsWith('image/')) {
      return NextResponse.json({ error: '이미지 파일만 올릴 수 있어요.' }, { status: 400 })
    }
    if (file.size > MAX_PHOTO_BYTES) {
      return NextResponse.json({ error: '10MB 이하의 사진만 올릴 수 있어요.' }, { status: 413 })
    }

    const extension = file.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '').slice(0, 5) || 'jpg'
    const blob = await put(`${photosPrefix(groupId)}${Date.now()}.${extension}`, file, {
      access: 'private',
      addRandomSuffix: true,
      contentType: file.type,
    })

    return NextResponse.json({ pathname: blob.pathname })
  } catch (error) {
    console.error('Upload photo error:', error)
    return NextResponse.json({ error: '업로드에 실패했어요.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { groupId, pathname } = await request.json()
    if (!isValidGroupId(groupId) || !isGroupPhoto(groupId, pathname)) {
      return NextResponse.json({ error: 'Invalid photo' }, { status: 400 })
    }
    await del(pathname)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete photo error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}

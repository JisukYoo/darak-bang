import { del, get, put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import { bannerConfigPath, isGroupPhoto, isValidGroupId } from '@/lib/photo-storage'

export async function GET(request: NextRequest) {
  const groupId = request.nextUrl.searchParams.get('groupId')
  if (!isValidGroupId(groupId)) {
    return NextResponse.json({ error: 'Invalid group' }, { status: 400 })
  }

  try {
    const result = await get(bannerConfigPath(groupId), { access: 'private' })
    if (!result || result.statusCode !== 200) return NextResponse.json({ pathname: null })

    const config = JSON.parse(await new Response(result.stream).text())
    const pathname = isGroupPhoto(groupId, config?.pathname) ? config.pathname : null
    return NextResponse.json({ pathname })
  } catch {
    return NextResponse.json({ pathname: null })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { groupId, pathname } = await request.json()
    if (!isValidGroupId(groupId)) {
      return NextResponse.json({ error: 'Invalid group' }, { status: 400 })
    }

    if (pathname === null) {
      await del(bannerConfigPath(groupId)).catch(() => undefined)
      return NextResponse.json({ pathname: null })
    }

    if (!isGroupPhoto(groupId, pathname)) {
      return NextResponse.json({ error: 'Invalid photo' }, { status: 400 })
    }

    await put(bannerConfigPath(groupId), JSON.stringify({ pathname }), {
      access: 'private',
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: 'application/json',
      cacheControlMaxAge: 60,
    })
    return NextResponse.json({ pathname })
  } catch (error) {
    console.error('Update banner error:', error)
    return NextResponse.json({ error: '배경 변경에 실패했어요.' }, { status: 500 })
  }
}

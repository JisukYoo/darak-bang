export type Hymn = {
  id: string
  number?: number
  title: string
  videoId: string
  custom?: boolean
}

export const presetHymns: Hymn[] = [
  { id: 'h79', number: 79, title: '주 하나님 지으신 모든 세계', videoId: 'IhJHSXc3iDg' },
  { id: 'h288', number: 288, title: '예수를 나의 구주 삼고', videoId: 'hFhMsUCA-tQ' },
  { id: 'h305', number: 305, title: '나 같은 죄인 살리신', videoId: 'SfUoRQy-LH4' },
  { id: 'h310', number: 310, title: '아 하나님의 은혜로', videoId: '5SrDE5LT1rc' },
  { id: 'h338', number: 338, title: '내 주를 가까이 하게 함은', videoId: '9FNMj1rPU2c' },
  { id: 'h384', number: 384, title: '나의 갈 길 다 가도록', videoId: 'VZdMLgChd-8' },
]

export function parseYouTubeId(input: string): string | null {
  const value = input.trim()
  if (/^[\w-]{11}$/.test(value)) return value

  let url: URL
  try {
    url = new URL(value.startsWith('http') ? value : `https://${value}`)
  } catch {
    return null
  }

  const host = url.hostname.replace(/^(www\.|m\.|music\.)/, '')
  let id: string | null = null

  if (host === 'youtu.be') {
    id = url.pathname.slice(1).split('/')[0]
  } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (url.pathname === '/watch') id = url.searchParams.get('v')
    else {
      const match = url.pathname.match(/^\/(embed|shorts|live|v)\/([\w-]{11})/)
      id = match?.[2] ?? null
    }
  }

  return id && /^[\w-]{11}$/.test(id) ? id : null
}

export function thumbnailUrl(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`
}

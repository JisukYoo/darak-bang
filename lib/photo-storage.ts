const GROUP_ID_PATTERN = /^[\w-]{1,64}$/

export const MAX_PHOTO_BYTES = 10 * 1024 * 1024

export function isValidGroupId(groupId: unknown): groupId is string {
  return typeof groupId === 'string' && GROUP_ID_PATTERN.test(groupId)
}

export function photosPrefix(groupId: string) {
  return `darak/${groupId}/photos/`
}

export function bannerConfigPath(groupId: string) {
  return `darak/${groupId}/banner.json`
}

export function isGroupPhoto(groupId: string, pathname: unknown): pathname is string {
  return (
    typeof pathname === 'string' &&
    pathname.startsWith(photosPrefix(groupId)) &&
    !pathname.includes('..')
  )
}

export function photoSrc(pathname: string) {
  return `/api/photos/file?pathname=${encodeURIComponent(pathname)}`
}

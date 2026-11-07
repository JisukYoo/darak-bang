'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  type AttendanceStatus,
  type Church,
  type Darakbang,
  type FeedPost,
  type Member,
  type Notice,
  type NoticeComment,
  ME_ID,
  churches as seedChurches,
  initialAttendance,
  initialComments,
  initialGroups,
  initialNotices,
  initialPosts,
  members,
} from '@/lib/darak-data'

export type Tab = 'home' | 'bible' | 'prayer' | 'gift' | 'profile'
export type HomeView = 'dashboard' | 'attendance' | 'hymns' | 'photos' | 'notice'
export type ProfileSubView = 'main' | 'saved'

export type NewNotice = Pick<Notice, 'title' | 'body' | 'pinned' | 'address' | 'commentPrompt'>

type AppState = {
  churches: Church[]
  groups: Darakbang[]
  churchId: string | null
  groupId: string | null
  church: Church | undefined
  group: Darakbang | undefined
  selectChurch: (id: string | null) => void
  selectGroup: (id: string | null) => void
  addChurch: (church: Omit<Church, 'id'>) => string
  addGroup: (group: Omit<Darakbang, 'id' | 'memberCount'>) => string
  tab: Tab
  setTab: (tab: Tab) => void
  homeView: HomeView
  setHomeView: (view: HomeView) => void
  profileView: ProfileSubView
  setProfileView: (view: ProfileSubView) => void
  attendance: Record<string, AttendanceStatus>
  setAttendance: (memberId: string, status: AttendanceStatus) => void
  markAll: (status: AttendanceStatus) => void
  posts: FeedPost[]
  togglePray: (postId: string) => void
  addPost: (post: Pick<FeedPost, 'type' | 'content' | 'verse' | 'coAuthorId'>) => void
  editPost: (postId: string, content: string) => void
  me: Member
  spouse: Member | undefined
  canEditPost: (post: FeedPost) => boolean
  notices: Notice[]
  addNotice: (notice: NewNotice) => void
  openNotice: (id: string) => void
  activeNotice: Notice | undefined
  comments: NoticeComment[]
  addComment: (noticeId: string, content: string) => void
  deleteComment: (commentId: string) => void
  bookmarks: string[]
  toggleBookmark: (key: string) => void
  highlights: string[]
  toggleHighlight: (key: string) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [churches, setChurches] = useState<Church[]>(seedChurches)
  const [groups, setGroups] = useState<Darakbang[]>(initialGroups)
  const [churchId, setChurchId] = useState<string | null>(null)
  const [groupId, setGroupId] = useState<string | null>(null)
  const [tab, setTabState] = useState<Tab>('home')
  const [homeView, setHomeView] = useState<HomeView>('dashboard')
  const [profileView, setProfileView] = useState<ProfileSubView>('main')
  const [attendance, setAttendanceState] = useState(initialAttendance)
  const [posts, setPosts] = useState<FeedPost[]>(initialPosts)
  const [bookmarks, setBookmarks] = useState<string[]>(['jhn-15-5'])
  const [highlights, setHighlights] = useState<string[]>(['jhn-15-4'])
  const [notices, setNotices] = useState<Notice[]>(initialNotices)
  const [comments, setComments] = useState<NoticeComment[]>(initialComments)
  const [noticeId, setNoticeId] = useState<string | null>(null)

  const me = members.find((m) => m.id === ME_ID) ?? members[0]
  const group = groups.find((g) => g.id === groupId)
  const spouse = group?.isCouple ? members.find((m) => m.id === me.spouseId) : undefined

  const canEditPost = useCallback(
    (post: FeedPost) => post.authorId === me.id || post.coAuthorId === me.id,
    [me.id],
  )

  const editPost = useCallback(
    (postId: string, content: string) => {
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, content, editedBy: me.id, createdAt: '방금 수정' } : p)),
      )
    },
    [me.id],
  )

  const addNotice = useCallback(
    (notice: NewNotice) => {
      const id = `n-${Date.now()}`
      setNotices((prev) => {
        const next = notice.pinned ? prev.map((n) => ({ ...n, pinned: false })) : prev
        return [{ ...notice, id, authorId: me.id, date: '오늘' }, ...next]
      })
    },
    [me.id],
  )

  const openNotice = useCallback((id: string) => {
    setNoticeId(id)
    setHomeView('notice')
  }, [])

  const addComment = useCallback(
    (noticeId: string, content: string) => {
      setComments((prev) => [
        ...prev,
        { id: `cm-${Date.now()}`, noticeId, authorId: me.id, content, createdAt: '방금 전' },
      ])
    },
    [me.id],
  )

  const deleteComment = useCallback((commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId))
  }, [])

  const selectChurch = useCallback((id: string | null) => {
    setChurchId(id)
    setGroupId(null)
  }, [])

  const addChurch = useCallback((church: Omit<Church, 'id'>) => {
    const id = `c-${Date.now()}`
    setChurches((prev) => [{ ...church, id }, ...prev])
    return id
  }, [])

  const addGroup = useCallback((group: Omit<Darakbang, 'id' | 'memberCount'>) => {
    const id = `g-${Date.now()}`
    setGroups((prev) => [{ ...group, id, memberCount: 1 }, ...prev])
    return id
  }, [])

  const setTab = useCallback((next: Tab) => {
    setTabState(next)
    if (next === 'home') setHomeView('dashboard')
    if (next === 'profile') setProfileView('main')
  }, [])

  const setAttendance = useCallback((memberId: string, status: AttendanceStatus) => {
    setAttendanceState((prev) => ({ ...prev, [memberId]: status }))
  }, [])

  const markAll = useCallback((status: AttendanceStatus) => {
    setAttendanceState((prev) =>
      Object.fromEntries(Object.keys(prev).map((key) => [key, status])),
    )
  }, [])

  const togglePray = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              prayedByMe: !post.prayedByMe,
              prayCount: post.prayCount + (post.prayedByMe ? -1 : 1),
            }
          : post,
      ),
    )
  }, [])

  const addPost = useCallback((post: Pick<FeedPost, 'type' | 'content' | 'verse' | 'coAuthorId'>) => {
    setPosts((prev) => [
      {
        ...post,
        id: `p-${Date.now()}`,
        authorId: ME_ID,
        createdAt: '방금 전',
        prayCount: 0,
        prayedByMe: false,
      },
      ...prev,
    ])
  }, [])

  const toggleIn = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (key: string) =>
    setter((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))

  const value = useMemo<AppState>(
    () => ({
      churches,
      groups,
      churchId,
      groupId,
      church: churches.find((c) => c.id === churchId),
      group,
      selectChurch,
      selectGroup: setGroupId,
      addChurch,
      addGroup,
      tab,
      setTab,
      homeView,
      setHomeView,
      profileView,
      setProfileView,
      attendance,
      setAttendance,
      markAll,
      posts,
      togglePray,
      addPost,
      editPost,
      me,
      spouse,
      canEditPost,
      notices,
      addNotice,
      openNotice,
      activeNotice: notices.find((n) => n.id === noticeId),
      comments,
      addComment,
      deleteComment,
      bookmarks,
      toggleBookmark: toggleIn(setBookmarks),
      highlights,
      toggleHighlight: toggleIn(setHighlights),
    }),
    [churches, groups, churchId, groupId, group, selectChurch, addChurch, addGroup, tab, setTab, homeView, profileView, attendance, setAttendance, markAll, posts, togglePray, addPost, editPost, me, spouse, canEditPost, notices, addNotice, openNotice, noticeId, comments, addComment, deleteComment, bookmarks, highlights],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

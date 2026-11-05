'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  type AttendanceStatus,
  type Church,
  type Darakbang,
  type FeedPost,
  churches as seedChurches,
  initialAttendance,
  initialGroups,
  initialNotices,
  initialPosts,
} from '@/lib/darak-data'

export type Tab = 'home' | 'bible' | 'prayer' | 'gift' | 'profile'
export type HomeView = 'dashboard' | 'attendance'

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
  attendance: Record<string, AttendanceStatus>
  setAttendance: (memberId: string, status: AttendanceStatus) => void
  markAll: (status: AttendanceStatus) => void
  posts: FeedPost[]
  togglePray: (postId: string) => void
  addPost: (post: Pick<FeedPost, 'type' | 'content' | 'verse'>) => void
  notices: typeof initialNotices
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
  const [attendance, setAttendanceState] = useState(initialAttendance)
  const [posts, setPosts] = useState<FeedPost[]>(initialPosts)
  const [bookmarks, setBookmarks] = useState<string[]>(['jhn-15-5'])
  const [highlights, setHighlights] = useState<string[]>(['jhn-15-4'])

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

  const addPost = useCallback((post: Pick<FeedPost, 'type' | 'content' | 'verse'>) => {
    setPosts((prev) => [
      {
        ...post,
        id: `p-${Date.now()}`,
        authorId: 'm1',
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
      group: groups.find((g) => g.id === groupId),
      selectChurch,
      selectGroup: setGroupId,
      addChurch,
      addGroup,
      tab,
      setTab,
      homeView,
      setHomeView,
      attendance,
      setAttendance,
      markAll,
      posts,
      togglePray,
      addPost,
      notices: initialNotices,
      bookmarks,
      toggleBookmark: toggleIn(setBookmarks),
      highlights,
      toggleHighlight: toggleIn(setHighlights),
    }),
    [churches, groups, churchId, groupId, selectChurch, addChurch, addGroup, tab, setTab, homeView, attendance, setAttendance, markAll, posts, togglePray, addPost, bookmarks, highlights],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

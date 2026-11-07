'use client'

import { AppProvider, useApp } from './app-provider'
import { AttendanceView } from './attendance-view'
import { BibleView } from './bible-view'
import { BottomNav } from './bottom-nav'
import { Dashboard } from './dashboard'
import { GiftView } from './gift-view'
import { HymnsView } from './hymns-view'
import { NoticeDetailView } from './notice-detail-view'
import { OnboardingWizard } from './onboarding-wizard'
import { PhotosView } from './photos-view'
import { PrayerView } from './prayer-view'
import { ProfileView } from './profile-view'
import { SavedVersesView } from './saved-verses-view'
import { TopBar } from './top-bar'

export function DarakApp() {
  return (
    <AppProvider>
      <div className="mx-auto min-h-dvh w-full max-w-md bg-background shadow-sm md:border-x">
        <Screens />
      </div>
    </AppProvider>
  )
}

function Screens() {
  const { groupId, tab, homeView, profileView } = useApp()

  if (!groupId) return <OnboardingWizard />

  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar />
      <main key={`${tab}-${homeView}-${profileView}`} className="flex-1 animate-in fade-in-0 duration-300">
        {tab === 'home' &&
          (homeView === 'attendance' ? (
            <AttendanceView />
          ) : homeView === 'hymns' ? (
            <HymnsView />
          ) : homeView === 'photos' ? (
            <PhotosView />
          ) : homeView === 'notice' ? (
            <NoticeDetailView />
          ) : (
            <Dashboard />
          ))}
        {tab === 'bible' && <BibleView />}
        {tab === 'prayer' && <PrayerView />}
        {tab === 'gift' && <GiftView />}
        {tab === 'profile' && (profileView === 'saved' ? <SavedVersesView /> : <ProfileView />)}
      </main>
      <BottomNav />
    </div>
  )
}

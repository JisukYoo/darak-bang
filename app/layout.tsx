import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Gaegu, Noto_Sans_KR, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const gaegu = Gaegu({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-gaegu',
  display: 'swap',
})

const notoSans = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '온다락방 — 따뜻한 다락방 공동체',
  description:
    '교회 다락방(소그룹) 모임을 위한 앱. 출석체크, 기도제목 나눔, 말씀 묵상, 성경 읽기, 맞춤 성경 선물까지.',
  generator: 'v0.app',
  applicationName: '온다락방',
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    title: '온다락방',
    statusBarStyle: 'default',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f9fafc',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${notoSans.variable} ${jakarta.variable} ${gaegu.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

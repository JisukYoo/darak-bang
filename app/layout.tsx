import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google'
import './globals.css'

const notoSans = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
})

const notoSerif = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-noto-serif-kr',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '다락방 Darakbang — 함께 말씀과 기도로',
  description:
    '교회 다락방(소그룹) 모임을 위한 앱. 출석체크, 기도제목 나눔, 말씀 묵상, 성경 읽기, 맞춤 성경 선물까지.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f8f5ee',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${notoSans.variable} ${notoSerif.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

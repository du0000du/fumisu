import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | 文巣',
    default: '文巣 — 小説執筆・掲載プラットフォーム',
  },
  description: '書くことと読まれることを、一つの場所に。',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2d5a27" />
        {/* テーマフラッシュ防止（FOUC対策） */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches)||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}

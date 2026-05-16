'use client'

import { ReadingControls, useReadingSettings } from './ReadingControls'

export default function BodyPreview({ body }: { body: string }) {
  const { theme, size, setTheme, setSize, hydrated } = useReadingSettings()

  const trimmed = body.trim()
  if (!trimmed) {
    return (
      <div className="text-sub text-sm py-12 text-center">
        本文がまだありません。「編集」タブから入力してください。
      </div>
    )
  }

  const paragraphs = body.split(/\n{2,}/).filter((p) => p.trim().length > 0)

  // hydration 完了前はサーバー描画と同じデフォルト値で表示
  const themeClass = hydrated ? `reading-theme-${theme}` : 'reading-theme-default'
  const sizeClass  = hydrated ? `reading-size-${size}`  : 'reading-size-m'

  return (
    <div className={`${themeClass} w-full min-w-0`}>
      <ReadingControls
        theme={theme}
        size={size}
        onThemeChange={setTheme}
        onSizeChange={setSize}
      />

      <article
        className={`reading-content reading-content--enhanced ${sizeClass} rounded-xl px-4 py-6 sm:px-8 sm:py-12 min-h-[calc(100vh-300px)] sm:min-h-[calc(100vh-260px)] break-anywhere`}
      >
        {paragraphs.map((para, i) => (
          <p key={i} className="whitespace-pre-wrap">
            {para}
          </p>
        ))}
      </article>
    </div>
  )
}

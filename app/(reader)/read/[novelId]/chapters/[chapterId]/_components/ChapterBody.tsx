'use client'

import { useEffect, useState } from 'react'

/**
 * 読者向け本文表示（R-019）
 * - localStorage で文字サイズ・テーマを永続化（R-003 のキーを流用）
 * - R-018 対策として右パディングを十分に確保（pl-4 pr-8 sm:px-12）
 * - 管理画面の BodyPreview / ReadingControls とは独立した実装で疎結合を維持
 */

type ReadingTheme = 'default' | 'sepia' | 'night'
type ReadingSize = 's' | 'm' | 'l' | 'xl'

const THEME_KEY = 'reading_theme'
const SIZE_KEY = 'reading_size'
const SIZES: ReadingSize[] = ['s', 'm', 'l', 'xl']

const THEME_OPTIONS: { value: ReadingTheme; label: string; emoji: string }[] = [
  { value: 'default', label: 'デフォルト', emoji: '☀️' },
  { value: 'sepia',   label: 'セピア',     emoji: '📜' },
  { value: 'night',   label: 'ナイト',     emoji: '🌙' },
]

export default function ChapterBody({ body }: { body: string }) {
  const [theme, setTheme] = useState<ReadingTheme>('default')
  const [size, setSize] = useState<ReadingSize>('m')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const t = localStorage.getItem(THEME_KEY) as ReadingTheme | null
      const s = localStorage.getItem(SIZE_KEY) as ReadingSize | null
      if (t && ['default', 'sepia', 'night'].includes(t)) setTheme(t)
      if (s && SIZES.includes(s)) setSize(s)
    } catch {
      /* localStorage 利用不可は無視 */
    }
    setHydrated(true)
  }, [])

  const updateTheme = (t: ReadingTheme) => {
    setTheme(t)
    try { localStorage.setItem(THEME_KEY, t) } catch { /* noop */ }
  }
  const updateSize = (s: ReadingSize) => {
    setSize(s)
    try { localStorage.setItem(SIZE_KEY, s) } catch { /* noop */ }
  }

  const sizeIdx = SIZES.indexOf(size)
  const stepSize = (delta: number) => {
    const next = SIZES[Math.min(SIZES.length - 1, Math.max(0, sizeIdx + delta))]
    if (next !== size) updateSize(next)
  }

  const paragraphs = body.split(/\n{2,}/).filter((p) => p.trim().length > 0)

  // hydration 完了前はデフォルト値で描画（SSR と同じクラス）
  const themeClass = hydrated ? `reading-theme-${theme}` : 'reading-theme-default'
  const sizeClass  = hydrated ? `reading-size-${size}`  : 'reading-size-m'

  return (
    <div className={`${themeClass} w-full min-w-0`}>
      {/* 読書ツールバー */}
      <div
        role="toolbar"
        aria-label="読書設定"
        className="flex flex-wrap items-center justify-end gap-2 mb-4 text-xs"
      >
        {/* 文字サイズ */}
        <div className="inline-flex rounded-lg border border-border-main overflow-hidden">
          <button
            type="button"
            onClick={() => stepSize(-1)}
            disabled={sizeIdx === 0}
            aria-label="文字を小さく"
            className="px-3 py-1.5 text-sub hover:bg-lv3 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            A−
          </button>
          <span className="px-2 py-1.5 text-muted border-l border-r border-border-main select-none tabular-nums">
            {size.toUpperCase()}
          </span>
          <button
            type="button"
            onClick={() => stepSize(+1)}
            disabled={sizeIdx === SIZES.length - 1}
            aria-label="文字を大きく"
            className="px-3 py-1.5 text-sub hover:bg-lv3 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            A＋
          </button>
        </div>

        {/* テーマ */}
        <div className="inline-flex rounded-lg border border-border-main overflow-hidden">
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateTheme(opt.value)}
              aria-pressed={theme === opt.value}
              aria-label={`読書テーマ: ${opt.label}`}
              title={opt.label}
              className={`px-3 py-1.5 transition-colors ${
                theme === opt.value
                  ? 'bg-theme text-theme-t'
                  : 'text-sub hover:bg-lv3'
              }`}
            >
              <span className="mr-1">{opt.emoji}</span>
              <span className="hidden sm:inline">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 本文 — R-018 対策: スマホ pr-8、デスクトップ sm:px-12 */}
      <article
        className={`reading-content reading-content--enhanced ${sizeClass} rounded-xl pl-4 pr-8 py-8 sm:px-12 sm:py-12 break-anywhere`}
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

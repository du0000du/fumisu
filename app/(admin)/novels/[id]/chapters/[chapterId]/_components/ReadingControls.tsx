'use client'

import { useEffect, useState } from 'react'

export type ReadingTheme = 'default' | 'sepia' | 'night'
export type ReadingSize = 's' | 'm' | 'l' | 'xl'

const THEME_KEY = 'reading_theme'
const SIZE_KEY = 'reading_size'
const SIZES: ReadingSize[] = ['s', 'm', 'l', 'xl']

const THEME_OPTIONS: { value: ReadingTheme; label: string; emoji: string }[] = [
  { value: 'default', label: 'デフォルト', emoji: '☀️' },
  { value: 'sepia',   label: 'セピア',     emoji: '📜' },
  { value: 'night',   label: 'ナイト',     emoji: '🌙' },
]

type Props = {
  theme: ReadingTheme
  size: ReadingSize
  onThemeChange: (t: ReadingTheme) => void
  onSizeChange: (s: ReadingSize) => void
}

export function ReadingControls({ theme, size, onThemeChange, onSizeChange }: Props) {
  const sizeIdx = SIZES.indexOf(size)

  const stepSize = (delta: number) => {
    const next = SIZES[Math.min(SIZES.length - 1, Math.max(0, sizeIdx + delta))]
    if (next !== size) onSizeChange(next)
  }

  return (
    <div
      role="toolbar"
      aria-label="読書設定"
      className="flex flex-wrap items-center justify-end gap-2 mb-3 text-xs"
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
        <span className="px-2 py-1.5 text-muted border-l border-r border-border-main select-none">
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
            onClick={() => onThemeChange(opt.value)}
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
  )
}

/** localStorage と同期する読書設定フック */
export function useReadingSettings() {
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
      /* localStorage 利用不可（プライベートモード等）は無視 */
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

  return { theme, size, setTheme: updateTheme, setSize: updateSize, hydrated }
}

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { setTheme } from '../_components/ThemeProvider'

type Theme = 'light' | 'dark' | 'system'

const THEMES: { value: Theme; label: string; icon: string }[] = [
  { value: 'light',  label: 'ライト',       icon: '☀️' },
  { value: 'dark',   label: 'ダーク',       icon: '🌙' },
  { value: 'system', label: 'システム設定', icon: '🖥️' },
]

export default function SettingsPage() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    () => (typeof window !== 'undefined' ? (localStorage.getItem('theme') as Theme) ?? 'system' : 'system')
  )
  const [loggingOut, setLoggingOut] = useState(false)

  const handleTheme = (t: Theme) => {
    setTheme(t)
    setCurrentTheme(t)
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="space-y-8 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-main">設定</h1>
        <p className="text-sub text-sm mt-1">アプリの表示・アカウントを管理できます</p>
      </div>

      {/* テーマ設定 */}
      <section className="card space-y-4">
        <h2 className="font-semibold text-main">表示テーマ</h2>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => handleTheme(value)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-sm transition-colors ${
                currentTheme === value
                  ? 'border-theme bg-theme/10 text-theme font-medium'
                  : 'border-border-main text-sub hover:border-theme/50'
              }`}
            >
              <span className="text-xl">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* アカウント */}
      <section className="card space-y-4">
        <h2 className="font-semibold text-main">アカウント</h2>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="btn btn-secondary w-full"
        >
          {loggingOut ? 'ログアウト中...' : 'ログアウト'}
        </button>
      </section>

      {/* バージョン情報 */}
      <p className="text-xs text-muted text-center">文巣 v0.1.0 — Phase 1 MVP</p>
    </div>
  )
}

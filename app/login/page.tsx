'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })

    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-lv1">
      <div className="w-full max-w-sm px-4">
        {/* ロゴ */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">📖</div>
          <h1 className="text-3xl font-bold text-main tracking-tight">文巣</h1>
          <p className="text-sm text-sub mt-2">書くことと読まれることを、一つの場所に。</p>
        </div>

        <div className="card shadow-sm">
          {sent ? (
            <div className="text-center py-4 space-y-3">
              <div className="text-3xl">✉️</div>
              <p className="text-main font-medium">メールを送信しました</p>
              <p className="text-sub text-sm leading-relaxed">
                <span className="font-medium text-main">{email}</span> に届いた<br />
                ログインリンクをクリックしてください。
              </p>
              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="text-xs text-sub hover:text-main underline mt-2"
              >
                別のメールアドレスで試す
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label">メールアドレス</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-neg text-sm rounded-lg bg-lv3 px-3 py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary py-3 text-base"
              >
                {loading ? '送信中...' : 'ログインリンクを送る'}
              </button>

              <p className="text-center text-xs text-muted">
                パスワード不要。メールのリンクをクリックするだけでログインできます。
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

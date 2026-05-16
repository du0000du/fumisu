'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
    // 成功時は Google の同意画面へリダイレクトされるため setLoading(false) は不要
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
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              aria-busy={loading}
              className="w-full inline-flex items-center justify-center gap-3 rounded-lg border border-border-main bg-lv2 text-main font-medium py-3 text-base transition-colors hover:bg-lv3 focus:outline-none focus:ring-2 focus:ring-offset-1 focus-visible:ring-theme disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <GoogleIcon />
              <span>{loading ? 'リダイレクト中...' : 'Google でログイン'}</span>
            </button>

            {error && (
              <p className="text-neg text-sm rounded-lg bg-lv3 px-3 py-2">{error}</p>
            )}

            <p className="text-center text-xs text-muted leading-relaxed">
              Google アカウントで認証します。<br />
              初回ログイン時に文巣アカウントが自動作成されます。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.583-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58z"
      />
    </svg>
  )
}

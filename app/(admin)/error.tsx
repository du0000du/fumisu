'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-4">
      <p className="text-4xl">⚠️</p>
      <h2 className="text-xl font-bold text-main">ページの読み込みに失敗しました</h2>
      <p className="text-sub text-sm max-w-sm">
        データの取得中にエラーが発生しました。再試行するか、ダッシュボードに戻ってください。
      </p>
      <div className="flex gap-3 mt-2">
        <button onClick={reset} className="btn btn-primary text-sm">
          再試行
        </button>
        <Link href="/dashboard" className="btn btn-secondary text-sm">
          ダッシュボードへ
        </Link>
      </div>
      {error.digest && (
        <p className="text-xs text-muted mt-2">エラーID: {error.digest}</p>
      )}
    </div>
  )
}

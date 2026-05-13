import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center gap-4">
      <p className="text-6xl">📭</p>
      <h2 className="text-2xl font-bold text-main">ページが見つかりません</h2>
      <p className="text-sub text-sm">お探しのページは存在しないか、移動された可能性があります。</p>
      <Link href="/dashboard" className="btn btn-primary mt-2">
        ダッシュボードへ戻る
      </Link>
    </div>
  )
}

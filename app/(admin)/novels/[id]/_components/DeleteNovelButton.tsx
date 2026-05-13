'use client'

import { useTransition, useState } from 'react'
import { deleteNovel } from '@/lib/actions/novels'

type Props = { novelId: string; novelTitle: string }

export default function DeleteNovelButton({ novelId, novelTitle }: Props) {
  const [isPending, startTransition] = useTransition()
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = () => {
    if (isPending) return
    startTransition(async () => {
      const result = await deleteNovel(novelId)
      if (!result.success) setError(result.error)
    })
  }

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="btn btn-danger text-sm"
      >
        この作品を削除する
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-neg/30 bg-lv3 p-4 space-y-3">
      <p className="text-sm text-main font-medium">本当に削除しますか？</p>
      <p className="text-xs text-sub">
        「<span className="font-medium">{novelTitle}</span>」とすべての章が完全に削除されます。この操作は元に戻せません。
      </p>
      {error && <p className="text-xs text-neg">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={isPending}
          aria-busy={isPending}
          className={`btn btn-danger text-sm ${isPending ? 'pointer-events-none opacity-60' : ''}`}
        >
          {isPending ? '削除中...' : '削除する'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="btn btn-secondary text-sm"
        >
          キャンセル
        </button>
      </div>
    </div>
  )
}

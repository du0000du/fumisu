'use client'

import { useState, useTransition } from 'react'
import { updateNovelStatus } from '@/lib/actions/novels'
import type { NovelStatus } from '@/lib/supabase/types'
import { STATUS_LABELS } from '@/lib/supabase/types'

const STATUSES = Object.entries(STATUS_LABELS) as [NovelStatus, string][]

export default function NovelStatusSelector({
  novelId,
  initialStatus,
}: {
  novelId: string
  initialStatus: NovelStatus
}) {
  const [status, setStatus] = useState<NovelStatus>(initialStatus)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as NovelStatus
    const prev = status
    setStatus(next)
    setError(null)

    startTransition(async () => {
      const result = await updateNovelStatus(novelId, next)
      if (!result.success) {
        setStatus(prev)
        setError(result.error)
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={handleChange}
        disabled={isPending}
        aria-label="作品ステータス"
        className="input w-auto text-xs py-1"
      >
        {STATUSES.map(([val, label]) => (
          <option key={val} value={val}>{label}</option>
        ))}
      </select>
      {isPending && <span className="text-xs text-muted">更新中...</span>}
      {error && <span className="text-xs text-neg">{error}</span>}
    </div>
  )
}

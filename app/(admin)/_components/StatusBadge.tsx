import type { NovelStatus, ChapterStatus } from '@/lib/supabase/types'
import { STATUS_LABELS, CHAPTER_STATUS_LABELS } from '@/lib/supabase/types'

/** 作品ステータスバッジ */
export function NovelStatusBadge({ status }: { status: NovelStatus }) {
  return (
    <span className={`badge badge-${status}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}

/** 章ステータスバッジ */
export function ChapterStatusBadge({ status }: { status: ChapterStatus }) {
  return (
    <span className={`badge badge-${status}`}>
      {CHAPTER_STATUS_LABELS[status]}
    </span>
  )
}

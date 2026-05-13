'use client'

import { useTransition } from 'react'
import { reorderChapter } from '@/lib/actions/chapters'

type Props = {
  chapterId: string
  novelId: string
  isFirst: boolean
  isLast: boolean
}

export default function ReorderButtons({ chapterId, novelId, isFirst, isLast }: Props) {
  const [isPending, startTransition] = useTransition()

  const move = (direction: 'up' | 'down') => {
    startTransition(async () => {
      await reorderChapter(chapterId, novelId, direction)
    })
  }

  return (
    <div className="flex flex-col gap-0.5 shrink-0">
      <button
        type="button"
        aria-label="上へ移動"
        disabled={isFirst || isPending}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          move('up')
        }}
        className="text-xs px-1.5 py-0.5 rounded hover:bg-lv3 text-sub disabled:opacity-30 disabled:hover:bg-transparent"
      >
        ↑
      </button>
      <button
        type="button"
        aria-label="下へ移動"
        disabled={isLast || isPending}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          move('down')
        }}
        className="text-xs px-1.5 py-0.5 rounded hover:bg-lv3 text-sub disabled:opacity-30 disabled:hover:bg-transparent"
      >
        ↓
      </button>
    </div>
  )
}

'use client'

import { useState, useTransition, useRef, useCallback, useEffect } from 'react'
import { createChapter, updateChapter, deleteChapter } from '@/lib/actions/chapters'
import type { Chapter, ChapterStatus } from '@/lib/supabase/types'
import { CHAPTER_STATUS_LABELS } from '@/lib/supabase/types'

type Props =
  | { mode: 'create'; novelId: string }
  | { mode: 'edit'; novelId: string; chapter: Chapter }

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

const AUTOSAVE_DELAY = 3000 // 3秒後に自動保存

export default function ChapterEditor(props: Props) {
  const isEdit = props.mode === 'edit'
  const chapter = isEdit ? props.chapter : null

  const [title, setTitle] = useState(chapter?.title ?? '')
  const [body, setBody] = useState(chapter?.body ?? '')
  const [status, setStatus] = useState<ChapterStatus>(chapter?.status ?? 'draft')
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [showDelete, setShowDelete] = useState(false)
  const [isPending, startTransition] = useTransition()

  const autosaveTimer = useRef<NodeJS.Timeout | null>(null)
  const wordCount = body.length

  // ============================================================
  // 保存処理（手動・自動保存で共用）
  // ============================================================
  const save = useCallback(
    () => {
      if (!title.trim()) return

      setError(null)
      setSaveState('saving')

      const formData = new FormData()
      formData.set('title', title)
      formData.set('body', body)
      formData.set('status', status)

      startTransition(async () => {
        const result = isEdit
          ? await updateChapter(chapter!.id, props.novelId, formData)
          : await createChapter(props.novelId, formData) // create は内部で redirect

        if (result && !result.success) {
          setError(result.error)
          setSaveState('error')
        } else {
          setSaveState('saved')
          setTimeout(() => setSaveState('idle'), 2000)
        }
      })
    },
    [title, body, status, isEdit, chapter, props.novelId]
  )

  // ============================================================
  // 自動保存（編集モードのみ）
  // ============================================================
  useEffect(() => {
    if (!isEdit) return
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(() => save(), AUTOSAVE_DELAY)
    return () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current) }
  }, [title, body, status, isEdit, save])

  // ============================================================
  // 手動保存（Ctrl+S / Cmd+S）
  // ============================================================
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        save()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [save])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    save()
  }

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteChapter(chapter!.id, props.novelId)
      if (!result.success) setError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ツールバー */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          {/* ステータス切替 */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ChapterStatus)}
            className="input w-auto text-xs py-1.5"
          >
            {(Object.entries(CHAPTER_STATUS_LABELS) as [ChapterStatus, string][]).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>

          {/* 文字数カウント */}
          <span className="text-xs text-muted">
            {wordCount.toLocaleString()} 字
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* 保存状態インジケーター */}
          <span className={`text-xs ${
            saveState === 'saving' ? 'text-muted' :
            saveState === 'saved'  ? 'text-pos'   :
            saveState === 'error'  ? 'text-neg'   : 'text-muted'
          }`}>
            {saveState === 'saving' ? '保存中...' :
             saveState === 'saved'  ? '✓ 保存済み' :
             saveState === 'error'  ? '保存失敗' :
             isEdit ? '自動保存 ON' : ''}
          </span>

          {/* 手動保存ボタン */}
          <button
            type="submit"
            disabled={isPending || !title.trim()}
            className="btn btn-primary text-xs px-3 py-1.5"
          >
            {isEdit ? '保存' : '作成して執筆開始'}
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={() => setShowDelete(!showDelete)}
              className="btn btn-secondary text-xs px-3 py-1.5"
            >
              ⋮
            </button>
          )}
        </div>
      </div>

      {/* タイトル */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-transparent border-none outline-none text-2xl font-bold text-main placeholder-muted focus:ring-0 py-2"
        placeholder="章のタイトル"
        required
      />

      <hr style={{ borderColor: 'var(--border_sub)' }} />

      {/* 本文エディタ */}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="editor-textarea"
        placeholder={`本文を入力してください...\n\n段落の区切りは空行で表現します。\n自動保存は入力停止から3秒後に実行されます（Ctrl+S / Cmd+S でも保存）。`}
      />

      {/* エラー */}
      {error && (
        <div className="rounded-lg bg-lv3 border border-neg/30 px-4 py-3 text-neg text-sm">
          {error}
        </div>
      )}

      {/* 削除確認 */}
      {showDelete && isEdit && (
        <div className="rounded-xl border border-neg/30 bg-lv3 p-4 space-y-3">
          <p className="text-sm font-medium text-main">この章を削除しますか？</p>
          <p className="text-xs text-sub">
            「{chapter!.title}」が完全に削除されます。この操作は元に戻せません。
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="btn btn-danger text-xs"
            >
              {isPending ? '削除中...' : '削除する'}
            </button>
            <button
              type="button"
              onClick={() => setShowDelete(false)}
              className="btn btn-secondary text-xs"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* ヒント */}
      {!isEdit && (
        <p className="text-xs text-muted text-center">
          作成後は自動保存が有効になります
        </p>
      )}
    </form>
  )
}

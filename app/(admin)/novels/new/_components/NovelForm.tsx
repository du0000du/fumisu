'use client'

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createNovel, updateNovel } from '@/lib/actions/novels'
import type { Novel, NovelGenre, NovelStatus } from '@/lib/supabase/types'
import { GENRE_LABELS, STATUS_LABELS } from '@/lib/supabase/types'

type Props =
  | { mode: 'create' }
  | { mode: 'edit'; novel: Novel; onSuccess?: () => void }

const GENRES = Object.entries(GENRE_LABELS) as [NovelGenre, string][]
const STATUSES = Object.entries(STATUS_LABELS) as [NovelStatus, string][]

const MAX_TITLE = 100
const MAX_DESC = 500

export default function NovelForm(props: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const defaultValues = props.mode === 'edit' ? props.novel : null

  const [title, setTitle] = useState(defaultValues?.title ?? '')
  const [description, setDescription] = useState(defaultValues?.description ?? '')

  const titleError =
    title.trim().length === 0
      ? 'タイトルは必須です'
      : title.length > MAX_TITLE
      ? `${MAX_TITLE}字以内で入力してください`
      : ''
  const descError =
    description.length > MAX_DESC
      ? `${MAX_DESC}字以内で入力してください`
      : ''

  const hasError = Boolean(titleError) || Boolean(descError)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (hasError) return
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result =
        props.mode === 'edit'
          ? await updateNovel(props.novel.id, formData)
          : await createNovel(formData)

      if (!result.success) {
        setError(result.error)
      } else if (props.mode === 'edit') {
        setSuccess(true)
        props.onSuccess?.()
        setTimeout(() => setSuccess(false), 2000)
      }
      // create の場合は Server Action 内で redirect される
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* タイトル */}
      <div>
        <label htmlFor="title" className="label">
          タイトル <span className="text-neg">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className="input"
          placeholder="作品のタイトルを入力"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={MAX_TITLE + 50}
          aria-invalid={Boolean(titleError)}
          aria-describedby="title-help"
          required
        />
        <div id="title-help" className="flex items-center justify-between mt-1">
          <p className={`text-xs ${titleError ? 'text-neg' : 'text-muted'}`}>
            {titleError || '　'}
          </p>
          <p className={`text-xs ${title.length > MAX_TITLE ? 'text-neg' : 'text-muted'}`}>
            {title.length} / {MAX_TITLE}
          </p>
        </div>
      </div>

      {/* ジャンル + ステータス */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="genre" className="label">ジャンル</label>
          <select
            id="genre"
            name="genre"
            className="input"
            defaultValue={defaultValues?.genre ?? 'other'}
          >
            {GENRES.map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="label">公開状態</label>
          <select
            id="status"
            name="status"
            className="input"
            defaultValue={defaultValues?.status ?? 'draft'}
          >
            {STATUSES.map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* あらすじ */}
      <div>
        <label htmlFor="description" className="label">あらすじ</label>
        <textarea
          id="description"
          name="description"
          className="input"
          placeholder="作品のあらすじを入力（任意）"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          aria-invalid={Boolean(descError)}
          aria-describedby="description-help"
        />
        <div id="description-help" className="flex items-center justify-between mt-1">
          <p className={`text-xs ${descError ? 'text-neg' : 'text-muted'}`}>
            {descError || '　'}
          </p>
          <p className={`text-xs ${description.length > MAX_DESC ? 'text-neg' : 'text-muted'}`}>
            {description.length} / {MAX_DESC}
          </p>
        </div>
      </div>

      {/* 作者メモ（非公開） */}
      <div>
        <label htmlFor="notes" className="label">
          作者メモ
          <span className="text-xs text-muted ml-1">（非公開・キャラ設定・世界観など）</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          className="input"
          placeholder="キャラクター設定、世界観メモ、プロット構想など（読者には見えません）"
          defaultValue={defaultValues?.notes ?? ''}
          rows={4}
        />
      </div>

      {/* エラー・成功メッセージ */}
      {error && (
        <div className="rounded-lg bg-lv3 border border-neg/30 px-4 py-3 text-neg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-lv3 border border-pos/30 px-4 py-3 text-pos text-sm">
          ✓ 保存しました
        </div>
      )}

      {/* アクションボタン — スマホは縦並びでタップしやすく */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending || hasError}
          className="btn btn-primary w-full sm:w-auto sm:min-w-[120px]"
        >
          {isPending
            ? '保存中...'
            : props.mode === 'create'
            ? '作品を作成する'
            : '変更を保存'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-secondary w-full sm:w-auto"
        >
          キャンセル
        </button>
      </div>
    </form>
  )
}

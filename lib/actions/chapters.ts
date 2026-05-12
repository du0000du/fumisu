'use server'

/**
 * Server Actions — chapters
 */

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getNextChapterNumber } from '@/lib/db/chapters'
import type { ChapterStatus } from '@/lib/supabase/types'

type ActionResult =
  | { success: true; id?: string }
  | { success: false; error: string }

// ============================================================
// 章作成
// ============================================================
export async function createChapter(novelId: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '認証が必要です' }

  const title = formData.get('title')?.toString().trim()
  const body  = formData.get('body')?.toString() || ''
  const status = (formData.get('status')?.toString() || 'draft') as ChapterStatus

  if (!title || title.length === 0) return { success: false, error: '章タイトルは必須です' }
  if (title.length > 200) return { success: false, error: '章タイトルは200文字以内にしてください' }

  // 次の章番号を自動採番
  const chapterNumber = await getNextChapterNumber(novelId)

  const { data, error } = await supabase
    .from('chapters')
    .insert({
      novel_id: novelId,
      user_id: user.id,
      title,
      body,
      chapter_number: chapterNumber,
      status,
      published_at: status === 'published' ? new Date().toISOString() : null,
    })
    .select('id')
    .single()

  if (error) return { success: false, error: `作成に失敗しました: ${error.message}` }

  revalidatePath(`/novels/${novelId}/chapters`)
  redirect(`/novels/${novelId}/chapters/${data.id}`)
}

// ============================================================
// 章更新（自動保存対応）
// ============================================================
export async function updateChapter(
  id: string,
  novelId: string,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '認証が必要です' }

  const title  = formData.get('title')?.toString().trim()
  const body   = formData.get('body')?.toString() || ''
  const status = (formData.get('status')?.toString() || 'draft') as ChapterStatus

  if (!title || title.length === 0) return { success: false, error: '章タイトルは必須です' }

  const { error } = await supabase
    .from('chapters')
    .update({
      title,
      body,
      status,
      published_at:
        status === 'published'
          ? new Date().toISOString()
          : null,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { success: false, error: `更新に失敗しました: ${error.message}` }

  revalidatePath(`/novels/${novelId}/chapters`)
  revalidatePath(`/novels/${novelId}/chapters/${id}`)
  return { success: true }
}

// ============================================================
// 章削除
// ============================================================
export async function deleteChapter(id: string, novelId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '認証が必要です' }

  const { error } = await supabase
    .from('chapters')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { success: false, error: `削除に失敗しました: ${error.message}` }

  revalidatePath(`/novels/${novelId}/chapters`)
  redirect(`/novels/${novelId}/chapters`)
}

// ============================================================
// 章の順序入れ替え
// ============================================================
export async function reorderChapters(
  novelId: string,
  updates: { id: string; chapter_number: number }[]
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '認証が必要です' }

  // バッチ更新（各章の chapter_number を更新）
  const promises = updates.map(({ id, chapter_number }) =>
    supabase
      .from('chapters')
      .update({ chapter_number })
      .eq('id', id)
      .eq('user_id', user.id)
  )

  const results = await Promise.all(promises)
  const failed = results.find((r) => r.error)
  if (failed?.error) return { success: false, error: `並び替えに失敗しました: ${failed.error.message}` }

  revalidatePath(`/novels/${novelId}/chapters`)
  return { success: true }
}

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
// 章の順序入れ替え（隣接スワップ）— ↑↓ボタンから呼び出す
// ============================================================
export async function reorderChapter(
  chapterId: string,
  novelId: string,
  direction: 'up' | 'down'
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '認証が必要です' }

  const { data: target, error: targetErr } = await supabase
    .from('chapters')
    .select('id, chapter_number')
    .eq('id', chapterId)
    .eq('user_id', user.id)
    .eq('novel_id', novelId)
    .single()

  if (targetErr || !target) {
    return { success: false, error: '対象の章が見つかりません' }
  }

  const baseQuery = supabase
    .from('chapters')
    .select('id, chapter_number')
    .eq('user_id', user.id)
    .eq('novel_id', novelId)

  const neighborQuery =
    direction === 'up'
      ? baseQuery.lt('chapter_number', target.chapter_number).order('chapter_number', { ascending: false })
      : baseQuery.gt('chapter_number', target.chapter_number).order('chapter_number', { ascending: true })

  const { data: neighbor, error: neighborErr } = await neighborQuery.limit(1).maybeSingle()

  if (neighborErr) {
    return { success: false, error: `並び替えに失敗しました: ${neighborErr.message}` }
  }
  if (!neighbor) {
    return { success: true }
  }

  // 一意制約衝突を避けるため、targetを一時値→neighborの番号→target元番号 の順で更新
  const TEMP = -1
  const targetNumber = target.chapter_number
  const neighborNumber = neighbor.chapter_number

  const step1 = await supabase
    .from('chapters')
    .update({ chapter_number: TEMP })
    .eq('id', target.id)
    .eq('user_id', user.id)
  if (step1.error) return { success: false, error: `並び替えに失敗しました: ${step1.error.message}` }

  const step2 = await supabase
    .from('chapters')
    .update({ chapter_number: targetNumber })
    .eq('id', neighbor.id)
    .eq('user_id', user.id)
  if (step2.error) return { success: false, error: `並び替えに失敗しました: ${step2.error.message}` }

  const step3 = await supabase
    .from('chapters')
    .update({ chapter_number: neighborNumber })
    .eq('id', target.id)
    .eq('user_id', user.id)
  if (step3.error) return { success: false, error: `並び替えに失敗しました: ${step3.error.message}` }

  revalidatePath(`/novels/${novelId}/chapters`)
  return { success: true }
}

// ============================================================
// 章の順序入れ替え（バッチ）
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

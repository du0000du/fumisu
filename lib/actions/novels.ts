'use server'

/**
 * Server Actions — novels
 * フォームからの mutations をここに集約する。
 * 入力値は必ずバリデーションし、エラーは Result 型で返す。
 */

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { NovelStatus, NovelGenre } from '@/lib/supabase/types'

// ============================================================
// 結果型（エラーを例外で投げず呼び元で安全に扱える）
// ============================================================
type ActionResult =
  | { success: true; id?: string }
  | { success: false; error: string }

// ============================================================
// 作品作成
// ============================================================
export async function createNovel(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '認証が必要です' }

  const title = formData.get('title')?.toString().trim()
  const description = formData.get('description')?.toString().trim() || null
  const genre = (formData.get('genre')?.toString() || 'other') as NovelGenre
  const status = (formData.get('status')?.toString() || 'draft') as NovelStatus
  const notes = formData.get('notes')?.toString().trim() || null

  if (!title || title.length === 0) return { success: false, error: 'タイトルは必須です' }
  if (title.length > 200) return { success: false, error: 'タイトルは200文字以内にしてください' }

  const { data, error } = await supabase
    .from('novels')
    .insert({ user_id: user.id, title, description, genre, status, notes })
    .select('id')
    .single()

  if (error) return { success: false, error: `作成に失敗しました: ${error.message}` }

  revalidatePath('/novels')
  revalidatePath('/dashboard')
  redirect(`/novels/${data.id}/chapters`)
}

// ============================================================
// 作品更新
// ============================================================
export async function updateNovel(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '認証が必要です' }

  const title = formData.get('title')?.toString().trim()
  const description = formData.get('description')?.toString().trim() || null
  const genre = (formData.get('genre')?.toString() || 'other') as NovelGenre
  const status = (formData.get('status')?.toString() || 'draft') as NovelStatus
  const notes = formData.get('notes')?.toString().trim() || null

  if (!title || title.length === 0) return { success: false, error: 'タイトルは必須です' }
  if (title.length > 200) return { success: false, error: 'タイトルは200文字以内にしてください' }

  const { error } = await supabase
    .from('novels')
    .update({ title, description, genre, status, notes })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { success: false, error: `更新に失敗しました: ${error.message}` }

  revalidatePath(`/novels/${id}`)
  revalidatePath('/novels')
  revalidatePath('/dashboard')
  return { success: true }
}

// ============================================================
// 作品削除
// ============================================================
export async function deleteNovel(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '認証が必要です' }

  const { error } = await supabase
    .from('novels')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { success: false, error: `削除に失敗しました: ${error.message}` }

  revalidatePath('/novels')
  revalidatePath('/dashboard')
  redirect('/novels')
}

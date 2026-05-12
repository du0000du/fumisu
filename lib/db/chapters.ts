/**
 * DB アクセス層 — chapters
 * すべてサーバーサイド専用。直接 DB と対話する純粋関数群。
 */

import { createClient } from '@/lib/supabase/server'
import type { Chapter } from '@/lib/supabase/types'

// ============================================================
// 読み取り
// ============================================================

/** 作品の全章一覧（章番号順） */
export async function getChaptersByNovelId(novelId: string, userId: string): Promise<Chapter[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('novel_id', novelId)
    .eq('user_id', userId)
    .order('chapter_number', { ascending: true })

  if (error) throw new Error(`getChaptersByNovelId: ${error.message}`)
  return (data ?? []) as Chapter[]
}

/** 章1件を取得（オーナー確認付き） */
export async function getChapterById(id: string, userId: string): Promise<Chapter | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`getChapterById: ${error.message}`)
  }
  return data as Chapter
}

/** 次の章番号を取得（最大 + 1） */
export async function getNextChapterNumber(novelId: string): Promise<number> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('chapters')
    .select('chapter_number')
    .eq('novel_id', novelId)
    .order('chapter_number', { ascending: false })
    .limit(1)
    .single()

  return data ? data.chapter_number + 1 : 1
}

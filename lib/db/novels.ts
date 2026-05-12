/**
 * DB アクセス層 — novels
 * すべてサーバーサイド専用。直接 DB と対話する純粋関数群。
 * ページ・Server Actions から呼び出す。
 */

import { createClient } from '@/lib/supabase/server'
import type { Novel, NovelWithStats } from '@/lib/supabase/types'

// ============================================================
// 読み取り
// ============================================================

/** 執筆者の全作品一覧（集計付き）を取得 */
export async function getNovelsWithStats(userId: string): Promise<NovelWithStats[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('novels')
    .select(`
      *,
      chapters(word_count, updated_at)
    `)
    .eq('user_id', userId)
    .order('sort_order', { ascending: true })
    .order('updated_at', { ascending: false })

  if (error) throw new Error(`getNovelsWithStats: ${error.message}`)

  return (data ?? []).map((row) => {
    const chapters = (row.chapters as { word_count: number; updated_at: string }[]) ?? []
    return {
      ...row,
      chapter_count: chapters.length,
      total_word_count: chapters.reduce((s, c) => s + (c.word_count ?? 0), 0),
      latest_chapter_at: chapters.length > 0
        ? chapters.sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0].updated_at
        : null,
    } as NovelWithStats
  })
}

/** 作品1件を取得（オーナー確認付き） */
export async function getNovelById(id: string, userId: string): Promise<Novel | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('novels')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // not found
    throw new Error(`getNovelById: ${error.message}`)
  }
  return data as Novel
}

// ============================================================
// 集計（ダッシュボード用）
// ============================================================

export type NovelStats = {
  totalNovels: number
  totalChapters: number
  totalWordCount: number
  ongoingNovels: number
  completedNovels: number
}

export async function getNovelStats(userId: string): Promise<NovelStats> {
  const supabase = await createClient()

  const { data: novels } = await supabase
    .from('novels')
    .select('status')
    .eq('user_id', userId)

  const { data: chapters } = await supabase
    .from('chapters')
    .select('word_count')
    .eq('user_id', userId)

  const novelList = novels ?? []
  const chapterList = chapters ?? []

  return {
    totalNovels:    novelList.length,
    totalChapters:  chapterList.length,
    totalWordCount: chapterList.reduce((s, c) => s + (c.word_count ?? 0), 0),
    ongoingNovels:  novelList.filter((n) => n.status === 'ongoing').length,
    completedNovels: novelList.filter((n) => n.status === 'completed').length,
  }
}

/** 直近更新作品（最大N件） */
export async function getRecentNovels(userId: string, limit = 5): Promise<Novel[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('novels')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`getRecentNovels: ${error.message}`)
  return (data ?? []) as Novel[]
}

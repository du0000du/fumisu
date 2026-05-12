/**
 * Supabase Database 型定義
 * テーブルを追加したらここに型を追加する
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================================
// novels（作品）
// ============================================================
export type NovelStatus = 'draft' | 'ongoing' | 'completed' | 'private'
export type NovelGenre =
  | 'romance'
  | 'fantasy'
  | 'sf'
  | 'mystery'
  | 'horror'
  | 'literary'
  | 'essay'
  | 'other'

export type Novel = {
  id: string
  user_id: string
  title: string
  description: string | null
  genre: NovelGenre
  status: NovelStatus
  cover_image_url: string | null
  notes: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

/** novels に章集計を JOIN した拡張型 */
export type NovelWithStats = Novel & {
  chapter_count: number
  total_word_count: number
  latest_chapter_at: string | null
}

// ============================================================
// chapters（章）
// ============================================================
export type ChapterStatus = 'draft' | 'published'

export type Chapter = {
  id: string
  novel_id: string
  user_id: string
  title: string
  body: string
  chapter_number: number
  status: ChapterStatus
  published_at: string | null
  word_count: number
  created_at: string
  updated_at: string
}

// ============================================================
// tags / novel_tags
// ============================================================
export type Tag = {
  id: string
  name: string
  created_at: string
}

export type NovelTag = {
  novel_id: string
  tag_id: string
}

// ============================================================
// ジャンル表示名マッピング
// ============================================================
export const GENRE_LABELS: Record<NovelGenre, string> = {
  romance:  '恋愛',
  fantasy:  'ファンタジー',
  sf:       'SF',
  mystery:  'ミステリー',
  horror:   'ホラー',
  literary: '純文学',
  essay:    'エッセイ',
  other:    'その他',
}

export const STATUS_LABELS: Record<NovelStatus, string> = {
  draft:     '下書き',
  ongoing:   '連載中',
  completed: '完結',
  private:   '非公開',
}

export const CHAPTER_STATUS_LABELS: Record<ChapterStatus, string> = {
  draft:     '下書き',
  published: '公開',
}

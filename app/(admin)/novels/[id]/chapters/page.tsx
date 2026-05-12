import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getNovelById } from '@/lib/db/novels'
import { getChaptersByNovelId } from '@/lib/db/chapters'
import { NovelStatusBadge, ChapterStatusBadge } from '../../../_components/StatusBadge'

export const metadata: Metadata = { title: '章管理' }

export default async function ChaptersPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [novel, chapters] = await Promise.all([
    getNovelById(params.id, user.id),
    getChaptersByNovelId(params.id, user.id),
  ])
  if (!novel) notFound()

  const totalWordCount = chapters.reduce((s, c) => s + c.word_count, 0)

  return (
    <div className="space-y-6">
      {/* パンくず */}
      <nav className="text-sm text-sub flex items-center gap-1 flex-wrap">
        <Link href="/novels" className="hover:text-main">作品管理</Link>
        <span>/</span>
        <Link href={`/novels/${novel.id}`} className="hover:text-main truncate max-w-[200px]">
          {novel.title}
        </Link>
        <span>/</span>
        <span className="text-muted">章管理</span>
      </nav>

      {/* ヘッダー */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-main truncate">{novel.title}</h1>
            <NovelStatusBadge status={novel.status} />
          </div>
          <p className="text-xs text-muted mt-1">
            {chapters.length} 章 · {totalWordCount.toLocaleString()} 字
          </p>
        </div>
        <Link href={`/novels/${novel.id}/chapters/new`} className="btn btn-primary shrink-0">
          ＋ 新しい章
        </Link>
      </div>

      {/* 章リスト */}
      {chapters.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-3xl mb-3">✍️</p>
          <p className="text-main font-medium">まだ章がありません</p>
          <p className="text-sub text-sm mt-1 mb-4">最初の章を追加して執筆を始めましょう</p>
          <Link href={`/novels/${novel.id}/chapters/new`} className="btn btn-primary">
            最初の章を書く
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {chapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/novels/${novel.id}/chapters/${chapter.id}`}
              className="card flex items-center justify-between gap-3 hover:border-theme transition-colors group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-muted text-xs w-6 text-right shrink-0">
                  {chapter.chapter_number}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-main truncate group-hover:text-theme transition-colors">
                    {chapter.title}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {chapter.word_count.toLocaleString()} 字 ·{' '}
                    {new Date(chapter.updated_at).toLocaleDateString('ja-JP', {
                      month: 'short', day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <ChapterStatusBadge status={chapter.status} />
            </Link>
          ))}
        </div>
      )}

      {/* 作品編集へのリンク */}
      <div className="pt-2">
        <Link href={`/novels/${novel.id}`} className="text-sm text-sub hover:text-main underline">
          ← 作品情報を編集する
        </Link>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getNovelsWithStats } from '@/lib/db/novels'
import { NovelStatusBadge } from '../_components/StatusBadge'
import { GENRE_LABELS } from '@/lib/supabase/types'

export const metadata: Metadata = { title: '作品管理' }

export default async function NovelsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const novels = await getNovelsWithStats(user.id)

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-main">作品管理</h1>
          <p className="text-sub text-sm mt-1">{novels.length} 件の作品</p>
        </div>
        <Link href="/novels/new" className="btn btn-primary">
          ＋ 新しい作品
        </Link>
      </div>

      {/* 作品リスト */}
      {novels.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-5xl mb-4">📖</p>
          <p className="text-main font-medium text-lg">まだ作品がありません</p>
          <p className="text-sub text-sm mt-2 mb-6">
            「新しい作品」ボタンから最初の作品を作成しましょう
          </p>
          <Link href="/novels/new" className="btn btn-primary">
            最初の作品を作成する
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {novels.map((novel) => (
            <div key={novel.id} className="card hover:border-theme transition-colors group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/novels/${novel.id}/chapters`}
                      className="font-semibold text-main hover:text-theme transition-colors"
                    >
                      {novel.title}
                    </Link>
                    <NovelStatusBadge status={novel.status} />
                  </div>

                  {novel.description && (
                    <p className="text-sub text-sm mt-1 line-clamp-2">{novel.description}</p>
                  )}

                  {/* メタ情報 */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted flex-wrap">
                    <span>{GENRE_LABELS[novel.genre]}</span>
                    <span>·</span>
                    <span>{novel.chapter_count} 章</span>
                    <span>·</span>
                    <span>{novel.total_word_count.toLocaleString()} 字</span>
                    <span>·</span>
                    <span>
                      {new Date(novel.updated_at).toLocaleDateString('ja-JP', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })} 更新
                    </span>
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/novels/${novel.id}/chapters`}
                    className="btn btn-secondary text-xs px-3 py-1.5"
                  >
                    章を管理
                  </Link>
                  <Link
                    href={`/novels/${novel.id}`}
                    className="btn btn-secondary text-xs px-3 py-1.5"
                  >
                    編集
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

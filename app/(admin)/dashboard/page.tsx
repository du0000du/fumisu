import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getNovelStats, getRecentNovels, getTodayWordCount } from '@/lib/db/novels'
import { NovelStatusBadge } from '../_components/StatusBadge'
import { GENRE_LABELS } from '@/lib/supabase/types'

export const metadata: Metadata = { title: 'ダッシュボード' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [stats, recentNovels, todayWordCount] = await Promise.all([
    getNovelStats(user.id),
    getRecentNovels(user.id, 5),
    getTodayWordCount(user.id),
  ])

  return (
    <div className="space-y-6 sm:space-y-8 w-full min-w-0">
      {/* ヘッダー */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-main">ダッシュボード</h1>
        <p className="text-sub text-sm mt-1">執筆の全体像を確認できます</p>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
        <StatCard
          label="今日"
          value={todayWordCount.toLocaleString()}
          unit="字"
          highlight
        />
        <StatCard label="作品数" value={stats.totalNovels} unit="作品" />
        <StatCard label="総章数" value={stats.totalChapters} unit="章" />
        <StatCard
          label="総文字数"
          value={stats.totalWordCount >= 10000
            ? `${(stats.totalWordCount / 10000).toFixed(1)}万`
            : stats.totalWordCount.toLocaleString()}
          unit="字"
        />
        <StatCard label="完結作品" value={stats.completedNovels} unit="作品" />
      </div>

      {/* 最近の作品 */}
      <section>
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-main">最近更新した作品</h2>
          <Link href="/novels" className="text-sm text-theme hover:underline shrink-0">
            すべて見る →
          </Link>
        </div>

        {recentNovels.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2">
            {recentNovels.map((novel) => (
              <Link
                key={novel.id}
                href={`/novels/${novel.id}/chapters`}
                className="card flex items-center justify-between gap-3 hover:border-theme transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-main text-sm truncate group-hover:text-theme transition-colors">
                    {novel.title}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {GENRE_LABELS[novel.genre]} ·{' '}
                    {new Date(novel.updated_at).toLocaleDateString('ja-JP', {
                      month: 'short', day: 'numeric',
                    })} 更新
                  </p>
                </div>
                <NovelStatusBadge status={novel.status} />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* クイックアクション */}
      <section>
        <h2 className="text-base sm:text-lg font-semibold text-main mb-4">クイックアクション</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/novels/new"
            className="card flex items-center gap-3 hover:border-theme transition-colors group"
          >
            <span className="text-2xl">✍️</span>
            <div>
              <p className="font-medium text-main text-sm group-hover:text-theme transition-colors">
                新しい作品を始める
              </p>
              <p className="text-xs text-muted">作品を作成して執筆を開始</p>
            </div>
          </Link>
          <Link
            href="/novels"
            className="card flex items-center gap-3 hover:border-theme transition-colors group"
          >
            <span className="text-2xl">📚</span>
            <div>
              <p className="font-medium text-main text-sm group-hover:text-theme transition-colors">
                作品一覧を見る
              </p>
              <p className="text-xs text-muted">全作品の管理・編集</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}

function StatCard({
  label,
  value,
  unit,
  highlight = false,
}: {
  label: string
  value: number | string
  unit: string
  highlight?: boolean
}) {
  return (
    <div className={`card text-center min-w-0 ${highlight ? 'border-theme' : ''}`}>
      <p className={`text-xl sm:text-2xl font-bold truncate ${highlight ? 'text-theme' : 'text-main'}`}>{value}</p>
      <p className="text-xs text-muted mt-0.5">{unit}</p>
      <p className="text-xs text-sub mt-1 truncate">{label}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="card text-center py-8">
      <p className="text-4xl mb-3">📝</p>
      <p className="text-main font-medium">まだ作品がありません</p>
      <p className="text-sub text-sm mt-1 mb-4">最初の作品を作成して執筆を始めましょう</p>
      <Link href="/novels/new" className="btn btn-primary">
        作品を作成する
      </Link>
    </div>
  )
}

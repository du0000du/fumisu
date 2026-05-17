import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPublicNovelById } from '@/lib/db/novels'
import { getPublishedChaptersByNovelId } from '@/lib/db/chapters'
import { GENRE_LABELS, STATUS_LABELS } from '@/lib/supabase/types'

type Props = { params: { novelId: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const novel = await getPublicNovelById(params.novelId)
  if (!novel) return { title: '作品が見つかりません' }
  return {
    title: novel.title,
    description: novel.description ?? `${novel.title} — 文巣で公開中の作品`,
  }
}

export default async function ReaderNovelPage({ params }: Props) {
  const novel = await getPublicNovelById(params.novelId)
  if (!novel) notFound()

  const chapters = await getPublishedChaptersByNovelId(novel.id)
  const totalWordCount = chapters.reduce((s, c) => s + c.word_count, 0)
  const updatedAt = new Date(novel.updated_at).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 py-6 sm:py-10 min-w-0">
      {/* 作品ヘッダー */}
      <header className="mb-8 sm:mb-10">
        <p className="text-xs text-muted mb-2">
          {GENRE_LABELS[novel.genre]} · {STATUS_LABELS[novel.status]}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-main break-anywhere">
          {novel.title}
        </h1>
        <p className="text-xs text-muted mt-2">最終更新: {updatedAt}</p>

        {novel.description && (
          <p className="mt-5 text-sm sm:text-base text-sub whitespace-pre-wrap leading-relaxed break-anywhere">
            {novel.description}
          </p>
        )}
      </header>

      {/* 章一覧 */}
      <section aria-labelledby="chapter-heading">
        <div className="flex items-baseline justify-between mb-3">
          <h2 id="chapter-heading" className="text-base sm:text-lg font-semibold text-main">
            目次
          </h2>
          <p className="text-xs text-muted">
            全 {chapters.length} 章 · {totalWordCount.toLocaleString()} 字
          </p>
        </div>

        {chapters.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-3xl mb-3">📭</p>
            <p className="text-main font-medium">まだ公開された章がありません</p>
            <p className="text-sub text-sm mt-1">作者が章を公開すると、ここに表示されます。</p>
          </div>
        ) : (
          <ol className="space-y-2">
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <Link
                  href={`/read/${novel.id}/chapters/${chapter.id}`}
                  className="card flex items-center gap-3 hover:border-theme transition-colors group min-w-0"
                >
                  <span className="text-muted text-xs w-8 text-right shrink-0 tabular-nums">
                    {chapter.chapter_number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium text-main truncate group-hover:text-theme transition-colors">
                      {chapter.title}
                    </p>
                    <p className="text-xs text-muted mt-0.5 truncate">
                      {chapter.word_count.toLocaleString()} 字 ·{' '}
                      {new Date(chapter.updated_at).toLocaleDateString('ja-JP', {
                        month: 'short', day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className="text-muted text-sm shrink-0 group-hover:text-theme transition-colors" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}

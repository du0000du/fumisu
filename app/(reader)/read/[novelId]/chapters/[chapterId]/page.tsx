import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPublicNovelById } from '@/lib/db/novels'
import {
  getPublishedChapter,
  getPublishedChaptersByNovelId,
} from '@/lib/db/chapters'
import ChapterBody from './_components/ChapterBody'

type Props = { params: { novelId: string; chapterId: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [novel, chapter] = await Promise.all([
    getPublicNovelById(params.novelId),
    getPublishedChapter(params.novelId, params.chapterId),
  ])
  if (!novel || !chapter) return { title: '章が見つかりません' }
  return {
    title: `${chapter.title} - ${novel.title}`,
    description: chapter.body.slice(0, 100),
  }
}

export default async function ReaderChapterPage({ params }: Props) {
  const [novel, chapter, allChapters] = await Promise.all([
    getPublicNovelById(params.novelId),
    getPublishedChapter(params.novelId, params.chapterId),
    getPublishedChaptersByNovelId(params.novelId),
  ])
  if (!novel || !chapter) notFound()

  const currentIdx = allChapters.findIndex((c) => c.id === chapter.id)
  const prevChapter = currentIdx > 0 ? allChapters[currentIdx - 1] : null
  const nextChapter =
    currentIdx >= 0 && currentIdx < allChapters.length - 1
      ? allChapters[currentIdx + 1]
      : null
  const isLast = currentIdx === allChapters.length - 1

  return (
    <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 py-6 sm:py-10 min-w-0">
      {/* パンくず */}
      <nav className="text-xs sm:text-sm text-sub flex items-center gap-1 flex-wrap mb-4 min-w-0">
        <Link
          href={`/read/${novel.id}`}
          className="hover:text-main truncate max-w-[45vw] sm:max-w-[260px]"
        >
          {novel.title}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-muted">第{chapter.chapter_number}章</span>
      </nav>

      {/* 章タイトル */}
      <header className="mb-6 sm:mb-8">
        <p className="text-xs text-muted mb-1">第{chapter.chapter_number}章</p>
        <h1 className="text-xl sm:text-2xl font-bold text-main break-anywhere">
          {chapter.title}
        </h1>
      </header>

      {/* 本文（クライアント側で読書設定を反映） */}
      <ChapterBody body={chapter.body} />

      {/* 章間ナビゲーション */}
      <nav
        aria-label="章ナビゲーション"
        className="mt-10 sm:mt-14 grid grid-cols-2 gap-3 pt-6 border-t border-border-sub"
      >
        <div className="min-w-0">
          {prevChapter ? (
            <Link
              href={`/read/${novel.id}/chapters/${prevChapter.id}`}
              className="card hover:border-theme transition-colors block min-w-0 py-3"
            >
              <p className="text-xs text-muted">← 前の章</p>
              <p className="text-sm font-medium text-main truncate mt-1">
                {prevChapter.title}
              </p>
            </Link>
          ) : (
            <div className="block py-3 px-4 text-xs text-muted">
              （ここが最初の章です）
            </div>
          )}
        </div>

        <div className="min-w-0 text-right">
          {nextChapter ? (
            <Link
              href={`/read/${novel.id}/chapters/${nextChapter.id}`}
              className="card hover:border-theme transition-colors block min-w-0 py-3 text-right"
            >
              <p className="text-xs text-muted">次の章 →</p>
              <p className="text-sm font-medium text-main truncate mt-1">
                {nextChapter.title}
              </p>
            </Link>
          ) : isLast ? (
            <Link
              href={`/read/${novel.id}`}
              className="card hover:border-theme transition-colors block min-w-0 py-3 text-right"
            >
              <p className="text-xs text-muted">最終章</p>
              <p className="text-sm font-medium text-main truncate mt-1">
                作品トップへ戻る
              </p>
            </Link>
          ) : (
            <div className="block py-3 px-4 text-xs text-muted text-right">
              （次の章はありません）
            </div>
          )}
        </div>
      </nav>

      {/* 目次へ戻るリンク */}
      <div className="mt-6 text-center">
        <Link
          href={`/read/${novel.id}`}
          className="text-sm text-sub hover:text-main underline"
        >
          目次へ戻る
        </Link>
      </div>
    </div>
  )
}

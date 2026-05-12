import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getNovelById } from '@/lib/db/novels'
import { getChapterById } from '@/lib/db/chapters'
import ChapterEditor from './_components/ChapterEditor'

export const metadata: Metadata = { title: '章を編集' }

export default async function ChapterEditPage({
  params,
}: {
  params: { id: string; chapterId: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [novel, chapter] = await Promise.all([
    getNovelById(params.id, user.id),
    getChapterById(params.chapterId, user.id),
  ])
  if (!novel || !chapter) notFound()

  return (
    <div className="space-y-4">
      {/* パンくず */}
      <nav className="text-sm text-sub flex items-center gap-1 flex-wrap">
        <Link href="/novels" className="hover:text-main">作品管理</Link>
        <span>/</span>
        <Link href={`/novels/${novel.id}/chapters`} className="hover:text-main truncate max-w-[160px]">
          {novel.title}
        </Link>
        <span>/</span>
        <span className="text-muted truncate max-w-[120px]">第{chapter.chapter_number}章</span>
      </nav>

      <ChapterEditor mode="edit" novelId={params.id} chapter={chapter} />
    </div>
  )
}

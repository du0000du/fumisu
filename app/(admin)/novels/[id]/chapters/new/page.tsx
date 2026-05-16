import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getNovelById } from '@/lib/db/novels'
import ChapterEditor from '../[chapterId]/_components/ChapterEditor'

export const metadata: Metadata = { title: '新しい章を執筆' }

export default async function NewChapterPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const novel = await getNovelById(params.id, user.id)
  if (!novel) notFound()

  return (
    <div className="space-y-4 w-full min-w-0">
      {/* パンくず */}
      <nav className="text-sm text-sub flex items-center gap-1 flex-wrap min-w-0">
        <Link href="/novels" className="hover:text-main">作品管理</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/novels/${novel.id}/chapters`} className="hover:text-main truncate max-w-[35vw] sm:max-w-[160px]">
          {novel.title}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-muted">新しい章</span>
      </nav>

      <ChapterEditor mode="create" novelId={params.id} />
    </div>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getNovelById } from '@/lib/db/novels'
import NovelForm from '../new/_components/NovelForm'
import DeleteNovelButton from './_components/DeleteNovelButton'

export const metadata: Metadata = { title: '作品編集' }

export default async function NovelEditPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const novel = await getNovelById(params.id, user.id)
  if (!novel) notFound()

  return (
    <div className="space-y-8 max-w-2xl">
      {/* パンくず */}
      <nav className="text-sm text-sub flex items-center gap-1">
        <Link href="/novels" className="hover:text-main">作品管理</Link>
        <span>/</span>
        <span className="text-main truncate max-w-[200px]">{novel.title}</span>
        <span>/</span>
        <span className="text-muted">編集</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-main">作品編集</h1>
        <p className="text-sub text-sm mt-1 truncate">{novel.title}</p>
      </div>

      <NovelForm mode="edit" novel={novel} />

      {/* 章管理へのリンク */}
      <div className="border-t border-border-sub pt-6">
        <Link
          href={`/novels/${novel.id}/chapters`}
          className="btn btn-secondary inline-flex items-center gap-2"
        >
          📋 章を管理する
        </Link>
      </div>

      {/* 危険ゾーン */}
      <div className="border-t border-border-sub pt-6">
        <h2 className="text-sm font-semibold text-sub mb-3">危険な操作</h2>
        <DeleteNovelButton novelId={novel.id} novelTitle={novel.title} />
      </div>
    </div>
  )
}

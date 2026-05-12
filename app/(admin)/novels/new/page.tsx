import type { Metadata } from 'next'
import NovelForm from './_components/NovelForm'

export const metadata: Metadata = { title: '新しい作品を作成' }

export default function NewNovelPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-main">新しい作品を作成</h1>
        <p className="text-sub text-sm mt-1">基本情報を入力して作品を始めましょう</p>
      </div>
      <NovelForm mode="create" />
    </div>
  )
}

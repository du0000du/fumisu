'use client'

export default function BodyPreview({ body }: { body: string }) {
  const trimmed = body.trim()
  if (!trimmed) {
    return (
      <div className="text-sub text-sm py-12 text-center">
        本文がまだありません。「編集」タブから入力してください。
      </div>
    )
  }

  const paragraphs = body.split(/\n{2,}/).filter((p) => p.trim().length > 0)

  return (
    <article className="reading-content rounded-xl px-6 py-8 min-h-[calc(100vh-260px)]">
      {paragraphs.map((para, i) => (
        <p key={i} className="mb-4 leading-loose whitespace-pre-wrap">
          {para}
        </p>
      ))}
    </article>
  )
}

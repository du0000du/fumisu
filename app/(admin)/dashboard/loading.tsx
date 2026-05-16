export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* ヘッダー */}
      <div className="space-y-2">
        <div className="h-7 w-40 rounded bg-lv3" />
        <div className="h-3 w-56 rounded bg-lv3" />
      </div>

      {/* サマリーカード（実画面と同じ 5 枚） */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card text-center space-y-2">
            <div className="h-6 w-12 mx-auto rounded bg-lv3" />
            <div className="h-3 w-8 mx-auto rounded bg-lv3" />
            <div className="h-3 w-14 mx-auto rounded bg-lv3" />
          </div>
        ))}
      </div>

      {/* 最近の作品 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-40 rounded bg-lv3" />
          <div className="h-4 w-20 rounded bg-lv3" />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card flex items-center justify-between gap-3">
            <div className="space-y-2 flex-1">
              <div className="h-4 w-2/3 rounded bg-lv3" />
              <div className="h-3 w-1/3 rounded bg-lv3" />
            </div>
            <div className="h-5 w-16 rounded-full bg-lv3 shrink-0" />
          </div>
        ))}
      </section>

      {/* クイックアクション */}
      <section className="space-y-3">
        <div className="h-5 w-40 rounded bg-lv3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="card flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-lv3" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-1/2 rounded bg-lv3" />
                <div className="h-3 w-3/4 rounded bg-lv3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

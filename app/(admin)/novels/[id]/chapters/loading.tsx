export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* パンくず */}
      <div className="h-3 w-48 rounded bg-lv3" />

      {/* 作品ヘッダー */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="h-6 w-2/3 rounded bg-lv3" />
          <div className="h-3 w-32 rounded bg-lv3" />
        </div>
        <div className="h-9 w-28 rounded-lg bg-lv3 shrink-0" />
      </div>

      {/* ステータスセレクタ＋章追加ボタン */}
      <div className="flex items-center justify-between gap-3">
        <div className="h-8 w-36 rounded-lg bg-lv3" />
        <div className="h-9 w-28 rounded-lg bg-lv3" />
      </div>

      {/* 章カード（実画面の高さに合わせて 18 ≒ 4.5rem） */}
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card flex items-center justify-between gap-3">
            <div className="space-y-2 flex-1 min-w-0">
              <div className="h-4 w-1/2 rounded bg-lv3" />
              <div className="h-3 w-1/3 rounded bg-lv3" />
            </div>
            <div className="flex gap-1 shrink-0">
              <div className="h-7 w-7 rounded bg-lv3" />
              <div className="h-7 w-7 rounded bg-lv3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

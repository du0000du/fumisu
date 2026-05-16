export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* ヘッダー */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="h-7 w-32 rounded bg-lv3" />
          <div className="h-3 w-24 rounded bg-lv3" />
        </div>
        <div className="h-10 w-32 rounded-lg bg-lv3 shrink-0" />
      </div>

      {/* 作品カード */}
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1 min-w-0">
              <div className="h-5 w-2/3 rounded bg-lv3" />
              <div className="h-3 w-1/2 rounded bg-lv3" />
              <div className="h-3 w-1/3 rounded bg-lv3" />
            </div>
            <div className="h-5 w-16 rounded-full bg-lv3 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}

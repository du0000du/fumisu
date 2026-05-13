export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-3 w-48 rounded bg-lv3" />
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="h-6 w-2/3 rounded bg-lv3" />
          <div className="h-3 w-32 rounded bg-lv3" />
        </div>
        <div className="h-9 w-28 rounded-lg bg-lv3 shrink-0" />
      </div>
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card h-16 bg-lv2" />
        ))}
      </div>
    </div>
  )
}

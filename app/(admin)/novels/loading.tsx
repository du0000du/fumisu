export default function Loading() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 rounded bg-lv3" />
          <div className="h-3 w-20 rounded bg-lv3" />
        </div>
        <div className="h-9 w-28 rounded-lg bg-lv3" />
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card h-20 bg-lv2" />
      ))}
    </div>
  )
}

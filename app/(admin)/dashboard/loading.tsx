export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-40 rounded bg-lv3" />
        <div className="h-3 w-56 rounded bg-lv3" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card h-24 bg-lv2" />
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-5 w-40 rounded bg-lv3 mb-4" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card h-16 bg-lv2" />
        ))}
      </div>
    </div>
  )
}

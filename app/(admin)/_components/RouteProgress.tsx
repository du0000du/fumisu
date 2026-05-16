'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * 軽量なページ遷移プログレスバー（nprogress 相当の自前実装）
 * pathname が変わったタイミングで一時的に上部にバーを表示する
 */
export default function RouteProgress() {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // 既に表示中ならスキップしない（新規遷移として再アニメーション）
    setVisible(true)
    setProgress(15)

    const t1 = setTimeout(() => setProgress(55), 80)
    const t2 = setTimeout(() => setProgress(85), 220)
    const t3 = setTimeout(() => setProgress(100), 380)
    const t4 = setTimeout(() => {
      setVisible(false)
      setProgress(0)
    }, 600)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [pathname])

  return (
    <div
      aria-hidden="true"
      className="route-progress"
      style={{
        transform: `scaleX(${progress / 100})`,
        opacity: visible ? 1 : 0,
      }}
    />
  )
}

'use client'

import { useEffect, useState } from 'react'

/**
 * 下スクロール中は true（=ナビ非表示）、上スクロール / トップ付近では false。
 * R-005: 読書領域を最大化するためボトムナビを自動隠しにする。
 */
export function useShouldHideNav(threshold = 80) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false

    const update = () => {
      const y = window.scrollY
      const delta = y - lastY

      if (y < threshold) {
        // ページ上部では常に表示
        setHidden(false)
      } else if (delta > 6) {
        setHidden(true)
      } else if (delta < -6) {
        setHidden(false)
      }

      lastY = y
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return hidden
}

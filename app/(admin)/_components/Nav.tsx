'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'ダッシュボード', icon: '🏠' },
  { href: '/novels',    label: '作品管理',       icon: '📚' },
  { href: '/settings',  label: '設定',           icon: '⚙️' },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <>
      {/* サイドバー（PC） */}
      <aside className="hidden md:flex flex-col w-56 min-h-screen bg-lv2 border-r border-border-main p-4 gap-1 shrink-0">
        <div className="px-2 mb-6">
          <span className="text-xl font-bold text-main tracking-tight">📖 文巣</span>
          <p className="text-xs text-muted mt-0.5">執筆管理</p>
        </div>
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-theme text-theme-t'
                  : 'text-sub hover:bg-lv3 hover:text-main'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </aside>

      {/* ボトムナビ（スマホ） */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-lv2 border-t border-border-main flex z-50 safe-bottom">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-2 text-xs gap-0.5 transition-colors ${
                active ? 'text-theme' : 'text-sub'
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useShouldHideNav } from './useScrollDirection'

const navItems = [
  { href: '/dashboard', label: 'ダッシュボード', icon: '🏠' },
  { href: '/novels',    label: '作品管理',       icon: '📚' },
  { href: '/settings',  label: '設定',           icon: '⚙️' },
]

export default function Nav() {
  const pathname = usePathname()
  const hidden = useShouldHideNav()

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
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'text-theme font-semibold bg-lv3'
                  : 'text-sub font-medium hover:bg-lv3 hover:text-main'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </aside>

      {/* ボトムナビ（スマホ） */}
      <nav
        aria-label="メインナビゲーション"
        data-hidden={hidden ? 'true' : 'false'}
        className="md:hidden fixed bottom-0 left-0 right-0 bg-lv2 border-t border-border-main flex z-50 safe-bottom nav-hide-on-scroll"
      >
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-xs tap-target relative transition-colors ${
                active
                  ? 'text-theme font-bold'
                  : 'text-sub hover:text-main'
              }`}
            >
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-10 rounded-b bg-theme"
                />
              )}
              <span className={`text-xl leading-none ${active ? '' : 'opacity-80'}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}

/**
 * 読者向けレイアウト（R-019）
 * - 認証不要・公開ルート（/read/*）専用
 * - 管理画面ナビ（サイドバー・ボトムナビ）は表示しない
 * - シンプルなヘッダー（文巣ロゴ）＋本文 ＋ フッターのみ
 */
export default function ReaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-lv1 w-full max-w-full">
      <header className="border-b border-border-sub bg-lv2">
        <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <span className="text-lg sm:text-xl font-bold text-theme tracking-wide select-none">
            文巣
          </span>
          <span className="text-xs text-muted hidden sm:inline">
            読書ページ
          </span>
        </div>
      </header>

      <main className="flex-1 min-w-0 w-full">
        {children}
      </main>

      <footer className="border-t border-border-sub bg-lv2 mt-12">
        <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 py-4 text-xs text-muted text-center">
          © 文巣 — 書くことと読まれることを、一つの場所に。
        </div>
      </footer>
    </div>
  )
}

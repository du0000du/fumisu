import Nav from './_components/Nav'
import RouteProgress from './_components/RouteProgress'
import ThemeProvider from './_components/ThemeProvider'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <RouteProgress />
      <div className="min-h-screen bg-lv1 flex w-full max-w-full">
        {/* サイドバー（PC） */}
        <Nav />

        {/* メインコンテンツ。min-w-0 はフレックスはみ出し防止に必須 */}
        <main className="flex-1 min-w-0 flex flex-col min-h-screen">
          <div className="flex-1 px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 pb-28 md:pb-6 max-w-4xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

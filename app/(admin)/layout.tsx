import Nav from './_components/Nav'
import ThemeProvider from './_components/ThemeProvider'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-lv1 flex">
        {/* サイドバー（PC） */}
        <Nav />

        {/* メインコンテンツ */}
        <main className="flex-1 flex flex-col min-h-screen">
          <div className="flex-1 p-4 md:p-6 pb-24 md:pb-6 max-w-4xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

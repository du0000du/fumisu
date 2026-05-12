import type { Config } from 'tailwindcss'

const config: Config = {
  // dark モードはクラスベース（ThemeProvider が html に .dark を付与）
  darkMode: ['selector', ':is(.dark *)'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ============================================================
      // デザイントークン → Tailwind ユーティリティクラス マッピング
      //
      // 使い方:
      //   bg-lv1 / bg-lv2 / bg-lv3           → 背景レイヤー
      //   text-main / text-sub / text-muted    → テキスト
      //   bg-theme / text-theme-t              → ブランドカラー
      //   bg-accent / text-accent              → アクセント
      //   bg-reading / text-reading            → 読書UI専用
      //   border-main / border-sub             → ボーダー
      // ============================================================
      colors: {
        lv1:          'var(--bg_lv1)',
        lv2:          'var(--bg_lv2)',
        lv3:          'var(--bg_lv3)',
        main:         'var(--text_main)',
        sub:          'var(--text_sub)',
        muted:        'var(--text_muted)',
        theme:        'var(--theme)',
        'theme-t':    'var(--theme_text)',
        accent:       'var(--accent)',
        reading:      'var(--reading_bg)',
        'reading-t':  'var(--reading_text)',
        'border-main':'var(--border_main)',
        'border-sub': 'var(--border_sub)',
        pos:          'var(--pos)',
        neg:          'var(--neg)',
      },
      fontFamily: {
        reading: ['Georgia', 'Yu Mincho', 'YuMincho', '游明朝', 'serif'],
      },
      lineHeight: {
        reading: 'var(--reading_lh)',
      },
    },
  },
  plugins: [],
}
export default config

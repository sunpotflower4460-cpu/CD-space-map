import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages のリポジトリ名サブパスに合わせる。
  // ローカル開発では VITE_BASE 環境変数を設定しなければ '/' のままで動作する。
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  test: {
    environment: 'node',
  },
})

import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: [
      'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'components/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'composables/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'pages/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.nuxt/',
        'dist/',
        '.output/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/tests/**',
        '**/coverage/**'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '@components': resolve(__dirname, './components'),
      '@pages': resolve(__dirname, './pages'),
      '@stores': resolve(__dirname, './stores'),
      '@utils': resolve(__dirname, './utils'),
      '@types': resolve(__dirname, './types'),
      '@server': resolve(__dirname, './server'),
      '@assets': resolve(__dirname, './assets'),
      '~': resolve(__dirname, '.')
    }
  }
})
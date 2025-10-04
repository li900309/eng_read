import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],

  // 生产环境配置
  mode: 'production',

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },

  // 构建优化
  build: {
    outDir: 'dist',
    sourcemap: false, // 生产环境不生成 sourcemap
    minify: 'terser', // 使用 terser 压缩
    target: 'es2015', // 目标浏览器

    // 代码分割策略
    rollupOptions: {
      output: {
        // 手动代码分割
        manualChunks: {
          // React 相关
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // 状态管理
          'state-vendor': ['zustand', '@tanstack/react-query'],

          // UI 库
          'ui-vendor': ['framer-motion', 'react-hot-toast', 'lucide-react'],

          // 工具库
          'utils-vendor': ['axios', 'clsx', 'date-fns'],

          // 表单相关
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
        },

        // 资源文件命名
        chunkFileNames: (chunkInfo) => {
          return `js/${chunkInfo.name}-[hash].js`;
        },
        entryFileNames: (entryInfo) => {
          return `js/${entryInfo.name}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split('.').pop() || '';
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/woff|woff2|ttf|otf/i.test(extType)) {
            return `fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },

    // 压缩配置
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console
        drop_debugger: true, // 移除 debugger
        pure_funcs: ['console.log', 'console.info'], // 移除指定函数
      },
      mangle: {
        safari10: true, // 兼容 Safari 10
      },
    },

    // 构建报告
    reportCompressedSize: true,

    // 代码拆分的 chunk 大小警告限制 (KB)
    chunkSizeWarningLimit: 1000,
  },

  // 开发服务器配置（生产环境构建时不需要）
  server: {
    host: true,
    port: 3000,
  },

  // 预览服务器配置
  preview: {
    host: true,
    port: 4173,
  },

  // CSS 配置
  css: {
    devSourcemap: false,

    // PostCSS 配置
    postcss: './postcss.config.js',

    // CSS 模块化
    modules: false,

    // CSS 预处理器配置
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },

  // 环境变量配置
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },

  // 依赖优化
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      '@tanstack/react-query',
      'axios',
      'clsx',
      'date-fns',
      'framer-motion',
      'react-hot-toast',
      'lucide-react',
      'react-hook-form',
      '@hookform/resolvers',
      'zod',
    ],
  },

  // ESBuild 配置
  esbuild: {
    // 移除生产环境不需要的代码
    drop: ['console', 'debugger'],

    // 目标环境
    target: 'es2015',

    // 保留类名（用于调试）
    keepNames: false,
  },
});
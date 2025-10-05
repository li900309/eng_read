import antfu from '@antfu/eslint-config'

export default antfu({
  // Vue 3 + Nuxt.js 配置
  vue: true,
  typescript: true,

  // 启用的规则
  rules: {
    // Vue 3 Composition API
    'vue/multi-word-component-names': 'off',
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/custom-event-name-casing': ['error', 'camelCase'],
    'vue/define-macros-order': ['error', {
      order: ['defineProps', 'defineEmits']
    }],

    // TypeScript
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-import-type-side-effects': 'error',

    // 代码风格
    'node/prefer-global/process': 'off',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',

    // 空格和格式
    'arrow-spacing': 'error',
    'key-spacing': 'error',
    'keyword-spacing': 'error',
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always'
    }],

    // 导入排序
    'import/order': ['error', {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index'
      ],
      'newlines-between': 'always'
    }],

    // Console
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },

  // 全局变量
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly'
  },

  // Nuxt.js 特殊处理
  ignores: [
    'node_modules',
    '.nuxt',
    '.output',
    'dist',
    'coverage'
  ]
})
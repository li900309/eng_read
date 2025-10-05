<template>
  <component
    :is="tag"
    :type="tag === 'button' ? type : undefined"
    :to="tag === 'NuxtLink' ? to : undefined"
    :href="tag === 'a' ? to : undefined"
    :disabled="disabled"
    :class="buttonClasses"
    @click="handleClick"
  >
    <!-- 加载状态 -->
    <Icon
      v-if="loading"
      name="heroicons-arrow-path"
      class="animate-spin w-4 h-4 mr-2"
    />

    <!-- 图标 -->
    <Icon
      v-if="icon && !loading"
      :name="icon"
      :class="iconClasses"
    />

    <!-- 插槽内容 -->
    <span v-if="$slots.default" :class="textClasses">
      <slot />
    </span>

    <!-- 右侧图标 -->
    <Icon
      v-if="rightIcon && !loading"
      :name="rightIcon"
      :class="rightIconClasses"
    />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  variant?: 'solid' | 'outline' | 'ghost' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray'
  type?: 'button' | 'submit' | 'reset'
  icon?: string
  rightIcon?: string
  disabled?: boolean
  loading?: boolean
  block?: boolean
  rounded?: boolean
  to?: string
  tag?: 'button' | 'a' | 'NuxtLink'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  size: 'md',
  color: 'primary',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
  rounded: false,
  tag: 'button'
})

// Emits
const emit = defineEmits<{
  click: [event: Event]
}>()

// 计算样式
const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed'
  ]

  // 尺寸样式
  const sizeClasses = {
    xs: ['text-xs', 'px-2.5', 'py-1.5', 'gap-1'],
    sm: ['text-sm', 'px-3', 'py-2', 'gap-1.5'],
    md: ['text-sm', 'px-4', 'py-2.5', 'gap-2'],
    lg: ['text-base', 'px-5', 'py-3', 'gap-2'],
    xl: ['text-lg', 'px-6', 'py-3.5', 'gap-2.5']
  }

  // 变体和颜色样式
  const variantClasses = computed((): string[] => {
    const variants = {
      solid: {
        primary: [
          'bg-primary-600',
          'text-white',
          'border-primary-600',
          'hover:bg-primary-700',
          'focus:ring-primary-500',
          'active:bg-primary-800'
        ],
        secondary: [
          'bg-gray-600',
          'text-white',
          'border-gray-600',
          'hover:bg-gray-700',
          'focus:ring-gray-500',
          'active:bg-gray-800'
        ],
        success: [
          'bg-green-600',
          'text-white',
          'border-green-600',
          'hover:bg-green-700',
          'focus:ring-green-500',
          'active:bg-green-800'
        ],
        warning: [
          'bg-yellow-500',
          'text-white',
          'border-yellow-500',
          'hover:bg-yellow-600',
          'focus:ring-yellow-400',
          'active:bg-yellow-700'
        ],
        error: [
          'bg-red-600',
          'text-white',
          'border-red-600',
          'hover:bg-red-700',
          'focus:ring-red-500',
          'active:bg-red-800'
        ],
        gray: [
          'bg-gray-100',
          'text-gray-900',
          'border-gray-300',
          'hover:bg-gray-200',
          'focus:ring-gray-500',
          'active:bg-gray-300'
        ]
      },
      outline: {
        primary: [
          'bg-transparent',
          'text-primary-600',
          'border-primary-600',
          'hover:bg-primary-50',
          'focus:ring-primary-500',
          'dark:hover:bg-primary-900/20',
          'dark:text-primary-400'
        ],
        secondary: [
          'bg-transparent',
          'text-gray-600',
          'border-gray-300',
          'hover:bg-gray-50',
          'focus:ring-gray-500',
          'dark:hover:bg-gray-800',
          'dark:text-gray-400',
          'dark:border-gray-600'
        ],
        success: [
          'bg-transparent',
          'text-green-600',
          'border-green-600',
          'hover:bg-green-50',
          'focus:ring-green-500',
          'dark:hover:bg-green-900/20',
          'dark:text-green-400'
        ],
        warning: [
          'bg-transparent',
          'text-yellow-600',
          'border-yellow-500',
          'hover:bg-yellow-50',
          'focus:ring-yellow-400',
          'dark:hover:bg-yellow-900/20',
          'dark:text-yellow-400'
        ],
        error: [
          'bg-transparent',
          'text-red-600',
          'border-red-600',
          'hover:bg-red-50',
          'focus:ring-red-500',
          'dark:hover:bg-red-900/20',
          'dark:text-red-400'
        ],
        gray: [
          'bg-transparent',
          'text-gray-700',
          'border-gray-300',
          'hover:bg-gray-50',
          'focus:ring-gray-500',
          'dark:hover:bg-gray-800',
          'dark:text-gray-300',
          'dark:border-gray-600'
        ]
      },
      ghost: {
        primary: [
          'bg-transparent',
          'text-primary-600',
          'border-transparent',
          'hover:bg-primary-50',
          'focus:ring-primary-500',
          'dark:hover:bg-primary-900/20',
          'dark:text-primary-400'
        ],
        secondary: [
          'bg-transparent',
          'text-gray-600',
          'border-transparent',
          'hover:bg-gray-50',
          'focus:ring-gray-500',
          'dark:hover:bg-gray-800',
          'dark:text-gray-400'
        ],
        success: [
          'bg-transparent',
          'text-green-600',
          'border-transparent',
          'hover:bg-green-50',
          'focus:ring-green-500',
          'dark:hover:bg-green-900/20',
          'dark:text-green-400'
        ],
        warning: [
          'bg-transparent',
          'text-yellow-600',
          'border-transparent',
          'hover:bg-yellow-50',
          'focus:ring-yellow-400',
          'dark:hover:bg-yellow-900/20',
          'dark:text-yellow-400'
        ],
        error: [
          'bg-transparent',
          'text-red-600',
          'border-transparent',
          'hover:bg-red-50',
          'focus:ring-red-500',
          'dark:hover:bg-red-900/20',
          'dark:text-red-400'
        ],
        gray: [
          'bg-transparent',
          'text-gray-700',
          'border-transparent',
          'hover:bg-gray-50',
          'focus:ring-gray-500',
          'dark:hover:bg-gray-800',
          'dark:text-gray-300'
        ]
      },
      link: {
        primary: [
          'bg-transparent',
          'text-primary-600',
          'border-transparent',
          'hover:text-primary-700',
          'hover:underline',
          'focus:ring-primary-500',
          'p-0',
          'dark:text-primary-400',
          'dark:hover:text-primary-300'
        ],
        secondary: [
          'bg-transparent',
          'text-gray-600',
          'border-transparent',
          'hover:text-gray-700',
          'hover:underline',
          'focus:ring-gray-500',
          'p-0',
          'dark:text-gray-400',
          'dark:hover:text-gray-300'
        ],
        success: [
          'bg-transparent',
          'text-green-600',
          'border-transparent',
          'hover:text-green-700',
          'hover:underline',
          'focus:ring-green-500',
          'p-0',
          'dark:text-green-400',
          'dark:hover:text-green-300'
        ],
        warning: [
          'bg-transparent',
          'text-yellow-600',
          'border-transparent',
          'hover:text-yellow-700',
          'hover:underline',
          'focus:ring-yellow-400',
          'p-0',
          'dark:text-yellow-400',
          'dark:hover:text-yellow-300'
        ],
        error: [
          'bg-transparent',
          'text-red-600',
          'border-transparent',
          'hover:text-red-700',
          'hover:underline',
          'focus:ring-red-500',
          'p-0',
          'dark:text-red-400',
          'dark:hover:text-red-300'
        ],
        gray: [
          'bg-transparent',
          'text-gray-700',
          'border-transparent',
          'hover:text-gray-800',
          'hover:underline',
          'focus:ring-gray-500',
          'p-0',
          'dark:text-gray-300',
          'dark:hover:text-gray-200'
        ]
      }
    }

    return variantClasses[props.variant]?.[props.color] || variantClasses.solid.primary
  })

  // 圆角样式
  const roundedClasses = props.rounded ? 'rounded-full' : 'rounded-lg'

  // 块级样式
  const blockClasses = props.block ? 'w-full' : ''

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...variantClasses.value,
    roundedClasses,
    blockClasses
  ]
})

const iconClasses = computed(() => {
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  }
  return iconSizes[props.size]
})

const rightIconClasses = computed(() => {
  const iconSizes = {
    xs: 'w-3 h-3 ml-1',
    sm: 'w-4 h-4 ml-1.5',
    md: 'w-4 h-4 ml-2',
    lg: 'w-5 h-5 ml-2',
    xl: 'w-6 h-6 ml-2.5'
  }
  return iconSizes[props.size]
})

const textClasses = computed(() => {
  if (props.variant === 'link') {
    return ''
  }
  return props.icon && props.rightIcon ? '' : props.icon ? 'ml-1' : 'mr-1'
})

// 事件处理
const handleClick = (event: Event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>
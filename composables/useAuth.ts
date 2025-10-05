import { ref, computed, readonly } from 'vue'
import type { User, LoginCredentials, RegisterData } from '~/types/auth'

// 认证状态
export const useAuth = () => {
  // 用户状态
  const user = useState<User | null>('auth-user', () => null)
  const isAuthenticated = computed(() => !!user.value)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 从Cookie恢复认证状态
  const initializeAuth = async () => {
    try {
      const token = useCookie('auth-token')
      if (token.value) {
        // 验证token并获取用户信息
        const response = await $fetch('/api/auth/verify', {
          method: 'GET'
        }).catch(() => null)

        if (response?.success && response.data) {
          user.value = response.data
        } else {
          // Token无效，清除Cookie
          token.value = null
        }
      }
    } catch (err) {
      console.error('初始化认证状态失败:', err)
      const token = useCookie('auth-token')
      token.value = null
    }
  }

  // 用户登录
  const login = async (credentials: LoginCredentials) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials
      })

      if (response.success && response.data) {
        user.value = response.data.user
        // Cookie会在服务端自动设置
        return response.data
      } else {
        throw new Error('登录失败')
      }
    } catch (err: any) {
      error.value = err.data?.statusMessage || err.message || '登录失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 用户注册
  const register = async (data: RegisterData) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: data
      })

      if (response.success && response.data) {
        user.value = response.data.user
        // Cookie会在服务端自动设置
        return response.data
      } else {
        throw new Error('注册失败')
      }
    } catch (err: any) {
      error.value = err.data?.statusMessage || err.message || '注册失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 用户退出
  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST'
      })
    } catch (err) {
      console.error('退出登录请求失败:', err)
    } finally {
      // 无论服务端请求是否成功，都清除本地状态
      user.value = null
      const token = useCookie('auth-token')
      token.value = null
      await navigateTo('/login')
    }
  }

  // 更新用户信息
  const updateProfile = async (data: Partial<User>) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch('/api/user/profile', {
        method: 'PUT',
        body: data
      })

      if (response.success && response.data) {
        user.value = response.data
        return response.data
      } else {
        throw new Error('更新用户信息失败')
      }
    } catch (err: any) {
      error.value = err.data?.statusMessage || err.message || '更新用户信息失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 更新用户偏好设置
  const updatePreferences = async (preferences: any) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch('/api/user/preferences', {
        method: 'PUT',
        body: { preferences }
      })

      if (response.success && response.data) {
        if (user.value) {
          user.value.preferences = { ...user.value.preferences, ...preferences }
        }
        return response.data
      } else {
        throw new Error('更新偏好设置失败')
      }
    } catch (err: any) {
      error.value = err.data?.statusMessage || err.message || '更新偏好设置失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 刷新用户信息
  const refreshUser = async () => {
    if (!isAuthenticated.value) return

    try {
      const response = await $fetch('/api/user/profile', {
        method: 'GET'
      })

      if (response.success && response.data) {
        user.value = response.data
      }
    } catch (err) {
      console.error('刷新用户信息失败:', err)
    }
  }

  // 检查用户权限
  const hasPermission = (permission: string) => {
    if (!user.value) return false
    // 这里可以根据用户角色权限系统实现
    return true
  }

  return {
    // 状态
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    error: readonly(error),

    // 方法
    initializeAuth,
    login,
    register,
    logout,
    updateProfile,
    updatePreferences,
    refreshUser,
    hasPermission
  }
}
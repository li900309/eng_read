import { toRef, isRef, ref, computed, readonly } from "vue";
import { a as useNuxtApp, n as navigateTo } from "../server.mjs";
import { parse } from "/home/roy/eng_read/node_modules/nuxt/node_modules/cookie-es/dist/index.mjs";
import { getRequestHeader, setCookie, getCookie, deleteCookie } from "/home/roy/eng_read/node_modules/h3/dist/index.mjs";
import destr from "/home/roy/eng_read/node_modules/destr/dist/index.mjs";
import { isEqual } from "/home/roy/eng_read/node_modules/ohash/dist/index.mjs";
import { klona } from "/home/roy/eng_read/node_modules/klona/dist/index.mjs";
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
function useRequestEvent(nuxtApp) {
  nuxtApp ||= useNuxtApp();
  return nuxtApp.ssrContext?.event;
}
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  const opts = { ...CookieDefaults, ..._opts };
  opts.filter ??= (key) => key === name;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name] ?? opts.default?.());
  const cookie = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies ||= {};
      if (name in nuxtApp._cookies) {
        if (isEqual(cookie.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie.value;
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}
const useAuth = () => {
  const user = useState("auth-user", () => null);
  const isAuthenticated = computed(() => !!user.value);
  const isLoading = ref(false);
  const error = ref(null);
  const initializeAuth = async () => {
    try {
      const token = useCookie("auth-token");
      if (token.value) {
        const response = await $fetch("/api/auth/verify", {
          method: "GET"
        }).catch(() => null);
        if (response?.success && response.data) {
          user.value = response.data;
        } else {
          token.value = null;
        }
      }
    } catch (err) {
      console.error("初始化认证状态失败:", err);
      const token = useCookie("auth-token");
      token.value = null;
    }
  };
  const login = async (credentials) => {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await $fetch("/api/auth/login", {
        method: "POST",
        body: credentials
      });
      if (response.success && response.data) {
        user.value = response.data.user;
        return response.data;
      } else {
        throw new Error("登录失败");
      }
    } catch (err) {
      error.value = err.data?.statusMessage || err.message || "登录失败";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  const register = async (data) => {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await $fetch("/api/auth/register", {
        method: "POST",
        body: data
      });
      if (response.success && response.data) {
        user.value = response.data.user;
        return response.data;
      } else {
        throw new Error("注册失败");
      }
    } catch (err) {
      error.value = err.data?.statusMessage || err.message || "注册失败";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  const logout = async () => {
    try {
      await $fetch("/api/auth/logout", {
        method: "POST"
      });
    } catch (err) {
      console.error("退出登录请求失败:", err);
    } finally {
      user.value = null;
      const token = useCookie("auth-token");
      token.value = null;
      await navigateTo("/login");
    }
  };
  const updateProfile = async (data) => {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await $fetch("/api/user/profile", {
        method: "PUT",
        body: data
      });
      if (response.success && response.data) {
        user.value = response.data;
        return response.data;
      } else {
        throw new Error("更新用户信息失败");
      }
    } catch (err) {
      error.value = err.data?.statusMessage || err.message || "更新用户信息失败";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  const updatePreferences = async (preferences) => {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await $fetch("/api/user/preferences", {
        method: "PUT",
        body: { preferences }
      });
      if (response.success && response.data) {
        if (user.value) {
          user.value.preferences = { ...user.value.preferences, ...preferences };
        }
        return response.data;
      } else {
        throw new Error("更新偏好设置失败");
      }
    } catch (err) {
      error.value = err.data?.statusMessage || err.message || "更新偏好设置失败";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  const refreshUser = async () => {
    if (!isAuthenticated.value) return;
    try {
      const response = await $fetch("/api/user/profile", {
        method: "GET"
      });
      if (response.success && response.data) {
        user.value = response.data;
      }
    } catch (err) {
      console.error("刷新用户信息失败:", err);
    }
  };
  const hasPermission = (permission) => {
    if (!user.value) return false;
    return true;
  };
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
  };
};
export {
  useAuth as u
};
//# sourceMappingURL=useAuth-C5hZCYX9.js.map

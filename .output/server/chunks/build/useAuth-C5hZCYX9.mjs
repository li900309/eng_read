import { computed, ref, readonly, toRef, isRef } from 'vue';
import { a as useNuxtApp, n as navigateTo } from './server.mjs';
import { D as destr, n as klona, E as getRequestHeader, F as isEqual, s as setCookie, G as getCookie, b as deleteCookie } from '../nitro/nitro.mjs';

function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = options || {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

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
  var _a;
  nuxtApp || (nuxtApp = useNuxtApp());
  return (_a = nuxtApp.ssrContext) == null ? void 0 : _a.event;
}
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  var _a, _b, _c;
  const opts = { ...CookieDefaults, ..._opts };
  (_a = opts.filter) != null ? _a : opts.filter = (key) => key === name;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : (_c = cookies[name]) != null ? _c : (_b = opts.default) == null ? void 0 : _b.call(opts));
  const cookie = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies || (nuxtApp._cookies = {});
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
        if ((response == null ? void 0 : response.success) && response.data) {
          user.value = response.data;
        } else {
          token.value = null;
        }
      }
    } catch (err) {
      console.error("\u521D\u59CB\u5316\u8BA4\u8BC1\u72B6\u6001\u5931\u8D25:", err);
      const token = useCookie("auth-token");
      token.value = null;
    }
  };
  const login = async (credentials) => {
    var _a;
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
        throw new Error("\u767B\u5F55\u5931\u8D25");
      }
    } catch (err) {
      error.value = ((_a = err.data) == null ? void 0 : _a.statusMessage) || err.message || "\u767B\u5F55\u5931\u8D25";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  const register = async (data) => {
    var _a;
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
        throw new Error("\u6CE8\u518C\u5931\u8D25");
      }
    } catch (err) {
      error.value = ((_a = err.data) == null ? void 0 : _a.statusMessage) || err.message || "\u6CE8\u518C\u5931\u8D25";
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
      console.error("\u9000\u51FA\u767B\u5F55\u8BF7\u6C42\u5931\u8D25:", err);
    } finally {
      user.value = null;
      const token = useCookie("auth-token");
      token.value = null;
      await navigateTo("/login");
    }
  };
  const updateProfile = async (data) => {
    var _a;
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
        throw new Error("\u66F4\u65B0\u7528\u6237\u4FE1\u606F\u5931\u8D25");
      }
    } catch (err) {
      error.value = ((_a = err.data) == null ? void 0 : _a.statusMessage) || err.message || "\u66F4\u65B0\u7528\u6237\u4FE1\u606F\u5931\u8D25";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  const updatePreferences = async (preferences) => {
    var _a;
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
        throw new Error("\u66F4\u65B0\u504F\u597D\u8BBE\u7F6E\u5931\u8D25");
      }
    } catch (err) {
      error.value = ((_a = err.data) == null ? void 0 : _a.statusMessage) || err.message || "\u66F4\u65B0\u504F\u597D\u8BBE\u7F6E\u5931\u8D25";
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
      console.error("\u5237\u65B0\u7528\u6237\u4FE1\u606F\u5931\u8D25:", err);
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

export { useAuth as u };
//# sourceMappingURL=useAuth-C5hZCYX9.mjs.map

import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { tmpdir } from 'node:os';
import { defineEventHandler, handleCacheHeaders, splitCookiesString, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, setResponseHeaders, setResponseStatus, send, getRequestHeaders, setResponseHeader, appendResponseHeader, getRequestURL, getResponseHeader, removeResponseHeader, createError, getCookie, getHeader, getResponseStatus, getQuery as getQuery$1, readBody, lazyEventHandler, useBase, createApp, createRouter as createRouter$1, toNodeListener, getRouterParam, setCookie, deleteCookie, getResponseStatusText } from 'file:///home/roy/eng_read/node_modules/h3/dist/index.mjs';
import { Server } from 'node:http';
import { resolve, dirname, join } from 'node:path';
import nodeCrypto from 'node:crypto';
import { parentPort, threadId } from 'node:worker_threads';
import { escapeHtml } from 'file:///home/roy/eng_read/node_modules/@vue/shared/dist/shared.cjs.js';
import { z } from 'file:///home/roy/eng_read/node_modules/zod/index.js';
import pkg from 'file:///home/roy/eng_read/node_modules/@prisma/client/default.js';
import { createRenderer, getRequestDependencies, getPreloadLinks, getPrefetchLinks } from 'file:///home/roy/eng_read/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withTrailingSlash, decodePath, withLeadingSlash, withoutTrailingSlash, joinRelativeURL } from 'file:///home/roy/eng_read/node_modules/ufo/dist/index.mjs';
import { renderToString } from 'file:///home/roy/eng_read/node_modules/vue/server-renderer/index.mjs';
import destr, { destr as destr$1 } from 'file:///home/roy/eng_read/node_modules/destr/dist/index.mjs';
import { createHooks } from 'file:///home/roy/eng_read/node_modules/hookable/dist/index.mjs';
import { createFetch, Headers as Headers$1 } from 'file:///home/roy/eng_read/node_modules/ofetch/dist/node.mjs';
import { fetchNodeRequestHandler, callNodeRequestHandler } from 'file:///home/roy/eng_read/node_modules/node-mock-http/dist/index.mjs';
import { createStorage, prefixStorage } from 'file:///home/roy/eng_read/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file:///home/roy/eng_read/node_modules/unstorage/drivers/fs.mjs';
import { digest, hash as hash$1 } from 'file:///home/roy/eng_read/node_modules/ohash/dist/index.mjs';
import { klona } from 'file:///home/roy/eng_read/node_modules/klona/dist/index.mjs';
import defu, { defuFn } from 'file:///home/roy/eng_read/node_modules/defu/dist/defu.mjs';
import { snakeCase } from 'file:///home/roy/eng_read/node_modules/scule/dist/index.mjs';
import { getContext } from 'file:///home/roy/eng_read/node_modules/unctx/dist/index.mjs';
import { toRouteMatcher, createRouter } from 'file:///home/roy/eng_read/node_modules/radix3/dist/index.mjs';
import { readFile } from 'node:fs/promises';
import consola, { consola as consola$1 } from 'file:///home/roy/eng_read/node_modules/consola/dist/index.mjs';
import { ErrorParser } from 'file:///home/roy/eng_read/node_modules/youch-core/build/index.js';
import { Youch } from 'file:///home/roy/eng_read/node_modules/youch/build/index.js';
import { SourceMapConsumer } from 'file:///home/roy/eng_read/node_modules/source-map/source-map.js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { stringify, uneval } from 'file:///home/roy/eng_read/node_modules/devalue/index.js';
import { captureRawStackTrace, parseRawStackTrace } from 'file:///home/roy/eng_read/node_modules/errx/dist/index.js';
import { isVNode, toValue, isRef } from 'file:///home/roy/eng_read/node_modules/vue/index.mjs';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname as dirname$1, resolve as resolve$1 } from 'file:///home/roy/eng_read/node_modules/pathe/dist/index.mjs';
import bcrypt from 'file:///home/roy/eng_read/node_modules/bcryptjs/index.js';
import jwt from 'file:///home/roy/eng_read/node_modules/jsonwebtoken/index.js';
import { basename } from 'file:///home/roy/eng_read/node_modules/@nuxt/icon/node_modules/pathe/dist/index.mjs';
import { getIcons } from 'file:///home/roy/eng_read/node_modules/@iconify/utils/lib/index.mjs';
import { collections } from 'file:///home/roy/eng_read/.nuxt/nuxt-icon-server-bundle.mjs';
import { createHead as createHead$1, propsToString, renderSSRHead } from 'file:///home/roy/eng_read/node_modules/unhead/dist/server.mjs';
import { DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin } from 'file:///home/roy/eng_read/node_modules/unhead/dist/plugins.mjs';
import { walkResolver } from 'file:///home/roy/eng_read/node_modules/unhead/dist/utils.mjs';
import { ipxFSStorage, ipxHttpStorage, createIPX, createIPXH3Handler } from 'file:///home/roy/eng_read/node_modules/ipx/dist/index.mjs';
import { isAbsolute } from 'file:///home/roy/eng_read/node_modules/@nuxt/image/node_modules/pathe/dist/index.mjs';

const serverAssets = [{"baseName":"server","dir":"/home/roy/eng_read/server/assets"}];

const assets$1 = createStorage();

for (const asset of serverAssets) {
  assets$1.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"/home/roy/eng_read","watchOptions":{"ignored":[null]}}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"/home/roy/eng_read/server","watchOptions":{"ignored":[null]}}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"/home/roy/eng_read/.nuxt"}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"/home/roy/eng_read/.nuxt/cache"}));
storage.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"/home/roy/eng_read/.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const inlineAppConfig = {
  "nuxt": {},
  "icon": {
    "provider": "server",
    "class": "",
    "aliases": {},
    "iconifyApiEndpoint": "https://api.iconify.design",
    "localApiEndpoint": "/api/_nuxt_icon",
    "fallbackToApi": true,
    "cssSelectorPrefix": "i-",
    "cssWherePseudo": true,
    "mode": "css",
    "attrs": {
      "aria-hidden": true
    },
    "collections": [
      "academicons",
      "akar-icons",
      "ant-design",
      "arcticons",
      "basil",
      "bi",
      "bitcoin-icons",
      "bpmn",
      "brandico",
      "bx",
      "bxl",
      "bxs",
      "bytesize",
      "carbon",
      "catppuccin",
      "cbi",
      "charm",
      "ci",
      "cib",
      "cif",
      "cil",
      "circle-flags",
      "circum",
      "clarity",
      "codicon",
      "covid",
      "cryptocurrency",
      "cryptocurrency-color",
      "dashicons",
      "devicon",
      "devicon-plain",
      "ei",
      "el",
      "emojione",
      "emojione-monotone",
      "emojione-v1",
      "entypo",
      "entypo-social",
      "eos-icons",
      "ep",
      "et",
      "eva",
      "f7",
      "fa",
      "fa-brands",
      "fa-regular",
      "fa-solid",
      "fa6-brands",
      "fa6-regular",
      "fa6-solid",
      "fad",
      "fe",
      "feather",
      "file-icons",
      "flag",
      "flagpack",
      "flat-color-icons",
      "flat-ui",
      "flowbite",
      "fluent",
      "fluent-emoji",
      "fluent-emoji-flat",
      "fluent-emoji-high-contrast",
      "fluent-mdl2",
      "fontelico",
      "fontisto",
      "formkit",
      "foundation",
      "fxemoji",
      "gala",
      "game-icons",
      "geo",
      "gg",
      "gis",
      "gravity-ui",
      "gridicons",
      "grommet-icons",
      "guidance",
      "healthicons",
      "heroicons",
      "heroicons-outline",
      "heroicons-solid",
      "hugeicons",
      "humbleicons",
      "ic",
      "icomoon-free",
      "icon-park",
      "icon-park-outline",
      "icon-park-solid",
      "icon-park-twotone",
      "iconamoon",
      "iconoir",
      "icons8",
      "il",
      "ion",
      "iwwa",
      "jam",
      "la",
      "lets-icons",
      "line-md",
      "logos",
      "ls",
      "lucide",
      "lucide-lab",
      "mage",
      "majesticons",
      "maki",
      "map",
      "marketeq",
      "material-symbols",
      "material-symbols-light",
      "mdi",
      "mdi-light",
      "medical-icon",
      "memory",
      "meteocons",
      "mi",
      "mingcute",
      "mono-icons",
      "mynaui",
      "nimbus",
      "nonicons",
      "noto",
      "noto-v1",
      "octicon",
      "oi",
      "ooui",
      "openmoji",
      "oui",
      "pajamas",
      "pepicons",
      "pepicons-pencil",
      "pepicons-pop",
      "pepicons-print",
      "ph",
      "pixelarticons",
      "prime",
      "ps",
      "quill",
      "radix-icons",
      "raphael",
      "ri",
      "rivet-icons",
      "si-glyph",
      "simple-icons",
      "simple-line-icons",
      "skill-icons",
      "solar",
      "streamline",
      "streamline-emojis",
      "subway",
      "svg-spinners",
      "system-uicons",
      "tabler",
      "tdesign",
      "teenyicons",
      "token",
      "token-branded",
      "topcoat",
      "twemoji",
      "typcn",
      "uil",
      "uim",
      "uis",
      "uit",
      "uiw",
      "unjs",
      "vaadin",
      "vs",
      "vscode-icons",
      "websymbol",
      "weui",
      "whh",
      "wi",
      "wpf",
      "zmdi",
      "zondicons"
    ],
    "fetchTimeout": 1500
  }
};



const appConfig = defuFn(inlineAppConfig);

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "dev",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      }
    }
  },
  "public": {
    "apiBase": "/api"
  },
  "jwtSecret": "your-super-secret-jwt-key-change-this-in-production",
  "databaseUrl": "file:./dev.db",
  "icon": {
    "serverKnownCssClasses": []
  },
  "ipx": {
    "baseURL": "/_ipx",
    "alias": {},
    "fs": {
      "dir": [
        "/home/roy/eng_read/public"
      ]
    },
    "http": {
      "domains": []
    }
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
const _sharedAppConfig = _deepFreeze(klona(appConfig));
function useAppConfig(event) {
  {
    return _sharedAppConfig;
  }
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

getContext("nitro-app", {
  asyncContext: false,
  AsyncLocalStorage: void 0
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
  if (event.handled || isJsonRequest(event)) {
    return;
  }
  const defaultRes = await defaultHandler(error, event, { json: true });
  const statusCode = error.statusCode || 500;
  if (statusCode === 404 && defaultRes.status === 302) {
    setResponseHeaders(event, defaultRes.headers);
    setResponseStatus(event, defaultRes.status, defaultRes.statusText);
    return send(event, JSON.stringify(defaultRes.body, null, 2));
  }
  if (typeof defaultRes.body !== "string" && Array.isArray(defaultRes.body.stack)) {
    defaultRes.body.stack = defaultRes.body.stack.join("\n");
  }
  const errorObject = defaultRes.body;
  const url = new URL(errorObject.url);
  errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
  errorObject.message ||= "Server Error";
  errorObject.data ||= error.data;
  errorObject.statusMessage ||= error.statusMessage;
  delete defaultRes.headers["content-type"];
  delete defaultRes.headers["content-security-policy"];
  setResponseHeaders(event, defaultRes.headers);
  const reqHeaders = getRequestHeaders(event);
  const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
  const res = isRenderingError ? null : await useNitroApp().localFetch(
    withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject),
    {
      headers: { ...reqHeaders, "x-nuxt-error": "true" },
      redirect: "manual"
    }
  ).catch(() => null);
  if (event.handled) {
    return;
  }
  if (!res) {
    const { template } = await Promise.resolve().then(function () { return errorDev; }) ;
    {
      errorObject.description = errorObject.message;
    }
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  for (const [header, value] of res.headers.entries()) {
    if (header === "set-cookie") {
      appendResponseHeader(event, header, value);
      continue;
    }
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
  return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  async function defaultNitroErrorHandler(error, event) {
    const res = await defaultHandler(error, event);
    if (!event.node?.res.headersSent) {
      setResponseHeaders(event, res.headers);
    }
    setResponseStatus(event, res.status, res.statusText);
    return send(
      event,
      typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2)
    );
  }
);
async function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  await loadStackTrace(error).catch(consola.error);
  const youch = new Youch();
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    const ansiError = await (await youch.toANSI(error)).replaceAll(process.cwd(), ".");
    consola.error(
      `[request error] ${tags} [${event.method}] ${url}

`,
      ansiError
    );
  }
  const useJSON = opts?.json || !getRequestHeader(event, "accept")?.includes("text/html");
  const headers = {
    "content-type": useJSON ? "application/json" : "text/html",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
  };
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = useJSON ? {
    error: true,
    url,
    statusCode,
    statusMessage,
    message: error.message,
    data: error.data,
    stack: error.stack?.split("\n").map((line) => line.trim())
  } : await youch.toHTML(error, {
    request: {
      url: url.href,
      method: event.method,
      headers: getRequestHeaders(event)
    }
  });
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}
async function loadStackTrace(error) {
  if (!(error instanceof Error)) {
    return;
  }
  const parsed = await new ErrorParser().defineSourceLoader(sourceLoader).parse(error);
  const stack = error.message + "\n" + parsed.frames.map((frame) => fmtFrame(frame)).join("\n");
  Object.defineProperty(error, "stack", { value: stack });
  if (error.cause) {
    await loadStackTrace(error.cause).catch(consola.error);
  }
}
async function sourceLoader(frame) {
  if (!frame.fileName || frame.fileType !== "fs" || frame.type === "native") {
    return;
  }
  if (frame.type === "app") {
    const rawSourceMap = await readFile(`${frame.fileName}.map`, "utf8").catch(() => {
    });
    if (rawSourceMap) {
      const consumer = await new SourceMapConsumer(rawSourceMap);
      const originalPosition = consumer.originalPositionFor({ line: frame.lineNumber, column: frame.columnNumber });
      if (originalPosition.source && originalPosition.line) {
        frame.fileName = resolve(dirname(frame.fileName), originalPosition.source);
        frame.lineNumber = originalPosition.line;
        frame.columnNumber = originalPosition.column || 0;
      }
    }
  }
  const contents = await readFile(frame.fileName, "utf8").catch(() => {
  });
  return contents ? { contents } : void 0;
}
function fmtFrame(frame) {
  if (frame.type === "native") {
    return frame.raw;
  }
  const src = `${frame.fileName || ""}:${frame.lineNumber}:${frame.columnNumber})`;
  return frame.functionName ? `at ${frame.functionName} (${src}` : `at ${src}`;
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const script = `
if (!window.__NUXT_DEVTOOLS_TIME_METRIC__) {
  Object.defineProperty(window, '__NUXT_DEVTOOLS_TIME_METRIC__', {
    value: {},
    enumerable: false,
    configurable: true,
  })
}
window.__NUXT_DEVTOOLS_TIME_METRIC__.appInit = Date.now()
`;

const _vlws5nuR2YkngCluX2Bag9uXMC1fNi5J7K0zJWnLc = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const rootDir = "/home/roy/eng_read";

const appHead = {"meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1"},{"name":"description","content":"通过AI技术和个性化算法，提供高效的英语阅读理解学习体验"}],"link":[{"rel":"icon","type":"image/x-icon","href":"/favicon.ico"}],"style":[],"script":[],"noscript":[],"title":"智能英语学习平台"};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appId = "nuxt-app";

const devReducers = {
  VNode: (data) => isVNode(data) ? { type: data.type, props: data.props } : void 0,
  URL: (data) => data instanceof URL ? data.toString() : void 0
};
const asyncContext = getContext("nuxt-dev", { asyncContext: true, AsyncLocalStorage });
const _rPizWK2KyxqWIhSrgBIy2Koj9Eai_5bL0ELDP8bbA0A = (nitroApp) => {
  const handler = nitroApp.h3App.handler;
  nitroApp.h3App.handler = (event) => {
    return asyncContext.callAsync({ logs: [], event }, () => handler(event));
  };
  onConsoleLog((_log) => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    const rawStack = captureRawStackTrace();
    if (!rawStack || rawStack.includes("runtime/vite-node.mjs")) {
      return;
    }
    const trace = [];
    let filename = "";
    for (const entry of parseRawStackTrace(rawStack)) {
      if (entry.source === globalThis._importMeta_.url) {
        continue;
      }
      if (EXCLUDE_TRACE_RE.test(entry.source)) {
        continue;
      }
      filename ||= entry.source.replace(withTrailingSlash(rootDir), "");
      trace.push({
        ...entry,
        source: entry.source.startsWith("file://") ? entry.source.replace("file://", "") : entry.source
      });
    }
    const log = {
      ..._log,
      // Pass along filename to allow the client to display more info about where log comes from
      filename,
      // Clean up file names in stack trace
      stack: trace
    };
    ctx.logs.push(log);
  });
  nitroApp.hooks.hook("afterResponse", () => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    return nitroApp.hooks.callHook("dev:ssr-logs", { logs: ctx.logs, path: ctx.event.path });
  });
  nitroApp.hooks.hook("render:html", (htmlContext) => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    try {
      const reducers = Object.assign(/* @__PURE__ */ Object.create(null), devReducers, ctx.event.context._payloadReducers);
      htmlContext.bodyAppend.unshift(`<script type="application/json" data-nuxt-logs="${appId}">${stringify(ctx.logs, reducers)}<\/script>`);
    } catch (e) {
      const shortError = e instanceof Error && "toString" in e ? ` Received \`${e.toString()}\`.` : "";
      console.warn(`[nuxt] Failed to stringify dev server logs.${shortError} You can define your own reducer/reviver for rich types following the instructions in https://nuxt.com/docs/api/composables/use-nuxt-app#payload.`);
    }
  });
};
const EXCLUDE_TRACE_RE = /\/node_modules\/(?:.*\/)?(?:nuxt|nuxt-nightly|nuxt-edge|nuxt3|consola|@vue)\/|core\/runtime\/nitro/;
function onConsoleLog(callback) {
  consola$1.addReporter({
    log(logObj) {
      callback(logObj);
    }
  });
  consola$1.wrapConsole();
}

const plugins = [
  _vlws5nuR2YkngCluX2Bag9uXMC1fNi5J7K0zJWnLc,
_rPizWK2KyxqWIhSrgBIy2Koj9Eai_5bL0ELDP8bbA0A
];

const assets = {};

function readAsset (id) {
  const serverDir = dirname$1(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve$1(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _kGJBa2 = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError({ statusCode: 404 });
    }
    return;
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const { PrismaClient: PrismaClient$2 } = pkg;
const prisma$2 = new PrismaClient$2();
class AuthService {
  /**
   * 用户注册
   */
  async register(data) {
    if (data.password !== data.confirmPassword) {
      throw new Error("\u5BC6\u7801\u786E\u8BA4\u4E0D\u5339\u914D");
    }
    const existingUser = await prisma$2.user.findFirst({
      where: {
        OR: [
          { email: data.email.toLowerCase() },
          { username: data.username }
        ]
      }
    });
    if (existingUser) {
      if (existingUser.email === data.email.toLowerCase()) {
        throw new Error("\u90AE\u7BB1\u5DF2\u88AB\u6CE8\u518C");
      }
      if (existingUser.username === data.username) {
        throw new Error("\u7528\u6237\u540D\u5DF2\u88AB\u4F7F\u7528");
      }
    }
    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await prisma$2.user.create({
      data: {
        email: data.email.toLowerCase(),
        username: data.username,
        passwordHash,
        preferences: {
          language: "zh-CN",
          theme: "light",
          dailyGoal: 10,
          difficultyLevel: "beginner"
        }
      }
    });
    const token = this.generateToken(user);
    const { passwordHash: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token
    };
  }
  /**
   * 用户登录
   */
  async login(credentials) {
    const user = await prisma$2.user.findUnique({
      where: { email: credentials.email.toLowerCase() }
    });
    if (!user) {
      throw new Error("\u90AE\u7BB1\u6216\u5BC6\u7801\u9519\u8BEF");
    }
    const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("\u90AE\u7BB1\u6216\u5BC6\u7801\u9519\u8BEF");
    }
    if (!user.isActive) {
      throw new Error("\u8D26\u6237\u5DF2\u88AB\u7981\u7528");
    }
    await prisma$2.user.update({
      where: { id: user.id },
      data: { lastLoginAt: /* @__PURE__ */ new Date() }
    });
    const token = this.generateToken(user);
    const { passwordHash: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token
    };
  }
  /**
   * 验证JWT令牌
   */
  async verifyToken(token) {
    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT\u5BC6\u94A5\u672A\u914D\u7F6E");
      }
      const decoded = jwt.verify(token, jwtSecret);
      const user = await prisma$2.user.findUnique({
        where: { id: decoded.userId }
      });
      if (!user || !user.isActive) {
        return null;
      }
      const { passwordHash: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      return null;
    }
  }
  /**
   * 更新用户偏好设置
   */
  async updateUserPreferences(userId, preferences) {
    const user = await prisma$2.user.update({
      where: { id: userId },
      data: {
        preferences,
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  /**
   * 生成JWT令牌
   */
  generateToken(user) {
    const jwtSecret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
    if (!jwtSecret) {
      throw new Error("JWT\u5BC6\u94A5\u672A\u914D\u7F6E");
    }
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username
      },
      jwtSecret,
      { expiresIn }
    );
  }
}
const authService = new AuthService();

const protectedPaths = [
  "/api/vocabulary/user",
  "/api/learning",
  "/api/statistics",
  "/api/user/preferences"
];
const publicPaths = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/vocabulary/public",
  "/api/llm/translate",
  "/api/llm/grammar-check"
];
const _R8x0Jd = defineEventHandler(async (event) => {
  var _a;
  const url = getRequestURL(event);
  const pathname = url.pathname;
  if (!pathname.startsWith("/api")) {
    return;
  }
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return;
  }
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const token = getCookie(event, "auth-token") || ((_a = getHeader(event, "authorization")) == null ? void 0 : _a.replace("Bearer ", ""));
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "\u672A\u63D0\u4F9B\u8BA4\u8BC1\u4EE4\u724C"
      });
    }
    try {
      const user = await authService.verifyToken(token);
      if (!user) {
        throw createError({
          statusCode: 401,
          statusMessage: "\u65E0\u6548\u7684\u8BA4\u8BC1\u4EE4\u724C"
        });
      }
      event.context.auth = user;
    } catch (error) {
      throw createError({
        statusCode: 401,
        statusMessage: "\u8BA4\u8BC1\u5931\u8D25"
      });
    }
  }
});

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const scheduledTasks = false;

const tasks = {
  
};

const __runningTasks__ = {};
async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
}

function buildAssetsDir() {
  return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
  return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
  const app = useRuntimeConfig().app;
  const publicBase = app.cdnURL || app.baseURL;
  return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

const warnOnceSet = /* @__PURE__ */ new Set();
const DEFAULT_ENDPOINT = "https://api.iconify.design";
const _nBYqI5 = defineCachedEventHandler(async (event) => {
  const url = getRequestURL(event);
  if (!url)
    return createError({ status: 400, message: "Invalid icon request" });
  const options = useAppConfig().icon;
  const collectionName = event.context.params?.collection?.replace(/\.json$/, "");
  const collection = collectionName ? await collections[collectionName]?.() : null;
  const apiEndPoint = options.iconifyApiEndpoint || DEFAULT_ENDPOINT;
  const icons = url.searchParams.get("icons")?.split(",");
  if (collection) {
    if (icons?.length) {
      const data = getIcons(
        collection,
        icons
      );
      consola$1.debug(`[Icon] serving ${(icons || []).map((i) => "`" + collectionName + ":" + i + "`").join(",")} from bundled collection`);
      return data;
    }
  } else {
    if (collectionName && !warnOnceSet.has(collectionName) && apiEndPoint === DEFAULT_ENDPOINT) {
      consola$1.warn([
        `[Icon] Collection \`${collectionName}\` is not found locally`,
        `We suggest to install it via \`npm i -D @iconify-json/${collectionName}\` to provide the best end-user experience.`
      ].join("\n"));
      warnOnceSet.add(collectionName);
    }
  }
  if (options.fallbackToApi === true || options.fallbackToApi === "server-only") {
    const apiUrl = new URL("./" + basename(url.pathname) + url.search, apiEndPoint);
    consola$1.debug(`[Icon] fetching ${(icons || []).map((i) => "`" + collectionName + ":" + i + "`").join(",")} from iconify api`);
    if (apiUrl.host !== new URL(apiEndPoint).host) {
      return createError({ status: 400, message: "Invalid icon request" });
    }
    try {
      const data = await $fetch(apiUrl.href);
      return data;
    } catch (e) {
      consola$1.error(e);
      if (e.status === 404)
        return createError({ status: 404 });
      else
        return createError({ status: 500, message: "Failed to fetch fallback icon" });
    }
  }
  return createError({ status: 404 });
}, {
  group: "nuxt",
  name: "icon",
  getKey(event) {
    const collection = event.context.params?.collection?.replace(/\.json$/, "") || "unknown";
    const icons = String(getQuery$1(event).icons || "");
    return `${collection}_${icons.split(",")[0]}_${icons.length}_${hash$1(icons)}`;
  },
  swr: true,
  maxAge: 60 * 60 * 24 * 7
  // 1 week
});

const VueResolver = (_, value) => {
  return isRef(value) ? toValue(value) : value;
};

const headSymbol = "usehead";
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}

function resolveUnrefHeadInput(input) {
  return walkResolver(input, VueResolver);
}

function createHead(options = {}) {
  const head = createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}

const unheadOptions = {
  disableDefaults: true,
  disableCapoSorting: false,
  plugins: [DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin],
};

function createSSRContext(event) {
  const ssrContext = {
    url: event.path,
    event,
    runtimeConfig: useRuntimeConfig(event),
    noSSR: event.context.nuxt?.noSSR || (false),
    head: createHead(unheadOptions),
    error: false,
    nuxt: void 0,
    /* NuxtApp */
    payload: {},
    _payloadReducers: /* @__PURE__ */ Object.create(null),
    modules: /* @__PURE__ */ new Set()
  };
  return ssrContext;
}
function setSSRError(ssrContext, error) {
  ssrContext.error = true;
  ssrContext.payload = { error };
  ssrContext.url = error.url;
}

const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
const getServerEntry = () => import('file:///home/roy/eng_read/.nuxt//dist/server/server.mjs').then((r) => r.default || r);
const getClientManifest = () => import('file:///home/roy/eng_read/.nuxt//dist/server/client.manifest.mjs').then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);
const getSSRRenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  if (!manifest) {
    throw new Error("client.manifest is not available");
  }
  const createSSRApp = await getServerEntry();
  if (!createSSRApp) {
    throw new Error("Server bundle is not available");
  }
  const options = {
    manifest,
    renderToString: renderToString$1,
    buildAssetsURL
  };
  const renderer = createRenderer(createSSRApp, options);
  async function renderToString$1(input, context) {
    const html = await renderToString(input, context);
    if (process.env.NUXT_VITE_NODE_OPTIONS) {
      renderer.rendererContext.updateManifest(await getClientManifest());
    }
    return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
  }
  return renderer;
});
const getSPARenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  const spaTemplate = await Promise.resolve().then(function () { return _virtual__spaTemplate; }).then((r) => r.template).catch(() => "").then((r) => {
    {
      return APP_ROOT_OPEN_TAG + r + APP_ROOT_CLOSE_TAG;
    }
  });
  const options = {
    manifest,
    renderToString: () => spaTemplate,
    buildAssetsURL
  };
  const renderer = createRenderer(() => () => {
  }, options);
  const result = await renderer.renderToString({});
  const renderToString = (ssrContext) => {
    const config = useRuntimeConfig(ssrContext.event);
    ssrContext.modules ||= /* @__PURE__ */ new Set();
    ssrContext.payload.serverRendered = false;
    ssrContext.config = {
      public: config.public,
      app: config.app
    };
    return Promise.resolve(result);
  };
  return {
    rendererContext: renderer.rendererContext,
    renderToString
  };
});
function lazyCachedFunction(fn) {
  let res = null;
  return () => {
    if (res === null) {
      res = fn().catch((err) => {
        res = null;
        throw err;
      });
    }
    return res;
  };
}
function getRenderer(ssrContext) {
  return ssrContext.noSSR ? getSPARenderer() : getSSRRenderer();
}
const getSSRStyles = lazyCachedFunction(() => Promise.resolve().then(function () { return styles$1; }).then((r) => r.default || r));

async function renderInlineStyles(usedModules) {
  const styleMap = await getSSRStyles();
  const inlinedStyles = /* @__PURE__ */ new Set();
  for (const mod of usedModules) {
    if (mod in styleMap && styleMap[mod]) {
      for (const style of await styleMap[mod]()) {
        inlinedStyles.add(style);
      }
    }
  }
  return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}

const ROOT_NODE_REGEX = new RegExp(`^<${appRootTag}[^>]*>([\\s\\S]*)<\\/${appRootTag}>$`);
function getServerComponentHTML(body) {
  const match = body.match(ROOT_NODE_REGEX);
  return match?.[1] || body;
}
const SSR_SLOT_TELEPORT_MARKER = /^uid=([^;]*);slot=(.*)$/;
const SSR_CLIENT_TELEPORT_MARKER = /^uid=([^;]*);client=(.*)$/;
const SSR_CLIENT_SLOT_MARKER = /^island-slot=([^;]*);(.*)$/;
function getSlotIslandResponse(ssrContext) {
  if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.slots).length) {
    return void 0;
  }
  const response = {};
  for (const [name, slot] of Object.entries(ssrContext.islandContext.slots)) {
    response[name] = {
      ...slot,
      fallback: ssrContext.teleports?.[`island-fallback=${name}`]
    };
  }
  return response;
}
function getClientIslandResponse(ssrContext) {
  if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.components).length) {
    return void 0;
  }
  const response = {};
  for (const [clientUid, component] of Object.entries(ssrContext.islandContext.components)) {
    const html = ssrContext.teleports?.[clientUid]?.replaceAll("<!--teleport start anchor-->", "") || "";
    response[clientUid] = {
      ...component,
      html,
      slots: getComponentSlotTeleport(clientUid, ssrContext.teleports ?? {})
    };
  }
  return response;
}
function getComponentSlotTeleport(clientUid, teleports) {
  const entries = Object.entries(teleports);
  const slots = {};
  for (const [key, value] of entries) {
    const match = key.match(SSR_CLIENT_SLOT_MARKER);
    if (match) {
      const [, id, slot] = match;
      if (!slot || clientUid !== id) {
        continue;
      }
      slots[slot] = value;
    }
  }
  return slots;
}
function replaceIslandTeleports(ssrContext, html) {
  const { teleports, islandContext } = ssrContext;
  if (islandContext || !teleports) {
    return html;
  }
  for (const key in teleports) {
    const matchClientComp = key.match(SSR_CLIENT_TELEPORT_MARKER);
    if (matchClientComp) {
      const [, uid, clientId] = matchClientComp;
      if (!uid || !clientId) {
        continue;
      }
      html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-component="${clientId}"[^>]*>`), (full) => {
        return full + teleports[key];
      });
      continue;
    }
    const matchSlot = key.match(SSR_SLOT_TELEPORT_MARKER);
    if (matchSlot) {
      const [, uid, slot] = matchSlot;
      if (!uid || !slot) {
        continue;
      }
      html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-slot="${slot}"[^>]*>`), (full) => {
        return full + teleports[key];
      });
    }
  }
  return html;
}

const ISLAND_SUFFIX_RE = /\.json(?:\?.*)?$/;
const _SxA8c9 = defineEventHandler(async (event) => {
  const nitroApp = useNitroApp();
  setResponseHeaders(event, {
    "content-type": "application/json;charset=utf-8",
    "x-powered-by": "Nuxt"
  });
  const islandContext = await getIslandContext(event);
  const ssrContext = {
    ...createSSRContext(event),
    islandContext,
    noSSR: false,
    url: islandContext.url
  };
  const renderer = await getSSRRenderer();
  const renderResult = await renderer.renderToString(ssrContext).catch(async (error) => {
    await ssrContext.nuxt?.hooks.callHook("app:error", error);
    throw error;
  });
  const inlinedStyles = await renderInlineStyles(ssrContext.modules ?? []);
  await ssrContext.nuxt?.hooks.callHook("app:rendered", { ssrContext, renderResult });
  if (inlinedStyles.length) {
    ssrContext.head.push({ style: inlinedStyles });
  }
  {
    const { styles } = getRequestDependencies(ssrContext, renderer.rendererContext);
    const link = [];
    for (const resource of Object.values(styles)) {
      if ("inline" in getQuery(resource.file)) {
        continue;
      }
      if (resource.file.includes("scoped") && !resource.file.includes("pages/")) {
        link.push({ rel: "stylesheet", href: renderer.rendererContext.buildAssetsURL(resource.file), crossorigin: "" });
      }
    }
    if (link.length) {
      ssrContext.head.push({ link }, { mode: "server" });
    }
  }
  const islandHead = {};
  for (const entry of ssrContext.head.entries.values()) {
    for (const [key, value] of Object.entries(resolveUnrefHeadInput(entry.input))) {
      const currentValue = islandHead[key];
      if (Array.isArray(currentValue)) {
        currentValue.push(...value);
      }
      islandHead[key] = value;
    }
  }
  islandHead.link ||= [];
  islandHead.style ||= [];
  const islandResponse = {
    id: islandContext.id,
    head: islandHead,
    html: getServerComponentHTML(renderResult.html),
    components: getClientIslandResponse(ssrContext),
    slots: getSlotIslandResponse(ssrContext)
  };
  await nitroApp.hooks.callHook("render:island", islandResponse, { event, islandContext });
  return islandResponse;
});
async function getIslandContext(event) {
  let url = event.path || "";
  const componentParts = url.substring("/__nuxt_island".length + 1).replace(ISLAND_SUFFIX_RE, "").split("_");
  const hashId = componentParts.length > 1 ? componentParts.pop() : void 0;
  const componentName = componentParts.join("_");
  const context = event.method === "GET" ? getQuery$1(event) : await readBody(event);
  const ctx = {
    url: "/",
    ...context,
    id: hashId,
    name: componentName,
    props: destr$1(context.props) || {},
    slots: {},
    components: {}
  };
  return ctx;
}

const _2NJuXn = lazyEventHandler(() => {
  const opts = useRuntimeConfig().ipx || {};
  const fsDir = opts?.fs?.dir ? (Array.isArray(opts.fs.dir) ? opts.fs.dir : [opts.fs.dir]).map((dir) => isAbsolute(dir) ? dir : fileURLToPath(new URL(dir, globalThis._importMeta_.url))) : void 0;
  const fsStorage = opts.fs?.dir ? ipxFSStorage({ ...opts.fs, dir: fsDir }) : void 0;
  const httpStorage = opts.http?.domains ? ipxHttpStorage({ ...opts.http }) : void 0;
  if (!fsStorage && !httpStorage) {
    throw new Error("IPX storage is not configured!");
  }
  const ipxOptions = {
    ...opts,
    storage: fsStorage || httpStorage,
    httpStorage
  };
  const ipx = createIPX(ipxOptions);
  const ipxHandler = createIPXH3Handler(ipx);
  return useBase(opts.baseURL, ipxHandler);
});

const _lazy_4gBlC4 = () => Promise.resolve().then(function () { return login_post$1; });
const _lazy_YoatbB = () => Promise.resolve().then(function () { return logout_post$1; });
const _lazy_zGapkw = () => Promise.resolve().then(function () { return register_post$1; });
const _lazy_JXWgc2 = () => Promise.resolve().then(function () { return health_get$1; });
const _lazy_1nVLiQ = () => Promise.resolve().then(function () { return progress_get$1; });
const _lazy_MH208q = () => Promise.resolve().then(function () { return submit_post$1; });
const _lazy_pAvm2j = () => Promise.resolve().then(function () { return translate_post$1; });
const _lazy_YGber0 = () => Promise.resolve().then(function () { return add_post$1; });
const _lazy_8k6Dc1 = () => Promise.resolve().then(function () { return index_get$1; });
const _lazy_wUAqFd = () => Promise.resolve().then(function () { return renderer$1; });

const handlers = [
  { route: '', handler: _kGJBa2, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _R8x0Jd, lazy: false, middleware: true, method: undefined },
  { route: '/api/auth/login', handler: _lazy_4gBlC4, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/logout', handler: _lazy_YoatbB, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/register', handler: _lazy_zGapkw, lazy: true, middleware: false, method: "post" },
  { route: '/api/health', handler: _lazy_JXWgc2, lazy: true, middleware: false, method: "get" },
  { route: '/api/learning/progress', handler: _lazy_1nVLiQ, lazy: true, middleware: false, method: "get" },
  { route: '/api/learning/submit', handler: _lazy_MH208q, lazy: true, middleware: false, method: "post" },
  { route: '/api/llm/translate', handler: _lazy_pAvm2j, lazy: true, middleware: false, method: "post" },
  { route: '/api/vocabulary/add', handler: _lazy_YGber0, lazy: true, middleware: false, method: "post" },
  { route: '/api/vocabulary', handler: _lazy_8k6Dc1, lazy: true, middleware: false, method: "get" },
  { route: '/__nuxt_error', handler: _lazy_wUAqFd, lazy: true, middleware: false, method: undefined },
  { route: '/api/_nuxt_icon/:collection', handler: _nBYqI5, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '/_ipx/**', handler: _2NJuXn, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_wUAqFd, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(true),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => callNodeRequestHandler(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return fetchNodeRequestHandler(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

if (!globalThis.crypto) {
  globalThis.crypto = nodeCrypto;
}
const { NITRO_NO_UNIX_SOCKET, NITRO_DEV_WORKER_ID } = process.env;
trapUnhandledNodeErrors();
parentPort?.on("message", (msg) => {
  if (msg && msg.event === "shutdown") {
    shutdown();
  }
});
const nitroApp = useNitroApp();
const server = new Server(toNodeListener(nitroApp.h3App));
let listener;
listen().catch(() => listen(
  true
  /* use random port */
)).catch((error) => {
  console.error("Dev worker failed to listen:", error);
  return shutdown();
});
nitroApp.router.get(
  "/_nitro/tasks",
  defineEventHandler(async (event) => {
    const _tasks = await Promise.all(
      Object.entries(tasks).map(async ([name, task]) => {
        const _task = await task.resolve?.();
        return [name, { description: _task?.meta?.description }];
      })
    );
    return {
      tasks: Object.fromEntries(_tasks),
      scheduledTasks
    };
  })
);
nitroApp.router.use(
  "/_nitro/tasks/:name",
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const payload = {
      ...getQuery$1(event),
      ...await readBody(event).then((r) => r?.payload).catch(() => ({}))
    };
    return await runTask(name, { payload });
  })
);
function listen(useRandomPort = Boolean(
  NITRO_NO_UNIX_SOCKET || process.versions.webcontainer || "Bun" in globalThis && process.platform === "win32"
)) {
  return new Promise((resolve, reject) => {
    try {
      listener = server.listen(useRandomPort ? 0 : getSocketAddress(), () => {
        const address = server.address();
        parentPort?.postMessage({
          event: "listen",
          address: typeof address === "string" ? { socketPath: address } : { host: "localhost", port: address?.port }
        });
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
function getSocketAddress() {
  const socketName = `nitro-worker-${process.pid}-${threadId}-${NITRO_DEV_WORKER_ID}-${Math.round(Math.random() * 1e4)}.sock`;
  if (process.platform === "win32") {
    return join(String.raw`\\.\pipe`, socketName);
  }
  if (process.platform === "linux") {
    const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
    if (nodeMajor >= 20) {
      return `\0${socketName}`;
    }
  }
  return join(tmpdir(), socketName);
}
async function shutdown() {
  server.closeAllConnections?.();
  await Promise.all([
    new Promise((resolve) => listener?.close(resolve)),
    nitroApp.hooks.callHook("close").catch(console.error)
  ]);
  parentPort?.postMessage({ event: "exit" });
}

const _messages = { "appName": "Nuxt", "version": "", "statusCode": 500, "statusMessage": "Server error", "description": "An error occurred in the application and the page could not be served. If you are the application owner, check your server logs for details.", "stack": "" };
const template$1 = (messages) => {
  messages = { ..._messages, ...messages };
  return '<!DOCTYPE html><html lang="en"><head><title>' + escapeHtml(messages.statusCode) + " - " + escapeHtml(messages.statusMessage || "Internal Server Error") + `</title><meta charset="utf-8"><meta content="width=device-width,initial-scale=1.0,minimum-scale=1.0" name="viewport"><style>.spotlight{background:linear-gradient(45deg,#00dc82,#36e4da 50%,#0047e1);bottom:-40vh;filter:blur(30vh);height:60vh;opacity:.8}*,:after,:before{border-color:var(--un-default-border-color,#e5e7eb);border-style:solid;border-width:0;box-sizing:border-box}:after,:before{--un-content:""}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}h1{font-size:inherit;font-weight:inherit}h1,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.pointer-events-none{pointer-events:none}.fixed{position:fixed}.left-0{left:0}.right-0{right:0}.z-10{z-index:10}.mb-6{margin-bottom:1.5rem}.mb-8{margin-bottom:2rem}.h-auto{height:auto}.min-h-screen{min-height:100vh}.flex{display:flex}.flex-1{flex:1 1 0%}.flex-col{flex-direction:column}.overflow-y-auto{overflow-y:auto}.rounded-t-md{border-top-left-radius:.375rem;border-top-right-radius:.375rem}.bg-black\\/5{background-color:#0000000d}.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255/var(--un-bg-opacity))}.p-8{padding:2rem}.px-10{padding-left:2.5rem;padding-right:2.5rem}.pt-14{padding-top:3.5rem}.text-6xl{font-size:3.75rem;line-height:1}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-black{--un-text-opacity:1;color:rgb(0 0 0/var(--un-text-opacity))}.font-light{font-weight:300}.font-medium{font-weight:500}.leading-tight{line-height:1.25}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media (prefers-color-scheme:dark){.dark\\:bg-black{--un-bg-opacity:1;background-color:rgb(0 0 0/var(--un-bg-opacity))}.dark\\:bg-white\\/10{background-color:#ffffff1a}.dark\\:text-white{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}}@media (min-width:640px){.sm\\:text-2xl{font-size:1.5rem;line-height:2rem}.sm\\:text-8xl{font-size:6rem;line-height:1}}</style><script>!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver((e=>{for(const o of e)if("childList"===o.type)for(const e of o.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&r(e)})).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?r.credentials="include":"anonymous"===e.crossOrigin?r.credentials="omit":r.credentials="same-origin",r}(e);fetch(e.href,r)}}();<\/script></head><body class="antialiased bg-white dark:bg-black dark:text-white flex flex-col font-sans min-h-screen pt-14 px-10 text-black"><div class="fixed left-0 pointer-events-none right-0 spotlight"></div><h1 class="font-medium mb-6 sm:text-8xl text-6xl">` + escapeHtml(messages.statusCode) + '</h1><p class="font-light leading-tight mb-8 sm:text-2xl text-xl">' + escapeHtml(messages.description) + '</p><div class="bg-black/5 bg-white dark:bg-white/10 flex-1 h-auto overflow-y-auto rounded-t-md"><div class="font-light leading-tight p-8 text-xl z-10">' + escapeHtml(messages.stack) + "</div></div></body></html>";
};

const errorDev = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template$1
}, Symbol.toStringTag, { value: 'Module' }));

const template = "";

const _virtual__spaTemplate = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template
}, Symbol.toStringTag, { value: 'Module' }));

const styles = {};

const styles$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: styles
}, Symbol.toStringTag, { value: 'Module' }));

const loginSchema = z.object({
  email: z.string().email("\u8BF7\u8F93\u5165\u6709\u6548\u7684\u90AE\u7BB1\u5730\u5740"),
  password: z.string().min(6, "\u5BC6\u7801\u81F3\u5C116\u4E2A\u5B57\u7B26")
});
const login_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = loginSchema.parse(body);
    const result = await authService.login(validatedData);
    setCookie(event, "auth-token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      // 7天
      path: "/"
    });
    return {
      success: true,
      data: {
        user: result.user,
        token: result.token
      }
    };
  } catch (error) {
    console.error("\u767B\u5F55\u5931\u8D25:", error);
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u8F93\u5165\u6570\u636E\u9A8C\u8BC1\u5931\u8D25",
        data: {
          errors: error.errors
        }
      });
    }
    throw createError({
      statusCode: 401,
      statusMessage: error instanceof Error ? error.message : "\u767B\u5F55\u5931\u8D25"
    });
  }
});

const login_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: login_post
}, Symbol.toStringTag, { value: 'Module' }));

const logout_post = defineEventHandler(async (event) => {
  try {
    deleteCookie(event, "auth-token", {
      path: "/"
    });
    return {
      success: true,
      data: {
        message: "\u9000\u51FA\u767B\u5F55\u6210\u529F"
      }
    };
  } catch (error) {
    console.error("\u9000\u51FA\u767B\u5F55\u5931\u8D25:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "\u9000\u51FA\u767B\u5F55\u5931\u8D25"
    });
  }
});

const logout_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: logout_post
}, Symbol.toStringTag, { value: 'Module' }));

const registerSchema = z.object({
  email: z.string().email("\u8BF7\u8F93\u5165\u6709\u6548\u7684\u90AE\u7BB1\u5730\u5740"),
  username: z.string().min(3, "\u7528\u6237\u540D\u81F3\u5C113\u4E2A\u5B57\u7B26").max(20, "\u7528\u6237\u540D\u6700\u591A20\u4E2A\u5B57\u7B26").regex(/^[a-zA-Z0-9_]+$/, "\u7528\u6237\u540D\u53EA\u80FD\u5305\u542B\u5B57\u6BCD\u3001\u6570\u5B57\u548C\u4E0B\u5212\u7EBF"),
  password: z.string().min(8, "\u5BC6\u7801\u81F3\u5C118\u4E2A\u5B57\u7B26").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "\u5BC6\u7801\u5FC5\u987B\u5305\u542B\u5927\u5C0F\u5199\u5B57\u6BCD\u548C\u6570\u5B57"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "\u4E24\u6B21\u8F93\u5165\u7684\u5BC6\u7801\u4E0D\u4E00\u81F4",
  path: ["confirmPassword"]
});
const register_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = registerSchema.parse(body);
    const result = await authService.register(validatedData);
    setCookie(event, "auth-token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      // 7天
      path: "/"
    });
    return {
      success: true,
      data: {
        user: result.user,
        token: result.token
      }
    };
  } catch (error) {
    console.error("\u6CE8\u518C\u5931\u8D25:", error);
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u8F93\u5165\u6570\u636E\u9A8C\u8BC1\u5931\u8D25",
        data: {
          errors: error.errors
        }
      });
    }
    throw createError({
      statusCode: 400,
      statusMessage: error instanceof Error ? error.message : "\u6CE8\u518C\u5931\u8D25"
    });
  }
});

const register_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: register_post
}, Symbol.toStringTag, { value: 'Module' }));

const { PrismaClient: PrismaClient$1 } = pkg;
const prisma$1 = new PrismaClient$1();
const health_get = defineEventHandler(async (event) => {
  try {
    let databaseStatus = "disconnected";
    try {
      await prisma$1.$queryRaw`SELECT 1 as result`;
      databaseStatus = "connected";
    } catch (error) {
      console.error("\u6570\u636E\u5E93\u8FDE\u63A5\u5931\u8D25:", error);
    }
    let redisStatus = "disconnected";
    if (process.env.REDIS_URL) {
      try {
        redisStatus = "connected";
      } catch (error) {
        console.error("Redis\u8FDE\u63A5\u5931\u8D25:", error);
      }
    }
    let llmStatus = "disconnected";
    if (process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY) {
      llmStatus = "connected";
    }
    const healthCheck = {
      status: "healthy",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      version: "1.0.0",
      services: {
        database: databaseStatus,
        redis: redisStatus,
        llm: llmStatus
      }
    };
    if (databaseStatus === "disconnected") {
      healthCheck.status = "unhealthy";
      throw createError({
        statusCode: 503,
        statusMessage: "\u670D\u52A1\u4E0D\u53EF\u7528"
      });
    }
    return {
      success: true,
      data: healthCheck
    };
  } catch (error) {
    console.error("\u5065\u5EB7\u68C0\u67E5\u5931\u8D25:", error);
    throw createError({
      statusCode: 503,
      statusMessage: "\u670D\u52A1\u4E0D\u53EF\u7528"
    });
  }
});

const health_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: health_get
}, Symbol.toStringTag, { value: 'Module' }));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
class VocabularyService {
  /**
   * 获取词汇列表
   */
  async getVocabularyList(filter) {
    const page = filter.page || 1;
    const limit = Math.min(filter.limit || 20, 100);
    const skip = (page - 1) * limit;
    const where = {
      isActive: true
    };
    if (filter.categoryId) {
      where.categoryId = filter.categoryId;
    }
    if (filter.difficulty) {
      where.difficulty = filter.difficulty;
    }
    if (filter.search) {
      where.OR = [
        { word: { contains: filter.search, mode: "insensitive" } },
        { definition: { contains: filter.search, mode: "insensitive" } },
        { example: { contains: filter.search, mode: "insensitive" } }
      ];
    }
    const [vocabularies, total] = await Promise.all([
      prisma.vocabulary.findMany({
        where,
        include: {
          category: true
        },
        orderBy: [
          { frequency: "desc" },
          { word: "asc" }
        ],
        skip,
        take: limit
      }),
      prisma.vocabulary.count({ where })
    ]);
    const totalPages = Math.ceil(total / limit);
    return {
      vocabularies,
      total,
      page,
      limit,
      totalPages
    };
  }
  /**
   * 获取用户词汇学习列表
   */
  async getUserVocabularies(userId, filter) {
    const page = filter.page || 1;
    const limit = Math.min(filter.limit || 20, 100);
    const skip = (page - 1) * limit;
    const where = {
      userId
    };
    if (filter.categoryId) {
      where.vocabulary = {
        categoryId: filter.categoryId
      };
    }
    if (filter.difficulty) {
      where.vocabulary = {
        ...where.vocabulary,
        difficulty: filter.difficulty
      };
    }
    if (filter.search) {
      where.vocabulary = {
        ...where.vocabulary,
        OR: [
          { word: { contains: filter.search, mode: "insensitive" } },
          { definition: { contains: filter.search, mode: "insensitive" } }
        ]
      };
    }
    const [userVocabularies, total] = await Promise.all([
      prisma.userVocabulary.findMany({
        where,
        include: {
          vocabulary: {
            include: {
              category: true
            }
          },
          user: true
        },
        orderBy: {
          nextReviewAt: "asc"
        },
        skip,
        take: limit
      }),
      prisma.userVocabulary.count({ where })
    ]);
    const totalPages = Math.ceil(total / limit);
    return {
      vocabularies: userVocabularies.map((uv) => uv.vocabulary),
      total,
      page,
      limit,
      totalPages
    };
  }
  /**
   * 添加词汇到用户学习列表
   */
  async addVocabularyToUser(userId, vocabularyId) {
    const existing = await prisma.userVocabulary.findUnique({
      where: {
        userId_vocabularyId: {
          userId,
          vocabularyId
        }
      }
    });
    if (existing) {
      return existing;
    }
    return await prisma.userVocabulary.create({
      data: {
        userId,
        vocabularyId,
        masteryLevel: 0,
        reviewCount: 0,
        correctCount: 0,
        consecutiveCorrect: 0,
        nextReviewAt: /* @__PURE__ */ new Date()
      },
      include: {
        vocabulary: {
          include: {
            category: true
          }
        },
        user: true
      }
    });
  }
  /**
   * 更新用户词汇学习进度
   */
  async updateUserVocabulary(userId, vocabularyId, isCorrect, responseTime) {
    const userVocab = await prisma.userVocabulary.findUnique({
      where: {
        userId_vocabularyId: {
          userId,
          vocabularyId
        }
      }
    });
    if (!userVocab) {
      throw new Error("\u7528\u6237\u8BCD\u6C47\u8BB0\u5F55\u4E0D\u5B58\u5728");
    }
    const reviewCount = userVocab.reviewCount + 1;
    const correctCount = userVocab.correctCount + (isCorrect ? 1 : 0);
    const consecutiveCorrect = isCorrect ? userVocab.consecutiveCorrect + 1 : 0;
    let masteryLevel = userVocab.masteryLevel;
    if (consecutiveCorrect >= 3 && masteryLevel < 5) {
      masteryLevel += 1;
    } else if (consecutiveCorrect === 0 && masteryLevel > 0) {
      masteryLevel = Math.max(0, masteryLevel - 1);
    }
    const nextReviewAt = this.calculateNextReview(consecutiveCorrect, responseTime);
    return await prisma.userVocabulary.update({
      where: {
        userId_vocabularyId: {
          userId,
          vocabularyId
        }
      },
      data: {
        masteryLevel,
        reviewCount,
        correctCount,
        consecutiveCorrect,
        lastReviewAt: /* @__PURE__ */ new Date(),
        nextReviewAt,
        updatedAt: /* @__PURE__ */ new Date()
      },
      include: {
        vocabulary: {
          include: {
            category: true
          }
        },
        user: true
      }
    });
  }
  /**
   * 获取用户学习进度统计
   */
  async getUserLearningProgress(userId) {
    const [
      totalWords,
      learnedWords,
      masteredWords,
      todayStats
    ] = await Promise.all([
      prisma.userVocabulary.count({
        where: { userId }
      }),
      prisma.userVocabulary.count({
        where: {
          userId,
          reviewCount: { gt: 0 }
        }
      }),
      prisma.userVocabulary.count({
        where: {
          userId,
          masteryLevel: { gte: 4 }
        }
      }),
      this.getTodayStats(userId)
    ]);
    const totalCorrect = await prisma.userVocabulary.aggregate({
      where: { userId },
      _sum: { correctCount: true, reviewCount: true }
    });
    const correctRate = totalCorrect._sum.reviewCount > 0 ? totalCorrect._sum.correctCount / totalCorrect._sum.reviewCount : 0;
    return {
      totalWords,
      learnedWords,
      masteredWords,
      correctRate: Math.round(correctRate * 100) / 100,
      todayStudyTime: todayStats.timeSpent,
      todayWordsStudied: todayStats.wordsStudied,
      streak: todayStats.streak
    };
  }
  /**
   * 获取词汇分类列表
   */
  async getVocabularyCategories() {
    return await prisma.vocabularyCategory.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" }
    });
  }
  /**
   * 计算下次复习时间（间隔重复算法）
   */
  calculateNextReview(consecutiveCorrect, responseTime) {
    const baseIntervals = [1, 3, 7, 14, 30];
    let interval = baseIntervals[Math.min(consecutiveCorrect, baseIntervals.length - 1)];
    if (responseTime < 3e3) {
      interval = Math.ceil(interval * 1.2);
    } else if (responseTime > 1e4) {
      interval = Math.ceil(interval * 0.8);
    }
    const nextReview = /* @__PURE__ */ new Date();
    nextReview.setDate(nextReview.getDate() + interval);
    return nextReview;
  }
  /**
   * 获取今日统计数据
   */
  async getTodayStats(userId) {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const todaySessions = await prisma.learningSession.findMany({
      where: {
        userId,
        startTime: { gte: today }
      }
    });
    const timeSpent = todaySessions.reduce((sum, session) => sum + session.timeSpent, 0);
    const wordsStudied = todaySessions.reduce((sum, session) => sum + session.totalWords, 0);
    const streak = await this.calculateStreak(userId);
    return { timeSpent, wordsStudied, streak };
  }
  /**
   * 计算连续学习天数
   */
  async calculateStreak(userId) {
    const sessions = await prisma.learningSession.findMany({
      where: { userId },
      orderBy: { startTime: "desc" },
      take: 30
      // 最多30天
    });
    if (sessions.length === 0) return 0;
    let streak = 1;
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const todaySession = sessions.find(
      (s) => s.startTime >= today
    );
    if (!todaySession) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdaySession = sessions.find(
        (s) => s.startTime >= yesterday && s.startTime < today
      );
      if (!yesterdaySession) return 0;
    }
    for (let i = 1; i < sessions.length; i++) {
      const currentDate = new Date(sessions[i - 1].startTime);
      currentDate.setHours(0, 0, 0, 0);
      const prevDate = new Date(sessions[i].startTime);
      prevDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1e3 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak++;
      } else if (diffDays > 1) {
        break;
      }
    }
    return streak;
  }
}
const vocabularyService = new VocabularyService();

const progress_get = defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth;
    if (!auth) {
      throw createError({
        statusCode: 401,
        statusMessage: "\u9700\u8981\u7528\u6237\u8BA4\u8BC1"
      });
    }
    const progress = await vocabularyService.getUserLearningProgress(auth.id);
    return {
      success: true,
      data: progress
    };
  } catch (error) {
    console.error("\u83B7\u53D6\u5B66\u4E60\u8FDB\u5EA6\u5931\u8D25:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "\u83B7\u53D6\u5B66\u4E60\u8FDB\u5EA6\u5931\u8D25"
    });
  }
});

const progress_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: progress_get
}, Symbol.toStringTag, { value: 'Module' }));

const submitLearningSchema = z.object({
  vocabularyId: z.string().min(1, "\u8BCD\u6C47ID\u4E0D\u80FD\u4E3A\u7A7A"),
  isCorrect: z.boolean(),
  responseTime: z.number().min(0, "\u54CD\u5E94\u65F6\u95F4\u4E0D\u80FD\u4E3A\u8D1F\u6570")
});
const submit_post = defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth;
    if (!auth) {
      throw createError({
        statusCode: 401,
        statusMessage: "\u9700\u8981\u7528\u6237\u8BA4\u8BC1"
      });
    }
    const body = await readBody(event);
    const validatedData = submitLearningSchema.parse(body);
    const result = await vocabularyService.updateUserVocabulary(
      auth.id,
      validatedData.vocabularyId,
      validatedData.isCorrect,
      validatedData.responseTime
    );
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error("\u63D0\u4EA4\u5B66\u4E60\u8BB0\u5F55\u5931\u8D25:", error);
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u8BF7\u6C42\u6570\u636E\u9A8C\u8BC1\u5931\u8D25",
        data: {
          errors: error.errors
        }
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : "\u63D0\u4EA4\u5B66\u4E60\u8BB0\u5F55\u5931\u8D25"
    });
  }
});

const submit_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: submit_post
}, Symbol.toStringTag, { value: 'Module' }));

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
class LLMService {
  constructor() {
    __publicField(this, "configs", /* @__PURE__ */ new Map());
    this.initializeConfigs();
  }
  /**
   * 初始化LLM配置
   */
  initializeConfigs() {
    if (process.env.OPENAI_API_KEY) {
      this.configs.set("openai", {
        provider: "openai",
        apiKey: process.env.OPENAI_API_KEY,
        model: "gpt-3.5-turbo",
        maxTokens: 2e3,
        temperature: 0.7,
        timeout: 3e4
      });
    }
    if (process.env.ANTHROPIC_API_KEY) {
      this.configs.set("anthropic", {
        provider: "anthropic",
        apiKey: process.env.ANTHROPIC_API_KEY,
        model: "claude-3-haiku-20240307",
        maxTokens: 2e3,
        temperature: 0.7,
        timeout: 3e4
      });
    }
    this.configs.set("local", {
      provider: "local",
      model: "llama3.1:8b",
      maxTokens: 2e3,
      temperature: 0.7,
      timeout: 6e4
    });
  }
  /**
   * 生成词汇
   */
  async generateVocabulary(request) {
    const prompt = this.buildVocabularyPrompt(request);
    return await this.makeRequest({
      prompt,
      systemPrompt: "\u4F60\u662F\u4E00\u4E2A\u4E13\u4E1A\u7684\u82F1\u8BED\u6559\u80B2\u4E13\u5BB6\uFF0C\u64C5\u957F\u751F\u6210\u9002\u5408\u4E0D\u540C\u6C34\u5E73\u7684\u82F1\u8BED\u8BCD\u6C47\u5B66\u4E60\u5185\u5BB9\u3002",
      maxTokens: 1500,
      temperature: 0.6
    });
  }
  /**
   * 翻译文本
   */
  async translate(request) {
    let prompt = `\u8BF7\u5C06\u4EE5\u4E0B\u6587\u672C\u4ECE${request.from}\u7FFB\u8BD1\u5230${request.to}\uFF1A

"${request.text}"`;
    if (request.context) {
      prompt += `

\u4E0A\u4E0B\u6587\uFF1A${request.context}`;
    }
    const response = await this.makeRequest({
      prompt,
      systemPrompt: "\u4F60\u662F\u4E00\u4E2A\u4E13\u4E1A\u7684\u7FFB\u8BD1\u4E13\u5BB6\uFF0C\u8BF7\u63D0\u4F9B\u51C6\u786E\u3001\u81EA\u7136\u7684\u7FFB\u8BD1\u3002",
      maxTokens: 500,
      temperature: 0.3
    });
    if (!response.success || !response.content) {
      return {
        translatedText: "",
        error: response.error || "\u7FFB\u8BD1\u5931\u8D25"
      };
    }
    return {
      translatedText: response.content.trim(),
      confidence: 0.9
    };
  }
  /**
   * 语法检查
   */
  async checkGrammar(request) {
    const prompt = `\u8BF7\u68C0\u67E5\u4EE5\u4E0B\u82F1\u6587\u6587\u672C\u7684\u8BED\u6CD5\u3001\u62FC\u5199\u548C\u8868\u8FBE\u95EE\u9898\uFF1A

"${request.text}"

\u8BF7\u4EE5JSON\u683C\u5F0F\u8FD4\u56DE\u7ED3\u679C\uFF0C\u5305\u542B\uFF1A
1. correctedText: \u4FEE\u6B63\u540E\u7684\u6587\u672C
2. corrections: \u9519\u8BEF\u5217\u8868\uFF0C\u6BCF\u4E2A\u9519\u8BEF\u5305\u542Boriginal, corrected, type, position, explanation
3. score: \u6574\u4F53\u8BC4\u5206(0-100)`;
    const response = await this.makeRequest({
      prompt,
      systemPrompt: "\u4F60\u662F\u4E00\u4E2A\u4E13\u4E1A\u7684\u82F1\u8BED\u8BED\u6CD5\u68C0\u67E5\u5DE5\u5177\uFF0C\u8BF7\u4ED4\u7EC6\u68C0\u67E5\u6587\u672C\u5E76\u63D0\u4F9B\u51C6\u786E\u7684\u4FEE\u6B63\u5EFA\u8BAE\u3002",
      maxTokens: 1e3,
      temperature: 0.1
    });
    if (!response.success || !response.content) {
      return {
        originalText: request.text,
        correctedText: request.text,
        corrections: [],
        score: 100
      };
    }
    try {
      const result = JSON.parse(response.content.trim());
      return result;
    } catch (error) {
      console.error("\u89E3\u6790\u8BED\u6CD5\u68C0\u67E5\u7ED3\u679C\u5931\u8D25:", error);
      return {
        originalText: request.text,
        correctedText: request.text,
        corrections: [],
        score: 100
      };
    }
  }
  /**
   * 生成阅读理解题
   */
  async generateReadingComprehension(request) {
    const prompt = `\u57FA\u4E8E\u4EE5\u4E0B\u6587\u7AE0\u751F\u6210${request.questionCount}\u9053\u9605\u8BFB\u7406\u89E3\u9898\uFF1A

"${request.article}"

\u8BF7\u4EE5JSON\u683C\u5F0F\u8FD4\u56DE\uFF0C\u5305\u542B\uFF1A
1. questions: \u95EE\u9898\u5217\u8868\uFF0C\u6BCF\u4E2A\u95EE\u9898\u5305\u542Bid, question, options(4\u4E2A\u9009\u9879), correctAnswer, explanation`;
    const response = await this.makeRequest({
      prompt,
      systemPrompt: "\u4F60\u662F\u4E00\u4E2A\u4E13\u4E1A\u7684\u9605\u8BFB\u7406\u89E3\u51FA\u9898\u4E13\u5BB6\uFF0C\u8BF7\u751F\u6210\u9AD8\u8D28\u91CF\u7684\u9605\u8BFB\u7406\u89E3\u9898\u76EE\u3002",
      maxTokens: 2e3,
      temperature: 0.4
    });
    if (!response.success || !response.content) {
      return {
        questions: [],
        difficulty: request.difficulty
      };
    }
    try {
      const result = JSON.parse(response.content.trim());
      return {
        ...result,
        difficulty: request.difficulty
      };
    } catch (error) {
      console.error("\u89E3\u6790\u9605\u8BFB\u7406\u89E3\u9898\u76EE\u5931\u8D25:", error);
      return {
        questions: [],
        difficulty: request.difficulty
      };
    }
  }
  /**
   * 通用LLM请求
   */
  async makeRequest(request) {
    const config = this.getBestConfig();
    if (!config) {
      return {
        success: false,
        error: "\u6CA1\u6709\u53EF\u7528\u7684LLM\u670D\u52A1\u914D\u7F6E",
        provider: "none",
        model: "none"
      };
    }
    try {
      switch (config.provider) {
        case "openai":
          return await this.callOpenAI(config, request);
        case "anthropic":
          return await this.callAnthropic(config, request);
        case "local":
          return await this.callLocal(config, request);
        default:
          return {
            success: false,
            error: `\u4E0D\u652F\u6301\u7684LLM\u63D0\u4F9B\u5546: ${config.provider}`,
            provider: config.provider,
            model: config.model
          };
      }
    } catch (error) {
      console.error("LLM\u8BF7\u6C42\u5931\u8D25:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "\u672A\u77E5\u9519\u8BEF",
        provider: config.provider,
        model: config.model
      };
    }
  }
  /**
   * 调用OpenAI API
   */
  async callOpenAI(config, request) {
    const messages = [];
    if (request.systemPrompt) {
      messages.push({ role: "system", content: request.systemPrompt });
    }
    messages.push({ role: "user", content: request.prompt });
    return {
      success: true,
      content: "This is a simulated response from OpenAI. Please install the openai package for actual API calls.",
      usage: {
        promptTokens: 50,
        completionTokens: 30,
        totalTokens: 80
      },
      provider: "openai",
      model: config.model
    };
  }
  /**
   * 调用Anthropic API
   */
  async callAnthropic(config, request) {
    return {
      success: true,
      content: "This is a simulated response from Anthropic. Please install the @anthropic-ai/sdk package for actual API calls.",
      usage: {
        promptTokens: 50,
        completionTokens: 30,
        totalTokens: 80
      },
      provider: "anthropic",
      model: config.model
    };
  }
  /**
   * 调用本地模型（通过API）
   */
  async callLocal(config, request) {
    try {
      const response = await $fetch("http://localhost:11434/api/generate", {
        method: "POST",
        body: {
          model: config.model,
          prompt: request.systemPrompt ? `${request.systemPrompt}

${request.prompt}` : request.prompt,
          stream: false,
          options: {
            temperature: request.temperature || config.temperature,
            num_predict: request.maxTokens || config.maxTokens
          }
        },
        timeout: config.timeout
      });
      return {
        success: true,
        content: response.response,
        provider: "local",
        model: config.model
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "\u672C\u5730\u6A21\u578B\u8C03\u7528\u5931\u8D25",
        provider: "local",
        model: config.model
      };
    }
  }
  /**
   * 获取最佳配置
   */
  getBestConfig() {
    const providers = ["openai", "anthropic", "local"];
    for (const provider of providers) {
      const config = this.configs.get(provider);
      if (config && (config.apiKey || provider === "local")) {
        return config;
      }
    }
    return null;
  }
  /**
   * 构建词汇生成提示词
   */
  buildVocabularyPrompt(request) {
    const difficultyLevels = {
      beginner: "\u521D\u7EA7\u6C34\u5E73",
      intermediate: "\u4E2D\u7EA7\u6C34\u5E73",
      advanced: "\u9AD8\u7EA7\u6C34\u5E73"
    };
    let prompt = `\u8BF7\u751F\u6210${request.count}\u4E2A\u9002\u5408${difficultyLevels[request.difficulty]}\u5B66\u4E60\u8005\u7684\u82F1\u8BED\u8BCD\u6C47\u3002`;
    if (request.topic) {
      prompt += `\u4E3B\u9898\uFF1A${request.topic}\u3002`;
    }
    prompt += `

\u8BF7\u4EE5JSON\u683C\u5F0F\u8FD4\u56DE\uFF0C\u5305\u542B\uFF1A
1. words: \u8BCD\u6C47\u5217\u8868\uFF0C\u6BCF\u4E2A\u8BCD\u6C47\u5305\u542B\uFF1A
   - word: \u5355\u8BCD
   - pronunciation: \u97F3\u6807
   - definition: \u4E2D\u6587\u91CA\u4E49
   - example: \u82F1\u6587\u4F8B\u53E5
   - difficulty: \u96BE\u5EA6\u7B49\u7EA7(1-5)
   - frequency: \u8BCD\u9891\u7B49\u7EA7(1-10)`;
    if (request.includeExamples) {
      prompt += "\n   - category: \u8BCD\u6C47\u5206\u7C7B";
    }
    return prompt;
  }
}
const llmService = new LLMService();

const translateSchema = z.object({
  text: z.string().min(1, "\u7FFB\u8BD1\u6587\u672C\u4E0D\u80FD\u4E3A\u7A7A"),
  from: z.string().min(2, "\u6E90\u8BED\u8A00\u4E0D\u80FD\u4E3A\u7A7A"),
  to: z.string().min(2, "\u76EE\u6807\u8BED\u8A00\u4E0D\u80FD\u4E3A\u7A7A"),
  context: z.string().optional()
});
const translate_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = translateSchema.parse(body);
    const result = await llmService.translate(validatedData);
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error("\u7FFB\u8BD1\u5931\u8D25:", error);
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u8BF7\u6C42\u6570\u636E\u9A8C\u8BC1\u5931\u8D25",
        data: {
          errors: error.errors
        }
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : "\u7FFB\u8BD1\u5931\u8D25"
    });
  }
});

const translate_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: translate_post
}, Symbol.toStringTag, { value: 'Module' }));

const addVocabularySchema = z.object({
  vocabularyId: z.string().min(1, "\u8BCD\u6C47ID\u4E0D\u80FD\u4E3A\u7A7A")
});
const add_post = defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth;
    if (!auth) {
      throw createError({
        statusCode: 401,
        statusMessage: "\u9700\u8981\u7528\u6237\u8BA4\u8BC1"
      });
    }
    const body = await readBody(event);
    const validatedData = addVocabularySchema.parse(body);
    const result = await vocabularyService.addVocabularyToUser(
      auth.id,
      validatedData.vocabularyId
    );
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error("\u6DFB\u52A0\u8BCD\u6C47\u5931\u8D25:", error);
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u8BF7\u6C42\u6570\u636E\u9A8C\u8BC1\u5931\u8D25",
        data: {
          errors: error.errors
        }
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : "\u6DFB\u52A0\u8BCD\u6C47\u5931\u8D25"
    });
  }
});

const add_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: add_post
}, Symbol.toStringTag, { value: 'Module' }));

const querySchema = z.object({
  categoryId: z.string().optional(),
  difficulty: z.coerce.number().min(1).max(5).optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  user: z.string().optional()
  // 如果为'true'，返回用户词汇列表
});
const index_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const validatedQuery = querySchema.parse(query);
    const auth = event.context.auth;
    if (validatedQuery.user === "true" && auth) {
      const result2 = await vocabularyService.getUserVocabularies(auth.id, {
        categoryId: validatedQuery.categoryId,
        difficulty: validatedQuery.difficulty,
        search: validatedQuery.search,
        page: validatedQuery.page,
        limit: validatedQuery.limit
      });
      return {
        success: true,
        data: result2,
        meta: {
          pagination: {
            page: result2.page,
            limit: result2.limit,
            total: result2.total,
            totalPages: result2.totalPages
          },
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      };
    }
    const result = await vocabularyService.getVocabularyList({
      categoryId: validatedQuery.categoryId,
      difficulty: validatedQuery.difficulty,
      search: validatedQuery.search,
      page: validatedQuery.page,
      limit: validatedQuery.limit
    });
    return {
      success: true,
      data: result,
      meta: {
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages
        },
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
  } catch (error) {
    console.error("\u83B7\u53D6\u8BCD\u6C47\u5217\u8868\u5931\u8D25:", error);
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u67E5\u8BE2\u53C2\u6570\u9A8C\u8BC1\u5931\u8D25",
        data: {
          errors: error.errors
        }
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: "\u83B7\u53D6\u8BCD\u6C47\u5217\u8868\u5931\u8D25"
    });
  }
});

const index_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get
}, Symbol.toStringTag, { value: 'Module' }));

function renderPayloadResponse(ssrContext) {
  return {
    body: stringify(splitPayload(ssrContext).payload, ssrContext._payloadReducers) ,
    statusCode: getResponseStatus(ssrContext.event),
    statusMessage: getResponseStatusText(ssrContext.event),
    headers: {
      "content-type": "application/json;charset=utf-8" ,
      "x-powered-by": "Nuxt"
    }
  };
}
function renderPayloadJsonScript(opts) {
  const contents = opts.data ? stringify(opts.data, opts.ssrContext._payloadReducers) : "";
  const payload = {
    "type": "application/json",
    "innerHTML": contents,
    "data-nuxt-data": appId,
    "data-ssr": !(opts.ssrContext.noSSR)
  };
  {
    payload.id = "__NUXT_DATA__";
  }
  if (opts.src) {
    payload["data-src"] = opts.src;
  }
  const config = uneval(opts.ssrContext.config);
  return [
    payload,
    {
      innerHTML: `window.__NUXT__={};window.__NUXT__.config=${config}`
    }
  ];
}
function splitPayload(ssrContext) {
  const { data, prerenderedAt, ...initial } = ssrContext.payload;
  return {
    initial: { ...initial, prerenderedAt },
    payload: { data, prerenderedAt }
  };
}

const renderSSRHeadOptions = {"omitLineBreaks":false};

globalThis.__buildAssetsURL = buildAssetsURL;
globalThis.__publicAssetsURL = publicAssetsURL;
const HAS_APP_TELEPORTS = !!(appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
const PAYLOAD_URL_RE = /^[^?]*\/_payload.json(?:\?.*)?$/ ;
const renderer = defineRenderHandler(async (event) => {
  const nitroApp = useNitroApp();
  const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery$1(event) : null;
  if (ssrError && !("__unenv__" in event.node.req)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page Not Found: /__nuxt_error"
    });
  }
  const ssrContext = createSSRContext(event);
  const headEntryOptions = { mode: "server" };
  ssrContext.head.push(appHead, headEntryOptions);
  if (ssrError) {
    ssrError.statusCode &&= Number.parseInt(ssrError.statusCode);
    setSSRError(ssrContext, ssrError);
  }
  const isRenderingPayload = PAYLOAD_URL_RE.test(ssrContext.url);
  if (isRenderingPayload) {
    const url = ssrContext.url.substring(0, ssrContext.url.lastIndexOf("/")) || "/";
    ssrContext.url = url;
    event._path = event.node.req.url = url;
  }
  const routeOptions = getRouteRules(event);
  if (routeOptions.ssr === false) {
    ssrContext.noSSR = true;
  }
  const renderer = await getRenderer(ssrContext);
  const _rendered = await renderer.renderToString(ssrContext).catch(async (error) => {
    if (ssrContext._renderResponse && error.message === "skipping render") {
      return {};
    }
    const _err = !ssrError && ssrContext.payload?.error || error;
    await ssrContext.nuxt?.hooks.callHook("app:error", _err);
    throw _err;
  });
  const inlinedStyles = [];
  await ssrContext.nuxt?.hooks.callHook("app:rendered", { ssrContext, renderResult: _rendered });
  if (ssrContext._renderResponse) {
    return ssrContext._renderResponse;
  }
  if (ssrContext.payload?.error && !ssrError) {
    throw ssrContext.payload.error;
  }
  if (isRenderingPayload) {
    const response = renderPayloadResponse(ssrContext);
    return response;
  }
  const NO_SCRIPTS = routeOptions.noScripts;
  const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
  if (ssrContext._preloadManifest && !NO_SCRIPTS) {
    ssrContext.head.push({
      link: [
        { rel: "preload", as: "fetch", fetchpriority: "low", crossorigin: "anonymous", href: buildAssetsURL(`builds/meta/${ssrContext.runtimeConfig.app.buildId}.json`) }
      ]
    }, { ...headEntryOptions, tagPriority: "low" });
  }
  if (inlinedStyles.length) {
    ssrContext.head.push({ style: inlinedStyles });
  }
  const link = [];
  for (const resource of Object.values(styles)) {
    if ("inline" in getQuery(resource.file)) {
      continue;
    }
    link.push({ rel: "stylesheet", href: renderer.rendererContext.buildAssetsURL(resource.file), crossorigin: "" });
  }
  if (link.length) {
    ssrContext.head.push({ link }, headEntryOptions);
  }
  if (!NO_SCRIPTS) {
    ssrContext.head.push({
      link: getPreloadLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    ssrContext.head.push({
      link: getPrefetchLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    ssrContext.head.push({
      script: renderPayloadJsonScript({ ssrContext, data: ssrContext.payload }) 
    }, {
      ...headEntryOptions,
      // this should come before another end of body scripts
      tagPosition: "bodyClose",
      tagPriority: "high"
    });
  }
  if (!routeOptions.noScripts) {
    const tagPosition = "head";
    ssrContext.head.push({
      script: Object.values(scripts).map((resource) => ({
        type: resource.module ? "module" : null,
        src: renderer.rendererContext.buildAssetsURL(resource.file),
        defer: resource.module ? null : true,
        // if we are rendering script tag payloads that import an async payload
        // we need to ensure this resolves before executing the Nuxt entry
        tagPosition,
        crossorigin: ""
      }))
    }, headEntryOptions);
  }
  const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(ssrContext.head, renderSSRHeadOptions);
  const htmlContext = {
    htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
    head: normalizeChunks([headTags]),
    bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
    bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
    body: [
      replaceIslandTeleports(ssrContext, _rendered.html) ,
      APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG
    ],
    bodyAppend: [bodyTags]
  };
  await nitroApp.hooks.callHook("render:html", htmlContext, { event });
  return {
    body: renderHTMLDocument(htmlContext),
    statusCode: getResponseStatus(event),
    statusMessage: getResponseStatusText(event),
    headers: {
      "content-type": "text/html;charset=utf-8",
      "x-powered-by": "Nuxt"
    }
  };
});
function normalizeChunks(chunks) {
  const result = [];
  for (const _chunk of chunks) {
    const chunk = _chunk?.trim();
    if (chunk) {
      result.push(chunk);
    }
  }
  return result;
}
function joinTags(tags) {
  return tags.join("");
}
function joinAttrs(chunks) {
  if (chunks.length === 0) {
    return "";
  }
  return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
  return `<!DOCTYPE html><html${joinAttrs(html.htmlAttrs)}><head>${joinTags(html.head)}</head><body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body></html>`;
}

const renderer$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: renderer
}, Symbol.toStringTag, { value: 'Module' }));
//# sourceMappingURL=index.mjs.map

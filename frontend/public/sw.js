// Service Worker for Eng Read PWA
const CACHE_NAME = 'engread-v1.0.0';
const STATIC_CACHE_NAME = 'engread-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'engread-dynamic-v1.0.0';

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  // 核心CSS和JS文件将在构建时自动添加
];

// API 缓存配置
const API_CACHE_CONFIG = {
  // 缓存时间（毫秒）
  defaultTTL: 5 * 60 * 1000, // 5分钟
  vocabularyTTL: 30 * 60 * 1000, // 30分钟
  statsTTL: 2 * 60 * 1000, // 2分钟

  // 不缓存的API端点
  noCache: [
    '/api/auth/login',
    '/api/auth/logout',
    '/api/auth/refresh',
    '/api/learning/session/*/complete',
  ],
};

// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker');

  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME &&
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName.startsWith('engread-')) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Old caches cleaned up');
        return self.clients.claim();
      })
  );
});

// 网络请求拦截
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 跳过非HTTP(S)请求
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 处理API请求
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // 处理静态资源请求
  if (request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'image' ||
      request.destination === 'font') {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // 处理页面导航请求
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  // 其他请求使用网络优先策略
  event.respondWith(
    fetch(request)
      .catch(() => {
        // 网络失败时尝试从缓存获取
        return caches.match(request);
      })
  );
});

// 处理API请求
async function handleApiRequest(request) {
  const url = new URL(request.url);
  const method = request.method;

  // 检查是否应该跳过缓存
  const shouldSkipCache = API_CACHE_CONFIG.noCache.some(path => {
    const pattern = path.replace('*', '.*');
    return new RegExp(pattern).test(url.pathname);
  });

  if (shouldSkipCache || method !== 'GET') {
    try {
      const response = await fetch(request);
      return response;
    } catch (error) {
      console.log('[SW] API request failed:', error);
      return createErrorResponse('网络连接失败，请检查网络设置', 503);
    }
  }

  // 缓存策略：网络优先，失败时使用缓存
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // 缓存响应
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      const ttl = getCacheTTL(url.pathname);

      cache.put(request, networkResponse.clone()).then(() => {
        // 设置缓存过期时间（使用 IndexedDB 存储元数据）
        setCacheExpiry(request.url, Date.now() + ttl);
      });

      return networkResponse;
    } else {
      throw new Error(`HTTP ${networkResponse.status}`);
    }
  } catch (error) {
    console.log('[SW] Network request failed, trying cache:', request.url);

    const cachedResponse = await caches.match(request);

    if (cachedResponse && !isCacheExpired(request.url)) {
      // 添加过期提示头部
      const headers = new Headers(cachedResponse.headers);
      headers.set('X-From-Cache', 'true');
      headers.set('X-Cache-Expired', 'false');

      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers
      });
    }

    return createErrorResponse('无法获取最新数据，请检查网络连接', 503);
  }
}

// 处理静态资源请求
async function handleStaticAsset(request) {
  // 缓存策略：缓存优先
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Static asset request failed:', request.url);
    return createErrorResponse('资源加载失败', 404);
  }
}

// 处理页面导航请求
async function handleNavigation(request) {
  try {
    // 尝试从网络获取
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('[SW] Navigation request failed, trying cache');
  }

  // 网络失败时尝试缓存
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  // 最后返回离线页面
  const offlineResponse = await caches.match('/offline.html');
  if (offlineResponse) {
    return offlineResponse;
  }

  return createErrorResponse('离线状态，无法访问此页面', 503);
}

// 获取缓存时间
function getCacheTTL(pathname) {
  if (pathname.includes('/vocabulary/')) {
    return API_CACHE_CONFIG.vocabularyTTL;
  }
  if (pathname.includes('/statistics/')) {
    return API_CACHE_CONFIG.statsTTL;
  }
  return API_CACHE_CONFIG.defaultTTL;
}

// 检查缓存是否过期
async function isCacheExpired(url) {
  try {
    const expiry = await getCacheExpiry(url);
    return expiry && Date.now() > expiry;
  } catch {
    return false; // 如果无法检查过期时间，假设未过期
  }
}

// 设置缓存过期时间（简化实现，实际应用中建议使用 IndexedDB）
async function setCacheExpiry(url, expiry) {
  // 这里简化实现，实际应用中应该使用 IndexedDB
  localStorage.setItem(`sw-cache-expiry-${url}`, expiry.toString());
}

// 获取缓存过期时间
async function getCacheExpiry(url) {
  const expiry = localStorage.getItem(`sw-cache-expiry-${url}`);
  return expiry ? parseInt(expiry, 10) : null;
}

// 创建错误响应
function createErrorResponse(message, status = 500) {
  return new Response(JSON.stringify({
    error: true,
    message,
    status,
    timestamp: new Date().toISOString()
  }), {
    status,
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

// 监听消息事件（用于与主线程通信）
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'GET_VERSION':
      event.ports[0].postMessage({
        type: 'VERSION_RESPONSE',
        data: { version: CACHE_NAME }
      });
      break;

    case 'CLEAR_CACHE':
      clearCaches().then(() => {
        event.ports[0].postMessage({
          type: 'CACHE_CLEARED',
          data: { success: true }
        });
      });
      break;
  }
});

// 清理缓存
async function clearCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames
      .filter(name => name.startsWith('engread-'))
      .map(name => caches.delete(name))
  );
}

// 后台同步事件（如果支持）
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// 后台同步逻辑
async function doBackgroundSync() {
  try {
    // 同步离线数据
    console.log('[SW] Performing background sync');

    // 这里可以实现具体的数据同步逻辑
    // 例如：同步学习进度、统计数据等

  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// 推送通知事件
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '查看详情',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: '关闭',
        icon: '/icons/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Eng Read', options)
  );
});

// 通知点击事件
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

console.log('[SW] Service worker loaded successfully');
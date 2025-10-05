import { g as useRoute, u as useRouter, h as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, ref, watch, resolveComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-C5hZCYX9.mjs';
import { u as useHead } from './v3-BDKYeZr2.mjs';
import { onBeforeRouteUpdate } from 'vue-router';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'bcryptjs';
import 'jsonwebtoken';
import '@prisma/client';
import '@iconify/utils';
import 'consola';
import 'ipx';
import '@iconify/vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: "%s - \u667A\u80FD\u82F1\u8BED\u5B66\u4E60\u5E73\u53F0",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "\u901A\u8FC7AI\u6280\u672F\u548C\u4E2A\u6027\u5316\u7B97\u6CD5\uFF0C\u63D0\u4F9B\u9AD8\u6548\u7684\u82F1\u8BED\u9605\u8BFB\u7406\u89E3\u5B66\u4E60\u4F53\u9A8C" }
      ],
      htmlAttrs: {
        lang: "zh-CN"
      }
    });
    const isLoading = ref(false);
    useAuth();
    const route = useRoute();
    useRouter();
    onBeforeRouteUpdate(() => {
      isLoading.value = true;
    });
    onAfterRouteLeave(() => {
      isLoading.value = false;
    });
    watch(
      () => route.path,
      () => {
        isLoading.value = true;
        setTimeout(() => {
          isLoading.value = false;
        }, 300);
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppHeader = resolveComponent("AppHeader");
      const _component_AppFooter = resolveComponent("AppFooter");
      const _component_ClientOnly = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 dark:bg-gray-900" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_AppHeader, null, null, _parent));
      _push(`<main class="flex-1">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(_component_AppFooter, null, null, _parent));
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-MxUPFaLQ.mjs.map

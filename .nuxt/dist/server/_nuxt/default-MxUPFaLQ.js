import { g as useRoute, u as useRouter, h as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, ref, watch, resolveComponent, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from "vue/server-renderer";
import { u as useAuth } from "./useAuth-C5hZCYX9.js";
import { u as useHead } from "./v3-BDKYeZr2.js";
import { onBeforeRouteUpdate } from "vue-router";
import "ofetch";
import "#internal/nuxt/paths";
import "/home/roy/eng_read/node_modules/hookable/dist/index.mjs";
import "/home/roy/eng_read/node_modules/unctx/dist/index.mjs";
import "/home/roy/eng_read/node_modules/h3/dist/index.mjs";
import "/home/roy/eng_read/node_modules/radix3/dist/index.mjs";
import "/home/roy/eng_read/node_modules/defu/dist/defu.mjs";
import "/home/roy/eng_read/node_modules/ufo/dist/index.mjs";
import "/home/roy/eng_read/node_modules/klona/dist/index.mjs";
import "@iconify/vue";
import "/home/roy/eng_read/node_modules/nuxt/node_modules/cookie-es/dist/index.mjs";
import "/home/roy/eng_read/node_modules/destr/dist/index.mjs";
import "/home/roy/eng_read/node_modules/ohash/dist/index.mjs";
import "/home/roy/eng_read/node_modules/@unhead/vue/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: "%s - 智能英语学习平台",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "通过AI技术和个性化算法，提供高效的英语阅读理解学习体验" }
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
      const _component_ClientOnly = __nuxt_component_0;
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
export {
  _sfc_main as default
};
//# sourceMappingURL=default-MxUPFaLQ.js.map

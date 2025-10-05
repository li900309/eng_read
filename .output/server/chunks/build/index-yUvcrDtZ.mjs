import __nuxt_component_0 from './index-CJ3Imqbm.mjs';
import { defineComponent, ref, resolveComponent, mergeProps, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-C5hZCYX9.mjs';
import { u as useHead } from './v3-BDKYeZr2.mjs';
import { n as navigateTo } from './server.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "\u9996\u9875",
      meta: [
        { name: "description", content: "\u667A\u80FD\u82F1\u8BED\u5B66\u4E60\u5E73\u53F0 - \u901A\u8FC7AI\u6280\u672F\u548C\u79D1\u5B66\u8BB0\u5FC6\u7B97\u6CD5\uFF0C\u63D0\u4F9B\u9AD8\u6548\u7684\u82F1\u8BED\u5B66\u4E60\u4F53\u9A8C" }
      ]
    });
    const { isAuthenticated } = useAuth();
    const stats = ref({
      totalVocabularies: 12500,
      activeUsers: 3280,
      dailyLearners: 856
    });
    const features = ref([
      {
        id: 1,
        icon: "heroicons-brain",
        title: "AI\u667A\u80FD\u63A8\u8350",
        description: "\u57FA\u4E8E\u5B66\u4E60\u5386\u53F2\u548C\u8868\u73B0\uFF0C\u667A\u80FD\u63A8\u8350\u6700\u9002\u5408\u7684\u8BCD\u6C47\u548C\u5B66\u4E60\u5185\u5BB9\uFF0C\u63D0\u9AD8\u5B66\u4E60\u6548\u7387\u3002"
      },
      {
        id: 2,
        icon: "heroicons-chart-bar",
        title: "\u5B66\u4E60\u5206\u6790",
        description: "\u8BE6\u7EC6\u7684\u5B66\u4E60\u6570\u636E\u5206\u6790\uFF0C\u5E2E\u52A9\u60A8\u4E86\u89E3\u5B66\u4E60\u8FDB\u5EA6\u548C\u8584\u5F31\u73AF\u8282\uFF0C\u5236\u5B9A\u9488\u5BF9\u6027\u7684\u5B66\u4E60\u8BA1\u5212\u3002"
      },
      {
        id: 3,
        icon: "heroicons-clock",
        title: "\u95F4\u9694\u91CD\u590D",
        description: "\u79D1\u5B66\u7684\u827E\u5BBE\u6D69\u65AF\u9057\u5FD8\u66F2\u7EBF\u7B97\u6CD5\uFF0C\u5728\u6700\u6070\u5F53\u7684\u65F6\u95F4\u5B89\u6392\u590D\u4E60\uFF0C\u63D0\u9AD8\u8BB0\u5FC6\u6548\u679C\u3002"
      },
      {
        id: 4,
        icon: "heroicons-device-phone-mobile",
        title: "\u591A\u7AEF\u540C\u6B65",
        description: "\u652F\u6301\u624B\u673A\u3001\u5E73\u677F\u3001\u7535\u8111\u7B49\u591A\u8BBE\u5907\u5B66\u4E60\uFF0C\u5B66\u4E60\u8FDB\u5EA6\u5B9E\u65F6\u540C\u6B65\uFF0C\u968F\u65F6\u968F\u5730\u5B66\u4E60\u3002"
      },
      {
        id: 5,
        icon: "heroicons-trophy",
        title: "\u6210\u5C31\u7CFB\u7EDF",
        description: "\u4E30\u5BCC\u7684\u6210\u5C31\u7CFB\u7EDF\u548C\u6FC0\u52B1\u673A\u5236\uFF0C\u8BA9\u5B66\u4E60\u5145\u6EE1\u4E50\u8DA3\uFF0C\u6301\u7EED\u4FDD\u6301\u5B66\u4E60\u52A8\u529B\u3002"
      },
      {
        id: 6,
        icon: "heroicons-academic-cap",
        title: "\u4E2A\u6027\u5316\u5B66\u4E60",
        description: "\u6839\u636E\u60A8\u7684\u5B66\u4E60\u76EE\u6807\u548C\u6C34\u5E73\uFF0C\u5B9A\u5236\u4E2A\u6027\u5316\u7684\u5B66\u4E60\u8DEF\u5F84\u548C\u5185\u5BB9\u5B89\u6392\u3002"
      }
    ]);
    const learningModes = ref([
      {
        id: 1,
        title: "\u8BCD\u6C47\u5B66\u4E60",
        description: "\u901A\u8FC7\u5355\u8BCD\u5361\u7247\u3001\u4F8B\u53E5\u7406\u89E3\u3001\u8BED\u97F3\u8DDF\u8BFB\u7B49\u65B9\u5F0F\u6DF1\u5165\u5B66\u4E60\u8BCD\u6C47",
        icon: "heroicons-book-open",
        color: "blue"
      },
      {
        id: 2,
        title: "\u9605\u8BFB\u7406\u89E3",
        description: "\u7CBE\u9009\u6587\u7AE0\u9605\u8BFB\uFF0C\u63D0\u5347\u9605\u8BFB\u901F\u5EA6\u548C\u7406\u89E3\u80FD\u529B\uFF0C\u6269\u5927\u8BCD\u6C47\u91CF",
        icon: "heroicons-document-text",
        color: "green"
      },
      {
        id: 3,
        title: "\u667A\u80FD\u6D4B\u8BD5",
        description: "\u591A\u6837\u5316\u7684\u6D4B\u8BD5\u5F62\u5F0F\uFF0C\u68C0\u9A8C\u5B66\u4E60\u6548\u679C\uFF0C\u53D1\u73B0\u77E5\u8BC6\u76F2\u70B9",
        icon: "heroicons-clipboard-document-check",
        color: "purple"
      }
    ]);
    const formatNumber = (num) => {
      return num.toLocaleString("zh-CN");
    };
    const scrollToFeatures = () => {
      const element = (void 0).getElementById("features");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    };
    const handleGetStarted = () => {
      if (isAuthenticated.value) {
        navigateTo("/learning");
      } else {
        navigateTo("/register");
      }
    };
    const handleLogin = () => {
      navigateTo("/login");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = resolveComponent("UButton");
      const _component_Icon = __nuxt_component_0;
      const _component_FeatureCard = resolveComponent("FeatureCard");
      const _component_LearningModeCard = resolveComponent("LearningModeCard");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))}><section class="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20 lg:py-32"><div class="container mx-auto px-4"><div class="grid lg:grid-cols-2 gap-12 items-center"><div class="text-center lg:text-left space-y-8"><div class="space-y-4"><h1 class="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white"> \u638C\u63E1\u82F1\u8BED <span class="text-gradient-primary"> \u4ECE\u8FD9\u91CC\u5F00\u59CB</span></h1><p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl"> \u901A\u8FC7AI\u6280\u672F\u548C\u79D1\u5B66\u7684\u8BB0\u5FC6\u7B97\u6CD5\uFF0C\u63D0\u4F9B\u4E2A\u6027\u5316\u7684\u82F1\u8BED\u5B66\u4E60\u4F53\u9A8C\u3002\u667A\u80FD\u8BCD\u6C47\u63A8\u8350\u3001\u81EA\u9002\u5E94\u5B66\u4E60\u8DEF\u5F84\uFF0C\u8BA9\u5B66\u4E60\u66F4\u9AD8\u6548\u3002 </p></div><div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">`);
      _push(ssrRenderComponent(_component_UButton, {
        size: "lg",
        color: "primary",
        class: "text-lg px-8 py-3",
        onClick: handleGetStarted
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u7ACB\u5373\u5F00\u59CB\u5B66\u4E60 `);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "heroicons-arrow-right",
              class: "ml-2 w-5 h-5"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" \u7ACB\u5373\u5F00\u59CB\u5B66\u4E60 "),
              createVNode(_component_Icon, {
                name: "heroicons-arrow-right",
                class: "ml-2 w-5 h-5"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        size: "lg",
        variant: "outline",
        class: "text-lg px-8 py-3",
        onClick: scrollToFeatures
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u4E86\u89E3\u66F4\u591A `);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "heroicons-information-circle",
              class: "ml-2 w-5 h-5"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" \u4E86\u89E3\u66F4\u591A "),
              createVNode(_component_Icon, {
                name: "heroicons-information-circle",
                class: "ml-2 w-5 h-5"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-3 gap-8 pt-8"><div class="text-center"><div class="text-3xl font-bold text-primary-600 dark:text-primary-400">${ssrInterpolate(formatNumber(stats.value.totalVocabularies))}</div><div class="text-sm text-gray-600 dark:text-gray-400">\u8BCD\u6C47\u5E93</div></div><div class="text-center"><div class="text-3xl font-bold text-primary-600 dark:text-primary-400">${ssrInterpolate(formatNumber(stats.value.activeUsers))}</div><div class="text-sm text-gray-600 dark:text-gray-400">\u6D3B\u8DC3\u7528\u6237</div></div><div class="text-center"><div class="text-3xl font-bold text-primary-600 dark:text-primary-400">${ssrInterpolate(formatNumber(stats.value.dailyLearners))}</div><div class="text-sm text-gray-600 dark:text-gray-400">\u65E5\u5B66\u4E60\u4EBA\u6570</div></div></div></div><div class="relative"><div class="relative z-10"><img src="https://via.placeholder.com/500x300/4F46E5/FFFFFF?text=\u667A\u80FD\u82F1\u8BED\u5B66\u4E60" alt="\u82F1\u8BED\u5B66\u4E60\u63D2\u753B" class="w-full h-auto" loading="eager"></div><div class="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-primary-200/20 to-purple-200/20 rounded-3xl transform rotate-3"></div></div></div></div></section><section id="features" class="py-20 lg:py-32 bg-white dark:bg-gray-900"><div class="container mx-auto px-4"><div class="text-center mb-16"><h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4"> \u4E3A\u4EC0\u4E48\u9009\u62E9\u6211\u4EEC </h2><p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"> \u91C7\u7528\u5148\u8FDB\u7684\u5B66\u4E60\u79D1\u5B66\u539F\u7406\u548CAI\u6280\u672F\uFF0C\u4E3A\u60A8\u91CF\u8EAB\u5B9A\u5236\u6700\u6709\u6548\u7684\u82F1\u8BED\u5B66\u4E60\u65B9\u6848 </p></div><div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8"><!--[-->`);
      ssrRenderList(features.value, (feature) => {
        _push(ssrRenderComponent(_component_FeatureCard, {
          key: feature.id,
          icon: feature.icon,
          title: feature.title,
          description: feature.description
        }, null, _parent));
      });
      _push(`<!--]--></div></div></section><section class="py-20 lg:py-32 bg-gray-50 dark:bg-gray-800"><div class="container mx-auto px-4"><div class="text-center mb-16"><h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4"> \u591A\u6837\u5316\u5B66\u4E60\u6A21\u5F0F </h2><p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"> \u6839\u636E\u60A8\u7684\u5B66\u4E60\u76EE\u6807\u548C\u504F\u597D\uFF0C\u9009\u62E9\u6700\u9002\u5408\u7684\u5B66\u4E60\u65B9\u5F0F </p></div><div class="grid lg:grid-cols-3 gap-8"><!--[-->`);
      ssrRenderList(learningModes.value, (mode) => {
        _push(ssrRenderComponent(_component_LearningModeCard, {
          key: mode.id,
          mode
        }, null, _parent));
      });
      _push(`<!--]--></div></div></section><section class="py-20 lg:py-32 bg-gradient-to-r from-primary-600 to-indigo-600"><div class="container mx-auto px-4 text-center"><h2 class="text-3xl lg:text-4xl font-bold text-white mb-4"> \u51C6\u5907\u597D\u5F00\u59CB\u5B66\u4E60\u4E86\u5417\uFF1F </h2><p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"> \u52A0\u5165\u6211\u4EEC\uFF0C\u5F00\u542F\u60A8\u7684\u82F1\u8BED\u5B66\u4E60\u4E4B\u65C5\u3002\u514D\u8D39\u6CE8\u518C\uFF0C\u5373\u523B\u4F53\u9A8C\u667A\u80FD\u5B66\u4E60\u7684\u9B45\u529B\u3002 </p><div class="flex flex-col sm:flex-row gap-4 justify-center">`);
      _push(ssrRenderComponent(_component_UButton, {
        size: "lg",
        color: "white",
        variant: "solid",
        class: "text-lg px-8 py-3 text-primary-600",
        onClick: handleGetStarted
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u514D\u8D39\u6CE8\u518C `);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "heroicons-arrow-right",
              class: "ml-2 w-5 h-5"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" \u514D\u8D39\u6CE8\u518C "),
              createVNode(_component_Icon, {
                name: "heroicons-arrow-right",
                class: "ml-2 w-5 h-5"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        size: "lg",
        variant: "outline",
        class: "text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-primary-600",
        onClick: handleLogin
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u7ACB\u5373\u767B\u5F55 `);
          } else {
            return [
              createTextVNode(" \u7ACB\u5373\u767B\u5F55 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-yUvcrDtZ.mjs.map

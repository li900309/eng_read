import __nuxt_component_0 from "./index-CJ3Imqbm.js";
import { defineComponent, ref, resolveComponent, mergeProps, withCtx, createTextVNode, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { u as useAuth } from "./useAuth-C5hZCYX9.js";
import { u as useHead } from "./v3-BDKYeZr2.js";
import { n as navigateTo } from "../server.mjs";
import "@iconify/vue";
import "@iconify/utils/lib/css/icon";
import "/home/roy/eng_read/node_modules/perfect-debounce/dist/index.mjs";
import "/home/roy/eng_read/node_modules/nuxt/node_modules/cookie-es/dist/index.mjs";
import "/home/roy/eng_read/node_modules/h3/dist/index.mjs";
import "/home/roy/eng_read/node_modules/destr/dist/index.mjs";
import "/home/roy/eng_read/node_modules/ohash/dist/index.mjs";
import "/home/roy/eng_read/node_modules/klona/dist/index.mjs";
import "/home/roy/eng_read/node_modules/@unhead/vue/dist/index.mjs";
import "ofetch";
import "#internal/nuxt/paths";
import "/home/roy/eng_read/node_modules/hookable/dist/index.mjs";
import "/home/roy/eng_read/node_modules/unctx/dist/index.mjs";
import "vue-router";
import "/home/roy/eng_read/node_modules/radix3/dist/index.mjs";
import "/home/roy/eng_read/node_modules/defu/dist/defu.mjs";
import "/home/roy/eng_read/node_modules/ufo/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "首页",
      meta: [
        { name: "description", content: "智能英语学习平台 - 通过AI技术和科学记忆算法，提供高效的英语学习体验" }
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
        title: "AI智能推荐",
        description: "基于学习历史和表现，智能推荐最适合的词汇和学习内容，提高学习效率。"
      },
      {
        id: 2,
        icon: "heroicons-chart-bar",
        title: "学习分析",
        description: "详细的学习数据分析，帮助您了解学习进度和薄弱环节，制定针对性的学习计划。"
      },
      {
        id: 3,
        icon: "heroicons-clock",
        title: "间隔重复",
        description: "科学的艾宾浩斯遗忘曲线算法，在最恰当的时间安排复习，提高记忆效果。"
      },
      {
        id: 4,
        icon: "heroicons-device-phone-mobile",
        title: "多端同步",
        description: "支持手机、平板、电脑等多设备学习，学习进度实时同步，随时随地学习。"
      },
      {
        id: 5,
        icon: "heroicons-trophy",
        title: "成就系统",
        description: "丰富的成就系统和激励机制，让学习充满乐趣，持续保持学习动力。"
      },
      {
        id: 6,
        icon: "heroicons-academic-cap",
        title: "个性化学习",
        description: "根据您的学习目标和水平，定制个性化的学习路径和内容安排。"
      }
    ]);
    const learningModes = ref([
      {
        id: 1,
        title: "词汇学习",
        description: "通过单词卡片、例句理解、语音跟读等方式深入学习词汇",
        icon: "heroicons-book-open",
        color: "blue"
      },
      {
        id: 2,
        title: "阅读理解",
        description: "精选文章阅读，提升阅读速度和理解能力，扩大词汇量",
        icon: "heroicons-document-text",
        color: "green"
      },
      {
        id: 3,
        title: "智能测试",
        description: "多样化的测试形式，检验学习效果，发现知识盲点",
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))}><section class="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20 lg:py-32"><div class="container mx-auto px-4"><div class="grid lg:grid-cols-2 gap-12 items-center"><div class="text-center lg:text-left space-y-8"><div class="space-y-4"><h1 class="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white"> 掌握英语 <span class="text-gradient-primary"> 从这里开始</span></h1><p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl"> 通过AI技术和科学的记忆算法，提供个性化的英语学习体验。智能词汇推荐、自适应学习路径，让学习更高效。 </p></div><div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">`);
      _push(ssrRenderComponent(_component_UButton, {
        size: "lg",
        color: "primary",
        class: "text-lg px-8 py-3",
        onClick: handleGetStarted
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` 立即开始学习 `);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "heroicons-arrow-right",
              class: "ml-2 w-5 h-5"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" 立即开始学习 "),
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
            _push2(` 了解更多 `);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "heroicons-information-circle",
              class: "ml-2 w-5 h-5"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" 了解更多 "),
              createVNode(_component_Icon, {
                name: "heroicons-information-circle",
                class: "ml-2 w-5 h-5"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-3 gap-8 pt-8"><div class="text-center"><div class="text-3xl font-bold text-primary-600 dark:text-primary-400">${ssrInterpolate(formatNumber(stats.value.totalVocabularies))}</div><div class="text-sm text-gray-600 dark:text-gray-400">词汇库</div></div><div class="text-center"><div class="text-3xl font-bold text-primary-600 dark:text-primary-400">${ssrInterpolate(formatNumber(stats.value.activeUsers))}</div><div class="text-sm text-gray-600 dark:text-gray-400">活跃用户</div></div><div class="text-center"><div class="text-3xl font-bold text-primary-600 dark:text-primary-400">${ssrInterpolate(formatNumber(stats.value.dailyLearners))}</div><div class="text-sm text-gray-600 dark:text-gray-400">日学习人数</div></div></div></div><div class="relative"><div class="relative z-10"><img src="https://via.placeholder.com/500x300/4F46E5/FFFFFF?text=智能英语学习" alt="英语学习插画" class="w-full h-auto" loading="eager"></div><div class="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-primary-200/20 to-purple-200/20 rounded-3xl transform rotate-3"></div></div></div></div></section><section id="features" class="py-20 lg:py-32 bg-white dark:bg-gray-900"><div class="container mx-auto px-4"><div class="text-center mb-16"><h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4"> 为什么选择我们 </h2><p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"> 采用先进的学习科学原理和AI技术，为您量身定制最有效的英语学习方案 </p></div><div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8"><!--[-->`);
      ssrRenderList(features.value, (feature) => {
        _push(ssrRenderComponent(_component_FeatureCard, {
          key: feature.id,
          icon: feature.icon,
          title: feature.title,
          description: feature.description
        }, null, _parent));
      });
      _push(`<!--]--></div></div></section><section class="py-20 lg:py-32 bg-gray-50 dark:bg-gray-800"><div class="container mx-auto px-4"><div class="text-center mb-16"><h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4"> 多样化学习模式 </h2><p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"> 根据您的学习目标和偏好，选择最适合的学习方式 </p></div><div class="grid lg:grid-cols-3 gap-8"><!--[-->`);
      ssrRenderList(learningModes.value, (mode) => {
        _push(ssrRenderComponent(_component_LearningModeCard, {
          key: mode.id,
          mode
        }, null, _parent));
      });
      _push(`<!--]--></div></div></section><section class="py-20 lg:py-32 bg-gradient-to-r from-primary-600 to-indigo-600"><div class="container mx-auto px-4 text-center"><h2 class="text-3xl lg:text-4xl font-bold text-white mb-4"> 准备好开始学习了吗？ </h2><p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"> 加入我们，开启您的英语学习之旅。免费注册，即刻体验智能学习的魅力。 </p><div class="flex flex-col sm:flex-row gap-4 justify-center">`);
      _push(ssrRenderComponent(_component_UButton, {
        size: "lg",
        color: "white",
        variant: "solid",
        class: "text-lg px-8 py-3 text-primary-600",
        onClick: handleGetStarted
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` 免费注册 `);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "heroicons-arrow-right",
              class: "ml-2 w-5 h-5"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" 免费注册 "),
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
            _push2(` 立即登录 `);
          } else {
            return [
              createTextVNode(" 立即登录 ")
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
export {
  _sfc_main as default
};
//# sourceMappingURL=index-yUvcrDtZ.js.map

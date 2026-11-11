import { k as useRoute, b as useHousehold, r as useSupabaseUser, a as __nuxt_component_0, e as __nuxt_component_1, g as __nuxt_component_3 } from "../server.mjs";
import { _ as __nuxt_component_2 } from "./Badge-BM4yH9XJ.js";
import { defineComponent, computed, mergeProps, withCtx, createVNode, unref, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderSlot } from "vue/server-renderer";
import "/Users/ccci/Expense Tracker/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/ccci/Expense Tracker/node_modules/hookable/dist/index.mjs";
import "/Users/ccci/Expense Tracker/node_modules/nuxt/node_modules/unctx/dist/index.mjs";
import "/Users/ccci/Expense Tracker/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/ccci/Expense Tracker/node_modules/defu/dist/defu.mjs";
import "/Users/ccci/Expense Tracker/node_modules/ufo/dist/index.mjs";
import "/Users/ccci/Expense Tracker/node_modules/unctx/dist/index.mjs";
import "@supabase/ssr";
import "/Users/ccci/Expense Tracker/node_modules/nuxt/node_modules/cookie-es/dist/index.mjs";
import "/Users/ccci/Expense Tracker/node_modules/destr/dist/index.mjs";
import "/Users/ccci/Expense Tracker/node_modules/ohash/dist/index.mjs";
import "/Users/ccci/Expense Tracker/node_modules/klona/dist/index.mjs";
import "@vueuse/core";
import "tailwind-merge";
import "/Users/ccci/Expense Tracker/node_modules/@unhead/vue/dist/index.mjs";
import "@iconify/vue";
import "@iconify/utils/lib/css/icon";
import "/Users/ccci/Expense Tracker/node_modules/perfect-debounce/dist/index.mjs";
import "ohash/utils";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { household, profile } = useHousehold();
    const user = useSupabaseUser();
    const navItems = [
      { label: "Home", to: "/", icon: "i-heroicons-home" },
      { label: "Expenses", to: "/expenses", icon: "i-heroicons-shopping-bag" },
      { label: "Bills", to: "/bills", icon: "i-heroicons-calendar-days" },
      { label: "Balances", to: "/balances", icon: "i-heroicons-scale" },
      { label: "Reports", to: "/reports", icon: "i-heroicons-document-chart-bar" },
      { label: "Settings", to: "/settings", icon: "i-heroicons-cog-6-tooth" }
    ];
    const showNav = computed(() => !!user.value && !!profile.value?.household_id);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_UIcon = __nuxt_component_1;
      const _component_UBadge = __nuxt_component_2;
      const _component_UAvatar = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col" }, _attrs))}><header class="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800"><div class="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between"><div class="flex items-center gap-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-2 font-bold text-lg text-primary-600 dark:text-primary-400"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-home-modern",
              class: "w-6 h-6"
            }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>HouseSplit</span>`);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-heroicons-home-modern",
                class: "w-6 h-6"
              }),
              createVNode("span", null, "HouseSplit")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(household)) {
        _push(ssrRenderComponent(_component_UBadge, {
          color: "primary",
          variant: "subtle",
          size: "sm",
          class: "hidden xs:inline-flex"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(household).name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(household).name), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(showNav)) {
        _push(`<nav class="hidden md:flex items-center gap-1"><!--[-->`);
        ssrRenderList(navItems, (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.to,
            to: item.to,
            class: ["px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5", unref(route).path === item.to || item.to !== "/" && unref(route).path.startsWith(item.to) ? "bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400" : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: item.icon,
                  class: "w-4 h-4"
                }, null, _parent2, _scopeId));
                _push2(`<span${_scopeId}>${ssrInterpolate(item.label)}</span>`);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: item.icon,
                    class: "w-4 h-4"
                  }, null, 8, ["name"]),
                  createVNode("span", null, toDisplayString(item.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></nav>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-center gap-2">`);
      if (unref(profile)?.display_name) {
        _push(`<span class="text-xs text-gray-500 hidden sm:inline">${ssrInterpolate(unref(profile).display_name)}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showNav)) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/settings",
          class: "flex items-center"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UAvatar, {
                alt: unref(profile)?.display_name || "U",
                size: "xs",
                class: "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 ring-2 ring-primary-500/20"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UAvatar, {
                  alt: unref(profile)?.display_name || "U",
                  size: "xs",
                  class: "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 ring-2 ring-primary-500/20"
                }, null, 8, ["alt"])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></header><main class="${ssrRenderClass([unref(showNav) ? "pb-24 md:pb-8" : "", "flex-1 max-w-4xl w-full mx-auto px-4 py-4 sm:py-6"])}">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      if (unref(showNav)) {
        _push(`<nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t border-gray-200 dark:border-gray-800 safe-bottom"><div class="grid grid-cols-6 h-16"><!--[-->`);
        ssrRenderList(navItems, (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.to,
            to: item.to,
            class: ["flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors", unref(route).path === item.to || item.to !== "/" && unref(route).path.startsWith(item.to) ? "text-primary-600 dark:text-primary-400" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: item.icon,
                  class: "w-5 h-5"
                }, null, _parent2, _scopeId));
                _push2(`<span${_scopeId}>${ssrInterpolate(item.label)}</span>`);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: item.icon,
                    class: "w-5 h-5"
                  }, null, 8, ["name"]),
                  createVNode("span", null, toDisplayString(item.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></nav>`);
      } else {
        _push(`<!---->`);
      }
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
//# sourceMappingURL=default-HH0Xq7uH.js.map

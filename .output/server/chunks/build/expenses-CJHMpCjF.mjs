import { b as useHousehold, d as __nuxt_component_0$1, e as __nuxt_component_1$1, a as __nuxt_component_0$3 } from './server.mjs';
import { _ as __nuxt_component_1 } from './Select-C-nPKItW.mjs';
import { _ as __nuxt_component_2 } from './Input-BTTc9Q3-.mjs';
import { _ as __nuxt_component_3 } from './Skeleton-Tz2BgSk_.mjs';
import { defineComponent, ref, watch, computed, mergeProps, unref, withCtx, createTextVNode, isRef, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { f as formatMoney } from './money-z3Rw8dBE.mjs';
import { u as useExpenses } from './useExpenses-BKVyoStV.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'vue-router';
import '@supabase/ssr';
import '@vueuse/core';
import 'tailwind-merge';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import './useFormGroup-BVR2qx0l.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { household } = useHousehold();
    const { expenses, loading, fetchExpenses } = useExpenses();
    const currentMonthString = () => {
      const now = /* @__PURE__ */ new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    };
    const selectedMonth = ref(currentMonthString());
    const searchQuery = ref("");
    watch(selectedMonth, () => {
      fetchExpenses(selectedMonth.value, searchQuery.value);
    });
    let searchDebounce;
    const handleSearch = () => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        fetchExpenses(selectedMonth.value, searchQuery.value);
      }, 300);
    };
    const monthOptions = computed(() => {
      const list = [];
      const now = /* @__PURE__ */ new Date();
      for (let i = -5; i <= 2; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        list.push({ label, value: val });
      }
      return list;
    });
    const totalMonthSpent = computed(() => {
      return expenses.value.reduce((sum, e) => sum + e.total_amount, 0);
    });
    const formatDate = (dateStr) => {
      try {
        const d = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      } catch {
        return dateStr;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_UButton = __nuxt_component_0$1;
      const _component_USelect = __nuxt_component_1;
      const _component_UInput = __nuxt_component_2;
      const _component_USkeleton = __nuxt_component_3;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_NuxtLink = __nuxt_component_0$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-5 max-w-2xl mx-auto" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Expenses</h1><p class="text-xs text-gray-500 mt-0.5"> Total for month: <span class="font-bold font-mono text-gray-900 dark:text-white">${ssrInterpolate(unref(formatMoney)(unref(totalMonthSpent), (_a = unref(household)) == null ? void 0 : _a.currency))}</span></p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/expenses/new",
        color: "primary",
        icon: "i-heroicons-plus",
        size: "md"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Add Expense `);
          } else {
            return [
              createTextVNode(" Add Expense ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-1 sm:grid-cols-2 gap-3">`);
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: unref(selectedMonth),
        "onUpdate:modelValue": ($event) => isRef(selectedMonth) ? selectedMonth.value = $event : null,
        options: unref(monthOptions),
        "option-attribute": "label",
        "value-attribute": "value",
        icon: "i-heroicons-calendar"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(searchQuery),
        "onUpdate:modelValue": ($event) => isRef(searchQuery) ? searchQuery.value = $event : null,
        placeholder: "Search store or item name...",
        icon: "i-heroicons-magnifying-glass",
        onInput: handleSearch
      }, null, _parent));
      _push(`</div>`);
      if (unref(loading) && unref(expenses).length === 0) {
        _push(`<div class="space-y-3">`);
        _push(ssrRenderComponent(_component_USkeleton, { class: "h-20 w-full rounded-xl" }, null, _parent));
        _push(ssrRenderComponent(_component_USkeleton, { class: "h-20 w-full rounded-xl" }, null, _parent));
        _push(ssrRenderComponent(_component_USkeleton, { class: "h-20 w-full rounded-xl" }, null, _parent));
        _push(`</div>`);
      } else if (unref(expenses).length === 0) {
        _push(`<div class="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-8">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-receipt-refund",
          class: "w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3"
        }, null, _parent));
        _push(`<h3 class="font-medium text-gray-900 dark:text-white">No expenses found</h3><p class="text-xs text-gray-500 mt-1 max-w-xs mx-auto"> No recorded expenses for this filter. Tap &quot;Add Expense&quot; to log your groceries or receipts. </p>`);
        _push(ssrRenderComponent(_component_UButton, {
          to: "/expenses/new",
          color: "primary",
          variant: "soft",
          size: "sm",
          class: "mt-4",
          icon: "i-heroicons-plus"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Add First Expense `);
            } else {
              return [
                createTextVNode(" Add First Expense ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(unref(expenses), (expense) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: expense.id,
            to: `/expenses/${expense.id}`,
            class: "block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-400 dark:hover:border-primary-600 transition-all shadow-xs"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              var _a2, _b, _c, _d;
              if (_push2) {
                _push2(`<div class="flex items-start justify-between"${_scopeId}><div class="space-y-1"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><span class="font-bold text-base text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(expense.store_name)}</span></div><div class="flex items-center gap-2 text-xs text-gray-500"${_scopeId}><span${_scopeId}>${ssrInterpolate(formatDate(expense.purchase_date))}</span><span${_scopeId}>\u2022</span><span${_scopeId}>Paid by <strong class="text-gray-700 dark:text-gray-300"${_scopeId}>${ssrInterpolate(((_a2 = expense.payer) == null ? void 0 : _a2.display_name) || "Member")}</strong></span></div><div class="text-xs text-gray-400 truncate max-w-xs sm:max-w-md"${_scopeId}>${ssrInterpolate(expense.items.length)} ${ssrInterpolate(expense.items.length === 1 ? "item" : "items")}: ${ssrInterpolate(expense.items.map((i) => i.name).join(", "))}</div></div><div class="text-right"${_scopeId}><div class="font-mono font-bold text-base text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(formatMoney)(expense.total_amount, (_b = unref(household)) == null ? void 0 : _b.currency))}</div>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-heroicons-chevron-right",
                  class: "w-4 h-4 text-gray-400 mt-1 inline-block"
                }, null, _parent2, _scopeId));
                _push2(`</div></div>`);
              } else {
                return [
                  createVNode("div", { class: "flex items-start justify-between" }, [
                    createVNode("div", { class: "space-y-1" }, [
                      createVNode("div", { class: "flex items-center gap-2" }, [
                        createVNode("span", { class: "font-bold text-base text-gray-900 dark:text-white" }, toDisplayString(expense.store_name), 1)
                      ]),
                      createVNode("div", { class: "flex items-center gap-2 text-xs text-gray-500" }, [
                        createVNode("span", null, toDisplayString(formatDate(expense.purchase_date)), 1),
                        createVNode("span", null, "\u2022"),
                        createVNode("span", null, [
                          createTextVNode("Paid by "),
                          createVNode("strong", { class: "text-gray-700 dark:text-gray-300" }, toDisplayString(((_c = expense.payer) == null ? void 0 : _c.display_name) || "Member"), 1)
                        ])
                      ]),
                      createVNode("div", { class: "text-xs text-gray-400 truncate max-w-xs sm:max-w-md" }, toDisplayString(expense.items.length) + " " + toDisplayString(expense.items.length === 1 ? "item" : "items") + ": " + toDisplayString(expense.items.map((i) => i.name).join(", ")), 1)
                    ]),
                    createVNode("div", { class: "text-right" }, [
                      createVNode("div", { class: "font-mono font-bold text-base text-gray-900 dark:text-white" }, toDisplayString(unref(formatMoney)(expense.total_amount, (_d = unref(household)) == null ? void 0 : _d.currency)), 1),
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-chevron-right",
                        class: "w-4 h-4 text-gray-400 mt-1 inline-block"
                      })
                    ])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/expenses/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=expenses-CJHMpCjF.mjs.map

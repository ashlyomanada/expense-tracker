import { b as useHousehold, d as __nuxt_component_0, e as __nuxt_component_1, a as __nuxt_component_0$1 } from "../server.mjs";
import { _ as __nuxt_component_3 } from "./Skeleton-Tz2BgSk_.js";
import { _ as __nuxt_component_2 } from "./Badge-BM4yH9XJ.js";
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
import { f as formatMoney } from "./money-z3Rw8dBE.js";
import "/Users/ccci/Expense Tracker/node_modules/hookable/dist/index.mjs";
import { u as useExpenses } from "./useExpenses-BKVyoStV.js";
import { u as useBills } from "./useBills-uyxpq_W9.js";
import { u as useBalances } from "./useBalances-BYNiAx9j.js";
import "/Users/ccci/Expense Tracker/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { household, profile } = useHousehold();
    const { expenses } = useExpenses();
    const { bills } = useBills();
    const { balances } = useBalances();
    const loading = ref(true);
    const totalExpensesThisMonth = computed(() => {
      return expenses.value.reduce((sum, e) => sum + e.total_amount, 0);
    });
    const totalBillsThisMonth = computed(() => {
      return bills.value.reduce((sum, b) => sum + b.amount, 0);
    });
    const totalSpentThisMonth = computed(() => {
      return Math.round((totalExpensesThisMonth.value + totalBillsThisMonth.value) * 100) / 100;
    });
    const myBalance = computed(() => {
      if (!profile.value) return 0;
      const myBal = balances.value.find((b) => b.user_id === profile.value.id);
      return myBal ? myBal.net_balance : 0;
    });
    const myShareThisMonth = computed(() => {
      if (!profile.value) return 0;
      const uid = profile.value.id;
      const expShare = expenses.value.reduce((sum, e) => {
        const itemShares = e.items.flatMap((i) => i.shares || []);
        const userShares = itemShares.filter((s) => s.user_id === uid);
        return sum + userShares.reduce((sSum, s) => sSum + s.share_amount, 0);
      }, 0);
      const billShare = bills.value.reduce((sum, b) => {
        const userShare = b.shares.find((s) => s.user_id === uid);
        return sum + (userShare ? userShare.share_amount : 0);
      }, 0);
      return Math.round((expShare + billShare) * 100) / 100;
    });
    const recentExpenses = computed(() => {
      return expenses.value.slice(0, 5);
    });
    const urgentBills = computed(() => {
      return bills.value.filter((b) => b.status === "unpaid").slice(0, 4);
    });
    const formatDate = (dateStr) => {
      try {
        const d = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } catch {
        return dateStr;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_0;
      const _component_USkeleton = __nuxt_component_3;
      const _component_UIcon = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_UBadge = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 max-w-2xl mx-auto pb-8" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white"> Hello, ${ssrInterpolate(unref(profile)?.display_name || "Housemate")}! 👋 </h1><p class="text-xs text-gray-500 mt-0.5">${ssrInterpolate(unref(household)?.name)} • Household overview </p></div><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/expenses/new",
        color: "primary",
        icon: "i-heroicons-plus",
        size: "sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Expense `);
          } else {
            return [
              createTextVNode(" Expense ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        to: "/bills",
        variant: "soft",
        color: "primary",
        icon: "i-heroicons-calendar-days",
        size: "sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Bill `);
          } else {
            return [
              createTextVNode(" Bill ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (unref(loading)) {
        _push(`<div class="grid grid-cols-2 sm:grid-cols-3 gap-3">`);
        _push(ssrRenderComponent(_component_USkeleton, { class: "h-28 rounded-xl" }, null, _parent));
        _push(ssrRenderComponent(_component_USkeleton, { class: "h-28 rounded-xl" }, null, _parent));
        _push(ssrRenderComponent(_component_USkeleton, { class: "h-28 rounded-xl col-span-2 sm:col-span-1" }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="grid grid-cols-2 sm:grid-cols-3 gap-3"><div class="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs"><div class="flex items-center justify-between"><p class="text-xs text-gray-500 font-medium">This Month Spent</p>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-chart-pie",
          class: "w-4 h-4 text-gray-400"
        }, null, _parent));
        _push(`</div><p class="text-xl font-bold font-mono text-gray-900 dark:text-white mt-1">${ssrInterpolate(unref(formatMoney)(unref(totalSpentThisMonth), unref(household)?.currency))}</p><p class="text-[11px] text-gray-400 mt-1"> Expenses + Bills </p></div><div class="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs"><div class="flex items-center justify-between"><p class="text-xs text-gray-500 font-medium">My Month Share</p>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-user",
          class: "w-4 h-4 text-primary-500"
        }, null, _parent));
        _push(`</div><p class="text-xl font-bold font-mono text-primary-600 dark:text-primary-400 mt-1">${ssrInterpolate(unref(formatMoney)(unref(myShareThisMonth), unref(household)?.currency))}</p><p class="text-[11px] text-gray-400 mt-1"> Your portion consumed </p></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/balances",
          class: "bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs col-span-2 sm:col-span-1 hover:border-primary-400 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center justify-between"${_scopeId}><p class="text-xs text-gray-500 font-medium"${_scopeId}>My Net Balance</p>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-scale",
                class: "w-4 h-4 text-gray-400"
              }, null, _parent2, _scopeId));
              _push2(`</div><p class="${ssrRenderClass([unref(myBalance) > 5e-3 ? "text-green-600 dark:text-green-400" : unref(myBalance) < -5e-3 ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white", "text-xl font-bold font-mono mt-1"])}"${_scopeId}>${ssrInterpolate(unref(formatMoney)(Math.abs(unref(myBalance)), unref(household)?.currency))}</p><p class="${ssrRenderClass([unref(myBalance) > 5e-3 ? "text-green-600" : unref(myBalance) < -5e-3 ? "text-red-600" : "text-gray-400", "text-[11px] mt-1 font-medium flex items-center gap-1"])}"${_scopeId}><span${_scopeId}>${ssrInterpolate(unref(myBalance) > 5e-3 ? "You are owed" : unref(myBalance) < -5e-3 ? "You owe housemates" : "All settled up")}</span>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-arrow-right",
                class: "w-3 h-3"
              }, null, _parent2, _scopeId));
              _push2(`</p>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("p", { class: "text-xs text-gray-500 font-medium" }, "My Net Balance"),
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-scale",
                    class: "w-4 h-4 text-gray-400"
                  })
                ]),
                createVNode("p", {
                  class: ["text-xl font-bold font-mono mt-1", unref(myBalance) > 5e-3 ? "text-green-600 dark:text-green-400" : unref(myBalance) < -5e-3 ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"]
                }, toDisplayString(unref(formatMoney)(Math.abs(unref(myBalance)), unref(household)?.currency)), 3),
                createVNode("p", {
                  class: ["text-[11px] mt-1 font-medium flex items-center gap-1", unref(myBalance) > 5e-3 ? "text-green-600" : unref(myBalance) < -5e-3 ? "text-red-600" : "text-gray-400"]
                }, [
                  createVNode("span", null, toDisplayString(unref(myBalance) > 5e-3 ? "You are owed" : unref(myBalance) < -5e-3 ? "You owe housemates" : "All settled up"), 1),
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-arrow-right",
                    class: "w-3 h-3"
                  })
                ], 2)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`<div class="space-y-3"><div class="flex items-center justify-between"><h2 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-bell-alert",
        class: "w-4 h-4 text-amber-500"
      }, null, _parent));
      _push(`<span>Pending Bills</span></h2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/bills",
        class: "text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View all bills `);
          } else {
            return [
              createTextVNode(" View all bills ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(urgentBills).length === 0) {
        _push(`<div class="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-check-badge",
          class: "w-8 h-8 text-green-500 mx-auto mb-1"
        }, null, _parent));
        _push(`<p class="text-xs text-gray-500">All bills for this month are paid!</p></div>`);
      } else {
        _push(`<div class="space-y-2"><!--[-->`);
        ssrRenderList(unref(urgentBills), (b) => {
          _push(`<div class="p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between shadow-xs"><div><p class="font-semibold text-sm text-gray-900 dark:text-white">${ssrInterpolate(b.name)}</p><p class="text-[11px] text-gray-500">Due ${ssrInterpolate(formatDate(b.due_date))}</p></div><div class="flex items-center gap-3"><span class="font-mono font-bold text-sm text-gray-900 dark:text-white">${ssrInterpolate(unref(formatMoney)(b.amount, unref(household)?.currency))}</span>`);
          _push(ssrRenderComponent(_component_UBadge, {
            color: b.computed_status === "overdue" ? "red" : "amber",
            variant: "subtle",
            size: "xs"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(b.computed_status === "overdue" ? "Overdue" : "Unpaid")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(b.computed_status === "overdue" ? "Overdue" : "Unpaid"), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div><div class="space-y-3"><div class="flex items-center justify-between"><h2 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-shopping-bag",
        class: "w-4 h-4 text-primary-500"
      }, null, _parent));
      _push(`<span>Recent Expenses</span></h2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/expenses",
        class: "text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View all `);
          } else {
            return [
              createTextVNode(" View all ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(recentExpenses).length === 0) {
        _push(`<div class="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-center"><p class="text-xs text-gray-500">No expenses recorded yet.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          to: "/expenses/new",
          variant: "soft",
          color: "primary",
          size: "xs",
          class: "mt-2"
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
        _push(`</div>`);
      } else {
        _push(`<div class="space-y-2"><!--[-->`);
        ssrRenderList(unref(recentExpenses), (exp) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: exp.id,
            to: `/expenses/${exp.id}`,
            class: "p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between hover:border-primary-400 transition-colors shadow-xs"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div${_scopeId}><p class="font-semibold text-sm text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(exp.store_name)}</p><p class="text-[11px] text-gray-500"${_scopeId}>${ssrInterpolate(formatDate(exp.purchase_date))} • Paid by ${ssrInterpolate(exp.payer?.display_name)}</p></div><div class="text-right"${_scopeId}><span class="font-mono font-bold text-sm text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(formatMoney)(exp.total_amount, unref(household)?.currency))}</span></div>`);
              } else {
                return [
                  createVNode("div", null, [
                    createVNode("p", { class: "font-semibold text-sm text-gray-900 dark:text-white" }, toDisplayString(exp.store_name), 1),
                    createVNode("p", { class: "text-[11px] text-gray-500" }, toDisplayString(formatDate(exp.purchase_date)) + " • Paid by " + toDisplayString(exp.payer?.display_name), 1)
                  ]),
                  createVNode("div", { class: "text-right" }, [
                    createVNode("span", { class: "font-mono font-bold text-sm text-gray-900 dark:text-white" }, toDisplayString(unref(formatMoney)(exp.total_amount, unref(household)?.currency)), 1)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div>`);
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
//# sourceMappingURL=pages-CZ7ZjjzU.js.map

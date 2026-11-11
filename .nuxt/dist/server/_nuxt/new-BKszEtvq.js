import { b as useHousehold, c as useToast, d as __nuxt_component_0, n as navigateTo } from "../server.mjs";
import { _ as __nuxt_component_2 } from "./Card-BiaC1RCe.js";
import { _ as __nuxt_component_4 } from "./FormGroup-COcnPxKZ.js";
import { _ as __nuxt_component_2$1 } from "./Input-BTTc9Q3-.js";
import { _ as __nuxt_component_1 } from "./Select-C-nPKItW.js";
import { _ as _sfc_main$1 } from "./ExpenseItemRow-Bec_-5g0.js";
import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, isRef, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { f as formatMoney } from "./money-z3Rw8dBE.js";
import "/Users/ccci/Expense Tracker/node_modules/hookable/dist/index.mjs";
import { u as useExpenses } from "./useExpenses-BKVyoStV.js";
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
import "./useFormGroup-BVR2qx0l.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "new",
  __ssrInlineRender: true,
  setup(__props) {
    const { household, members, categories } = useHousehold();
    const { saveExpense } = useExpenses();
    const toast = useToast();
    const storeName = ref("");
    const purchaseDate = ref((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    const paidBy = ref("");
    const notes = ref("");
    const saving = ref(false);
    const items = ref([]);
    const allMemberIds = computed(() => members.value.map((m) => m.id));
    const addItem = () => {
      const defaultCategory = categories.value.find((c) => c.name.toLowerCase() === "groceries") || categories.value[0];
      items.value.push({
        name: "",
        quantity: 1,
        unit_price: 0,
        category_id: defaultCategory?.id || void 0,
        selected_member_ids: [...allMemberIds.value]
      });
    };
    watch(allMemberIds, (ids) => {
      if (ids.length > 0) {
        items.value.forEach((item) => {
          if (item.selected_member_ids.length === 0) {
            item.selected_member_ids = [...ids];
          }
        });
      }
    }, { immediate: true });
    const removeItem = (index) => {
      if (items.value.length > 1) {
        items.value.splice(index, 1);
      }
    };
    const applyFirstItemSplitToAll = () => {
      if (items.value.length === 0) return;
      const firstItemSelection = [...items.value[0].selected_member_ids];
      items.value.forEach((it) => {
        it.selected_member_ids = [...firstItemSelection];
      });
      toast.add({
        title: "Applied",
        description: `Applied item #1 split to all ${items.value.length} items.`,
        color: "primary"
      });
    };
    const selectAllMembersForAllItems = () => {
      items.value.forEach((it) => {
        it.selected_member_ids = [...allMemberIds.value];
      });
      toast.add({
        title: "Reset to All",
        description: "All members selected for all items.",
        color: "primary"
      });
    };
    const grandTotal = computed(() => {
      return items.value.reduce((sum, it) => {
        const qty = Number(it.quantity) || 1;
        const price = Number(it.unit_price) || 0;
        return sum + qty * price;
      }, 0);
    });
    const handleSave = async () => {
      if (!storeName.value.trim()) {
        toast.add({ title: "Validation", description: "Store name is required.", color: "red" });
        return;
      }
      if (!paidBy.value) {
        toast.add({ title: "Validation", description: "Please select who paid.", color: "red" });
        return;
      }
      for (let i = 0; i < items.value.length; i++) {
        const it = items.value[i];
        if (!it.name.trim()) {
          toast.add({ title: "Validation", description: `Item #${i + 1} needs a name.`, color: "red" });
          return;
        }
        if (it.unit_price <= 0) {
          toast.add({ title: "Validation", description: `Item #${i + 1} (${it.name}) must have a price > 0.`, color: "red" });
          return;
        }
        if (it.selected_member_ids.length === 0) {
          toast.add({ title: "Validation", description: `Item #${i + 1} (${it.name}) has no members selected.`, color: "red" });
          return;
        }
      }
      saving.value = true;
      try {
        const payloadExpense = {
          household_id: household.value.id,
          store_name: storeName.value.trim(),
          purchase_date: purchaseDate.value,
          paid_by: paidBy.value,
          notes: notes.value.trim() || null
        };
        const payloadItems = items.value.map((it) => {
          const qty = Number(it.quantity) || 1;
          const unit = Number(it.unit_price) || 0;
          const total = Math.round(qty * unit * 100) / 100;
          return {
            name: it.name.trim(),
            quantity: qty,
            unit_price: unit,
            total_price: total,
            category_id: it.category_id || null,
            selected_member_ids: it.selected_member_ids
          };
        });
        const newExpenseId = await saveExpense(payloadExpense, payloadItems);
        toast.add({
          title: "Expense Saved",
          description: `Added ${storeName.value} with ${items.value.length} items.`,
          color: "green"
        });
        await navigateTo(`/expenses/${newExpenseId}`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to save expense";
        toast.add({
          title: "Error saving expense",
          description: msg,
          color: "red"
        });
      } finally {
        saving.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_0;
      const _component_UCard = __nuxt_component_2;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_UInput = __nuxt_component_2$1;
      const _component_USelect = __nuxt_component_1;
      const _component_ExpenseItemRow = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 max-w-2xl mx-auto pb-12" }, _attrs))}><div class="flex items-center justify-between"><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/expenses",
        variant: "ghost",
        color: "gray",
        icon: "i-heroicons-arrow-left",
        size: "sm"
      }, null, _parent));
      _push(`<h1 class="text-xl font-bold text-gray-900 dark:text-white">Add Expense</h1></div><div class="font-mono font-bold text-lg text-primary-600 dark:text-primary-400">${ssrInterpolate(unref(formatMoney)(unref(grandTotal), unref(household)?.currency))}</div></div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Store / Merchant",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(storeName),
                    "onUpdate:modelValue": ($event) => isRef(storeName) ? storeName.value = $event : null,
                    placeholder: "e.g. SM Supermarket, Puregold",
                    icon: "i-heroicons-building-storefront",
                    autofocus: "",
                    disabled: unref(saving)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(storeName),
                      "onUpdate:modelValue": ($event) => isRef(storeName) ? storeName.value = $event : null,
                      placeholder: "e.g. SM Supermarket, Puregold",
                      icon: "i-heroicons-building-storefront",
                      autofocus: "",
                      disabled: unref(saving)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Purchase Date",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(purchaseDate),
                    "onUpdate:modelValue": ($event) => isRef(purchaseDate) ? purchaseDate.value = $event : null,
                    type: "date",
                    icon: "i-heroicons-calendar",
                    disabled: unref(saving)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(purchaseDate),
                      "onUpdate:modelValue": ($event) => isRef(purchaseDate) ? purchaseDate.value = $event : null,
                      type: "date",
                      icon: "i-heroicons-calendar",
                      disabled: unref(saving)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Paid By",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelect, {
                    modelValue: unref(paidBy),
                    "onUpdate:modelValue": ($event) => isRef(paidBy) ? paidBy.value = $event : null,
                    options: unref(members),
                    "option-attribute": "display_name",
                    "value-attribute": "id",
                    icon: "i-heroicons-credit-card",
                    disabled: unref(saving)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelect, {
                      modelValue: unref(paidBy),
                      "onUpdate:modelValue": ($event) => isRef(paidBy) ? paidBy.value = $event : null,
                      options: unref(members),
                      "option-attribute": "display_name",
                      "value-attribute": "id",
                      icon: "i-heroicons-credit-card",
                      disabled: unref(saving)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, { label: "Notes (optional)" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(notes),
                    "onUpdate:modelValue": ($event) => isRef(notes) ? notes.value = $event : null,
                    placeholder: "e.g. Weekend grocery run",
                    icon: "i-heroicons-pencil-square",
                    disabled: unref(saving)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(notes),
                      "onUpdate:modelValue": ($event) => isRef(notes) ? notes.value = $event : null,
                      placeholder: "e.g. Weekend grocery run",
                      icon: "i-heroicons-pencil-square",
                      disabled: unref(saving)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                createVNode(_component_UFormGroup, {
                  label: "Store / Merchant",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(storeName),
                      "onUpdate:modelValue": ($event) => isRef(storeName) ? storeName.value = $event : null,
                      placeholder: "e.g. SM Supermarket, Puregold",
                      icon: "i-heroicons-building-storefront",
                      autofocus: "",
                      disabled: unref(saving)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormGroup, {
                  label: "Purchase Date",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(purchaseDate),
                      "onUpdate:modelValue": ($event) => isRef(purchaseDate) ? purchaseDate.value = $event : null,
                      type: "date",
                      icon: "i-heroicons-calendar",
                      disabled: unref(saving)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormGroup, {
                  label: "Paid By",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_USelect, {
                      modelValue: unref(paidBy),
                      "onUpdate:modelValue": ($event) => isRef(paidBy) ? paidBy.value = $event : null,
                      options: unref(members),
                      "option-attribute": "display_name",
                      "value-attribute": "id",
                      icon: "i-heroicons-credit-card",
                      disabled: unref(saving)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormGroup, { label: "Notes (optional)" }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(notes),
                      "onUpdate:modelValue": ($event) => isRef(notes) ? notes.value = $event : null,
                      placeholder: "e.g. Weekend grocery run",
                      icon: "i-heroicons-pencil-square",
                      disabled: unref(saving)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="space-y-3"><div class="flex items-center justify-between flex-wrap gap-2"><h2 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2"><span>Items (${ssrInterpolate(unref(items).length)})</span></h2><div class="flex items-center gap-1.5">`);
      if (unref(items).length > 1) {
        _push(ssrRenderComponent(_component_UButton, {
          type: "button",
          variant: "soft",
          color: "gray",
          size: "2xs",
          icon: "i-heroicons-arrows-pointing-out",
          onClick: applyFirstItemSplitToAll
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Apply Item 1 Split to All `);
            } else {
              return [
                createTextVNode(" Apply Item 1 Split to All ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_UButton, {
        type: "button",
        variant: "soft",
        color: "gray",
        size: "2xs",
        icon: "i-heroicons-users",
        onClick: selectAllMembersForAllItems
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Select All `);
          } else {
            return [
              createTextVNode(" Select All ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="space-y-3"><!--[-->`);
      ssrRenderList(unref(items), (item, idx) => {
        _push(ssrRenderComponent(_component_ExpenseItemRow, {
          key: idx,
          item,
          index: idx,
          members: unref(members),
          categories: unref(categories),
          "payer-id": unref(paidBy),
          currency: unref(household)?.currency,
          "can-remove": unref(items).length > 1,
          onRemove: ($event) => removeItem(idx)
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        type: "button",
        variant: "outline",
        color: "primary",
        block: "",
        icon: "i-heroicons-plus",
        size: "md",
        class: "mt-2 border-dashed",
        onClick: addItem
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Add Another Item `);
          } else {
            return [
              createTextVNode(" Add Another Item ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm flex items-center justify-between"><div><p class="text-xs text-gray-500">Grand Total</p><p class="text-xl font-bold font-mono text-gray-900 dark:text-white">${ssrInterpolate(unref(formatMoney)(unref(grandTotal), unref(household)?.currency))}</p></div><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/expenses",
        variant: "ghost",
        color: "gray",
        disabled: unref(saving)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Cancel `);
          } else {
            return [
              createTextVNode(" Cancel ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        type: "button",
        color: "primary",
        icon: "i-heroicons-check",
        loading: unref(saving),
        disabled: unref(saving),
        size: "md",
        onClick: handleSave
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Save Expense `);
          } else {
            return [
              createTextVNode(" Save Expense ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/expenses/new.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=new-BKszEtvq.js.map

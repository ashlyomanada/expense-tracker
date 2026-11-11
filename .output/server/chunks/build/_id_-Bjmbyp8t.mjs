import { k as useRoute, b as useHousehold, c as useToast, d as __nuxt_component_0$1, e as __nuxt_component_1$1, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_3 } from './Skeleton-Tz2BgSk_.mjs';
import { _ as __nuxt_component_2 } from './Card-BiaC1RCe.mjs';
import { _ as __nuxt_component_2$1 } from './Badge-BM4yH9XJ.mjs';
import { _ as __nuxt_component_4 } from './FormGroup-COcnPxKZ.mjs';
import { _ as __nuxt_component_2$2 } from './Input-BTTc9Q3-.mjs';
import { _ as __nuxt_component_1 } from './Select-C-nPKItW.mjs';
import { _ as _sfc_main$1 } from './ExpenseItemRow-Bec_-5g0.mjs';
import { _ as __nuxt_component_8 } from './Modal-DIxpYCzf.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
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
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const expenseId = route.params.id;
    const { household, members, categories, fetchHousehold } = useHousehold();
    const { fetchExpense, saveExpense, deleteExpense } = useExpenses();
    const toast = useToast();
    const expense = ref(null);
    const loading = ref(true);
    const isEditing = ref(false);
    const isDeleting = ref(false);
    const showDeleteConfirm = ref(false);
    const saving = ref(false);
    const editStoreName = ref("");
    const editPurchaseDate = ref("");
    const editPaidBy = ref("");
    const editNotes = ref("");
    const editItems = ref([]);
    const loadData = async () => {
      loading.value = true;
      await fetchHousehold();
      const data = await fetchExpense(expenseId);
      expense.value = data;
      if (data) {
        initEditForm(data);
      }
      loading.value = false;
    };
    const initEditForm = (data) => {
      editStoreName.value = data.store_name;
      editPurchaseDate.value = data.purchase_date;
      editPaidBy.value = data.paid_by;
      editNotes.value = data.notes || "";
      editItems.value = data.items.map((it) => ({
        id: it.id,
        name: it.name,
        quantity: it.quantity,
        unit_price: it.unit_price,
        category_id: it.category_id || void 0,
        selected_member_ids: [...it.selected_member_ids]
      }));
    };
    const addEditItem = () => {
      const allIds = members.value.map((m) => m.id);
      const defaultCategory = categories.value[0];
      editItems.value.push({
        name: "",
        quantity: 1,
        unit_price: 0,
        category_id: (defaultCategory == null ? void 0 : defaultCategory.id) || void 0,
        selected_member_ids: [...allIds]
      });
    };
    const removeEditItem = (index) => {
      if (editItems.value.length > 1) {
        editItems.value.splice(index, 1);
      }
    };
    const editGrandTotal = computed(() => {
      return editItems.value.reduce((sum, it) => {
        const qty = Number(it.quantity) || 1;
        const price = Number(it.unit_price) || 0;
        return sum + qty * price;
      }, 0);
    });
    const handleUpdate = async () => {
      if (!editStoreName.value.trim()) {
        toast.add({ title: "Validation", description: "Store name is required.", color: "red" });
        return;
      }
      for (let i = 0; i < editItems.value.length; i++) {
        const it = editItems.value[i];
        if (!it.name.trim()) {
          toast.add({ title: "Validation", description: `Item #${i + 1} needs a name.`, color: "red" });
          return;
        }
        if (it.unit_price <= 0) {
          toast.add({ title: "Validation", description: `Item #${i + 1} must have a price > 0.`, color: "red" });
          return;
        }
        if (it.selected_member_ids.length === 0) {
          toast.add({ title: "Validation", description: `Item #${i + 1} has no members selected.`, color: "red" });
          return;
        }
      }
      saving.value = true;
      try {
        const payloadExpense = {
          id: expenseId,
          household_id: household.value.id,
          store_name: editStoreName.value.trim(),
          purchase_date: editPurchaseDate.value,
          paid_by: editPaidBy.value,
          notes: editNotes.value.trim() || null
        };
        const payloadItems = editItems.value.map((it) => {
          const qty = Number(it.quantity) || 1;
          const unit = Number(it.unit_price) || 0;
          return {
            name: it.name.trim(),
            quantity: qty,
            unit_price: unit,
            total_price: Math.round(qty * unit * 100) / 100,
            category_id: it.category_id || null,
            selected_member_ids: it.selected_member_ids
          };
        });
        await saveExpense(payloadExpense, payloadItems);
        toast.add({
          title: "Updated",
          description: "Expense updated and shares recalculated.",
          color: "green"
        });
        isEditing.value = false;
        await loadData();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to update expense";
        toast.add({ title: "Error", description: msg, color: "red" });
      } finally {
        saving.value = false;
      }
    };
    const handleDelete = async () => {
      isDeleting.value = true;
      try {
        await deleteExpense(expenseId);
        toast.add({
          title: "Deleted",
          description: "Expense deleted successfully.",
          color: "green"
        });
        await navigateTo("/expenses");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to delete expense";
        toast.add({ title: "Error", description: msg, color: "red" });
      } finally {
        isDeleting.value = false;
        showDeleteConfirm.value = false;
      }
    };
    const formatDate = (dateStr) => {
      try {
        const d = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      } catch {
        return dateStr;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_UButton = __nuxt_component_0$1;
      const _component_USkeleton = __nuxt_component_3;
      const _component_UCard = __nuxt_component_2;
      const _component_UBadge = __nuxt_component_2$1;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_UInput = __nuxt_component_2$2;
      const _component_USelect = __nuxt_component_1;
      const _component_ExpenseItemRow = _sfc_main$1;
      const _component_UModal = __nuxt_component_8;
      const _component_UIcon = __nuxt_component_1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 max-w-2xl mx-auto pb-12" }, _attrs))}><div class="flex items-center justify-between"><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/expenses",
        variant: "ghost",
        color: "gray",
        icon: "i-heroicons-arrow-left",
        size: "sm"
      }, null, _parent));
      _push(`<h1 class="text-xl font-bold text-gray-900 dark:text-white">${ssrInterpolate(unref(isEditing) ? "Edit Expense" : ((_a = unref(expense)) == null ? void 0 : _a.store_name) || "Expense Details")}</h1></div>`);
      if (!unref(loading) && unref(expense) && !unref(isEditing)) {
        _push(`<div class="flex items-center gap-2">`);
        _push(ssrRenderComponent(_component_UButton, {
          variant: "soft",
          color: "gray",
          icon: "i-heroicons-pencil",
          size: "sm",
          onClick: ($event) => isEditing.value = true
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Edit `);
            } else {
              return [
                createTextVNode(" Edit ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UButton, {
          variant: "ghost",
          color: "red",
          icon: "i-heroicons-trash",
          size: "sm",
          onClick: ($event) => showDeleteConfirm.value = true
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(loading)) {
        _push(`<div class="space-y-4">`);
        _push(ssrRenderComponent(_component_USkeleton, { class: "h-28 w-full rounded-xl" }, null, _parent));
        _push(ssrRenderComponent(_component_USkeleton, { class: "h-40 w-full rounded-xl" }, null, _parent));
        _push(`</div>`);
      } else if (!unref(expense)) {
        _push(`<div class="text-center py-12"><p class="text-gray-500">Expense not found.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          to: "/expenses",
          variant: "soft",
          color: "primary",
          class: "mt-4"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Back to Expenses`);
            } else {
              return [
                createTextVNode("Back to Expenses")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else if (!unref(isEditing)) {
        _push(`<div class="space-y-5">`);
        _push(ssrRenderComponent(_component_UCard, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b2, _c, _d;
            if (_push2) {
              _push2(`<div class="flex items-start justify-between"${_scopeId}><div${_scopeId}><h2 class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(expense).store_name)}</h2><div class="flex items-center gap-2 text-xs text-gray-500 mt-1"${_scopeId}><span${_scopeId}>${ssrInterpolate(formatDate(unref(expense).purchase_date))}</span><span${_scopeId}>\u2022</span><span${_scopeId}>Paid by <strong class="text-gray-800 dark:text-gray-200"${_scopeId}>${ssrInterpolate((_a2 = unref(expense).payer) == null ? void 0 : _a2.display_name)}</strong></span></div>`);
              if (unref(expense).notes) {
                _push2(`<p class="text-xs text-gray-600 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-gray-800 p-2 rounded"${_scopeId}>${ssrInterpolate(unref(expense).notes)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="text-right"${_scopeId}><span class="text-xs text-gray-400"${_scopeId}>Total</span><div class="font-mono font-bold text-2xl text-primary-600 dark:text-primary-400"${_scopeId}>${ssrInterpolate(unref(formatMoney)(unref(expense).total_amount, (_b2 = unref(household)) == null ? void 0 : _b2.currency))}</div></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-start justify-between" }, [
                  createVNode("div", null, [
                    createVNode("h2", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, toDisplayString(unref(expense).store_name), 1),
                    createVNode("div", { class: "flex items-center gap-2 text-xs text-gray-500 mt-1" }, [
                      createVNode("span", null, toDisplayString(formatDate(unref(expense).purchase_date)), 1),
                      createVNode("span", null, "\u2022"),
                      createVNode("span", null, [
                        createTextVNode("Paid by "),
                        createVNode("strong", { class: "text-gray-800 dark:text-gray-200" }, toDisplayString((_c = unref(expense).payer) == null ? void 0 : _c.display_name), 1)
                      ])
                    ]),
                    unref(expense).notes ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-xs text-gray-600 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-gray-800 p-2 rounded"
                    }, toDisplayString(unref(expense).notes), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "text-right" }, [
                    createVNode("span", { class: "text-xs text-gray-400" }, "Total"),
                    createVNode("div", { class: "font-mono font-bold text-2xl text-primary-600 dark:text-primary-400" }, toDisplayString(unref(formatMoney)(unref(expense).total_amount, (_d = unref(household)) == null ? void 0 : _d.currency)), 1)
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="space-y-3"><h3 class="text-sm font-semibold uppercase tracking-wider text-gray-500"> Items (${ssrInterpolate(unref(expense).items.length)}) </h3><div class="space-y-3"><!--[-->`);
        ssrRenderList(unref(expense).items, (item, idx) => {
          var _a2, _b2;
          _push(`<div class="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3 shadow-xs"><div class="flex items-start justify-between"><div><p class="font-semibold text-base text-gray-900 dark:text-white">${ssrInterpolate(item.name)}</p><div class="flex items-center gap-2 text-xs text-gray-500 mt-0.5">`);
          if (item.category) {
            _push(ssrRenderComponent(_component_UBadge, {
              color: "gray",
              variant: "subtle",
              size: "xs"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(item.category.name)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(item.category.name), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<span>${ssrInterpolate(item.quantity)} \xD7 ${ssrInterpolate(unref(formatMoney)(item.unit_price, (_a2 = unref(household)) == null ? void 0 : _a2.currency))}</span></div></div><div class="font-mono font-bold text-base text-gray-900 dark:text-white">${ssrInterpolate(unref(formatMoney)(item.total_price, (_b2 = unref(household)) == null ? void 0 : _b2.currency))}</div></div><div class="pt-2 border-t border-gray-100 dark:border-gray-800"><p class="text-[11px] font-medium text-gray-400 mb-1.5">Split shares:</p><div class="flex flex-wrap gap-1.5"><!--[-->`);
          ssrRenderList(item.shares, (share) => {
            var _a3, _b3;
            _push(`<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"><span class="text-gray-700 dark:text-gray-300">${ssrInterpolate(((_a3 = share.profile) == null ? void 0 : _a3.display_name) || "Member")}:</span><strong class="font-mono text-primary-600 dark:text-primary-400">${ssrInterpolate(unref(formatMoney)(share.share_amount, (_b3 = unref(household)) == null ? void 0 : _b3.currency))}</strong></span>`);
          });
          _push(`<!--]--></div></div></div>`);
        });
        _push(`<!--]--></div></div></div>`);
      } else {
        _push(`<div class="space-y-5">`);
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
                      modelValue: unref(editStoreName),
                      "onUpdate:modelValue": ($event) => isRef(editStoreName) ? editStoreName.value = $event : null,
                      disabled: unref(saving)
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UInput, {
                        modelValue: unref(editStoreName),
                        "onUpdate:modelValue": ($event) => isRef(editStoreName) ? editStoreName.value = $event : null,
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
                      modelValue: unref(editPurchaseDate),
                      "onUpdate:modelValue": ($event) => isRef(editPurchaseDate) ? editPurchaseDate.value = $event : null,
                      type: "date",
                      disabled: unref(saving)
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UInput, {
                        modelValue: unref(editPurchaseDate),
                        "onUpdate:modelValue": ($event) => isRef(editPurchaseDate) ? editPurchaseDate.value = $event : null,
                        type: "date",
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
                      modelValue: unref(editPaidBy),
                      "onUpdate:modelValue": ($event) => isRef(editPaidBy) ? editPaidBy.value = $event : null,
                      options: unref(members),
                      "option-attribute": "display_name",
                      "value-attribute": "id",
                      disabled: unref(saving)
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_USelect, {
                        modelValue: unref(editPaidBy),
                        "onUpdate:modelValue": ($event) => isRef(editPaidBy) ? editPaidBy.value = $event : null,
                        options: unref(members),
                        "option-attribute": "display_name",
                        "value-attribute": "id",
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
                      modelValue: unref(editNotes),
                      "onUpdate:modelValue": ($event) => isRef(editNotes) ? editNotes.value = $event : null,
                      disabled: unref(saving)
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UInput, {
                        modelValue: unref(editNotes),
                        "onUpdate:modelValue": ($event) => isRef(editNotes) ? editNotes.value = $event : null,
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
                        modelValue: unref(editStoreName),
                        "onUpdate:modelValue": ($event) => isRef(editStoreName) ? editStoreName.value = $event : null,
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
                        modelValue: unref(editPurchaseDate),
                        "onUpdate:modelValue": ($event) => isRef(editPurchaseDate) ? editPurchaseDate.value = $event : null,
                        type: "date",
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
                        modelValue: unref(editPaidBy),
                        "onUpdate:modelValue": ($event) => isRef(editPaidBy) ? editPaidBy.value = $event : null,
                        options: unref(members),
                        "option-attribute": "display_name",
                        "value-attribute": "id",
                        disabled: unref(saving)
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, { label: "Notes (optional)" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(editNotes),
                        "onUpdate:modelValue": ($event) => isRef(editNotes) ? editNotes.value = $event : null,
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
        _push(`<div class="space-y-3"><h3 class="text-sm font-semibold text-gray-900 dark:text-white">Items</h3><div class="space-y-3"><!--[-->`);
        ssrRenderList(unref(editItems), (item, idx) => {
          var _a2;
          _push(ssrRenderComponent(_component_ExpenseItemRow, {
            key: idx,
            item,
            index: idx,
            members: unref(members),
            categories: unref(categories),
            "payer-id": unref(editPaidBy),
            currency: (_a2 = unref(household)) == null ? void 0 : _a2.currency,
            "can-remove": unref(editItems).length > 1,
            onRemove: ($event) => removeEditItem(idx)
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
          class: "border-dashed",
          onClick: addEditItem
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
        _push(`</div><div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center justify-between"><div><p class="text-xs text-gray-500">Updated Total</p><p class="text-xl font-bold font-mono text-gray-900 dark:text-white">${ssrInterpolate(unref(formatMoney)(unref(editGrandTotal), (_b = unref(household)) == null ? void 0 : _b.currency))}</p></div><div class="flex items-center gap-2">`);
        _push(ssrRenderComponent(_component_UButton, {
          variant: "ghost",
          color: "gray",
          disabled: unref(saving),
          onClick: ($event) => isEditing.value = false
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
          color: "primary",
          icon: "i-heroicons-check",
          loading: unref(saving),
          disabled: unref(saving),
          onClick: handleUpdate
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Save Changes `);
            } else {
              return [
                createTextVNode(" Save Changes ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div>`);
      }
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(showDeleteConfirm),
        "onUpdate:modelValue": ($event) => isRef(showDeleteConfirm) ? showDeleteConfirm.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center gap-2 text-red-600 dark:text-red-400"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-heroicons-exclamation-triangle",
                    class: "w-5 h-5"
                  }, null, _parent3, _scopeId2));
                  _push3(`<h3 class="font-bold"${_scopeId2}>Delete Expense</h3></div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center gap-2 text-red-600 dark:text-red-400" }, [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-exclamation-triangle",
                        class: "w-5 h-5"
                      }),
                      createVNode("h3", { class: "font-bold" }, "Delete Expense")
                    ])
                  ];
                }
              }),
              footer: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex justify-end gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    variant: "ghost",
                    color: "gray",
                    disabled: unref(isDeleting),
                    onClick: ($event) => showDeleteConfirm.value = false
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Cancel `);
                      } else {
                        return [
                          createTextVNode(" Cancel ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    color: "red",
                    icon: "i-heroicons-trash",
                    loading: unref(isDeleting),
                    disabled: unref(isDeleting),
                    onClick: handleDelete
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Delete Expense `);
                      } else {
                        return [
                          createTextVNode(" Delete Expense ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex justify-end gap-2" }, [
                      createVNode(_component_UButton, {
                        variant: "ghost",
                        color: "gray",
                        disabled: unref(isDeleting),
                        onClick: ($event) => showDeleteConfirm.value = false
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Cancel ")
                        ]),
                        _: 1
                      }, 8, ["disabled", "onClick"]),
                      createVNode(_component_UButton, {
                        color: "red",
                        icon: "i-heroicons-trash",
                        loading: unref(isDeleting),
                        disabled: unref(isDeleting),
                        onClick: handleDelete
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Delete Expense ")
                        ]),
                        _: 1
                      }, 8, ["loading", "disabled"])
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a2, _b2;
                if (_push3) {
                  _push3(`<p class="text-sm text-gray-600 dark:text-gray-300"${_scopeId2}> Are you sure you want to delete <strong${_scopeId2}>${ssrInterpolate((_a2 = unref(expense)) == null ? void 0 : _a2.store_name)}</strong>? All associated items and shares will be permanently removed. </p>`);
                } else {
                  return [
                    createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-300" }, [
                      createTextVNode(" Are you sure you want to delete "),
                      createVNode("strong", null, toDisplayString((_b2 = unref(expense)) == null ? void 0 : _b2.store_name), 1),
                      createTextVNode("? All associated items and shares will be permanently removed. ")
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, null, {
                header: withCtx(() => [
                  createVNode("div", { class: "flex items-center gap-2 text-red-600 dark:text-red-400" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-exclamation-triangle",
                      class: "w-5 h-5"
                    }),
                    createVNode("h3", { class: "font-bold" }, "Delete Expense")
                  ])
                ]),
                footer: withCtx(() => [
                  createVNode("div", { class: "flex justify-end gap-2" }, [
                    createVNode(_component_UButton, {
                      variant: "ghost",
                      color: "gray",
                      disabled: unref(isDeleting),
                      onClick: ($event) => showDeleteConfirm.value = false
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Cancel ")
                      ]),
                      _: 1
                    }, 8, ["disabled", "onClick"]),
                    createVNode(_component_UButton, {
                      color: "red",
                      icon: "i-heroicons-trash",
                      loading: unref(isDeleting),
                      disabled: unref(isDeleting),
                      onClick: handleDelete
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Delete Expense ")
                      ]),
                      _: 1
                    }, 8, ["loading", "disabled"])
                  ])
                ]),
                default: withCtx(() => {
                  var _a2;
                  return [
                    createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-300" }, [
                      createTextVNode(" Are you sure you want to delete "),
                      createVNode("strong", null, toDisplayString((_a2 = unref(expense)) == null ? void 0 : _a2.store_name), 1),
                      createTextVNode("? All associated items and shares will be permanently removed. ")
                    ])
                  ];
                }),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/expenses/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-Bjmbyp8t.mjs.map

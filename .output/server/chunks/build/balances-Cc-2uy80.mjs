import { b as useHousehold, c as useToast, d as __nuxt_component_0$1, e as __nuxt_component_1, g as __nuxt_component_3$1 } from './server.mjs';
import { _ as __nuxt_component_3 } from './Skeleton-Tz2BgSk_.mjs';
import { _ as __nuxt_component_8 } from './Modal-DIxpYCzf.mjs';
import { _ as __nuxt_component_2 } from './Card-BiaC1RCe.mjs';
import { _ as __nuxt_component_4 } from './FormGroup-COcnPxKZ.mjs';
import { _ as __nuxt_component_1$1 } from './Select-C-nPKItW.mjs';
import { _ as __nuxt_component_2$1 } from './Input-BTTc9Q3-.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, unref, isRef, createVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { f as formatMoney } from './money-z3Rw8dBE.mjs';
import { u as useBalances } from './useBalances-BYNiAx9j.mjs';
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
  __name: "balances",
  __ssrInlineRender: true,
  setup(__props) {
    const { household, members, profile } = useHousehold();
    const {
      balances,
      debts,
      settlements,
      loading,
      recordSettlement,
      deleteSettlement
    } = useBalances();
    const toast = useToast();
    const showSettleModal = ref(false);
    const fromUser = ref("");
    const toUser = ref("");
    const settleAmount = ref(0);
    const settleNote = ref("");
    const savingSettlement = ref(false);
    const showDeleteConfirm = ref(false);
    const settlementToDelete = ref(null);
    const deleting = ref(false);
    const openSettleModal = (debt) => {
      var _a, _b;
      if (debt) {
        fromUser.value = debt.debtor_id;
        toUser.value = debt.creditor_id;
        settleAmount.value = debt.amount;
        settleNote.value = `Payment to ${debt.creditor_name}`;
      } else {
        fromUser.value = ((_a = profile.value) == null ? void 0 : _a.id) || ((_b = members.value[0]) == null ? void 0 : _b.id) || "";
        const otherMember = members.value.find((m) => m.id !== fromUser.value);
        toUser.value = (otherMember == null ? void 0 : otherMember.id) || "";
        settleAmount.value = 0;
        settleNote.value = "";
      }
      showSettleModal.value = true;
    };
    const handleRecordSettlement = async () => {
      if (!fromUser.value || !toUser.value) {
        toast.add({ title: "Validation", description: "Please select both members.", color: "red" });
        return;
      }
      if (fromUser.value === toUser.value) {
        toast.add({ title: "Validation", description: "Payer and recipient cannot be the same member.", color: "red" });
        return;
      }
      if (settleAmount.value <= 0) {
        toast.add({ title: "Validation", description: "Amount must be greater than zero.", color: "red" });
        return;
      }
      savingSettlement.value = true;
      try {
        await recordSettlement(fromUser.value, toUser.value, Number(settleAmount.value), settleNote.value);
        toast.add({
          title: "Settled Up!",
          description: "Settlement payment recorded successfully.",
          color: "green"
        });
        showSettleModal.value = false;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to record settlement";
        toast.add({ title: "Error", description: msg, color: "red" });
      } finally {
        savingSettlement.value = false;
      }
    };
    const confirmDeleteSettlement = (id) => {
      settlementToDelete.value = id;
      showDeleteConfirm.value = true;
    };
    const handleDeleteSettlement = async () => {
      if (!settlementToDelete.value) return;
      deleting.value = true;
      try {
        await deleteSettlement(settlementToDelete.value);
        toast.add({
          title: "Deleted",
          description: "Settlement record removed.",
          color: "green"
        });
        showDeleteConfirm.value = false;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to delete settlement";
        toast.add({ title: "Error", description: msg, color: "red" });
      } finally {
        deleting.value = false;
      }
    };
    const formatDate = (dateStr) => {
      try {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
      } catch {
        return dateStr;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_0$1;
      const _component_UIcon = __nuxt_component_1;
      const _component_USkeleton = __nuxt_component_3;
      const _component_UAvatar = __nuxt_component_3$1;
      const _component_UModal = __nuxt_component_8;
      const _component_UCard = __nuxt_component_2;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_USelect = __nuxt_component_1$1;
      const _component_UInput = __nuxt_component_2$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 max-w-2xl mx-auto pb-12" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Balances &amp; Debts</h1><p class="text-xs text-gray-500 mt-0.5">Who owes whom across household expenses and bills</p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "primary",
        icon: "i-heroicons-banknotes",
        size: "md",
        onClick: ($event) => openSettleModal()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Settle Up `);
          } else {
            return [
              createTextVNode(" Settle Up ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="space-y-3"><h2 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-arrows-right-left",
        class: "w-4 h-4 text-primary-500"
      }, null, _parent));
      _push(`<span>Who Owes Whom (Simplified Debts)</span></h2>`);
      if (unref(loading) && unref(debts).length === 0) {
        _push(`<div class="space-y-2">`);
        _push(ssrRenderComponent(_component_USkeleton, { class: "h-16 w-full rounded-xl" }, null, _parent));
        _push(ssrRenderComponent(_component_USkeleton, { class: "h-16 w-full rounded-xl" }, null, _parent));
        _push(`</div>`);
      } else if (unref(debts).length === 0) {
        _push(`<div class="p-6 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-check-circle",
          class: "w-10 h-10 text-green-500 mx-auto mb-2"
        }, null, _parent));
        _push(`<h3 class="font-semibold text-gray-900 dark:text-white text-base">Everyone is settled up!</h3><p class="text-xs text-gray-500 mt-1">There are no outstanding debts between household members.</p></div>`);
      } else {
        _push(`<div class="space-y-2.5"><!--[-->`);
        ssrRenderList(unref(debts), (debt, idx) => {
          var _a;
          _push(`<div class="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between shadow-xs"><div class="flex items-center gap-3"><div class="space-y-0.5"><div class="flex items-center gap-1.5 text-sm"><span class="font-bold text-gray-900 dark:text-white">${ssrInterpolate(debt.debtor_name)}</span><span class="text-gray-400">owes</span><span class="font-bold text-gray-900 dark:text-white">${ssrInterpolate(debt.creditor_name)}</span></div><p class="text-xs text-gray-400">Direct transfer suggestion</p></div></div><div class="flex items-center gap-3"><span class="font-mono font-bold text-base text-primary-600 dark:text-primary-400">${ssrInterpolate(unref(formatMoney)(debt.amount, (_a = unref(household)) == null ? void 0 : _a.currency))}</span>`);
          _push(ssrRenderComponent(_component_UButton, {
            size: "xs",
            color: "primary",
            variant: "soft",
            icon: "i-heroicons-check",
            onClick: ($event) => openSettleModal(debt)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Settle `);
              } else {
                return [
                  createTextVNode(" Settle ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div><div class="space-y-3"><h2 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-users",
        class: "w-4 h-4 text-primary-500"
      }, null, _parent));
      _push(`<span>Net Balances per Member</span></h2><div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 shadow-xs overflow-hidden"><!--[-->`);
      ssrRenderList(unref(balances), (m) => {
        var _a, _b, _c, _d;
        _push(`<div class="p-3.5 flex items-center justify-between"><div class="flex items-center gap-3">`);
        _push(ssrRenderComponent(_component_UAvatar, {
          alt: m.display_name,
          size: "sm",
          class: "bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-bold"
        }, null, _parent));
        _push(`<div><p class="font-medium text-sm text-gray-900 dark:text-white">${ssrInterpolate(m.display_name)} `);
        if (m.user_id === ((_a = unref(profile)) == null ? void 0 : _a.id)) {
          _push(`<span class="text-xs text-primary-600 font-normal">(You)</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</p><p class="text-[11px] text-gray-400"> Paid: ${ssrInterpolate(unref(formatMoney)(m.total_paid, (_b = unref(household)) == null ? void 0 : _b.currency))} \u2022 Consumed: ${ssrInterpolate(unref(formatMoney)(m.total_owed, (_c = unref(household)) == null ? void 0 : _c.currency))}</p></div></div><div class="text-right"><p class="${ssrRenderClass([m.net_balance > 5e-3 ? "text-green-600 dark:text-green-400" : m.net_balance < -5e-3 ? "text-red-600 dark:text-red-400" : "text-gray-500", "font-mono font-bold text-sm"])}">${ssrInterpolate(m.net_balance > 5e-3 ? "+" : "")}${ssrInterpolate(unref(formatMoney)(m.net_balance, (_d = unref(household)) == null ? void 0 : _d.currency))}</p><span class="text-[10px] text-gray-400 uppercase font-medium">${ssrInterpolate(m.net_balance > 5e-3 ? "is owed" : m.net_balance < -5e-3 ? "owes" : "settled")}</span></div></div>`);
      });
      _push(`<!--]--></div></div><div class="space-y-3"><h2 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-clock",
        class: "w-4 h-4 text-gray-400"
      }, null, _parent));
      _push(`<span>Settlement History</span></h2>`);
      if (unref(settlements).length === 0) {
        _push(`<div class="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-center text-xs text-gray-500"> No settlements recorded yet. </div>`);
      } else {
        _push(`<div class="space-y-2"><!--[-->`);
        ssrRenderList(unref(settlements), (s) => {
          var _a, _b, _c;
          _push(`<div class="p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between shadow-xs"><div><div class="flex items-center gap-1.5 text-xs text-gray-900 dark:text-white"><strong>${ssrInterpolate(((_a = s.from_profile) == null ? void 0 : _a.display_name) || "Member")}</strong>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-heroicons-arrow-right",
            class: "w-3 h-3 text-gray-400"
          }, null, _parent));
          _push(`<strong>${ssrInterpolate(((_b = s.to_profile) == null ? void 0 : _b.display_name) || "Member")}</strong></div>`);
          if (s.note) {
            _push(`<p class="text-[11px] text-gray-500 mt-0.5">${ssrInterpolate(s.note)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<p class="text-[10px] text-gray-400 mt-0.5">${ssrInterpolate(formatDate(s.settled_at))}</p></div><div class="flex items-center gap-2"><span class="font-mono font-bold text-sm text-green-600 dark:text-green-400">${ssrInterpolate(unref(formatMoney)(s.amount, (_c = unref(household)) == null ? void 0 : _c.currency))}</span>`);
          _push(ssrRenderComponent(_component_UButton, {
            color: "red",
            variant: "ghost",
            icon: "i-heroicons-trash",
            size: "2xs",
            onClick: ($event) => confirmDeleteSettlement(s.id)
          }, null, _parent));
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(showSettleModal),
        "onUpdate:modelValue": ($event) => isRef(showSettleModal) ? showSettleModal.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center gap-2 text-primary-600 dark:text-primary-400"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-heroicons-banknotes",
                    class: "w-5 h-5"
                  }, null, _parent3, _scopeId2));
                  _push3(`<h3 class="font-bold text-base"${_scopeId2}>Record a Settlement</h3></div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center gap-2 text-primary-600 dark:text-primary-400" }, [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-banknotes",
                        class: "w-5 h-5"
                      }),
                      createVNode("h3", { class: "font-bold text-base" }, "Record a Settlement")
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<form class="space-y-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Payer (Who sent money?)",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(fromUser),
                          "onUpdate:modelValue": ($event) => isRef(fromUser) ? fromUser.value = $event : null,
                          options: unref(members),
                          "option-attribute": "display_name",
                          "value-attribute": "id",
                          disabled: unref(savingSettlement)
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(fromUser),
                            "onUpdate:modelValue": ($event) => isRef(fromUser) ? fromUser.value = $event : null,
                            options: unref(members),
                            "option-attribute": "display_name",
                            "value-attribute": "id",
                            disabled: unref(savingSettlement)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Recipient (Who received money?)",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(toUser),
                          "onUpdate:modelValue": ($event) => isRef(toUser) ? toUser.value = $event : null,
                          options: unref(members),
                          "option-attribute": "display_name",
                          "value-attribute": "id",
                          disabled: unref(savingSettlement)
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(toUser),
                            "onUpdate:modelValue": ($event) => isRef(toUser) ? toUser.value = $event : null,
                            options: unref(members),
                            "option-attribute": "display_name",
                            "value-attribute": "id",
                            disabled: unref(savingSettlement)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Amount Paid",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(settleAmount),
                          "onUpdate:modelValue": ($event) => isRef(settleAmount) ? settleAmount.value = $event : null,
                          modelModifiers: { number: true },
                          type: "number",
                          min: "0.01",
                          step: "0.01",
                          placeholder: "0.00",
                          icon: "i-heroicons-currency-dollar",
                          disabled: unref(savingSettlement)
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(settleAmount),
                            "onUpdate:modelValue": ($event) => isRef(settleAmount) ? settleAmount.value = $event : null,
                            modelModifiers: { number: true },
                            type: "number",
                            min: "0.01",
                            step: "0.01",
                            placeholder: "0.00",
                            icon: "i-heroicons-currency-dollar",
                            disabled: unref(savingSettlement)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, { label: "Note (optional)" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(settleNote),
                          "onUpdate:modelValue": ($event) => isRef(settleNote) ? settleNote.value = $event : null,
                          placeholder: "e.g. Paid via GCash / Bank Transfer",
                          icon: "i-heroicons-pencil-square",
                          disabled: unref(savingSettlement)
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(settleNote),
                            "onUpdate:modelValue": ($event) => isRef(settleNote) ? settleNote.value = $event : null,
                            placeholder: "e.g. Paid via GCash / Bank Transfer",
                            icon: "i-heroicons-pencil-square",
                            disabled: unref(savingSettlement)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="flex justify-end gap-2 pt-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "button",
                    variant: "ghost",
                    color: "gray",
                    disabled: unref(savingSettlement),
                    onClick: ($event) => showSettleModal.value = false
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
                    type: "submit",
                    color: "primary",
                    loading: unref(savingSettlement),
                    disabled: unref(savingSettlement) || unref(settleAmount) <= 0
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Record Payment `);
                      } else {
                        return [
                          createTextVNode(" Record Payment ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></form>`);
                } else {
                  return [
                    createVNode("form", {
                      onSubmit: withModifiers(handleRecordSettlement, ["prevent"]),
                      class: "space-y-4"
                    }, [
                      createVNode(_component_UFormGroup, {
                        label: "Payer (Who sent money?)",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(fromUser),
                            "onUpdate:modelValue": ($event) => isRef(fromUser) ? fromUser.value = $event : null,
                            options: unref(members),
                            "option-attribute": "display_name",
                            "value-attribute": "id",
                            disabled: unref(savingSettlement)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, {
                        label: "Recipient (Who received money?)",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(toUser),
                            "onUpdate:modelValue": ($event) => isRef(toUser) ? toUser.value = $event : null,
                            options: unref(members),
                            "option-attribute": "display_name",
                            "value-attribute": "id",
                            disabled: unref(savingSettlement)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, {
                        label: "Amount Paid",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(settleAmount),
                            "onUpdate:modelValue": ($event) => isRef(settleAmount) ? settleAmount.value = $event : null,
                            modelModifiers: { number: true },
                            type: "number",
                            min: "0.01",
                            step: "0.01",
                            placeholder: "0.00",
                            icon: "i-heroicons-currency-dollar",
                            disabled: unref(savingSettlement)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, { label: "Note (optional)" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(settleNote),
                            "onUpdate:modelValue": ($event) => isRef(settleNote) ? settleNote.value = $event : null,
                            placeholder: "e.g. Paid via GCash / Bank Transfer",
                            icon: "i-heroicons-pencil-square",
                            disabled: unref(savingSettlement)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
                        createVNode(_component_UButton, {
                          type: "button",
                          variant: "ghost",
                          color: "gray",
                          disabled: unref(savingSettlement),
                          onClick: ($event) => showSettleModal.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Cancel ")
                          ]),
                          _: 1
                        }, 8, ["disabled", "onClick"]),
                        createVNode(_component_UButton, {
                          type: "submit",
                          color: "primary",
                          loading: unref(savingSettlement),
                          disabled: unref(savingSettlement) || unref(settleAmount) <= 0
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Record Payment ")
                          ]),
                          _: 1
                        }, 8, ["loading", "disabled"])
                      ])
                    ], 32)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, null, {
                header: withCtx(() => [
                  createVNode("div", { class: "flex items-center gap-2 text-primary-600 dark:text-primary-400" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-banknotes",
                      class: "w-5 h-5"
                    }),
                    createVNode("h3", { class: "font-bold text-base" }, "Record a Settlement")
                  ])
                ]),
                default: withCtx(() => [
                  createVNode("form", {
                    onSubmit: withModifiers(handleRecordSettlement, ["prevent"]),
                    class: "space-y-4"
                  }, [
                    createVNode(_component_UFormGroup, {
                      label: "Payer (Who sent money?)",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(fromUser),
                          "onUpdate:modelValue": ($event) => isRef(fromUser) ? fromUser.value = $event : null,
                          options: unref(members),
                          "option-attribute": "display_name",
                          "value-attribute": "id",
                          disabled: unref(savingSettlement)
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Recipient (Who received money?)",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(toUser),
                          "onUpdate:modelValue": ($event) => isRef(toUser) ? toUser.value = $event : null,
                          options: unref(members),
                          "option-attribute": "display_name",
                          "value-attribute": "id",
                          disabled: unref(savingSettlement)
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Amount Paid",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(settleAmount),
                          "onUpdate:modelValue": ($event) => isRef(settleAmount) ? settleAmount.value = $event : null,
                          modelModifiers: { number: true },
                          type: "number",
                          min: "0.01",
                          step: "0.01",
                          placeholder: "0.00",
                          icon: "i-heroicons-currency-dollar",
                          disabled: unref(savingSettlement)
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, { label: "Note (optional)" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(settleNote),
                          "onUpdate:modelValue": ($event) => isRef(settleNote) ? settleNote.value = $event : null,
                          placeholder: "e.g. Paid via GCash / Bank Transfer",
                          icon: "i-heroicons-pencil-square",
                          disabled: unref(savingSettlement)
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
                      createVNode(_component_UButton, {
                        type: "button",
                        variant: "ghost",
                        color: "gray",
                        disabled: unref(savingSettlement),
                        onClick: ($event) => showSettleModal.value = false
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Cancel ")
                        ]),
                        _: 1
                      }, 8, ["disabled", "onClick"]),
                      createVNode(_component_UButton, {
                        type: "submit",
                        color: "primary",
                        loading: unref(savingSettlement),
                        disabled: unref(savingSettlement) || unref(settleAmount) <= 0
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Record Payment ")
                        ]),
                        _: 1
                      }, 8, ["loading", "disabled"])
                    ])
                  ], 32)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(showDeleteConfirm),
        "onUpdate:modelValue": ($event) => isRef(showDeleteConfirm) ? showDeleteConfirm.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center gap-2 text-red-600"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-heroicons-exclamation-triangle",
                    class: "w-5 h-5"
                  }, null, _parent3, _scopeId2));
                  _push3(`<h3 class="font-bold"${_scopeId2}>Delete Settlement Record</h3></div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center gap-2 text-red-600" }, [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-exclamation-triangle",
                        class: "w-5 h-5"
                      }),
                      createVNode("h3", { class: "font-bold" }, "Delete Settlement Record")
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
                    disabled: unref(deleting),
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
                    loading: unref(deleting),
                    disabled: unref(deleting),
                    onClick: handleDeleteSettlement
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Delete `);
                      } else {
                        return [
                          createTextVNode(" Delete ")
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
                        disabled: unref(deleting),
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
                        loading: unref(deleting),
                        disabled: unref(deleting),
                        onClick: handleDeleteSettlement
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Delete ")
                        ]),
                        _: 1
                      }, 8, ["loading", "disabled"])
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<p class="text-sm text-gray-600 dark:text-gray-300"${_scopeId2}> Are you sure you want to delete this settlement? The net balances between the two members will be restored. </p>`);
                } else {
                  return [
                    createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-300" }, " Are you sure you want to delete this settlement? The net balances between the two members will be restored. ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, null, {
                header: withCtx(() => [
                  createVNode("div", { class: "flex items-center gap-2 text-red-600" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-exclamation-triangle",
                      class: "w-5 h-5"
                    }),
                    createVNode("h3", { class: "font-bold" }, "Delete Settlement Record")
                  ])
                ]),
                footer: withCtx(() => [
                  createVNode("div", { class: "flex justify-end gap-2" }, [
                    createVNode(_component_UButton, {
                      variant: "ghost",
                      color: "gray",
                      disabled: unref(deleting),
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
                      loading: unref(deleting),
                      disabled: unref(deleting),
                      onClick: handleDeleteSettlement
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Delete ")
                      ]),
                      _: 1
                    }, 8, ["loading", "disabled"])
                  ])
                ]),
                default: withCtx(() => [
                  createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-300" }, " Are you sure you want to delete this settlement? The net balances between the two members will be restored. ")
                ]),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/balances.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=balances-Cc-2uy80.mjs.map

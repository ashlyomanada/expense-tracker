import { b as useHousehold, c as useToast, d as __nuxt_component_0$1, e as __nuxt_component_1$1, _ as _export_sfc, i as useUI, t as twMerge, j as appConfig, m as mergeConfig } from './server.mjs';
import { _ as __nuxt_component_1 } from './Select-C-nPKItW.mjs';
import { _ as __nuxt_component_3 } from './Skeleton-Tz2BgSk_.mjs';
import { _ as __nuxt_component_2$2 } from './Badge-BM4yH9XJ.mjs';
import { defineComponent, ref, watch, computed, mergeProps, withCtx, createTextVNode, unref, isRef, createVNode, toDisplayString, withModifiers, openBlock, createBlock, createCommentVNode, toRef, useId as useId$1, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrLooseContain, ssrGetDynamicModelProps, ssrRenderAttr, ssrRenderSlot } from 'vue/server-renderer';
import { f as formatMoney } from './money-z3Rw8dBE.mjs';
import { _ as __nuxt_component_8 } from './Modal-DIxpYCzf.mjs';
import { _ as __nuxt_component_2 } from './Card-BiaC1RCe.mjs';
import { _ as __nuxt_component_4 } from './FormGroup-COcnPxKZ.mjs';
import { _ as __nuxt_component_2$1 } from './Input-BTTc9Q3-.mjs';
import { twJoin } from 'tailwind-merge';
import { u as useFormGroup } from './useFormGroup-BVR2qx0l.mjs';
import { u as useBills } from './useBills-uyxpq_W9.mjs';
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
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const checkbox = {
  wrapper: "relative flex items-start",
  container: "flex items-center h-5",
  base: "h-4 w-4 dark:checked:bg-current dark:checked:border-transparent dark:indeterminate:bg-current dark:indeterminate:border-transparent disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0 focus:ring-transparent focus:ring-offset-transparent",
  form: "form-checkbox",
  rounded: "rounded",
  color: "text-{color}-500 dark:text-{color}-400",
  background: "bg-white dark:bg-gray-900",
  border: "border border-gray-300 dark:border-gray-700",
  ring: "focus-visible:ring-2 focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900",
  inner: "ms-3 flex flex-col",
  label: "text-sm font-medium text-gray-700 dark:text-gray-200",
  required: "text-sm text-red-500 dark:text-red-400",
  help: "text-sm text-gray-500 dark:text-gray-400",
  default: {
    color: "primary"
  }
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "BillCard",
  __ssrInlineRender: true,
  props: {
    bill: {},
    currency: {}
  },
  emits: ["edit", "delete", "mark-paid", "unmark-paid"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const statusBadgeColor = computed(() => {
      switch (props.bill.computed_status) {
        case "paid":
          return "green";
        case "overdue":
          return "red";
        default:
          return "amber";
      }
    });
    const statusLabel = computed(() => {
      switch (props.bill.computed_status) {
        case "paid":
          return "Paid";
        case "overdue":
          return "Overdue";
        default:
          return "Unpaid";
      }
    });
    const formatDueDate = (dateStr) => {
      try {
        const d = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } catch {
        return dateStr;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UBadge = __nuxt_component_2$2;
      const _component_UButton = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs space-y-3" }, _attrs))}><div class="flex items-start justify-between gap-2"><div class="space-y-1"><div class="flex items-center gap-2"><span class="font-bold text-base text-gray-900 dark:text-white">${ssrInterpolate(__props.bill.name)}</span>`);
      if (__props.bill.is_recurring) {
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-arrow-path",
          class: "w-4 h-4 text-primary-500",
          title: "Recurring monthly bill"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center gap-2 text-xs text-gray-500">`);
      if (__props.bill.category) {
        _push(ssrRenderComponent(_component_UBadge, {
          color: "gray",
          variant: "subtle",
          size: "xs"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(__props.bill.category.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(__props.bill.category.name), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<span>Due ${ssrInterpolate(formatDueDate(__props.bill.due_date))}</span></div></div><div class="text-right"><div class="font-mono font-bold text-lg text-gray-900 dark:text-white">${ssrInterpolate(unref(formatMoney)(__props.bill.amount, __props.currency))}</div>`);
      _push(ssrRenderComponent(_component_UBadge, {
        color: unref(statusBadgeColor),
        variant: "subtle",
        size: "xs",
        class: "mt-1"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(statusLabel))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(statusLabel)), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs"><div><span class="text-gray-500">Each owes: </span><strong class="font-mono text-primary-600 dark:text-primary-400">${ssrInterpolate(unref(formatMoney)(__props.bill.per_person_share, __props.currency))}</strong><span class="text-gray-400"> (${ssrInterpolate(__props.bill.shares.length)} members)</span></div>`);
      if (__props.bill.status === "paid") {
        _push(`<div class="text-gray-500 text-[11px]"> Paid by <strong class="text-gray-800 dark:text-gray-200">${ssrInterpolate(((_a = __props.bill.payer) == null ? void 0 : _a.display_name) || "Member")}</strong></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="pt-2 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between gap-2"><div class="flex items-center gap-1.5">`);
      if (__props.bill.status === "unpaid") {
        _push(ssrRenderComponent(_component_UButton, {
          size: "xs",
          color: "primary",
          variant: "soft",
          icon: "i-heroicons-check",
          onClick: ($event) => emit("mark-paid", __props.bill)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Mark Paid `);
            } else {
              return [
                createTextVNode(" Mark Paid ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(ssrRenderComponent(_component_UButton, {
          size: "xs",
          color: "gray",
          variant: "ghost",
          icon: "i-heroicons-arrow-uturn-left",
          onClick: ($event) => emit("unmark-paid", __props.bill)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Unmark `);
            } else {
              return [
                createTextVNode(" Unmark ")
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div><div class="flex items-center gap-1">`);
      _push(ssrRenderComponent(_component_UButton, {
        size: "xs",
        color: "gray",
        variant: "ghost",
        icon: "i-heroicons-pencil",
        onClick: ($event) => emit("edit", __props.bill)
      }, null, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        size: "xs",
        color: "red",
        variant: "ghost",
        icon: "i-heroicons-trash",
        onClick: ($event) => emit("delete", __props.bill)
      }, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BillCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const useId = useId$1;
const config = mergeConfig(appConfig.ui.strategy, appConfig.ui.checkbox, checkbox);
const _sfc_main$1 = defineComponent({
  inheritAttrs: false,
  props: {
    id: {
      type: String,
      default: () => null
    },
    value: {
      type: [String, Number, Boolean, Object],
      default: null
    },
    modelValue: {
      type: [Boolean, Array],
      default: null
    },
    name: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    indeterminate: {
      type: Boolean,
      default: void 0
    },
    help: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: () => config.default.color,
      validator(value) {
        return appConfig.ui.colors.includes(value);
      }
    },
    inputClass: {
      type: String,
      default: ""
    },
    class: {
      type: [String, Object, Array],
      default: () => ""
    },
    ui: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    var _a;
    const { ui, attrs } = useUI("checkbox", toRef(props, "ui"), config, toRef(props, "class"));
    const { emitFormChange, color, name, inputId: _inputId } = useFormGroup(props);
    const inputId = (_a = _inputId.value) != null ? _a : useId();
    const toggle = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        emit("update:modelValue", value);
      }
    });
    const onChange = (event) => {
      emit("change", event.target.checked);
      emitFormChange();
    };
    const inputClass = computed(() => {
      return twMerge(twJoin(
        ui.value.base,
        ui.value.form,
        ui.value.rounded,
        ui.value.background,
        ui.value.border,
        color.value && ui.value.ring.replaceAll("{color}", color.value),
        color.value && ui.value.color.replaceAll("{color}", color.value)
      ), props.inputClass);
    });
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      toggle,
      inputId,
      // eslint-disable-next-line vue/no-dupe-keys
      name,
      // eslint-disable-next-line vue/no-dupe-keys
      inputClass,
      onChange
    };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  let _temp0;
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: _ctx.ui.wrapper,
    "data-n-ids": _ctx.attrs["data-n-ids"]
  }, _attrs))}><div class="${ssrRenderClass(_ctx.ui.container)}"><input${ssrRenderAttrs((_temp0 = mergeProps({
    id: _ctx.inputId,
    checked: Array.isArray(_ctx.toggle) ? ssrLooseContain(_ctx.toggle, _ctx.value) : _ctx.toggle,
    name: _ctx.name,
    required: _ctx.required,
    value: _ctx.value,
    disabled: _ctx.disabled,
    indeterminate: _ctx.indeterminate,
    type: "checkbox",
    class: _ctx.inputClass
  }, _ctx.attrs), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, _ctx.toggle))))}></div>`);
  if (_ctx.label || _ctx.$slots.label) {
    _push(`<div class="${ssrRenderClass(_ctx.ui.inner)}"><label${ssrRenderAttr("for", _ctx.inputId)} class="${ssrRenderClass(_ctx.ui.label)}">`);
    ssrRenderSlot(_ctx.$slots, "label", { label: _ctx.label }, () => {
      _push(`${ssrInterpolate(_ctx.label)}`);
    }, _push, _parent);
    if (_ctx.required) {
      _push(`<span class="${ssrRenderClass(_ctx.ui.required)}">*</span>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</label>`);
    if (_ctx.help || _ctx.$slots.help) {
      _push(`<p class="${ssrRenderClass(_ctx.ui.help)}">`);
      ssrRenderSlot(_ctx.$slots, "help", { help: _ctx.help }, () => {
        _push(`${ssrInterpolate(_ctx.help)}`);
      }, _push, _parent);
      _push(`</p>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/forms/Checkbox.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_9 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { household, members, categories, profile } = useHousehold();
    const {
      bills,
      loading,
      fetchBills,
      saveBill,
      deleteBill,
      copyLastMonthBills,
      markBillPaid,
      unmarkBillPaid
    } = useBills();
    const toast = useToast();
    const currentMonthString = () => {
      const now = /* @__PURE__ */ new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    };
    const selectedMonth = ref(currentMonthString());
    const copyingBills = ref(false);
    const showFormModal = ref(false);
    const isEditing = ref(false);
    const savingBill = ref(false);
    const billId = ref(void 0);
    const billName = ref("");
    const billCategory = ref(void 0);
    const billAmount = ref(0);
    const billDueDate = ref("");
    const billIsRecurring = ref(true);
    const showMarkPaidModal = ref(false);
    const activeBill = ref(null);
    const paidBy = ref("");
    const paidDate = ref((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    const markingPaid = ref(false);
    const showDeleteConfirm = ref(false);
    const billToDelete = ref(null);
    const deleting = ref(false);
    watch(selectedMonth, () => {
      fetchBills(selectedMonth.value);
    });
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
    const totalBillsAmount = computed(() => {
      return bills.value.reduce((sum, b) => sum + b.amount, 0);
    });
    const totalPaidAmount = computed(() => {
      return bills.value.filter((b) => b.status === "paid").reduce((sum, b) => sum + b.amount, 0);
    });
    const totalUnpaidAmount = computed(() => {
      return bills.value.filter((b) => b.status === "unpaid").reduce((sum, b) => sum + b.amount, 0);
    });
    const openAddModal = () => {
      var _a, _b;
      isEditing.value = false;
      billId.value = void 0;
      billName.value = "";
      billCategory.value = ((_a = categories.value.find((c) => c.name.toLowerCase() === "utilities")) == null ? void 0 : _a.id) || ((_b = categories.value[0]) == null ? void 0 : _b.id);
      billAmount.value = 0;
      billDueDate.value = `${selectedMonth.value}-15`;
      billIsRecurring.value = true;
      showFormModal.value = true;
    };
    const openEditModal = (b) => {
      isEditing.value = true;
      billId.value = b.id;
      billName.value = b.name;
      billCategory.value = b.category_id || void 0;
      billAmount.value = b.amount;
      billDueDate.value = b.due_date;
      billIsRecurring.value = b.is_recurring;
      showFormModal.value = true;
    };
    const handleSaveBill = async () => {
      if (!billName.value.trim()) {
        toast.add({ title: "Validation", description: "Bill name is required.", color: "red" });
        return;
      }
      if (billAmount.value <= 0) {
        toast.add({ title: "Validation", description: "Bill amount must be greater than zero.", color: "red" });
        return;
      }
      if (!billDueDate.value) {
        toast.add({ title: "Validation", description: "Due date is required.", color: "red" });
        return;
      }
      savingBill.value = true;
      try {
        await saveBill({
          id: billId.value,
          household_id: household.value.id,
          name: billName.value.trim(),
          category_id: billCategory.value || null,
          amount: Number(billAmount.value),
          due_date: billDueDate.value,
          billing_month: `${selectedMonth.value}-01`,
          is_recurring: billIsRecurring.value
        });
        toast.add({
          title: isEditing.value ? "Bill Updated" : "Bill Added",
          description: `${billName.value} saved and split equally among all members.`,
          color: "green"
        });
        showFormModal.value = false;
        await fetchBills(selectedMonth.value);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to save bill";
        toast.add({ title: "Error", description: msg, color: "red" });
      } finally {
        savingBill.value = false;
      }
    };
    const handleCopyLastMonth = async () => {
      copyingBills.value = true;
      try {
        const count = await copyLastMonthBills(selectedMonth.value);
        if (count > 0) {
          toast.add({
            title: "Bills Copied",
            description: `Successfully copied ${count} recurring bills from last month as unpaid.`,
            color: "green"
          });
        } else {
          toast.add({
            title: "Nothing to copy",
            description: "No new recurring bills from last month were found.",
            color: "primary"
          });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to copy bills";
        toast.add({ title: "Error", description: msg, color: "red" });
      } finally {
        copyingBills.value = false;
      }
    };
    const openMarkPaidModal = (b) => {
      var _a, _b;
      activeBill.value = b;
      paidBy.value = ((_a = profile.value) == null ? void 0 : _a.id) || ((_b = members.value[0]) == null ? void 0 : _b.id) || "";
      paidDate.value = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      showMarkPaidModal.value = true;
    };
    const handleConfirmMarkPaid = async () => {
      if (!activeBill.value || !paidBy.value) return;
      markingPaid.value = true;
      try {
        await markBillPaid(activeBill.value.id, paidBy.value, paidDate.value);
        toast.add({
          title: "Marked as Paid",
          description: `${activeBill.value.name} marked as paid.`,
          color: "green"
        });
        showMarkPaidModal.value = false;
        await fetchBills(selectedMonth.value);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to mark bill as paid";
        toast.add({ title: "Error", description: msg, color: "red" });
      } finally {
        markingPaid.value = false;
      }
    };
    const handleUnmarkPaid = async (b) => {
      try {
        await unmarkBillPaid(b.id);
        toast.add({
          title: "Unmarked",
          description: `${b.name} marked as unpaid.`,
          color: "primary"
        });
        await fetchBills(selectedMonth.value);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to unmark bill";
        toast.add({ title: "Error", description: msg, color: "red" });
      }
    };
    const openDeleteModal = (b) => {
      billToDelete.value = b;
      showDeleteConfirm.value = true;
    };
    const handleConfirmDelete = async () => {
      if (!billToDelete.value) return;
      deleting.value = true;
      try {
        await deleteBill(billToDelete.value.id);
        toast.add({
          title: "Deleted",
          description: "Bill removed.",
          color: "green"
        });
        showDeleteConfirm.value = false;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to delete bill";
        toast.add({ title: "Error", description: msg, color: "red" });
      } finally {
        deleting.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      const _component_UButton = __nuxt_component_0$1;
      const _component_USelect = __nuxt_component_1;
      const _component_USkeleton = __nuxt_component_3;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_BillCard = _sfc_main$2;
      const _component_UModal = __nuxt_component_8;
      const _component_UCard = __nuxt_component_2;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_UInput = __nuxt_component_2$1;
      const _component_UCheckbox = __nuxt_component_9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-5 max-w-2xl mx-auto pb-12" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Household Bills</h1><p class="text-xs text-gray-500 mt-0.5"> Rent, utilities, internet &amp; recurring split bills </p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "primary",
        icon: "i-heroicons-plus",
        size: "md",
        onClick: openAddModal
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Add Bill `);
          } else {
            return [
              createTextVNode(" Add Bill ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between"><div class="w-full sm:w-64">`);
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: unref(selectedMonth),
        "onUpdate:modelValue": ($event) => isRef(selectedMonth) ? selectedMonth.value = $event : null,
        options: unref(monthOptions),
        "option-attribute": "label",
        "value-attribute": "value",
        icon: "i-heroicons-calendar"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UButton, {
        variant: "soft",
        color: "gray",
        icon: "i-heroicons-document-duplicate",
        size: "sm",
        loading: unref(copyingBills),
        disabled: unref(copyingBills),
        onClick: handleCopyLastMonth
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Copy Last Month&#39;s Bills `);
          } else {
            return [
              createTextVNode(" Copy Last Month's Bills ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-3 gap-3"><div class="bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200 dark:border-gray-800"><p class="text-[11px] text-gray-500 font-medium">Total Bills</p><p class="font-mono font-bold text-base text-gray-900 dark:text-white mt-0.5">${ssrInterpolate(unref(formatMoney)(unref(totalBillsAmount), (_a = unref(household)) == null ? void 0 : _a.currency))}</p></div><div class="bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200 dark:border-gray-800"><p class="text-[11px] text-green-600 dark:text-green-400 font-medium">Paid</p><p class="font-mono font-bold text-base text-green-600 dark:text-green-400 mt-0.5">${ssrInterpolate(unref(formatMoney)(unref(totalPaidAmount), (_b = unref(household)) == null ? void 0 : _b.currency))}</p></div><div class="bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200 dark:border-gray-800"><p class="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Unpaid</p><p class="font-mono font-bold text-base text-amber-600 dark:text-amber-400 mt-0.5">${ssrInterpolate(unref(formatMoney)(unref(totalUnpaidAmount), (_c = unref(household)) == null ? void 0 : _c.currency))}</p></div></div>`);
      if (unref(loading) && unref(bills).length === 0) {
        _push(`<div class="space-y-3">`);
        _push(ssrRenderComponent(_component_USkeleton, { class: "h-28 w-full rounded-xl" }, null, _parent));
        _push(ssrRenderComponent(_component_USkeleton, { class: "h-28 w-full rounded-xl" }, null, _parent));
        _push(`</div>`);
      } else if (unref(bills).length === 0) {
        _push(`<div class="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-8">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-calendar-days",
          class: "w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3"
        }, null, _parent));
        _push(`<h3 class="font-medium text-gray-900 dark:text-white">No bills for this month</h3><p class="text-xs text-gray-500 mt-1 max-w-xs mx-auto"> Add rent, power, or internet bills, or copy recurring bills from last month. </p><div class="flex justify-center gap-2 mt-4">`);
        _push(ssrRenderComponent(_component_UButton, {
          color: "primary",
          size: "sm",
          icon: "i-heroicons-plus",
          onClick: openAddModal
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Add Bill `);
            } else {
              return [
                createTextVNode(" Add Bill ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UButton, {
          variant: "soft",
          color: "gray",
          size: "sm",
          icon: "i-heroicons-document-duplicate",
          loading: unref(copyingBills),
          onClick: handleCopyLastMonth
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Copy Last Month `);
            } else {
              return [
                createTextVNode(" Copy Last Month ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(unref(bills), (bill) => {
          var _a2;
          _push(ssrRenderComponent(_component_BillCard, {
            key: bill.id,
            bill,
            currency: (_a2 = unref(household)) == null ? void 0 : _a2.currency,
            onEdit: openEditModal,
            onDelete: openDeleteModal,
            onMarkPaid: openMarkPaidModal,
            onUnmarkPaid: handleUnmarkPaid
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(showFormModal),
        "onUpdate:modelValue": ($event) => isRef(showFormModal) ? showFormModal.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-heroicons-calendar-days",
                    class: "w-5 h-5 text-primary-500"
                  }, null, _parent3, _scopeId2));
                  _push3(`<h3 class="font-bold text-base"${_scopeId2}>${ssrInterpolate(unref(isEditing) ? "Edit Bill" : "Add Monthly Bill")}</h3></div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-calendar-days",
                        class: "w-5 h-5 text-primary-500"
                      }),
                      createVNode("h3", { class: "font-bold text-base" }, toDisplayString(unref(isEditing) ? "Edit Bill" : "Add Monthly Bill"), 1)
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a2, _b2;
                if (_push3) {
                  _push3(`<form class="space-y-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Bill Name",
                    required: "",
                    help: "e.g. Electricity, Water, Rent"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(billName),
                          "onUpdate:modelValue": ($event) => isRef(billName) ? billName.value = $event : null,
                          placeholder: "e.g. Meralco Electricity",
                          autofocus: "",
                          disabled: unref(savingBill)
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(billName),
                            "onUpdate:modelValue": ($event) => isRef(billName) ? billName.value = $event : null,
                            placeholder: "e.g. Meralco Electricity",
                            autofocus: "",
                            disabled: unref(savingBill)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="grid grid-cols-2 gap-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormGroup, { label: "Category" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(billCategory),
                          "onUpdate:modelValue": ($event) => isRef(billCategory) ? billCategory.value = $event : null,
                          options: unref(categories),
                          "option-attribute": "name",
                          "value-attribute": "id",
                          placeholder: "Select category",
                          disabled: unref(savingBill)
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(billCategory),
                            "onUpdate:modelValue": ($event) => isRef(billCategory) ? billCategory.value = $event : null,
                            options: unref(categories),
                            "option-attribute": "name",
                            "value-attribute": "id",
                            placeholder: "Select category",
                            disabled: unref(savingBill)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Total Amount",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(billAmount),
                          "onUpdate:modelValue": ($event) => isRef(billAmount) ? billAmount.value = $event : null,
                          modelModifiers: { number: true },
                          type: "number",
                          min: "0.01",
                          step: "0.01",
                          placeholder: "0.00",
                          disabled: unref(savingBill)
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(billAmount),
                            "onUpdate:modelValue": ($event) => isRef(billAmount) ? billAmount.value = $event : null,
                            modelModifiers: { number: true },
                            type: "number",
                            min: "0.01",
                            step: "0.01",
                            placeholder: "0.00",
                            disabled: unref(savingBill)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Due Date",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(billDueDate),
                          "onUpdate:modelValue": ($event) => isRef(billDueDate) ? billDueDate.value = $event : null,
                          type: "date",
                          disabled: unref(savingBill)
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(billDueDate),
                            "onUpdate:modelValue": ($event) => isRef(billDueDate) ? billDueDate.value = $event : null,
                            type: "date",
                            disabled: unref(savingBill)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UCheckbox, {
                          modelValue: unref(billIsRecurring),
                          "onUpdate:modelValue": ($event) => isRef(billIsRecurring) ? billIsRecurring.value = $event : null,
                          label: "Recurring monthly bill",
                          help: "Allows cloning this bill into future months with one click",
                          disabled: unref(savingBill)
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UCheckbox, {
                            modelValue: unref(billIsRecurring),
                            "onUpdate:modelValue": ($event) => isRef(billIsRecurring) ? billIsRecurring.value = $event : null,
                            label: "Recurring monthly bill",
                            help: "Allows cloning this bill into future months with one click",
                            disabled: unref(savingBill)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-500"${_scopeId2}><p class="font-medium text-gray-700 dark:text-gray-300 mb-0.5"${_scopeId2}>Split rule:</p> Always split equally among all current household members (${ssrInterpolate(unref(members).length)} members). `);
                  if (unref(billAmount) > 0) {
                    _push3(`<span class="block font-semibold text-primary-600 dark:text-primary-400 mt-1 font-mono"${_scopeId2}> ~${ssrInterpolate(unref(formatMoney)(unref(billAmount) / (unref(members).length || 1), (_a2 = unref(household)) == null ? void 0 : _a2.currency))} per person </span>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="flex justify-end gap-2 pt-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "button",
                    variant: "ghost",
                    color: "gray",
                    disabled: unref(savingBill),
                    onClick: ($event) => showFormModal.value = false
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
                    loading: unref(savingBill),
                    disabled: unref(savingBill)
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(unref(isEditing) ? "Save Changes" : "Create Bill")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(unref(isEditing) ? "Save Changes" : "Create Bill"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></form>`);
                } else {
                  return [
                    createVNode("form", {
                      onSubmit: withModifiers(handleSaveBill, ["prevent"]),
                      class: "space-y-4"
                    }, [
                      createVNode(_component_UFormGroup, {
                        label: "Bill Name",
                        required: "",
                        help: "e.g. Electricity, Water, Rent"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(billName),
                            "onUpdate:modelValue": ($event) => isRef(billName) ? billName.value = $event : null,
                            placeholder: "e.g. Meralco Electricity",
                            autofocus: "",
                            disabled: unref(savingBill)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
                        createVNode(_component_UFormGroup, { label: "Category" }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(billCategory),
                              "onUpdate:modelValue": ($event) => isRef(billCategory) ? billCategory.value = $event : null,
                              options: unref(categories),
                              "option-attribute": "name",
                              "value-attribute": "id",
                              placeholder: "Select category",
                              disabled: unref(savingBill)
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormGroup, {
                          label: "Total Amount",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(billAmount),
                              "onUpdate:modelValue": ($event) => isRef(billAmount) ? billAmount.value = $event : null,
                              modelModifiers: { number: true },
                              type: "number",
                              min: "0.01",
                              step: "0.01",
                              placeholder: "0.00",
                              disabled: unref(savingBill)
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode(_component_UFormGroup, {
                        label: "Due Date",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(billDueDate),
                            "onUpdate:modelValue": ($event) => isRef(billDueDate) ? billDueDate.value = $event : null,
                            type: "date",
                            disabled: unref(savingBill)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, null, {
                        default: withCtx(() => [
                          createVNode(_component_UCheckbox, {
                            modelValue: unref(billIsRecurring),
                            "onUpdate:modelValue": ($event) => isRef(billIsRecurring) ? billIsRecurring.value = $event : null,
                            label: "Recurring monthly bill",
                            help: "Allows cloning this bill into future months with one click",
                            disabled: unref(savingBill)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-500" }, [
                        createVNode("p", { class: "font-medium text-gray-700 dark:text-gray-300 mb-0.5" }, "Split rule:"),
                        createTextVNode(" Always split equally among all current household members (" + toDisplayString(unref(members).length) + " members). ", 1),
                        unref(billAmount) > 0 ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "block font-semibold text-primary-600 dark:text-primary-400 mt-1 font-mono"
                        }, " ~" + toDisplayString(unref(formatMoney)(unref(billAmount) / (unref(members).length || 1), (_b2 = unref(household)) == null ? void 0 : _b2.currency)) + " per person ", 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
                        createVNode(_component_UButton, {
                          type: "button",
                          variant: "ghost",
                          color: "gray",
                          disabled: unref(savingBill),
                          onClick: ($event) => showFormModal.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Cancel ")
                          ]),
                          _: 1
                        }, 8, ["disabled", "onClick"]),
                        createVNode(_component_UButton, {
                          type: "submit",
                          color: "primary",
                          loading: unref(savingBill),
                          disabled: unref(savingBill)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(isEditing) ? "Save Changes" : "Create Bill"), 1)
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
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-calendar-days",
                      class: "w-5 h-5 text-primary-500"
                    }),
                    createVNode("h3", { class: "font-bold text-base" }, toDisplayString(unref(isEditing) ? "Edit Bill" : "Add Monthly Bill"), 1)
                  ])
                ]),
                default: withCtx(() => {
                  var _a2;
                  return [
                    createVNode("form", {
                      onSubmit: withModifiers(handleSaveBill, ["prevent"]),
                      class: "space-y-4"
                    }, [
                      createVNode(_component_UFormGroup, {
                        label: "Bill Name",
                        required: "",
                        help: "e.g. Electricity, Water, Rent"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(billName),
                            "onUpdate:modelValue": ($event) => isRef(billName) ? billName.value = $event : null,
                            placeholder: "e.g. Meralco Electricity",
                            autofocus: "",
                            disabled: unref(savingBill)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
                        createVNode(_component_UFormGroup, { label: "Category" }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(billCategory),
                              "onUpdate:modelValue": ($event) => isRef(billCategory) ? billCategory.value = $event : null,
                              options: unref(categories),
                              "option-attribute": "name",
                              "value-attribute": "id",
                              placeholder: "Select category",
                              disabled: unref(savingBill)
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormGroup, {
                          label: "Total Amount",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(billAmount),
                              "onUpdate:modelValue": ($event) => isRef(billAmount) ? billAmount.value = $event : null,
                              modelModifiers: { number: true },
                              type: "number",
                              min: "0.01",
                              step: "0.01",
                              placeholder: "0.00",
                              disabled: unref(savingBill)
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode(_component_UFormGroup, {
                        label: "Due Date",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(billDueDate),
                            "onUpdate:modelValue": ($event) => isRef(billDueDate) ? billDueDate.value = $event : null,
                            type: "date",
                            disabled: unref(savingBill)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, null, {
                        default: withCtx(() => [
                          createVNode(_component_UCheckbox, {
                            modelValue: unref(billIsRecurring),
                            "onUpdate:modelValue": ($event) => isRef(billIsRecurring) ? billIsRecurring.value = $event : null,
                            label: "Recurring monthly bill",
                            help: "Allows cloning this bill into future months with one click",
                            disabled: unref(savingBill)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-500" }, [
                        createVNode("p", { class: "font-medium text-gray-700 dark:text-gray-300 mb-0.5" }, "Split rule:"),
                        createTextVNode(" Always split equally among all current household members (" + toDisplayString(unref(members).length) + " members). ", 1),
                        unref(billAmount) > 0 ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "block font-semibold text-primary-600 dark:text-primary-400 mt-1 font-mono"
                        }, " ~" + toDisplayString(unref(formatMoney)(unref(billAmount) / (unref(members).length || 1), (_a2 = unref(household)) == null ? void 0 : _a2.currency)) + " per person ", 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
                        createVNode(_component_UButton, {
                          type: "button",
                          variant: "ghost",
                          color: "gray",
                          disabled: unref(savingBill),
                          onClick: ($event) => showFormModal.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Cancel ")
                          ]),
                          _: 1
                        }, 8, ["disabled", "onClick"]),
                        createVNode(_component_UButton, {
                          type: "submit",
                          color: "primary",
                          loading: unref(savingBill),
                          disabled: unref(savingBill)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(isEditing) ? "Save Changes" : "Create Bill"), 1)
                          ]),
                          _: 1
                        }, 8, ["loading", "disabled"])
                      ])
                    ], 32)
                  ];
                }),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(showMarkPaidModal),
        "onUpdate:modelValue": ($event) => isRef(showMarkPaidModal) ? showMarkPaidModal.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center gap-2 text-primary-600 dark:text-primary-400"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-heroicons-check-circle",
                    class: "w-5 h-5"
                  }, null, _parent3, _scopeId2));
                  _push3(`<h3 class="font-bold text-base"${_scopeId2}>Record Bill Payment</h3></div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center gap-2 text-primary-600 dark:text-primary-400" }, [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-check-circle",
                        class: "w-5 h-5"
                      }),
                      createVNode("h3", { class: "font-bold text-base" }, "Record Bill Payment")
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a2, _b2, _c2, _d, _e, _f;
                if (_push3) {
                  _push3(`<form class="space-y-4"${_scopeId2}><div${_scopeId2}><p class="text-xs text-gray-500"${_scopeId2}>Bill</p><p class="font-bold text-base text-gray-900 dark:text-white"${_scopeId2}>${ssrInterpolate((_a2 = unref(activeBill)) == null ? void 0 : _a2.name)}</p><p class="font-mono text-sm text-primary-600 dark:text-primary-400 mt-0.5"${_scopeId2}>${ssrInterpolate(unref(formatMoney)(((_b2 = unref(activeBill)) == null ? void 0 : _b2.amount) || 0, (_c2 = unref(household)) == null ? void 0 : _c2.currency))}</p></div>`);
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Who paid this bill?",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(paidBy),
                          "onUpdate:modelValue": ($event) => isRef(paidBy) ? paidBy.value = $event : null,
                          options: unref(members),
                          "option-attribute": "display_name",
                          "value-attribute": "id",
                          disabled: unref(markingPaid)
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(paidBy),
                            "onUpdate:modelValue": ($event) => isRef(paidBy) ? paidBy.value = $event : null,
                            options: unref(members),
                            "option-attribute": "display_name",
                            "value-attribute": "id",
                            disabled: unref(markingPaid)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Date Paid",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(paidDate),
                          "onUpdate:modelValue": ($event) => isRef(paidDate) ? paidDate.value = $event : null,
                          type: "date",
                          disabled: unref(markingPaid)
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(paidDate),
                            "onUpdate:modelValue": ($event) => isRef(paidDate) ? paidDate.value = $event : null,
                            type: "date",
                            disabled: unref(markingPaid)
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
                    disabled: unref(markingPaid),
                    onClick: ($event) => showMarkPaidModal.value = false
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
                    loading: unref(markingPaid),
                    disabled: unref(markingPaid) || !unref(paidBy)
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Confirm Paid `);
                      } else {
                        return [
                          createTextVNode(" Confirm Paid ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></form>`);
                } else {
                  return [
                    createVNode("form", {
                      onSubmit: withModifiers(handleConfirmMarkPaid, ["prevent"]),
                      class: "space-y-4"
                    }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-xs text-gray-500" }, "Bill"),
                        createVNode("p", { class: "font-bold text-base text-gray-900 dark:text-white" }, toDisplayString((_d = unref(activeBill)) == null ? void 0 : _d.name), 1),
                        createVNode("p", { class: "font-mono text-sm text-primary-600 dark:text-primary-400 mt-0.5" }, toDisplayString(unref(formatMoney)(((_e = unref(activeBill)) == null ? void 0 : _e.amount) || 0, (_f = unref(household)) == null ? void 0 : _f.currency)), 1)
                      ]),
                      createVNode(_component_UFormGroup, {
                        label: "Who paid this bill?",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(paidBy),
                            "onUpdate:modelValue": ($event) => isRef(paidBy) ? paidBy.value = $event : null,
                            options: unref(members),
                            "option-attribute": "display_name",
                            "value-attribute": "id",
                            disabled: unref(markingPaid)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, {
                        label: "Date Paid",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(paidDate),
                            "onUpdate:modelValue": ($event) => isRef(paidDate) ? paidDate.value = $event : null,
                            type: "date",
                            disabled: unref(markingPaid)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
                        createVNode(_component_UButton, {
                          type: "button",
                          variant: "ghost",
                          color: "gray",
                          disabled: unref(markingPaid),
                          onClick: ($event) => showMarkPaidModal.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Cancel ")
                          ]),
                          _: 1
                        }, 8, ["disabled", "onClick"]),
                        createVNode(_component_UButton, {
                          type: "submit",
                          color: "primary",
                          loading: unref(markingPaid),
                          disabled: unref(markingPaid) || !unref(paidBy)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Confirm Paid ")
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
                      name: "i-heroicons-check-circle",
                      class: "w-5 h-5"
                    }),
                    createVNode("h3", { class: "font-bold text-base" }, "Record Bill Payment")
                  ])
                ]),
                default: withCtx(() => {
                  var _a2, _b2, _c2;
                  return [
                    createVNode("form", {
                      onSubmit: withModifiers(handleConfirmMarkPaid, ["prevent"]),
                      class: "space-y-4"
                    }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-xs text-gray-500" }, "Bill"),
                        createVNode("p", { class: "font-bold text-base text-gray-900 dark:text-white" }, toDisplayString((_a2 = unref(activeBill)) == null ? void 0 : _a2.name), 1),
                        createVNode("p", { class: "font-mono text-sm text-primary-600 dark:text-primary-400 mt-0.5" }, toDisplayString(unref(formatMoney)(((_b2 = unref(activeBill)) == null ? void 0 : _b2.amount) || 0, (_c2 = unref(household)) == null ? void 0 : _c2.currency)), 1)
                      ]),
                      createVNode(_component_UFormGroup, {
                        label: "Who paid this bill?",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(paidBy),
                            "onUpdate:modelValue": ($event) => isRef(paidBy) ? paidBy.value = $event : null,
                            options: unref(members),
                            "option-attribute": "display_name",
                            "value-attribute": "id",
                            disabled: unref(markingPaid)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, {
                        label: "Date Paid",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(paidDate),
                            "onUpdate:modelValue": ($event) => isRef(paidDate) ? paidDate.value = $event : null,
                            type: "date",
                            disabled: unref(markingPaid)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
                        createVNode(_component_UButton, {
                          type: "button",
                          variant: "ghost",
                          color: "gray",
                          disabled: unref(markingPaid),
                          onClick: ($event) => showMarkPaidModal.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Cancel ")
                          ]),
                          _: 1
                        }, 8, ["disabled", "onClick"]),
                        createVNode(_component_UButton, {
                          type: "submit",
                          color: "primary",
                          loading: unref(markingPaid),
                          disabled: unref(markingPaid) || !unref(paidBy)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Confirm Paid ")
                          ]),
                          _: 1
                        }, 8, ["loading", "disabled"])
                      ])
                    ], 32)
                  ];
                }),
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
                  _push3(`<div class="flex items-center gap-2 text-red-600 dark:text-red-400"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-heroicons-exclamation-triangle",
                    class: "w-5 h-5"
                  }, null, _parent3, _scopeId2));
                  _push3(`<h3 class="font-bold"${_scopeId2}>Delete Bill</h3></div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center gap-2 text-red-600 dark:text-red-400" }, [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-exclamation-triangle",
                        class: "w-5 h-5"
                      }),
                      createVNode("h3", { class: "font-bold" }, "Delete Bill")
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
                    onClick: handleConfirmDelete
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Delete Bill `);
                      } else {
                        return [
                          createTextVNode(" Delete Bill ")
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
                        onClick: handleConfirmDelete
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Delete Bill ")
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
                  _push3(`<p class="text-sm text-gray-600 dark:text-gray-300"${_scopeId2}> Are you sure you want to delete <strong${_scopeId2}>${ssrInterpolate((_a2 = unref(billToDelete)) == null ? void 0 : _a2.name)}</strong>? All shares for this bill will be removed. </p>`);
                } else {
                  return [
                    createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-300" }, [
                      createTextVNode(" Are you sure you want to delete "),
                      createVNode("strong", null, toDisplayString((_b2 = unref(billToDelete)) == null ? void 0 : _b2.name), 1),
                      createTextVNode("? All shares for this bill will be removed. ")
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
                    createVNode("h3", { class: "font-bold" }, "Delete Bill")
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
                      onClick: handleConfirmDelete
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Delete Bill ")
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
                      createVNode("strong", null, toDisplayString((_a2 = unref(billToDelete)) == null ? void 0 : _a2.name), 1),
                      createTextVNode("? All shares for this bill will be removed. ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/bills/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=bills-CXu8h567.mjs.map

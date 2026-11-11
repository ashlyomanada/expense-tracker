import { _ as __nuxt_component_2 } from './Input-BTTc9Q3-.mjs';
import { _ as __nuxt_component_1 } from './Select-C-nPKItW.mjs';
import { d as __nuxt_component_0$1, c as useToast, e as __nuxt_component_1$1 } from './server.mjs';
import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { f as formatMoney, t as toCentavos, a as fromCentavos } from './money-z3Rw8dBE.mjs';

function calculateEqualSplit(totalAmount, memberIds, payerId) {
  if (!memberIds.length) return [];
  const totalCentavos = toCentavos(totalAmount);
  const n = memberIds.length;
  const baseCentavos = Math.floor(totalCentavos / n);
  const remainderCentavos = totalCentavos - baseCentavos * n;
  const remainderRecipientId = payerId && memberIds.includes(payerId) ? payerId : memberIds[0];
  return memberIds.map((userId) => {
    const isRecipient = userId === remainderRecipientId;
    const centavos = baseCentavos + (isRecipient ? remainderCentavos : 0);
    return {
      userId,
      shareAmount: fromCentavos(centavos)
    };
  });
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MemberChips",
  __ssrInlineRender: true,
  props: {
    members: {},
    selectedMemberIds: {},
    itemTotal: {},
    payerId: {},
    currency: {}
  },
  emits: ["update:selectedMemberIds"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useToast();
    const shares = computed(() => {
      return calculateEqualSplit(props.itemTotal, props.selectedMemberIds, props.payerId);
    });
    const getShareForUser = (userId) => {
      const share = shares.value.find((s) => s.userId === userId);
      return share ? share.shareAmount : null;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = __nuxt_component_1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-1.5" }, _attrs))}><div class="flex items-center justify-between"><span class="text-xs font-medium text-gray-500 dark:text-gray-400"> Split with: <span class="text-gray-900 dark:text-gray-200 font-semibold">${ssrInterpolate(__props.selectedMemberIds.length)} of ${ssrInterpolate(__props.members.length)} members </span></span>`);
      if (__props.selectedMemberIds.length > 0 && __props.itemTotal > 0) {
        _push(`<span class="text-xs text-primary-600 dark:text-primary-400 font-medium"> ~${ssrInterpolate(unref(formatMoney)(__props.itemTotal / __props.selectedMemberIds.length, __props.currency))}/person </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex flex-wrap gap-1.5"><!--[-->`);
      ssrRenderList(__props.members, (member) => {
        _push(`<button type="button" class="${ssrRenderClass([__props.selectedMemberIds.includes(member.id) ? "bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border-primary-300 dark:border-primary-700 shadow-sm" : "bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 hover:border-gray-300 opacity-60", "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer"])}">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: __props.selectedMemberIds.includes(member.id) ? "i-heroicons-check-circle-20-solid" : "i-heroicons-plus-circle",
          class: "w-3.5 h-3.5"
        }, null, _parent));
        _push(`<span>${ssrInterpolate(member.display_name)}</span>`);
        if (__props.selectedMemberIds.includes(member.id) && getShareForUser(member.id) !== null) {
          _push(`<span class="font-mono text-[10px] bg-primary-100 dark:bg-primary-900 px-1 py-0.2 rounded">${ssrInterpolate(unref(formatMoney)(getShareForUser(member.id), __props.currency))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MemberChips.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ExpenseItemRow",
  __ssrInlineRender: true,
  props: {
    item: {},
    index: {},
    members: {},
    categories: {},
    payerId: {},
    currency: {},
    canRemove: { type: Boolean }
  },
  emits: ["remove"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const lineTotal = computed(() => {
      const qty = Number(props.item.quantity) || 1;
      const price = Number(props.item.unit_price) || 0;
      return Math.round(qty * price * 100) / 100;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UInput = __nuxt_component_2;
      const _component_USelect = __nuxt_component_1;
      const _component_UButton = __nuxt_component_0$1;
      const _component_MemberChips = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-3.5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3 shadow-xs" }, _attrs))}><div class="flex items-start gap-2"><div class="flex-1">`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: __props.item.name,
        "onUpdate:modelValue": ($event) => __props.item.name = $event,
        placeholder: "Item name (e.g. Eggs, Laundry Soap)",
        size: "sm",
        icon: "i-heroicons-tag",
        required: ""
      }, null, _parent));
      _push(`</div><div class="w-36">`);
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: __props.item.category_id,
        "onUpdate:modelValue": ($event) => __props.item.category_id = $event,
        options: __props.categories,
        "option-attribute": "name",
        "value-attribute": "id",
        placeholder: "Category",
        size: "sm"
      }, null, _parent));
      _push(`</div>`);
      if (__props.canRemove) {
        _push(ssrRenderComponent(_component_UButton, {
          type: "button",
          color: "red",
          variant: "ghost",
          icon: "i-heroicons-trash",
          size: "xs",
          class: "mt-0.5",
          onClick: ($event) => emit("remove")
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="grid grid-cols-12 gap-2 items-center"><div class="col-span-3"><div class="text-[11px] text-gray-500 mb-0.5">Qty</div>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: __props.item.quantity,
        "onUpdate:modelValue": ($event) => __props.item.quantity = $event,
        modelModifiers: { number: true },
        type: "number",
        min: "1",
        step: "1",
        size: "sm"
      }, null, _parent));
      _push(`</div><div class="col-span-5"><div class="text-[11px] text-gray-500 mb-0.5">Unit Price</div>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: __props.item.unit_price,
        "onUpdate:modelValue": ($event) => __props.item.unit_price = $event,
        modelModifiers: { number: true },
        type: "number",
        min: "0",
        step: "0.01",
        size: "sm",
        placeholder: "0.00"
      }, null, _parent));
      _push(`</div><div class="col-span-4 text-right"><div class="text-[11px] text-gray-500 mb-0.5">Line Total</div><div class="font-mono font-semibold text-sm text-gray-900 dark:text-white">${ssrInterpolate(unref(formatMoney)(unref(lineTotal), __props.currency))}</div></div></div><div class="pt-2 border-t border-gray-100 dark:border-gray-800/60">`);
      _push(ssrRenderComponent(_component_MemberChips, {
        members: __props.members,
        "selected-member-ids": __props.item.selected_member_ids,
        "onUpdate:selectedMemberIds": ($event) => __props.item.selected_member_ids = $event,
        "item-total": unref(lineTotal),
        "payer-id": __props.payerId,
        currency: __props.currency
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ExpenseItemRow.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=ExpenseItemRow-Bec_-5g0.mjs.map

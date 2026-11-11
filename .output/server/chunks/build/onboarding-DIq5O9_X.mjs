import { _ as __nuxt_component_2 } from './Card-BiaC1RCe.mjs';
import { b as useHousehold, c as useToast, d as __nuxt_component_0$1, e as __nuxt_component_1$1, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_2$1 } from './Alert-Ci22Gk-N.mjs';
import { _ as __nuxt_component_4 } from './FormGroup-COcnPxKZ.mjs';
import { _ as __nuxt_component_2$2 } from './Input-BTTc9Q3-.mjs';
import { _ as __nuxt_component_1 } from './Select-C-nPKItW.mjs';
import { defineComponent, ref, mergeProps, withCtx, unref, isRef, createVNode, createTextVNode, withModifiers, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import 'tailwind-merge';
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
import './useFormGroup-BVR2qx0l.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "onboarding",
  __ssrInlineRender: true,
  setup(__props) {
    const { createHousehold } = useHousehold();
    const toast = useToast();
    const householdName = ref("");
    const currency = ref("PHP");
    const loading = ref(false);
    const errorMessage = ref("");
    const currencies = [
      { label: "PHP (\u20B1) - Philippine Peso", value: "PHP" },
      { label: "USD ($) - US Dollar", value: "USD" },
      { label: "EUR (\u20AC) - Euro", value: "EUR" },
      { label: "SGD ($) - Singapore Dollar", value: "SGD" },
      { label: "JPY (\xA5) - Japanese Yen", value: "JPY" }
    ];
    const handleCreate = async () => {
      if (!householdName.value.trim()) {
        errorMessage.value = "Please provide a household name.";
        return;
      }
      loading.value = true;
      errorMessage.value = "";
      try {
        await createHousehold(householdName.value.trim(), currency.value);
        toast.add({
          title: "Household created!",
          description: "Your household is ready.",
          color: "green"
        });
        await navigateTo("/");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to create household";
        errorMessage.value = msg;
        toast.add({
          title: "Error",
          description: msg,
          color: "red"
        });
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_2;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UAlert = __nuxt_component_2$1;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_UInput = __nuxt_component_2$2;
      const _component_USelect = __nuxt_component_1;
      const _component_UButton = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-[80vh] flex flex-col justify-center max-w-md mx-auto py-8" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_UCard, { class: "shadow-sm border border-gray-200 dark:border-gray-800" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-sparkles",
              class: "w-10 h-10 text-primary-500 mx-auto mb-2"
            }, null, _parent2, _scopeId));
            _push2(`<h1 class="text-xl font-bold text-gray-900 dark:text-white"${_scopeId}>Create Your Household</h1><p class="text-xs text-gray-500 mt-1"${_scopeId}>Start tracking shared expenses with your housemates</p></div>`);
          } else {
            return [
              createVNode("div", { class: "text-center" }, [
                createVNode(_component_UIcon, {
                  name: "i-heroicons-sparkles",
                  class: "w-10 h-10 text-primary-500 mx-auto mb-2"
                }),
                createVNode("h1", { class: "text-xl font-bold text-gray-900 dark:text-white" }, "Create Your Household"),
                createVNode("p", { class: "text-xs text-gray-500 mt-1" }, "Start tracking shared expenses with your housemates")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="space-y-4"${_scopeId}>`);
            if (unref(errorMessage)) {
              _push2(ssrRenderComponent(_component_UAlert, {
                icon: "i-heroicons-exclamation-triangle",
                color: "red",
                variant: "subtle",
                title: unref(errorMessage),
                class: "mb-2"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Household Name",
              required: "",
              help: "e.g. Pinecrest Condo #302 or The Loft"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(householdName),
                    "onUpdate:modelValue": ($event) => isRef(householdName) ? householdName.value = $event : null,
                    type: "text",
                    placeholder: "e.g. Greenwoods Manor #4",
                    icon: "i-heroicons-home",
                    autofocus: "",
                    disabled: unref(loading)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(householdName),
                      "onUpdate:modelValue": ($event) => isRef(householdName) ? householdName.value = $event : null,
                      type: "text",
                      placeholder: "e.g. Greenwoods Manor #4",
                      icon: "i-heroicons-home",
                      autofocus: "",
                      disabled: unref(loading)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Currency",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelect, {
                    modelValue: unref(currency),
                    "onUpdate:modelValue": ($event) => isRef(currency) ? currency.value = $event : null,
                    options: currencies,
                    "option-attribute": "label",
                    "value-attribute": "value",
                    disabled: unref(loading)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelect, {
                      modelValue: unref(currency),
                      "onUpdate:modelValue": ($event) => isRef(currency) ? currency.value = $event : null,
                      options: currencies,
                      "option-attribute": "label",
                      "value-attribute": "value",
                      disabled: unref(loading)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              block: "",
              color: "primary",
              loading: unref(loading),
              disabled: unref(loading),
              size: "lg"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Create Household `);
                } else {
                  return [
                    createTextVNode(" Create Household ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="relative py-2"${_scopeId}><div class="absolute inset-0 flex items-center"${_scopeId}><span class="w-full border-t border-gray-200 dark:border-gray-800"${_scopeId}></span></div><div class="relative flex justify-center text-xs uppercase"${_scopeId}><span class="bg-white dark:bg-gray-900 px-2 text-gray-400"${_scopeId}>or</span></div></div>`);
            _push2(ssrRenderComponent(_component_UButton, {
              to: "/join",
              variant: "outline",
              color: "gray",
              block: "",
              size: "lg",
              icon: "i-heroicons-key"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Join with Invite Code `);
                } else {
                  return [
                    createTextVNode(" Join with Invite Code ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(handleCreate, ["prevent"]),
                class: "space-y-4"
              }, [
                unref(errorMessage) ? (openBlock(), createBlock(_component_UAlert, {
                  key: 0,
                  icon: "i-heroicons-exclamation-triangle",
                  color: "red",
                  variant: "subtle",
                  title: unref(errorMessage),
                  class: "mb-2"
                }, null, 8, ["title"])) : createCommentVNode("", true),
                createVNode(_component_UFormGroup, {
                  label: "Household Name",
                  required: "",
                  help: "e.g. Pinecrest Condo #302 or The Loft"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(householdName),
                      "onUpdate:modelValue": ($event) => isRef(householdName) ? householdName.value = $event : null,
                      type: "text",
                      placeholder: "e.g. Greenwoods Manor #4",
                      icon: "i-heroicons-home",
                      autofocus: "",
                      disabled: unref(loading)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormGroup, {
                  label: "Currency",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_USelect, {
                      modelValue: unref(currency),
                      "onUpdate:modelValue": ($event) => isRef(currency) ? currency.value = $event : null,
                      options: currencies,
                      "option-attribute": "label",
                      "value-attribute": "value",
                      disabled: unref(loading)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UButton, {
                  type: "submit",
                  block: "",
                  color: "primary",
                  loading: unref(loading),
                  disabled: unref(loading),
                  size: "lg"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Create Household ")
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"]),
                createVNode("div", { class: "relative py-2" }, [
                  createVNode("div", { class: "absolute inset-0 flex items-center" }, [
                    createVNode("span", { class: "w-full border-t border-gray-200 dark:border-gray-800" })
                  ]),
                  createVNode("div", { class: "relative flex justify-center text-xs uppercase" }, [
                    createVNode("span", { class: "bg-white dark:bg-gray-900 px-2 text-gray-400" }, "or")
                  ])
                ]),
                createVNode(_component_UButton, {
                  to: "/join",
                  variant: "outline",
                  color: "gray",
                  block: "",
                  size: "lg",
                  icon: "i-heroicons-key"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Join with Invite Code ")
                  ]),
                  _: 1
                })
              ], 32)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/onboarding.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=onboarding-DIq5O9_X.mjs.map

import { _ as __nuxt_component_2 } from "./Card-BiaC1RCe.js";
import { b as useHousehold, c as useToast, d as __nuxt_component_0, e as __nuxt_component_1, n as navigateTo } from "../server.mjs";
import { _ as __nuxt_component_2$1 } from "./Alert-Ci22Gk-N.js";
import { _ as __nuxt_component_4 } from "./FormGroup-COcnPxKZ.js";
import { _ as __nuxt_component_2$2 } from "./Input-BTTc9Q3-.js";
import { defineComponent, ref, mergeProps, withCtx, unref, isRef, createVNode, createTextVNode, withModifiers, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import "/Users/ccci/Expense Tracker/node_modules/hookable/dist/index.mjs";
import "tailwind-merge";
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
import "/Users/ccci/Expense Tracker/node_modules/@unhead/vue/dist/index.mjs";
import "@iconify/vue";
import "@iconify/utils/lib/css/icon";
import "/Users/ccci/Expense Tracker/node_modules/perfect-debounce/dist/index.mjs";
import "ohash/utils";
import "./useFormGroup-BVR2qx0l.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "join",
  __ssrInlineRender: true,
  setup(__props) {
    const { joinHousehold } = useHousehold();
    const toast = useToast();
    const inviteCode = ref("");
    const loading = ref(false);
    const errorMessage = ref("");
    const handleJoin = async () => {
      const code = inviteCode.value.trim().toUpperCase();
      if (!code) {
        errorMessage.value = "Please enter an invite code.";
        return;
      }
      loading.value = true;
      errorMessage.value = "";
      try {
        const res = await joinHousehold(code);
        toast.add({
          title: "Joined household!",
          description: "You are now a member.",
          color: "green"
        });
        await navigateTo("/");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Invalid invite code";
        errorMessage.value = msg;
        toast.add({
          title: "Failed to join",
          description: msg,
          color: "red"
        });
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_2;
      const _component_UIcon = __nuxt_component_1;
      const _component_UAlert = __nuxt_component_2$1;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_UInput = __nuxt_component_2$2;
      const _component_UButton = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-[80vh] flex flex-col justify-center max-w-md mx-auto py-8" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_UCard, { class: "shadow-sm border border-gray-200 dark:border-gray-800" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-key",
              class: "w-10 h-10 text-primary-500 mx-auto mb-2"
            }, null, _parent2, _scopeId));
            _push2(`<h1 class="text-xl font-bold text-gray-900 dark:text-white"${_scopeId}>Join a Household</h1><p class="text-xs text-gray-500 mt-1"${_scopeId}>Enter the 6-character code shared by your housemate</p></div>`);
          } else {
            return [
              createVNode("div", { class: "text-center" }, [
                createVNode(_component_UIcon, {
                  name: "i-heroicons-key",
                  class: "w-10 h-10 text-primary-500 mx-auto mb-2"
                }),
                createVNode("h1", { class: "text-xl font-bold text-gray-900 dark:text-white" }, "Join a Household"),
                createVNode("p", { class: "text-xs text-gray-500 mt-1" }, "Enter the 6-character code shared by your housemate")
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
              label: "Invite Code",
              required: "",
              help: "Ask your household owner for their invite code"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(inviteCode),
                    "onUpdate:modelValue": ($event) => isRef(inviteCode) ? inviteCode.value = $event : null,
                    type: "text",
                    placeholder: "e.g. SPLIT5",
                    icon: "i-heroicons-ticket",
                    class: "uppercase tracking-widest text-center font-mono text-lg",
                    autofocus: "",
                    maxlength: "10",
                    disabled: unref(loading)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(inviteCode),
                      "onUpdate:modelValue": ($event) => isRef(inviteCode) ? inviteCode.value = $event : null,
                      type: "text",
                      placeholder: "e.g. SPLIT5",
                      icon: "i-heroicons-ticket",
                      class: "uppercase tracking-widest text-center font-mono text-lg",
                      autofocus: "",
                      maxlength: "10",
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
                  _push3(` Join Household `);
                } else {
                  return [
                    createTextVNode(" Join Household ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="relative py-2"${_scopeId}><div class="absolute inset-0 flex items-center"${_scopeId}><span class="w-full border-t border-gray-200 dark:border-gray-800"${_scopeId}></span></div><div class="relative flex justify-center text-xs uppercase"${_scopeId}><span class="bg-white dark:bg-gray-900 px-2 text-gray-400"${_scopeId}>or</span></div></div>`);
            _push2(ssrRenderComponent(_component_UButton, {
              to: "/onboarding",
              variant: "outline",
              color: "gray",
              block: "",
              size: "lg",
              icon: "i-heroicons-plus-circle"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Create New Household `);
                } else {
                  return [
                    createTextVNode(" Create New Household ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(handleJoin, ["prevent"]),
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
                  label: "Invite Code",
                  required: "",
                  help: "Ask your household owner for their invite code"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(inviteCode),
                      "onUpdate:modelValue": ($event) => isRef(inviteCode) ? inviteCode.value = $event : null,
                      type: "text",
                      placeholder: "e.g. SPLIT5",
                      icon: "i-heroicons-ticket",
                      class: "uppercase tracking-widest text-center font-mono text-lg",
                      autofocus: "",
                      maxlength: "10",
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
                    createTextVNode(" Join Household ")
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
                  to: "/onboarding",
                  variant: "outline",
                  color: "gray",
                  block: "",
                  size: "lg",
                  icon: "i-heroicons-plus-circle"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Create New Household ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/join.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=join-Hbx43S42.js.map

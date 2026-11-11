import { _ as __nuxt_component_2 } from "./Card-BiaC1RCe.js";
import { f as useSupabaseClient, b as useHousehold, c as useToast, d as __nuxt_component_0, a as __nuxt_component_0$1, e as __nuxt_component_1, n as navigateTo } from "../server.mjs";
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
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    const supabase = useSupabaseClient();
    const { fetchProfile } = useHousehold();
    const toast = useToast();
    const displayName = ref("");
    const email = ref("");
    const password = ref("");
    const loading = ref(false);
    const errorMessage = ref("");
    const handleRegister = async () => {
      if (!displayName.value.trim() || !email.value.trim() || !password.value) {
        errorMessage.value = "Please fill out all fields.";
        return;
      }
      if (password.value.length < 6) {
        errorMessage.value = "Password must be at least 6 characters long.";
        return;
      }
      loading.value = true;
      errorMessage.value = "";
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.value.trim(),
          password: password.value,
          options: {
            data: {
              display_name: displayName.value.trim()
            }
          }
        });
        if (error) throw error;
        toast.add({
          title: "Account created!",
          description: "Welcome to HouseSplit.",
          color: "green"
        });
        await fetchProfile();
        await navigateTo("/onboarding");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Registration failed";
        errorMessage.value = message;
        toast.add({
          title: "Registration failed",
          description: message,
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
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-[80vh] flex flex-col justify-center max-w-sm mx-auto py-8" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_UCard, { class: "shadow-sm border border-gray-200 dark:border-gray-800" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-user-plus",
              class: "w-10 h-10 text-primary-500 mx-auto mb-2"
            }, null, _parent2, _scopeId));
            _push2(`<h1 class="text-xl font-bold text-gray-900 dark:text-white"${_scopeId}>Create an Account</h1><p class="text-xs text-gray-500 mt-1"${_scopeId}>Join or start your household split</p></div>`);
          } else {
            return [
              createVNode("div", { class: "text-center" }, [
                createVNode(_component_UIcon, {
                  name: "i-heroicons-user-plus",
                  class: "w-10 h-10 text-primary-500 mx-auto mb-2"
                }),
                createVNode("h1", { class: "text-xl font-bold text-gray-900 dark:text-white" }, "Create an Account"),
                createVNode("p", { class: "text-xs text-gray-500 mt-1" }, "Join or start your household split")
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
              label: "Your Name (Display Name)",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(displayName),
                    "onUpdate:modelValue": ($event) => isRef(displayName) ? displayName.value = $event : null,
                    type: "text",
                    placeholder: "e.g. Alex",
                    icon: "i-heroicons-user",
                    autofocus: "",
                    disabled: unref(loading)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(displayName),
                      "onUpdate:modelValue": ($event) => isRef(displayName) ? displayName.value = $event : null,
                      type: "text",
                      placeholder: "e.g. Alex",
                      icon: "i-heroicons-user",
                      autofocus: "",
                      disabled: unref(loading)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Email address",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(email),
                    "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
                    type: "email",
                    placeholder: "you@example.com",
                    icon: "i-heroicons-envelope",
                    disabled: unref(loading)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(email),
                      "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
                      type: "email",
                      placeholder: "you@example.com",
                      icon: "i-heroicons-envelope",
                      disabled: unref(loading)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Password",
              required: "",
              help: "At least 6 characters"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(password),
                    "onUpdate:modelValue": ($event) => isRef(password) ? password.value = $event : null,
                    type: "password",
                    placeholder: "••••••••",
                    icon: "i-heroicons-lock-closed",
                    disabled: unref(loading)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(password),
                      "onUpdate:modelValue": ($event) => isRef(password) ? password.value = $event : null,
                      type: "password",
                      placeholder: "••••••••",
                      icon: "i-heroicons-lock-closed",
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
                  _push3(` Create Account `);
                } else {
                  return [
                    createTextVNode(" Create Account ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="text-center text-xs text-gray-500 pt-2"${_scopeId}> Already have an account? `);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/login",
              class: "text-primary-600 dark:text-primary-400 font-semibold hover:underline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Sign In `);
                } else {
                  return [
                    createTextVNode(" Sign In ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(handleRegister, ["prevent"]),
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
                  label: "Your Name (Display Name)",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(displayName),
                      "onUpdate:modelValue": ($event) => isRef(displayName) ? displayName.value = $event : null,
                      type: "text",
                      placeholder: "e.g. Alex",
                      icon: "i-heroicons-user",
                      autofocus: "",
                      disabled: unref(loading)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormGroup, {
                  label: "Email address",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(email),
                      "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
                      type: "email",
                      placeholder: "you@example.com",
                      icon: "i-heroicons-envelope",
                      disabled: unref(loading)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormGroup, {
                  label: "Password",
                  required: "",
                  help: "At least 6 characters"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(password),
                      "onUpdate:modelValue": ($event) => isRef(password) ? password.value = $event : null,
                      type: "password",
                      placeholder: "••••••••",
                      icon: "i-heroicons-lock-closed",
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
                    createTextVNode(" Create Account ")
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"]),
                createVNode("div", { class: "text-center text-xs text-gray-500 pt-2" }, [
                  createTextVNode(" Already have an account? "),
                  createVNode(_component_NuxtLink, {
                    to: "/login",
                    class: "text-primary-600 dark:text-primary-400 font-semibold hover:underline"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Sign In ")
                    ]),
                    _: 1
                  })
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=register-7TzelWwE.js.map

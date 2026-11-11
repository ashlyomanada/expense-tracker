import { f as useSupabaseClient, b as useHousehold, c as useToast, d as __nuxt_component_0, e as __nuxt_component_1, g as __nuxt_component_3, n as navigateTo } from "../server.mjs";
import { _ as __nuxt_component_2 } from "./Card-BiaC1RCe.js";
import { _ as __nuxt_component_2$1 } from "./Badge-BM4yH9XJ.js";
import { _ as __nuxt_component_4 } from "./FormGroup-COcnPxKZ.js";
import { _ as __nuxt_component_2$2 } from "./Input-BTTc9Q3-.js";
import { defineComponent, ref, watch, computed, mergeProps, withCtx, createTextVNode, unref, isRef, createVNode, openBlock, createBlock, toDisplayString, withModifiers, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import "/Users/ccci/Expense Tracker/node_modules/hookable/dist/index.mjs";
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
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    const supabase = useSupabaseClient();
    const {
      household,
      profile,
      members,
      renameHousehold,
      updateProfileName
    } = useHousehold();
    const toast = useToast();
    const editingHouseholdName = ref(false);
    const newHouseholdName = ref("");
    const savingHouseholdName = ref(false);
    const editingProfileName = ref(false);
    const newProfileName = ref("");
    const savingProfileName = ref(false);
    const copied = ref(false);
    watch(household, (h) => {
      if (h && !editingHouseholdName.value) {
        newHouseholdName.value = h.name;
      }
    });
    watch(profile, (p) => {
      if (p && !editingProfileName.value) {
        newProfileName.value = p.display_name;
      }
    });
    const isOwner = computed(() => {
      return household.value && profile.value && household.value.owner_id === profile.value.id;
    });
    const copyInviteCode = async () => {
      if (!household.value?.invite_code) return;
      try {
        await (void 0).clipboard.writeText(household.value.invite_code);
        copied.value = true;
        toast.add({
          title: "Copied!",
          description: `Invite code ${household.value.invite_code} copied to clipboard.`,
          color: "green"
        });
        setTimeout(() => {
          copied.value = false;
        }, 2e3);
      } catch (err) {
        toast.add({
          title: "Copy failed",
          description: "Could not copy to clipboard.",
          color: "red"
        });
      }
    };
    const handleSaveHouseholdName = async () => {
      if (!newHouseholdName.value.trim() || !household.value) return;
      savingHouseholdName.value = true;
      try {
        await renameHousehold(newHouseholdName.value.trim());
        editingHouseholdName.value = false;
        toast.add({
          title: "Updated",
          description: "Household name updated successfully.",
          color: "green"
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to update household name";
        toast.add({
          title: "Error",
          description: msg,
          color: "red"
        });
      } finally {
        savingHouseholdName.value = false;
      }
    };
    const handleSaveProfileName = async () => {
      if (!newProfileName.value.trim()) return;
      savingProfileName.value = true;
      try {
        await updateProfileName(newProfileName.value.trim());
        editingProfileName.value = false;
        toast.add({
          title: "Updated",
          description: "Your display name has been updated.",
          color: "green"
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to update display name";
        toast.add({
          title: "Error",
          description: msg,
          color: "red"
        });
      } finally {
        savingProfileName.value = false;
      }
    };
    const handleLogout = async () => {
      await supabase.auth.signOut();
      toast.add({
        title: "Signed out",
        description: "You have been signed out."
      });
      await navigateTo("/login");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_0;
      const _component_UCard = __nuxt_component_2;
      const _component_UIcon = __nuxt_component_1;
      const _component_UBadge = __nuxt_component_2$1;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_UInput = __nuxt_component_2$2;
      const _component_UAvatar = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 max-w-xl mx-auto" }, _attrs))}><div class="flex items-center justify-between"><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "red",
        variant: "ghost",
        icon: "i-heroicons-arrow-right-on-rectangle",
        size: "sm",
        onClick: handleLogout
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Sign Out `);
          } else {
            return [
              createTextVNode(" Sign Out ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between"${_scopeId}><div class="flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-user-circle",
              class: "w-5 h-5 text-primary-500"
            }, null, _parent2, _scopeId));
            _push2(`<h2 class="font-semibold text-gray-900 dark:text-white"${_scopeId}>Your Profile</h2></div>`);
            if (!unref(editingProfileName)) {
              _push2(ssrRenderComponent(_component_UButton, {
                variant: "ghost",
                color: "gray",
                size: "xs",
                icon: "i-heroicons-pencil",
                onClick: ($event) => editingProfileName.value = true
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Edit `);
                  } else {
                    return [
                      createTextVNode(" Edit ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("div", { class: "flex items-center gap-2" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-user-circle",
                    class: "w-5 h-5 text-primary-500"
                  }),
                  createVNode("h2", { class: "font-semibold text-gray-900 dark:text-white" }, "Your Profile")
                ]),
                !unref(editingProfileName) ? (openBlock(), createBlock(_component_UButton, {
                  key: 0,
                  variant: "ghost",
                  color: "gray",
                  size: "xs",
                  icon: "i-heroicons-pencil",
                  onClick: ($event) => editingProfileName.value = true
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Edit ")
                  ]),
                  _: 1
                }, 8, ["onClick"])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!unref(editingProfileName)) {
              _push2(`<div class="flex items-center justify-between py-1"${_scopeId}><div${_scopeId}><p class="text-xs text-gray-500"${_scopeId}>Display Name</p><p class="font-medium text-base text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(profile)?.display_name)}</p></div>`);
              _push2(ssrRenderComponent(_component_UBadge, {
                color: "gray",
                variant: "subtle"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Member`);
                  } else {
                    return [
                      createTextVNode("Member")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<form class="space-y-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UFormGroup, {
                label: "Display Name",
                required: ""
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UInput, {
                      modelValue: unref(newProfileName),
                      "onUpdate:modelValue": ($event) => isRef(newProfileName) ? newProfileName.value = $event : null,
                      type: "text",
                      autofocus: "",
                      disabled: unref(savingProfileName)
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UInput, {
                        modelValue: unref(newProfileName),
                        "onUpdate:modelValue": ($event) => isRef(newProfileName) ? newProfileName.value = $event : null,
                        type: "text",
                        autofocus: "",
                        disabled: unref(savingProfileName)
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<div class="flex gap-2 justify-end"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UButton, {
                type: "button",
                variant: "ghost",
                color: "gray",
                size: "sm",
                disabled: unref(savingProfileName),
                onClick: ($event) => editingProfileName.value = false
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Cancel `);
                  } else {
                    return [
                      createTextVNode(" Cancel ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UButton, {
                type: "submit",
                color: "primary",
                size: "sm",
                loading: unref(savingProfileName),
                disabled: unref(savingProfileName) || !unref(newProfileName).trim()
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Save `);
                  } else {
                    return [
                      createTextVNode(" Save ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></form>`);
            }
          } else {
            return [
              !unref(editingProfileName) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "flex items-center justify-between py-1"
              }, [
                createVNode("div", null, [
                  createVNode("p", { class: "text-xs text-gray-500" }, "Display Name"),
                  createVNode("p", { class: "font-medium text-base text-gray-900 dark:text-white" }, toDisplayString(unref(profile)?.display_name), 1)
                ]),
                createVNode(_component_UBadge, {
                  color: "gray",
                  variant: "subtle"
                }, {
                  default: withCtx(() => [
                    createTextVNode("Member")
                  ]),
                  _: 1
                })
              ])) : (openBlock(), createBlock("form", {
                key: 1,
                onSubmit: withModifiers(handleSaveProfileName, ["prevent"]),
                class: "space-y-3"
              }, [
                createVNode(_component_UFormGroup, {
                  label: "Display Name",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(newProfileName),
                      "onUpdate:modelValue": ($event) => isRef(newProfileName) ? newProfileName.value = $event : null,
                      type: "text",
                      autofocus: "",
                      disabled: unref(savingProfileName)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ]),
                  _: 1
                }),
                createVNode("div", { class: "flex gap-2 justify-end" }, [
                  createVNode(_component_UButton, {
                    type: "button",
                    variant: "ghost",
                    color: "gray",
                    size: "sm",
                    disabled: unref(savingProfileName),
                    onClick: ($event) => editingProfileName.value = false
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Cancel ")
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  createVNode(_component_UButton, {
                    type: "submit",
                    color: "primary",
                    size: "sm",
                    loading: unref(savingProfileName),
                    disabled: unref(savingProfileName) || !unref(newProfileName).trim()
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Save ")
                    ]),
                    _: 1
                  }, 8, ["loading", "disabled"])
                ])
              ], 32))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between"${_scopeId}><div class="flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-home",
              class: "w-5 h-5 text-primary-500"
            }, null, _parent2, _scopeId));
            _push2(`<h2 class="font-semibold text-gray-900 dark:text-white"${_scopeId}>Household Details</h2></div>`);
            if (unref(isOwner) && !unref(editingHouseholdName)) {
              _push2(ssrRenderComponent(_component_UButton, {
                variant: "ghost",
                color: "gray",
                size: "xs",
                icon: "i-heroicons-pencil",
                onClick: ($event) => editingHouseholdName.value = true
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Rename `);
                  } else {
                    return [
                      createTextVNode(" Rename ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("div", { class: "flex items-center gap-2" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-home",
                    class: "w-5 h-5 text-primary-500"
                  }),
                  createVNode("h2", { class: "font-semibold text-gray-900 dark:text-white" }, "Household Details")
                ]),
                unref(isOwner) && !unref(editingHouseholdName) ? (openBlock(), createBlock(_component_UButton, {
                  key: 0,
                  variant: "ghost",
                  color: "gray",
                  size: "xs",
                  icon: "i-heroicons-pencil",
                  onClick: ($event) => editingHouseholdName.value = true
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Rename ")
                  ]),
                  _: 1
                }, 8, ["onClick"])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            if (!unref(editingHouseholdName)) {
              _push2(`<div class="py-1"${_scopeId}><p class="text-xs text-gray-500"${_scopeId}>Household Name</p><div class="flex items-center gap-2"${_scopeId}><p class="font-medium text-base text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(household)?.name)}</p>`);
              if (unref(isOwner)) {
                _push2(ssrRenderComponent(_component_UBadge, {
                  color: "primary",
                  variant: "subtle",
                  size: "xs"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Owner`);
                    } else {
                      return [
                        createTextVNode("Owner")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            } else {
              _push2(`<form class="space-y-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UFormGroup, {
                label: "Household Name",
                required: ""
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UInput, {
                      modelValue: unref(newHouseholdName),
                      "onUpdate:modelValue": ($event) => isRef(newHouseholdName) ? newHouseholdName.value = $event : null,
                      type: "text",
                      autofocus: "",
                      disabled: unref(savingHouseholdName)
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UInput, {
                        modelValue: unref(newHouseholdName),
                        "onUpdate:modelValue": ($event) => isRef(newHouseholdName) ? newHouseholdName.value = $event : null,
                        type: "text",
                        autofocus: "",
                        disabled: unref(savingHouseholdName)
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<div class="flex gap-2 justify-end"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UButton, {
                type: "button",
                variant: "ghost",
                color: "gray",
                size: "sm",
                disabled: unref(savingHouseholdName),
                onClick: ($event) => editingHouseholdName.value = false
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Cancel `);
                  } else {
                    return [
                      createTextVNode(" Cancel ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UButton, {
                type: "submit",
                color: "primary",
                size: "sm",
                loading: unref(savingHouseholdName),
                disabled: unref(savingHouseholdName) || !unref(newHouseholdName).trim()
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Save `);
                  } else {
                    return [
                      createTextVNode(" Save ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></form>`);
            }
            _push2(`<div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-800"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><p class="text-xs font-medium text-gray-500 dark:text-gray-400"${_scopeId}>Invite Code</p><p class="text-2xl font-mono font-bold tracking-widest text-primary-600 dark:text-primary-400 mt-0.5"${_scopeId}>${ssrInterpolate(unref(household)?.invite_code || "------")}</p><p class="text-xs text-gray-400 mt-1"${_scopeId}>Share this code with housemates to let them join</p></div>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              variant: "soft",
              icon: unref(copied) ? "i-heroicons-check" : "i-heroicons-clipboard-document",
              size: "md",
              onClick: copyInviteCode
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(copied) ? "Copied" : "Copy")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(copied) ? "Copied" : "Copy"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div><div${_scopeId}><p class="text-xs text-gray-500"${_scopeId}>Default Currency</p><p class="font-medium text-gray-900 dark:text-white mt-0.5"${_scopeId}>${ssrInterpolate(unref(household)?.currency || "PHP")}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                !unref(editingHouseholdName) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "py-1"
                }, [
                  createVNode("p", { class: "text-xs text-gray-500" }, "Household Name"),
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    createVNode("p", { class: "font-medium text-base text-gray-900 dark:text-white" }, toDisplayString(unref(household)?.name), 1),
                    unref(isOwner) ? (openBlock(), createBlock(_component_UBadge, {
                      key: 0,
                      color: "primary",
                      variant: "subtle",
                      size: "xs"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Owner")
                      ]),
                      _: 1
                    })) : createCommentVNode("", true)
                  ])
                ])) : (openBlock(), createBlock("form", {
                  key: 1,
                  onSubmit: withModifiers(handleSaveHouseholdName, ["prevent"]),
                  class: "space-y-3"
                }, [
                  createVNode(_component_UFormGroup, {
                    label: "Household Name",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(newHouseholdName),
                        "onUpdate:modelValue": ($event) => isRef(newHouseholdName) ? newHouseholdName.value = $event : null,
                        type: "text",
                        autofocus: "",
                        disabled: unref(savingHouseholdName)
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "flex gap-2 justify-end" }, [
                    createVNode(_component_UButton, {
                      type: "button",
                      variant: "ghost",
                      color: "gray",
                      size: "sm",
                      disabled: unref(savingHouseholdName),
                      onClick: ($event) => editingHouseholdName.value = false
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Cancel ")
                      ]),
                      _: 1
                    }, 8, ["disabled", "onClick"]),
                    createVNode(_component_UButton, {
                      type: "submit",
                      color: "primary",
                      size: "sm",
                      loading: unref(savingHouseholdName),
                      disabled: unref(savingHouseholdName) || !unref(newHouseholdName).trim()
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Save ")
                      ]),
                      _: 1
                    }, 8, ["loading", "disabled"])
                  ])
                ], 32)),
                createVNode("div", { class: "bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-800" }, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("div", null, [
                      createVNode("p", { class: "text-xs font-medium text-gray-500 dark:text-gray-400" }, "Invite Code"),
                      createVNode("p", { class: "text-2xl font-mono font-bold tracking-widest text-primary-600 dark:text-primary-400 mt-0.5" }, toDisplayString(unref(household)?.invite_code || "------"), 1),
                      createVNode("p", { class: "text-xs text-gray-400 mt-1" }, "Share this code with housemates to let them join")
                    ]),
                    createVNode(_component_UButton, {
                      color: "primary",
                      variant: "soft",
                      icon: unref(copied) ? "i-heroicons-check" : "i-heroicons-clipboard-document",
                      size: "md",
                      onClick: copyInviteCode
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(copied) ? "Copied" : "Copy"), 1)
                      ]),
                      _: 1
                    }, 8, ["icon"])
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("p", { class: "text-xs text-gray-500" }, "Default Currency"),
                  createVNode("p", { class: "font-medium text-gray-900 dark:text-white mt-0.5" }, toDisplayString(unref(household)?.currency || "PHP"), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between"${_scopeId}><div class="flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-users",
              class: "w-5 h-5 text-primary-500"
            }, null, _parent2, _scopeId));
            _push2(`<h2 class="font-semibold text-gray-900 dark:text-white"${_scopeId}>Household Members</h2></div>`);
            _push2(ssrRenderComponent(_component_UBadge, {
              color: unref(members).length >= 5 ? "amber" : "green",
              variant: "subtle"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(members).length)} / 5 Members `);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(members).length) + " / 5 Members ", 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("div", { class: "flex items-center gap-2" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-users",
                    class: "w-5 h-5 text-primary-500"
                  }),
                  createVNode("h2", { class: "font-semibold text-gray-900 dark:text-white" }, "Household Members")
                ]),
                createVNode(_component_UBadge, {
                  color: unref(members).length >= 5 ? "amber" : "green",
                  variant: "subtle"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(members).length) + " / 5 Members ", 1)
                  ]),
                  _: 1
                }, 8, ["color"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<ul class="divide-y divide-gray-100 dark:divide-gray-800"${_scopeId}><!--[-->`);
            ssrRenderList(unref(members), (member) => {
              _push2(`<li class="py-3 flex items-center justify-between"${_scopeId}><div class="flex items-center gap-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UAvatar, {
                alt: member.display_name,
                size: "sm",
                class: "bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-bold"
              }, null, _parent2, _scopeId));
              _push2(`<div${_scopeId}><p class="font-medium text-sm text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(member.display_name)} `);
              if (member.id === unref(profile)?.id) {
                _push2(`<span class="text-xs text-primary-600 dark:text-primary-400 font-normal"${_scopeId}> (You) </span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</p></div></div><div class="flex items-center gap-2"${_scopeId}>`);
              if (member.id === unref(household)?.owner_id) {
                _push2(ssrRenderComponent(_component_UBadge, {
                  color: "primary",
                  variant: "subtle",
                  size: "xs"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Owner `);
                    } else {
                      return [
                        createTextVNode(" Owner ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></li>`);
            });
            _push2(`<!--]--></ul>`);
          } else {
            return [
              createVNode("ul", { class: "divide-y divide-gray-100 dark:divide-gray-800" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(members), (member) => {
                  return openBlock(), createBlock("li", {
                    key: member.id,
                    class: "py-3 flex items-center justify-between"
                  }, [
                    createVNode("div", { class: "flex items-center gap-3" }, [
                      createVNode(_component_UAvatar, {
                        alt: member.display_name,
                        size: "sm",
                        class: "bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-bold"
                      }, null, 8, ["alt"]),
                      createVNode("div", null, [
                        createVNode("p", { class: "font-medium text-sm text-gray-900 dark:text-white" }, [
                          createTextVNode(toDisplayString(member.display_name) + " ", 1),
                          member.id === unref(profile)?.id ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "text-xs text-primary-600 dark:text-primary-400 font-normal"
                          }, " (You) ")) : createCommentVNode("", true)
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      member.id === unref(household)?.owner_id ? (openBlock(), createBlock(_component_UBadge, {
                        key: 0,
                        color: "primary",
                        variant: "subtle",
                        size: "xs"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Owner ")
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ])
                  ]);
                }), 128))
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=settings-Bci7dn82.js.map

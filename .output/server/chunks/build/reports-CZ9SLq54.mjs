import { b as useHousehold, c as useToast, d as __nuxt_component_0$1, e as __nuxt_component_1$1 } from './server.mjs';
import { _ as __nuxt_component_1 } from './Select-C-nPKItW.mjs';
import { _ as __nuxt_component_3 } from './Skeleton-Tz2BgSk_.mjs';
import { _ as __nuxt_component_2 } from './Card-BiaC1RCe.mjs';
import { defineComponent, ref, watch, computed, mergeProps, unref, withCtx, createTextVNode, isRef, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { f as formatMoney } from './money-z3Rw8dBE.mjs';
import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { u as useExpenses } from './useExpenses-BKVyoStV.mjs';
import { u as useBills } from './useBills-uyxpq_W9.mjs';
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

function downloadReportPdf(data) {
  var _a;
  const anyFonts = pdfFonts;
  if (anyFonts && ((_a = anyFonts.pdfMake) == null ? void 0 : _a.vfs)) {
    pdfMake.vfs = anyFonts.pdfMake.vfs;
  } else {
    pdfMake.vfs = pdfFonts;
  }
  const curr = data.currency || "PHP";
  const memberRows = data.members.map((m) => [
    { text: m.displayName, bold: true },
    { text: formatMoney(m.paid, curr), alignment: "right" },
    { text: formatMoney(m.owed, curr), alignment: "right" },
    {
      text: `${m.net > 0 ? "+" : ""}${formatMoney(m.net, curr)}`,
      alignment: "right",
      bold: true,
      color: m.net > 5e-3 ? "#16a34a" : m.net < -5e-3 ? "#dc2626" : "#4b5563"
    }
  ]);
  const categoryRows = data.categories.map((c) => [
    { text: c.categoryName },
    { text: formatMoney(c.amount, curr), alignment: "right", bold: true }
  ]);
  const billRows = data.bills.length ? data.bills.map((b) => [
    { text: b.name },
    { text: formatMoney(b.amount, curr), alignment: "right" },
    { text: b.dueDate },
    {
      text: b.status.toUpperCase(),
      bold: true,
      color: b.status === "paid" ? "#16a34a" : "#d97706"
    },
    { text: b.paidBy || "\u2014" }
  ]) : [[
    { text: "No bills for this month", colSpan: 5, italics: true },
    { text: "" },
    { text: "" },
    { text: "" },
    { text: "" }
  ]];
  const expenseRows = data.expenses.length ? data.expenses.map((e) => [
    { text: e.storeName, bold: true },
    { text: e.purchaseDate },
    { text: e.paidBy },
    { text: String(e.itemsCount), alignment: "center" },
    { text: formatMoney(e.totalAmount, curr), alignment: "right" }
  ]) : [[
    { text: "No expenses for this month", colSpan: 5, italics: true },
    { text: "" },
    { text: "" },
    { text: "" },
    { text: "" }
  ]];
  const settlementRows = data.settlementSuggestions.length ? data.settlementSuggestions.map((s) => [
    { text: `${s.from} pays ${s.to}`, bold: true },
    { text: formatMoney(s.amount, curr), alignment: "right", bold: true, color: "#0284c7" }
  ]) : [[
    { text: "No transfers needed. All balances settled!", colSpan: 2, italics: true },
    { text: "" }
  ]];
  const docDefinition = {
    pageSize: "A4",
    pageMargins: [36, 40, 36, 40],
    content: [
      // Header
      {
        text: "HOUSESPLIT EXPENSE REPORT",
        style: "docHeader"
      },
      {
        text: `${data.householdName} \u2022 ${data.monthLabel}`,
        style: "docSubheader"
      },
      {
        canvas: [{ type: "line", x1: 0, y1: 5, x2: 520, y2: 5, lineWidth: 1.5, lineColor: "#0284c7" }],
        margin: [0, 0, 0, 15]
      },
      // Section 1: Executive Summary
      { text: "1. Monthly Summary", style: "sectionHeader" },
      {
        table: {
          widths: ["*", "*", "*"],
          body: [
            [
              { text: "Total Spent", style: "tableHeader" },
              { text: "Expenses", style: "tableHeader" },
              { text: "Bills", style: "tableHeader" }
            ],
            [
              { text: formatMoney(data.totalSpent, curr), style: "totalValue" },
              { text: formatMoney(data.totalExpenses, curr), style: "metricValue" },
              { text: formatMoney(data.totalBills, curr), style: "metricValue" }
            ]
          ]
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 15]
      },
      // Section 2: Member Balances
      { text: "2. Member Spending & Balances", style: "sectionHeader" },
      {
        table: {
          widths: ["*", 100, 100, 100],
          body: [
            [
              { text: "Member", style: "tableHeader" },
              { text: "Paid", style: "tableHeader", alignment: "right" },
              { text: "Share Owed", style: "tableHeader", alignment: "right" },
              { text: "Net Balance", style: "tableHeader", alignment: "right" }
            ],
            ...memberRows
          ]
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 15]
      },
      // Section 3: Category Breakdown
      { text: "3. Category Breakdown", style: "sectionHeader" },
      {
        table: {
          widths: ["*", 120],
          body: [
            [
              { text: "Category", style: "tableHeader" },
              { text: "Amount", style: "tableHeader", alignment: "right" }
            ],
            ...categoryRows
          ]
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 15]
      },
      // Section 4: Bills
      { text: "4. Monthly Bills", style: "sectionHeader" },
      {
        table: {
          widths: ["*", 80, 80, 70, 90],
          body: [
            [
              { text: "Bill Name", style: "tableHeader" },
              { text: "Amount", style: "tableHeader", alignment: "right" },
              { text: "Due Date", style: "tableHeader" },
              { text: "Status", style: "tableHeader" },
              { text: "Paid By", style: "tableHeader" }
            ],
            ...billRows
          ]
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 15]
      },
      // Section 5: Itemized Expenses
      { text: "5. Itemized Expenses", style: "sectionHeader" },
      {
        table: {
          widths: ["*", 80, 90, 50, 80],
          body: [
            [
              { text: "Store / Merchant", style: "tableHeader" },
              { text: "Date", style: "tableHeader" },
              { text: "Paid By", style: "tableHeader" },
              { text: "Items", style: "tableHeader", alignment: "center" },
              { text: "Total", style: "tableHeader", alignment: "right" }
            ],
            ...expenseRows
          ]
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 15]
      },
      // Section 6: Settlement Suggestions
      { text: "6. Settlement Suggestions (Who Pays Whom)", style: "sectionHeader" },
      {
        table: {
          widths: ["*", 120],
          body: [
            [
              { text: "Payment Transfer", style: "tableHeader" },
              { text: "Amount", style: "tableHeader", alignment: "right" }
            ],
            ...settlementRows
          ]
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 10]
      }
    ],
    styles: {
      docHeader: {
        fontSize: 18,
        bold: true,
        color: "#0f172a"
      },
      docSubheader: {
        fontSize: 11,
        color: "#64748b",
        margin: [0, 2, 0, 0]
      },
      sectionHeader: {
        fontSize: 12,
        bold: true,
        color: "#1e293b",
        margin: [0, 10, 0, 6]
      },
      tableHeader: {
        bold: true,
        fontSize: 9,
        color: "#475569",
        fillColor: "#f8fafc"
      },
      totalValue: {
        fontSize: 14,
        bold: true,
        color: "#0284c7",
        margin: [0, 4, 0, 4]
      },
      metricValue: {
        fontSize: 12,
        bold: true,
        color: "#334155",
        margin: [0, 4, 0, 4]
      }
    },
    defaultStyle: {
      fontSize: 9,
      color: "#1e293b",
      lineHeight: 1.2
    }
  };
  const filename = `HouseSplit-Report-${data.householdName.replace(/\s+/g, "_")}-${data.monthLabel.replace(/\s+/g, "_")}.pdf`;
  pdfMake.createPdf(docDefinition).download(filename);
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "reports",
  __ssrInlineRender: true,
  setup(__props) {
    const { household, members, fetchHousehold } = useHousehold();
    const { expenses, fetchExpenses } = useExpenses();
    const { bills, fetchBills } = useBills();
    const { debts, fetchDebts } = useBalances();
    const toast = useToast();
    const currentMonthStr = () => {
      const now = /* @__PURE__ */ new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    };
    const selectedMonth = ref(currentMonthStr());
    const loading = ref(true);
    const generatingPdf = ref(false);
    const loadReportData = async () => {
      loading.value = true;
      await fetchHousehold();
      await Promise.all([
        fetchExpenses(selectedMonth.value),
        fetchBills(selectedMonth.value),
        fetchDebts()
      ]);
      loading.value = false;
    };
    watch(selectedMonth, () => {
      loadReportData();
    });
    const monthOptions = computed(() => {
      const list = [];
      const now = /* @__PURE__ */ new Date();
      for (let i = -11; i <= 2; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        list.push({ label, value: val });
      }
      return list;
    });
    const currentMonthLabel = computed(() => {
      const [year, m] = selectedMonth.value.split("-").map(Number);
      const d = new Date(year, m - 1, 1);
      return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    });
    const totalExpenses = computed(() => {
      return expenses.value.reduce((sum, e) => sum + e.total_amount, 0);
    });
    const totalBills = computed(() => {
      return bills.value.reduce((sum, b) => sum + b.amount, 0);
    });
    const totalSpent = computed(() => {
      return Math.round((totalExpenses.value + totalBills.value) * 100) / 100;
    });
    const memberBreakdown = computed(() => {
      return members.value.map((m) => {
        const expPaid = expenses.value.filter((e) => e.paid_by === m.id).reduce((sum, e) => sum + e.total_amount, 0);
        const billPaid = bills.value.filter((b) => b.paid_by === m.id && b.status === "paid").reduce((sum, b) => sum + b.amount, 0);
        const totalPaid = Math.round((expPaid + billPaid) * 100) / 100;
        const expOwed = expenses.value.reduce((sum, e) => {
          const allShares = e.items.flatMap((it) => it.shares || []);
          const userShares = allShares.filter((s) => s.user_id === m.id);
          return sum + userShares.reduce((sSum, s) => sSum + s.share_amount, 0);
        }, 0);
        const billOwed = bills.value.filter((b) => b.status === "paid").reduce((sum, b) => {
          const userShare = b.shares.find((s) => s.user_id === m.id);
          return sum + (userShare ? userShare.share_amount : 0);
        }, 0);
        const totalOwed = Math.round((expOwed + billOwed) * 100) / 100;
        const net = Math.round((totalPaid - totalOwed) * 100) / 100;
        return {
          id: m.id,
          displayName: m.display_name,
          paid: totalPaid,
          owed: totalOwed,
          net
        };
      });
    });
    const categoryBreakdown = computed(() => {
      var _a, _b;
      const catMap = /* @__PURE__ */ new Map();
      for (const exp of expenses.value) {
        for (const item of exp.items) {
          const cName = ((_a = item.category) == null ? void 0 : _a.name) || "Other";
          catMap.set(cName, (catMap.get(cName) || 0) + item.total_price);
        }
      }
      for (const bill of bills.value) {
        const cName = ((_b = bill.category) == null ? void 0 : _b.name) || "Utilities";
        catMap.set(cName, (catMap.get(cName) || 0) + bill.amount);
      }
      return Array.from(catMap.entries()).map(([categoryName, amount]) => ({
        categoryName,
        amount: Math.round(amount * 100) / 100
      })).sort((a, b) => b.amount - a.amount);
    });
    const settlementSuggestions = computed(() => {
      return debts.value.map((d) => ({
        from: d.debtor_name,
        to: d.creditor_name,
        amount: d.amount
      }));
    });
    const handleDownloadPdf = () => {
      var _a, _b;
      generatingPdf.value = true;
      try {
        const data = {
          householdName: ((_a = household.value) == null ? void 0 : _a.name) || "Household",
          monthLabel: currentMonthLabel.value,
          currency: ((_b = household.value) == null ? void 0 : _b.currency) || "PHP",
          totalExpenses: totalExpenses.value,
          totalBills: totalBills.value,
          totalSpent: totalSpent.value,
          members: memberBreakdown.value,
          categories: categoryBreakdown.value,
          bills: bills.value.map((b) => {
            var _a2;
            return {
              name: b.name,
              amount: b.amount,
              status: b.status,
              dueDate: b.due_date,
              paidBy: (_a2 = b.payer) == null ? void 0 : _a2.display_name
            };
          }),
          expenses: expenses.value.map((e) => {
            var _a2;
            return {
              storeName: e.store_name,
              purchaseDate: e.purchase_date,
              totalAmount: e.total_amount,
              paidBy: ((_a2 = e.payer) == null ? void 0 : _a2.display_name) || "Member",
              itemsCount: e.items.length
            };
          }),
          settlementSuggestions: settlementSuggestions.value
        };
        downloadReportPdf(data);
        toast.add({
          title: "PDF Generated",
          description: "Your report PDF is downloading.",
          color: "green"
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to generate PDF";
        toast.add({ title: "Error", description: msg, color: "red" });
      } finally {
        generatingPdf.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_UButton = __nuxt_component_0$1;
      const _component_USelect = __nuxt_component_1;
      const _component_USkeleton = __nuxt_component_3;
      const _component_UCard = __nuxt_component_2;
      const _component_UIcon = __nuxt_component_1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 max-w-2xl mx-auto pb-12" }, _attrs))}><div class="flex items-center justify-between flex-wrap gap-2"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Monthly Report</h1><p class="text-xs text-gray-500 mt-0.5">${ssrInterpolate((_a = unref(household)) == null ? void 0 : _a.name)} \u2022 ${ssrInterpolate(unref(currentMonthLabel))}</p></div><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "primary",
        icon: "i-heroicons-arrow-down-tray",
        size: "sm",
        loading: unref(generatingPdf),
        disabled: unref(generatingPdf) || unref(loading),
        onClick: handleDownloadPdf
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Download PDF `);
          } else {
            return [
              createTextVNode(" Download PDF ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="w-full sm:w-64">`);
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: unref(selectedMonth),
        "onUpdate:modelValue": ($event) => isRef(selectedMonth) ? selectedMonth.value = $event : null,
        options: unref(monthOptions),
        "option-attribute": "label",
        "value-attribute": "value",
        icon: "i-heroicons-calendar"
      }, null, _parent));
      _push(`</div>`);
      if (unref(loading)) {
        _push(`<div class="space-y-4">`);
        _push(ssrRenderComponent(_component_USkeleton, { class: "h-28 w-full rounded-xl" }, null, _parent));
        _push(ssrRenderComponent(_component_USkeleton, { class: "h-40 w-full rounded-xl" }, null, _parent));
        _push(ssrRenderComponent(_component_USkeleton, { class: "h-40 w-full rounded-xl" }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="space-y-6"><div class="grid grid-cols-3 gap-3"><div class="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs"><p class="text-xs text-gray-500 font-medium">Total Spent</p><p class="text-xl font-bold font-mono text-primary-600 dark:text-primary-400 mt-1">${ssrInterpolate(unref(formatMoney)(unref(totalSpent), (_b = unref(household)) == null ? void 0 : _b.currency))}</p></div><div class="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs"><p class="text-xs text-gray-500 font-medium">Expenses</p><p class="text-lg font-bold font-mono text-gray-900 dark:text-white mt-1">${ssrInterpolate(unref(formatMoney)(unref(totalExpenses), (_c = unref(household)) == null ? void 0 : _c.currency))}</p></div><div class="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs"><p class="text-xs text-gray-500 font-medium">Monthly Bills</p><p class="text-lg font-bold font-mono text-gray-900 dark:text-white mt-1">${ssrInterpolate(unref(formatMoney)(unref(totalBills), (_d = unref(household)) == null ? void 0 : _d.currency))}</p></div></div>`);
        _push(ssrRenderComponent(_component_UCard, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h2 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-users",
                class: "w-4 h-4 text-primary-500"
              }, null, _parent2, _scopeId));
              _push2(`<span${_scopeId}>2. Member Contributions &amp; Net</span></h2>`);
            } else {
              return [
                createVNode("h2", { class: "font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-users",
                    class: "w-4 h-4 text-primary-500"
                  }),
                  createVNode("span", null, "2. Member Contributions & Net")
                ])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="overflow-x-auto"${_scopeId}><table class="w-full text-left text-xs"${_scopeId}><thead${_scopeId}><tr class="border-b border-gray-100 dark:border-gray-800 text-gray-400"${_scopeId}><th class="py-2"${_scopeId}>Member</th><th class="py-2 text-right"${_scopeId}>Paid</th><th class="py-2 text-right"${_scopeId}>Share Owed</th><th class="py-2 text-right"${_scopeId}>Net</th></tr></thead><tbody class="divide-y divide-gray-100 dark:divide-gray-800/60"${_scopeId}><!--[-->`);
              ssrRenderList(unref(memberBreakdown), (m) => {
                var _a2, _b2, _c2;
                _push2(`<tr${_scopeId}><td class="py-2.5 font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(m.displayName)}</td><td class="py-2.5 text-right font-mono"${_scopeId}>${ssrInterpolate(unref(formatMoney)(m.paid, (_a2 = unref(household)) == null ? void 0 : _a2.currency))}</td><td class="py-2.5 text-right font-mono"${_scopeId}>${ssrInterpolate(unref(formatMoney)(m.owed, (_b2 = unref(household)) == null ? void 0 : _b2.currency))}</td><td class="${ssrRenderClass([m.net > 5e-3 ? "text-green-600" : m.net < -5e-3 ? "text-red-600" : "text-gray-400", "py-2.5 text-right font-mono font-bold"])}"${_scopeId}>${ssrInterpolate(m.net > 5e-3 ? "+" : "")}${ssrInterpolate(unref(formatMoney)(m.net, (_c2 = unref(household)) == null ? void 0 : _c2.currency))}</td></tr>`);
              });
              _push2(`<!--]--></tbody></table></div>`);
            } else {
              return [
                createVNode("div", { class: "overflow-x-auto" }, [
                  createVNode("table", { class: "w-full text-left text-xs" }, [
                    createVNode("thead", null, [
                      createVNode("tr", { class: "border-b border-gray-100 dark:border-gray-800 text-gray-400" }, [
                        createVNode("th", { class: "py-2" }, "Member"),
                        createVNode("th", { class: "py-2 text-right" }, "Paid"),
                        createVNode("th", { class: "py-2 text-right" }, "Share Owed"),
                        createVNode("th", { class: "py-2 text-right" }, "Net")
                      ])
                    ]),
                    createVNode("tbody", { class: "divide-y divide-gray-100 dark:divide-gray-800/60" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(memberBreakdown), (m) => {
                        var _a2, _b2, _c2;
                        return openBlock(), createBlock("tr", {
                          key: m.id
                        }, [
                          createVNode("td", { class: "py-2.5 font-medium text-gray-900 dark:text-white" }, toDisplayString(m.displayName), 1),
                          createVNode("td", { class: "py-2.5 text-right font-mono" }, toDisplayString(unref(formatMoney)(m.paid, (_a2 = unref(household)) == null ? void 0 : _a2.currency)), 1),
                          createVNode("td", { class: "py-2.5 text-right font-mono" }, toDisplayString(unref(formatMoney)(m.owed, (_b2 = unref(household)) == null ? void 0 : _b2.currency)), 1),
                          createVNode("td", {
                            class: ["py-2.5 text-right font-mono font-bold", m.net > 5e-3 ? "text-green-600" : m.net < -5e-3 ? "text-red-600" : "text-gray-400"]
                          }, toDisplayString(m.net > 5e-3 ? "+" : "") + toDisplayString(unref(formatMoney)(m.net, (_c2 = unref(household)) == null ? void 0 : _c2.currency)), 3)
                        ]);
                      }), 128))
                    ])
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
              _push2(`<h2 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-tag",
                class: "w-4 h-4 text-primary-500"
              }, null, _parent2, _scopeId));
              _push2(`<span${_scopeId}>3. Spending by Category</span></h2>`);
            } else {
              return [
                createVNode("h2", { class: "font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-tag",
                    class: "w-4 h-4 text-primary-500"
                  }),
                  createVNode("span", null, "3. Spending by Category")
                ])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(categoryBreakdown).length === 0) {
                _push2(`<div class="text-xs text-gray-500 text-center py-4"${_scopeId}> No recorded spending for this month. </div>`);
              } else {
                _push2(`<div class="space-y-2"${_scopeId}><!--[-->`);
                ssrRenderList(unref(categoryBreakdown), (cat) => {
                  var _a2;
                  _push2(`<div class="flex items-center justify-between text-xs py-1"${_scopeId}><span class="font-medium text-gray-700 dark:text-gray-300"${_scopeId}>${ssrInterpolate(cat.categoryName)}</span><span class="font-mono font-bold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(formatMoney)(cat.amount, (_a2 = unref(household)) == null ? void 0 : _a2.currency))}</span></div>`);
                });
                _push2(`<!--]--></div>`);
              }
            } else {
              return [
                unref(categoryBreakdown).length === 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-xs text-gray-500 text-center py-4"
                }, " No recorded spending for this month. ")) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "space-y-2"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(categoryBreakdown), (cat) => {
                    var _a2;
                    return openBlock(), createBlock("div", {
                      key: cat.categoryName,
                      class: "flex items-center justify-between text-xs py-1"
                    }, [
                      createVNode("span", { class: "font-medium text-gray-700 dark:text-gray-300" }, toDisplayString(cat.categoryName), 1),
                      createVNode("span", { class: "font-mono font-bold text-gray-900 dark:text-white" }, toDisplayString(unref(formatMoney)(cat.amount, (_a2 = unref(household)) == null ? void 0 : _a2.currency)), 1)
                    ]);
                  }), 128))
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UCard, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h2 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-calendar-days",
                class: "w-4 h-4 text-primary-500"
              }, null, _parent2, _scopeId));
              _push2(`<span${_scopeId}>4. Bills (${ssrInterpolate(unref(bills).length)})</span></h2>`);
            } else {
              return [
                createVNode("h2", { class: "font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-calendar-days",
                    class: "w-4 h-4 text-primary-500"
                  }),
                  createVNode("span", null, "4. Bills (" + toDisplayString(unref(bills).length) + ")", 1)
                ])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(bills).length === 0) {
                _push2(`<div class="text-xs text-gray-500 text-center py-4"${_scopeId}> No bills for this month. </div>`);
              } else {
                _push2(`<ul class="divide-y divide-gray-100 dark:divide-gray-800"${_scopeId}><!--[-->`);
                ssrRenderList(unref(bills), (b) => {
                  var _a2;
                  _push2(`<li class="py-2.5 flex items-center justify-between text-xs"${_scopeId}><div${_scopeId}><p class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(b.name)}</p><p class="text-[11px] text-gray-400"${_scopeId}> Due ${ssrInterpolate(b.due_date)} \u2022 <span class="${ssrRenderClass(b.status === "paid" ? "text-green-600 font-semibold" : "text-amber-600")}"${_scopeId}>${ssrInterpolate(b.status.toUpperCase())}</span>`);
                  if (b.payer) {
                    _push2(`<span${_scopeId}> by ${ssrInterpolate(b.payer.display_name)}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</p></div><div class="font-mono font-bold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(formatMoney)(b.amount, (_a2 = unref(household)) == null ? void 0 : _a2.currency))}</div></li>`);
                });
                _push2(`<!--]--></ul>`);
              }
            } else {
              return [
                unref(bills).length === 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-xs text-gray-500 text-center py-4"
                }, " No bills for this month. ")) : (openBlock(), createBlock("ul", {
                  key: 1,
                  class: "divide-y divide-gray-100 dark:divide-gray-800"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(bills), (b) => {
                    var _a2;
                    return openBlock(), createBlock("li", {
                      key: b.id,
                      class: "py-2.5 flex items-center justify-between text-xs"
                    }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(b.name), 1),
                        createVNode("p", { class: "text-[11px] text-gray-400" }, [
                          createTextVNode(" Due " + toDisplayString(b.due_date) + " \u2022 ", 1),
                          createVNode("span", {
                            class: b.status === "paid" ? "text-green-600 font-semibold" : "text-amber-600"
                          }, toDisplayString(b.status.toUpperCase()), 3),
                          b.payer ? (openBlock(), createBlock("span", { key: 0 }, " by " + toDisplayString(b.payer.display_name), 1)) : createCommentVNode("", true)
                        ])
                      ]),
                      createVNode("div", { class: "font-mono font-bold text-gray-900 dark:text-white" }, toDisplayString(unref(formatMoney)(b.amount, (_a2 = unref(household)) == null ? void 0 : _a2.currency)), 1)
                    ]);
                  }), 128))
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UCard, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h2 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-shopping-bag",
                class: "w-4 h-4 text-primary-500"
              }, null, _parent2, _scopeId));
              _push2(`<span${_scopeId}>5. Itemized Expenses (${ssrInterpolate(unref(expenses).length)})</span></h2>`);
            } else {
              return [
                createVNode("h2", { class: "font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-shopping-bag",
                    class: "w-4 h-4 text-primary-500"
                  }),
                  createVNode("span", null, "5. Itemized Expenses (" + toDisplayString(unref(expenses).length) + ")", 1)
                ])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(expenses).length === 0) {
                _push2(`<div class="text-xs text-gray-500 text-center py-4"${_scopeId}> No expenses recorded for this month. </div>`);
              } else {
                _push2(`<ul class="divide-y divide-gray-100 dark:divide-gray-800"${_scopeId}><!--[-->`);
                ssrRenderList(unref(expenses), (e) => {
                  var _a2, _b2;
                  _push2(`<li class="py-2.5 flex items-center justify-between text-xs"${_scopeId}><div${_scopeId}><p class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(e.store_name)}</p><p class="text-[11px] text-gray-400"${_scopeId}>${ssrInterpolate(e.purchase_date)} \u2022 Paid by ${ssrInterpolate((_a2 = e.payer) == null ? void 0 : _a2.display_name)} \u2022 ${ssrInterpolate(e.items.length)} items </p></div><div class="font-mono font-bold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(formatMoney)(e.total_amount, (_b2 = unref(household)) == null ? void 0 : _b2.currency))}</div></li>`);
                });
                _push2(`<!--]--></ul>`);
              }
            } else {
              return [
                unref(expenses).length === 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-xs text-gray-500 text-center py-4"
                }, " No expenses recorded for this month. ")) : (openBlock(), createBlock("ul", {
                  key: 1,
                  class: "divide-y divide-gray-100 dark:divide-gray-800"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(expenses), (e) => {
                    var _a2, _b2;
                    return openBlock(), createBlock("li", {
                      key: e.id,
                      class: "py-2.5 flex items-center justify-between text-xs"
                    }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(e.store_name), 1),
                        createVNode("p", { class: "text-[11px] text-gray-400" }, toDisplayString(e.purchase_date) + " \u2022 Paid by " + toDisplayString((_a2 = e.payer) == null ? void 0 : _a2.display_name) + " \u2022 " + toDisplayString(e.items.length) + " items ", 1)
                      ]),
                      createVNode("div", { class: "font-mono font-bold text-gray-900 dark:text-white" }, toDisplayString(unref(formatMoney)(e.total_amount, (_b2 = unref(household)) == null ? void 0 : _b2.currency)), 1)
                    ]);
                  }), 128))
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UCard, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h2 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-arrows-right-left",
                class: "w-4 h-4 text-primary-500"
              }, null, _parent2, _scopeId));
              _push2(`<span${_scopeId}>6. Settlement Suggestions</span></h2>`);
            } else {
              return [
                createVNode("h2", { class: "font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-arrows-right-left",
                    class: "w-4 h-4 text-primary-500"
                  }),
                  createVNode("span", null, "6. Settlement Suggestions")
                ])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(settlementSuggestions).length === 0) {
                _push2(`<div class="text-xs text-green-600 text-center py-4"${_scopeId}> All household balances are settled! No payments required. </div>`);
              } else {
                _push2(`<ul class="divide-y divide-gray-100 dark:divide-gray-800"${_scopeId}><!--[-->`);
                ssrRenderList(unref(settlementSuggestions), (s, idx) => {
                  var _a2;
                  _push2(`<li class="py-2.5 flex items-center justify-between text-xs"${_scopeId}><div class="flex items-center gap-1.5"${_scopeId}><strong class="text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(s.from)}</strong><span class="text-gray-400"${_scopeId}>pays</span><strong class="text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(s.to)}</strong></div><div class="font-mono font-bold text-primary-600 dark:text-primary-400"${_scopeId}>${ssrInterpolate(unref(formatMoney)(s.amount, (_a2 = unref(household)) == null ? void 0 : _a2.currency))}</div></li>`);
                });
                _push2(`<!--]--></ul>`);
              }
            } else {
              return [
                unref(settlementSuggestions).length === 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-xs text-green-600 text-center py-4"
                }, " All household balances are settled! No payments required. ")) : (openBlock(), createBlock("ul", {
                  key: 1,
                  class: "divide-y divide-gray-100 dark:divide-gray-800"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(settlementSuggestions), (s, idx) => {
                    var _a2;
                    return openBlock(), createBlock("li", {
                      key: idx,
                      class: "py-2.5 flex items-center justify-between text-xs"
                    }, [
                      createVNode("div", { class: "flex items-center gap-1.5" }, [
                        createVNode("strong", { class: "text-gray-900 dark:text-white" }, toDisplayString(s.from), 1),
                        createVNode("span", { class: "text-gray-400" }, "pays"),
                        createVNode("strong", { class: "text-gray-900 dark:text-white" }, toDisplayString(s.to), 1)
                      ]),
                      createVNode("div", { class: "font-mono font-bold text-primary-600 dark:text-primary-400" }, toDisplayString(unref(formatMoney)(s.amount, (_a2 = unref(household)) == null ? void 0 : _a2.currency)), 1)
                    ]);
                  }), 128))
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reports.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=reports-CZ9SLq54.mjs.map

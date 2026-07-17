const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const stateInjection = `
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderPage, setOrderPage] = useState(1);
  const ORDERS_PER_PAGE = 20;

  const [prodPage, setProdPage] = useState(1);
  const PRODS_PER_PAGE = 20;

  const exportOrdersCSV = (filteredOrders: any[]) => {
    const headers = ["Order ID", "Customer Name", "Phone", "Address", "City", "Total", "Status", "Date"];
    const rows = filteredOrders.map(o => [
      o.id,
      '"' + (o.customer_name || "").replace(/"/g, '""') + '"',
      '"' + (o.customer_phone || "") + '"',
      '"' + (o.delivery_address || "").replace(/"/g, '""') + '"',
      '"' + (o.city || "").replace(/"/g, '""') + '"',
      o.total,
      o.status,
      o.created_at ? new Date(o.created_at).toISOString() : ""
    ]);
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "orders_export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
`;
code = code.replace(/const \[activeTab, setActiveTab\] = useState\("dashboard"\);/, 'const [activeTab, setActiveTab] = useState("dashboard");\\n' + stateInjection);

const dynamicAnalytics = `
  const topProductsDynamic = useMemo(() => {
    if (!orders.length || !products.length) return sampleTopProducts;
    const salesMap: Record<string, { sales: number, revenue: number }> = {};
    for (const o of orders) {
      if (o.status === "cancelled") continue;
      for (const item of o.items || []) {
        if (!salesMap[item.id]) salesMap[item.id] = { sales: 0, revenue: 0 };
        salesMap[item.id].sales += item.quantity;
        salesMap[item.id].revenue += (item.price * item.quantity);
      }
    }
    return Object.entries(salesMap)
      .map(([id, stats]) => {
        const prod = products.find(p => p.id === id);
        return {
          name: prod ? prod.name : "Unknown",
          sales: stats.sales,
          revenue: stats.revenue,
          growth: "+0%"
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [orders, products]);

  const recentOrdersDynamic = useMemo(() => {
    if (!orders.length) return sampleRecentOrders;
    return orders.slice(0, 5).map(o => ({
      id: o.id.slice(0, 8),
      customer: o.customer_name,
      product: o.items?.[0]?.name + ((o.items?.length || 0) > 1 ? " +" + (o.items.length - 1) + " more" : ""),
      amount: o.total,
      status: o.status,
      date: o.created_at ? new Date(o.created_at).toLocaleDateString() : ""
    }));
  }, [orders]);
`;
code = code.replace(/const catDist = categories\.map\(\(c\) => \(\{/g, dynamicAnalytics + '\\n  const catDist = categories.map((c) => ({');

code = code.replace(/{sampleTopProducts\.map\(/g, '{topProductsDynamic.map(');
code = code.replace(/{\(orders\.length \? orders\.slice\(0, 5\) : sampleRecentOrders\)\.map\(\(order: any, i: number\) => \(/g, '{recentOrdersDynamic.map((order: any, i: number) => (');

const prodMapOld = "{filtered.map((product) => <ProductRow key={product.id} product={product} />)}";
const prodMapNew = `
                              {filtered.slice(0, prodPage * PRODS_PER_PAGE).map((product) => <ProductRow key={product.id} product={product} />)}
                              {prodPage * PRODS_PER_PAGE < filtered.length && (
                                <tr>
                                  <td colSpan={7} className="text-center py-4">
                                    <button onClick={() => setProdPage(p => p + 1)} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition-colors">Load More</button>
                                  </td>
                                </tr>
                              )}
`;
code = code.replace(prodMapOld, prodMapNew.trim());

code = code.replace(/onChange=\{\(e\) => setProdSearch\(e\.target\.value\)\}/g, 'onChange={(e) => { setProdSearch(e.target.value); setProdPage(1); }}');
code = code.replace(/onClick=\{\(\) => setProdSearch\(""\)\}/g, 'onClick={() => { setProdSearch(""); setProdPage(1); }}');
code = code.replace(/onChange=\{\(e\) => setProdCat\(e\.target\.value\)\}/g, 'onChange={(e) => { setProdCat(e.target.value); setProdPage(1); }}');
code = code.replace(/onChange=\{\(e\) => setProdStock\(e\.target\.value as "all" \| "in" \| "out"\)\}/g, 'onChange={(e) => { setProdStock(e.target.value as "all" | "in" | "out"); setProdPage(1); }}');
code = code.replace(/onClick=\{\(\) => \{ setProdSearch\(""\); setProdCat\("all"\); setProdStock\("all"\); \}\}/g, 'onClick={() => { setProdSearch(""); setProdCat("all"); setProdStock("all"); setProdPage(1); }}');

const ordersHeaderOld = '<h2 className="text-base font-bold text-gray-900">{a.orders.title}</h2>\\n                        <p className="text-xs text-gray-400 mt-0.5">\\n                          {loadingOrders ? a.common.loading : `${orders.length} ${a.orders.total}`}\\n                        </p>\\n                      </div>\\n                      <button onClick={loadOrders} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">\\n                        ↻ Refresh\\n                      </button>';

const ordersHeaderNew = '<h2 className="text-base font-bold text-gray-900">{a.orders.title}</h2>\\n                        <p className="text-xs text-gray-400 mt-0.5">\\n                          {loadingOrders ? a.common.loading : `${orders.length} ${a.orders.total}`}\\n                        </p>\\n                      </div>\\n                      <div className="flex flex-wrap items-center gap-2">\\n                        <div className="relative">\\n                          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />\\n                          <input\\n                            type="text"\\n                            placeholder="Search orders..."\\n                            value={orderSearch}\\n                            onChange={(e) => { setOrderSearch(e.target.value); setOrderPage(1); }}\\n                            className="pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 w-48"\\n                          />\\n                        </div>\\n                        <select\\n                          value={orderStatusFilter}\\n                          onChange={(e) => { setOrderStatusFilter(e.target.value); setOrderPage(1); }}\\n                          className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"\\n                        >\\n                          <option value="all">All Status</option>\\n                          <option value="pending">Pending</option>\\n                          <option value="confirmed">Confirmed</option>\\n                          <option value="processing">Processing</option>\\n                          <option value="shipped">Shipped</option>\\n                          <option value="delivered">Delivered</option>\\n                          <option value="cancelled">Cancelled</option>\\n                        </select>\\n                        <button onClick={() => exportOrdersCSV(orders.filter(o => \\n                            (orderStatusFilter === "all" || o.status === orderStatusFilter) &&\\n                            (!orderSearch || o.customer_name?.toLowerCase().includes(orderSearch.toLowerCase()) || o.id.includes(orderSearch) || o.customer_email?.toLowerCase().includes(orderSearch.toLowerCase()) || o.customer_phone?.includes(orderSearch))\\n                          ))} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">\\n                          <Download className="w-4 h-4" /> CSV\\n                        </button>\\n                        <button onClick={loadOrders} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium px-3 py-2 bg-emerald-50 rounded-xl">\\n                          ↻ Refresh\\n                        </button>\\n                      </div>';

code = code.replace(ordersHeaderOld, ordersHeaderNew);

const searchStr = '{orders.map((order) => (\\n                          <OrderDetailRow';
const replacementStr = '{(() => {\\n                          const filteredOrders = orders.filter(o => \\n                            (orderStatusFilter === "all" || o.status === orderStatusFilter) &&\\n                            (!orderSearch || o.customer_name?.toLowerCase().includes(orderSearch.toLowerCase()) || o.id.includes(orderSearch) || o.customer_email?.toLowerCase().includes(orderSearch.toLowerCase()) || o.customer_phone?.includes(orderSearch))\\n                          );\\n                          return (\\n                            <>\\n                              {filteredOrders.slice(0, orderPage * ORDERS_PER_PAGE).map((order) => (\\n                          <OrderDetailRow';

code = code.replace(searchStr, replacementStr);

const endSearchStr = '/>\\n                        ))}\\n                      </div>\\n                    )}\\n                  </div>';
const endReplacementStr = '/>\\n                        ))}\\n                        {orderPage * ORDERS_PER_PAGE < filteredOrders.length && (\\n                          <div className="p-4 border-t border-gray-50 flex justify-center">\\n                            <button onClick={() => setOrderPage(p => p + 1)} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition-colors">\\n                              Load More Orders\\n                            </button>\\n                          </div>\\n                        )}\\n                      </>\\n                    );\\n                  })()}\\n                      </div>\\n                    )}\\n                  </div>';

code = code.replace(endSearchStr, endReplacementStr);

if (!code.includes('useMemo')) {
  code = code.replace(/import \{ useState, useEffect, useCallback \} from "react";/, 'import { useState, useEffect, useCallback, useMemo } from "react";');
} else if (!code.match(/import \{.*useMemo.*\} from "react";/)) {
    code = code.replace(/import \{ useState, useEffect, useCallback \} from "react";/, 'import { useState, useEffect, useCallback, useMemo } from "react";');
}

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log("Patched successfully!");

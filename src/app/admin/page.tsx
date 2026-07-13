"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell,
} from "recharts";
import {
  Users, ShoppingBag, DollarSign, Package, TrendingUp, TrendingDown,
  MoreHorizontal, Eye, Edit, Trash2, ArrowUpRight, Calendar, Menu, X,
  LayoutDashboard, Package2, ShoppingCart, UserCircle, BarChart3, Settings,
} from "lucide-react";

const revenueData = [
  { month: "Jan", revenue: 12400, orders: 45 },
  { month: "Feb", revenue: 15200, orders: 52 },
  { month: "Mar", revenue: 18100, orders: 68 },
  { month: "Apr", revenue: 16900, orders: 58 },
  { month: "May", revenue: 22400, orders: 78 },
  { month: "Jun", revenue: 27800, orders: 92 },
  { month: "Jul", revenue: 31500, orders: 105 },
  { month: "Aug", revenue: 28900, orders: 98 },
  { month: "Sep", revenue: 34200, orders: 120 },
  { month: "Oct", revenue: 37100, orders: 132 },
  { month: "Nov", revenue: 42800, orders: 156 },
  { month: "Dec", revenue: 52300, orders: 189 },
];

const categoryData = [
  { name: "Cats", value: 35 },
  { name: "Dogs", value: 30 },
  { name: "Birds", value: 15 },
  { name: "Fish", value: 12 },
  { name: "Others", value: 8 },
];

const recentOrders = [
  { id: "#ORD-001", customer: "Sarah M.", product: "Premium Dry Cat Food", amount: 32.99, status: "Completed", date: "2024-12-15" },
  { id: "#ORD-002", customer: "Ahmed K.", product: "Adjustable Dog Harness", amount: 34.99, status: "Processing", date: "2024-12-14" },
  { id: "#ORD-003", customer: "Lisa R.", product: "Cat Tree Tower 6-Level", amount: 139.99, status: "Completed", date: "2024-12-14" },
  { id: "#ORD-004", customer: "Carlos D.", product: "Aquarium Starter Kit", amount: 89.99, status: "Pending", date: "2024-12-13" },
  { id: "#ORD-005", customer: "Emma J.", product: "Grooming Package - Full", amount: 65.00, status: "Completed", date: "2024-12-13" },
  { id: "#ORD-006", customer: "Mohamed A.", product: "Premium Bird Seed Mix", amount: 16.99, status: "Cancelled", date: "2024-12-12" },
  { id: "#ORD-007", customer: "Sophie L.", product: "Orthopedic Cat Bed", amount: 59.99, status: "Completed", date: "2024-12-12" },
  { id: "#ORD-008", customer: "John D.", product: "Dental Chew Bones", amount: 16.99, status: "Processing", date: "2024-12-11" },
];

const topProducts = [
  { name: "Premium Dry Cat Food 2kg", sales: 342, revenue: 11288, growth: "+12%" },
  { name: "Cat Tree Tower 6-Level", sales: 189, revenue: 26458, growth: "+24%" },
  { name: "Adjustable Dog Harness", sales: 276, revenue: 9657, growth: "+8%" },
  { name: "Aquarium Starter Kit 20L", sales: 145, revenue: 13048, growth: "+18%" },
  { name: "Orthopedic Cat Bed - Large", sales: 198, revenue: 11878, growth: "+32%" },
];

const COLORS = ["#059669", "#10B981", "#34D399", "#6EE7B7", "#A7F3D0"];

const sidebarLinks = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin", active: true },
  { label: "Products", icon: Package2, href: "/products", active: false },
  { label: "Orders", icon: ShoppingCart, href: "#", active: false, disabled: true },
  { label: "Customers", icon: UserCircle, href: "#", active: false, disabled: true },
  { label: "Analytics", icon: BarChart3, href: "#", active: false, disabled: true },
  { label: "Settings", icon: Settings, href: "#", active: false, disabled: true },
];

function StatCard({ icon: Icon, label, value, trend, trendUp, color }: {
  icon: React.ElementType; label: string; value: string; trend?: string; trendUp?: boolean; color?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
              {trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color || "bg-emerald-100 text-emerald-600"}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Completed: "bg-emerald-100 text-emerald-700",
    Processing: "bg-amber-100 text-amber-700",
    Pending: "bg-orange-100 text-orange-700",
    Cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm" style={{ color: p.color }}>
            {p.name}: {p.name === "Revenue" ? `$${p.value.toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const { t } = useI18n();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#2E241A] to-[#4A3A2A] text-white
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  P
                </div>
                <div>
                  <p className="font-bold text-white text-lg leading-tight">Paws & Wings</p>
                  <p className="text-xs text-emerald-300/60">Admin Panel</p>
                </div>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => link.disabled || setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    link.active
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : link.disabled
                        ? "text-white/30 cursor-not-allowed"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                  {link.disabled && (
                    <span className="ml-auto text-[10px] uppercase tracking-wider text-white/20 bg-white/5 px-2 py-0.5 rounded-full">
                      Soon
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/40 hover:text-white/60 hover:bg-white/5 transition-all">
              <ArrowUpRight className="w-4 h-4" />
              <span>View Store</span>
            </Link>
          </div>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 hover:text-gray-900">
                  <Menu className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-bold text-gray-900">
                  Admin Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Dec 1 - Dec 31, 2024</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
              </div>
            </div>
          </header>

          <main className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800">Sample Data Mode</p>
                <p className="text-xs text-amber-700/70 mt-0.5">
                  Admin dashboard with sample data. Connect to a backend for live data.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={DollarSign} label="Total Revenue" value="$124,500" trend="+12.5% from last month" trendUp color="bg-emerald-100 text-emerald-600" />
              <StatCard icon={ShoppingBag} label="Total Orders" value="1,893" trend="+8.2% from last month" trendUp color="bg-blue-100 text-blue-600" />
              <StatCard icon={Users} label="Total Customers" value="1,247" trend="+5.4% from last month" trendUp color="bg-purple-100 text-purple-600" />
              <StatCard icon={Package} label="Total Products" value="168" trend="+3 new this month" trendUp color="bg-rose-100 text-rose-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Monthly revenue & order trends</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                      <span>Revenue</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
                      <span>Orders</span>
                    </div>
                  </div>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} barGap={2}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={24} />
                      <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#6EE7B7" radius={[4, 4, 0, 0]} maxBarSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Category Sales</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Distribution by pet</p>
                </div>
                <div className="h-64 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={88}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categoryData.map((_, i) => (
                          <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2.5 mt-2">
                  {categoryData.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        <span className="text-gray-700">{item.name}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Latest transactions</p>
                  </div>
                  <Link href="#" className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
                    View All
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-y border-gray-100 bg-gray-50/50">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 text-gray-700">{order.customer}</td>
                        <td className="px-6 py-4 text-gray-700 max-w-[200px] truncate">{order.product}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">${order.amount.toFixed(2)}</td>
                        <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                        <td className="px-6 py-4 text-gray-500">{order.date}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="View">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="Edit">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Top Products</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Best performing products this month</p>
                </div>
                <Link href="/products" className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
                  View Products
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {topProducts.map((product, i) => (
                  <div key={i} className="relative bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all group">
                    <div className="absolute top-3 right-3 w-7 h-7 bg-white rounded-lg shadow-sm flex items-center justify-center text-xs font-bold text-emerald-600">
                      {i + 1}
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Package className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-gray-500">
                        <span>Sales</span>
                        <span className="font-medium text-gray-900">{product.sales}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Revenue</span>
                        <span className="font-medium text-gray-900">${product.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Growth</span>
                        <span className="font-medium text-emerald-600">{product.growth}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${(product.sales / 342) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

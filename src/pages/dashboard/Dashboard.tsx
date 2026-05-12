import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
    ArrowUpRight, ArrowDownRight, DollarSign, Activity,
    Package, Bell, TrendingUp, AlertTriangle, Zap,
    ExternalLink, Lightbulb, Factory, ShoppingCart
} from "lucide-react";

const productionData = [
    { name: 'Mon', total: 1200 },
    { name: 'Tue', total: 2100 },
    { name: 'Wed', total: 1800 },
    { name: 'Thu', total: 2400 },
    { name: 'Fri', total: 1600 },
    { name: 'Sat', total: 3200 },
    { name: 'Sun', total: 1400 },
];

const marketData = [
    { name: 'Mon', price: 8400 },
    { name: 'Tue', price: 8450 },
    { name: 'Wed', price: 8420 },
    { name: 'Thu', price: 8550 },
    { name: 'Fri', price: 8600 },
    { name: 'Sat', price: 8580 },
    { name: 'Sun', price: 8700 },
];

// Reusable KPI widget with 3D depth effect
function KpiCard({
    label, value, sub, subUp, icon: Icon, iconColor, accentColor, bgGradient
}: {
    label: string; value: string; sub: string; subUp?: boolean;
    icon: any; iconColor: string; accentColor: string; bgGradient: string;
}) {
    return (
        <div
            className={`relative overflow-hidden rounded-2xl p-5 flex flex-col gap-3 ${bgGradient} shadow-lg border border-white/60`}
            style={{
                boxShadow: `0 2px 0 0 rgba(0,0,0,0.06), 0 8px 24px -4px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)`
            }}
        >
            {/* Subtle 3D top sheen */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
            {/* Bottom depth shadow line */}
            <div className={`absolute inset-x-2 bottom-0 h-0.5 ${accentColor} rounded-full opacity-20 blur-sm`} />

            <div className="flex items-start justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</p>
                <div className={`p-2 rounded-xl ${iconColor} shadow-sm`}
                    style={{ boxShadow: `0 2px 8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.5)` }}>
                    <Icon className="h-4 w-4" />
                </div>
            </div>

            <div className="font-bold text-2xl tracking-tight text-slate-900 leading-none">{value}</div>

            <div className={`flex items-center gap-1 text-xs font-semibold ${subUp === false ? 'text-rose-600' : 'text-emerald-600'}`}>
                {subUp === false ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                {sub}
            </div>
        </div>
    );
}

export default function Dashboard() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <DashboardLayout>
            <div className="space-y-8">

                {/* ── HEADER ── */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">{dateStr}</p>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                            Command Center
                        </h1>
                        <p className="text-slate-500 mt-1 text-sm">Live overview of operations, finance, and market signals.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right mr-2 hidden sm:block">
                            <p className="text-2xl font-mono font-bold text-slate-700">{timeStr}</p>
                            <p className="text-xs text-slate-400">System Time</p>
                        </div>
                        <Button variant="outline" size="sm" className="h-9 rounded-xl border-slate-200 shadow-sm">
                            <ExternalLink className="mr-2 h-4 w-4" /> Export
                        </Button>
                        <Button size="sm"
                            className="h-9 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md"
                            style={{ boxShadow: '0 4px 12px rgba(79,70,229,0.35)' }}>
                            <Zap className="mr-2 h-4 w-4" /> AI Actions
                        </Button>
                    </div>
                </div>

                {/* ── KPI ROW ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard
                        label="Total Revenue"
                        value="Rs. 45.2M"
                        sub="+20.1% from last month"
                        subUp={true}
                        icon={DollarSign}
                        iconColor="bg-emerald-100 text-emerald-700"
                        accentColor="bg-emerald-500"
                        bgGradient="bg-gradient-to-br from-emerald-50 via-white to-white"
                    />
                    <KpiCard
                        label="Production Output"
                        value="12,340 kg"
                        sub="+4.5% from last week"
                        subUp={true}
                        icon={Factory}
                        iconColor="bg-blue-100 text-blue-700"
                        accentColor="bg-blue-500"
                        bgGradient="bg-gradient-to-br from-blue-50 via-white to-white"
                    />
                    <KpiCard
                        label="Open Purchase Orders"
                        value="7 Orders"
                        sub="2 overdue by >3 days"
                        subUp={false}
                        icon={ShoppingCart}
                        iconColor="bg-amber-100 text-amber-700"
                        accentColor="bg-amber-500"
                        bgGradient="bg-gradient-to-br from-amber-50 via-white to-white"
                    />
                    <KpiCard
                        label="Active Alerts"
                        value="3 Issues"
                        sub="Requires immediate attention"
                        subUp={false}
                        icon={Bell}
                        iconColor="bg-rose-100 text-rose-700"
                        accentColor="bg-rose-500"
                        bgGradient="bg-gradient-to-br from-rose-50 via-white to-white"
                    />
                </div>

                {/* ── MAIN GRID ── */}
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">

                    {/* LEFT (4/7) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Weekly Production Chart */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            style={{ boxShadow: '0 1px 0 0 rgba(0,0,0,0.04), 0 4px 16px -2px rgba(0,0,0,0.07)' }}>
                            <div className="flex items-start justify-between mb-5">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-base">Weekly Production</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Output trends over the last 7 days (kg)</p>
                                </div>
                                <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200 text-xs">This Week</Badge>
                            </div>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={productionData} barSize={28}>
                                    <defs>
                                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0.9} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}kg`} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc', radius: 6 }}
                                        contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12 }}
                                    />
                                    <Bar dataKey="total" fill="url(#barGrad)" radius={[6, 6, 2, 2]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Top Parties Exposure */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            style={{ boxShadow: '0 1px 0 0 rgba(0,0,0,0.04), 0 4px 16px -2px rgba(0,0,0,0.07)' }}>
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-base">Top Party Exposure</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Financial + Metal Khata dual-ledger view</p>
                                </div>
                                <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg">View All</Button>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { name: "Alpha Cables", type: "CUST", fin: "-120,000", finUp: false, metal: "+50 KG", metalUp: true },
                                    { name: "Gamma Scrap", type: "VEND", fin: "+45,000", finUp: true, metal: "-120 KG", metalUp: false },
                                    { name: "Beta Transformers", type: "VEND", fin: "-280,000", finUp: false, metal: "+310 KG", metalUp: true },
                                ].map((p) => (
                                    <div key={p.name} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${p.type === 'CUST' ? 'bg-blue-100 text-blue-700' : 'bg-violet-100 text-violet-700'}`}>
                                                {p.type}
                                            </div>
                                            <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                                        </div>
                                        <div className="flex gap-4 text-right">
                                            <div>
                                                <p className={`text-xs font-bold ${p.finUp ? 'text-emerald-600' : 'text-rose-600'}`}>Fin: {p.fin}</p>
                                            </div>
                                            <div>
                                                <p className={`text-xs font-bold font-mono ${p.metalUp ? 'text-blue-600' : 'text-rose-600'}`}>Metal: {p.metal}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI / System Suggestions */}
                        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-white p-6 shadow-sm"
                            style={{ boxShadow: '0 1px 0 0 rgba(0,0,0,0.04), 0 4px 16px -2px rgba(99,102,241,0.08)' }}>
                            <div className="flex items-center gap-2 mb-5">
                                <div className="p-1.5 bg-indigo-100 rounded-lg">
                                    <Lightbulb className="h-4 w-4 text-indigo-600" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-base">System Intelligence</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex gap-3 p-4 bg-white rounded-xl border border-indigo-100 shadow-sm">
                                    <div className="shrink-0 w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                        <TrendingUp className="h-4 w-4 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 text-sm">Optimize Procurement</h4>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">Copper prices are trending down. Consider booking 5,000 kg for next month's demand before rates recover.</p>
                                        <Button variant="link" className="h-auto p-0 text-indigo-600 text-xs mt-2 font-semibold">View Analysis →</Button>
                                    </div>
                                </div>
                                <div className="flex gap-3 p-4 bg-white rounded-xl border border-amber-100 shadow-sm">
                                    <div className="shrink-0 w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 text-sm">Preventative Maintenance Due</h4>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">Machine M-02 has recorded a 5% efficiency drop over 3 days. Schedule a maintenance check.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT (3/7) */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* LME Market Trends */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden"
                            style={{ boxShadow: '0 1px 0 0 rgba(0,0,0,0.04), 0 4px 16px -2px rgba(0,0,0,0.07)' }}>
                            <div className="flex items-start justify-between mb-1">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-base">LME Market</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Copper price index — 7 day</p>
                                </div>
                                <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 text-xs">Bullish</Badge>
                            </div>
                            <div className="h-[120px] w-full -mx-2 mt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={marketData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" hide />
                                        <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: 11 }}
                                            formatter={(v: any) => [`$${v}`, 'Price']}
                                        />
                                        <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#areaGrad)" dot={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-2.5 mt-3 pt-3 border-t border-slate-100">
                                {[
                                    { name: "LME Copper", price: "$8,700.50", change: "+1.2%", up: true },
                                    { name: "LME Aluminum", price: "$2,450.00", change: "-0.5%", up: false },
                                    { name: "PKR/USD", price: "278.50", change: "-0.3%", up: false },
                                ].map(m => (
                                    <div key={m.name} className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-600">{m.name}</span>
                                        <div className="text-right">
                                            <span className="block text-sm font-bold text-slate-900">{m.price}</span>
                                            <span className={`text-xs font-semibold ${m.up ? 'text-emerald-600' : 'text-rose-600'}`}>{m.change}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Critical Alerts */}
                        <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm"
                            style={{ boxShadow: '0 1px 0 0 rgba(0,0,0,0.04), 0 4px 16px -2px rgba(239,68,68,0.07)' }}>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-rose-100 rounded-lg">
                                    <Bell className="h-4 w-4 text-rose-600" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-base">Critical Alerts</h3>
                                <Badge className="ml-auto bg-rose-100 text-rose-700 hover:bg-rose-100 text-xs">3 Active</Badge>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { dot: "bg-rose-500", title: "Low Inventory: 8mm Rod", desc: "Stock below safety level (500 kg). Production may halt in 2 days.", action: "Reorder Now" },
                                    { dot: "bg-amber-500", title: "Payment Overdue", desc: "Invoice #INV-2993 is 5 days overdue from Allied Corp.", action: null },
                                    { dot: "bg-amber-400", title: "Supplier Rate Expiring", desc: "Agreed rate with Beta Transformers expires in 48 hours.", action: null },
                                ].map((a, i) => (
                                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${a.dot}`} />
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-slate-900">{a.title}</p>
                                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{a.desc}</p>
                                            {a.action && (
                                                <Button variant="outline" size="sm" className="h-7 text-xs mt-2 rounded-lg border-rose-200 text-rose-700 hover:bg-rose-50">{a.action}</Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Parchis Due */}
                        <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/60 to-white p-6 shadow-sm"
                            style={{ boxShadow: '0 1px 0 0 rgba(0,0,0,0.04), 0 4px 16px -2px rgba(245,158,11,0.08)' }}>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-amber-100 rounded-lg">
                                    <Activity className="h-4 w-4 text-amber-600" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-base">Parchis Due Today</h3>
                                <Badge className="ml-auto bg-amber-100 text-amber-700 hover:bg-amber-100 text-xs">3 Pending</Badge>
                            </div>
                            <div className="space-y-2.5">
                                {[
                                    { id: "#P-4001", party: "A.K. Traders", detail: "2,000 kg @ PKR 2,450" },
                                    { id: "#P-4005", party: "Bilal & Sons", detail: "Payment: 5.2M PKR" },
                                    { id: "#P-4008", party: "Noor Steel", detail: "1,500 kg @ PKR 2,390" },
                                ].map((p) => (
                                    <div key={p.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-amber-100 shadow-sm hover:border-amber-300 transition-colors">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{p.id} · {p.party}</p>
                                            <p className="text-xs text-slate-500 mt-0.5 font-mono">{p.detail}</p>
                                        </div>
                                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-amber-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg">
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

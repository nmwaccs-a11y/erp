import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import {
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    Activity,
    Users,
    Package,
    Bell,
    Lightbulb,
    TrendingUp,
    AlertTriangle,
    Zap,
    ExternalLink
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

export default function Dashboard() {
    return (
        <DashboardLayout>
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                        <p className="text-slate-500">Overview of operations, market signals, and system health.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <ExternalLink className="mr-2 h-4 w-4" /> Export Report
                        </Button>
                        <Button className="bg-blue-900 hover:bg-blue-800 text-white" size="sm">
                            <Zap className="mr-2 h-4 w-4" /> AI Actions
                        </Button>
                    </div>
                </div>

                {/* Key Metrics Row - Aligned with Below (4/3 Split) */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="shadow-sm border-slate-200 lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">$45,231.89</div>
                            <p className="text-xs text-emerald-600 flex items-center mt-1">
                                <ArrowUpRight className="h-3 w-3 mr-1" /> +20.1% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-slate-200 lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Production Output</CardTitle>
                            <Activity className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">12,340 kg</div>
                            <p className="text-xs text-emerald-600 flex items-center mt-1">
                                <ArrowUpRight className="h-3 w-3 mr-1" /> +4.5% from last week
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-slate-200 lg:col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Active Alerts</CardTitle>
                            <Bell className="h-4 w-4 text-rose-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">3</div>
                            <p className="text-xs text-rose-600 font-medium mt-1">
                                Requires attention
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

                    {/* LEFT COLUMN (Charts & Suggestions) */}
                    <div className="col-span-4 space-y-6">
                        {/* Production Chart */}
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-slate-900">Weekly Production</CardTitle>
                                <CardDescription>Output trends over the last 7 days</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={productionData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}kg`} />
                                        <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Bar dataKey="total" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* AI Suggestions Widget */}
                        <Card className="shadow-sm border-slate-200 bg-gradient-to-br from-indigo-50 to-white">
                            <CardHeader className="flex flex-row items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-indigo-600" />
                                <CardTitle className="text-slate-900">System Suggestions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex gap-4 items-start p-3 bg-white rounded-lg border border-indigo-100 shadow-sm">
                                        <div className="bg-indigo-100 p-2 rounded-full">
                                            <TrendingUp className="h-4 w-4 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 text-sm">optimize Procurement</h4>
                                            <p className="text-xs text-slate-600 mt-1">Copper prices are trending down. Consider booking 5000kg for next month's unexpected demand.</p>
                                            <Button variant="link" className="h-auto p-0 text-indigo-600 text-xs mt-2">View Analysis →</Button>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start p-3 bg-white rounded-lg border border-amber-100 shadow-sm">
                                        <div className="bg-amber-100 p-2 rounded-full">
                                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 text-sm">Preventative Maintenance</h4>
                                            <p className="text-xs text-slate-600 mt-1">Machine M-02 has shown a 5% drop in efficiency. Schedule a checkup.</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN (Market & Alerts) */}
                    <div className="col-span-3 space-y-6">

                        {/* Market Insights Widget */}
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-slate-900">LME Market Trends</CardTitle>
                                    <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200">Bullish</Badge>
                                </div>
                                <CardDescription>Real-time copper price indices</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[150px] w-full mb-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={marketData}>
                                            <defs>
                                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="name" hide />
                                            <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                                            <Area type="monotone" dataKey="price" stroke="#10b981" fillOpacity={1} fill="url(#colorPrice)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                        <span className="text-sm font-medium text-slate-700">LME Copper</span>
                                        <div className="text-right">
                                            <span className="block text-sm font-bold text-slate-900">$8,700.50</span>
                                            <span className="text-xs text-emerald-600">+1.2%</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                        <span className="text-sm font-medium text-slate-700">LME Aluminum</span>
                                        <div className="text-right">
                                            <span className="block text-sm font-bold text-slate-900">$2,450.00</span>
                                            <span className="text-xs text-rose-600">-0.5%</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Critical Alerts Widget */}
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-slate-900">Critical Alerts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-rose-500 shrink-0" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-slate-900">Low Inventory: 8mm Rod</p>
                                            <p className="text-xs text-slate-500">Stock below safety level (500kg). Production may halt in 2 days.</p>
                                            <Button variant="outline" size="sm" className="h-7 text-xs mt-1">Reorder Now</Button>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-amber-500 shrink-0" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-slate-900">Payment Overdue</p>
                                            <p className="text-xs text-slate-500">Invoice #INV-2993 is 5 days overdue from Allied Corp.</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Parchi Due Widget */}
                        <Card className="shadow-sm border-slate-200 bg-amber-50/50">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-slate-900 flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-amber-600" />
                                        Parchis Due Today
                                    </CardTitle>
                                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">3 Pending</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-2 bg-white rounded border border-amber-100 shadow-sm">
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">#P-4001 • A.K. Traders</p>
                                            <p className="text-xs text-slate-500">Commitment: 2000kg @ 2450</p>
                                        </div>
                                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-400 hover:text-amber-600">
                                            <ExternalLink className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-white rounded border border-amber-100 shadow-sm">
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">#P-4005 • Bilal & Sons</p>
                                            <p className="text-xs text-slate-500">Payment: 5.2M PKR</p>
                                        </div>
                                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-400 hover:text-amber-600">
                                            <ExternalLink className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>



                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, FileText, ArrowUpRight, ArrowDownLeft, ShoppingCart, Printer, Lock, Package } from "lucide-react";
import { useState } from "react";
import { PurchaseInvoiceModal } from "@/components/procurement/PurchaseInvoiceModal";
import { PurchaseReturnModal } from "@/components/procurement/PurchaseReturnModal";
import { CreatePOModal } from "@/components/procurement/CreatePOModal";
import { PrintPOSheet } from "@/components/procurement/PrintPOSheet";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

const STATUS_BADGE: Record<string, string> = {
    "Pending": "bg-slate-100 text-slate-600 border-slate-300",
    "Partially Fulfilled": "bg-blue-50 text-blue-700 border-blue-300",
    "Closed": "bg-emerald-50 text-emerald-700 border-emerald-300",
    "Completed": "bg-emerald-50 text-emerald-700 border-emerald-300",
    "Pending Rate": "bg-amber-50 text-amber-700 border-amber-300",
    "Canceled": "bg-rose-50 text-rose-700 border-rose-300",
};

function KpiCard({ label, value, sub, icon: Icon, accent }: { label: string; value: string; sub: string; icon: any; accent: "blue" | "emerald" | "rose" | "amber" }) {
    const colors = {
        blue: { bg: "from-blue-50 via-white to-white", icon: "bg-blue-100 text-blue-700", bar: "bg-blue-400" },
        emerald: { bg: "from-emerald-50 via-white to-white", icon: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-400" },
        rose: { bg: "from-rose-50 via-white to-white", icon: "bg-rose-100 text-rose-700", bar: "bg-rose-400" },
        amber: { bg: "from-amber-50 via-white to-white", icon: "bg-amber-100 text-amber-700", bar: "bg-amber-400" },
    }[accent];

    return (
        <div className={`relative overflow-hidden rounded-2xl p-5 flex flex-col gap-3 bg-gradient-to-br ${colors.bg} border border-white/60`}
            style={{ boxShadow: "0 2px 0 0 rgba(0,0,0,0.05), 0 8px 24px -4px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)" }}>
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
            <div className={`absolute inset-x-2 bottom-0 h-0.5 ${colors.bar} rounded-full opacity-20 blur-sm`} />
            <div className="flex items-start justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</p>
                <div className={`p-2 rounded-xl ${colors.icon} shadow-sm`}
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.5)" }}>
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <div className="font-bold text-2xl tracking-tight text-slate-900 leading-none">{value}</div>
            <div className="text-xs font-medium text-slate-400">{sub}</div>
        </div>
    );
}

export default function Purchase() {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("orders");
    const [invoiceOpen, setInvoiceOpen] = useState(false);
    const [returnOpen, setReturnOpen] = useState(false);
    const [poOpen, setPoOpen] = useState(false);
    const [printOpen, setPrintOpen] = useState(false);
    const [selectedPrintOrder, setSelectedPrintOrder] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const TOLERANCE = 0.02;

    const [orders, setOrders] = useState<any[]>([
        {
            id: "PO-2026-101", date: "2026-02-15", supplier: "Alpha Wire Supply", supplierId: "sup-001",
            items: [{ item: "Copper Cathode", qty: 20000, rate: 260 }],
            amount: 5200000, status: "Pending", total_ordered_qty: 20000, total_fulfilled_qty: 0,
        },
        {
            id: "PO-2026-100", date: "2026-02-10", supplier: "Beta Transformers", supplierId: "sup-002",
            items: [{ item: "Mixed Scrap", qty: 5000, rate: 220 }],
            amount: 1100000, status: "Partially Fulfilled", total_ordered_qty: 5000, total_fulfilled_qty: 3200,
        },
    ]);

    const [invoices, setInvoices] = useState<{ id: string, date: string, supplier: string, amount: number, status: string, weight: string, linkedPOId?: string | null }[]>([
        { id: "PUR-2026-001", date: "2026-02-14", supplier: "New Age Copper", amount: 450000, status: "Pending Rate", weight: "5,000 kg", linkedPOId: null },
        { id: "PUR-2026-002", date: "2026-02-13", supplier: "Metal Exchange", amount: 120000, status: "Completed", weight: "1,200 kg", linkedPOId: null },
    ]);

    const [returns, setReturns] = useState([
        { id: "PR-2026-050", date: "2026-02-12", supplier: "Global Rods", amount: 15000, reason: "Quality Reject", type: "Stock Return" }
    ]);

    const handleCreateOrder = (data: any) => {
        const totalQty = data.lines?.reduce((s: number, l: any) => s + (l.qty || l.netWeight || 0), 0) || 0;
        const newOrder = {
            id: `PO-2026-${102 + orders.length}`,
            date: data.date || new Date().toISOString().split('T')[0],
            supplier: data.vendor === "alpha" ? "Alpha Wire Supply" : "Beta Transformers",
            supplierId: data.vendor === "alpha" ? "sup-001" : "sup-002",
            items: data.lines,
            amount: data.lines.reduce((sum: number, line: any) => sum + (line.amount || 0), 0),
            status: "Pending", total_ordered_qty: totalQty, total_fulfilled_qty: 0,
        };
        setOrders([newOrder, ...orders]);
        toast({ title: "Purchase Order Created", description: `Order ${newOrder.id} successfully created.` });
    };

    const recalcPOStatus = (poId: string, invoiceNetWt: number) => {
        setOrders(prev => prev.map(o => {
            if (o.id !== poId) return o;
            const newFulfilled = o.total_fulfilled_qty + invoiceNetWt;
            let newStatus = newFulfilled <= 0 ? "Pending"
                : newFulfilled >= o.total_ordered_qty * (1 - TOLERANCE) ? "Closed"
                    : "Partially Fulfilled";
            return { ...o, total_fulfilled_qty: newFulfilled, status: newStatus };
        }));
    };

    const handleForceClose = (poId: string) => {
        setOrders(prev => prev.map(o => o.id === poId ? { ...o, status: "Closed" } : o));
        toast({ title: "PO Force Closed", description: `${poId} has been manually closed.` });
    };

    const handleInvoiceSubmit = (data: any) => {
        setInvoices([{
            id: data.header.invoiceId,
            date: data.header.date ? data.header.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            supplier: "New Supplier",
            amount: data.totals.netPayable,
            status: data.header.ratePending ? "Pending Rate" : "Completed",
            weight: `${data.items.reduce((s: number, i: any) => s + i.netWeight, 0).toLocaleString()} kg`,
            linkedPOId: data.header.linkedPOId || null,
        }, ...invoices]);
        if (data.header.linkedPOId) recalcPOStatus(data.header.linkedPOId, data.items.reduce((s: number, i: any) => s + i.netWeight, 0));
        toast({ title: "Invoice Posted", description: `Invoice ${data.header.invoiceId} posted.` });
    };

    const handleReturnSubmit = (data: any) => {
        setReturns([{
            id: data.header.returnId,
            date: data.header.date ? data.header.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            supplier: "New Supplier",
            amount: data.totalDebit,
            reason: data.header.remarks || "N/A",
            type: data.header.returnAction === "stock" ? "Stock Return" : "Financial Only"
        }, ...returns]);
    };

    const filteredOrders = orders.filter(o =>
        !searchQuery || o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredInvoices = invoices.filter(i =>
        !searchQuery || i.id.toLowerCase().includes(searchQuery.toLowerCase()) || i.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* ── HEADER ── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Procurement</p>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Purchase</h1>
                        <p className="text-slate-500 mt-1 text-sm">Manage Purchase Orders, Invoices, and Supplier Returns.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {activeTab === 'orders' && (
                            <Button className="h-9 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md" onClick={() => setPoOpen(true)}
                                style={{ boxShadow: "0 4px 12px rgba(37,99,235,0.30)" }}>
                                <Plus className="h-4 w-4 mr-2" /> New Order
                            </Button>
                        )}
                        {activeTab === 'invoices' && (
                            <Button className="h-9 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md" onClick={() => setInvoiceOpen(true)}
                                style={{ boxShadow: "0 4px 12px rgba(5,150,105,0.30)" }}>
                                <Plus className="h-4 w-4 mr-2" /> New Invoice
                            </Button>
                        )}
                        {activeTab === 'returns' && (
                            <Button className="h-9 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md" onClick={() => setReturnOpen(true)}
                                style={{ boxShadow: "0 4px 12px rgba(225,29,72,0.30)" }}>
                                <Plus className="h-4 w-4 mr-2" /> New Return
                            </Button>
                        )}
                    </div>
                </div>

                {/* ── KPI ROW ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard label="Open Orders" value={`${orders.filter(o => o.status !== 'Closed').length} Orders`} sub="Awaiting fulfillment" icon={ShoppingCart} accent="blue" />
                    <KpiCard label="Pending Invoices" value={`${invoices.filter(i => i.status === 'Pending Rate').length} Invoices`} sub="Rate not yet fixed" icon={FileText} accent="amber" />
                    <KpiCard label="Total Committed" value="₨ 6.3M" sub="Across all open POs" icon={Package} accent="emerald" />
                    <KpiCard label="Debit Notes" value={`${returns.length} Returns`} sub="Stock/financial adjustments" icon={ArrowUpRight} accent="rose" />
                </div>

                {/* ── MODALS ── */}
                <CreatePOModal open={poOpen} onOpenChange={setPoOpen} onSubmit={handleCreateOrder} />
                <PurchaseInvoiceModal open={invoiceOpen} onOpenChange={setInvoiceOpen} onSubmit={handleInvoiceSubmit} pendingPOs={orders.filter(o => o.status === 'Pending' || o.status === 'Partially Fulfilled')} />
                <PurchaseReturnModal open={returnOpen} onOpenChange={setReturnOpen} onSubmit={handleReturnSubmit} />
                <PrintPOSheet open={printOpen} onOpenChange={setPrintOpen} order={selectedPrintOrder} />

                {/* ── TABS ── */}
                <Tabs defaultValue="orders" onValueChange={(v) => { setActiveTab(v); setSearchQuery(""); }} className="space-y-5">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <TabsList className="bg-slate-100/80 p-1 rounded-xl border border-slate-200 h-auto">
                            <TabsTrigger value="orders" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 px-5 py-2 text-sm font-semibold gap-2">
                                <ShoppingCart className="h-3.5 w-3.5" /> Purchase Orders
                            </TabsTrigger>
                            <TabsTrigger value="invoices" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700 px-5 py-2 text-sm font-semibold gap-2">
                                <ArrowDownLeft className="h-3.5 w-3.5" /> Inward Supply
                            </TabsTrigger>
                            <TabsTrigger value="returns" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-rose-700 px-5 py-2 text-sm font-semibold gap-2">
                                <ArrowUpRight className="h-3.5 w-3.5" /> Debit Notes
                            </TabsTrigger>
                        </TabsList>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                className="pl-9 h-10 w-64 rounded-xl bg-white border-slate-200 shadow-sm text-sm"
                                placeholder="Search ID, supplier..." />
                        </div>
                    </div>

                    {/* ── ORDERS TAB ── */}
                    <TabsContent value="orders">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            style={{ boxShadow: "0 1px 0 0 rgba(0,0,0,0.04), 0 4px 16px -2px rgba(0,0,0,0.07)" }}>
                            <div className="mb-5">
                                <h3 className="font-bold text-slate-900 text-base">Active Purchase Orders</h3>
                                <p className="text-xs text-slate-400 mt-0.5">{filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {filteredOrders.map((po) => (
                                    <div key={po.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col group hover:shadow-md hover:border-blue-300 transition-all"
                                        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 0 rgba(0,0,0,0.03)" }}>
                                        {/* Top accent bar */}
                                        <div className={`h-1 w-full ${po.status === 'Closed' ? 'bg-emerald-400' : po.status === 'Partially Fulfilled' ? 'bg-blue-400' : 'bg-slate-300'}`} />

                                        <div className="p-4 border-b border-dashed border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                                            <div className="flex justify-between items-start">
                                                <div className="font-mono font-bold text-base text-blue-700 tracking-tight">{po.id}</div>
                                                <Badge variant="outline" className={`text-xs shadow-sm ${STATUS_BADGE[po.status] || ''}`}>{po.status}</Badge>
                                            </div>
                                            <div className="font-semibold text-slate-800 mt-1.5 text-sm">{po.supplier}</div>
                                            <div className="text-xs text-slate-400 font-mono mt-1">{po.date}</div>
                                        </div>

                                        <div className="p-4 flex-1 space-y-3 relative">
                                            {po.status === "Closed" && (
                                                <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
                                                    <div className="border-4 border-emerald-500 text-emerald-500 text-4xl font-black uppercase tracking-widest p-2 -rotate-12 rounded-lg">FULFILLED</div>
                                                </div>
                                            )}
                                            <div>
                                                <div className="flex justify-between text-xs mb-1.5">
                                                    <span className="uppercase tracking-widest font-bold text-slate-400 text-[9px]">Fulfillment</span>
                                                    <span className="font-bold text-slate-700">{Math.min(100, Math.round((po.total_fulfilled_qty / po.total_ordered_qty) * 100))}%</span>
                                                </div>
                                                <Progress value={Math.min(100, (po.total_fulfilled_qty / po.total_ordered_qty) * 100)} className="h-1.5" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                    <div className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mb-1">Ordered</div>
                                                    <div className="font-mono font-bold text-slate-700 text-sm">{po.total_ordered_qty.toLocaleString()} <span className="text-[9px] text-slate-400">kg</span></div>
                                                </div>
                                                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                    <div className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mb-1">Value</div>
                                                    <div className="font-mono font-bold text-emerald-600 text-sm">₨ {(po.amount / 1000000).toFixed(1)}M</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                                            {po.status !== "Closed" && (
                                                <Button size="sm" variant="outline" className="h-8 text-xs rounded-lg text-amber-600 border-amber-200 hover:bg-amber-50"
                                                    onClick={() => handleForceClose(po.id)}>
                                                    <Lock className="h-3 w-3 mr-1" /> Close
                                                </Button>
                                            )}
                                            <Button size="icon" variant="ghost" className="h-8 w-8 ml-auto text-slate-400 hover:text-slate-700"
                                                onClick={() => { setSelectedPrintOrder(po); setPrintOpen(true); }}>
                                                <Printer className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* ── INVOICES TAB ── */}
                    <TabsContent value="invoices">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            style={{ boxShadow: "0 1px 0 0 rgba(0,0,0,0.04), 0 4px 16px -2px rgba(0,0,0,0.07)" }}>
                            <div className="mb-5">
                                <h3 className="font-bold text-slate-900 text-base">Inward Supply — Invoices</h3>
                                <p className="text-xs text-slate-400 mt-0.5">{filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''} found</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {filteredInvoices.map((inv) => (
                                    <div key={inv.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col group hover:shadow-md hover:border-emerald-300 transition-all"
                                        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 0 rgba(0,0,0,0.03)" }}>
                                        <div className={`h-1 w-full ${inv.status === 'Completed' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                        <div className="absolute left-0 top-0 bottom-0 w-[3px]" />

                                        <div className="p-4 border-b border-dashed border-slate-100 bg-gradient-to-br from-emerald-50/50 to-white">
                                            <div className="flex justify-between items-start">
                                                <div className="font-mono font-bold text-base text-emerald-700 tracking-tight">{inv.id}</div>
                                                <Badge className={`text-xs border ${STATUS_BADGE[inv.status] || 'bg-slate-100 text-slate-600 border-slate-300'}`}>{inv.status}</Badge>
                                            </div>
                                            <div className="font-semibold text-slate-800 mt-1.5 text-sm">{inv.supplier}</div>
                                            <div className="text-xs text-slate-400 font-mono mt-1">{inv.date}</div>
                                        </div>

                                        <div className="p-4 flex-1 flex flex-col items-center justify-center py-8 gap-1">
                                            <div className="text-[9px] uppercase tracking-widest font-bold text-slate-400">Invoice Amount</div>
                                            <div className="font-mono font-black text-3xl text-slate-800">{inv.amount === 0 ? "—" : `₨ ${(inv.amount / 1000).toFixed(0)}k`}</div>
                                            <div className="text-xs text-slate-500 font-mono mt-1">{inv.weight}</div>
                                        </div>

                                        <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex justify-end">
                                            <Button size="sm" variant="ghost" className="text-xs text-blue-600 hover:bg-blue-50 rounded-lg">View Details</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* ── RETURNS TAB ── */}
                    <TabsContent value="returns">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            style={{ boxShadow: "0 1px 0 0 rgba(0,0,0,0.04), 0 4px 16px -2px rgba(0,0,0,0.07)" }}>
                            <div className="mb-5">
                                <h3 className="font-bold text-rose-700 text-base">Debit Notes</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Stock returns and financial adjustments</p>
                            </div>
                            {returns.length === 0 ? (
                                <div className="py-16 text-center flex flex-col items-center gap-3 bg-rose-50/30 rounded-xl border border-dashed border-rose-200">
                                    <ArrowUpRight className="h-10 w-10 text-rose-200" />
                                    <p className="font-semibold text-slate-500">No debit notes recorded yet</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                    {returns.map(ret => (
                                        <div key={ret.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col group hover:shadow-md hover:border-rose-300 transition-all"
                                            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                                            <div className="h-1 w-full bg-rose-400" />
                                            <div className="p-4 border-b border-dashed border-slate-100 bg-gradient-to-br from-rose-50/50 to-white">
                                                <div className="font-mono font-bold text-base text-rose-700 tracking-tight">{ret.id}</div>
                                                <div className="font-semibold text-slate-800 mt-1.5 text-sm">{ret.supplier}</div>
                                                <div className="text-xs text-slate-400 font-mono mt-1">{ret.date}</div>
                                                <Badge className="mt-2 bg-rose-100 text-rose-800 border-rose-200 text-xs">{ret.reason}</Badge>
                                            </div>
                                            <div className="p-4 flex-1 flex flex-col items-center justify-center py-8 gap-1">
                                                <div className="text-[9px] uppercase tracking-widest font-bold text-rose-300">Debit Amount</div>
                                                <div className="font-mono font-black text-3xl text-rose-600">₨ {ret.amount.toLocaleString()}</div>
                                            </div>
                                            <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex justify-end">
                                                <Button size="sm" variant="ghost" className="text-xs text-slate-600 hover:bg-slate-100 rounded-lg">
                                                    <Printer className="h-3.5 w-3.5 mr-1" /> Print Note
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}

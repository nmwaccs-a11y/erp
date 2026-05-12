import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, Truck, ShoppingBag, Share2, Undo2, Printer, Lock } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { CreateOrderModal } from "@/components/sales/CreateOrderModal";
import { CreateSalesInvoiceModal } from "@/components/sales/CreateSalesInvoiceModal";
import { DispatchModal } from "@/components/sales/DispatchModal";
import { CreateCreditNoteModal } from "@/components/sales/CreateCreditNoteModal";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { PrintOrderSheet } from "@/components/sales/PrintOrderSheet";

const CUSTOMERS_MAP: Record<string, string> = {
    "CUST-001": "Gateway Motors",
    "CUST-002": "Alpha Wire Supply",
    "CUST-003": "Pak Fans Ltd",
};

const STATUS_BADGE: Record<string, string> = {
    "Pending": "bg-slate-100 text-slate-600 border-slate-300",
    "Partially Fulfilled": "bg-blue-50 text-blue-700 border-blue-300",
    "Closed": "bg-emerald-50 text-emerald-700 border-emerald-300",
    "Paid": "bg-emerald-50 text-emerald-700 border-emerald-300",
    "Dispatched": "bg-amber-50 text-amber-700 border-amber-300",
};

function KpiCard({ label, value, sub, icon: Icon, accent }: { label: string; value: string; sub: string; icon: any; accent: "blue" | "emerald" | "rose" | "purple" }) {
    const colors = {
        blue: { bg: "from-blue-50 via-white to-white", icon: "bg-blue-100 text-blue-700", bar: "bg-blue-400" },
        emerald: { bg: "from-emerald-50 via-white to-white", icon: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-400" },
        rose: { bg: "from-rose-50 via-white to-white", icon: "bg-rose-100 text-rose-700", bar: "bg-rose-400" },
        purple: { bg: "from-purple-50 via-white to-white", icon: "bg-purple-100 text-purple-700", bar: "bg-purple-400" },
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

export default function Sales() {
    const { toast } = useToast();
    const [createOrderOpen, setCreateOrderOpen] = useState(false);
    const [invoiceOpen, setInvoiceOpen] = useState(false);
    const [dispatchOpen, setDispatchOpen] = useState(false);
    const [creditNoteOpen, setCreditNoteOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>(undefined);
    const [printOpen, setPrintOpen] = useState(false);
    const [selectedPrintOrder, setSelectedPrintOrder] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("orders");
    const [searchQuery, setSearchQuery] = useState("");

    const TOLERANCE = 0.02;

    const [orders, setOrders] = useState([
        {
            id: "SO-1001", customer: "Gateway Motors", customerId: "CUST-001", date: "Feb 10, 2026",
            status: "Partially Fulfilled", total_ordered_qty: 5000, total_fulfilled_qty: 2100,
            items: [
                { item: "Copper Wire 8mm", gauge: "28", qty: 3000, rate: 1200, wattaRate: 513 },
                { item: "Copper Strip 12mm", gauge: "12", qty: 2000, rate: 1350, wattaRate: 480 }
            ]
        },
        {
            id: "SO-1002", customer: "Alpha Wire Supply", customerId: "CUST-002", date: "Feb 11, 2026",
            status: "Pending", total_ordered_qty: 2000, total_fulfilled_qty: 0,
            items: [
                { item: "Copper Rod 20mm", gauge: "20", qty: 2000, rate: 1100, wattaRate: 400 }
            ]
        },
        {
            id: "SO-1003", customer: "Beta Transformers", customerId: "CUST-003", date: "Feb 12, 2026",
            status: "Closed", total_ordered_qty: 1500, total_fulfilled_qty: 1500,
            items: [
                { item: "Copper Wire 8mm", gauge: "28", qty: 1500, rate: 1200, wattaRate: 513 }
            ]
        },
    ]);

    const [invoices, setInvoices] = useState([
        { id: "INV-2026-101", customer: "Gateway Motors", date: "Feb 10", amount: "₨ 250,000", status: "Paid" },
    ]);

    const [returns, setReturns] = useState<{ id: string, invoiceId: string, reason: string, amount: string, date: string }[]>([]);

    const handleCreateOrder = (data: any) => {
        const totalQty = data.items?.reduce((s: number, i: any) => s + (i.qty || 0), 0) || 1000;
        const newOrder = {
            id: `SO-${1000 + orders.length + 1}`,
            customer: data.customer === "gateway" ? "Gateway Motors" : "Alpha Wire Supply",
            customerId: data.customer === "gateway" ? "CUST-001" : "CUST-002",
            date: data.deliveryDate || format(new Date(), "PP"),
            status: "Pending",
            total_ordered_qty: totalQty,
            total_fulfilled_qty: 0,
            items: data.items
        };
        setOrders([newOrder, ...orders]);
        toast({ title: "Order Created", description: `Order ${newOrder.id} successfully created.` });
    };

    const recalcOrderStatus = (orderId: string, invoiceNetWt: number) => {
        setOrders(prev => prev.map(o => {
            if (o.id !== orderId) return o;
            const newFulfilled = o.total_fulfilled_qty + invoiceNetWt;
            let newStatus = newFulfilled <= 0 ? "Pending"
                : newFulfilled >= o.total_ordered_qty * (1 - TOLERANCE) ? "Closed"
                    : "Partially Fulfilled";
            return { ...o, total_fulfilled_qty: newFulfilled, status: newStatus };
        }));
    };

    const handleForceClose = (orderId: string) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "Closed" } : o));
        toast({ title: "Order Force Closed", description: `${orderId} has been manually closed.` });
    };

    const handleGenerateInvoice = (data: any) => {
        const customerName = data.header?.customerId ? CUSTOMERS_MAP[data.header.customerId] || "Walk-In" : "Walk-In";
        const newInv = {
            id: `INV-2026-${102 + invoices.length}`,
            customer: customerName,
            date: format(new Date(), "MMM dd"),
            amount: `₨ ${data.totals.finalTotal.toLocaleString()}`,
            status: "Pending",
            linkedOrderId: data.header?.linkedOrderId || null,
        };
        setInvoices([newInv, ...invoices]);
        if (newInv.linkedOrderId) recalcOrderStatus(newInv.linkedOrderId, data.totals?.totalNetWeight || 0);
        toast({ title: "Invoice Posted", description: `Invoice ${newInv.id} generated.` });
    };

    const handleDispatch = (data: any) => {
        setOrders(orders.map(o => o.id === data.orderId ? { ...o, status: "Dispatched", progress: 100 } : o));
        toast({ title: "Dispatch Challan Created", description: `OGP generated for ${data.orderId}.` });
    };

    const handleCreditNote = (data: any) => {
        setReturns([...returns, {
            id: data.header.returnId,
            invoiceId: data.header.originalInv || "N/A",
            reason: data.header.returnAction === "restock" ? "Restock (FG)" : "Scrap",
            amount: `₨ ${data.totalCreditAmount.toLocaleString()}`,
            date: data.header.date ? new Date(data.header.date).toLocaleDateString() : "Today"
        }]);
        toast({ title: "Credit Note Issued", description: `Return processed for ${data.header.returnId}.` });
    };

    const handleShare = (id: string) => {
        toast({ title: "Shared via WhatsApp", description: `Invoice ${id} link sent to customer.` });
    };

    const openDispatchForOrder = (orderId: string) => {
        setSelectedOrderId(orderId);
        setDispatchOpen(true);
    };

    const handlePrintOrder = (order: any) => {
        setSelectedPrintOrder(order);
        setPrintOpen(true);
    };

    const filteredOrders = orders.filter(o => !searchQuery || o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.customer.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredInvoices = invoices.filter(i => !searchQuery || i.id.toLowerCase().includes(searchQuery.toLowerCase()) || i.customer.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* ── HEADER ── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Sales & Dispatch</p>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Sales</h1>
                        <p className="text-slate-500 mt-1 text-sm">Manage orders, specific invoicing (Direct/Premium), and delivery.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {activeTab === 'returns' && (
                            <Button className="h-9 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md" onClick={() => setCreditNoteOpen(true)}
                                style={{ boxShadow: "0 4px 12px rgba(225,29,72,0.30)" }}>
                                <Undo2 className="h-4 w-4 mr-2" /> Credit Note
                            </Button>
                        )}
                        {activeTab === 'invoices' && (
                            <Button className="h-9 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md" onClick={() => setInvoiceOpen(true)}
                                style={{ boxShadow: "0 4px 12px rgba(5,150,105,0.30)" }}>
                                <FileText className="h-4 w-4 mr-2" /> Direct Invoice
                            </Button>
                        )}
                        {activeTab === 'orders' && (
                            <Button className="h-9 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md" onClick={() => setCreateOrderOpen(true)}
                                style={{ boxShadow: "0 4px 12px rgba(37,99,235,0.30)" }}>
                                <Plus className="h-4 w-4 mr-2" /> New Sales Order
                            </Button>
                        )}
                    </div>
                </div>

                {/* ── KPI ROW ── */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <KpiCard label="Pending Orders" value="12 Orders" sub="Value: ₨ 4.2M" icon={ShoppingBag} accent="blue" />
                    <KpiCard label="Ready for Dispatch" value="3 Loads" sub="Scheduled for today" icon={Truck} accent="emerald" />
                    <KpiCard label="Sales This Month" value="₨ 68.5M" sub="+12% vs last month" icon={FileText} accent="purple" />
                </div>

                {/* ── MODALS ── */}
                <CreateOrderModal open={createOrderOpen} onOpenChange={setCreateOrderOpen} onSubmit={handleCreateOrder} />
                <CreateSalesInvoiceModal open={invoiceOpen} onOpenChange={setInvoiceOpen} onSubmit={handleGenerateInvoice} pendingOrders={orders.filter(o => o.status === 'Pending' || o.status === 'Partially Fulfilled')} />
                <DispatchModal open={dispatchOpen} onOpenChange={setDispatchOpen} onSubmit={handleDispatch} orderId={selectedOrderId} />
                <CreateCreditNoteModal open={creditNoteOpen} onOpenChange={setCreditNoteOpen} onSubmit={handleCreditNote} />
                <PrintOrderSheet open={printOpen} onOpenChange={setPrintOpen} order={selectedPrintOrder} />

                {/* ── TABS ── */}
                <Tabs defaultValue="orders" onValueChange={(v) => { setActiveTab(v); setSearchQuery(""); }} className="space-y-5">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <TabsList className="bg-slate-100/80 p-1 rounded-xl border border-slate-200 h-auto">
                            <TabsTrigger value="orders" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 px-5 py-2 text-sm font-semibold gap-2">
                                <ShoppingBag className="h-3.5 w-3.5" /> Sales Orders
                            </TabsTrigger>
                            <TabsTrigger value="invoices" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700 px-5 py-2 text-sm font-semibold gap-2">
                                <FileText className="h-3.5 w-3.5" /> Invoices
                            </TabsTrigger>
                            <TabsTrigger value="dispatch" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-amber-700 px-5 py-2 text-sm font-semibold gap-2">
                                <Truck className="h-3.5 w-3.5" /> Dispatch Challans
                            </TabsTrigger>
                            <TabsTrigger value="returns" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-rose-700 px-5 py-2 text-sm font-semibold gap-2">
                                <Undo2 className="h-3.5 w-3.5" /> Returns
                            </TabsTrigger>
                        </TabsList>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                className="pl-9 h-10 w-64 rounded-xl bg-white border-slate-200 shadow-sm text-sm"
                                placeholder="Search ID, customer..." />
                        </div>
                    </div>

                    {/* ── ORDERS TAB ── */}
                    <TabsContent value="orders">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            style={{ boxShadow: "0 1px 0 0 rgba(0,0,0,0.04), 0 4px 16px -2px rgba(0,0,0,0.07)" }}>
                            <div className="mb-5">
                                <h3 className="font-bold text-slate-900 text-base">Active Sales Orders</h3>
                                <p className="text-xs text-slate-400 mt-0.5">{filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {filteredOrders.map((order) => (
                                    <div key={order.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col group hover:shadow-md hover:border-blue-300 transition-all"
                                        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 0 rgba(0,0,0,0.03)" }}>
                                        <div className={`h-1 w-full ${order.status === 'Closed' ? 'bg-emerald-400' : order.status === 'Partially Fulfilled' ? 'bg-blue-400' : 'bg-slate-300'}`} />

                                        <div className="p-4 border-b border-dashed border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                                            <div className="flex justify-between items-start">
                                                <div className="font-mono font-bold text-base text-blue-700 tracking-tight">{order.id}</div>
                                                <Badge variant="outline" className={`text-xs shadow-sm ${STATUS_BADGE[order.status] || ''}`}>{order.status}</Badge>
                                            </div>
                                            <div className="font-semibold text-slate-800 mt-1.5 text-sm">{order.customer}</div>
                                            <div className="text-xs text-slate-400 font-mono mt-1">{order.date}</div>
                                        </div>

                                        <div className="p-4 flex-1 space-y-3 relative">
                                            {order.status === "Closed" && (
                                                <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
                                                    <div className="border-4 border-emerald-500 text-emerald-500 text-4xl font-black uppercase tracking-widest p-2 -rotate-12 rounded-lg">FULFILLED</div>
                                                </div>
                                            )}
                                            <div>
                                                <div className="flex justify-between text-xs mb-1.5">
                                                    <span className="uppercase tracking-widest font-bold text-slate-400 text-[9px]">Fulfillment</span>
                                                    <span className="font-bold text-slate-700">{Math.min(100, Math.round((order.total_fulfilled_qty / order.total_ordered_qty) * 100))}%</span>
                                                </div>
                                                <Progress value={Math.min(100, (order.total_fulfilled_qty / order.total_ordered_qty) * 100)} className="h-1.5" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                    <div className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mb-1">Ordered</div>
                                                    <div className="font-mono font-bold text-slate-700 text-sm">{order.total_ordered_qty.toLocaleString()} <span className="text-[9px] text-slate-400">kg</span></div>
                                                </div>
                                                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                    <div className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mb-1">Fulfilled</div>
                                                    <div className="font-mono font-bold text-emerald-600 text-sm">{order.total_fulfilled_qty.toLocaleString()} <span className="text-[9px] text-emerald-400">kg</span></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex gap-2">
                                                {order.status !== "Closed" && order.status !== "Canceled" && (
                                                    <Button size="sm" variant="outline" className="h-8 text-xs rounded-lg text-blue-700 border-blue-200 hover:bg-blue-50" onClick={() => openDispatchForOrder(order.id)}>
                                                        <Truck className="h-3 w-3 mr-1" /> Dispatch
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="flex gap-1">
                                                {order.status !== "Closed" && order.status !== "Canceled" && (
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-amber-600 hover:bg-amber-50 hover:text-amber-700 rounded-lg" onClick={() => handleForceClose(order.id)} title="Force Close">
                                                        <Lock className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-700 rounded-lg" onClick={() => handlePrintOrder(order)} title="Print">
                                                    <Printer className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
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
                                <h3 className="font-bold text-slate-900 text-base">Recent Invoices</h3>
                                <p className="text-xs text-slate-400 mt-0.5">{filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''} found</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {filteredInvoices.map((inv) => (
                                    <div key={inv.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col group hover:shadow-md hover:border-emerald-300 transition-all"
                                        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 0 rgba(0,0,0,0.03)" }}>
                                        <div className={`h-1 w-full ${inv.status === 'Paid' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                                        <div className="absolute left-0 top-0 bottom-0 w-[3px]" />

                                        <div className="p-4 border-b border-dashed border-slate-100 bg-gradient-to-br from-emerald-50/50 to-white">
                                            <div className="flex justify-between items-start">
                                                <div className="font-mono font-bold text-base text-emerald-700 tracking-tight">{inv.id}</div>
                                                <Badge className={`text-xs border ${STATUS_BADGE[inv.status] || 'bg-slate-100 text-slate-600 border-slate-300'}`}>{inv.status}</Badge>
                                            </div>
                                            <div className="font-semibold text-slate-800 mt-1.5 text-sm">{inv.customer}</div>
                                            <div className="text-xs text-slate-400 font-mono mt-1">{inv.date}</div>
                                        </div>

                                        <div className="p-4 flex-1 flex flex-col items-center justify-center py-8 gap-1">
                                            <div className="text-[9px] uppercase tracking-widest font-bold text-slate-400">Invoice Total</div>
                                            <div className="font-mono font-black text-3xl text-slate-800">{inv.amount}</div>
                                        </div>

                                        <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex justify-end">
                                            <Button size="sm" variant="ghost" className="text-xs text-blue-600 hover:bg-blue-50 rounded-lg" onClick={() => handleShare(inv.id)}>
                                                <Share2 className="h-3.5 w-3.5 mr-1" /> Share
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* ── DISPATCH TAB ── */}
                    <TabsContent value="dispatch">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            style={{ boxShadow: "0 1px 0 0 rgba(0,0,0,0.04), 0 4px 16px -2px rgba(0,0,0,0.07)" }}>
                            <div className="mb-5">
                                <h3 className="font-bold text-slate-900 text-base">Recent Dispatches (OGP)</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col group hover:shadow-md hover:border-amber-300 transition-all"
                                    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                                    <div className="h-1 w-full bg-amber-400" />
                                    <div className="p-4 border-b border-dashed border-slate-100 bg-gradient-to-br from-amber-50/50 to-white">
                                        <div className="flex justify-between items-start">
                                            <div className="font-mono font-bold text-base text-amber-700 tracking-tight">OGP-8842</div>
                                            <Badge className="text-xs border bg-emerald-100 text-emerald-800 shadow-sm">Left Factory</Badge>
                                        </div>
                                        <div className="text-xs text-slate-400 font-mono mt-1">Today, 10:30 AM</div>
                                    </div>
                                    <div className="p-4 flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-50 p-2 rounded-lg"><ShoppingBag className="h-4 w-4 text-blue-600" /></div>
                                            <div>
                                                <div className="text-[9px] uppercase tracking-widest font-bold text-slate-400">Order Link</div>
                                                <div className="font-mono font-bold text-slate-700 text-sm">SO-1003</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-50 p-2 rounded-lg"><Truck className="h-4 w-4 text-slate-600" /></div>
                                            <div>
                                                <div className="text-[9px] uppercase tracking-widest font-bold text-slate-400">Vehicle & Driver</div>
                                                <div className="font-bold text-slate-800 text-sm">LEA-9921 <span className="font-normal text-slate-500">({`Muhammad Aslam`})</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex justify-end">
                                        <Button size="sm" variant="ghost" className="text-xs text-slate-600 hover:bg-slate-100 rounded-lg">
                                            <Printer className="h-3.5 w-3.5 mr-1" /> Print Gate Pass
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* ── RETURNS TAB ── */}
                    <TabsContent value="returns">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            style={{ boxShadow: "0 1px 0 0 rgba(0,0,0,0.04), 0 4px 16px -2px rgba(0,0,0,0.07)" }}>
                            <div className="mb-5">
                                <h3 className="font-bold text-rose-700 text-base">Sales Returns (Credit Notes)</h3>
                            </div>
                            {returns.length === 0 ? (
                                <div className="py-16 text-center flex flex-col items-center gap-3 bg-rose-50/30 rounded-xl border border-dashed border-rose-200">
                                    <Undo2 className="h-10 w-10 text-rose-200" />
                                    <p className="font-semibold text-slate-500">No returns recorded</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                    {returns.map(ret => (
                                        <div key={ret.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col group hover:shadow-md hover:border-rose-300 transition-all"
                                            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                                            <div className="h-1 w-full bg-rose-400" />
                                            <div className="p-4 border-b border-dashed border-slate-100 bg-gradient-to-br from-rose-50/50 to-white">
                                                <div className="flex justify-between items-start">
                                                    <div className="font-mono font-bold text-base text-rose-700 tracking-tight">{ret.id}</div>
                                                    <Badge className="text-xs border bg-rose-100 text-rose-800 shadow-sm">{ret.reason}</Badge>
                                                </div>
                                                <div className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mt-2 mb-0.5">Original Invoice</div>
                                                <div className="text-sm font-mono font-bold text-slate-700">{ret.invoiceId}</div>
                                                <div className="text-xs text-slate-400 font-mono mt-1">{ret.date}</div>
                                            </div>
                                            <div className="p-4 flex-1 flex flex-col items-center justify-center py-8 gap-1">
                                                <div className="text-[9px] uppercase tracking-widest font-bold text-rose-300">Credit Amount</div>
                                                <div className="font-mono font-black text-3xl text-rose-600">-{ret.amount}</div>
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

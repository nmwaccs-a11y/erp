import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    const iconColors = {
        blue: "text-blue-500",
        emerald: "text-emerald-500",
        rose: "text-rose-500",
        purple: "text-purple-500",
    }[accent];

    return (
        <Card className="shadow-soft border-slate-100 bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                <Icon className={`h-4 w-4 ${iconColors}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-slate-500">{sub}</p>
            </CardContent>
        </Card>
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
            <div className="space-y-6">
                {/* ── HEADER ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sales</h1>
                        <p className="text-slate-500">Manage orders, specific invoicing (Direct/Premium), and delivery.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {activeTab === 'returns' && (
                            <Button className="bg-blue-600 hover:bg-blue-700 shadow-soft" onClick={() => setCreditNoteOpen(true)}>
                                <Undo2 className="h-4 w-4 mr-2" /> Credit Note
                            </Button>
                        )}
                        {activeTab === 'invoices' && (
                            <Button className="bg-blue-600 hover:bg-blue-700 shadow-soft" onClick={() => setInvoiceOpen(true)}>
                                <FileText className="h-4 w-4 mr-2" /> Direct Invoice
                            </Button>
                        )}
                        {activeTab === 'orders' && (
                            <Button className="bg-blue-600 hover:bg-blue-700 shadow-soft" onClick={() => setCreateOrderOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" /> New Sales Order
                            </Button>
                        )}
                    </div>
                </div>

                {/* ── KPI ROW ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <Tabs defaultValue="orders" onValueChange={(v) => { setActiveTab(v); setSearchQuery(""); }} className="space-y-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <TabsList className="bg-slate-100 p-1">
                            <TabsTrigger value="orders" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <ShoppingBag className="h-4 w-4 mr-2" /> Sales Orders
                            </TabsTrigger>
                            <TabsTrigger value="invoices" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <FileText className="h-4 w-4 mr-2" /> Invoices
                            </TabsTrigger>
                            <TabsTrigger value="dispatch" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <Truck className="h-4 w-4 mr-2" /> Dispatch Challans
                            </TabsTrigger>
                            <TabsTrigger value="returns" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <Undo2 className="h-4 w-4 mr-2" /> Returns
                            </TabsTrigger>
                        </TabsList>

                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                            <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                className="pl-9 w-[250px]"
                                placeholder="Search ID, customer..." />
                        </div>
                    </div>

                    {/* ── ORDERS TAB ── */}
                    <TabsContent value="orders">
                        <Card className="shadow-soft border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-slate-200">
                            <CardHeader>
                                <CardTitle>Active Sales Orders</CardTitle>
                                <CardDescription>{filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {filteredOrders.map((order) => (
                                        <Card key={order.id} className="shadow-soft border-slate-100 bg-white overflow-hidden flex flex-col">
                                            <div className={`h-1 w-full ${order.status === 'Closed' ? 'bg-emerald-500' : order.status === 'Partially Fulfilled' ? 'bg-blue-500' : 'bg-slate-300'}`} />
                                            <CardHeader className="p-4 pb-2 border-b border-slate-50">
                                                <div className="flex justify-between items-start">
                                                    <div className="font-mono font-bold text-sm">{order.id}</div>
                                                    <Badge variant="outline" className={`text-xs ${STATUS_BADGE[order.status] || ''}`}>{order.status}</Badge>
                                                </div>
                                                <CardTitle className="text-base mt-2">{order.customer}</CardTitle>
                                                <CardDescription className="font-mono text-xs">{order.date}</CardDescription>
                                            </CardHeader>

                                            <CardContent className="p-4 flex-1 space-y-4">
                                                <div>
                                                    <div className="flex justify-between text-xs mb-1.5">
                                                        <span className="text-slate-500">Fulfillment</span>
                                                        <span className="font-medium text-slate-700">{Math.min(100, Math.round((order.total_fulfilled_qty / order.total_ordered_qty) * 100))}%</span>
                                                    </div>
                                                    <Progress value={Math.min(100, (order.total_fulfilled_qty / order.total_ordered_qty) * 100)} className="h-2" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <div className="text-xs text-slate-500">Ordered</div>
                                                        <div className="font-medium">{order.total_ordered_qty.toLocaleString()} kg</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-slate-500">Fulfilled</div>
                                                        <div className="font-medium text-emerald-600">{order.total_fulfilled_qty.toLocaleString()} kg</div>
                                                    </div>
                                                </div>
                                            </CardContent>

                                            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                                <div className="flex gap-2">
                                                    {order.status !== "Closed" && order.status !== "Canceled" && (
                                                        <Button size="sm" variant="outline" className="text-xs" onClick={() => openDispatchForOrder(order.id)}>
                                                            <Truck className="h-3 w-3 mr-2" /> Dispatch
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="flex gap-1">
                                                    {order.status !== "Closed" && order.status !== "Canceled" && (
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-amber-600" onClick={() => handleForceClose(order.id)} title="Force Close">
                                                            <Lock className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500" onClick={() => handlePrintOrder(order)} title="Print">
                                                        <Printer className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ── INVOICES TAB ── */}
                    <TabsContent value="invoices">
                        <Card className="shadow-soft border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-slate-200">
                            <CardHeader>
                                <CardTitle>Recent Invoices</CardTitle>
                                <CardDescription>{filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''} found</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {filteredInvoices.map((inv) => (
                                        <Card key={inv.id} className="shadow-soft border-slate-100 bg-white overflow-hidden flex flex-col">
                                            <div className={`h-1 w-full ${inv.status === 'Paid' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                            <CardHeader className="p-4 pb-2 border-b border-slate-50">
                                                <div className="flex justify-between items-start">
                                                    <div className="font-mono font-bold text-sm">{inv.id}</div>
                                                    <Badge variant="outline" className={`text-xs ${STATUS_BADGE[inv.status] || ''}`}>{inv.status}</Badge>
                                                </div>
                                                <CardTitle className="text-base mt-2">{inv.customer}</CardTitle>
                                                <CardDescription className="font-mono text-xs">{inv.date}</CardDescription>
                                            </CardHeader>

                                            <CardContent className="p-4 flex-1 flex flex-col items-center justify-center py-6">
                                                <div className="text-xs text-slate-500 mb-1">Invoice Total</div>
                                                <div className="font-bold text-2xl">{inv.amount}</div>
                                            </CardContent>

                                            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                                                <Button size="sm" variant="ghost" className="text-xs text-blue-600" onClick={() => handleShare(inv.id)}>
                                                    <Share2 className="h-4 w-4 mr-2" /> Share
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ── DISPATCH TAB ── */}
                    <TabsContent value="dispatch">
                        <Card className="shadow-soft border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-slate-200">
                            <CardHeader>
                                <CardTitle>Recent Dispatches (OGP)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    <Card className="shadow-soft border-slate-100 bg-white overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-slate-200">
                                        <div className="h-1 w-full bg-amber-500" />
                                        <CardHeader className="p-4 pb-2 border-b border-slate-50">
                                            <div className="flex justify-between items-start">
                                                <div className="font-mono font-bold text-sm text-amber-700">OGP-8842</div>
                                                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">Left Factory</Badge>
                                            </div>
                                            <CardDescription className="font-mono text-xs mt-2">Today, 10:30 AM</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-4 flex-1 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-slate-50 p-2 rounded-lg"><ShoppingBag className="h-4 w-4 text-slate-500" /></div>
                                                <div>
                                                    <div className="text-xs text-slate-500">Order Link</div>
                                                    <div className="font-medium text-sm">SO-1003</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="bg-slate-50 p-2 rounded-lg"><Truck className="h-4 w-4 text-slate-500" /></div>
                                                <div>
                                                    <div className="text-xs text-slate-500">Vehicle & Driver</div>
                                                    <div className="font-medium text-sm">LEA-9921 <span className="text-slate-400 font-normal">(Muhammad Aslam)</span></div>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                                            <Button size="sm" variant="ghost" className="text-xs">
                                                <Printer className="h-4 w-4 mr-2" /> Print Gate Pass
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ── RETURNS TAB ── */}
                    <TabsContent value="returns">
                        <Card className="shadow-soft border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-slate-200">
                            <CardHeader>
                                <CardTitle>Sales Returns (Credit Notes)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {returns.length === 0 ? (
                                    <div className="py-16 text-center text-slate-500">
                                        No returns recorded.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {returns.map(ret => (
                                            <Card key={ret.id} className="shadow-soft border-slate-100 bg-white overflow-hidden flex flex-col">
                                                <div className="h-1 w-full bg-rose-500" />
                                                <CardHeader className="p-4 pb-2 border-b border-slate-50">
                                                    <div className="flex justify-between items-start">
                                                        <div className="font-mono font-bold text-sm text-rose-700">{ret.id}</div>
                                                        <Badge variant="outline" className="text-xs bg-rose-50 text-rose-700 border-rose-200">{ret.reason}</Badge>
                                                    </div>
                                                    <div className="text-xs text-slate-500 mt-2">Original Invoice</div>
                                                    <div className="text-sm font-medium">{ret.invoiceId}</div>
                                                    <CardDescription className="font-mono text-xs mt-1">{ret.date}</CardDescription>
                                                </CardHeader>
                                                <CardContent className="p-4 flex-1 flex flex-col items-center justify-center py-6">
                                                    <div className="text-xs text-slate-500 mb-1">Credit Amount</div>
                                                    <div className="font-bold text-2xl text-rose-600">-{ret.amount}</div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}

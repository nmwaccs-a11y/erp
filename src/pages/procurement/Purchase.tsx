import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    const iconColors = {
        blue: "text-blue-500",
        emerald: "text-emerald-500",
        rose: "text-rose-500",
        amber: "text-amber-500",
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
            <div className="space-y-6">
                {/* ── HEADER ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Procurement</h1>
                        <p className="text-slate-500">Manage Purchase Orders, Invoices, and Supplier Returns</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {activeTab === 'orders' && (
                            <Button className="bg-blue-600 hover:bg-blue-700 shadow-soft" onClick={() => setPoOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" /> New Order
                            </Button>
                        )}
                        {activeTab === 'invoices' && (
                            <Button className="bg-blue-600 hover:bg-blue-700 shadow-soft" onClick={() => setInvoiceOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" /> New Invoice
                            </Button>
                        )}
                        {activeTab === 'returns' && (
                            <Button className="bg-blue-600 hover:bg-blue-700 shadow-soft" onClick={() => setReturnOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" /> New Return
                            </Button>
                        )}
                    </div>
                </div>

                {/* ── KPI ROW ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <Tabs defaultValue="orders" onValueChange={(v) => { setActiveTab(v); setSearchQuery(""); }} className="space-y-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <TabsList className="bg-slate-100 p-1">
                            <TabsTrigger value="orders" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <ShoppingCart className="h-4 w-4 mr-2" /> Purchase Orders
                            </TabsTrigger>
                            <TabsTrigger value="invoices" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <ArrowDownLeft className="h-4 w-4 mr-2" /> Inward Supply
                            </TabsTrigger>
                            <TabsTrigger value="returns" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <ArrowUpRight className="h-4 w-4 mr-2" /> Debit Notes
                            </TabsTrigger>
                        </TabsList>

                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                            <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                className="pl-9 w-[250px]"
                                placeholder="Search ID, supplier..." />
                        </div>
                    </div>

                    {/* ── ORDERS TAB ── */}
                    <TabsContent value="orders">
                        <Card className="shadow-soft border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-slate-200">
                            <CardHeader>
                                <CardTitle>Active Purchase Orders</CardTitle>
                                <CardDescription>{filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {filteredOrders.map((po) => (
                                        <Card key={po.id} className="shadow-soft border-slate-100 bg-white overflow-hidden flex flex-col">
                                            <div className={`h-1 w-full ${po.status === 'Closed' ? 'bg-emerald-500' : po.status === 'Partially Fulfilled' ? 'bg-blue-500' : 'bg-slate-300'}`} />
                                            <CardHeader className="p-4 pb-2 border-b border-slate-50">
                                                <div className="flex justify-between items-start">
                                                    <div className="font-mono font-bold text-sm">{po.id}</div>
                                                    <Badge variant="outline" className={`text-xs ${STATUS_BADGE[po.status] || ''}`}>{po.status}</Badge>
                                                </div>
                                                <CardTitle className="text-base mt-2">{po.supplier}</CardTitle>
                                                <CardDescription className="font-mono text-xs">{po.date}</CardDescription>
                                            </CardHeader>

                                            <CardContent className="p-4 flex-1 space-y-4">
                                                <div>
                                                    <div className="flex justify-between text-xs mb-1.5">
                                                        <span className="text-slate-500">Fulfillment</span>
                                                        <span className="font-medium text-slate-700">{Math.min(100, Math.round((po.total_fulfilled_qty / po.total_ordered_qty) * 100))}%</span>
                                                    </div>
                                                    <Progress value={Math.min(100, (po.total_fulfilled_qty / po.total_ordered_qty) * 100)} className="h-2" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <div className="text-xs text-slate-500">Ordered</div>
                                                        <div className="font-medium">{po.total_ordered_qty.toLocaleString()} kg</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-slate-500">Value</div>
                                                        <div className="font-medium">₨ {(po.amount / 1000000).toFixed(1)}M</div>
                                                    </div>
                                                </div>
                                            </CardContent>

                                            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                                {po.status !== "Closed" ? (
                                                    <Button size="sm" variant="outline" className="text-xs"
                                                        onClick={() => handleForceClose(po.id)}>
                                                        <Lock className="h-3 w-3 mr-2" /> Close
                                                    </Button>
                                                ) : <div />}
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500"
                                                    onClick={() => { setSelectedPrintOrder(po); setPrintOpen(true); }}>
                                                    <Printer className="h-4 w-4" />
                                                </Button>
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
                                <CardTitle>Inward Supply — Invoices</CardTitle>
                                <CardDescription>{filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''} found</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {filteredInvoices.map((inv) => (
                                        <Card key={inv.id} className="shadow-soft border-slate-100 bg-white overflow-hidden flex flex-col">
                                            <div className={`h-1 w-full ${inv.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                            <CardHeader className="p-4 pb-2 border-b border-slate-50">
                                                <div className="flex justify-between items-start">
                                                    <div className="font-mono font-bold text-sm">{inv.id}</div>
                                                    <Badge className={`text-xs border ${STATUS_BADGE[inv.status] || 'bg-slate-100 text-slate-600 border-slate-300'}`}>{inv.status}</Badge>
                                                </div>
                                                <CardTitle className="text-base mt-2">{inv.supplier}</CardTitle>
                                                <CardDescription className="font-mono text-xs">{inv.date}</CardDescription>
                                            </CardHeader>

                                            <CardContent className="p-4 flex-1 flex flex-col items-center justify-center py-6">
                                                <div className="text-xs text-slate-500 mb-1">Invoice Amount</div>
                                                <div className="font-bold text-2xl">{inv.amount === 0 ? "—" : `₨ ${(inv.amount / 1000).toFixed(0)}k`}</div>
                                                <div className="text-xs text-slate-500 mt-1">{inv.weight}</div>
                                            </CardContent>

                                            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                                                <Button size="sm" variant="ghost" className="text-xs">View Details</Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ── RETURNS TAB ── */}
                    <TabsContent value="returns">
                        <Card className="shadow-soft border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-slate-200">
                            <CardHeader>
                                <CardTitle>Debit Notes</CardTitle>
                                <CardDescription>Stock returns and financial adjustments</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {returns.length === 0 ? (
                                    <div className="py-16 text-center text-slate-500">
                                        No debit notes recorded yet.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {returns.map(ret => (
                                            <Card key={ret.id} className="shadow-soft border-slate-100 bg-white overflow-hidden flex flex-col">
                                                <div className="h-1 w-full bg-rose-500" />
                                                <CardHeader className="p-4 pb-2 border-b border-slate-50">
                                                    <div className="font-mono font-bold text-sm">{ret.id}</div>
                                                    <CardTitle className="text-base mt-2">{ret.supplier}</CardTitle>
                                                    <CardDescription className="font-mono text-xs">{ret.date}</CardDescription>
                                                    <Badge variant="outline" className="mt-2 w-fit bg-slate-50 text-slate-700">{ret.reason}</Badge>
                                                </CardHeader>
                                                <CardContent className="p-4 flex-1 flex flex-col items-center justify-center py-6">
                                                    <div className="text-xs text-slate-500 mb-1">Debit Amount</div>
                                                    <div className="font-bold text-2xl">₨ {ret.amount.toLocaleString()}</div>
                                                </CardContent>
                                                <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                                                    <Button size="sm" variant="ghost" className="text-xs">
                                                        <Printer className="h-4 w-4 mr-2" /> Print Note
                                                    </Button>
                                                </div>
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

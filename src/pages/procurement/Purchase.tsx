import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, FileText, ArrowUpRight, ArrowDownLeft, Filter, ShoppingCart, Printer, Lock, ArrowDownToLine } from "lucide-react";
import { useState } from "react";
import { PurchaseInvoiceModal } from "@/components/procurement/PurchaseInvoiceModal";
import { PurchaseReturnModal } from "@/components/procurement/PurchaseReturnModal";
import { CreatePOModal } from "@/components/procurement/CreatePOModal";
import { PrintPOSheet } from "@/components/procurement/PrintPOSheet";
import { useToast } from "@/components/ui/use-toast";

export default function Purchase() {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("orders");
    const [invoiceOpen, setInvoiceOpen] = useState(false);
    const [returnOpen, setReturnOpen] = useState(false);
    const [poOpen, setPoOpen] = useState(false);
    const [printOpen, setPrintOpen] = useState(false);
    const [selectedPrintOrder, setSelectedPrintOrder] = useState<any>(null);

    const TOLERANCE = 0.02; // 2% market tolerance

    // Mock Data for POs with fulfillment tracking
    const [orders, setOrders] = useState<any[]>([
        {
            id: "PO-2026-101",
            date: "2026-02-15",
            supplier: "Alpha Wire Supply",
            supplierId: "sup-001",
            items: [
                { item: "Copper Cathode", qty: 20000, rate: 260 }
            ],
            amount: 5200000,
            status: "Pending",
            total_ordered_qty: 20000,
            total_fulfilled_qty: 0,
        },
        {
            id: "PO-2026-100",
            date: "2026-02-10",
            supplier: "Beta Transformers",
            supplierId: "sup-002",
            items: [
                { item: "Mixed Scrap", qty: 5000, rate: 220 }
            ],
            amount: 1100000,
            status: "Partially Fulfilled",
            total_ordered_qty: 5000,
            total_fulfilled_qty: 3200,
        },
    ]);

    // Mock Data for Invoices
    const [invoices, setInvoices] = useState<{ id: string, date: string, supplier: string, amount: number, status: string, weight: string, linkedPOId?: string | null }[]>([
        { id: "PUR-2026-001", date: "2026-02-14", supplier: "New Age Copper", amount: 450000, status: "Pending Rate", weight: "5,000 kg", linkedPOId: null },
        { id: "PUR-2026-002", date: "2026-02-13", supplier: "Metal Exchange", amount: 120000, status: "Completed", weight: "1,200 kg", linkedPOId: null },
    ]);

    // Mock Data for Returns
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
            status: "Pending",
            total_ordered_qty: totalQty,
            total_fulfilled_qty: 0,
        };
        setOrders([newOrder, ...orders]);
        toast({ title: "Purchase Order Created", description: `Order ${newOrder.id} successfully created.` });
    };

    const handlePrintOrder = (order: any) => {
        setSelectedPrintOrder(order);
        setPrintOpen(true);
    };

    // STATE CALCULATION ENGINE for PO
    const recalcPOStatus = (poId: string, invoiceNetWt: number) => {
        setOrders(prev => prev.map(o => {
            if (o.id !== poId) return o;
            const newFulfilled = o.total_fulfilled_qty + invoiceNetWt;
            let newStatus = "Pending";
            if (newFulfilled <= 0) newStatus = "Pending";
            else if (newFulfilled >= o.total_ordered_qty * (1 - TOLERANCE)) newStatus = "Closed";
            else newStatus = "Partially Fulfilled";
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

        // Run State Calculation Engine if linked to a PO
        if (data.header.linkedPOId) {
            const invoiceNetWt = data.items.reduce((s: number, i: any) => s + i.netWeight, 0);
            recalcPOStatus(data.header.linkedPOId, invoiceNetWt);
        }

        let desc = `Invoice ${data.header.invoiceId} posted.`;
        if (data.header.linkedPOId) desc += ` Linked to ${data.header.linkedPOId}.`;
        toast({ title: "Invoice Posted", description: desc });
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

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Purchase</h1>
                        <p className="text-slate-500 mt-1">Manage Orders, Invoices, and Returns.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {activeTab === 'orders' && (
                            <Button className="bg-blue-600 hover:bg-blue-700 shadow-soft" onClick={() => setPoOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                New Order
                            </Button>
                        )}
                        {activeTab === 'invoices' && (
                            <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-soft" onClick={() => setInvoiceOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                New Invoice
                            </Button>
                        )}
                        {activeTab === 'returns' && (
                            <Button className="bg-rose-600 hover:bg-rose-700 shadow-soft" onClick={() => setReturnOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                New Return
                            </Button>
                        )}
                    </div>
                </div>

                <CreatePOModal open={poOpen} onOpenChange={setPoOpen} onSubmit={handleCreateOrder} />
                <PurchaseInvoiceModal open={invoiceOpen} onOpenChange={setInvoiceOpen} onSubmit={handleInvoiceSubmit} pendingPOs={orders.filter(o => o.status === 'Pending' || o.status === 'Partially Fulfilled')} />
                <PurchaseReturnModal open={returnOpen} onOpenChange={setReturnOpen} onSubmit={handleReturnSubmit} />
                <PrintPOSheet open={printOpen} onOpenChange={setPrintOpen} order={selectedPrintOrder} />

                <Tabs defaultValue="orders" className="space-y-4" onValueChange={setActiveTab}>
                    <TabsList className="bg-slate-100 p-1 w-full sm:w-auto grid grid-cols-3 sm:flex">
                        <TabsTrigger value="orders" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">
                            <ShoppingCart className="h-4 w-4 mr-2 text-blue-500" />
                            Purchase Orders
                        </TabsTrigger>
                        <TabsTrigger value="invoices" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">
                            <ArrowDownLeft className="h-4 w-4 mr-2 text-emerald-500" />
                            Invoices (Stock In)
                        </TabsTrigger>
                        <TabsTrigger value="returns" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">
                            <ArrowUpRight className="h-4 w-4 mr-2 text-rose-500" />
                            Returns (Debit Note)
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="orders">
                        <Card className="border-slate-200 shadow-soft">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Purchase Orders</CardTitle>
                                        <CardDescription>Active orders to suppliers.</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                            <Input className="pl-9 w-[250px] bg-slate-50 border-slate-200" placeholder="Search orders..." />
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {orders.map((po) => (
                                        <div key={po.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative group hover:shadow-md hover:border-blue-300 transition-all">
                                            {/* Top Edge Texture */}
                                            <div className="h-2 w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiAvPgo8cGF0aCBkPSJNMCAwTDEgMkwyIDBMMyAybDQgMEg4ViA4SDBaIiBmaWxsPSIjZjFmNWY5Ii8+Cjwvc3ZnPg==')] opacity-50 absolute top-0"></div>

                                            {/* Header */}
                                            <div className="p-5 border-b border-dashed border-slate-200 bg-[#faf9f6]">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="font-mono font-bold text-lg text-blue-700 tracking-tight">{po.id}</div>
                                                    <Badge variant="outline" className={
                                                        po.status === "Pending" ? "bg-slate-100 text-slate-600 border-slate-300 shadow-sm" :
                                                            po.status === "Partially Fulfilled" ? "bg-blue-50 text-blue-700 border-blue-300 shadow-sm" :
                                                                po.status === "Closed" ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm" :
                                                                    "bg-rose-50 text-rose-700 border-rose-300 shadow-sm"
                                                    }>{po.status}</Badge>
                                                </div>
                                                <div className="text-sm font-bold text-slate-900">{po.supplier}</div>
                                                <div className="text-xs text-slate-500 font-mono mt-1">{po.date}</div>
                                            </div>

                                            {/* Body */}
                                            <div className="p-5 flex-1 bg-white relative">
                                                {po.status === "Closed" && (
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                                                        <div className="border-4 border-emerald-500 text-emerald-500 text-4xl font-black uppercase tracking-widest p-2 transform -rotate-12 rounded-lg">FULFILLED</div>
                                                    </div>
                                                )}
                                                
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                                            <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Items</div>
                                                            <div className="font-mono font-bold text-slate-700">{Array.isArray(po.items) ? `${po.items.length} Items` : po.items}</div>
                                                        </div>
                                                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                                            <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Value</div>
                                                            <div className="font-mono font-bold text-emerald-600">₨ {po.amount.toLocaleString()}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                                                <div className="flex gap-2">
                                                    {po.status !== "Closed" && po.status !== "Canceled" && (
                                                        <Button size="sm" variant="outline" className="h-8 text-xs bg-white text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700" onClick={() => handleForceClose(po.id)}>
                                                            <Lock className="h-3 w-3 mr-1" /> Force Close
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:bg-slate-200" onClick={() => handlePrintOrder(po)} title="Print">
                                                        <Printer className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="invoices">
                        <Card className="border-slate-200 shadow-soft">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Inward Supply</CardTitle>
                                        <CardDescription>Processed invoices and stock receipts.</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                            <Input className="pl-9 w-[250px] bg-slate-50 border-slate-200" placeholder="Search invoices..." />
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {invoices.map((inv) => (
                                        <div key={inv.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative group hover:shadow-md hover:border-emerald-300 transition-all">
                                            {/* Left Edge Texture for Invoices */}
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>

                                            {/* Header */}
                                            <div className="p-5 border-b border-dashed border-slate-200 bg-[#f8fcf9] ml-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="font-mono font-bold text-lg text-emerald-700 tracking-tight">{inv.id}</div>
                                                    <Badge className={inv.status === 'Completed' ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 shadow-sm" : "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 shadow-sm"}>{inv.status}</Badge>
                                                </div>
                                                <div className="text-sm font-bold text-slate-900">{inv.supplier}</div>
                                                <div className="text-xs text-slate-500 font-mono mt-1">{inv.date}</div>
                                            </div>

                                            {/* Body */}
                                            <div className="p-5 flex-1 bg-white ml-1 flex flex-col justify-center items-center py-8">
                                                <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Invoice Amount</div>
                                                <div className="font-mono font-black text-3xl text-slate-800">{inv.amount === 0 ? "-" : `Rs ${inv.amount.toLocaleString()}`}</div>
                                            </div>

                                            {/* Actions */}
                                            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end ml-1">
                                                <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50">
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="returns">
                        <Card className="border-slate-200 shadow-soft">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-rose-700">Debit Notes</CardTitle>
                                        <CardDescription>Stock returns and financial adjustments.</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                            <Input className="pl-9 w-[250px] bg-slate-50 border-slate-200" placeholder="Search returns..." />
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {returns.length === 0 ? (
                                        <div className="col-span-full py-12 text-center text-slate-500 flex flex-col items-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                            <ArrowUpRight className="h-12 w-12 mb-4 opacity-20" />
                                            <p className="text-lg font-medium text-slate-600">No debit notes recorded</p>
                                        </div>
                                    ) : returns.map(ret => (
                                        <div key={ret.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative group hover:shadow-md hover:border-rose-300 transition-all">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"></div>
                                            
                                            <div className="p-5 border-b border-dashed border-slate-200 bg-[#fff5f5] ml-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="font-mono font-bold text-lg text-rose-700 tracking-tight">{ret.id}</div>
                                                </div>
                                                <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Supplier</div>
                                                <div className="text-sm font-bold text-slate-700">{ret.supplier}</div>
                                                <div className="text-xs text-slate-500 font-mono mt-2">{ret.date}</div>
                                                <Badge variant="destructive" className="mt-3 bg-rose-100 text-rose-800 hover:bg-rose-200 shadow-sm">{ret.reason}</Badge>
                                            </div>

                                            <div className="p-5 flex-1 bg-white ml-1 flex flex-col justify-center items-center py-8">
                                                <div className="text-[10px] uppercase tracking-widest font-bold text-rose-400 mb-1">Debit Amount</div>
                                                <div className="font-mono font-black text-3xl text-rose-600">₨ {ret.amount.toLocaleString()}</div>
                                            </div>

                                            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end ml-1">
                                                <Button size="sm" variant="ghost" className="text-slate-600 hover:bg-slate-200">
                                                    <Printer className="h-4 w-4 mr-2" /> Print Debit Note
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}

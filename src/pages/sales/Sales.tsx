import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, Truck, AlertCircle, ShoppingBag, Share2, Undo2, Printer, ArrowDownToLine, Lock } from "lucide-react";
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

export default function Sales() {
    const { toast } = useToast();
    const [createOrderOpen, setCreateOrderOpen] = useState(false);
    const [invoiceOpen, setInvoiceOpen] = useState(false);
    const [dispatchOpen, setDispatchOpen] = useState(false);
    const [creditNoteOpen, setCreditNoteOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>(undefined);
    const [printOpen, setPrintOpen] = useState(false);
    const [selectedPrintOrder, setSelectedPrintOrder] = useState<any>(null);

    const TOLERANCE = 0.02; // 2% market tolerance

    const [orders, setOrders] = useState([
        {
            id: "SO-1001",
            customer: "Gateway Motors",
            customerId: "CUST-001",
            date: "Feb 10, 2026",
            status: "Partially Fulfilled",
            total_ordered_qty: 5000,
            total_fulfilled_qty: 2100,
            items: [
                { item: "Copper Wire 8mm", gauge: "28", qty: 3000, rate: 1200, wattaRate: 513 },
                { item: "Copper Strip 12mm", gauge: "12", qty: 2000, rate: 1350, wattaRate: 480 }
            ]
        },
        {
            id: "SO-1002",
            customer: "Alpha Wire Supply",
            customerId: "CUST-002",
            date: "Feb 11, 2026",
            status: "Pending",
            total_ordered_qty: 2000,
            total_fulfilled_qty: 0,
            items: [
                { item: "Copper Rod 20mm", gauge: "20", qty: 2000, rate: 1100, wattaRate: 400 }
            ]
        },
        {
            id: "SO-1003",
            customer: "Beta Transformers",
            customerId: "CUST-003",
            date: "Feb 12, 2026",
            status: "Closed",
            total_ordered_qty: 1500,
            total_fulfilled_qty: 1500,
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

    // STATE CALCULATION ENGINE — runs on every invoice post
    const recalcOrderStatus = (orderId: string, invoiceNetWt: number) => {
        setOrders(prev => prev.map(o => {
            if (o.id !== orderId) return o;
            const newFulfilled = o.total_fulfilled_qty + invoiceNetWt;
            let newStatus = "Pending";
            if (newFulfilled <= 0) newStatus = "Pending";
            else if (newFulfilled >= o.total_ordered_qty * (1 - TOLERANCE)) newStatus = "Closed";
            else newStatus = "Partially Fulfilled";
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

        // Run the State Calculation Engine if linked to an order
        if (newInv.linkedOrderId) {
            const invoiceNetWt = data.totals?.totalNetWeight || 0;
            recalcOrderStatus(newInv.linkedOrderId, invoiceNetWt);
        }

        let desc = `Invoice ${newInv.id} generated for ₨ ${data.totals.finalTotal.toLocaleString()}.`;
        if (newInv.linkedOrderId) desc += ` Linked to ${newInv.linkedOrderId}.`;
        toast({ title: "Invoice Posted", description: desc });
    };

    const handleDispatch = (data: any) => {
        const updatedOrders = orders.map(o => {
            if (o.id === data.orderId) {
                return { ...o, status: "Dispatched", progress: 100 };
            }
            return o;
        });
        setOrders(updatedOrders);
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

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sales & Dispatch</h1>
                        <p className="text-slate-500">Manage orders, specific invoicing (Direct/Premium), and delivery.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="shadow-soft bg-white" onClick={() => setCreditNoteOpen(true)}>
                            <Undo2 className="h-4 w-4 mr-2" />
                            Return / Credit Note
                        </Button>
                        <Button variant="outline" className="shadow-soft bg-white" onClick={() => setInvoiceOpen(true)}>
                            <FileText className="h-4 w-4 mr-2" />
                            Direct Invoice
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 shadow-soft" onClick={() => setCreateOrderOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            New Sales Order
                        </Button>
                    </div>
                </div>

                {/* Modals */}
                <CreateOrderModal open={createOrderOpen} onOpenChange={setCreateOrderOpen} onSubmit={handleCreateOrder} />
                <CreateSalesInvoiceModal open={invoiceOpen} onOpenChange={setInvoiceOpen} onSubmit={handleGenerateInvoice} pendingOrders={orders.filter(o => o.status === 'Pending' || o.status === 'Partially Fulfilled')} />
                <DispatchModal open={dispatchOpen} onOpenChange={setDispatchOpen} onSubmit={handleDispatch} orderId={selectedOrderId} />
                <CreateCreditNoteModal open={creditNoteOpen} onOpenChange={setCreditNoteOpen} onSubmit={handleCreditNote} />
                <PrintOrderSheet open={printOpen} onOpenChange={setPrintOpen} order={selectedPrintOrder} />

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="shadow-soft border-slate-100 bg-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12 Orders</div>
                            <p className="text-xs text-slate-500">Value: ₨ 4.2M</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-soft border-slate-100 bg-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ready for Dispatch</CardTitle>
                            <Truck className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600">3 Loads</div>
                            <p className="text-xs text-slate-500">Scheduled for today</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-soft border-slate-100 bg-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sales This Month</CardTitle>
                            <FileText className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₨ 68.5M</div>
                            <p className="text-xs text-slate-500">+12% vs last month</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="orders" className="space-y-4">
                    <TabsList className="bg-slate-100 p-1">
                        <TabsTrigger value="orders" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Sales Orders</TabsTrigger>
                        <TabsTrigger value="invoices" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Invoices</TabsTrigger>
                        <TabsTrigger value="dispatch" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Dispatch Challans</TabsTrigger>
                        <TabsTrigger value="returns" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Returns</TabsTrigger>
                    </TabsList>

                    <TabsContent value="orders">
                        <Card className="shadow-soft border-slate-100">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle>Active Sales Orders</CardTitle>
                                        <CardDescription>Monitor fulfillment status and dispatch progress.</CardDescription>
                                    </div>
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                        <Input placeholder="Search Customer..." className="pl-9 w-[250px]" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {orders.map((order) => (
                                        <div key={order.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative group hover:shadow-md hover:border-blue-300 transition-all">
                                            {/* Top Edge Texture */}
                                            <div className="h-2 w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiAvPgo8cGF0aCBkPSJNMCAwTDEgMkwyIDBMMyAybDQgMEg4ViA4SDBaIiBmaWxsPSIjZjFmNWY5Ii8+Cjwvc3ZnPg==')] opacity-50 absolute top-0"></div>

                                            {/* Header */}
                                            <div className="p-5 border-b border-dashed border-slate-200 bg-[#faf9f6]">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="font-mono font-bold text-lg text-blue-700 tracking-tight">{order.id}</div>
                                                    <Badge variant="outline" className={
                                                        order.status === "Pending" ? "bg-slate-100 text-slate-600 border-slate-300 shadow-sm" :
                                                            order.status === "Partially Fulfilled" ? "bg-blue-50 text-blue-700 border-blue-300 shadow-sm" :
                                                                order.status === "Closed" ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm" :
                                                                    "bg-rose-50 text-rose-700 border-rose-300 shadow-sm"
                                                    }>{order.status}</Badge>
                                                </div>
                                                <div className="text-sm font-bold text-slate-900">{order.customer}</div>
                                                <div className="text-xs text-slate-500 font-mono mt-1">{order.date}</div>
                                            </div>

                                            {/* Body */}
                                            <div className="p-5 flex-1 bg-white relative">
                                                {order.status === "Closed" && (
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                                                        <div className="border-4 border-emerald-500 text-emerald-500 text-4xl font-black uppercase tracking-widest p-2 transform -rotate-12 rounded-lg">FULFILLED</div>
                                                    </div>
                                                )}
                                                
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="flex justify-between text-xs mb-1">
                                                            <span className="text-slate-500 uppercase tracking-widest font-bold text-[9px]">Fulfillment Progress</span>
                                                            <span className="font-bold text-slate-700">{Math.min(100, Math.round((order.total_fulfilled_qty / order.total_ordered_qty) * 100))}%</span>
                                                        </div>
                                                        <Progress value={Math.min(100, (order.total_fulfilled_qty / order.total_ordered_qty) * 100)} className="h-1.5" />
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                                            <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Ordered Wt</div>
                                                            <div className="font-mono font-bold text-slate-700">{order.total_ordered_qty.toLocaleString()} <span className="text-[10px] text-slate-400">kg</span></div>
                                                        </div>
                                                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                                            <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Fulfilled Wt</div>
                                                            <div className="font-mono font-bold text-emerald-600">{order.total_fulfilled_qty.toLocaleString()} <span className="text-[10px] text-emerald-400">kg</span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                                                <div className="flex gap-2">
                                                    {order.status !== "Closed" && order.status !== "Canceled" && (
                                                        <Button size="sm" variant="outline" className="h-8 text-xs bg-white text-blue-700 border-blue-200 hover:bg-blue-50" onClick={() => openDispatchForOrder(order.id)}>
                                                            <Truck className="h-3 w-3 mr-1" /> Dispatch
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="flex gap-1">
                                                    {order.status !== "Closed" && order.status !== "Canceled" && (
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-amber-600 hover:bg-amber-50 hover:text-amber-700" onClick={() => handleForceClose(order.id)} title="Force Close">
                                                            <Lock className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:bg-slate-200" onClick={() => handlePrintOrder(order)} title="Print">
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
                        <Card className="shadow-soft border-slate-100">
                            <CardHeader>
                                <CardTitle>Recent Invoices</CardTitle>
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
                                                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 shadow-sm">{inv.status}</Badge>
                                                </div>
                                                <div className="text-sm font-bold text-slate-900">{inv.customer}</div>
                                                <div className="text-xs text-slate-500 font-mono mt-1">{inv.date}</div>
                                            </div>

                                            {/* Body */}
                                            <div className="p-5 flex-1 bg-white ml-1 flex flex-col justify-center items-center py-8">
                                                <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Invoice Total</div>
                                                <div className="font-mono font-black text-3xl text-slate-800">{inv.amount}</div>
                                            </div>

                                            {/* Actions */}
                                            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end ml-1">
                                                <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50" onClick={() => handleShare(inv.id)}>
                                                    <Share2 className="h-4 w-4 mr-2" /> Share via WhatsApp
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="dispatch">
                        <Card className="shadow-soft border-slate-100">
                            <CardHeader>
                                <CardTitle>Recent Dispatches (OGP)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative group hover:shadow-md hover:border-amber-300 transition-all">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                                            
                                            <div className="p-5 border-b border-dashed border-slate-200 bg-[#fffdf5] ml-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="font-mono font-bold text-lg text-amber-700 tracking-tight">OGP-8842</div>
                                                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 shadow-sm">Left Factory</Badge>
                                                </div>
                                                <div className="text-xs text-slate-500 font-mono mt-1">Today, 10:30 AM</div>
                                            </div>

                                            <div className="p-5 flex-1 bg-white ml-1 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-blue-50 p-2 rounded-lg"><ShoppingBag className="h-4 w-4 text-blue-600"/></div>
                                                    <div>
                                                        <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Order Link</div>
                                                        <div className="font-mono font-bold text-slate-700">SO-1003</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-slate-50 p-2 rounded-lg"><Truck className="h-4 w-4 text-slate-600"/></div>
                                                    <div>
                                                        <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Vehicle & Driver</div>
                                                        <div className="font-bold text-slate-800">LEA-9921 <span className="font-normal text-slate-500">({`Muhammad Aslam`})</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end ml-1">
                                                <Button size="sm" variant="ghost" className="text-slate-600 hover:bg-slate-200">
                                                    <Printer className="h-4 w-4 mr-2" /> Print Gate Pass
                                                </Button>
                                            </div>
                                        </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="returns">
                        <Card className="shadow-soft border-slate-100">
                            <CardHeader>
                                <CardTitle>Sales Returns (Credit Notes)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {returns.length === 0 ? (
                                        <div className="col-span-full py-12 text-center text-slate-500 flex flex-col items-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                            <Undo2 className="h-12 w-12 mb-4 opacity-20" />
                                            <p className="text-lg font-medium text-slate-600">No returns recorded</p>
                                        </div>
                                    ) : returns.map(ret => (
                                        <div key={ret.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative group hover:shadow-md hover:border-rose-300 transition-all">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"></div>
                                            
                                            <div className="p-5 border-b border-dashed border-slate-200 bg-[#fff5f5] ml-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="font-mono font-bold text-lg text-rose-700 tracking-tight">{ret.id}</div>
                                                    <Badge variant="destructive" className="bg-rose-100 text-rose-800 hover:bg-rose-200 shadow-sm">{ret.reason}</Badge>
                                                </div>
                                                <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Original Invoice</div>
                                                <div className="text-sm font-mono font-bold text-slate-700">{ret.invoiceId}</div>
                                                <div className="text-xs text-slate-500 font-mono mt-2">{ret.date}</div>
                                            </div>

                                            <div className="p-5 flex-1 bg-white ml-1 flex flex-col justify-center items-center py-8">
                                                <div className="text-[10px] uppercase tracking-widest font-bold text-rose-400 mb-1">Credit Amount</div>
                                                <div className="font-mono font-black text-3xl text-rose-600">-{ret.amount}</div>
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

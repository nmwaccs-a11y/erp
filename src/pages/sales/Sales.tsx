import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, Truck, AlertCircle, ShoppingBag, Share2, Undo2 } from "lucide-react";
import { useState } from "react";
import { CreateOrderModal } from "@/components/sales/CreateOrderModal";
import { CreateSalesInvoiceModal } from "@/components/sales/CreateSalesInvoiceModal";
import { DispatchModal } from "@/components/sales/DispatchModal";
import { CreateCreditNoteModal } from "@/components/sales/CreateCreditNoteModal";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

export default function Sales() {
    const { toast } = useToast();
    const [createOrderOpen, setCreateOrderOpen] = useState(false);
    const [invoiceOpen, setInvoiceOpen] = useState(false);
    const [dispatchOpen, setDispatchOpen] = useState(false);
    const [creditNoteOpen, setCreditNoteOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>(undefined);

    const [orders, setOrders] = useState([
        { id: "SO-1001", customer: "Gateway Motors", date: "Feb 10, 2026", status: "In Progress", progress: 60, total: "5000 kg" },
        { id: "SO-1002", customer: "Alpha Wire Supply", date: "Feb 11, 2026", status: "Pending", progress: 0, total: "2000 kg" },
        { id: "SO-1003", customer: "Beta Transformers", date: "Feb 12, 2026", status: "Dispatched", progress: 100, total: "1500 kg" },
    ]);

    const [invoices, setInvoices] = useState([
        { id: "INV-2026-101", customer: "Gateway Motors", date: "Feb 10", amount: "₨ 250,000", status: "Paid" },
    ]);

    const [returns, setReturns] = useState<{ id: string, invoiceId: string, reason: string, amount: string, date: string }[]>([]);

    const handleCreateOrder = (data: any) => {
        const newOrder = {
            id: `SO-${1000 + orders.length + 1}`,
            customer: data.customer === "gateway" ? "Gateway Motors" : "Alpha Wire Supply",
            date: data.deliveryDate,
            status: "Pending",
            progress: 0,
            total: "1000 kg" // Mock
        };
        setOrders([newOrder, ...orders]);
        toast({ title: "Order Created", description: `Order ${newOrder.id} successfully created.` });
    };

    const handleGenerateInvoice = (data: any) => {
        // Create Invoice
        const newInv = {
            id: `INV-2026-${102 + invoices.length}`,
            customer: "Gateway Motors", // Mock
            date: "Feb 12",
            amount: `₨ ${data.totals.finalTotal.toLocaleString()}`,
            status: "Pending"
        };
        setInvoices([newInv, ...invoices]);

        let desc = `Invoice ${newInv.id} generated for ₨ ${data.totals.finalTotal.toLocaleString()}.`;

        // Auto Dispatch Logic
        if (data.autoDispatch) {
            desc += " Auto-generated OGP created.";
            // Add a mock OGP to dispatch list (if we had state for it, simplified here)
        }

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
                <CreateSalesInvoiceModal open={invoiceOpen} onOpenChange={setInvoiceOpen} onSubmit={handleGenerateInvoice} />
                <DispatchModal open={dispatchOpen} onOpenChange={setDispatchOpen} onSubmit={handleDispatch} orderId={selectedOrderId} />
                <CreateCreditNoteModal open={creditNoteOpen} onOpenChange={setCreditNoteOpen} onSubmit={handleCreditNote} />

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
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order ID</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Total Qty</TableHead>
                                            <TableHead>Fulfillment</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-mono text-xs font-medium">{order.id}</TableCell>
                                                <TableCell className="font-medium">{order.customer}</TableCell>
                                                <TableCell className="text-slate-500">{order.date}</TableCell>
                                                <TableCell>{order.total}</TableCell>
                                                <TableCell className="w-[200px]">
                                                    <div className="flex items-center gap-2">
                                                        <Progress value={order.progress} className="h-2" />
                                                        <span className="text-xs text-slate-500">{order.progress}%</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={
                                                        order.status === "Pending" ? "bg-slate-100 text-slate-600" :
                                                            order.status === "In Progress" ? "bg-blue-50 text-blue-700" :
                                                                "bg-emerald-50 text-emerald-700"
                                                    }>{order.status}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {order.status !== "Dispatched" && (
                                                        <Button size="sm" variant="ghost" className="text-blue-600" onClick={() => openDispatchForOrder(order.id)}>
                                                            Dispatch
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="invoices">
                        <Card className="shadow-soft border-slate-100">
                            <CardHeader>
                                <CardTitle>Recent Invoices</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Invoice #</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Share</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {invoices.map((inv) => (
                                            <TableRow key={inv.id}>
                                                <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                                                <TableCell>{inv.customer}</TableCell>
                                                <TableCell>{inv.date}</TableCell>
                                                <TableCell className="font-bold">{inv.amount}</TableCell>
                                                <TableCell><Badge variant="outline">{inv.status}</Badge></TableCell>
                                                <TableCell className="text-right">
                                                    <Button size="icon" variant="ghost" onClick={() => handleShare(inv.id)}>
                                                        <Share2 className="h-4 w-4 text-blue-600" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="dispatch">
                        <Card className="shadow-soft border-slate-100">
                            <CardHeader>
                                <CardTitle>Recent Dispatches (OGP)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>OGP ID</TableHead>
                                            <TableHead>Order Link</TableHead>
                                            <TableHead>Vehicle</TableHead>
                                            <TableHead>Driver</TableHead>
                                            <TableHead>Time</TableHead>
                                            <TableHead className="text-right">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-mono text-xs">OGP-8842</TableCell>
                                            <TableCell className="text-blue-600">SO-1003</TableCell>
                                            <TableCell>LEA-9921</TableCell>
                                            <TableCell>Muhammad Aslam</TableCell>
                                            <TableCell className="text-slate-500">Today, 10:30 AM</TableCell>
                                            <TableCell className="text-right">
                                                <Badge className="bg-emerald-600">Left Factory</Badge>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="returns">
                        <Card className="shadow-soft border-slate-100">
                            <CardHeader>
                                <CardTitle>Sales Returns (Credit Notes)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>CN ID</TableHead>
                                            <TableHead>Invoice #</TableHead>
                                            <TableHead>Reason</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {returns.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center text-slate-500 py-4">No returns recorded.</TableCell>
                                            </TableRow>
                                        ) : returns.map(ret => (
                                            <TableRow key={ret.id}>
                                                <TableCell className="font-mono text-xs">{ret.id}</TableCell>
                                                <TableCell>{ret.invoiceId}</TableCell>
                                                <TableCell><Badge variant="destructive" className="bg-rose-50 text-rose-700 hover:bg-rose-100">{ret.reason}</Badge></TableCell>
                                                <TableCell>{ret.date}</TableCell>
                                                <TableCell className="text-right font-medium text-rose-600">-{ret.amount}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}

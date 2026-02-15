import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, FileText, ArrowUpRight, ArrowDownLeft, Filter, ShoppingCart, Printer } from "lucide-react";
import { useState } from "react";
import { PurchaseInvoiceModal } from "@/components/procurement/PurchaseInvoiceModal";
import { PurchaseReturnModal } from "@/components/procurement/PurchaseReturnModal";
import { CreatePOModal } from "@/components/procurement/CreatePOModal";

export default function Purchase() {
    const [activeTab, setActiveTab] = useState("orders");
    const [invoiceOpen, setInvoiceOpen] = useState(false);
    const [returnOpen, setReturnOpen] = useState(false);
    const [poOpen, setPoOpen] = useState(false);

    // Mock Data for POs
    const [orders, setOrders] = useState([
        { id: "PO-2026-101", date: "2026-02-15", supplier: "Alpha Wire Supply", items: "Copper Cathode (20T)", amount: 5200000, status: "Open" },
        { id: "PO-2026-100", date: "2026-02-10", supplier: "Beta Transformers", items: "Mixed Scrap (5T)", amount: 1100000, status: "Partially Recvd" },
    ]);

    // Mock Data for Invoices
    const [invoices, setInvoices] = useState([
        { id: "PUR-2026-001", date: "2026-02-14", supplier: "New Age Copper", amount: 450000, status: "Pending Rate", weight: "5,000 kg" },
        { id: "PUR-2026-002", date: "2026-02-13", supplier: "Metal Exchange", amount: 120000, status: "Completed", weight: "1,200 kg" },
    ]);

    // Mock Data for Returns
    const [returns, setReturns] = useState([
        { id: "PR-2026-050", date: "2026-02-12", supplier: "Global Rods", amount: 15000, reason: "Quality Reject", type: "Stock Return" }
    ]);

    const handleInvoiceSubmit = (data: any) => {
        setInvoices([{
            id: data.header.invoiceId,
            date: data.header.date ? data.header.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            supplier: "New Supplier",
            amount: data.totals.netPayable,
            status: data.header.ratePending ? "Pending Rate" : "Completed",
            weight: `${data.items.reduce((s: number, i: any) => s + i.netWeight, 0).toLocaleString()} kg`
        }, ...invoices]);
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

                <CreatePOModal open={poOpen} onOpenChange={setPoOpen} />
                <PurchaseInvoiceModal open={invoiceOpen} onOpenChange={setInvoiceOpen} onSubmit={handleInvoiceSubmit} />
                <PurchaseReturnModal open={returnOpen} onOpenChange={setReturnOpen} onSubmit={handleReturnSubmit} />

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
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>PO ID</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Supplier</TableHead>
                                            <TableHead>Items</TableHead>
                                            <TableHead>Value</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.map((po) => (
                                            <TableRow key={po.id}>
                                                <TableCell className="font-mono font-medium text-blue-600">{po.id}</TableCell>
                                                <TableCell className="text-slate-500">{po.date}</TableCell>
                                                <TableCell className="font-medium">{po.supplier}</TableCell>
                                                <TableCell>{po.items}</TableCell>
                                                <TableCell>Rs {po.amount.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                        {po.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm"><Printer className="h-4 w-4" /></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
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
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Invoice ID</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Supplier</TableHead>
                                            <TableHead>Total Weight</TableHead>
                                            <TableHead>Total Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {invoices.map((inv) => (
                                            <TableRow key={inv.id}>
                                                <TableCell className="font-mono font-medium text-emerald-600">{inv.id}</TableCell>
                                                <TableCell className="text-slate-500">{inv.date}</TableCell>
                                                <TableCell className="font-medium">{inv.supplier}</TableCell>
                                                <TableCell>{inv.weight}</TableCell>
                                                <TableCell>{inv.amount === 0 ? "-" : `Rs ${inv.amount.toLocaleString()}`}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className={
                                                        inv.status === 'Completed' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                                    }>
                                                        {inv.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm">View</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
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
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Return ID</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Supplier</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Debit Amount</TableHead>
                                            <TableHead>Reason</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {returns.map((ret) => (
                                            <TableRow key={ret.id}>
                                                <TableCell className="font-mono font-medium text-rose-600">{ret.id}</TableCell>
                                                <TableCell className="text-slate-500">{ret.date}</TableCell>
                                                <TableCell className="font-medium">{ret.supplier}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-slate-600">
                                                        {ret.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-bold text-slate-900">Rs {ret.amount.toLocaleString()}</TableCell>
                                                <TableCell className="text-slate-500 italic truncate max-w-[150px]">{ret.reason}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm">Print</Button>
                                                </TableCell>
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

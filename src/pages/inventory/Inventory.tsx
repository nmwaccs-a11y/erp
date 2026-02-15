import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ArrowRightLeft, Box, AlertCircle, Activity, CheckCircle2 } from "lucide-react";
import HwalaMap from "@/components/inventory/HwalaMap";
import { TransferNoteModal } from "@/components/inventory/TransferNoteModal";
import { useState } from "react";

export default function Inventory() {
    const [transferOpen, setTransferOpen] = useState(false);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventory Management</h1>
                        <p className="text-slate-500">Track stock levels, transfers, and virtual locations</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button className="bg-blue-600 hover:bg-blue-700 shadow-soft" onClick={() => setTransferOpen(true)}>
                            <ArrowRightLeft className="h-4 w-4 mr-2" />
                            New Transfer
                        </Button>
                    </div>
                </div>

                <TransferNoteModal open={transferOpen} onOpenChange={setTransferOpen} />

                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="shadow-soft border-slate-100 bg-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Valuation</CardTitle>
                            <Box className="h-4 w-4 text-slate-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₨ 45.2M</div>
                            <p className="text-xs text-slate-500">+2.5% from last month</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-soft border-slate-100 bg-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                            <AlertCircle className="h-4 w-4 text-rose-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-rose-600">3 Items</div>
                            <p className="text-xs text-slate-500">Critical levels reached</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-soft border-slate-100 bg-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Hwala (Virtual)</CardTitle>
                            <Activity className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3,250 kg</div>
                            <p className="text-xs text-slate-500">Held by 2 vendors</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-soft border-slate-100 bg-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Stock Efficiency</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">98.5%</div>
                            <p className="text-xs text-slate-500">Accuracy rate</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="stock" className="space-y-4">
                    <TabsList className="bg-slate-100 p-1">
                        <TabsTrigger value="stock" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Stock Register</TabsTrigger>
                        <TabsTrigger value="hwala" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Hwala (Virtual)</TabsTrigger>
                        <TabsTrigger value="movements" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Movement Logs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="stock" className="space-y-4">
                        <Card className="shadow-soft border-slate-100">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle>Current Stock</CardTitle>
                                        <CardDescription>Real-time physical inventory levels.</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                            <Input placeholder="Search items..." className="pl-9 w-[250px]" />
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Item Code</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Batch</TableHead>
                                            <TableHead>Qty (kg)</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <TableRow key={i}>
                                                <TableCell className="font-mono text-slate-600">ITM-{100 + i}</TableCell>
                                                <TableCell className="font-medium">Copper Cathode Ref-{i}</TableCell>
                                                <TableCell>Main Floor</TableCell>
                                                <TableCell className="font-mono text-xs">B-2026-{200 + i}</TableCell>
                                                <TableCell>1,250.00</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Available</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm">History</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="hwala" className="space-y-4">
                        <HwalaMap />
                    </TabsContent>

                    <TabsContent value="movements">
                        <Card className="shadow-soft border-slate-100">
                            <CardHeader>
                                <CardTitle>Movement History</CardTitle>
                                <CardDescription>Recent transfers and adjustments.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-slate-500 text-center py-8">
                                    No movements recorded today.
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}

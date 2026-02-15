import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Download, FileText, ArrowUpRight, ArrowDownRight, Wallet, History, Search } from "lucide-react";
import { useState } from "react";
import { TransactionModal } from "@/components/financials/TransactionModal";
import { ParchiModal } from "@/components/financials/ParchiModal";

export default function Financials() {
    const [isTransactionOpen, setIsTransactionOpen] = useState(false);
    const [isParchiOpen, setIsParchiOpen] = useState(false);

    const handleParchiSubmit = (data: any) => {
        console.log("Parchi Issued:", data);
        // Add to state/db
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financials</h1>
                        <p className="text-slate-500">Unified Cashbook & Parchi System</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="shadow-soft bg-white" onClick={() => setIsParchiOpen(true)}>
                            <FileText className="h-4 w-4 mr-2" />
                            Issue Parchi
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 shadow-soft" onClick={() => setIsTransactionOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            New Transaction
                        </Button>
                    </div>
                </div>

                <TransactionModal
                    open={isTransactionOpen}
                    onOpenChange={setIsTransactionOpen}
                    onSubmit={(data: any) => console.log(data)}
                />
                <ParchiModal
                    open={isParchiOpen}
                    onOpenChange={setIsParchiOpen}
                    onSubmit={handleParchiSubmit}
                />

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="shadow-soft border-slate-100 bg-emerald-50/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-800">Cash in Hand</CardTitle>
                            <Wallet className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">$12,450.00</div>
                            <p className="text-xs text-emerald-600 flex items-center mt-1">
                                <ArrowUpRight className="h-3 w-3 mr-1" /> +$2,000 today
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-soft border-slate-100 bg-blue-50/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-800">Bank Balance</CardTitle>
                            <History className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">$145,200.00</div>
                            <p className="text-xs text-slate-500 mt-1">Across 3 accounts</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-soft border-slate-100 bg-slate-50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Parchi Liability</CardTitle>
                            <FileText className="h-4 w-4 text-slate-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">$8,500.00</div>
                            <p className="text-xs text-rose-600 flex items-center mt-1">
                                <ArrowDownRight className="h-3 w-3 mr-1" /> Due within 7 days
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="cashbook" className="space-y-4">
                    <TabsList className="bg-slate-100 p-1">
                        <TabsTrigger value="cashbook" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Cashbook</TabsTrigger>
                        <TabsTrigger value="parchi" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Parchi (Commitments)</TabsTrigger>
                        <TabsTrigger value="ledger" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">General Ledger</TabsTrigger>
                    </TabsList>

                    <TabsContent value="cashbook">
                        <Card className="shadow-soft border-slate-100">
                            <CardHeader>
                                <CardTitle>Daily Transactions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead className="text-right">Debit (In)</TableHead>
                                            <TableHead className="text-right">Credit (Out)</TableHead>
                                            <TableHead className="text-right">Balance</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="text-slate-500">Feb 12, 10:00 AM</TableCell>
                                            <TableCell className="font-medium">Opening Balance</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">System</Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-emerald-600">$10,450</TableCell>
                                            <TableCell className="text-right">-</TableCell>
                                            <TableCell className="text-right font-bold">$10,450</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="text-slate-500">Feb 12, 11:30 AM</TableCell>
                                            <TableCell className="font-medium">Sale Payment - Gateway Motors</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="bg-blue-50 text-blue-700">Receipt</Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-emerald-600">$2,500</TableCell>
                                            <TableCell className="text-right">-</TableCell>
                                            <TableCell className="text-right font-bold">$12,950</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="text-slate-500">Feb 12, 02:15 PM</TableCell>
                                            <TableCell className="font-medium">Tea & Misc Expenses</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-700">Expense</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">-</TableCell>
                                            <TableCell className="text-right font-medium text-rose-600">$500</TableCell>
                                            <TableCell className="text-right font-bold">$12,450</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="parchi">
                        <Card className="shadow-soft border-slate-100">
                            <CardHeader>
                                <CardTitle>Parchi Register</CardTitle>
                                <CardDescription>Informal financial commitments and slips.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="group relative flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <Badge variant="outline" className="border-slate-200">#P-{500 + i}</Badge>
                                                    <span className="text-xs text-slate-500">Due: Feb 2{i}, 2026</span>
                                                </div>
                                                <div className="mt-4">
                                                    <div className="text-2xl font-bold text-slate-900">$2,500</div>
                                                    <p className="text-sm text-slate-500 mt-1">To: Alpha Wire Supply</p>
                                                </div>
                                            </div>
                                            <div className="mt-6 flex items-center justify-between">
                                                <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded">Pending</span>
                                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">Clear</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="ledger">
                        <Card className="shadow-soft border-slate-100">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle>General Ledger</CardTitle>
                                        <CardDescription>View entries for specific accounts.</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                            <Input placeholder="Search Account..." className="pl-9 w-[250px]" />
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Account</TableHead>
                                            <TableHead>Ref ID</TableHead>
                                            <TableHead className="text-right">Debit</TableHead>
                                            <TableHead className="text-right">Credit</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[1, 2, 3].map((i) => (
                                            <TableRow key={i}>
                                                <TableCell className="text-slate-500">Feb {10 + i}, 2026</TableCell>
                                                <TableCell className="font-medium">Gateway Motors (Customer)</TableCell>
                                                <TableCell className="font-mono text-xs">INV-2026-{100 + i}</TableCell>
                                                <TableCell className="text-right text-slate-900 font-medium">$5,000.00</TableCell>
                                                <TableCell className="text-right text-slate-400">-</TableCell>
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

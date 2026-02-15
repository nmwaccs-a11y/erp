import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, History, TrendingUp, DollarSign } from "lucide-react";
import { useState } from "react";
import { RateFixingModal } from "@/components/financials/RateFixingModal";

export default function RateManagement() {
    const pendingChallans = [
        { id: "IGP-1024", date: "2026-02-08", party: "Gamma Scrap Traders", item: "Mixed Scrap", weight: 3500, daysPending: 4 },
        { id: "IGP-1025", date: "2026-02-09", party: "Gamma Scrap Traders", item: "Mixed Scrap", weight: 1200, daysPending: 3 },
        { id: "IGP-1028", date: "2026-02-11", party: "Alpha Wire Supply", item: "Copper Cathode", weight: 5000, daysPending: 1 },
    ];

    const [selected, setSelected] = useState<string[]>([]);
    const [modalOpen, setModalOpen] = useState(false);

    const toggleSelect = (id: string) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (selected.length === pendingChallans.length) {
            setSelected([]);
        } else {
            setSelected(pendingChallans.map(c => c.id));
        }
    };

    const selectedWeight = pendingChallans
        .filter(c => selected.includes(c.id))
        .reduce((sum, c) => sum + c.weight, 0);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Rate Management</h1>
                        <p className="text-slate-500">Fix rates for pending inventory (Suda) and manage liability.</p>
                    </div>
                    <Button variant="outline" className="shadow-sm">
                        <History className="h-4 w-4 mr-2" />
                        Rate History
                    </Button>
                </div>

                <RateFixingModal
                    open={modalOpen}
                    onOpenChange={setModalOpen}
                    selectedCount={selected.length}
                    totalWeight={selectedWeight}
                />

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Main Fixing Interface */}
                    <Card className="md:col-span-2 shadow-soft border-slate-100">
                        <CardHeader>
                            <CardTitle>Pending Challans</CardTitle>
                            <CardDescription>Select challans to fix rate.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">
                                            <Checkbox
                                                checked={selected.length === pendingChallans.length && pendingChallans.length > 0}
                                                onCheckedChange={toggleAll}
                                            />
                                        </TableHead>
                                        <TableHead>IGP ID</TableHead>
                                        <TableHead>Party</TableHead>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Weight</TableHead>
                                        <TableHead>Aging</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingChallans.map((challan) => (
                                        <TableRow key={challan.id} className={challan.daysPending > 3 ? "bg-rose-50/30" : ""}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selected.includes(challan.id)}
                                                    onCheckedChange={() => toggleSelect(challan.id)}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{challan.id}</TableCell>
                                            <TableCell>{challan.party}</TableCell>
                                            <TableCell>{challan.item}</TableCell>
                                            <TableCell>{challan.weight.toLocaleString()} kg</TableCell>
                                            <TableCell>
                                                {challan.daysPending > 3 ? (
                                                    <Badge variant="destructive" className="bg-rose-100 text-rose-700 hover:bg-rose-100 flex w-fit gap-1">
                                                        <AlertCircle className="h-3 w-3" /> {challan.daysPending} days
                                                    </Badge>
                                                ) : (
                                                    <span className="text-slate-500">{challan.daysPending} days</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {pendingChallans.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-6 text-slate-500">
                                                No pending challans found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter className="border-t bg-slate-50 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-sm text-slate-500">
                                {selected.length} items selected ({selectedWeight.toLocaleString()} kg total)
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 disabled:opacity-50"
                                    disabled={selected.length === 0}
                                    onClick={() => setModalOpen(true)}
                                >
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    Fix Rate
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Side Stats */}
                    <div className="space-y-6">
                        <Card className="shadow-soft border-slate-100 bg-amber-50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-amber-900 text-lg">Unfixed Liability</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-amber-900">9,700 kg</div>
                                <p className="text-sm text-amber-700 mt-1">Est. Value: ~24.5 M PKR</p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-soft border-slate-100">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-blue-600" />
                                    Market Trends (LME)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                    <span className="text-sm text-slate-600">Cooper (Spot)</span>
                                    <span className="font-mono text-emerald-600 font-medium">$8,450 ▲</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                    <span className="text-sm text-slate-600">USD/PKR</span>
                                    <span className="font-mono text-rose-600 font-medium">278.50 ▲</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">
                                    *Rates updated 15 mins ago.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

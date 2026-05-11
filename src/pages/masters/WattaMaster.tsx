import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Filter, Search } from "lucide-react";

export default function WattaMaster() {
    const matrices = [
        { id: "WAT-26-001", party: "Alpha Cables Pvt Ltd", date: "Feb 01, 2026", direction: "Sales", minSpec: 20, maxSpec: 25, rate: "₨ 513/kg" },
        { id: "WAT-26-002", party: "Beta Transformers", date: "Feb 10, 2026", direction: "Sales", minSpec: 26, maxSpec: 30, rate: "₨ 580/kg" },
        { id: "WAT-26-003", party: "Gamma Scrap Traders", date: "Feb 12, 2026", direction: "Purchase", minSpec: 90, maxSpec: 95, rate: "₨ -120/kg" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Watta Master Matrix</h1>
                        <p className="text-slate-500">Configure premium and making charges across gauges and parties.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="shadow-sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 shadow-soft">
                            <Plus className="h-4 w-4 mr-2" />
                            New Matrix
                        </Button>
                    </div>
                </div>

                <Card className="shadow-soft border-slate-100">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle>Active Contracts</CardTitle>
                                <CardDescription>Currently applied Watta rates based on date rules.</CardDescription>
                            </div>
                            <div className="relative w-[300px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                <Input className="pl-9" placeholder="Search Matrix..." />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Contract ID</TableHead>
                                    <TableHead>Party Name</TableHead>
                                    <TableHead>Direction</TableHead>
                                    <TableHead>Effective Date</TableHead>
                                    <TableHead>Spec Range</TableHead>
                                    <TableHead className="text-right">Watta Rate</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {matrices.map((matrix) => (
                                    <TableRow key={matrix.id} className="hover:bg-slate-50 cursor-pointer">
                                        <TableCell className="font-medium font-mono text-slate-600">{matrix.id}</TableCell>
                                        <TableCell className="font-medium">{matrix.party}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={matrix.direction === 'Sales' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}>
                                                {matrix.direction}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-500">{matrix.date}</TableCell>
                                        <TableCell>
                                            Gauge / Purity: {matrix.minSpec} - {matrix.maxSpec}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-slate-700">
                                            {matrix.rate}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

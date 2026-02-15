import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, AlertCircle } from "lucide-react";

export default function LaborRateMatrix() {
    const rates = [
        { id: 1, process: "Wire Drawing", gauge: "8mm to 2.5mm", rate: 5.50, unit: "kg" },
        { id: 2, process: "Wire Drawing", gauge: "2.5mm to 1.0mm", rate: 8.00, unit: "kg" },
        { id: 3, process: "Wire Drawing", gauge: "Below 1.0mm", rate: 12.50, unit: "kg" },
        { id: 4, process: "Enameling", gauge: "SWG 18-22", rate: 45.00, unit: "kg" },
        { id: 5, process: "Enameling", gauge: "SWG 23-28", rate: 55.00, unit: "kg" },
        { id: 6, process: "Spooling", gauge: "All Sizes", rate: 2.00, unit: "kg" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Labor Rate Matrix</h1>
                        <p className="text-slate-500">Define manufacturing rates for automated wage calculation.</p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 shadow-soft">
                        <Save className="h-4 w-4 mr-2" />
                        Update Rates
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="shadow-soft border-slate-100 md:col-span-2">
                        <CardHeader>
                            <CardTitle>Current Rate Card</CardTitle>
                            <CardDescription>Rates applied to production batches this week.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Process</TableHead>
                                        <TableHead>Size / Gauge Range</TableHead>
                                        <TableHead>Rate (PKR)</TableHead>
                                        <TableHead>Unit</TableHead>
                                        <TableHead>Last Updated</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rates.map((rate) => (
                                        <TableRow key={rate.id}>
                                            <TableCell className="font-medium">{rate.process}</TableCell>
                                            <TableCell>{rate.gauge}</TableCell>
                                            <TableCell>
                                                <Input
                                                    defaultValue={rate.rate.toFixed(2)}
                                                    className="w-24 h-8 text-right bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                                />
                                            </TableCell>
                                            <TableCell className="text-slate-500">/ {rate.unit}</TableCell>
                                            <TableCell className="text-slate-400 text-xs">Feb 10, 2026</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="shadow-soft border-slate-100 bg-blue-50/50">
                        <CardHeader>
                            <CardTitle className="text-blue-900">Add New Rule</CardTitle>
                            <CardDescription className="text-blue-700">Define a new rate category.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Process</label>
                                <Select>
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Select Process" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="drawing">Wire Drawing</SelectItem>
                                        <SelectItem value="enamel">Enameling</SelectItem>
                                        <SelectItem value="annealing">Annealing</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Gauge Range</label>
                                <Input className="bg-white" placeholder="e.g. 1.0mm - 2.0mm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Rate (PKR)</label>
                                <Input type="number" className="bg-white" placeholder="0.00" />
                            </div>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">Add Rule</Button>

                            <div className="mt-4 p-3 bg-white/50 rounded-lg border border-blue-100 flex gap-2">
                                <AlertCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    Changing rates will only affect future production logs. Past entries remain locked.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}

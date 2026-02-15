import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { AddItemModal } from "@/components/masters/AddItemModal";

export default function ItemMaster() {
    const [isAddOpen, setIsAddOpen] = useState(false);

    const items = [
        { code: "RAW-001", name: "Copper Cathode", category: "Raw Material", unit: "kg", cost: "Pending" },
        { code: "WIP-102", name: "Copper Rod 8mm", category: "WIP", unit: "kg", cost: "$8.50" },
        { code: "WIP-105", name: "Copper Wire 2.5mm", category: "WIP", unit: "kg", cost: "$9.20" },
        { code: "FIN-201", name: "Enamel Wire 18 SWG", category: "Finish Goods", unit: "Reel", cost: "$12.00" },
        { code: "SCR-300", name: "Bare Copper Scrap", category: "Scrap", unit: "kg", cost: "$7.50" },
        { code: "CHM-401", name: "Varnish Drum (Hysol)", category: "Chemical", unit: "Drum", cost: "$250.00" },
    ];

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case 'Raw Material': return "bg-slate-100 text-slate-700";
            case 'WIP': return "bg-blue-100 text-blue-700";
            case 'Finish Goods': return "bg-emerald-100 text-emerald-700";
            case 'Scrap': return "bg-rose-100 text-rose-700";
            case 'Chemical': return "bg-purple-100 text-purple-700";
            default: return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Item Master</h1>
                        <p className="text-slate-500">Manage inventory items and specifications.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="shadow-sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                        <Button onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700 shadow-soft">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Item
                        </Button>
                    </div>
                </div>

                <AddItemModal open={isAddOpen} onOpenChange={setIsAddOpen} />

                <Card className="shadow-soft border-slate-100">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle>Item List ({items.length})</CardTitle>
                            <div className="relative w-[300px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                <Input className="pl-9" placeholder="Search items..." />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item Code</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>UOM</TableHead>
                                    <TableHead>Specs</TableHead>
                                    <TableHead>Std Cost</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.code} className="hover:bg-slate-50 cursor-pointer">
                                        <TableCell className="font-medium font-mono text-slate-600">{item.code}</TableCell>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={getCategoryColor(item.category)}>
                                                {item.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{item.unit}</TableCell>
                                        <TableCell className="text-xs text-slate-500">
                                            {item.category === 'Chemical' ? 'Solid Content: 45%' : '-'}
                                        </TableCell>
                                        <TableCell>{item.cost}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                            </Button>
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

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { ArrowLeft, Plus, Save, Trash2, LayoutGrid, List, Search, Edit, History, Factory } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductionEntry {
    entryId: string; // Unique ID for the specific row
    productionId: string; // The shared Production Batch ID (e.g. PRD-1000)
    date: string;
    shift: string;
    machineNo: string;
    operator: string;
    item: string;
    unitCount: string;
    grossWeight?: string;
    tareWeight?: string;
    netWeight: string;
}

export default function EnamelProduction() {
    const [activeTab, setActiveTab] = useState("new");
    
    // Batch Logic
    const [globalProductionId, setGlobalProductionId] = useState<number>(1000);
    const [pendingEntries, setPendingEntries] = useState<ProductionEntry[]>([]);
    
    // History Logic
    const [history, setHistory] = useState<ProductionEntry[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Form State (New Entry)
    const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
    const [shift, setShift] = useState("Day");
    const [machineNo, setMachineNo] = useState("");
    const [operator, setOperator] = useState("");
    const [selectedItem, setSelectedItem] = useState("");
    const [unitCount, setUnitCount] = useState("");
    const [grossWeight, setGrossWeight] = useState("");
    const [tareWeight, setTareWeight] = useState("");
    const [netWeight, setNetWeight] = useState("");

    // Edit Modal State
    const [editingEntry, setEditingEntry] = useState<ProductionEntry | null>(null);

    // Load Data
    useEffect(() => {
        const lastId = localStorage.getItem("lastEnamelProductionId") || "1000";
        setGlobalProductionId(parseInt(lastId));

        const savedHistory = localStorage.getItem("enamelProductionHistory");
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (e) {}
        }
    }, []);

    // Auto-calculate Net Weight for Workshop/Copper Strip (New Form)
    const isWorkshopOrCopper = selectedItem === "copper_strip" || selectedItem === "workshop_item";
    useEffect(() => {
        if (isWorkshopOrCopper) {
            const g = Number(grossWeight) || 0;
            const t = Number(tareWeight) || 0;
            if (g > 0) setNetWeight(Math.max(0, g - t).toFixed(2));
            else setNetWeight("");
        }
    }, [grossWeight, tareWeight, isWorkshopOrCopper]);

    // Clear weights when item changes (New Form)
    useEffect(() => {
        setGrossWeight("");
        setTareWeight("");
        setNetWeight("");
    }, [selectedItem]);

    // Auto-calculate Net Weight (Edit Form)
    const isEditWorkshopOrCopper = editingEntry?.item === "copper_strip" || editingEntry?.item === "workshop_item";
    useEffect(() => {
        if (editingEntry && isEditWorkshopOrCopper) {
            const g = Number(editingEntry.grossWeight) || 0;
            const t = Number(editingEntry.tareWeight) || 0;
            if (g > 0) {
                setEditingEntry({ ...editingEntry, netWeight: Math.max(0, g - t).toFixed(2) });
            }
        }
    }, [editingEntry?.grossWeight, editingEntry?.tareWeight, isEditWorkshopOrCopper]);

    // Actions
    const handleAddPendingEntry = () => {
        if (!machineNo || !selectedItem || !netWeight) {
            toast.error("Please fill Machine, Product Item, and Nett Weight.");
            return;
        }

        const newEntry: ProductionEntry = {
            entryId: Math.random().toString(36).substr(2, 9),
            productionId: `PRD-${globalProductionId.toString().padStart(4, "0")}`,
            date,
            shift,
            machineNo,
            operator,
            item: selectedItem,
            unitCount,
            grossWeight: isWorkshopOrCopper ? grossWeight : undefined,
            tareWeight: isWorkshopOrCopper ? tareWeight : undefined,
            netWeight: netWeight
        };

        setPendingEntries([...pendingEntries, newEntry]);
        
        // Reset item fields for next entry in same batch
        setUnitCount("");
        setGrossWeight(""); 
        setTareWeight("");
        setNetWeight("");
        setSelectedItem("");
    };

    const handleSaveBatch = () => {
        if (pendingEntries.length === 0) return;

        // Move to history
        const newHistory = [...pendingEntries, ...history];
        setHistory(newHistory);
        localStorage.setItem("enamelProductionHistory", JSON.stringify(newHistory));

        // Increment ID
        const nextId = globalProductionId + 1;
        setGlobalProductionId(nextId);
        localStorage.setItem("lastEnamelProductionId", nextId.toString());

        setPendingEntries([]);
        toast.success(`Production PRD-${globalProductionId.toString().padStart(4, "0")} saved!`);
    };

    const handleUpdateHistoryEntry = () => {
        if (!editingEntry) return;

        const updatedHistory = history.map(e => e.entryId === editingEntry.entryId ? editingEntry : e);
        setHistory(updatedHistory);
        localStorage.setItem("enamelProductionHistory", JSON.stringify(updatedHistory));
        setEditingEntry(null);
        toast.success(`Entry updated successfully`);
    };

    const handleDeleteHistoryEntry = (entryId: string) => {
        if (confirm("Delete this entry permanently?")) {
            const updatedHistory = history.filter(e => e.entryId !== entryId);
            setHistory(updatedHistory);
            localStorage.setItem("enamelProductionHistory", JSON.stringify(updatedHistory));
            toast.success("Entry deleted");
        }
    };

    const getItemName = (val: string) => {
        switch(val) {
            case 'copper_strip': return 'Copper Strip';
            case 'workshop_item': return 'Workshop Item';
            case 'swg-18': return 'SWG 18 (Enamel)';
            case 'swg-19': return 'SWG 19 (Enamel)';
            case 'swg-20': return 'SWG 20 (Enamel)';
            default: return val;
        }
    };

    const filteredHistory = history.filter(e => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return e.productionId.toLowerCase().includes(q) || 
               e.machineNo.toLowerCase().includes(q) || 
               getItemName(e.item).toLowerCase().includes(q) ||
               e.operator.toLowerCase().includes(q);
    });

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link to="/production">
                        <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Enamel Production</h1>
                        <p className="text-slate-500">Record production batches and manage past entries.</p>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
                        <TabsTrigger value="new" className="flex items-center gap-2">
                            <Factory className="h-4 w-4" /> New Production
                        </TabsTrigger>
                        <TabsTrigger value="history" className="flex items-center gap-2">
                            <History className="h-4 w-4" /> History & Edit
                        </TabsTrigger>
                    </TabsList>

                    {/* NEW PRODUCTION TAB */}
                    <TabsContent value="new" className="mt-6 space-y-6">
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                            {/* Input Form */}
                            <Card className="xl:col-span-4 h-fit border-slate-200 shadow-sm sticky top-6">
                                <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-2">
                                        <LayoutGrid className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <CardTitle className="text-lg font-semibold text-slate-800">Add Entry</CardTitle>
                                            <CardDescription>
                                                Production ID: <span className="font-bold text-blue-600">PRD-{globalProductionId.toString().padStart(4, "0")}</span>
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5 space-y-5">
                                    {/* General Details */}
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-1.5">
                                                <Label className="text-xs font-semibold text-slate-600 uppercase">Date</Label>
                                                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-9" />
                                            </div>
                                            <div className="grid gap-1.5">
                                                <Label className="text-xs font-semibold text-slate-600 uppercase">Shift</Label>
                                                <Select value={shift} onValueChange={setShift}>
                                                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Day">Day</SelectItem>
                                                        <SelectItem value="Night">Night</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-1.5">
                                                <Label className="text-xs font-semibold text-slate-600 uppercase">Machine</Label>
                                                <Select value={machineNo} onValueChange={setMachineNo}>
                                                    <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="M-01">M-01 (Vert)</SelectItem>
                                                        <SelectItem value="M-02">M-02 (Vert)</SelectItem>
                                                        <SelectItem value="M-03">M-03 (Horiz)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-1.5">
                                                <Label className="text-xs font-semibold text-slate-600 uppercase">Operator (Opt)</Label>
                                                <Input placeholder="Name" value={operator} onChange={(e) => setOperator(e.target.value)} className="h-9" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-slate-100" />

                                    {/* Item & Weights */}
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="grid gap-1.5 col-span-2">
                                                <Label className="text-xs font-semibold text-slate-600 uppercase">Product Item</Label>
                                                <Select value={selectedItem} onValueChange={setSelectedItem}>
                                                    <SelectTrigger className="h-9"><SelectValue placeholder="Select Product" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="copper_strip">Copper Strip</SelectItem>
                                                        <SelectItem value="workshop_item">Workshop Item</SelectItem>
                                                        <SelectItem value="swg-18">SWG 18 (Enamel)</SelectItem>
                                                        <SelectItem value="swg-19">SWG 19 (Enamel)</SelectItem>
                                                        <SelectItem value="swg-20">SWG 20 (Enamel)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-1.5 col-span-1">
                                                <Label className="text-xs font-semibold text-slate-600 uppercase">Units</Label>
                                                <Input type="number" placeholder="0" value={unitCount} onChange={(e) => setUnitCount(e.target.value)} className="h-9" />
                                            </div>
                                        </div>

                                        {selectedItem && (
                                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-4">
                                                {isWorkshopOrCopper ? (
                                                    <>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="grid gap-1.5">
                                                                <Label className="text-xs text-slate-500">Gross Wt (kg)</Label>
                                                                <Input type="number" placeholder="0.00" value={grossWeight} onChange={(e) => setGrossWeight(e.target.value)} className="font-mono h-9" />
                                                            </div>
                                                            <div className="grid gap-1.5">
                                                                <Label className="text-xs text-slate-500">Tare Wt (kg)</Label>
                                                                <Input type="number" placeholder="0.00" value={tareWeight} onChange={(e) => setTareWeight(e.target.value)} className="font-mono h-9" />
                                                            </div>
                                                        </div>
                                                        <div className="grid gap-1.5">
                                                            <Label className="text-xs font-semibold text-slate-900">Nett Wt (kg)</Label>
                                                            <Input type="number" readOnly placeholder="0.00" value={netWeight} className="font-mono h-9 bg-emerald-50 border-emerald-200 text-emerald-700 font-bold" />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="grid gap-1.5">
                                                        <Label className="text-xs font-semibold text-slate-900">Nett Wt (kg)</Label>
                                                        <Input type="number" placeholder="0.00" value={netWeight} onChange={(e) => setNetWeight(e.target.value)} className="font-mono h-9 border-blue-200 bg-blue-50/50" />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <Button onClick={handleAddPendingEntry} className="w-full bg-slate-900 hover:bg-slate-800" size="lg">
                                        <Plus className="mr-2 h-5 w-5" /> Add to Batch
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Pending List Area */}
                            <Card className="xl:col-span-8 border-slate-200 shadow-sm flex flex-col h-full min-h-[600px]">
                                <CardHeader className="bg-white border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <List className="h-5 w-5 text-slate-400" />
                                        <div>
                                            <CardTitle className="text-lg font-semibold text-slate-800">Current Production Batch</CardTitle>
                                            <CardDescription>Items to be saved under PRD-{globalProductionId.toString().padStart(4, "0")}</CardDescription>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                                            {pendingEntries.length} Items
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0 flex-1 overflow-x-auto">
                                    {pendingEntries.length === 0 ? (
                                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400">
                                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                                <Factory className="h-8 w-8 text-slate-300" />
                                            </div>
                                            <p className="text-lg font-medium text-slate-600">Batch is empty</p>
                                            <p className="text-sm">Add items using the form to build this production.</p>
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-slate-50">
                                                    <TableHead>Machine</TableHead>
                                                    <TableHead>Item</TableHead>
                                                    <TableHead className="text-center">Units</TableHead>
                                                    <TableHead className="text-right">Gross</TableHead>
                                                    <TableHead className="text-right">Tare</TableHead>
                                                    <TableHead className="text-right font-bold">Nett</TableHead>
                                                    <TableHead className="w-[50px]"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {pendingEntries.map((entry) => (
                                                    <TableRow key={entry.entryId} className="hover:bg-slate-50/50">
                                                        <TableCell>
                                                            <div className="font-medium text-slate-900">{entry.machineNo}</div>
                                                            <div className="text-xs text-slate-500">{entry.operator || "No Operator"}</div>
                                                        </TableCell>
                                                        <TableCell className="text-slate-700">{getItemName(entry.item)}</TableCell>
                                                        <TableCell className="text-center font-mono text-slate-600">{entry.unitCount || "-"}</TableCell>
                                                        <TableCell className="text-right font-mono text-slate-500">{entry.grossWeight ? `${entry.grossWeight} kg` : "-"}</TableCell>
                                                        <TableCell className="text-right font-mono text-slate-500">{entry.tareWeight ? `${entry.tareWeight} kg` : "-"}</TableCell>
                                                        <TableCell className="text-right font-mono font-bold text-emerald-600">{entry.netWeight} kg</TableCell>
                                                        <TableCell>
                                                            <Button variant="ghost" size="icon" className="text-rose-500" onClick={() => setPendingEntries(pendingEntries.filter(e => e.entryId !== entry.entryId))}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                                <div className="p-4 border-t border-slate-100 bg-blue-50/50">
                                    <Button
                                        onClick={handleSaveBatch}
                                        className="w-full sm:w-auto sm:float-right bg-blue-600 hover:bg-blue-700 text-white"
                                        size="lg"
                                        disabled={pendingEntries.length === 0}
                                    >
                                        <Save className="mr-2 h-5 w-5" />
                                        Save Production Batch
                                    </Button>
                                    <div className="clear-both"></div>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* HISTORY TAB */}
                    <TabsContent value="history" className="mt-6">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="bg-white border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-lg font-semibold text-slate-800">Production History</CardTitle>
                                    <CardDescription>View, search, and update past entries.</CardDescription>
                                </div>
                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input placeholder="Search records..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50">
                                            <TableHead className="w-[120px]">Prod ID</TableHead>
                                            <TableHead>Date / Machine</TableHead>
                                            <TableHead>Item</TableHead>
                                            <TableHead className="text-center">Units</TableHead>
                                            <TableHead className="text-right">Gross</TableHead>
                                            <TableHead className="text-right">Tare</TableHead>
                                            <TableHead className="text-right font-bold">Nett</TableHead>
                                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredHistory.map((entry) => (
                                            <TableRow key={entry.entryId}>
                                                <TableCell className="font-mono font-medium text-blue-600">{entry.productionId}</TableCell>
                                                <TableCell>
                                                    <div className="font-medium text-slate-900">{entry.machineNo}</div>
                                                    <div className="text-xs text-slate-500">{format(new Date(entry.date), "dd MMM yyyy")} • {entry.operator || "No Op"}</div>
                                                </TableCell>
                                                <TableCell className="text-slate-700">{getItemName(entry.item)}</TableCell>
                                                <TableCell className="text-center font-mono">{entry.unitCount || "-"}</TableCell>
                                                <TableCell className="text-right font-mono text-slate-500">{entry.grossWeight ? `${entry.grossWeight} kg` : "-"}</TableCell>
                                                <TableCell className="text-right font-mono text-slate-500">{entry.tareWeight ? `${entry.tareWeight} kg` : "-"}</TableCell>
                                                <TableCell className="text-right font-mono font-bold text-emerald-600">{entry.netWeight} kg</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => setEditingEntry(entry)}>
                                                        <Edit className="h-4 w-4 text-blue-600" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteHistoryEntry(entry.entryId)}>
                                                        <Trash2 className="h-4 w-4 text-rose-500" />
                                                    </Button>
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

            {/* EDIT MODAL */}
            <Dialog open={!!editingEntry} onOpenChange={(open) => !open && setEditingEntry(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Production Entry</DialogTitle>
                        <DialogDescription>Updating record for {editingEntry?.productionId}</DialogDescription>
                    </DialogHeader>
                    {editingEntry && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Machine</Label>
                                    <Select value={editingEntry.machineNo} onValueChange={(v) => setEditingEntry({...editingEntry, machineNo: v})}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="M-01">M-01 (Vert)</SelectItem>
                                            <SelectItem value="M-02">M-02 (Vert)</SelectItem>
                                            <SelectItem value="M-03">M-03 (Horiz)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Units</Label>
                                    <Input type="number" value={editingEntry.unitCount} onChange={(e) => setEditingEntry({...editingEntry, unitCount: e.target.value})} />
                                </div>
                            </div>

                            {isEditWorkshopOrCopper ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Gross Wt (kg)</Label>
                                        <Input type="number" value={editingEntry.grossWeight} onChange={(e) => setEditingEntry({...editingEntry, grossWeight: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tare Wt (kg)</Label>
                                        <Input type="number" value={editingEntry.tareWeight} onChange={(e) => setEditingEntry({...editingEntry, tareWeight: e.target.value})} />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <Label>Nett Wt (kg)</Label>
                                        <Input type="number" readOnly value={editingEntry.netWeight} className="bg-slate-50 font-bold" />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Label>Nett Wt (kg)</Label>
                                    <Input type="number" value={editingEntry.netWeight} onChange={(e) => setEditingEntry({...editingEntry, netWeight: e.target.value})} />
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingEntry(null)}>Cancel</Button>
                        <Button onClick={handleUpdateHistoryEntry} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}

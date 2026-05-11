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
    productionId: string; // The shared Production Batch ID (e.g. DP-1000)
    date: string;
    shift: string;
    machineNo: string;
    operator: string;
    inputWire: string;
    outputWire: string;
    goodWeight: string;
    scrapWeight: string;
    netYield: string;
}

export default function DrawingProduction() {
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
    const [inputWire, setInputWire] = useState("");
    const [outputWire, setOutputWire] = useState("");
    const [goodWeight, setGoodWeight] = useState("");
    const [scrapWeight, setScrapWeight] = useState("");

    // Edit Modal State
    const [editingEntry, setEditingEntry] = useState<ProductionEntry | null>(null);

    // Load Data
    useEffect(() => {
        const lastId = localStorage.getItem("lastDrawingProductionId") || "1000";
        setGlobalProductionId(parseInt(lastId));

        const savedHistory = localStorage.getItem("drawingProductionHistory");
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (e) {}
        }
    }, []);

    const calculateYield = (gw: string | number, sw: string | number) => {
        const g = Number(gw) || 0;
        const s = Number(sw) || 0;
        if (g > 0) return ((g / (g + s)) * 100).toFixed(2) + "%";
        return "0%";
    };

    // Auto-calculate Net Yield (Edit Form)
    useEffect(() => {
        if (editingEntry) {
            setEditingEntry(prev => {
                if (!prev) return prev;
                const calculatedYield = calculateYield(prev.goodWeight, prev.scrapWeight);
                if (prev.netYield === calculatedYield) return prev;
                return { ...prev, netYield: calculatedYield };
            });
        }
    }, [editingEntry?.goodWeight, editingEntry?.scrapWeight]);

    // Actions
    const handleAddPendingEntry = () => {
        if (!machineNo || !inputWire || !outputWire || !goodWeight) {
            toast.error("Please fill Machine, Input/Output Wire, and Good Weight.");
            return;
        }

        const newEntry: ProductionEntry = {
            entryId: Math.random().toString(36).substr(2, 9),
            productionId: `DP-${globalProductionId.toString().padStart(4, "0")}`,
            date,
            shift,
            machineNo,
            operator,
            inputWire,
            outputWire,
            goodWeight,
            scrapWeight,
            netYield: calculateYield(goodWeight, scrapWeight)
        };

        setPendingEntries([...pendingEntries, newEntry]);
        
        // Reset item fields
        setGoodWeight(""); 
        setScrapWeight("");
    };

    const handleSaveBatch = () => {
        if (pendingEntries.length === 0) return;

        // Move to history
        const newHistory = [...pendingEntries, ...history];
        setHistory(newHistory);
        localStorage.setItem("drawingProductionHistory", JSON.stringify(newHistory));

        // Increment ID
        const nextId = globalProductionId + 1;
        setGlobalProductionId(nextId);
        localStorage.setItem("lastDrawingProductionId", nextId.toString());

        setPendingEntries([]);
        toast.success(`Production DP-${globalProductionId.toString().padStart(4, "0")} saved!`);
    };

    const handleUpdateHistoryEntry = () => {
        if (!editingEntry) return;

        const updatedHistory = history.map(e => e.entryId === editingEntry.entryId ? editingEntry : e);
        setHistory(updatedHistory);
        localStorage.setItem("drawingProductionHistory", JSON.stringify(updatedHistory));
        setEditingEntry(null);
        toast.success(`Entry updated successfully`);
    };

    const handleDeleteHistoryEntry = (entryId: string) => {
        if (confirm("Delete this entry permanently?")) {
            const updatedHistory = history.filter(e => e.entryId !== entryId);
            setHistory(updatedHistory);
            localStorage.setItem("drawingProductionHistory", JSON.stringify(updatedHistory));
            toast.success("Entry deleted");
        }
    };

    const filteredHistory = history.filter(e => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return e.productionId.toLowerCase().includes(q) || 
               e.machineNo.toLowerCase().includes(q) || 
               e.operator.toLowerCase().includes(q) ||
               e.inputWire.toLowerCase().includes(q) ||
               e.outputWire.toLowerCase().includes(q);
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
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Drawing Production</h1>
                        <p className="text-slate-500">Record wire drawing batches and manage past entries.</p>
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
                                        <LayoutGrid className="h-5 w-5 text-amber-600" />
                                        <div>
                                            <CardTitle className="text-lg font-semibold text-slate-800">Add Entry</CardTitle>
                                            <CardDescription>
                                                Production ID: <span className="font-bold text-amber-600">DP-{globalProductionId.toString().padStart(4, "0")}</span>
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
                                                        <SelectItem value="D-01">M-01 (Fine)</SelectItem>
                                                        <SelectItem value="D-02">M-02 (Medium)</SelectItem>
                                                        <SelectItem value="D-03">M-03 (Rod)</SelectItem>
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

                                    {/* Wire Sizes */}
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-1.5">
                                                <Label className="text-xs font-semibold text-slate-600 uppercase">Input Wire (mm)</Label>
                                                <Input placeholder="e.g. 8.0" value={inputWire} onChange={(e) => setInputWire(e.target.value)} className="h-9" />
                                            </div>
                                            <div className="grid gap-1.5">
                                                <Label className="text-xs font-semibold text-slate-600 uppercase">Output Wire (mm)</Label>
                                                <Input placeholder="e.g. 2.5" value={outputWire} onChange={(e) => setOutputWire(e.target.value)} className="h-9" />
                                            </div>
                                        </div>

                                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-1.5">
                                                    <Label className="text-xs text-amber-700 font-semibold">Good Wt (kg)</Label>
                                                    <Input type="number" placeholder="0.00" value={goodWeight} onChange={(e) => setGoodWeight(e.target.value)} className="font-mono h-9 bg-white" />
                                                </div>
                                                <div className="grid gap-1.5">
                                                    <Label className="text-xs text-rose-700 font-semibold">Scrap Wt (kg)</Label>
                                                    <Input type="number" placeholder="0.00" value={scrapWeight} onChange={(e) => setScrapWeight(e.target.value)} className="font-mono h-9 bg-white" />
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-sm pt-2 border-t border-amber-200">
                                                <span className="text-amber-800">Calculated Yield:</span>
                                                <span className="font-bold text-amber-900">{calculateYield(goodWeight, scrapWeight)}</span>
                                            </div>
                                        </div>
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
                                            <CardDescription>Items to be saved under DP-{globalProductionId.toString().padStart(4, "0")}</CardDescription>
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
                                                    <TableHead>Wire (In/Out)</TableHead>
                                                    <TableHead className="text-right">Good Wt</TableHead>
                                                    <TableHead className="text-right">Scrap Wt</TableHead>
                                                    <TableHead className="text-right font-bold">Yield</TableHead>
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
                                                        <TableCell className="text-slate-700">{entry.inputWire} / {entry.outputWire} mm</TableCell>
                                                        <TableCell className="text-right font-mono text-emerald-600">{entry.goodWeight ? `${entry.goodWeight} kg` : "-"}</TableCell>
                                                        <TableCell className="text-right font-mono text-rose-500">{entry.scrapWeight ? `${entry.scrapWeight} kg` : "-"}</TableCell>
                                                        <TableCell className="text-right font-mono font-bold text-amber-600">{entry.netYield}</TableCell>
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
                                <div className="p-4 border-t border-slate-100 bg-amber-50/50">
                                    <Button
                                        onClick={handleSaveBatch}
                                        className="w-full sm:w-auto sm:float-right bg-amber-600 hover:bg-amber-700 text-white"
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
                                    <CardDescription>View, search, and update past drawing entries.</CardDescription>
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
                                            <TableHead>Wire (In/Out)</TableHead>
                                            <TableHead className="text-right">Good Wt</TableHead>
                                            <TableHead className="text-right">Scrap Wt</TableHead>
                                            <TableHead className="text-right font-bold">Yield</TableHead>
                                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredHistory.map((entry) => (
                                            <TableRow key={entry.entryId}>
                                                <TableCell className="font-mono font-medium text-amber-600">{entry.productionId}</TableCell>
                                                <TableCell>
                                                    <div className="font-medium text-slate-900">{entry.machineNo}</div>
                                                    <div className="text-xs text-slate-500">{format(new Date(entry.date), "dd MMM yyyy")} • {entry.operator || "No Op"}</div>
                                                </TableCell>
                                                <TableCell className="text-slate-700">{entry.inputWire} / {entry.outputWire} mm</TableCell>
                                                <TableCell className="text-right font-mono text-emerald-600">{entry.goodWeight ? `${entry.goodWeight} kg` : "-"}</TableCell>
                                                <TableCell className="text-right font-mono text-rose-500">{entry.scrapWeight ? `${entry.scrapWeight} kg` : "-"}</TableCell>
                                                <TableCell className="text-right font-mono font-bold text-amber-600">{entry.netYield}</TableCell>
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
                        <DialogTitle>Edit Drawing Entry</DialogTitle>
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
                                            <SelectItem value="D-01">M-01 (Fine)</SelectItem>
                                            <SelectItem value="D-02">M-02 (Medium)</SelectItem>
                                            <SelectItem value="D-03">M-03 (Rod)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Operator</Label>
                                    <Input value={editingEntry.operator} onChange={(e) => setEditingEntry({...editingEntry, operator: e.target.value})} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Input Wire (mm)</Label>
                                    <Input value={editingEntry.inputWire} onChange={(e) => setEditingEntry({...editingEntry, inputWire: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Output Wire (mm)</Label>
                                    <Input value={editingEntry.outputWire} onChange={(e) => setEditingEntry({...editingEntry, outputWire: e.target.value})} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-amber-50 p-4 rounded-lg border border-amber-100">
                                <div className="space-y-2">
                                    <Label className="text-amber-700">Good Wt (kg)</Label>
                                    <Input type="number" value={editingEntry.goodWeight} onChange={(e) => setEditingEntry({...editingEntry, goodWeight: e.target.value})} className="bg-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-rose-700">Scrap Wt (kg)</Label>
                                    <Input type="number" value={editingEntry.scrapWeight} onChange={(e) => setEditingEntry({...editingEntry, scrapWeight: e.target.value})} className="bg-white" />
                                </div>
                                <div className="col-span-2 flex justify-between items-center text-sm pt-2 border-t border-amber-200">
                                    <span className="font-semibold text-amber-800">Net Yield:</span>
                                    <span className="font-bold text-amber-900">{editingEntry.netYield}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingEntry(null)}>Cancel</Button>
                        <Button onClick={handleUpdateHistoryEntry} className="bg-amber-600 hover:bg-amber-700 text-white">Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { format } from "date-fns";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductionEntry {
    id: string; // Temporary ID for list sorting/removal
    machineNo: string;
    item: string;
    weight: string;
}

export default function EnamelProduction() {
    const [nextProductionId, setNextProductionId] = useState<number>(0);
    const [entries, setEntries] = useState<ProductionEntry[]>([]);

    // Form State
    const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
    const [machineNo, setMachineNo] = useState("");
    const [item, setItem] = useState("");
    const [weight, setWeight] = useState("");

    // Load next ID on mount
    useEffect(() => {
        const lastId = localStorage.getItem("lastEnamelProductionId") || "0";
        setNextProductionId(parseInt(lastId) + 1);
    }, []);

    const handleAddEntry = () => {
        if (!machineNo || !item || !weight) {
            toast.error("Please fill all fields to add an entry");
            return;
        }

        const newEntry: ProductionEntry = {
            id: Math.random().toString(36).substr(2, 9),
            machineNo,
            item,
            weight
        };

        setEntries([...entries, newEntry]);
        setWeight(""); // Clear weight for next entry
        // Keep Machine and Item as they might be repeated
        toast.success("Entry added to list");
    };

    const handleRemoveEntry = (id: string) => {
        setEntries(entries.filter(e => e.id !== id));
    };

    const handleSaveBatch = () => {
        if (entries.length === 0) {
            toast.error("No entries to save");
            return;
        }

        // Single ID for the entire batch
        const batchId = `EP-${nextProductionId.toString().padStart(5, "0")}`;

        // Save last ID
        localStorage.setItem("lastEnamelProductionId", nextProductionId.toString());

        // Increment for next time
        setNextProductionId(prev => prev + 1);

        toast.success(`Batch ${batchId} Saved Successfully with ${entries.length} items!`);

        setEntries([]);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link to="/production">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Enamel Production</h1>
                        <p className="text-slate-500">Record daily enamel production output. Batch ID increments once per save.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Input Area */}
                    <Card className="lg:col-span-1 h-fit border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg font-semibold text-slate-800">New Entry</CardTitle>
                            <CardDescription>Add items to current batch</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="date">Production Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="machine">Machine No</Label>
                                <Select value={machineNo} onValueChange={setMachineNo}>
                                    <SelectTrigger id="machine">
                                        <SelectValue placeholder="Select Machine" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="M-01">Machine 01 (Vertical)</SelectItem>
                                        <SelectItem value="M-02">Machine 02 (Vertical)</SelectItem>
                                        <SelectItem value="M-03">Machine 03 (Horizontal)</SelectItem>
                                        <SelectItem value="M-04">Machine 04 (Horizontal)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="item">Item / Gauge</Label>
                                <Select value={item} onValueChange={setItem}>
                                    <SelectTrigger id="item">
                                        <SelectValue placeholder="Select Item" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="swg-18">SWG 18 - Super Enamel</SelectItem>
                                        <SelectItem value="swg-19">SWG 19 - Super Enamel</SelectItem>
                                        <SelectItem value="swg-20">SWG 20 - Super Enamel</SelectItem>
                                        <SelectItem value="swg-21">SWG 21 - Dual Coat</SelectItem>
                                        <SelectItem value="swg-22">SWG 22 - Dual Coat</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="weight">Net Weight (kg)</Label>
                                <Input
                                    id="weight"
                                    type="number"
                                    placeholder="0.00"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="font-mono text-lg"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleAddEntry();
                                    }}
                                />
                            </div>

                            <Button onClick={handleAddEntry} className="w-full" variant="secondary">
                                <Plus className="mr-2 h-4 w-4" />
                                Add to List
                            </Button>
                        </CardContent>
                    </Card>

                    {/* List Area */}
                    <Card className="lg:col-span-2 border-slate-200 shadow-sm flex flex-col">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-800">Current Batch</CardTitle>
                                <CardDescription>Batch ID: EP-{nextProductionId.toString().padStart(5, "0")}</CardDescription>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-medium text-slate-500">Total Items: {entries.length}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1">
                            {entries.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                                    <p>No entries added yet.</p>
                                    <p className="text-sm">Use the form to add production records.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Machine</TableHead>
                                            <TableHead>Item</TableHead>
                                            <TableHead className="text-right">Weight (kg)</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {entries.map((entry) => (
                                            <TableRow key={entry.id}>
                                                <TableCell className="font-medium">{entry.machineNo}</TableCell>
                                                <TableCell>{entry.item}</TableCell>
                                                <TableCell className="text-right font-mono">{entry.weight}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                                                        onClick={() => handleRemoveEntry(entry.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                            <Button
                                onClick={handleSaveBatch}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                size="lg"
                                disabled={entries.length === 0}
                            >
                                <Save className="mr-2 h-5 w-5" />
                                Save Batch (ID: EP-{nextProductionId.toString().padStart(5, "0")})
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}

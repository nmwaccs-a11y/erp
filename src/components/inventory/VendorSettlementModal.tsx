import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Calculator } from "lucide-react";

interface VendorSettlementModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function VendorSettlementModal({ open, onOpenChange }: VendorSettlementModalProps) {
    const [receiptId] = useState(`VR-26-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`);
    const [vendor, setVendor] = useState("");
    const [item, setItem] = useState("");
    const [netWeightIn, setNetWeightIn] = useState("");
    const [purity, setPurity] = useState("");

    // Mock pending batches
    const [batches, setBatches] = useState([
        { id: "BAT-092", scrapItem: "Bare Copper Scrap", historicRate: 3000, remainingWt: 700, consumeQty: "" },
        { id: "BAT-088", scrapItem: "Enamel Scrap", historicRate: 2950, remainingWt: 500, consumeQty: "" }
    ]);

    const handleConsumeChange = (id: string, val: string) => {
        setBatches(batches.map(b => b.id === id ? { ...b, consumeQty: val } : b));
    };

    const vendorWatta = 120; // Mock fetched rate Based on Vendor & Purity
    const totalConsumed = batches.reduce((sum, b) => sum + (Number(b.consumeQty) || 0), 0);
    const unallocatedWire = Math.max(0, (Number(netWeightIn) || 0) - totalConsumed);
    const totalScrapVal = batches.reduce((sum, b) => sum + ((Number(b.consumeQty) || 0) * b.historicRate), 0);
    // Wire Value = Sum(Consume Qty * (Historic Rate + Watta))
    const totalWireVal = batches.reduce((sum, b) => sum + ((Number(b.consumeQty) || 0) * (b.historicRate + vendorWatta)), 0);
    const mazdooriPayable = totalWireVal - totalScrapVal;

    const handleSubmit = () => {
        console.log("Settlement:", { receiptId, vendor, item, netWeightIn, purity, batches, mazdooriPayable });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Vendor Settlement Receipt</DialogTitle>
                    <DialogDescription>
                        Clear pending scrap batches against incoming wire and calculate payable making charges (Mazdoori).
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Section A: Incoming Stock */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h3 className="font-semibold text-slate-900 mb-3 border-b pb-2">Section A: Incoming Physical Stock</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Receipt ID</Label>
                                <Input value={receiptId} disabled className="bg-white font-mono" />
                            </div>
                            <div className="space-y-2">
                                <Label>Vendor</Label>
                                <Select value={vendor} onValueChange={setVendor}>
                                    <SelectTrigger className="bg-white"><SelectValue placeholder="Select Vendor" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="VEND-101">Gamma Scrap Traders</SelectItem>
                                        <SelectItem value="VEND-102">Delta Copper Imports</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Received Item</Label>
                                <Select value={item} onValueChange={setItem}>
                                    <SelectTrigger className="bg-white"><SelectValue placeholder="Select Item" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ITM-W8">Wire No 8</SelectItem>
                                        <SelectItem value="ITM-W10">Wire No 10</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Net Weight In (KG)</Label>
                                <Input type="number" value={netWeightIn} onChange={e => setNetWeightIn(e.target.value)} className="bg-white" placeholder="e.g. 2300" />
                            </div>
                            <div className="space-y-2">
                                <Label>Purity Level</Label>
                                <Select value={purity} onValueChange={setPurity}>
                                    <SelectTrigger className="bg-white"><SelectValue placeholder="Select Purity" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="99.9">99.9% (A+)</SelectItem>
                                        <SelectItem value="95.0">95.0%</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Vendor Watta (Auto)</Label>
                                <Input value={vendorWatta} disabled className="bg-white text-emerald-700 font-bold" />
                            </div>
                        </div>
                    </div>

                    {/* Section B: Scrap Allocation */}
                    <div className="border rounded-lg border-slate-200">
                        <div className="bg-slate-100 px-4 py-2 border-b">
                            <h3 className="font-semibold text-slate-800">Section B: Scrap Allocation Matrix</h3>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Batch ID</TableHead>
                                    <TableHead>Scrap Item</TableHead>
                                    <TableHead className="text-right">Historic Rate</TableHead>
                                    <TableHead className="text-right">Remaining (KG)</TableHead>
                                    <TableHead className="text-right">Consume Qty (KG)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {batches.map(b => (
                                    <TableRow key={b.id}>
                                        <TableCell className="font-mono text-xs">{b.id}</TableCell>
                                        <TableCell>{b.scrapItem}</TableCell>
                                        <TableCell className="text-right">₨ {b.historicRate}</TableCell>
                                        <TableCell className="text-right font-medium text-blue-600">{b.remainingWt}</TableCell>
                                        <TableCell className="text-right">
                                            <Input 
                                                type="number" 
                                                className="w-24 ml-auto h-8 text-right" 
                                                value={b.consumeQty} 
                                                onChange={e => handleConsumeChange(b.id, e.target.value)} 
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Section C: Settlement Engine */}
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg text-white">
                        <h3 className="font-semibold text-slate-300 mb-3 flex items-center gap-2">
                            <Calculator className="h-4 w-4" /> Section C: Financial Settlement Engine
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="bg-slate-800 border border-slate-700 p-3 rounded-md">
                                <div className="text-xs text-slate-400">Total Consumed</div>
                                <div className="font-mono font-bold">{totalConsumed} kg</div>
                            </div>
                            <div className="bg-slate-800 border border-slate-700 p-3 rounded-md">
                                <div className="text-xs text-slate-400">Unallocated Wire</div>
                                <div className={`font-mono font-bold ${unallocatedWire > 0 ? 'text-amber-400' : 'text-slate-200'}`}>{unallocatedWire} kg</div>
                            </div>
                            <div className="bg-slate-800 border border-slate-700 p-3 rounded-md">
                                <div className="text-xs text-slate-400">Total Scrap Val</div>
                                <div className="font-mono font-bold text-slate-200">₨ {totalScrapVal.toLocaleString()}</div>
                            </div>
                            <div className="bg-slate-800 border border-slate-700 p-3 rounded-md">
                                <div className="text-xs text-slate-400">Total Wire Val</div>
                                <div className="font-mono font-bold text-slate-200">₨ {totalWireVal.toLocaleString()}</div>
                            </div>
                            <div className="bg-emerald-950 border border-emerald-800 p-3 rounded-md">
                                <div className="text-xs text-emerald-300">Mazdoori Payable</div>
                                <div className="font-mono text-xl text-emerald-400 font-bold">₨ {mazdooriPayable.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700">Settle Batch</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

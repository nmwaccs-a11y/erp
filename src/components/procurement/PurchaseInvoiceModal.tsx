import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Trash2, Calculator, Save, AlertCircle, ShoppingBag, ArrowDownToLine } from "lucide-react";
import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";

interface PurchaseInvoiceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => void;
    pendingPOs?: any[];
}

export function PurchaseInvoiceModal({ open, onOpenChange, onSubmit, pendingPOs = [] }: PurchaseInvoiceModalProps) {
    // Header State
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [invoiceId] = useState("PUR-2026-001");
    const [supplier, setSupplier] = useState("");
    const [warehouse, setWarehouse] = useState("WH-01");
    const [settlementMode, setSettlementMode] = useState("Standard Intake");
    const [finalMarketRate, setFinalMarketRate] = useState("");
    const [selectedPendingBatchId, setSelectedPendingBatchId] = useState("");

    // Order Linking State (Pull Mechanism)
    const [linkedPOId, setLinkedPOId] = useState<string | null>(null);
    const [showPullModal, setShowPullModal] = useState(false);

    // Logistics
    const [vehicleNo, setVehicleNo] = useState("");
    const [driverName, setDriverName] = useState("");
    const [remarks, setRemarks] = useState("");

    // Line Item State
    const [lines, setLines] = useState<any[]>([]);

    const itemSelectRef = useRef<HTMLButtonElement>(null);

    // Form Input State
    const [currentItem, setCurrentItem] = useState("");
    const [currentQuantity, setCurrentQuantity] = useState("");
    const [currentUnit, setCurrentUnit] = useState("kg");
    const [currentGross, setCurrentGross] = useState("");
    const [currentTare, setCurrentTare] = useState("");
    const [currentRate, setCurrentRate] = useState("");



    // Totals
    const [laborCost, setLaborCost] = useState(0);
    const [additionalCosts, setAdditionalCosts] = useState(0);

    // Setup mock pending stocks for Settle Advance mode
    const pendingStocks = [
        { id: "UB-201", weight: 1300, material: "Wire No 8" },
        { id: "UB-202", weight: 500, material: "Wire No 10" },
    ];
    
    // Calculated fields
    const currentNet = Math.max(0, Number(currentGross) - Number(currentTare));
    const currentAmount = currentNet * Number(currentRate);

    const subtotal = settlementMode === 'Settle Advance' 
        ? (pendingStocks.find(b => b.id === selectedPendingBatchId)?.weight || 0) * Number(finalMarketRate)
        : lines.reduce((sum, line) => sum + line.amount, 0);

    const netPayable = subtotal + Number(laborCost) + Number(additionalCosts);

    const handleAddLine = () => {
        if (!currentItem || !currentGross || !currentTare) {
            return; // Basic validation
        }

        const newLine = {
            id: Math.random().toString(36).substr(2, 9),
            item: currentItem,
            quantity: Number(currentQuantity),
            unit: currentUnit,
            gross: Number(currentGross),
            tare: Number(currentTare),
            netWeight: currentNet,
            rate: Number(currentRate),
            amount: currentAmount
        };

        setLines([...lines, newLine]);

        // Reset Item Fields
        setCurrentGross("");
        setCurrentQuantity("");
        setCurrentTare("");
        setCurrentRate("");
        // Keep Item/Unit for potentially faster entry

        setTimeout(() => {
            itemSelectRef.current?.focus();
        }, 0);
    };

    const removeLine = (id: string) => {
        setLines(lines.filter(l => l.id !== id));
    };

    const handleSubmit = () => {
        onSubmit({
            header: {
                invoiceId,
                date,
                supplier,
                warehouse,
                settlementMode,
                finalMarketRate,
                selectedPendingBatchId,
                vehicleNo,
                driverName,
                remarks,
                linkedPOId,
            },
            items: lines,
            totals: {
                subtotal,
                laborCost,
                additionalCosts,
                netPayable
            }
        });
        onOpenChange(false);
        // Reset form
        setLines([]);
        setSupplier("");
        setVehicleNo("");
        setLinkedPOId(null);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[100vw] w-screen h-screen flex flex-col p-0 gap-0 !rounded-none border-0 shadow-none">
                <DialogHeader className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl">New Purchase Invoice</DialogTitle>
                            <DialogDescription>Record inward supply (Stock In + Bill).</DialogDescription>
                        </div>
                        <div className="flex items-center gap-4 pr-10">
                            <div className="bg-slate-100 p-1 rounded-lg flex items-center border border-slate-200">
                                <Button 
                                    variant={settlementMode === "Standard Intake" ? "default" : "ghost"} 
                                    size="sm" 
                                    onClick={() => setSettlementMode("Standard Intake")}
                                >
                                    Standard Intake
                                </Button>
                                <Button 
                                    variant={settlementMode === "Settle Advance" ? "default" : "ghost"} 
                                    size="sm" 
                                    onClick={() => setSettlementMode("Settle Advance")}
                                    className={settlementMode === "Settle Advance" ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}
                                >
                                    Settle Advance (Suda)
                                </Button>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-500">Invoice ID</div>
                                <div className="font-mono font-bold text-lg text-blue-600">{invoiceId}</div>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden grid grid-cols-12 bg-slate-50">
                    {/* LEFT PANEL: INPUT FORM */}
                    <div className="col-span-5 bg-white border-r p-6 overflow-y-auto space-y-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent shadow-[10px_0_15px_-3px_rgba(0,0,0,0.02)] z-10">

                        {/* Header Details */}
                        <div className="space-y-5 bg-slate-50/50 p-5 rounded-xl border border-slate-100">
                            <h3 className="font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest text-xs border-b border-slate-200 pb-2">
                                <AlertCircle className="h-4 w-4 text-blue-500" /> Header Details
                            </h3>

                            <div className="grid gap-5">
                                <div className="space-y-2">
                                    <Label className="uppercase tracking-widest text-[10px] font-bold text-slate-500">Supplier</Label>
                                    <Select value={supplier} onValueChange={setSupplier}>
                                        <SelectTrigger className={cn("bg-white", settlementMode === "Settle Advance" && "border-amber-400 ring-4 ring-amber-50")}>
                                            <SelectValue placeholder="Select Supplier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sup-001">New Age Copper</SelectItem>
                                            <SelectItem value="sup-002">Metal Exchange (Alert: Unallocated Stock)</SelectItem>
                                            <SelectItem value="sup-003">Global Rods</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {settlementMode === "Settle Advance" && supplier === "sup-002" && (
                                        <p className="text-xs text-amber-600 font-medium mt-1">⚠️ You have unallocated weight waiting to be settled.</p>
                                    )}
                                </div>

                                {/* PULL FROM PO ALERT */}
                                {supplier && pendingPOs.filter(o => o.supplierId === supplier).length > 0 && !linkedPOId && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 animate-in fade-in slide-in-from-top-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <ArrowDownToLine className="h-4 w-4 text-blue-600" />
                                                <span className="text-xs font-semibold text-blue-800">
                                                    {pendingPOs.filter(o => o.supplierId === supplier).length} pending PO(s) found!
                                                </span>
                                            </div>
                                            <button className="text-xs font-medium px-2.5 py-1 rounded bg-white border border-blue-300 text-blue-700 hover:bg-blue-50" onClick={() => setShowPullModal(true)}>Pull from PO</button>
                                        </div>
                                    </div>
                                )}

                                {linkedPOId && (
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <ArrowDownToLine className="h-4 w-4 text-emerald-600" />
                                            <span className="text-xs font-bold text-emerald-800">Linked: {linkedPOId}</span>
                                        </div>
                                        <button className="text-[10px] text-slate-500 hover:text-slate-700" onClick={() => setLinkedPOId(null)}>Unlink</button>
                                    </div>
                                )}

                                {/* Pull from PO Modal */}
                                {showPullModal && (
                                    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowPullModal(false)}>
                                        <div className="bg-white rounded-lg shadow-lg p-6 w-[500px]" onClick={e => e.stopPropagation()}>
                                            <h3 className="text-lg font-bold text-slate-900 mb-3">Pull from Pending Purchase Order</h3>
                                            <div className="space-y-2">
                                                {pendingPOs.filter(o => o.supplierId === supplier).map(o => (
                                                    <div key={o.id} className="border border-slate-200 rounded-lg p-3 hover:border-blue-300 cursor-pointer transition-colors" onClick={() => { setLinkedPOId(o.id); setShowPullModal(false); }}>
                                                        <div className="flex justify-between">
                                                            <span className="font-mono font-bold text-blue-700">{o.id}</span>
                                                            <div className="text-right text-xs">
                                                                <div>Ordered: {o.total_ordered_qty?.toLocaleString()} kg</div>
                                                                <div className="text-blue-700 font-bold">Remaining: {((o.total_ordered_qty || 0) - (o.total_fulfilled_qty || 0)).toLocaleString()} kg</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="w-full mt-3 py-2 border rounded text-sm text-slate-500" onClick={() => setShowPullModal(false)}>Cancel</button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal bg-white", !date && "text-muted-foreground")}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Vehicle No <span className="text-rose-500">*</span></Label>
                                        <Input value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} placeholder="LEA-9921" className="bg-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Driver</Label>
                                        <Input value={driverName} onChange={(e) => setDriverName(e.target.value)} placeholder="Optional" className="bg-white" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Warehouse</Label>
                                    <Select value={warehouse} onValueChange={setWarehouse}>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Select Warehouse" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="WH-01">Main Warehouse</SelectItem>
                                            <SelectItem value="WH-02">Scrap Yard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-200" />

                        {settlementMode === 'Settle Advance' ? (
                            <div className="space-y-4 animate-in fade-in zoom-in-95">
                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-4">
                                    <h3 className="font-semibold text-amber-900 flex items-center gap-2">
                                        <Calculator className="h-4 w-4" /> Settle Advance Metal
                                    </h3>
                                    
                                    <div className="space-y-2">
                                        <Label className="text-amber-900">Select Pending Stock (Grid)</Label>
                                        <Select value={selectedPendingBatchId} onValueChange={setSelectedPendingBatchId}>
                                            <SelectTrigger className="bg-white border-amber-300">
                                                <SelectValue placeholder="Select Unallocated Wire Batch" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {pendingStocks.map(stock => (
                                                    <SelectItem key={stock.id} value={stock.id}>
                                                        {stock.id} - {stock.material} ({stock.weight} kg)
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-amber-900">Final Market Rate (PKR)</Label>
                                        <Input 
                                            type="number" 
                                            value={finalMarketRate} 
                                            onChange={(e) => setFinalMarketRate(e.target.value)} 
                                            className="bg-white font-mono text-lg border-amber-300" 
                                            placeholder="e.g. 2900"
                                        />
                                    </div>
                                    
                                    {selectedPendingBatchId && finalMarketRate && (
                                        <div className="mt-4 p-3 bg-white rounded border border-amber-200 shadow-sm">
                                            <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                                                <span className="text-sm font-medium text-slate-600">Calculated Settlement</span>
                                                <span className="font-mono font-bold text-lg text-emerald-600">
                                                    ₨ {((pendingStocks.find(b => b.id === selectedPendingBatchId)?.weight || 0) * Number(finalMarketRate)).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#fffdf5] p-5 rounded-xl border border-[#e5e0d8] shadow-sm space-y-5 relative overflow-hidden animate-in fade-in">
                                <div className="absolute top-0 left-0 bottom-0 w-1 bg-emerald-500"></div>
                                <h3 className="font-bold text-emerald-900 flex items-center gap-2 uppercase tracking-widest text-xs border-b border-emerald-200/60 pb-2">
                                    <Plus className="h-4 w-4 text-emerald-600" /> Add Line Item
                                </h3>

                            <div className="space-y-2">
                                <Label className="uppercase tracking-widest text-[10px] font-bold text-slate-500">Item</Label>
                                <Select value={currentItem} onValueChange={setCurrentItem}>
                                    <SelectTrigger ref={itemSelectRef} className="bg-white">
                                        <SelectValue placeholder="Select Item" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="copper_cathode">Copper Cathode</SelectItem>
                                        <SelectItem value="copper_rod">8mm Copper Rod</SelectItem>
                                        <SelectItem value="scrap_mixed">Mixed Scrap</SelectItem>
                                        <SelectItem value="pvc_resin">PVC Resin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Quantity (Nos)</Label>
                                    <Input
                                        type="number"
                                        value={currentQuantity}
                                        onChange={e => setCurrentQuantity(e.target.value)}
                                        className="bg-white"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>UOM</Label>
                                    <Select value={currentUnit} onValueChange={setCurrentUnit}>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="kg">kg</SelectItem>
                                            <SelectItem value="metric_ton">MT</SelectItem>
                                            <SelectItem value="pcs">Pcs</SelectItem>
                                            <SelectItem value="meter">Meter</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Gross Wt</Label>
                                    <div className="flex">
                                        <Input
                                            type="number"
                                            value={currentGross}
                                            onChange={(e) => setCurrentGross(e.target.value)}
                                            className="rounded-r-none bg-white"
                                            placeholder="0.00"
                                        />
                                        <Button variant="outline" size="icon" className="rounded-l-none border-l-0 active:bg-slate-100">
                                            <Calculator className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tare Wt</Label>
                                    <Input
                                        type="number"
                                        value={currentTare}
                                        onChange={(e) => setCurrentTare(e.target.value)}
                                        placeholder="0.00"
                                        className="bg-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Rate</Label>
                                <Input
                                    type="number"
                                    value={currentRate}
                                    onChange={(e) => setCurrentRate(e.target.value)}
                                    placeholder="0.00"
                                    className="bg-white"
                                />
                            </div>

                            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-slate-500">Net Weight</span>
                                    <span className="font-mono font-bold text-slate-900">{currentNet.toFixed(2)} {currentUnit}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500">Line Amount</span>
                                    <span className="font-mono font-bold text-emerald-700">
                                        {currentAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <Button onClick={handleAddLine} className="w-full bg-slate-900 text-white hover:bg-slate-800">
                                <Plus className="h-4 w-4 mr-2" /> Add to Invoice
                            </Button>
                        </div>
                        )}
                    </div>

                    {/* RIGHT PANEL: LIST & TOTALS */}
                    <div className="col-span-7 flex flex-col h-full bg-white">
                        <div className="flex-1 overflow-y-auto p-4">
                            {settlementMode === "Settle Advance" ? (
                                <div className="h-full flex flex-col items-center justify-center text-amber-400 bg-amber-50/50 rounded-lg border border-dashed border-amber-200">
                                    <Calculator className="h-12 w-12 mb-2 opacity-50 text-amber-500" />
                                    <p className="text-amber-700 font-medium text-lg">Advance Settlement Mode</p>
                                    <p className="text-amber-600/70 text-sm max-w-sm text-center mt-2">Line items disabled. This invoice simply credits the supplier's financial balance according to the market rate applied to unallocated stock.</p>
                                </div>
                            ) : lines.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                    <ShoppingBag className="h-16 w-16 mb-4 opacity-20" />
                                    <p className="text-lg font-medium">No items added yet</p>
                                    <p className="text-sm">Select items from the left panel to build your invoice.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                                            <TableHead>Item</TableHead>
                                            <TableHead className="text-right">Qty</TableHead>
                                            <TableHead className="text-right">Gross</TableHead>
                                            <TableHead className="text-right">Tare</TableHead>
                                            <TableHead className="text-right font-bold text-slate-900">Net</TableHead>
                                            <TableHead className="text-right">Rate</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lines.map((line) => (
                                            <TableRow key={line.id}>
                                                <TableCell className="font-medium">
                                                    {line.item}
                                                    <span className="text-xs text-slate-400 block">{line.unit}</span>
                                                </TableCell>
                                                <TableCell className="text-right text-slate-700">{line.quantity}</TableCell>
                                                <TableCell className="text-right text-slate-500">{line.gross}</TableCell>
                                                <TableCell className="text-right text-slate-500">{line.tare}</TableCell>
                                                <TableCell className="text-right font-mono font-bold">{line.netWeight}</TableCell>
                                                <TableCell className="text-right">
                                                    {line.rate}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {line.amount.toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:bg-rose-50" onClick={() => removeLine(line.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>

                        {/* Footer Totals */}
                        <div className="border-t bg-slate-50/50 p-6">
                            <div className="grid grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Remarks</Label>
                                        <Textarea
                                            value={remarks}
                                            onChange={(e) => setRemarks(e.target.value)}
                                            placeholder="Enter any additional notes..."
                                            className="bg-white resize-none h-20"
                                        />
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Subtotal</span>
                                        <span className="font-medium">{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">Labor / Unloading</span>
                                        <Input
                                            type="number"
                                            value={laborCost}
                                            onChange={(e) => setLaborCost(Number(e.target.value))}
                                            className="w-32 h-8 text-right bg-white border-slate-300"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">Additional Costs</span>
                                        <Input
                                            type="number"
                                            value={additionalCosts}
                                            onChange={(e) => setAdditionalCosts(Number(e.target.value))}
                                            className="w-32 h-8 text-right bg-white border-slate-300"
                                        />
                                    </div>

                                    <div className="h-px bg-slate-300 my-2" />

                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-lg text-slate-900">Net Payable</span>
                                        <span className="font-bold text-2xl text-blue-700">
                                            {netPayable.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-4 border-t bg-white">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700 w-40">
                        <Save className="h-4 w-4 mr-2" /> Save Invoice
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

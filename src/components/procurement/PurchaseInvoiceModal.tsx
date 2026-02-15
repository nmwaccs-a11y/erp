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
import { Calendar as CalendarIcon, Plus, Trash2, Calculator, Save, AlertCircle, ShoppingBag } from "lucide-react";
import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";

interface PurchaseInvoiceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => void;
}

export function PurchaseInvoiceModal({ open, onOpenChange, onSubmit }: PurchaseInvoiceModalProps) {
    // Header State
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [invoiceId] = useState("PUR-2026-001");
    const [supplier, setSupplier] = useState("");
    const [warehouse, setWarehouse] = useState("WH-01");
    const [isRatePending, setIsRatePending] = useState(false);

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

    // Calculated fields
    const currentNet = Math.max(0, Number(currentGross) - Number(currentTare));
    const currentAmount = isRatePending ? 0 : currentNet * Number(currentRate);

    const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
    const netPayable = subtotal + Number(laborCost);

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
            rate: isRatePending ? 0 : Number(currentRate),
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
                ratePending: isRatePending,
                vehicleNo,
                driverName,
                remarks
            },
            items: lines,
            totals: {
                subtotal,
                laborCost,
                netPayable
            }
        });
        onOpenChange(false);
        // Reset form
        setLines([]);
        setSupplier("");
        setVehicleNo("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl">New Purchase Invoice</DialogTitle>
                            <DialogDescription>Record inward supply (Stock In + Bill).</DialogDescription>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-lg">
                                <Switch
                                    id="rate-pending"
                                    checked={isRatePending}
                                    onCheckedChange={setIsRatePending}
                                />
                                <Label htmlFor="rate-pending" className="cursor-pointer text-sm font-medium">
                                    Rate Pending (Suda)
                                </Label>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-500">Invoice ID</div>
                                <div className="font-mono font-bold text-lg text-blue-600">{invoiceId}</div>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden grid grid-cols-12">
                    {/* LEFT PANEL: INPUT FORM */}
                    <div className="col-span-5 bg-slate-50 border-r p-6 overflow-y-auto space-y-6">

                        {/* Header Details */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" /> Header Details
                            </h3>

                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label>Supplier</Label>
                                    <Select value={supplier} onValueChange={setSupplier}>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Select Supplier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sup-001">New Age Copper</SelectItem>
                                            <SelectItem value="sup-002">Metal Exchange</SelectItem>
                                            <SelectItem value="sup-003">Global Rods</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

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

                        {/* Item Entry Form */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Add Line Item
                            </h3>

                            <div className="space-y-2">
                                <Label>Item</Label>
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
                                <Label>Rate {isRatePending && <span className="text-xs text-amber-600">(Pending)</span>}</Label>
                                <Input
                                    type="number"
                                    value={currentRate}
                                    onChange={(e) => setCurrentRate(e.target.value)}
                                    placeholder="0.00"
                                    disabled={isRatePending}
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
                                    <span className={cn("font-mono font-bold", isRatePending ? "text-slate-400" : "text-emerald-700")}>
                                        {isRatePending ? "Rate Pending" : currentAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <Button onClick={handleAddLine} className="w-full bg-slate-900 text-white hover:bg-slate-800">
                                <Plus className="h-4 w-4 mr-2" /> Add to Invoice
                            </Button>
                        </div>
                    </div>

                    {/* RIGHT PANEL: LIST & TOTALS */}
                    <div className="col-span-7 flex flex-col h-full bg-white">
                        <div className="flex-1 overflow-y-auto p-4">
                            {lines.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                                    <ShoppingBag className="h-12 w-12 mb-2 opacity-20" />
                                    <p>No items added yet</p>
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
                                                    {isRatePending ? <span className="italic text-xs text-slate-400">Pending</span> : line.rate}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {isRatePending ? "-" : line.amount.toLocaleString()}
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
                                        <span className="font-medium">{isRatePending ? "Pending" : subtotal.toLocaleString()}</span>
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

                                    <div className="h-px bg-slate-300 my-2" />

                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-lg text-slate-900">Net Payable</span>
                                        <span className="font-bold text-2xl text-blue-700">
                                            {isRatePending ? "Pending" : netPayable.toLocaleString()}
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

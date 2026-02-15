import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useEffect, useRef } from "react";
import { AlertCircle, CalendarIcon, Plus, Trash2, Calculator, Save, ShoppingBag } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CreateSalesInvoiceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => void;
}

// Mock Data
const CUSTOMERS = [
    { id: "CUST-001", name: "Gateway Motors", creditLimit: 500000, currentBalance: 480000 },
    { id: "CUST-002", name: "Alpha Wire Supply", creditLimit: 1000000, currentBalance: 200000 },
    { id: "CUST-003", name: "Pak Fans Ltd", creditLimit: 2000000, currentBalance: 150000 },
];

const ITEMS = [
    { id: "ITM-001", name: "Enamel Wire G-25", defaultTare: 1.5, unit: "kg" },
    { id: "ITM-002", name: "Copper Strip 12mm", defaultTare: 2.0, unit: "kg" },
    { id: "ITM-003", name: "Paper Covered Wire", defaultTare: 1.2, unit: "kg" },
];

export function CreateSalesInvoiceModal({ open, onOpenChange, onSubmit }: CreateSalesInvoiceModalProps) {
    // Header State
    const [invoiceId] = useState(`INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [customerId, setCustomerId] = useState("");
    const [saleMode, setSaleMode] = useState<"direct" | "premium">("direct");
    const [vehicleNo, setVehicleNo] = useState("");
    const [driverName, setDriverName] = useState("");
    const [refScrapRate, setRefScrapRate] = useState("");
    const [remarks, setRemarks] = useState("");

    // Line Item State
    const [lines, setLines] = useState<any[]>([]);

    const itemSelectRef = useRef<HTMLButtonElement>(null);

    // Form Input State
    const [currentItem, setCurrentItem] = useState("");
    const [currentQuantity, setCurrentQuantity] = useState("");
    const [currentUnit, setCurrentUnit] = useState("kg");
    const [currentBatch, setCurrentBatch] = useState("");
    const [currentGross, setCurrentGross] = useState("");
    const [currentTare, setCurrentTare] = useState("");
    const [currentRate, setCurrentRate] = useState("");

    // Footer State
    const [discount, setDiscount] = useState("");
    const [taxRate, setTaxRate] = useState("18");

    // Calculated Input Fields
    const currentNet = Math.max(0, Number(currentGross) - Number(currentTare));
    const currentAmount = currentNet * Number(currentRate);

    // Calculated Footer Fields
    const totalNetWeight = lines.reduce((sum, line) => sum + line.netWeight, 0);
    const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
    const numDiscount = parseFloat(discount) || 0;
    const numTaxRate = parseFloat(taxRate) || 0;
    const taxAmount = (subtotal - numDiscount) * (numTaxRate / 100);
    const finalTotal = subtotal - numDiscount + taxAmount;

    // Derived State
    const selectedCustomer = CUSTOMERS.find(c => c.id === customerId);
    const isOverLimit = selectedCustomer ? (selectedCustomer.currentBalance + finalTotal > selectedCustomer.creditLimit) : false;

    // Effects
    useEffect(() => {
        if (currentItem) {
            const item = ITEMS.find(i => i.id === currentItem);
            if (item) {
                setCurrentTare(item.defaultTare.toString());
                setCurrentUnit(item.unit || "kg");
            }
        }
    }, [currentItem]);


    const handleAddLine = () => {
        if (!currentItem || !currentGross || !currentTare) {
            return;
        }

        const itemDetails = ITEMS.find(i => i.id === currentItem);

        const newLine = {
            id: Math.random().toString(36).substr(2, 9),
            itemId: currentItem,
            itemName: itemDetails?.name || "Unknown Item",
            quantity: Number(currentQuantity),
            unit: currentUnit,
            batchNo: currentBatch,
            gross: Number(currentGross),
            tare: Number(currentTare),
            netWeight: currentNet,
            rate: Number(currentRate),
            amount: currentAmount
        };

        setLines([...lines, newLine]);

        // Reset Inputs
        setCurrentGross("");
        setCurrentQuantity("");
        // Keep Item, Unit, Batch, Tare, Rate for faster entry of similar items

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
                customerId,
                saleMode,
                vehicleNo,
                driverName,
                refScrapRate: saleMode === "premium" ? refScrapRate : null,
                remarks
            },
            items: lines,
            totals: {
                totalNetWeight,
                subtotal,
                discount: numDiscount,
                taxRate: numTaxRate,
                taxAmount,
                finalTotal
            }
        });
        onOpenChange(false);
        // Reset
        setLines([]);
        setCustomerId("");
        setDiscount("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-7xl h-[95vh] flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl">Generate Sales Invoice</DialogTitle>
                            <DialogDescription>Create a commercial invoice and gate pass.</DialogDescription>
                        </div>
                        <div className="flex items-center gap-4">
                            {isOverLimit && (
                                <div className="flex items-center gap-2 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                                    <AlertCircle className="h-4 w-4 text-rose-600" />
                                    <span className="text-xs font-bold text-rose-700">Credit Limit Exceeded</span>
                                </div>
                            )}
                            <div className="text-right">
                                <div className="text-xs text-slate-500 uppercase tracking-widest">Invoice ID</div>
                                <div className="font-mono font-bold text-lg text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{invoiceId}</div>
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
                                    <Label>Customer</Label>
                                    <Select value={customerId} onValueChange={setCustomerId}>
                                        <SelectTrigger className={cn("bg-white", isOverLimit && "border-rose-300 ring-rose-100")}>
                                            <SelectValue placeholder="Select Customer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CUSTOMERS.map(c => (
                                                <SelectItem key={c.id} value={c.id}>
                                                    {c.name} <span className="text-slate-400 text-xs ml-2">(Bal: {c.currentBalance.toLocaleString()})</span>
                                                </SelectItem>
                                            ))}
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

                                <div className="space-y-2">
                                    <Label>Sale Mode</Label>
                                    <div className="flex bg-slate-200 p-1 rounded-md">
                                        <button
                                            onClick={() => setSaleMode("direct")}
                                            className={cn("flex-1 text-xs font-medium py-1.5 rounded transition-all", saleMode === "direct" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700")}
                                        >
                                            DIRECT
                                        </button>
                                        <button
                                            onClick={() => setSaleMode("premium")}
                                            className={cn("flex-1 text-xs font-medium py-1.5 rounded transition-all", saleMode === "premium" ? "bg-white shadow text-emerald-700" : "text-slate-500 hover:text-slate-700")}
                                        >
                                            PREMIUM
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Vehicle No</Label>
                                        <Input placeholder="LXZ-909" className="bg-white uppercase" value={vehicleNo} onChange={e => setVehicleNo(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Driver</Label>
                                        <Input placeholder="Name" className="bg-white" value={driverName} onChange={e => setDriverName(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-200" />

                        {/* Item Entry */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Add Item
                            </h3>

                            <div className="space-y-2">
                                <Label>Item</Label>
                                <Select value={currentItem} onValueChange={setCurrentItem}>
                                    <SelectTrigger ref={itemSelectRef} className="bg-white">
                                        <SelectValue placeholder="Select Item" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ITEMS.map(i => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Batch / Lot #</Label>
                                    <Input value={currentBatch} onChange={e => setCurrentBatch(e.target.value)} className="bg-white font-mono" placeholder="BATCH-001" />
                                </div>
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
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>UOM</Label>
                                    <Select value={currentUnit} onValueChange={setCurrentUnit}>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="kg">kg</SelectItem>
                                            <SelectItem value="metric_ton">MT</SelectItem>
                                            <SelectItem value="spool">Spool</SelectItem>
                                            <SelectItem value="meter">Meter</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Gross Wt ({currentUnit})</Label>
                                    <div className="flex">
                                        <Input
                                            type="number"
                                            value={currentGross}
                                            onChange={(e) => setCurrentGross(e.target.value)}
                                            className="bg-white"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tare Wt</Label>
                                    <Input
                                        type="number"
                                        value={currentTare}
                                        onChange={(e) => setCurrentTare(e.target.value)}
                                        className="bg-white"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{saleMode === 'direct' ? 'Rate' : 'Making Charges'}</Label>
                                    <Input
                                        type="number"
                                        value={currentRate}
                                        onChange={(e) => setCurrentRate(e.target.value)}
                                        className="bg-white"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-slate-500">Net Weight</span>
                                    <span className="font-mono font-bold text-slate-900">{currentNet.toFixed(2)} {currentUnit}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500">Amount</span>
                                    <span className="font-mono font-bold text-blue-700">{currentAmount.toLocaleString()}</span>
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
                                            <TableHead>Batch</TableHead>
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
                                                    {line.itemName}
                                                    <span className="text-xs text-slate-400 block">{line.unit}</span>
                                                </TableCell>
                                                <TableCell className="font-mono text-xs">{line.batchNo}</TableCell>
                                                <TableCell className="text-right text-slate-700">{line.quantity}</TableCell>
                                                <TableCell className="text-right text-slate-500">{line.gross}</TableCell>
                                                <TableCell className="text-right text-slate-500">{line.tare}</TableCell>
                                                <TableCell className="text-right font-mono font-bold">{line.netWeight}</TableCell>
                                                <TableCell className="text-right">{line.rate}</TableCell>
                                                <TableCell className="text-right font-medium">{line.amount.toLocaleString()}</TableCell>
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
                                            placeholder="PO Ref / Special Instructions..."
                                            className="bg-white resize-none h-20"
                                        />
                                    </div>
                                    {saleMode === "premium" && (
                                        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded text-sm text-emerald-800">
                                            <strong>Premium Mode:</strong> Sales rate is applied as Making Charges. Material cost is handled via Ref. Scrap Rate.
                                        </div>
                                    )}
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">Subtotal</span>
                                        <span className="font-medium">{subtotal.toLocaleString()}</span>
                                    </div>

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">Discount</span>
                                        <Input
                                            type="number"
                                            value={discount}
                                            onChange={(e) => setDiscount(e.target.value)}
                                            placeholder="0"
                                            className="w-32 h-8 text-right bg-white border-slate-300"
                                        />
                                    </div>

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">Tax (%)</span>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                value={taxRate}
                                                onChange={(e) => setTaxRate(e.target.value)}
                                                className="w-16 h-8 text-right bg-white border-slate-300"
                                            />
                                            <div className="w-24 text-right font-medium text-slate-700">
                                                {taxAmount.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-slate-300 my-2" />

                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-lg text-slate-900">Final Total</span>
                                        <span className="font-bold text-2xl text-emerald-600">
                                            {finalTotal.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-4 border-t bg-white">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        className={isOverLimit ? "bg-rose-600 hover:bg-rose-700 w-40" : "bg-emerald-600 hover:bg-emerald-700 w-40"}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isOverLimit ? "Request Approval" : "Save Invoice"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    );
}

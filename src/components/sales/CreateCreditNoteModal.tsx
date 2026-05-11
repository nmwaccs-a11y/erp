import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useEffect, useRef } from "react";
import { CalendarIcon, Plus, Trash2, ArrowRightLeft, Banknote, Save, AlertCircle, ShoppingBag } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CreateCreditNoteModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => void;
}

// Mock Data
const CUSTOMERS = [
    { id: "CUST-001", name: "Gateway Motors" },
    { id: "CUST-002", name: "Alpha Wire Supply" },
    { id: "CUST-003", name: "Pak Fans Ltd" },
];

const ITEMS = [
    { id: "ITM-001", name: "Enamel Wire G-25", defaultRate: 2800, unit: "kg" },
    { id: "ITM-002", name: "Copper Strip 12mm", defaultRate: 2900, unit: "kg" },
];

export function CreateCreditNoteModal({ open, onOpenChange, onSubmit }: CreateCreditNoteModalProps) {
    // Header State
    const [returnId] = useState(`CN-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [customerId, setCustomerId] = useState("");
    const [originalInv, setOriginalInv] = useState("");
    const [returnAction, setReturnAction] = useState<"restock" | "scrap">("restock");
    const [remarks, setRemarks] = useState("");
    const [gatePassIn, setGatePassIn] = useState("");

    // Lines
    const [lines, setLines] = useState<any[]>([]);

    const itemSelectRef = useRef<HTMLButtonElement>(null);

    // Form Inputs
    const [currentItem, setCurrentItem] = useState("");
    const [currentQuantity, setCurrentQuantity] = useState("");
    const [currentUnit, setCurrentUnit] = useState("kg");
    const [currentGross, setCurrentGross] = useState("");
    const [currentTare, setCurrentTare] = useState("");
    const [currentRate, setCurrentRate] = useState(""); // Credit Rate
    const [deduction, setDeduction] = useState("0");

    // Calculated
    const currentNet = Math.max(0, Number(currentGross) - Number(currentTare));
    const creditAmountBeforeDeduction = currentNet * Number(currentRate);
    const deductionAmount = creditAmountBeforeDeduction * (Number(deduction) / 100);
    const currentCreditAmount = creditAmountBeforeDeduction - deductionAmount;

    const totalCreditAmount = lines.reduce((sum, line) => sum + line.creditAmount, 0);

    // Effect to set unit/rate
    useEffect(() => {
        if (currentItem) {
            const item = ITEMS.find(i => i.id === currentItem);
            if (item) {
                setCurrentRate(item.defaultRate.toString());
                setCurrentUnit(item.unit || "kg");
                setCurrentTare("0");
            }
        }
    }, [currentItem]);


    const handleAddLine = () => {
        if (!currentItem || !currentGross) return;

        const itemDetails = ITEMS.find(i => i.id === currentItem);

        const newLine = {
            id: Math.random().toString(36).substr(2, 9),
            itemId: currentItem,
            itemName: itemDetails?.name || "Unknown Item",
            quantity: Number(currentQuantity),
            unit: currentUnit,
            gross: Number(currentGross),
            tare: Number(currentTare),
            netWeight: currentNet,
            rate: Number(currentRate),
            deductionPercent: Number(deduction),
            creditAmount: currentCreditAmount
        };

        setLines([...lines, newLine]);

        // Reset Inputs partially
        setCurrentGross("");
        setCurrentQuantity("");
        setCurrentTare("");
        // Keep others

        setTimeout(() => {
            itemSelectRef.current?.focus();
        }, 0);
    };

    const removeLine = (id: string) => {
        setLines(lines.filter(l => l.id !== id));
    };

    const handleSubmit = () => {
        onSubmit({
            header: { returnId, date, customerId, originalInv, returnAction, gatePassIn, remarks },
            items: lines,
            totalCreditAmount
        });
        onOpenChange(false);
        setLines([]);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[100vw] w-screen h-screen flex flex-col p-0 gap-0 !rounded-none border-0 shadow-none">
                <DialogHeader className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl">Sales Return (Credit Note)</DialogTitle>
                            <DialogDescription>Process returned goods and issue credit.</DialogDescription>
                        </div>
                        <div className="text-right pr-10">
                            <div className="text-xs text-slate-500 uppercase tracking-widest">Return ID</div>
                            <div className="font-mono font-bold text-lg text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">{returnId}</div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden grid grid-cols-12">
                    {/* LEFT PANEL: INPUT FORM */}
                    <div className="col-span-5 bg-slate-50 border-r p-6 overflow-y-auto space-y-6">

                        {/* Header Details */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" /> Return Details
                            </h3>

                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label>Customer</Label>
                                    <Select value={customerId} onValueChange={setCustomerId}>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Select Customer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CUSTOMERS.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
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
                                    <Label>Return Action</Label>
                                    <RadioGroup defaultValue="stock" onValueChange={(v: "restock" | "scrap") => setReturnAction(v)} className="flex gap-2">
                                        <div className="flex-1 flex items-center space-x-2 bg-white px-3 py-2 rounded border shadow-sm">
                                            <RadioGroupItem value="restock" id="r1" />
                                            <Label htmlFor="r1" className="cursor-pointer text-xs font-medium">Restock</Label>
                                        </div>
                                        <div className="flex-1 flex items-center space-x-2 bg-white px-3 py-2 rounded border shadow-sm">
                                            <RadioGroupItem value="scrap" id="r2" />
                                            <Label htmlFor="r2" className="cursor-pointer text-xs font-medium">Scrap</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-2">
                                    <Label>Ref Invoice #</Label>
                                    <Input placeholder="INV-2023-..." value={originalInv} onChange={e => setOriginalInv(e.target.value)} className="bg-white" />
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-200" />

                        {/* Item Entry */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Add Returned Item
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
                                    <Label>Unit</Label>
                                    <Select value={currentUnit} onValueChange={setCurrentUnit}>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="kg">kg</SelectItem>
                                            <SelectItem value="meter">Meter</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Gross Wt</Label>
                                    <Input type="number" value={currentGross} onChange={e => setCurrentGross(e.target.value)} className="bg-white" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tare</Label>
                                    <Input type="number" value={currentTare} onChange={e => setCurrentTare(e.target.value)} className="bg-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Credit Rate</Label>
                                    <Input type="number" value={currentRate} onChange={e => setCurrentRate(e.target.value)} className="bg-white" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Deduction (%)</Label>
                                <Input type="number" value={deduction} onChange={e => setDeduction(e.target.value)} className="bg-white text-rose-600" />
                            </div>

                            <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-100">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-slate-500">Net Weight</span>
                                    <span className="font-mono font-bold text-slate-900">{currentNet.toFixed(2)} {currentUnit}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500">Credit Amount</span>
                                    <span className="font-mono font-bold text-rose-700">{currentCreditAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            <Button onClick={handleAddLine} className="w-full bg-slate-900 text-white hover:bg-slate-800">
                                <Plus className="h-4 w-4 mr-2" /> Add to Credit Note
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
                                            <TableHead className="text-right">Net Wt</TableHead>
                                            <TableHead className="text-right">Rate</TableHead>
                                            <TableHead className="text-right">Ded %</TableHead>
                                            <TableHead className="text-right font-bold text-slate-900">Total Credit</TableHead>
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
                                                <TableCell className="text-right text-slate-700">{line.quantity}</TableCell>
                                                <TableCell className="text-right font-mono">{line.netWeight}</TableCell>
                                                <TableCell className="text-right">{line.rate}</TableCell>
                                                <TableCell className="text-right text-rose-500">{line.deductionPercent}%</TableCell>
                                                <TableCell className="text-right font-medium">{line.creditAmount.toLocaleString()}</TableCell>
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
                                            placeholder="Reason..."
                                            className="bg-white resize-none h-20"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                                        <span className="font-bold text-lg text-rose-900">Total Credit</span>
                                        <span className="font-bold text-2xl text-rose-600">
                                            {totalCreditAmount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-4 border-t bg-white">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} className="bg-rose-600 hover:bg-rose-700 w-40">
                        <Save className="h-4 w-4 mr-2" /> Approve
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

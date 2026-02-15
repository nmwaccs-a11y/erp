import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Plus, Trash2, ArrowRightLeft, Banknote, Save, AlertCircle, ShoppingBag } from "lucide-react";
import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PurchaseReturnModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => void;
}

const SUPPLIERS = [
    { id: "SUP-001", name: "New Age Copper" },
    { id: "SUP-002", name: "Metal Exchange Corp" },
];

export function PurchaseReturnModal({ open, onOpenChange, onSubmit }: PurchaseReturnModalProps) {
    // Header State
    const [returnId] = useState(`DN-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [supplierId, setSupplierId] = useState("");
    const [refInvoice, setRefInvoice] = useState("");
    const [returnAction, setReturnAction] = useState<"stock" | "financial">("stock");
    const [remarks, setRemarks] = useState("");

    // Line Item State
    const [lines, setLines] = useState<any[]>([]);

    const itemSelectRef = useRef<HTMLButtonElement>(null);

    // Form Input State
    const [currentItem, setCurrentItem] = useState("");
    const [currentUnit, setCurrentUnit] = useState("kg");
    const [currentWeight, setCurrentWeight] = useState("");
    const [currentRate, setCurrentRate] = useState("");

    // Calculated fields
    const currentAmount = Number(currentWeight) * Number(currentRate);
    const totalDebit = lines.reduce((sum, line) => sum + line.amount, 0);

    const handleAddLine = () => {
        if (!currentItem || !currentWeight || !currentRate) {
            return;
        }

        const newLine = {
            id: Math.random().toString(36).substr(2, 9),
            item: currentItem,
            unit: currentUnit,
            weight: Number(currentWeight),
            rate: Number(currentRate),
            amount: currentAmount
        };

        setLines([...lines, newLine]);

        // Reset Item Fields but keep Item/Unit for convenience
        setCurrentWeight("");
        // setCurrentRate(""); // Rate might be same

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
                returnId,
                date,
                supplierId,
                refInvoice,
                returnAction,
                remarks
            },
            items: lines,
            totalDebit
        });
        onOpenChange(false);
        setLines([]);
        setSupplierId("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl">Purchase Return (Debit Note)</DialogTitle>
                            <DialogDescription>Return stock or adjust financial liability.</DialogDescription>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-slate-500 uppercase tracking-widest">Return ID</div>
                            <div className="font-mono font-bold text-lg text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">{returnId}</div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden grid grid-cols-12">
                    {/* LEFT PANEL: INPUT FORM */}
                    <div className="col-span-4 bg-slate-50 border-r p-6 overflow-y-auto space-y-6">

                        {/* Header Details */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" /> Return Details
                            </h3>

                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label>Supplier</Label>
                                    <Select value={supplierId} onValueChange={setSupplierId}>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Select Supplier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SUPPLIERS.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
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
                                    <Label>Ref Invoice #</Label>
                                    <Input
                                        placeholder="Link original purchase"
                                        value={refInvoice}
                                        onChange={e => setRefInvoice(e.target.value)}
                                        className="bg-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Action Type</Label>
                                    <RadioGroup defaultValue="stock" onValueChange={(v: "stock" | "financial") => setReturnAction(v)} className="flex flex-col gap-2">
                                        <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded border shadow-sm">
                                            <RadioGroupItem value="stock" id="r1" />
                                            <Label htmlFor="r1" className="cursor-pointer flex items-center gap-2 w-full">
                                                <ArrowRightLeft className="h-4 w-4 text-orange-500" />
                                                Return Stock
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded border shadow-sm">
                                            <RadioGroupItem value="financial" id="r2" />
                                            <Label htmlFor="r2" className="cursor-pointer flex items-center gap-2 w-full">
                                                <Banknote className="h-4 w-4 text-blue-500" />
                                                Financial Only
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-200" />

                        {/* Item Entry Form */}
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
                                        <SelectItem value="copper_cathode">Copper Cathode</SelectItem>
                                        <SelectItem value="copper_rod">8mm Copper Rod</SelectItem>
                                        <SelectItem value="scrap_mixed">Mixed Scrap</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="space-y-2 col-span-1">
                                    <Label>Unit</Label>
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
                                <div className="space-y-2 col-span-2">
                                    <Label>{returnAction === 'stock' ? 'Return Weight' : 'Weight'}</Label>
                                    <Input
                                        type="number"
                                        value={currentWeight}
                                        onChange={(e) => setCurrentWeight(e.target.value)}
                                        placeholder="0.00"
                                        className="bg-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Rate / Cost</Label>
                                <Input
                                    type="number"
                                    value={currentRate}
                                    onChange={(e) => setCurrentRate(e.target.value)}
                                    placeholder="0.00"
                                    className="bg-white"
                                />
                            </div>

                            <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-rose-700">Debit Amount</span>
                                    <span className="font-mono font-bold text-rose-700">{currentAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            <Button onClick={handleAddLine} className="w-full bg-slate-900 text-white hover:bg-slate-800">
                                <Plus className="h-4 w-4 mr-2" /> Add to Debit Note
                            </Button>
                        </div>
                    </div>

                    {/* RIGHT PANEL: LIST & TOTALS */}
                    <div className="col-span-8 flex flex-col h-full bg-white">
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
                                            <TableHead>Unit</TableHead>
                                            <TableHead className="text-right">Weight</TableHead>
                                            <TableHead className="text-right">Rate</TableHead>
                                            <TableHead className="text-right font-bold text-slate-900">Debit Amount</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lines.map((line) => (
                                            <TableRow key={line.id}>
                                                <TableCell className="font-medium">{line.item}</TableCell>
                                                <TableCell className="text-slate-500 text-xs uppercase">{line.unit}</TableCell>
                                                <TableCell className="text-right text-slate-500">{line.weight}</TableCell>
                                                <TableCell className="text-right">{line.rate}</TableCell>
                                                <TableCell className="text-right font-mono font-bold">{line.amount.toLocaleString()}</TableCell>
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
                                        <Label>Reason / Remarks</Label>
                                        <Textarea
                                            value={remarks}
                                            onChange={(e) => setRemarks(e.target.value)}
                                            placeholder="Enter reason for return..."
                                            className="bg-white resize-none h-20"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                                        <span className="font-bold text-lg text-rose-900">Total Debit</span>
                                        <span className="font-bold text-2xl text-rose-600">
                                            {totalDebit.toLocaleString()}
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
                        <Save className="h-4 w-4 mr-2" /> Save Note
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

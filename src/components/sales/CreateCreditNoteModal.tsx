import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { CalendarIcon, Plus, Trash2, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
    { id: "ITM-001", name: "Enamel Wire G-25", defaultRate: 2800 },
    { id: "ITM-002", name: "Copper Strip 12mm", defaultRate: 2900 },
];

type ReturnItem = {
    id: string;
    itemId: string;
    grossWeight: string;
    tareWeight: string;
    netWeight: number;
    deductionPercent: string;
    creditRate: string;
    creditAmount: number;
};

export function CreateCreditNoteModal({ open, onOpenChange, onSubmit }: CreateCreditNoteModalProps) {
    // Header State
    const [returnId] = useState(`CN-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [customerId, setCustomerId] = useState("");
    const [originalInv, setOriginalInv] = useState("");
    const [returnAction, setReturnAction] = useState<"restock" | "scrap">("restock");
    const [gatePassIn, setGatePassIn] = useState("");

    // Items Grid State
    const [items, setItems] = useState<ReturnItem[]>([]);

    // Totals
    const totalCreditAmount = items.reduce((sum, item) => sum + item.creditAmount, 0);

    // Handlers
    const addItem = () => {
        setItems([...items, {
            id: Math.random().toString(36).substr(2, 9),
            itemId: "",
            grossWeight: "",
            tareWeight: "",
            netWeight: 0,
            deductionPercent: "0",
            creditRate: "",
            creditAmount: 0
        }]);
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const updateItem = (id: string, field: keyof ReturnItem, value: string) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const updates: any = { [field]: value };

                // Auto-fill Rate if Item Selected
                if (field === "itemId") {
                    const selectedItem = ITEMS.find(i => i.id === value);
                    if (selectedItem) {
                        updates.creditRate = selectedItem.defaultRate.toString();
                    }
                }

                // Recalculate Net Weight
                const gross = field === "grossWeight" ? parseFloat(value) : parseFloat(item.grossWeight);
                const tare = field === "tareWeight" ? parseFloat(value) : parseFloat(item.tareWeight);
                const safeGross = isNaN(gross) ? 0 : gross;
                const safeTare = isNaN(tare) ? 0 : tare;
                const net = Math.max(0, safeGross - safeTare);
                updates.netWeight = parseFloat(net.toFixed(2));

                // Recalculate Credit Amount with Deduction
                const rate = field === "creditRate" ? parseFloat(value) : (field === "itemId" && updates.creditRate ? parseFloat(updates.creditRate) : parseFloat(item.creditRate));
                const deduction = field === "deductionPercent" ? parseFloat(value) : parseFloat(item.deductionPercent);

                const safeRate = isNaN(rate) ? 0 : rate;
                const safeDeduction = isNaN(deduction) ? 0 : deduction;

                const baseAmount = net * safeRate;
                const deductionAmount = (baseAmount * safeDeduction) / 100;
                updates.creditAmount = Math.round(baseAmount - deductionAmount);

                return { ...item, ...updates };
            }
            return item;
        }));
    };

    const handleSubmit = () => {
        onSubmit({
            header: { returnId, date, customerId, originalInv, returnAction, gatePassIn },
            items,
            totalCreditAmount
        });
        onOpenChange(false);
    };

    useEffect(() => {
        if (open && items.length === 0) addItem();
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                <DialogHeader className="border-b pb-4 mb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl">Sales Return (Credit Note)</DialogTitle>
                            <DialogDescription>
                                Process returned goods and issue credit to customer.
                            </DialogDescription>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-slate-500 uppercase tracking-widest">Return ID</div>
                            <div className="font-mono font-bold text-lg text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">{returnId}</div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 flex-1">
                    {/* Header Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div className="space-y-2">
                            <Label>Return Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
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
                            <Label>Customer</Label>
                            <Select value={customerId} onValueChange={setCustomerId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CUSTOMERS.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Return Action</Label>
                            <div className="flex bg-slate-200 p-1 rounded-md">
                                <button
                                    onClick={() => setReturnAction("restock")}
                                    className={cn("flex-1 text-xs font-medium py-1.5 rounded transition-all", returnAction === "restock" ? "bg-white shadow text-emerald-700" : "text-slate-500 hover:text-slate-700")}
                                >
                                    RESTOCK (FG)
                                </button>
                                <button
                                    onClick={() => setReturnAction("scrap")}
                                    className={cn("flex-1 text-xs font-medium py-1.5 rounded transition-all", returnAction === "scrap" ? "bg-white shadow text-rose-700" : "text-slate-500 hover:text-slate-700")}
                                >
                                    SCRAP IT
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Original Invoice #</Label>
                            <Input placeholder="Search Invoice..." value={originalInv} onChange={e => setOriginalInv(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Inward Gate Pass #</Label>
                            <Input placeholder="Vehicle Entry No" value={gatePassIn} onChange={e => setGatePassIn(e.target.value)} />
                        </div>
                    </div>

                    {/* Items Grid */}
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="w-[50px]">#</TableHead>
                                    <TableHead className="min-w-[180px]">Item Name</TableHead>
                                    <TableHead className="w-[100px]">Gross</TableHead>
                                    <TableHead className="w-[100px]">Tare</TableHead>
                                    <TableHead className="w-[100px]">Net</TableHead>
                                    <TableHead className="w-[100px]">Rate</TableHead>
                                    <TableHead className="w-[100px]">Ded. %</TableHead>
                                    <TableHead className="text-right">Credit Amount</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="text-center font-medium">{index + 1}</TableCell>
                                        <TableCell>
                                            <Select value={item.itemId} onValueChange={v => updateItem(item.id, "itemId", v)}>
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="Item" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ITEMS.map(i => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell><Input className="h-8 font-mono" type="number" placeholder="0.0" value={item.grossWeight} onChange={e => updateItem(item.id, "grossWeight", e.target.value)} /></TableCell>
                                        <TableCell><Input className="h-8 font-mono" type="number" placeholder="0.0" value={item.tareWeight} onChange={e => updateItem(item.id, "tareWeight", e.target.value)} /></TableCell>
                                        <TableCell><div className="h-8 flex items-center px-2 bg-slate-100 rounded text-sm font-mono font-bold text-slate-700">{item.netWeight}</div></TableCell>
                                        <TableCell><Input className="h-8 font-mono" type="number" placeholder="0" value={item.creditRate} onChange={e => updateItem(item.id, "creditRate", e.target.value)} /></TableCell>
                                        <TableCell><Input className="h-8 font-mono text-rose-600" type="number" placeholder="0%" value={item.deductionPercent} onChange={e => updateItem(item.id, "deductionPercent", e.target.value)} /></TableCell>
                                        <TableCell className="text-right font-mono font-bold text-slate-900">{item.creditAmount.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:bg-rose-50" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="p-2 border-t bg-slate-50/50">
                            <Button variant="ghost" size="sm" onClick={addItem} className="text-blue-600 hover:bg-blue-50"><Plus className="h-4 w-4 mr-2" /> Add Return Item</Button>
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-4 pt-4 border-t">
                        <span className="text-slate-500 font-medium">Total Credit Amount</span>
                        <div className="font-mono font-bold text-2xl text-emerald-600 bg-emerald-50 px-4 py-2 rounded border border-emerald-100">
                            <span className="text-sm mr-1 text-emerald-400">PKR</span>
                            {totalCreditAmount.toLocaleString()}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} className="bg-rose-600 hover:bg-rose-700">Approve Credit Note</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

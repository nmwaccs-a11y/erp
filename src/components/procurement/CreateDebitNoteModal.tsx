import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { CalendarIcon, Plus, Trash2, Truck } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface CreateDebitNoteModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => void;
}

// Mock Data
const SUPPLIERS = [
    { id: "SUP-001", name: "New Age Copper" },
    { id: "SUP-002", name: "Metal Exchange Corp" },
    { id: "SUP-003", name: "Global Rods" },
];

const ITEMS = [
    { id: "ITM-010", name: "Copper Rod 8mm", defaultRate: 2600 },
    { id: "ITM-011", name: "Copper Scrap (Mixed)", defaultRate: 2400 },
];

type ReturnItem = {
    id: string;
    itemId: string;
    batchNo: string;
    grossWeight: string;
    tareWeight: string;
    netWeight: number;
    returnRate: string;
    debitAmount: number;
};

export function CreateDebitNoteModal({ open, onOpenChange, onSubmit }: CreateDebitNoteModalProps) {
    // Header State
    const [returnId] = useState(`DN-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [supplierId, setSupplierId] = useState("");
    const [originalPo, setOriginalPo] = useState("");
    const [returnReason, setReturnReason] = useState("quality");
    const [driverVehicle, setDriverVehicle] = useState("");
    const [remarks, setRemarks] = useState("");

    // Items Grid State
    const [items, setItems] = useState<ReturnItem[]>([]);

    // Totals
    const totalDebitAmount = items.reduce((sum, item) => sum + item.debitAmount, 0);

    // Handlers
    const addItem = () => {
        setItems([...items, {
            id: Math.random().toString(36).substr(2, 9),
            itemId: "",
            batchNo: "",
            grossWeight: "",
            tareWeight: "",
            netWeight: 0,
            returnRate: "",
            debitAmount: 0
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
                        updates.returnRate = selectedItem.defaultRate.toString();
                    }
                }

                // Recalculate Net Weight
                const gross = field === "grossWeight" ? parseFloat(value) : parseFloat(item.grossWeight);
                const tare = field === "tareWeight" ? parseFloat(value) : parseFloat(item.tareWeight);
                const safeGross = isNaN(gross) ? 0 : gross;
                const safeTare = isNaN(tare) ? 0 : tare;
                const net = Math.max(0, safeGross - safeTare);
                updates.netWeight = parseFloat(net.toFixed(2));

                // Recalculate Debit Amount
                const rate = field === "returnRate" ? parseFloat(value) : (field === "itemId" && updates.returnRate ? parseFloat(updates.returnRate) : parseFloat(item.returnRate));
                const safeRate = isNaN(rate) ? 0 : rate;

                updates.debitAmount = Math.round(net * safeRate);

                return { ...item, ...updates };
            }
            return item;
        }));
    };

    const handleSubmit = () => {
        onSubmit({
            header: { returnId, date, supplierId, originalPo, returnReason, driverVehicle, remarks },
            items,
            totalDebitAmount
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
                            <DialogTitle className="text-xl">Purchase Return (Debit Note)</DialogTitle>
                            <DialogDescription>
                                Return defective material to supplier and create Outward Gate Pass.
                            </DialogDescription>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-slate-500 uppercase tracking-widest">Return ID</div>
                            <div className="font-mono font-bold text-lg text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{returnId}</div>
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
                            <Label>Supplier</Label>
                            <Select value={supplierId} onValueChange={setSupplierId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Supplier" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SUPPLIERS.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Return Reason</Label>
                            <Select value={returnReason} onValueChange={setReturnReason}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="quality">Quality Issue</SelectItem>
                                    <SelectItem value="rate_dispute">Rate Dispute</SelectItem>
                                    <SelectItem value="excess">Excess Quantity</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Original PO / IGP #</Label>
                            <Input placeholder="Search PO..." value={originalPo} onChange={e => setOriginalPo(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Driver / Vehicle (OGP)</Label>
                            <div className="relative">
                                <Truck className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                                <Input className="pl-8" placeholder="Vehicle Details" value={driverVehicle} onChange={e => setDriverVehicle(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Remarks</Label>
                            <Input placeholder="Notes..." value={remarks} onChange={e => setRemarks(e.target.value)} />
                        </div>
                    </div>

                    {/* Items Grid */}
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="w-[50px]">#</TableHead>
                                    <TableHead className="min-w-[180px]">Item Name</TableHead>
                                    <TableHead className="w-[100px]">Batch #</TableHead>
                                    <TableHead className="w-[100px]">Gross</TableHead>
                                    <TableHead className="w-[100px]">Tare</TableHead>
                                    <TableHead className="w-[100px]">Net</TableHead>
                                    <TableHead className="w-[100px]">Ret. Rate</TableHead>
                                    <TableHead className="text-right">Debit Amount</TableHead>
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
                                        <TableCell><Input className="h-8 font-mono" placeholder="Batch-123" value={item.batchNo} onChange={e => updateItem(item.id, "batchNo", e.target.value)} /></TableCell>
                                        <TableCell><Input className="h-8 font-mono" type="number" placeholder="0.0" value={item.grossWeight} onChange={e => updateItem(item.id, "grossWeight", e.target.value)} /></TableCell>
                                        <TableCell><Input className="h-8 font-mono" type="number" placeholder="0.0" value={item.tareWeight} onChange={e => updateItem(item.id, "tareWeight", e.target.value)} /></TableCell>
                                        <TableCell><div className="h-8 flex items-center px-2 bg-slate-100 rounded text-sm font-mono font-bold text-slate-700">{item.netWeight}</div></TableCell>
                                        <TableCell><Input className="h-8 font-mono" type="number" placeholder="0" value={item.returnRate} onChange={e => updateItem(item.id, "returnRate", e.target.value)} /></TableCell>
                                        <TableCell className="text-right font-mono font-bold text-slate-900">{item.debitAmount.toLocaleString()}</TableCell>
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
                        <span className="text-slate-500 font-medium">Total Debit Amount</span>
                        <div className="font-mono font-bold text-2xl text-emerald-600 bg-emerald-50 px-4 py-2 rounded border border-emerald-100">
                            <span className="text-sm mr-1 text-emerald-400">PKR</span>
                            {totalDebitAmount.toLocaleString()}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700">Approve Debit Note</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

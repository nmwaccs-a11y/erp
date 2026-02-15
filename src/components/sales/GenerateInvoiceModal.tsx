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
import { useState, useEffect } from "react";
import { AlertCircle, CalendarIcon, Plus, Trash2, Calculator } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface GenerateInvoiceModalProps {
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
    { id: "ITM-001", name: "Enamel Wire G-25", defaultTare: 1.5 },
    { id: "ITM-002", name: "Copper Strip 12mm", defaultTare: 2.0 },
    { id: "ITM-003", name: "Paper Covered Wire", defaultTare: 1.2 },
];

type InvoiceItem = {
    id: string;
    itemId: string;
    batchNo: string;
    grossWeight: string;
    tareWeight: string;
    netWeight: number;
    rate: string;
    amount: number;
};

export function GenerateInvoiceModal({ open, onOpenChange, onSubmit }: GenerateInvoiceModalProps) {
    // Header State
    const [invoiceId] = useState(`INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [customerId, setCustomerId] = useState("");
    const [saleMode, setSaleMode] = useState<"direct" | "premium">("direct");
    const [vehicleNo, setVehicleNo] = useState("");
    const [driverName, setDriverName] = useState("");
    const [refScrapRate, setRefScrapRate] = useState("");
    const [remarks, setRemarks] = useState("");

    // Items Grid State
    const [items, setItems] = useState<InvoiceItem[]>([]);

    // Footer State
    const [discount, setDiscount] = useState("");
    const [taxRate, setTaxRate] = useState("18");

    // Calculated Totals
    const totalNetWeight = items.reduce((sum, item) => sum + item.netWeight, 0);
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const numDiscount = parseFloat(discount) || 0;
    const numTaxRate = parseFloat(taxRate) || 0;
    const taxAmount = (subtotal - numDiscount) * (numTaxRate / 100);
    const finalTotal = subtotal - numDiscount + taxAmount;

    // Derived State
    const selectedCustomer = CUSTOMERS.find(c => c.id === customerId);
    const isOverLimit = selectedCustomer ? (selectedCustomer.currentBalance + finalTotal > selectedCustomer.creditLimit) : false;

    // Handlers
    const addItem = () => {
        setItems([...items, {
            id: Math.random().toString(36).substr(2, 9),
            itemId: "",
            batchNo: "",
            grossWeight: "",
            tareWeight: "",
            netWeight: 0,
            rate: "",
            amount: 0
        }]);
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const updateItem = (id: string, field: keyof InvoiceItem, value: string) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const updates: any = { [field]: value };

                // Auto-populate Tare if Item changes
                if (field === "itemId") {
                    const selectedItem = ITEMS.find(i => i.id === value);
                    if (selectedItem) {
                        updates.tareWeight = selectedItem.defaultTare.toString();
                    }
                }

                // Recalculate Net Weight
                const gross = field === "grossWeight" ? parseFloat(value) : parseFloat(item.grossWeight);
                const tare = field === "tareWeight" ? parseFloat(value) : (field === "itemId" && updates.tareWeight ? parseFloat(updates.tareWeight) : parseFloat(item.tareWeight)); // Handle item change tare update
                const safeGross = isNaN(gross) ? 0 : gross;
                const safeTare = isNaN(tare) ? 0 : tare;
                const net = Math.max(0, safeGross - safeTare);
                updates.netWeight = parseFloat(net.toFixed(2));

                // Recalculate Amount
                const rate = field === "rate" ? parseFloat(value) : parseFloat(item.rate);
                const safeRate = isNaN(rate) ? 0 : rate;
                updates.amount = Math.round(net * safeRate);

                return { ...item, ...updates };
            }
            return item;
        }));
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
            items,
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
    };

    // Initialize with one row
    useEffect(() => {
        if (open && items.length === 0) {
            addItem();
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col">
                <DialogHeader className="border-b pb-4 mb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl">Generate Sales Invoice</DialogTitle>
                            <DialogDescription>
                                Create a new commercial invoice and gate pass.
                            </DialogDescription>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-slate-500 uppercase tracking-widest">Invoice ID</div>
                            <div className="font-mono font-bold text-lg text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{invoiceId}</div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 flex-1">
                    {/* 1. Header Section (Master Data) */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div className="space-y-2">
                            <Label>Date</Label>
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

                        <div className="space-y-2 md:col-span-2">
                            <Label>Customer {isOverLimit && <span className="text-rose-600 font-bold ml-2 text-xs">(Limit Exceeded!)</span>}</Label>
                            <Select value={customerId} onValueChange={setCustomerId}>
                                <SelectTrigger className={cn(isOverLimit && "border-rose-500 ring-rose-200")}>
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
                            <Label>Sale Mode</Label>
                            <div className="flex bg-slate-200 p-1 rounded-md">
                                <button
                                    onClick={() => setSaleMode("direct")}
                                    className={cn("flex-1 text-sm font-medium py-1.5 rounded transition-all", saleMode === "direct" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700")}
                                >
                                    DIRECT
                                </button>
                                <button
                                    onClick={() => setSaleMode("premium")}
                                    className={cn("flex-1 text-sm font-medium py-1.5 rounded transition-all", saleMode === "premium" ? "bg-white shadow text-emerald-700" : "text-slate-500 hover:text-slate-700")}
                                >
                                    PREMIUM
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Vehicle No</Label>
                            <Input placeholder="LXZ-909" className="uppercase" value={vehicleNo} onChange={e => setVehicleNo(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Driver Name</Label>
                            <Input placeholder="Driver Name" value={driverName} onChange={e => setDriverName(e.target.value)} />
                        </div>
                        {saleMode === "premium" && (
                            <div className="space-y-2">
                                <Label className="text-emerald-700">Ref. Scrap Rate</Label>
                                <Input type="number" placeholder="Hidden COGS" className="border-emerald-200 bg-emerald-50" value={refScrapRate} onChange={e => setRefScrapRate(e.target.value)} />
                            </div>
                        )}
                        <div className={cn("space-y-2", saleMode === "premium" ? "md:col-span-1" : "md:col-span-2")}>
                            <Label>Remarks</Label>
                            <Input placeholder="PO Reference or Notes" value={remarks} onChange={e => setRemarks(e.target.value)} />
                        </div>
                    </div>

                    {/* 2. Items Grid (Detail Data) */}
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="w-[50px]">#</TableHead>
                                    <TableHead className="min-w-[200px]">Item Name</TableHead>
                                    <TableHead className="w-[120px]">Batch / Lot</TableHead>
                                    <TableHead className="w-[100px]">Gross <span className="text-xs font-normal text-slate-400">(kg)</span></TableHead>
                                    <TableHead className="w-[100px]">Tare <span className="text-xs font-normal text-slate-400">(kg)</span></TableHead>
                                    <TableHead className="w-[100px]">Net <span className="text-xs font-normal text-slate-400">(kg)</span></TableHead>
                                    <TableHead className="w-[120px]">{saleMode === "direct" ? "Rate" : "Making"}</TableHead>
                                    <TableHead className="text-right w-[150px]">Amount</TableHead>
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
                                                    <SelectValue placeholder="Select Item" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ITEMS.map(i => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Input className="h-8 font-mono text-xs" placeholder="Batch #" value={item.batchNo} onChange={e => updateItem(item.id, "batchNo", e.target.value)} />
                                        </TableCell>
                                        <TableCell>
                                            <Input className="h-8 font-mono" type="number" placeholder="0.0" value={item.grossWeight} onChange={e => updateItem(item.id, "grossWeight", e.target.value)} />
                                        </TableCell>
                                        <TableCell>
                                            <Input className="h-8 font-mono text-slate-500" type="number" placeholder="0.0" value={item.tareWeight} onChange={e => updateItem(item.id, "tareWeight", e.target.value)} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="h-8 flex items-center px-3 bg-slate-100 rounded text-sm font-mono font-bold text-slate-700">{item.netWeight.toFixed(2)}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Input className="h-8 font-mono" type="number" placeholder="0" value={item.rate} onChange={e => updateItem(item.id, "rate", e.target.value)} />
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-medium">
                                            {item.amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50" onClick={() => removeItem(item.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="p-2 border-t bg-slate-50/50">
                            <Button variant="ghost" size="sm" onClick={addItem} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                <Plus className="h-4 w-4 mr-2" /> Add New Item
                            </Button>
                        </div>
                    </div>

                    {/* 3. Footer Section (Totals & Tax) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 flex items-center justify-between">
                            <div className="text-sm font-medium text-blue-900">Total Net Weight</div>
                            <div className="text-2xl font-mono font-bold text-blue-700">{totalNetWeight.toLocaleString()} <span className="text-sm font-sans font-medium text-blue-500">kg</span></div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Subtotal</span>
                                <span className="font-mono font-medium">{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 flex items-center">Discount <span className="text-xs bg-slate-100 px-1 rounded ml-2">Flat</span></span>
                                <Input className="h-8 w-32 font-mono text-right" type="number" placeholder="0" value={discount} onChange={e => setDiscount(e.target.value)} />
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Sales Tax (%)</span>
                                <div className="flex items-center gap-2">
                                    <Input className="h-8 w-16 font-mono text-right" type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} />
                                    <span className="font-mono font-medium w-32 text-right text-slate-700">{taxAmount.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="h-px bg-slate-200 my-2"></div>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-lg text-slate-900">Final Total</span>
                                <div className="font-mono font-bold text-3xl text-emerald-600 tracking-tight bg-emerald-50 px-3 py-1 rounded border border-emerald-100 shadow-sm">
                                    <span className="text-lg mr-1 text-emerald-500">PKR</span>
                                    {finalTotal.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {isOverLimit && (
                        <Alert variant="destructive" className="animate-in fade-in zoom-in duration-300">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                <strong>Credit Limit Warning:</strong> This invoice exceeds the customer's allowed limit. Supervisor approval required.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <DialogFooter className="border-t pt-4 mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        className={isOverLimit ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"}
                        disabled={items.length === 0}
                    >
                        {isOverLimit ? "Request Approval" : "Establish Invoice"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

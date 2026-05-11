import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface CreateTriangleTradeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: any;
    onSubmit?: (data: any) => void;
}

export function CreateTriangleTradeModal({ open, onOpenChange, initialData, onSubmit }: CreateTriangleTradeModalProps) {
    const [transferId, setTransferId] = useState(`SCRAP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);

    // Parties
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");

    // Logistics & Material
    const [item, setItem] = useState("Copper Scrap");
    const [biltyNo, setBiltyNo] = useState("");
    const [vehicleNo, setVehicleNo] = useState("");
    const [grossWeight, setGrossWeight] = useState("");
    const [tareWeight, setTareWeight] = useState("");

    // Financials
    const [rate, setRate] = useState("");

    // Initialize data when editing
    useEffect(() => {
        if (open && initialData) {
            setTransferId(initialData.id);
            setSource(initialData.sourceId || "CUST-001");
            setDestination(initialData.destinationId || "VEND-101");
            setBiltyNo(initialData.biltyNo || "");
            setVehicleNo(initialData.vehicleNo || "");
            setGrossWeight(initialData.grossWeight ? String(initialData.grossWeight) : "");
            setTareWeight(initialData.tareWeight ? String(initialData.tareWeight) : "0");
            setRate(initialData.rateValue ? String(initialData.rateValue) : "");
        } else if (open && !initialData) {
            resetForm();
            setTransferId(`SCRAP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
        }
    }, [open, initialData]);

    const netWeight = useMemo(() => {
        const gross = parseFloat(grossWeight) || 0;
        const tare = parseFloat(tareWeight) || 0;
        return Math.max(0, gross - tare);
    }, [grossWeight, tareWeight]);

    const totalAmount = useMemo(() => {
        const r = parseFloat(rate) || 0;
        return netWeight * r;
    }, [netWeight, rate]);

    const handleSubmit = () => {
        console.log("Scrap Trade Posted:", {
            transferId,
            source,
            destination,
            item,
            logistics: { biltyNo, vehicleNo },
            weights: { gross: grossWeight, tare: tareWeight, net: netWeight },
            financials: { rate, amount: totalAmount }
        });
        
        // Ledger Impact Summary
        console.log("LEDGER IMPACT [SCRAP DROP]:");
        console.log(`1. Metal Khata: Debit (Reduce) ${netWeight}kg from Destination (${destination})`);
        console.log(`2. Metal Khata: Credit (Add) ${netWeight}kg to Source (${source})`);
        const submitData = {
            id: transferId,
            source,
            destination,
            item,
            biltyNo,
            vehicleNo,
            grossWeight: parseFloat(grossWeight) || 0,
            tareWeight: parseFloat(tareWeight) || 0,
            netWeight,
            rateValue: parseFloat(rate) || 0,
            rate: `${parseFloat(rate) || 0} PKR`,
            amount: `${totalAmount.toLocaleString()} PKR`,
            status: "Posted"
        };

        if (onSubmit) {
            onSubmit(submitData);
        }

        onOpenChange(false);
        if (!initialData) resetForm();
    };

    const resetForm = () => {
        setSource("");
        setDestination("");
        setBiltyNo("");
        setVehicleNo("");
        setGrossWeight("");
        setTareWeight("");
        setRate("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-blue-800">
                        {initialData ? "Edit Scrap Trade" : "New Scrap Trade"}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData ? "Update the details of the selected Scrap Trade." : "Record movement of scrap directly from Customer to Vendor for Mazdoori."}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="border-b pb-2">
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Parties</h3>
                            </div>
                            
                            <div className="grid gap-2">
                                <Label className="text-blue-700">Source (Customer)</Label>
                                <Select value={source} onValueChange={setSource}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={`Select Source Customer`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={"CUST-001"}>
                                            Gateway Motors
                                        </SelectItem>
                                        <SelectItem value={"CUST-002"}>
                                            Alpha Wire Supply
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-[10px] font-bold text-emerald-600">+ Credits Customer Metal Khata</p>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-emerald-700">Destination (Vendor)</Label>
                                <Select value={destination} onValueChange={setDestination}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={`Select Destination Vendor`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={"VEND-101"}>
                                            Gamma Scrap Traders
                                        </SelectItem>
                                        <SelectItem value={"VEND-102"}>
                                            Delta Copper
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-[10px] font-bold text-rose-600">- Debits Vendor Metal Khata</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="border-b pb-2">
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Logistics & Material</h3>
                            </div>
                            
                            <div className="grid gap-2">
                                <Label>Item / Material</Label>
                                <Select value={item} onValueChange={setItem}>
                                    <SelectTrigger><SelectValue placeholder="Select Item" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Copper Scrap">Copper Scrap</SelectItem>
                                        <SelectItem value="Silver Scrap">Silver Scrap</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Bilty No.</Label>
                                    <Input value={biltyNo} onChange={e => setBiltyNo(e.target.value)} placeholder="E.g. BL-1249" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Vehicle No.</Label>
                                    <Input value={vehicleNo} onChange={e => setVehicleNo(e.target.value)} placeholder="E.g. LEA-991" />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <div className="grid gap-1">
                                    <Label className="text-[10px] uppercase">Gross (KG)</Label>
                                    <Input type="number" value={grossWeight} onChange={e => setGrossWeight(e.target.value)} placeholder="0" className="h-8 text-xs" />
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[10px] uppercase">Tare (KG)</Label>
                                    <Input type="number" value={tareWeight} onChange={e => setTareWeight(e.target.value)} placeholder="0" className="h-8 text-xs" />
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-[10px] uppercase text-blue-700">Net (KG)</Label>
                                    <div className="h-8 flex items-center justify-center font-mono font-bold bg-white border border-blue-200 rounded text-blue-700 text-sm">
                                        {netWeight}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FINANCIALS */}
                    <div className="mt-2 bg-emerald-50/50 p-4 rounded-lg border border-emerald-200 shadow-inner">
                        <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-widest mb-4">Trade Valuation</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label className="text-xs">Scrap Rate <span className="text-[10px] text-slate-400">(PKR/kg)</span></Label>
                                <Input type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="e.g. 2400" />
                                <p className="text-[10px] text-slate-500">Rate used to value the transfer</p>
                            </div>
                            
                            <div className="grid gap-2">
                                <Label className="text-xs text-emerald-700">Total Amount <span className="text-[10px] text-emerald-400">(PKR)</span></Label>
                                <div className="h-10 flex items-center px-3 font-mono font-black bg-white border border-emerald-300 rounded text-emerald-700 text-lg shadow-sm justify-between">
                                    <span>Rs.</span>
                                    <span>{totalAmount.toLocaleString()}</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-500">
                                    <span className="text-emerald-600">+ Credits Customer</span> &middot; <span className="text-rose-600">- Debits Vendor</span>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
                <DialogFooter className="border-t pt-4 mt-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                        {initialData ? "Update Scrap Trade" : "Record Toll Drop"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

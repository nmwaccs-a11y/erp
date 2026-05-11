import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { Save, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// --- MOCK DATABASE ---
const MOCK_PARCHI_COMMITMENTS = [
    { parchi_id: "P-105", party_id: "alpha", total_amount: 500000, cleared_amount: 200000, available_balance: 300000, status: "Pending" },
    { parchi_id: "P-106", party_id: "alpha", total_amount: 100000, cleared_amount: 0, available_balance: 100000, status: "Pending" },
    { parchi_id: "P-201", party_id: "gamma", total_amount: 750000, cleared_amount: 500000, available_balance: 250000, status: "Partially Cleared" },
];

interface TransactionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => void;
}

export function TransactionModal({ open, onOpenChange, onSubmit }: TransactionModalProps) {
    const [voucherId] = useState(`CV-26-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [voucherType, setVoucherType] = useState("Receive");
    
    // Core Toggles
    const [clearanceMode, setClearanceMode] = useState("Direct"); // "Direct" | "Parchi"
    const [party, setParty] = useState("");
    
    // Direct Cash/Bank Fields
    const [mode, setMode] = useState("Cash");
    const [sourceAccount, setSourceAccount] = useState("");
    const [destAccount, setDestAccount] = useState("");
    
    // Parchi Clearance Fields
    const [selectedParchiId, setSelectedParchiId] = useState("");
    const [depositAccount, setDepositAccount] = useState("");
    
    // Shared Field
    const [amount, setAmount] = useState("");

    // Find the currently selected Parchi
    const selectedParchi = useMemo(() => {
        return MOCK_PARCHI_COMMITMENTS.find(p => p.parchi_id === selectedParchiId);
    }, [selectedParchiId]);

    // Validation Logic for Over-Clearance
    const receiptAmount = Number(amount) || 0;
    const isOverCleared = clearanceMode === "Parchi" && selectedParchi && receiptAmount > selectedParchi.available_balance;
    const isReadyToSave = clearanceMode === "Parchi" 
        ? (!isOverCleared && selectedParchiId && depositAccount && receiptAmount > 0)
        : (amount && sourceAccount && destAccount);

    const handleSubmit = () => {
        if (!isReadyToSave) return;

        let transactionData: any = {
            voucherId,
            date,
            voucherType,
            clearanceMode,
            party,
            amount: receiptAmount,
        };

        if (clearanceMode === "Direct") {
            transactionData = {
                ...transactionData,
                mode,
                sourceAccount,
                destAccount,
            };
        } else {
            // State Auto-Updater logic (simulated for backend)
            let newStatus = selectedParchi!.status;
            if (receiptAmount === selectedParchi!.available_balance) {
                newStatus = "Cleared";
            } else if (receiptAmount < selectedParchi!.available_balance) {
                newStatus = "Partially Cleared";
            }

            transactionData = {
                ...transactionData,
                parchi_id: selectedParchiId,
                depositAccount,
                parchi_new_status: newStatus,
                parchi_cleared_addition: receiptAmount,
                parchi_remaining_balance: selectedParchi!.available_balance - receiptAmount
            };
        }

        console.log("Transaction Submitted:", transactionData);
        onSubmit(transactionData);
        
        // Reset state
        onOpenChange(false);
        setSourceAccount("");
        setDestAccount("");
        setParty("");
        setAmount("");
        setSelectedParchiId("");
        setDepositAccount("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Advanced Cashbook & Parchi Clearance</DialogTitle>
                    <DialogDescription>
                        Record cash receipts/payments or clear pending Hwala Parchis against Party accounts.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-2">
                    {/* SECTION A: Voucher Header */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div className="space-y-2">
                            <Label className="text-slate-500">Voucher No.</Label>
                            <Input value={voucherId} disabled className="bg-white font-mono font-medium text-slate-700" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-500">Date</Label>
                            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-white" />
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-slate-500">Voucher Type</Label>
                            <Select value={voucherType} onValueChange={setVoucherType}>
                                <SelectTrigger className="bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Receive">CRV (Receipt In)</SelectItem>
                                    <SelectItem value="Pay">CPV (Payment Out)</SelectItem>
                                    <SelectItem value="Transfer">Transfer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-500">Party (Customer/Vendor)</Label>
                            <Select value={party} onValueChange={(val) => { setParty(val); setSelectedParchiId(""); }}>
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select Party" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="alpha">Alpha Cables</SelectItem>
                                    <SelectItem value="gamma">Gamma Scrap</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Clearance Mode Toggle */}
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button 
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${clearanceMode === "Direct" ? "bg-white shadow-sm text-slate-900 border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
                            onClick={() => setClearanceMode("Direct")}
                        >
                            Direct Cash/Bank
                        </button>
                        <button 
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${clearanceMode === "Parchi" ? "bg-white shadow-sm text-blue-700 border border-blue-200" : "text-slate-500 hover:text-slate-700"}`}
                            onClick={() => setClearanceMode("Parchi")}
                        >
                            Clear Pending Parchi
                        </button>
                    </div>

                    {/* SECTION B: Dynamic Form Areas */}
                    {clearanceMode === "Direct" ? (
                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2">
                            <div className="space-y-2">
                                <Label>Mode</Label>
                                <Select value={mode} onValueChange={setMode}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Cash">Cash</SelectItem>
                                        <SelectItem value="Bank">Bank</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Amount (PKR)</Label>
                                <Input 
                                    type="number" 
                                    value={amount} 
                                    onChange={(e) => setAmount(e.target.value)} 
                                    className="font-mono text-lg font-bold"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Source Account</Label>
                                <Select value={sourceAccount} onValueChange={setSourceAccount}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Source" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Main Cash</SelectItem>
                                        <SelectItem value="hbl">HBL Current A/C</SelectItem>
                                        <SelectItem value="meezan">Meezan Bank</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Destination Account</Label>
                                <Select value={destAccount} onValueChange={setDestAccount}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Destination" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="wage">Wage Expense</SelectItem>
                                        <SelectItem value="utility">Utility Bills</SelectItem>
                                        <SelectItem value="party_clearing">Party Clearing A/C</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 bg-blue-50/50 p-4 border border-blue-100 rounded-lg">
                            <div className="space-y-2">
                                <Label className="text-blue-900">Select Parchi</Label>
                                <Select value={selectedParchiId} onValueChange={setSelectedParchiId} disabled={!party}>
                                    <SelectTrigger className="bg-white border-blue-200">
                                        <SelectValue placeholder={party ? "Select Pending Parchi..." : "Please select a Party first"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MOCK_PARCHI_COMMITMENTS.filter(p => p.party_id === party && p.available_balance > 0).map(parchi => (
                                            <SelectItem key={parchi.parchi_id} value={parchi.parchi_id}>
                                                Parchi #{parchi.parchi_id} (Bal: {parchi.available_balance.toLocaleString()})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedParchi && (
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-500 uppercase tracking-wider">Parchi Total</Label>
                                        <div className="text-lg font-mono text-slate-700">₨ {selectedParchi.total_amount.toLocaleString()}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-500 uppercase tracking-wider">Available Balance</Label>
                                        <div className="text-lg font-mono font-bold text-blue-700">₨ {selectedParchi.available_balance.toLocaleString()}</div>
                                    </div>
                                    
                                    <div className="space-y-2 mt-2">
                                        <Label className="text-blue-900">Deposit / Payment Account</Label>
                                        <Select value={depositAccount} onValueChange={setDepositAccount}>
                                            <SelectTrigger className="bg-white border-blue-200">
                                                <SelectValue placeholder="Where is cash going?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cash">Main Cash Drawer</SelectItem>
                                                <SelectItem value="hbl">HBL Current A/C</SelectItem>
                                                <SelectItem value="meezan">Meezan Bank</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2 mt-2">
                                        <Label className={`${isOverCleared ? "text-red-600 font-bold" : "text-blue-900"}`}>Receipt / Clear Amount</Label>
                                        <Input 
                                            type="number" 
                                            value={amount} 
                                            onChange={(e) => setAmount(e.target.value)} 
                                            className={`font-mono text-lg font-bold bg-white ${isOverCleared ? "border-red-500 text-red-600 focus-visible:ring-red-500" : "border-blue-200"}`}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* SECTION C: Validation Rules */}
                            {isOverCleared && (
                                <Alert variant="destructive" className="mt-4 animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="ml-2 font-medium">
                                        Over-Clearance Lock: Cannot clear more than the pending Parchi balance of ₨ {selectedParchi?.available_balance.toLocaleString()}.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {selectedParchi && !isOverCleared && receiptAmount > 0 && (
                                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-md flex justify-between items-center text-sm">
                                    <span className="text-emerald-800 font-medium">Post-Transaction Status:</span>
                                    <span className="font-bold text-emerald-900 bg-emerald-200 px-2 py-1 rounded">
                                        {receiptAmount === selectedParchi.available_balance ? "Cleared (Closed)" : "Partially Cleared (Open)"}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="pt-2 border-t mt-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={!isReadyToSave} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                        <Save className="h-4 w-4 mr-2" /> {clearanceMode === "Parchi" ? "Clear Parchi Balance" : "Record Transaction"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

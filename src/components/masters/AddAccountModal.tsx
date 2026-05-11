import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

// Mock Parent Groups mapping based on the Blueprint
const PARENT_GROUPS: Record<string, { id: string, name: string }[]> = {
    Asset: [
        { id: "11000", name: "11000: Current Assets" },
        { id: "11100", name: "11100: Cash & Bank" },
        { id: "11200", name: "11200: Trade Receivables" },
        { id: "12000", name: "12000: Inventory Assets" },
        { id: "12100", name: "12100: Factory Stock Value" }
    ],
    Liability: [
        { id: "21000", name: "21000: Current Liabilities" },
        { id: "21100", name: "21100: Trade Payables" }
    ],
    Equity: [
        { id: "31000", name: "31000: Capital Accounts" },
        { id: "32000", name: "32000: Retained Earnings" }
    ],
    Revenue: [
        { id: "41000", name: "41000: Operating Revenue" }
    ],
    Expense: [
        { id: "51000", name: "51000: Direct Cost of Goods Sold" },
        { id: "52000", name: "52000: Operating & Admin Expenses" }
    ]
};

interface AddAccountModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddAccountModal({ open, onOpenChange }: AddAccountModalProps) {
    const [accountType, setAccountType] = useState("Expense");
    const [parent, setParent] = useState("52000");
    const [levelType, setLevelType] = useState("leaf"); // "group" | "leaf"
    const [name, setName] = useState("");

    // Simulated Auto-Gen Logic
    const accountCode = useMemo(() => {
        if (!parent) return "";
        // In a real DB, it counts children. Here we mock it by appending a random digit.
        // e.g. parent 52000 -> 52004
        const prefix = parent.substring(0, 3); 
        const randomSuffix = Math.floor(Math.random() * 9) + 1;
        return `${prefix}0${randomSuffix}`;
    }, [parent, accountType]);

    const handleTypeChange = (val: string) => {
        setAccountType(val);
        setParent(PARENT_GROUPS[val][0].id); // Auto-select first parent of new type
    };

    const handleSubmit = () => {
        console.log("Creating strict structural account:", { name, code: accountCode, type: accountType, levelType, parent });
        onOpenChange(false);
        // Reset
        setName("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Define New Structural Account</DialogTitle>
                    <DialogDescription>
                        Strict hierarchy definition (Form 8.1). Account codes are auto-generated to prevent numbering collisions.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                    
                    <div className="grid gap-2">
                        <Label className="text-slate-500 font-semibold">Account Type</Label>
                        <Select value={accountType} onValueChange={handleTypeChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(PARENT_GROUPS).map(key => (
                                    <SelectItem key={key} value={key}>{key}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-slate-500 font-semibold">Parent Group</Label>
                        <Select value={parent} onValueChange={setParent}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select parent" />
                            </SelectTrigger>
                            <SelectContent>
                                {PARENT_GROUPS[accountType].map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-slate-500 font-semibold">Level Type</Label>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button 
                                className={`flex-1 py-1.5 px-3 rounded-md text-sm font-semibold transition-colors ${levelType === "group" ? "bg-white shadow-sm text-blue-700 border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
                                onClick={() => setLevelType("group")}
                            >
                                Group (Folder)
                            </button>
                            <button 
                                className={`flex-1 py-1.5 px-3 rounded-md text-sm font-semibold transition-colors ${levelType === "leaf" ? "bg-white shadow-sm text-slate-900 border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
                                onClick={() => setLevelType("leaf")}
                            >
                                Leaf (Postable)
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-slate-500 font-semibold">Account Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Software Server Costs"
                            className="border-slate-300"
                        />
                    </div>

                    <div className="grid gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <Label className="text-slate-600 font-semibold flex items-center">
                            Auto-Generated Account Code
                        </Label>
                        <Input
                            value={accountCode}
                            disabled
                            className="bg-white font-mono text-lg font-bold text-blue-700 border-blue-200 disabled:opacity-100 cursor-not-allowed"
                        />
                        <p className="text-xs text-slate-500">Code is automatically assigned by the backend engine to ensure standard numbering within the `{parent}` group.</p>
                    </div>

                    {levelType === "leaf" && (
                         <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800 py-2">
                            <Info className="h-4 w-4 text-emerald-600" />
                            <AlertDescription className="text-xs ml-2">
                                This account will be postable in Cashbook and Journal Vouchers.
                            </AlertDescription>
                        </Alert>
                    )}

                </div>
                <DialogFooter className="pt-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700" disabled={!name}>Add Account</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

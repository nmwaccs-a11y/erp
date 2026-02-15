import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface TransactionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => void;
}

export function TransactionModal({ open, onOpenChange, onSubmit }: TransactionModalProps) {
    const [type, setType] = useState("expense");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [mode, setMode] = useState("Cash");
    const [chequeNo, setChequeNo] = useState("");
    const [bank, setBank] = useState("");
    const [party, setParty] = useState("");

    const handleSubmit = () => {
        onSubmit({
            date: new Date().toLocaleDateString(),
            description,
            type,
            amount,
            mode,
            chequeNo: mode === 'Cheque' ? chequeNo : null,
            bank: mode === 'Bank' ? bank : null,
            party: party || null,
            balance: "$12,000" // Mock update
        });
        onOpenChange(false);
        setAmount("");
        setDescription("");
        setMode("Cash");
        setChequeNo("");
        setBank("");
        setParty("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New Transaction</DialogTitle>
                    <DialogDescription>
                        Record a cash or bank transaction.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Type</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="receipt">Receipt (In)</SelectItem>
                                <SelectItem value="expense">Expense (Out)</SelectItem>
                                <SelectItem value="transfer">Contra Transfer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Mode</Label>
                        <Select value={mode} onValueChange={setMode}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="Bank">Bank Transfer</SelectItem>
                                <SelectItem value="Cheque">Cheque</SelectItem>
                                <SelectItem value="Parchi">Parchi (Hwala)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {mode === "Bank" && (
                        <div className="grid gap-2">
                            <Label>Bank</Label>
                            <Select value={bank} onValueChange={setBank}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Bank" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hbl">HBL - 001</SelectItem>
                                    <SelectItem value="meezan">Meezan - 002</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {mode === "Cheque" && (
                        <div className="grid gap-2">
                            <Label>Cheque No</Label>
                            <Input
                                value={chequeNo}
                                onChange={(e) => setChequeNo(e.target.value)}
                                placeholder="CHQ-000000"
                            />
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label>Party</Label>
                        <Select value={party} onValueChange={setParty}>
                            <SelectTrigger>
                                <SelectValue placeholder="Optional Party" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="alpha">Alpha Wire Supply</SelectItem>
                                <SelectItem value="beta">Beta Transformers</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Amount</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                            <Input
                                className="pl-6"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Description</Label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Utility Bill"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">Record Transaction</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

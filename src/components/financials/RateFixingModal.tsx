import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, FileText, Upload } from "lucide-react";
import { useState, useEffect } from "react";

interface RateFixingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedCount: number;
    totalWeight: number;
}

export function RateFixingModal({ open, onOpenChange, selectedCount, totalWeight }: RateFixingModalProps) {
    const [rate, setRate] = useState<number | string>("");
    const [liability, setLiability] = useState(0);

    useEffect(() => {
        if (rate && !isNaN(Number(rate))) {
            setLiability(Number(rate) * totalWeight);
        } else {
            setLiability(0);
        }
    }, [rate, totalWeight]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Fix Rate (Suda)</DialogTitle>
                    <DialogDescription>Finalize rate for pending inventory.</DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Selected Quantity</p>
                            <p className="text-xl font-bold text-slate-900">{totalWeight.toLocaleString()} kg</p>
                        </div>
                        <Badge variant="outline" className="bg-white">
                            {selectedCount} Challans
                        </Badge>
                    </div>

                    <div className="space-y-2">
                        <Label>Final Agreed Rate (PKR/kg)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-slate-500">₨</span>
                            <Input
                                type="number"
                                className="pl-8 text-lg font-semibold"
                                placeholder="0.00"
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                            />
                        </div>
                        <p className="text-xs text-slate-500">This will be applied to all selected items.</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Total Liability Impact</Label>
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-900 font-mono text-xl font-bold text-right">
                            ₨ {liability.toLocaleString()}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Proof of Rate (Optional)</Label>
                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors">
                            <Upload className="h-6 w-6 mb-2 text-slate-400" />
                            <span className="text-xs">Click to upload screenshot (WhatsApp/Email)</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-amber-800 text-xs">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <p>This action is irreversible. Inventory value will be retroactively updated, and a Journal Entry will be posted to the Party Ledger.</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                        Authorize & Post
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

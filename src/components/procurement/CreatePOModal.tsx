import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Printer } from "lucide-react";
import { useState } from "react";

interface CreatePOModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreatePOModal({ open, onOpenChange }: CreatePOModalProps) {
    const [lines, setLines] = useState([{ id: 1, item: "", qty: 0, rate: 0, amount: 0 }]);

    const addLine = () => {
        setLines([...lines, { id: lines.length + 1, item: "", qty: 0, rate: 0, amount: 0 }]);
    };

    const updateLine = (id: number, field: string, value: any) => {
        setLines(lines.map(l => {
            if (l.id === id) {
                const updated = { ...l, [field]: value };
                if (field === 'qty' || field === 'rate') {
                    updated.amount = Number(updated.qty) * Number(updated.rate);
                }
                return updated;
            }
            return l;
        }));
    };

    const removeLine = (id: number) => {
        if (lines.length > 1) {
            setLines(lines.filter(l => l.id !== id));
        }
    };

    const totalAmount = lines.reduce((sum, line) => sum + line.amount, 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Create Purchase Order</DialogTitle>
                    <DialogDescription>Draft a new order for raw materials or supplies.</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Vendor</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Vendor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="alpha">Alpha Wire Supply</SelectItem>
                                <SelectItem value="beta">Beta Transformers</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Expected Date</Label>
                        <Input type="date" />
                    </div>
                </div>

                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Item</TableHead>
                                <TableHead>Qty</TableHead>
                                <TableHead>Rate</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lines.map((line) => (
                                <TableRow key={line.id}>
                                    <TableCell>
                                        <Select onValueChange={(v) => updateLine(line.id, 'item', v)}>
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="Select Item" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="copper">Copper Cathode</SelectItem>
                                                <SelectItem value="rod">8mm Rod</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            className="h-8"
                                            placeholder="0"
                                            onChange={(e) => updateLine(line.id, 'qty', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            className="h-8"
                                            placeholder="0.00"
                                            onChange={(e) => updateLine(line.id, 'rate', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {line.amount.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500" onClick={() => removeLine(line.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex justify-between items-center pt-2">
                    <Button variant="outline" size="sm" onClick={addLine}>
                        <Plus className="h-4 w-4 mr-2" /> Add Item
                    </Button>
                    <div className="text-right">
                        <span className="text-sm text-slate-500 mr-2">Total:</span>
                        <span className="text-lg font-bold">₨ {totalAmount.toLocaleString()}</span>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" className="gap-2">
                        <Printer className="h-4 w-4" /> Save & Print PDF
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">Submit Order</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

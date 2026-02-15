import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ParchiModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => void;
}

export function ParchiModal({ open, onOpenChange, onSubmit }: ParchiModalProps) {
    const [party, setParty] = useState("");
    const [amount, setAmount] = useState("");
    const [dueDate, setDueDate] = useState<Date>();
    const [image, setImage] = useState<File | null>(null);

    const handleSubmit = () => {
        onSubmit({
            party,
            amount,
            dueDate: dueDate ? format(dueDate, "PPP") : "",
            image,
            status: "Pending"
        });
        onOpenChange(false);
        // Reset
        setParty("");
        setAmount("");
        setDueDate(undefined);
        setImage(null);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Issue New Parchi</DialogTitle>
                    <DialogDescription>
                        Record a financial commitment or informal slip.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Issued To</Label>
                        <Select value={party} onValueChange={setParty}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Party" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="alpha">Alpha Wire Supply</SelectItem>
                                <SelectItem value="beta">Beta Transformers</SelectItem>
                                <SelectItem value="gamma">Gamma Traders</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Amount</Label>
                        <Input
                            type="number"
                            placeholder="0.00"
                            value={amount} onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Due Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !dueDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={dueDate}
                                    onSelect={setDueDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="grid gap-2">
                        <Label>Image</Label>
                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
                                <Upload className="h-6 w-6" />
                                <span className="text-xs">Upload Parchi Image</span>
                            </div>
                            <Input type="file" className="hidden" accept="image/*" />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">Issue Parchi</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

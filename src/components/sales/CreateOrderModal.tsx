import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface CreateOrderModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => void;
}

export function CreateOrderModal({ open, onOpenChange, onSubmit }: CreateOrderModalProps) {
    const [customer, setCustomer] = useState("");
    const [date, setDate] = useState<Date>();
    const [items, setItems] = useState([{ item: "", qty: "" }]);

    const handleAddItem = () => {
        setItems([...items, { item: "", qty: "" }]);
    };

    const handleItemChange = (index: number, field: string, value: string) => {
        const newItems = [...items];
        // @ts-ignore
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleSubmit = () => {
        onSubmit({
            customer,
            deliveryDate: date ? format(date, "PPP") : "",
            items
        });
        onOpenChange(false);
        setCustomer("");
        setItems([{ item: "", qty: "" }]);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create Sales Order</DialogTitle>
                    <DialogDescription>
                        Create a new order for a customer.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Customer</Label>
                        <Select value={customer} onValueChange={setCustomer}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Customer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="gateway">Gateway Motors</SelectItem>
                                <SelectItem value="alpha">Alpha Wire Supply</SelectItem>
                                <SelectItem value="beta">Beta Transformers</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Delivery Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label>Order Items</Label>
                        {items.map((item, index) => (
                            <div key={index} className="grid grid-cols-5 gap-2">
                                <Select value={item.item} onValueChange={(val) => handleItemChange(index, "item", val)}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select Item" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="wire-8mm">Copper Wire 8mm</SelectItem>
                                        <SelectItem value="strip-12">Copper Strip 12mm</SelectItem>
                                        <SelectItem value="rod-20">Copper Rod 20mm</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input
                                    className="col-span-2"
                                    placeholder="Qty (kg)"
                                    type="number"
                                    value={item.qty}
                                    onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                                />
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={handleAddItem} className="mt-2">
                            + Add Item
                        </Button>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">Create Order</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

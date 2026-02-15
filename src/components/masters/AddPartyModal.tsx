import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface AddPartyModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddPartyModal({ open, onOpenChange }: AddPartyModalProps) {
    const [name, setName] = useState("");
    const [type, setType] = useState("Customer");
    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");
    const [limit, setLimit] = useState("");
    const [taxRegNo, setTaxRegNo] = useState("");
    const [openingBal, setOpeningBal] = useState("");
    const [balType, setBalType] = useState("Debit");

    const handleSubmit = () => {
        console.log("Creating party:", { name, type, city, phone, limit, taxRegNo, openingBal, balType });
        onOpenChange(false);
        // Reset
        setName("");
        setType("Customer");
        setCity("");
        setPhone("");
        setLimit("");
        setTaxRegNo("");
        setOpeningBal("");
        setBalType("Debit");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Party</DialogTitle>
                    <DialogDescription>
                        Register a new Customer or Vendor.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">
                            Party Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Business Name"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="type">
                            Type
                        </Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Customer">Customer</SelectItem>
                                <SelectItem value="Vendor">Vendor</SelectItem>
                                <SelectItem value="Both">Both</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="city">
                            City
                        </Label>
                        <Input
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g. Lahore"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">
                            Phone
                        </Label>
                        <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+92 300 ..."
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="taxRegNo">
                            Tax Reg No
                        </Label>
                        <Input
                            id="taxRegNo"
                            value={taxRegNo}
                            onChange={(e) => setTaxRegNo(e.target.value)}
                            placeholder="NTN / STRN"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Opening Bal</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Amount"
                                type="number"
                                value={openingBal} onChange={(e) => setOpeningBal(e.target.value)}
                                className="flex-1"
                            />
                            <Select value={balType} onValueChange={setBalType}>
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Debit">Debit</SelectItem>
                                    <SelectItem value="Credit">Credit</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {type !== "Vendor" && (
                        <div className="grid gap-2">
                            <Label htmlFor="limit">
                                Credit Limit
                            </Label>
                            <Input
                                id="limit"
                                type="number"
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">Add Party</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

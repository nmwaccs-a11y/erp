import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Anchor } from "lucide-react";
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
    const [openingFinBal, setOpeningFinBal] = useState("");
    const [openingMetalBal, setOpeningMetalBal] = useState("");

    const handleSubmit = () => {
        console.log("Creating party:", { name, type, city, phone, limit, taxRegNo, openingFinBal, openingMetalBal });
        onOpenChange(false);
        // Reset
        setName("");
        setType("Customer");
        setCity("");
        setPhone("");
        setLimit("");
        setTaxRegNo("");
        setOpeningFinBal("");
        setOpeningMetalBal("");
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
                        
                        <div className="mt-1 flex items-center text-xs font-semibold px-2 py-1.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                            <Anchor className="h-3 w-3 mr-1.5" />
                            Auto-Anchored to: 
                            <span className="ml-1 font-bold">
                                {type === "Customer" ? "11201 (Accounts Receivable)" : 
                                 type === "Vendor" ? "21101 (Accounts Payable)" : 
                                 "21101 (Trade Payables)"}
                            </span>
                        </div>
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
                        <Label>Opening Balances</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                placeholder="Fin. Bal (PKR)"
                                type="number"
                                value={openingFinBal} onChange={(e) => setOpeningFinBal(e.target.value)}
                            />
                            <Input
                                placeholder="Metal Bal (KG)"
                                type="number"
                                value={openingMetalBal} onChange={(e) => setOpeningMetalBal(e.target.value)}
                            />
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

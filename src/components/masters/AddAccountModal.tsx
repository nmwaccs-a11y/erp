import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface AddAccountModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddAccountModal({ open, onOpenChange }: AddAccountModalProps) {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [type, setType] = useState("ledger");
    const [parent, setParent] = useState("1000");

    const handleSubmit = () => {
        console.log("Creating account:", { name, code, type, parent });
        onOpenChange(false);
        // Reset
        setName("");
        setCode("");
        setType("ledger");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Account</DialogTitle>
                    <DialogDescription>
                        Add a new head to the Chart of Accounts.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="code">
                            Code
                        </Label>
                        <Input
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="e.g. 1150"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Account Title"
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
                                <SelectItem value="group">Group</SelectItem>
                                <SelectItem value="ledger">Ledger</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="parent">
                            Parent
                        </Label>
                        <Select value={parent} onValueChange={setParent}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select parent" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1000">Assets</SelectItem>
                                <SelectItem value="1100">Current Assets</SelectItem>
                                <SelectItem value="2000">Liabilities</SelectItem>
                                <SelectItem value="3000">Equity</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">Add Account</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

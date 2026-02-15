import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface AddItemModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddItemModal({ open, onOpenChange }: AddItemModalProps) {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Raw Material");
    const [unit, setUnit] = useState("kg");
    const [cost, setCost] = useState("");
    const [openingQty, setOpeningQty] = useState("");
    const [openingRate, setOpeningRate] = useState("");
    const [reorderLevel, setReorderLevel] = useState("");
    const [solidContent, setSolidContent] = useState("");
    const [wastagePct, setWastagePct] = useState("");

    const handleSubmit = () => {
        console.log("Creating item:", {
            code, name, category, unit, cost,
            openingQty, openingRate, reorderLevel,
            solidContent: category === 'Chemical' ? solidContent : null,
            wastagePct
        });
        onOpenChange(false);
        // Reset
        setCode("");
        setName("");
        setCategory("Raw Material");
        setUnit("kg");
        setCost("");
        setOpeningQty("");
        setOpeningRate("");
        setReorderLevel("");
        setSolidContent("");
        setWastagePct("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Item</DialogTitle>
                    <DialogDescription>
                        Create a new inventory item in the master catalog.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="code">
                            Item Code
                        </Label>
                        <Input
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="e.g. RAW-001"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">
                            Description
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Item Name"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="category">
                            Category
                        </Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Raw Material">Raw Material</SelectItem>
                                <SelectItem value="WIP">WIP</SelectItem>
                                <SelectItem value="Finish Goods">Finish Goods</SelectItem>
                                <SelectItem value="Scrap">Scrap</SelectItem>
                                <SelectItem value="Chemical">Chemical</SelectItem>
                                <SelectItem value="Consumable">Consumable</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="unit">
                            UOM
                        </Label>
                        <Select value={unit} onValueChange={setUnit}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="kg">Kilogram (kg)</SelectItem>
                                <SelectItem value="mtr">Meter (mtr)</SelectItem>
                                <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                                <SelectItem value="drum">Drum</SelectItem>
                                <SelectItem value="roll">Roll</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="cost">
                            Std Cost
                        </Label>
                        <Input
                            id="cost"
                            type="number"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Opening Stock</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                placeholder="Qty"
                                type="number"
                                value={openingQty} onChange={(e) => setOpeningQty(e.target.value)}
                            />
                            <Input
                                placeholder="Rate"
                                type="number"
                                value={openingRate} onChange={(e) => setOpeningRate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Min Reorder</Label>
                        <Input
                            type="number"
                            value={reorderLevel}
                            onChange={(e) => setReorderLevel(e.target.value)}
                            placeholder="Reorder Level"
                        />
                    </div>

                    {category === "Chemical" && (
                        <div className="grid gap-2">
                            <Label>Solid Content %</Label>
                            <Input
                                type="number"
                                value={solidContent}
                                onChange={(e) => setSolidContent(e.target.value)}
                                placeholder="%"
                            />
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label>Std Wastage %</Label>
                        <Input
                            type="number"
                            value={wastagePct}
                            onChange={(e) => setWastagePct(e.target.value)}
                            placeholder="For Formulas"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">Add Item</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

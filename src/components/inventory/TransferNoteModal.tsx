import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightLeft } from "lucide-react";

interface TransferNoteModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TransferNoteModal({ open, onOpenChange }: TransferNoteModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ArrowRightLeft className="h-5 w-5 text-blue-600" />
                        New Stock Transfer
                    </DialogTitle>
                    <DialogDescription>
                        Move stock between internal warehouses or issue to vendors (Hwala).
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="internal" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="internal">Internal</TabsTrigger>
                        <TabsTrigger value="hwala">Hwala (Vendor)</TabsTrigger>
                    </TabsList>

                    <TabsContent value="internal" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>From</Label>
                                <Select defaultValue="main">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="main">Main Floor</SelectItem>
                                        <SelectItem value="store">General Store</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>To</Label>
                                <Select defaultValue="scrap">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="scrap">Scrap Yard</SelectItem>
                                        <SelectItem value="wip">WIP Area</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="hwala" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select defaultValue="issue">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="issue">Issue to Vendor</SelectItem>
                                        <SelectItem value="receive">Receive from Vendor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Party</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Party" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="safeer">Safeer Metals</SelectItem>
                                        <SelectItem value="usman">Usman Traders</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </TabsContent>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="space-y-2">
                            <Label>Item</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Item" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="copper">Copper Cathode</SelectItem>
                                    <SelectItem value="wire">8mm Wire Rod</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Quantity (kg)</Label>
                                <Input type="number" placeholder="0.00" />
                            </div>
                            <div className="space-y-2">
                                <Label>Batch ID (Optional)</Label>
                                <Input placeholder="B-..." />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Notes</Label>
                            <Input placeholder="Reason for transfer..." />
                        </div>
                    </div>
                </Tabs>

                <DialogFooter className="pt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">Confirm Transfer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

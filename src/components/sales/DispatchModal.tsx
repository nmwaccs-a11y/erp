import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Truck } from "lucide-react";

interface DispatchModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => void;
    orderId?: string;
}

export function DispatchModal({ open, onOpenChange, onSubmit, orderId }: DispatchModalProps) {
    const [driverName, setDriverName] = useState("");
    const [vehicleNo, setVehicleNo] = useState("");
    const [cnic, setCnic] = useState("");

    const handleSubmit = () => {
        onSubmit({
            orderId,
            driverName,
            vehicleNo,
            cnic,
            gatePassId: `OGP-${Math.floor(Math.random() * 10000)}`
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Dispatch Challan</DialogTitle>
                    <DialogDescription>
                        Generate Outward Gate Pass (OGP) for Order #{orderId || "---"}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Driver Name</Label>
                        <Input
                            value={driverName} onChange={(e) => setDriverName(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Vehicle No</Label>
                        <Input
                            className="uppercase"
                            placeholder="e.g. ABC-123"
                            value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>CNIC / ID</Label>
                        <Input
                            placeholder="Driver ID"
                            value={cnic} onChange={(e) => setCnic(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                        <Truck className="w-4 h-4 mr-2" />
                        Sign & Dispatch
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

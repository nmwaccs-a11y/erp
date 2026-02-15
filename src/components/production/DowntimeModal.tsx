import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Clock, ZapOff, Wrench, PauseCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface DowntimeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit?: (data: { machine: string, reason: string, duration: string, notes: string }) => void;
}

export function DowntimeModal({ open, onOpenChange, onSubmit }: DowntimeModalProps) {
    const [elapsed, setElapsed] = useState(0);
    const [machine, setMachine] = useState("m2"); // Default for demo
    const [reason, setReason] = useState("maintenance");
    const [notes, setNotes] = useState("");

    // Simulate timer when modal is open
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (open) {
            setElapsed(0);
            interval = setInterval(() => {
                setElapsed(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [open]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit({
                machine: machine === "m1" ? "Drawing #1" : machine === "m2" ? "Enameling #2" : "Extruder #1",
                reason: reason,
                duration: formatTime(elapsed),
                notes
            });
        }
        onOpenChange(false);
        setNotes("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-rose-600">
                        <AlertTriangle className="h-5 w-5" />
                        Report Machine Downtime
                    </DialogTitle>
                    <DialogDescription>
                        Log the reason for the stoppage. Timer is running.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-6 bg-slate-50 rounded-lg border border-slate-100 mb-4">
                    <span className="text-xs text-slate-500 uppercase tracking-widest mb-1">Current Downtime</span>
                    <span className="text-4xl font-mono font-bold text-slate-900 tracking-wider">
                        {formatTime(elapsed)}
                    </span>
                </div>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Machine</Label>
                        <Select value={machine} onValueChange={setMachine}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="m1">Drawing Machine #1</SelectItem>
                                <SelectItem value="m2">Enameling Plant #2</SelectItem>
                                <SelectItem value="m3">Extruder #1</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Reason</Label>
                        <Select value={reason} onValueChange={setReason}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select reason" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="power">
                                    <div className="flex items-center gap-2"><ZapOff className="h-4 w-4" /> Power Failure</div>
                                </SelectItem>
                                <SelectItem value="maintenance">
                                    <div className="flex items-center gap-2"><Wrench className="h-4 w-4" /> Mechanical Breakdown</div>
                                </SelectItem>
                                <SelectItem value="shortage">
                                    <div className="flex items-center gap-2"><PauseCircle className="h-4 w-4" /> Material Shortage</div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Notes</Label>
                        <Textarea
                            placeholder="Additional details..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} className="bg-rose-600 hover:bg-rose-700">Submit Report</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

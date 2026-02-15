import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scale, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

export function WeighbridgeModal({ onCapture }: { onCapture: (weight: number) => void }) {
    const [reading, setReading] = useState(0);
    const [isStable, setIsStable] = useState(false);

    // Simulate scale reading fluctuation
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isStable) {
                const noise = Math.random() * 50;
                setReading(14500 + noise);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [isStable]);

    const handleCapture = () => {
        setIsStable(true);
        setTimeout(() => {
            onCapture(Math.floor(reading));
        }, 500);
    };

    const handleReset = () => {
        setIsStable(false);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-10 border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100">
                    <Scale className="h-4 w-4 mr-2" />
                    Connect Weighbridge
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-slate-950 border-slate-800 text-slate-100">
                <DialogHeader>
                    <DialogTitle className="text-slate-100 flex items-center gap-2">
                        <Scale className="h-5 w-5 text-emerald-500" />
                        Live Weighbridge Feed
                    </DialogTitle>
                </DialogHeader>

                <div className="py-6 flex flex-col items-center justify-center space-y-4">
                    <div className="w-full bg-slate-900 border-4 border-slate-800 rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute top-2 right-4 text-xs font-mono text-emerald-500/50">WB-01 ONLINE</div>
                        <div className="text-center">
                            <span className={`text-6xl font-mono font-bold tracking-wider ${isStable ? "text-emerald-500" : "text-emerald-500/80 animate-pulse"}`}>
                                {reading.toFixed(1)}
                            </span>
                            <span className="text-xl text-slate-500 font-mono ml-2">kg</span>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full">
                        <Button
                            variant="outline"
                            className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                            onClick={handleReset}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reset
                        </Button>
                        <Button
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                            onClick={handleCapture}
                            disabled={isStable}
                        >
                            CAPTURE WEIGHT
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

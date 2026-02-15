import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Factory, Truck, Users, Package } from "lucide-react";

interface HwalaNodeProps {
    name: string;
    type: "factory" | "vendor";
    stock: number;
    color: string;
}

function HwalaNode({ name, type, stock, color }: HwalaNodeProps) {
    return (
        <div className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 ${type === 'factory' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 bg-white shadow-sm'}`}>
            <div className={`p-3 rounded-full ${color} text-white`}>
                {type === 'factory' ? <Factory className="h-6 w-6" /> : <Users className="h-6 w-6" />}
            </div>
            <div className="text-center">
                <div className="font-semibold text-sm">{name}</div>
                <div className="text-xs text-slate-500 font-mono mt-1">{stock.toLocaleString()} kg</div>
            </div>
            {type === 'vendor' && (
                <Badge variant="outline" className="text-[10px] mt-1 bg-amber-50 text-amber-700 border-amber-200">
                    Net: -{(stock * 0.1).toFixed(0)} kg
                </Badge>
            )}
        </div>
    );
}

export default function HwalaMap() {
    return (
        <div className="grid gap-6">
            <div className="relative flex flex-col md:flex-row items-center justify-center gap-12 py-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-300">
                {/* Central Factory Node */}
                <div className="z-10">
                    <HwalaNode name="CopperSync Main" type="factory" stock={15400} color="bg-slate-900" />
                </div>

                {/* Connection Lines (Visual only, absolute text) */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full -translate-y-1/2 px-20 -z-0">
                    <div className="w-full h-[2px] bg-slate-200 relative">
                        <div className="absolute left-[20%] -top-3 px-2 bg-slate-50 text-xs text-slate-400">Issued: 500kg</div>
                        <div className="absolute right-[20%] -top-3 px-2 bg-slate-50 text-xs text-slate-400">Recv: 1200kg</div>
                    </div>
                </div>

                {/* Vendors */}
                <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <HwalaNode name="Safeer Metals" type="vendor" stock={2400} color="bg-blue-600" />
                    <HwalaNode name="Usman Traders" type="vendor" stock={850} color="bg-emerald-600" />
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <Card className="shadow-none border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Virtual Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3,250 kg</div>
                        <p className="text-xs text-slate-500">+12% from last month</p>
                    </CardContent>
                </Card>
                <Card className="shadow-none border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Pending Recoveries</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">450 kg</div>
                        <p className="text-xs text-slate-500">From 2 Vendors</p>
                    </CardContent>
                </Card>
                <Card className="shadow-none border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Net Position</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">Balanced</div>
                        <p className="text-xs text-slate-500">All accounts reconciled</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

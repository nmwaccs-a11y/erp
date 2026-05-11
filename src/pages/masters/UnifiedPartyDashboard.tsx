import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wallet, Package, AlertTriangle, ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function UnifiedPartyDashboard() {
    const { id = "PTY-001" } = useParams();
    
    // Mock Data based on unified ledger specs
    const partyName = "Gamma Scrap Traders";
    const partyType = "Vendor";
    
    const financialBalance = 450000; // PKR Payable to them
    const metalBalance = -1300; // KG Metal out (Advance material given to them)
    
    const unallocatedWeight = 1300; // KG Waiting to be settled in Suda/Advance Settlement
    
    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link to="/masters/parties">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{partyName}</h1>
                            <Badge variant="outline" className="bg-slate-100 text-slate-700">{id}</Badge>
                            <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">{partyType}</Badge>
                        </div>
                        <p className="text-slate-500 mt-1">Unified Party Dashboard - Dual Ledger Overview</p>
                    </div>
                </div>

                {/* --- Pending Action Alert Bar --- */}
                {unallocatedWeight > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-amber-900">Pending Action Required</h3>
                                <p className="text-sm text-amber-700 font-medium mt-0.5">
                                    You have <strong className="font-mono">{unallocatedWeight} kg</strong> of unallocated metal from this party.
                                </p>
                            </div>
                        </div>
                        <Link to="/purchase">
                            <Button className="bg-amber-500 hover:bg-amber-600 shadow-sm text-white border-0">
                                Settle Advance <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* UI Element 1: Financial Card (PKR) */}
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-slate-600 text-lg flex items-center gap-2">
                                    <Wallet className="h-5 w-5 text-slate-400" /> Financial Khata (PKR)
                                </CardTitle>
                                <Badge variant="outline" className={financialBalance > 0 ? "text-emerald-600 border-emerald-200 bg-emerald-50" : "text-rose-600 border-rose-200 bg-rose-50"}>
                                    {financialBalance > 0 ? "Payable" : "Receivable"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-5xl font-mono font-bold py-4 ${financialBalance > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                                ₨ {Math.abs(financialBalance).toLocaleString()}
                            </div>
                            <div className="flex items-center justify-between text-sm mt-4 border-t pt-4">
                                <span className="text-slate-500">Credit Limit: <strong className="text-slate-900">No Limit</strong></span>
                                <Button variant="link" className="h-auto p-0 text-blue-600">View Ledger</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* UI Element 2: Material Card (KG) */}
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-slate-600 text-lg flex items-center gap-2">
                                    <Package className="h-5 w-5 text-slate-400" /> Metal Khata (KG)
                                </CardTitle>
                                <Badge variant="outline" className={metalBalance < 0 ? "text-amber-600 border-amber-200 bg-amber-50" : "text-blue-600 border-blue-200 bg-blue-50"}>
                                    {metalBalance < 0 ? "Owed to us" : "Advance Given"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-5xl font-mono font-bold py-4 ${metalBalance < 0 ? "text-amber-500" : "text-blue-600"}`}>
                                {Math.abs(metalBalance).toLocaleString()} <span className="text-3xl text-slate-400">kg</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-4 border-t pt-4">
                                <span className="text-slate-500">Unsettled Scrap: <strong className="text-slate-900">{unallocatedWeight} kg</strong></span>
                                <Button variant="link" className="h-auto p-0 text-blue-600">View Metal Ledger</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}

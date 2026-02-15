import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Phone, MapPin, Building, CreditCard, Filter } from "lucide-react";
import { useState } from "react";
import { AddPartyModal } from "@/components/masters/AddPartyModal";

export default function PartyMaster() {
    const [isAddOpen, setIsAddOpen] = useState(false);

    const parties = [
        { id: "P-001", name: "Alpha Cables Pvt Ltd", type: "Customer", city: "Lahore", creditUsed: 80, limit: 500000 },
        { id: "P-002", name: "Beta Transformers", type: "Customer", city: "Gujranwala", creditUsed: 20, limit: 1000000 },
        { id: "V-001", name: "Gamma Scrap Traders", type: "Vendor", city: "Sialkot", creditUsed: 0, limit: 0 },
        { id: "V-002", name: "Delta Copper Imports", type: "Vendor", city: "Karachi", creditUsed: 0, limit: 0 },
        { id: "P-003", name: "Echo Electronics", type: "Both", city: "Lahore", creditUsed: 45, limit: 200000 },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Party Master</h1>
                        <p className="text-slate-500">Manage customers, vendors, and service providers.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="shadow-sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter Type
                        </Button>
                        <Button onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700 shadow-soft">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Party
                        </Button>
                    </div>
                </div>

                <AddPartyModal open={isAddOpen} onOpenChange={setIsAddOpen} />

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {parties.map((party) => (
                        <Card key={party.id} className="shadow-soft border-slate-100 hover:shadow-medium transition-all cursor-pointer group">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <Building className="h-5 w-5" />
                                    </div>
                                    <Badge variant="outline" className="bg-white">
                                        {party.type}
                                    </Badge>
                                </div>
                                <CardTitle className="mt-3 text-base">{party.name}</CardTitle>
                                <CardDescription className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {party.city}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Phone className="h-4 w-4 text-slate-400" />
                                        <span>+92 300 1234567</span>
                                    </div>

                                    {party.type !== "Vendor" && (
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs text-slate-500">
                                                <span>Credit Limit</span>
                                                <span>{party.creditUsed}% Used</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${party.creditUsed > 75 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${party.creditUsed}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {party.type === "Vendor" && (
                                        <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
                                            <CreditCard className="h-4 w-4" />
                                            <span>Standard Terms: Net 30</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}

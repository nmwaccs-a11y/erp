import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TenantSelection() {
    const navigate = useNavigate();

    const tenants = [
        {
            id: "t1",
            name: "Alpha Wire Factory",
            role: "Super Admin",
            status: "Online",
            location: "Gujranwala, PK"
        },
        {
            id: "t2",
            name: "Beta Transformers",
            role: "Viewer",
            status: "Offline",
            location: "Lahore, PK"
        }
    ];

    const handleSelect = (tenantId: string) => {
        // Set tenant context here
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900">Select Workspace</h1>
                    <p className="text-slate-500">Pick the organization you want to access today.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {tenants.map((tenant) => (
                        <Card
                            key={tenant.id}
                            className="cursor-pointer hover:shadow-lg transition-all border-slate-200 group relative overflow-hidden"
                            onClick={() => handleSelect(tenant.id)}
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    {tenant.status === "Online" && (
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                                        </span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardTitle className="text-lg mb-1 group-hover:text-blue-700 transition-colors">{tenant.name}</CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                    {tenant.location}
                                </CardDescription>
                                <div className="mt-4 flex items-center justify-between">
                                    <Badge variant="secondary" className="bg-slate-100 text-slate-600">{tenant.role}</Badge>
                                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center">
                    <Button variant="link" className="text-slate-500 hover:text-slate-800">
                        Log in with a different account
                    </Button>
                </div>
            </div>
        </div>
    );
}

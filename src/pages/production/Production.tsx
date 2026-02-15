import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Production() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Production Floor</h1>
                    <p className="text-slate-500 mt-2">Select a production line to record output.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl">
                    <Link to="/production/enamel">
                        <Card className="hover:shadow-lg transition-all cursor-pointer h-full border-l-4 border-l-blue-500 group">
                            <CardHeader>
                                <div className="p-3 w-fit rounded-lg bg-blue-100 text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Zap className="h-8 w-8" />
                                </div>
                                <CardTitle className="text-2xl">Enamel Production</CardTitle>
                                <CardDescription>Record coating and enameling output.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-500">
                                    Record daily production from vertical and horizontal enameling machines. Track wire weight, gauge, and machine efficiency.
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link to="/production/drawing">
                        <Card className="hover:shadow-lg transition-all cursor-pointer h-full border-l-4 border-l-amber-500 group">
                            <CardHeader>
                                <div className="p-3 w-fit rounded-lg bg-amber-100 text-amber-600 mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                    <Factory className="h-8 w-8" />
                                </div>
                                <CardTitle className="text-2xl">Drawing Production</CardTitle>
                                <CardDescription>Record wire drawing and reduction output.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-500">
                                    Record output from Rod Breakdown (RBD), Medium, and Fine wire drawing machines. Track input/output gauges.
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
}

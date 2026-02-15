import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BarChart3, PieChart, TrendingUp, Download } from "lucide-react";

export default function Reports() {
    const reports = [
        {
            title: "Profit & Loss Statement",
            description: "Monthly financial performance overview",
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            title: "Balance Sheet",
            description: "Assets, liabilities, and equity summary",
            icon: FileText,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Production Yield Analysis",
            description: "Efficiency and wastage reports by machine",
            icon: BarChart3,
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        {
            title: "Inventory Valuation",
            description: "Current stock value based on WAC",
            icon: PieChart,
            color: "text-purple-600",
            bg: "bg-purple-50"
        }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reports & Analytics</h1>
                    <p className="text-slate-500">Generate and export system reports</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {reports.map((report, i) => (
                        <Card key={i} className="shadow-soft border-slate-100 hover:shadow-medium transition-shadow cursor-pointer">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${report.bg}`}>
                                    <report.icon className={`h-5 w-5 ${report.color}`} />
                                </div>
                                <div className="space-y-1">
                                    <CardTitle className="text-base">{report.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{report.description}</CardDescription>
                                <Button variant="outline" size="sm" className="mt-4 w-full">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download PDF
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}

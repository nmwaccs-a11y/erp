import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Droplets, Sparkles, BrainCircuit } from "lucide-react";

export default function MarketIntelligence() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Market Intelligence</h1>
                        <p className="text-slate-500">AI-driven market insights and commodity tracking.</p>
                    </div>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Powered by Google Gemini
                    </Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="shadow-soft border-slate-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">LME Copper</CardTitle>
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">$8,450.00</div>
                            <p className="text-xs text-emerald-600 flex items-center mt-1">
                                +1.2% today
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-soft border-slate-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">USD to PKR</CardTitle>
                            <DollarSign className="h-4 w-4 text-slate-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">₨ 278.50</div>
                            <p className="text-xs text-slate-500 mt-1">Stable</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-soft border-slate-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Crude Oil (WTI)</CardTitle>
                            <Droplets className="h-4 w-4 text-slate-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">$78.40</div>
                            <p className="text-xs text-rose-600 flex items-center mt-1">
                                <TrendingDown className="h-3 w-3 mr-1" /> -0.5% today
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="col-span-2 shadow-medium border-purple-100 bg-gradient-to-br from-white to-purple-50/30">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <BrainCircuit className="h-5 w-5 text-purple-600" />
                                <CardTitle className="text-purple-900">Gemini Market Analysis</CardTitle>
                            </div>
                            <CardDescription>Daily AI-generated summary based on global indicators.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-sm text-slate-700 max-w-none">
                                <p>
                                    <strong>Summary:</strong> Copper prices are showing bullish momentum driven by supply disruptions in South America and increased demand forecasts from the EV sector. The USD/PKR exchange rate remains relatively stable, providing a predictable window for imports.
                                </p>
                                <p className="mt-2">
                                    <strong>Recommendation:</strong> Consider locking in raw material procurement for the next quarter. The current dip in oil prices offers a slight reduction in logistics costs.
                                </p>
                                <div className="mt-4 flex items-center gap-2 p-3 bg-white/60 rounded-lg border border-purple-100">
                                    <span className="text-sm font-medium text-purple-800">Prediction Signal:</span>
                                    <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">BUY</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-soft border-slate-100">
                        <CardHeader>
                            <CardTitle>Historical Trends</CardTitle>
                            <CardDescription>7-Day Price Movement</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px] flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg border border-dashed text-sm">
                                [Chart Placeholder: LME Copper vs PKR]
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Users, Package } from "lucide-react";
import { useState } from "react";

import ProfitLossReport from "@/components/reports/ProfitLossReport";
import BalanceSheetReport from "@/components/reports/BalanceSheetReport";
import TrialBalanceReport from "@/components/reports/TrialBalanceReport";
import TrueExpenseReport from "@/components/reports/TrueExpenseReport";
import ParchiLedgerReport from "@/components/reports/ParchiLedgerReport";
import AgingReport from "@/components/reports/AgingReport";
import DailyProductionReport from "@/components/reports/DailyProductionReport";
import ScrapWastageReport from "@/components/reports/ScrapWastageReport";
import StockValuationReport from "@/components/reports/StockValuationReport";

const SECTIONS = [
    {
        id: "financials",
        label: "Core Financials",
        icon: TrendingUp,
        reports: [
            { id: "pl", label: "Profit & Loss", component: ProfitLossReport },
            { id: "bs", label: "Balance Sheet", component: BalanceSheetReport },
            { id: "tb", label: "Trial Balance", component: TrialBalanceReport },
        ],
    },
    {
        id: "unit-economics",
        label: "Unit Economics",
        icon: BarChart3,
        reports: [
            { id: "te", label: "True Expense (Per KG)", component: TrueExpenseReport },
        ],
    },
    {
        id: "party-liquidity",
        label: "Party & Liquidity",
        icon: Users,
        reports: [
            { id: "parchi", label: "Parchi Ledger", component: ParchiLedgerReport },
            { id: "aging", label: "Customer & Supplier Aging", component: AgingReport },
        ],
    },
    {
        id: "inventory-production",
        label: "Inventory & Production",
        icon: Package,
        reports: [
            { id: "daily-prod", label: "Daily Production", component: DailyProductionReport },
            { id: "scrap", label: "Scrap Wastage", component: ScrapWastageReport },
            { id: "stock-val", label: "Stock Valuation", component: StockValuationReport },
        ],
    },
];

export default function Reports() {
    const [activeSection, setActiveSection] = useState("financials");
    const [activeReport, setActiveReport] = useState("pl");

    const currentSection = SECTIONS.find(s => s.id === activeSection)!;
    const currentReport = currentSection.reports.find(r => r.id === activeReport);
    const ReportComponent = currentReport?.component;

    const handleSectionChange = (sectionId: string) => {
        setActiveSection(sectionId);
        const firstReport = SECTIONS.find(s => s.id === sectionId)?.reports[0];
        if (firstReport) setActiveReport(firstReport.id);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-7xl mx-auto print:space-y-0 print:max-w-none">
                <div className="print:hidden">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Reports & Analytics
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Generate, view, and print financial, production, and party reports.
                    </p>
                </div>

                {/* Section Tabs */}
                <div className="print:hidden">
                    <Tabs value={activeSection} onValueChange={handleSectionChange}>
                        <TabsList className="bg-slate-100 p-1 h-auto flex-wrap">
                            {SECTIONS.map(s => (
                                <TabsTrigger
                                    key={s.id}
                                    value={s.id}
                                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2"
                                >
                                    <s.icon className="h-4 w-4" />
                                    {s.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {/* Report Sub-Tabs */}
                <div className="print:hidden">
                    <div className="flex gap-2 border-b border-slate-200 pb-2">
                        {currentSection.reports.map(r => (
                            <button
                                key={r.id}
                                onClick={() => setActiveReport(r.id)}
                                className={`px-3 py-1.5 rounded-t-md text-sm font-medium transition-colors ${
                                    activeReport === r.id
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                                }`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Active Report */}
                <div className="print:mt-0">
                    {ReportComponent && <ReportComponent />}
                </div>
            </div>
        </DashboardLayout>
    );
}

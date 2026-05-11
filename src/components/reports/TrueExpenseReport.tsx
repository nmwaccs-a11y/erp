import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer, Zap, TrendingUp, Package } from "lucide-react";
import { ReportPrintHeader } from "./ReportPrintHeader";

// --- MOCK UNIT ECONOMICS DATA ---
const UE_DATA = {
    production: { totalKg: 52400 },
    factoryOverhead: [
        { code: "51003", name: "Factory Furnace & Enamel Utilities (Gas/Electricity)", amount: 320000 },
        { code: "51004", name: "Direct Factory Wages - Operators", amount: 280000 },
        { code: "52003", name: "Machine Maintenance & Spares", amount: 48000 },
    ],
    adminOverhead: [
        { code: "52001", name: "Office / Gatekeeper Salaries", amount: 95000 },
        { code: "52002", name: "Logistics, Freight & Unloading Labor", amount: 72000 },
    ],
    totalSoldKg: 49800,
};

export default function TrueExpenseReport() {
    const today = new Date().toISOString().split("T")[0];
    const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0];
    const [dateFrom, setDateFrom] = useState(firstOfMonth);
    const [dateTo, setDateTo] = useState(today);
    const [show, setShow] = useState(false);

    const totalFactoryOverhead = UE_DATA.factoryOverhead.reduce((s, e) => s + e.amount, 0);
    const totalAdminOverhead = UE_DATA.adminOverhead.reduce((s, e) => s + e.amount, 0);
    const prodCostPerKg = totalFactoryOverhead / UE_DATA.production.totalKg;
    const salesCostPerKg = totalAdminOverhead / UE_DATA.totalSoldKg;
    const baseCostPerKg = prodCostPerKg + salesCostPerKg;

    return (
        <div className="space-y-4">
            <div className="flex items-end gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 print:hidden">
                <div className="space-y-1">
                    <Label className="text-xs">From</Label>
                    <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-8 text-sm w-36" />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">To</Label>
                    <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-8 text-sm w-36" />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 h-8 text-sm" onClick={() => setShow(true)}>Generate Report</Button>
                {show && <Button variant="outline" className="h-8 text-sm" onClick={() => window.print()}><Printer className="h-3.5 w-3.5 mr-1.5" />Print</Button>}
            </div>

            {show && (
                <div className="bg-white border rounded-lg shadow-sm p-8 max-w-[210mm] mx-auto print:border-none print:shadow-none print:p-4">
                    <ReportPrintHeader reportTitle="True Expense Report" subtitle="Unit Economics — Cost Per KG Analysis" dateFrom={dateFrom} dateTo={dateTo} hierarchyLabel="Sub Accounts (Leaf)" />

                    {/* KPI Cards */}
                    <div className="grid grid-cols-3 gap-4 mb-8 print:grid-cols-3">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center print:border-slate-400">
                            <Package className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                            <p className="text-xs text-blue-800 font-semibold uppercase">Production Volume</p>
                            <p className="text-2xl font-bold text-slate-900">{UE_DATA.production.totalKg.toLocaleString()} kg</p>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center print:border-slate-400">
                            <Zap className="h-6 w-6 text-amber-600 mx-auto mb-1" />
                            <p className="text-xs text-amber-800 font-semibold uppercase">Production Cost/KG</p>
                            <p className="text-2xl font-bold text-slate-900">₨ {prodCostPerKg.toFixed(2)}</p>
                        </div>
                        <div className="bg-slate-100 border border-slate-300 rounded-lg p-4 text-center">
                            <TrendingUp className="h-6 w-6 text-slate-600 mx-auto mb-1" />
                            <p className="text-xs text-slate-700 font-semibold uppercase">Sales Cost/KG</p>
                            <p className="text-2xl font-bold text-slate-900">₨ {salesCostPerKg.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Break-Even Banner */}
                    <div className="bg-rose-700 text-white rounded-lg p-4 mb-8 text-center print:border-2 print:border-slate-800 print:bg-transparent print:text-slate-900">
                        <p className="text-xs uppercase tracking-widest font-semibold opacity-80 print:text-slate-600">⚡ Break-Even Watta Rate (Minimum Charge)</p>
                        <p className="text-4xl font-bold mt-1">₨ {baseCostPerKg.toFixed(2)} / KG</p>
                        <p className="text-xs mt-1 opacity-70 print:text-slate-500">Any Watta rate below this is operating at a LOSS</p>
                    </div>

                    {/* Detail Tables */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider border-b-2 border-amber-700 pb-0.5 mb-2 text-slate-700">Factory Overhead (51003, 51004, 52003)</h4>
                            <table className="w-full text-[11px]">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-300">
                                        <th className="py-1 px-2 text-left font-bold text-slate-700">Account</th>
                                        <th className="py-1 px-2 text-right font-bold text-slate-700">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {UE_DATA.factoryOverhead.map(e => (
                                        <tr key={e.code} className="border-b border-slate-100">
                                            <td className="py-1 px-2 text-slate-600">[{e.code}] {e.name}</td>
                                            <td className="py-1 px-2 text-right font-medium">₨ {e.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-amber-50 font-bold border-t-2 border-slate-300 print:bg-transparent">
                                        <td className="py-1.5 px-2">Total Factory Overhead</td>
                                        <td className="py-1.5 px-2 text-right">₨ {totalFactoryOverhead.toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 px-2 text-slate-500">÷ {UE_DATA.production.totalKg.toLocaleString()} KG Produced</td>
                                        <td className="py-1 px-2 text-right font-bold text-amber-700">= ₨ {prodCostPerKg.toFixed(2)}/kg</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider border-b-2 border-slate-700 pb-0.5 mb-2 text-slate-700">Admin & Sales Overhead (52001, 52002)</h4>
                            <table className="w-full text-[11px]">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-300">
                                        <th className="py-1 px-2 text-left font-bold text-slate-700">Account</th>
                                        <th className="py-1 px-2 text-right font-bold text-slate-700">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {UE_DATA.adminOverhead.map(e => (
                                        <tr key={e.code} className="border-b border-slate-100">
                                            <td className="py-1 px-2 text-slate-600">[{e.code}] {e.name}</td>
                                            <td className="py-1 px-2 text-right font-medium">₨ {e.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 print:bg-transparent">
                                        <td className="py-1.5 px-2">Total Admin Overhead</td>
                                        <td className="py-1.5 px-2 text-right">₨ {totalAdminOverhead.toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 px-2 text-slate-500">÷ {UE_DATA.totalSoldKg.toLocaleString()} KG Sold</td>
                                        <td className="py-1 px-2 text-right font-bold text-slate-700">= ₨ {salesCostPerKg.toFixed(2)}/kg</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

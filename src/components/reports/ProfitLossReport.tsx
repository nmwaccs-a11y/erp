import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer } from "lucide-react";
import { ReportPrintHeader } from "./ReportPrintHeader";

// --- MOCK P&L DATA ---
const PL_DATA = {
    revenue: [
        { code: "41001", name: "Direct Wire Sales", amount: 8500000 },
        { code: "41002", name: "Premium / Watta Income", amount: 450000 },
        { code: "41003", name: "Scrap Sales", amount: 120000 },
    ],
    openingInventory: 1200000,
    purchases: [
        { code: "51001", name: "Raw Material Consumed (Scrap/Cathode)", amount: 5200000 },
        { code: "51002", name: "Vendor Processing / Triangle Mazdoori", amount: 380000 },
    ],
    closingInventory: 980000,
    expenses: [
        { code: "51003", name: "Factory Furnace & Enamel Utilities (Gas/Electricity)", amount: 320000 },
        { code: "51004", name: "Direct Factory Wages - Operators", amount: 280000 },
        { code: "52001", name: "Office / Gatekeeper Salaries", amount: 95000 },
        { code: "52002", name: "Logistics, Freight & Unloading Labor", amount: 72000 },
        { code: "52003", name: "Machine Maintenance & Spares", amount: 48000 },
    ],
};

const fmt = (n: number) => `₨ ${n.toLocaleString()}`;

function PLRow({ label, amount, bold, indent, highlight }: { label: string; amount: number | null; bold?: boolean; indent?: number; highlight?: "positive" | "negative" | "neutral" }) {
    const colorClass = highlight === "positive" ? "text-emerald-700 bg-emerald-50 print:bg-transparent" : highlight === "negative" ? "text-rose-700 bg-rose-50 print:bg-transparent" : "text-slate-900";
    return (
        <tr className={`border-b border-slate-100 print:border-slate-300 ${highlight ? colorClass : ""}`}>
            <td className={`py-1.5 text-[12px] ${bold ? "font-bold" : ""}`} style={{ paddingLeft: indent ? `${indent * 16 + 8}px` : "8px" }}>
                {label}
            </td>
            <td className={`py-1.5 text-right text-[12px] pr-3 ${bold ? "font-bold" : ""} ${highlight === "positive" ? "text-emerald-700" : highlight === "negative" ? "text-rose-700" : ""}`}>
                {amount !== null ? fmt(amount) : ""}
            </td>
        </tr>
    );
}

function PLSectionHeader({ label }: { label: string }) {
    return (
        <tr className="bg-slate-100 print:bg-slate-200">
            <td colSpan={2} className="py-1.5 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-600 border-t-2 border-slate-300">
                {label}
            </td>
        </tr>
    );
}

export default function ProfitLossReport() {
    const today = new Date().toISOString().split("T")[0];
    const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0];
    const [dateFrom, setDateFrom] = useState(firstOfMonth);
    const [dateTo, setDateTo] = useState(today);
    const [show, setShow] = useState(false);

    const totalRevenue = PL_DATA.revenue.reduce((s, r) => s + r.amount, 0);
    const totalPurchases = PL_DATA.purchases.reduce((s, p) => s + p.amount, 0);
    const cogs = PL_DATA.openingInventory + totalPurchases - PL_DATA.closingInventory;
    const grossProfit = totalRevenue - cogs;
    const totalExpenses = PL_DATA.expenses.reduce((s, e) => s + e.amount, 0);
    const netProfit = grossProfit - totalExpenses;

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
                <Button className="bg-blue-600 hover:bg-blue-700 h-8 text-sm" onClick={() => setShow(true)}>Generate P&L</Button>
                {show && (
                    <Button variant="outline" className="h-8 text-sm" onClick={() => window.print()}>
                        <Printer className="h-3.5 w-3.5 mr-1.5" /> Print
                    </Button>
                )}
            </div>

            {show && (
                <div className="bg-white border rounded-lg shadow-sm p-8 max-w-[210mm] mx-auto print:border-none print:shadow-none print:p-4 print:m-0 print:max-w-none">
                    <ReportPrintHeader
                        reportTitle="Profit & Loss Statement"
                        subtitle="Income Statement — Factory Operations"
                        dateFrom={dateFrom}
                        dateTo={dateTo}
                        hierarchyLabel="Master Account (Groups)"
                    />

                    <table className="w-full border-collapse">
                        <tbody>
                            <PLSectionHeader label="1. Revenue / Sales" />
                            {PL_DATA.revenue.map(r => <PLRow key={r.code} label={`[${r.code}] ${r.name}`} amount={r.amount} indent={1} />)}
                            <PLRow label="Total Revenue" amount={totalRevenue} bold />

                            <PLSectionHeader label="2. Cost of Goods Sold (COGS)" />
                            <PLRow label="Opening Inventory Value" amount={PL_DATA.openingInventory} indent={1} />
                            {PL_DATA.purchases.map(p => <PLRow key={p.code} label={`[${p.code}] ${p.name}`} amount={p.amount} indent={1} />)}
                            <PLRow label="Less: Closing Inventory Value" amount={-PL_DATA.closingInventory} indent={1} />
                            <PLRow label="Total COGS" amount={cogs} bold />

                            <PLRow label="GROSS PROFIT" amount={grossProfit} bold highlight={grossProfit >= 0 ? "positive" : "negative"} />

                            <PLSectionHeader label="3. Operating & Factory Expenses" />
                            {PL_DATA.expenses.map(e => <PLRow key={e.code} label={`[${e.code}] ${e.name}`} amount={e.amount} indent={1} />)}
                            <PLRow label="Total Expenses" amount={totalExpenses} bold />

                            <PLSectionHeader label="4. Bottom Line" />
                            <PLRow label="NET PROFIT / (LOSS)" amount={netProfit} bold highlight={netProfit >= 0 ? "positive" : "negative"} />
                        </tbody>
                    </table>

                    <div className="mt-8 grid grid-cols-3 gap-8 pt-8 border-t border-slate-300">
                        {["Prepared By", "Reviewed By", "Approved By"].map(s => (
                            <div key={s} className="text-center">
                                <div className="border-b border-slate-400 mx-8 mb-2 mt-8" />
                                <p className="text-xs font-semibold text-slate-600 uppercase">{s}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

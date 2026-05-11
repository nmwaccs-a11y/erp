import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer, CheckCircle, XCircle } from "lucide-react";
import { ReportPrintHeader } from "./ReportPrintHeader";

// --- MOCK BALANCE SHEET DATA ---
const BS_DATA = {
    assets: {
        cashBank: [
            { code: "11101", name: "Main Factory Cash Drawer", amount: 125000 },
            { code: "11102", name: "Meezan Bank", amount: 1340000 },
            { code: "11103", name: "HBL", amount: 480000 },
        ],
        receivables: [
            { code: "11201", name: "Accounts Receivable - Customers (A/R Anchor)", amount: 2100000 },
            { code: "11202", name: "Parchi Receivables", amount: 300000 },
            { code: "11203", name: "Advance Cash Given to Vendors", amount: 150000 },
        ],
        inventory: [
            { code: "12101", name: "Raw Material Value - Scrap/Cathode", amount: 580000 },
            { code: "12102", name: "WIP Value - Wire No 8/Rod", amount: 230000 },
            { code: "12103", name: "Finished Goods Value - Enameled Wire", amount: 170000 },
        ],
    },
    liabilities: [
        { code: "21101", name: "Accounts Payable - Vendors (A/P Anchor)", amount: 1450000 },
        { code: "21102", name: "Vendor Mazdoori Payable", amount: 120000 },
        { code: "21103", name: "Parchi Payables", amount: 400000 },
        { code: "21104", name: "Advance Cash Received from Customers", amount: 180000 },
    ],
    equity: [
        { code: "31001", name: "Owner's Capital Investment", amount: 3000000 },
        { code: "31002", name: "Owner Drawings", amount: -420000 },
        { code: "32001", name: "Accumulated Factory Profits (Prior)", amount: 455000 },
    ],
    netProfitCurrentPeriod: 380000, // carried from P&L
};

const fmt = (n: number) => `₨ ${Math.abs(n).toLocaleString()}`;

function BSSection({ title, items, total, color = "blue" }: { title: string; items: { code: string; name: string; amount: number }[]; total: number; color?: string }) {
    const borderColor = color === "blue" ? "border-blue-800" : color === "rose" ? "border-rose-800" : "border-emerald-800";
    const bgColor = color === "blue" ? "bg-blue-50" : color === "rose" ? "bg-rose-50" : "bg-emerald-50";
    return (
        <div className="mb-4">
            <h4 className={`text-xs font-bold uppercase tracking-wider border-b-2 ${borderColor} pb-0.5 mb-2 text-slate-700 print:text-slate-900`}>{title}</h4>
            <table className="w-full text-[11px]">
                <tbody>
                    {items.map(item => (
                        <tr key={item.code} className="border-b border-slate-100">
                            <td className="py-1 pl-3 text-slate-600">[{item.code}] {item.name}</td>
                            <td className={`py-1 text-right pr-2 font-medium ${item.amount < 0 ? "text-rose-600" : "text-slate-800"}`}>
                                {item.amount < 0 ? `(${fmt(item.amount)})` : fmt(item.amount)}
                            </td>
                        </tr>
                    ))}
                    <tr className={`${bgColor} print:bg-transparent font-bold border-t-2 border-slate-300`}>
                        <td className="py-1.5 pl-3 text-slate-800">Total {title}</td>
                        <td className="py-1.5 text-right pr-2 text-slate-900">{fmt(total)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default function BalanceSheetReport() {
    const today = new Date().toISOString().split("T")[0];
    const [asOfDate, setAsOfDate] = useState(today);
    const [show, setShow] = useState(false);

    const cashBankTotal = BS_DATA.assets.cashBank.reduce((s, i) => s + i.amount, 0);
    const receivablesTotal = BS_DATA.assets.receivables.reduce((s, i) => s + i.amount, 0);
    const inventoryTotal = BS_DATA.assets.inventory.reduce((s, i) => s + i.amount, 0);
    const totalAssets = cashBankTotal + receivablesTotal + inventoryTotal;

    const totalLiabilities = BS_DATA.liabilities.reduce((s, i) => s + i.amount, 0);
    const totalEquity = BS_DATA.equity.reduce((s, i) => s + i.amount, 0) + BS_DATA.netProfitCurrentPeriod;
    const totalLiabEquity = totalLiabilities + totalEquity;

    const balanced = totalAssets === totalLiabEquity;

    return (
        <div className="space-y-4">
            <div className="flex items-end gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 print:hidden">
                <div className="space-y-1">
                    <Label className="text-xs">As of Date</Label>
                    <Input type="date" value={asOfDate} onChange={e => setAsOfDate(e.target.value)} className="h-8 text-sm w-36" />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 h-8 text-sm" onClick={() => setShow(true)}>Generate Balance Sheet</Button>
                {show && (
                    <Button variant="outline" className="h-8 text-sm" onClick={() => window.print()}>
                        <Printer className="h-3.5 w-3.5 mr-1.5" /> Print
                    </Button>
                )}
            </div>

            {show && (
                <div className="bg-white border rounded-lg shadow-sm p-8 max-w-[210mm] mx-auto print:border-none print:shadow-none print:p-4 print:m-0 print:max-w-none">
                    <ReportPrintHeader
                        reportTitle="Balance Sheet"
                        subtitle={`As of Date: ${asOfDate}`}
                        hierarchyLabel="Master Account (Groups)"
                    />

                    {/* Balance check banner */}
                    <div className={`flex items-center gap-2 text-sm font-semibold mb-4 px-3 py-1.5 rounded-md print:hidden ${balanced ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
                        {balanced ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        {balanced ? "Balance Sheet is balanced. Assets = Liabilities + Equity ✓" : "⚠ IMBALANCE DETECTED — Check data."}
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        {/* LEFT — ASSETS */}
                        <div className="border-r border-slate-200 pr-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 border-b-2 border-slate-800 pb-1">Assets (10000)</h3>
                            <BSSection title="Cash & Bank (11100)" items={BS_DATA.assets.cashBank} total={cashBankTotal} color="blue" />
                            <BSSection title="Trade Receivables (11200)" items={BS_DATA.assets.receivables} total={receivablesTotal} color="blue" />
                            <BSSection title="Inventory Assets (12000)" items={BS_DATA.assets.inventory} total={inventoryTotal} color="blue" />
                            <div className="mt-3 pt-2 border-t-2 border-slate-800 flex justify-between font-bold text-sm">
                                <span>TOTAL ASSETS</span>
                                <span className="text-blue-800">{fmt(totalAssets)}</span>
                            </div>
                        </div>

                        {/* RIGHT — LIABILITIES + EQUITY */}
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 border-b-2 border-slate-800 pb-1">Liabilities & Equity</h3>
                            <BSSection title="Trade Payables (21100)" items={BS_DATA.liabilities} total={totalLiabilities} color="rose" />
                            <BSSection title="Capital & Equity (30000)" items={[
                                ...BS_DATA.equity,
                                { code: "32002", name: "Net Profit — Current Period", amount: BS_DATA.netProfitCurrentPeriod }
                            ]} total={totalEquity} color="emerald" />
                            <div className="mt-3 pt-2 border-t-2 border-slate-800 flex justify-between font-bold text-sm">
                                <span>TOTAL LIAB. + EQUITY</span>
                                <span className={balanced ? "text-emerald-700" : "text-rose-700"}>{fmt(totalLiabEquity)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-3 gap-8 pt-6 border-t border-slate-300">
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

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer, CheckCircle, XCircle } from "lucide-react";
import { ReportPrintHeader } from "./ReportPrintHeader";

const TRIAL_ACCOUNTS = [
    { code: "11101", name: "Main Factory Cash Drawer", debit: 125000, credit: 0 },
    { code: "11102", name: "Meezan Bank", debit: 1340000, credit: 0 },
    { code: "11103", name: "HBL", debit: 480000, credit: 0 },
    { code: "11201", name: "A/R - Customers (Anchor)", debit: 2100000, credit: 0 },
    { code: "11202", name: "Parchi Receivables", debit: 300000, credit: 0 },
    { code: "11203", name: "Advance Cash Given to Vendors", debit: 150000, credit: 0 },
    { code: "12101", name: "Raw Material Value - Scrap/Cathode", debit: 580000, credit: 0 },
    { code: "12102", name: "WIP Value - Wire No 8/Rod", debit: 230000, credit: 0 },
    { code: "12103", name: "Finished Goods Value - Enameled Wire", debit: 170000, credit: 0 },
    { code: "21101", name: "A/P - Vendors (Anchor)", debit: 0, credit: 1450000 },
    { code: "21102", name: "Vendor Mazdoori Payable", debit: 0, credit: 120000 },
    { code: "21103", name: "Parchi Payables", debit: 0, credit: 400000 },
    { code: "21104", name: "Advance Received from Customers", debit: 0, credit: 180000 },
    { code: "31001", name: "Owner's Capital Investment", debit: 0, credit: 3000000 },
    { code: "31002", name: "Owner Drawings", debit: 420000, credit: 0 },
    { code: "32001", name: "Accumulated Factory Profits", debit: 0, credit: 455000 },
    { code: "41001", name: "Direct Wire Sales", debit: 0, credit: 8500000 },
    { code: "41002", name: "Premium / Watta Income", debit: 0, credit: 450000 },
    { code: "41003", name: "Scrap Sales", debit: 0, credit: 120000 },
    { code: "51001", name: "Raw Material Consumed", debit: 5200000, credit: 0 },
    { code: "51002", name: "Vendor Processing / Triangle Mazdoori", debit: 380000, credit: 0 },
    { code: "51003", name: "Factory Furnace & Enamel Utilities", debit: 320000, credit: 0 },
    { code: "51004", name: "Direct Factory Wages - Operators", debit: 280000, credit: 0 },
    { code: "52001", name: "Office / Gatekeeper Salaries", debit: 95000, credit: 0 },
    { code: "52002", name: "Logistics, Freight & Unloading Labor", debit: 72000, credit: 0 },
    { code: "52003", name: "Machine Maintenance & Spares", debit: 48000, credit: 0 },
    { code: "52099", name: "Retained Earnings Adjustment", debit: 0, credit: 415000 },
];

const fmt = (n: number) => n > 0 ? n.toLocaleString() : "-";

export default function TrialBalanceReport() {
    const today = new Date().toISOString().split("T")[0];
    const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0];
    const [dateFrom, setDateFrom] = useState(firstOfMonth);
    const [dateTo, setDateTo] = useState(today);
    const [show, setShow] = useState(false);

    const totalDebits = TRIAL_ACCOUNTS.reduce((s, a) => s + a.debit, 0);
    const totalCredits = TRIAL_ACCOUNTS.reduce((s, a) => s + a.credit, 0);
    const balanced = totalDebits === totalCredits;

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
                <Button className="bg-blue-600 hover:bg-blue-700 h-8 text-sm" onClick={() => setShow(true)}>Generate Trial Balance</Button>
                {show && <Button variant="outline" className="h-8 text-sm" onClick={() => window.print()}><Printer className="h-3.5 w-3.5 mr-1.5" />Print</Button>}
            </div>

            {show && (
                <div className="bg-white border rounded-lg shadow-sm p-8 max-w-[210mm] mx-auto print:border-none print:shadow-none print:p-4">
                    <ReportPrintHeader reportTitle="Trial Balance" dateFrom={dateFrom} dateTo={dateTo} hierarchyLabel="Sub Accounts (Leaf)" />

                    <div className={`flex items-center gap-2 mb-4 px-3 py-1.5 rounded-md text-sm font-semibold print:hidden ${balanced ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
                        {balanced ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        {balanced ? "Trial Balance checks out. Total Debits = Total Credits ✓" : "⚠ IMBALANCE — Totals do not match. Review entries."}
                    </div>

                    <table className="w-full border-collapse text-[11px]">
                        <thead>
                            <tr className="bg-slate-100 border-b-2 border-slate-800">
                                <th className="py-2 px-2 text-left font-bold text-slate-800">Code</th>
                                <th className="py-2 px-2 text-left font-bold text-slate-800">Account Name</th>
                                <th className="py-2 px-2 text-right font-bold text-slate-800 w-32">Debit (₨)</th>
                                <th className="py-2 px-2 text-right font-bold text-slate-800 w-32">Credit (₨)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TRIAL_ACCOUNTS.map((acc, i) => (
                                <tr key={acc.code} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                                    <td className="py-1 px-2 font-mono text-slate-500">{acc.code}</td>
                                    <td className="py-1 px-2 text-slate-700">{acc.name}</td>
                                    <td className="py-1 px-2 text-right text-slate-800 font-medium">{fmt(acc.debit)}</td>
                                    <td className="py-1 px-2 text-right text-slate-800 font-medium">{fmt(acc.credit)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className={`border-t-2 border-slate-800 font-bold text-sm ${balanced ? "bg-emerald-50 print:bg-transparent" : "bg-rose-50 print:bg-transparent"}`}>
                                <td colSpan={2} className="py-2 px-2 uppercase tracking-wider">TOTALS</td>
                                <td className="py-2 px-2 text-right text-slate-900 underline decoration-double">₨ {totalDebits.toLocaleString()}</td>
                                <td className={`py-2 px-2 text-right underline decoration-double ${balanced ? "text-emerald-700" : "text-rose-700"}`}>₨ {totalCredits.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
}

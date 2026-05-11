import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { ReportPrintHeader } from "./ReportPrintHeader";
import { differenceInDays, parseISO } from "date-fns";

const AGING_DATA = [
    { party: "Alpha Cables (Customer)", invoices: [
        { ref: "SI-26-001", date: "2026-04-28", amount: 120000 },
        { ref: "SI-26-004", date: "2026-03-15", amount: 80000 },
        { ref: "SI-26-007", date: "2026-02-10", amount: 55000 },
    ]},
    { party: "Gateway Motors (Customer)", invoices: [
        { ref: "SI-26-003", date: "2026-05-01", amount: 200000 },
        { ref: "SI-26-005", date: "2026-03-28", amount: 95000 },
    ]},
    { party: "Gamma Scrap (Vendor)", invoices: [
        { ref: "PI-26-002", date: "2026-04-01", amount: 150000 },
        { ref: "PI-26-005", date: "2026-01-20", amount: 300000 },
    ]},
];

function bucketAmount(invoices: { date: string; amount: number }[], today: Date) {
    const buckets = { b30: 0, b60: 0, b90: 0, b90plus: 0, total: 0 };
    invoices.forEach(inv => {
        const age = differenceInDays(today, parseISO(inv.date));
        buckets.total += inv.amount;
        if (age <= 30) buckets.b30 += inv.amount;
        else if (age <= 60) buckets.b60 += inv.amount;
        else if (age <= 90) buckets.b90 += inv.amount;
        else buckets.b90plus += inv.amount;
    });
    return buckets;
}

const fmt = (n: number) => n > 0 ? `₨ ${n.toLocaleString()}` : "-";

export default function AgingReport() {
    const [show, setShow] = useState(false);
    const today = new Date();

    const rows = AGING_DATA.map(p => ({ party: p.party, ...bucketAmount(p.invoices, today) }));
    const totals = rows.reduce((acc, r) => ({
        b30: acc.b30 + r.b30, b60: acc.b60 + r.b60, b90: acc.b90 + r.b90, b90plus: acc.b90plus + r.b90plus, total: acc.total + r.total
    }), { b30: 0, b60: 0, b90: 0, b90plus: 0, total: 0 });

    return (
        <div className="space-y-4">
            <div className="flex items-end gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 print:hidden">
                <Button className="bg-blue-600 hover:bg-blue-700 h-8 text-sm" onClick={() => setShow(true)}>Generate Aging Report</Button>
                {show && <Button variant="outline" className="h-8 text-sm" onClick={() => window.print()}><Printer className="h-3.5 w-3.5 mr-1.5" />Print</Button>}
            </div>

            {show && (
                <div className="bg-white border rounded-lg shadow-sm p-8 max-w-[210mm] mx-auto print:border-none print:shadow-none print:p-4">
                    <ReportPrintHeader reportTitle="Aging Report" subtitle="Customer & Supplier Outstanding Debt Analysis" hierarchyLabel="Sub Accounts (Leaf)" />

                    <div className="flex gap-4 mb-6 print:hidden">
                        {[
                            { label: "0-30 Days", val: totals.b30, color: "emerald" },
                            { label: "31-60 Days", val: totals.b60, color: "yellow" },
                            { label: "61-90 Days", val: totals.b90, color: "amber" },
                            { label: "90+ Days", val: totals.b90plus, color: "rose" },
                        ].map(b => (
                            <div key={b.label} className={`flex-1 rounded-lg p-3 border text-center bg-${b.color}-50 border-${b.color}-200`}>
                                <p className={`text-xs font-semibold text-${b.color}-700 uppercase`}>{b.label}</p>
                                <p className="text-lg font-bold text-slate-900 mt-0.5">₨ {b.val.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

                    <table className="w-full border-collapse text-[11px]">
                        <thead>
                            <tr className="bg-slate-100 border-b-2 border-slate-800">
                                <th className="py-2 px-2 text-left font-bold text-slate-800">Party / Account</th>
                                <th className="py-2 px-2 text-right font-bold text-slate-800 w-28">0–30 Days</th>
                                <th className="py-2 px-2 text-right font-bold text-slate-800 w-28">31–60 Days</th>
                                <th className="py-2 px-2 text-right font-bold text-amber-700 w-28">61–90 Days</th>
                                <th className="py-2 px-2 text-right font-bold text-rose-700 w-28">90+ Days</th>
                                <th className="py-2 px-2 text-right font-bold text-slate-900 w-32">Total Outstanding</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r, i) => (
                                <tr key={r.party} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                                    <td className="py-1.5 px-2 font-semibold text-slate-800">{r.party}</td>
                                    <td className="py-1.5 px-2 text-right text-emerald-700 font-medium">{fmt(r.b30)}</td>
                                    <td className="py-1.5 px-2 text-right text-yellow-700 font-medium">{fmt(r.b60)}</td>
                                    <td className={`py-1.5 px-2 text-right font-medium ${r.b90 > 0 ? "text-amber-700 bg-amber-50/50 print:bg-transparent" : ""}`}>{fmt(r.b90)}</td>
                                    <td className={`py-1.5 px-2 text-right font-bold ${r.b90plus > 0 ? "text-rose-700 bg-rose-50/60 print:bg-transparent" : ""}`}>{fmt(r.b90plus)}</td>
                                    <td className="py-1.5 px-2 text-right font-bold text-slate-900">₨ {r.total.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-slate-100 border-t-2 border-slate-800 font-bold text-sm print:bg-transparent">
                                <td className="py-2 px-2 uppercase tracking-wider">TOTALS</td>
                                <td className="py-2 px-2 text-right text-emerald-700">₨ {totals.b30.toLocaleString()}</td>
                                <td className="py-2 px-2 text-right text-yellow-700">₨ {totals.b60.toLocaleString()}</td>
                                <td className="py-2 px-2 text-right text-amber-700">₨ {totals.b90.toLocaleString()}</td>
                                <td className="py-2 px-2 text-right text-rose-700">₨ {totals.b90plus.toLocaleString()}</td>
                                <td className="py-2 px-2 text-right text-slate-900 underline decoration-double">₨ {totals.total.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
}

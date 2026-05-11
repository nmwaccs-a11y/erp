import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer } from "lucide-react";
import { ReportPrintHeader } from "./ReportPrintHeader";

const PROD_DATA = [
    { date: "2026-05-07", machine: "Drawing Machine #1", consumed: 1200, produced: 1140, scrap: 60 },
    { date: "2026-05-07", machine: "Enamel Line #1", consumed: 800, produced: 765, scrap: 35 },
    { date: "2026-05-07", machine: "Drawing Machine #2", consumed: 950, produced: 903, scrap: 47 },
    { date: "2026-05-06", machine: "Drawing Machine #1", consumed: 1100, produced: 1045, scrap: 55 },
    { date: "2026-05-06", machine: "Enamel Line #1", consumed: 750, produced: 714, scrap: 36 },
];

export default function DailyProductionReport() {
    const today = new Date().toISOString().split("T")[0];
    const [dateFrom, setDateFrom] = useState(today);
    const [dateTo, setDateTo] = useState(today);
    const [show, setShow] = useState(false);

    const totals = PROD_DATA.reduce((acc, r) => ({
        consumed: acc.consumed + r.consumed,
        produced: acc.produced + r.produced,
        scrap: acc.scrap + r.scrap,
    }), { consumed: 0, produced: 0, scrap: 0 });

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
                    <ReportPrintHeader reportTitle="Daily Production Report" dateFrom={dateFrom} dateTo={dateTo} hierarchyLabel="Sub Accounts (Leaf)" />
                    <table className="w-full border-collapse text-[11px]">
                        <thead>
                            <tr className="bg-slate-100 border-b-2 border-slate-800">
                                <th className="py-2 px-2 text-left font-bold text-slate-800">Date</th>
                                <th className="py-2 px-2 text-left font-bold text-slate-800">Machine</th>
                                <th className="py-2 px-2 text-right font-bold text-blue-800">Raw Consumed (KG)</th>
                                <th className="py-2 px-2 text-right font-bold text-emerald-700">Finished Goods (KG)</th>
                                <th className="py-2 px-2 text-right font-bold text-amber-700">Scrap Generated (KG)</th>
                                <th className="py-2 px-2 text-right font-bold text-slate-700">Yield %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {PROD_DATA.map((r, i) => (
                                <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                                    <td className="py-1.5 px-2 font-medium text-slate-700">{r.date}</td>
                                    <td className="py-1.5 px-2 text-slate-600">{r.machine}</td>
                                    <td className="py-1.5 px-2 text-right font-medium text-blue-800">{r.consumed.toLocaleString()} kg</td>
                                    <td className="py-1.5 px-2 text-right font-medium text-emerald-700">{r.produced.toLocaleString()} kg</td>
                                    <td className="py-1.5 px-2 text-right font-medium text-amber-700">{r.scrap.toLocaleString()} kg</td>
                                    <td className="py-1.5 px-2 text-right font-semibold text-slate-700">{((r.produced / r.consumed) * 100).toFixed(1)}%</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-slate-100 border-t-2 border-slate-800 font-bold print:bg-transparent">
                                <td colSpan={2} className="py-2 px-2 uppercase tracking-wider">TOTALS</td>
                                <td className="py-2 px-2 text-right text-blue-900">{totals.consumed.toLocaleString()} kg</td>
                                <td className="py-2 px-2 text-right text-emerald-700">{totals.produced.toLocaleString()} kg</td>
                                <td className="py-2 px-2 text-right text-amber-700">{totals.scrap.toLocaleString()} kg</td>
                                <td className="py-2 px-2 text-right">{((totals.produced / totals.consumed) * 100).toFixed(1)}%</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
}

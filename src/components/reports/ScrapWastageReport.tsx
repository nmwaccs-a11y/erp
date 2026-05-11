import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer, AlertTriangle, CheckCircle } from "lucide-react";
import { ReportPrintHeader } from "./ReportPrintHeader";

const STD_WASTAGE = 4.5;

const DATA = [
    { date: "2026-05-07", machine: "Drawing Machine #1", batch: "B-2405", consumed: 1200, produced: 1140, scrap: 60 },
    { date: "2026-05-07", machine: "Enamel Line #1", batch: "E-2201", consumed: 800, produced: 765, scrap: 35 },
    { date: "2026-05-07", machine: "Drawing Machine #2", batch: "B-2406", consumed: 950, produced: 880, scrap: 70 },
    { date: "2026-05-06", machine: "Drawing Machine #1", batch: "B-2403", consumed: 1100, produced: 1045, scrap: 55 },
    { date: "2026-05-06", machine: "Drawing Machine #2", batch: "B-2404", consumed: 900, produced: 846, scrap: 54 },
];

export default function ScrapWastageReport() {
    const [show, setShow] = useState(false);

    return (
        <div className="space-y-4">
            <div className="flex items-end gap-3 p-4 bg-slate-50 rounded-lg border print:hidden">
                <div className="flex items-center gap-2 text-xs text-slate-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                    Standard Wastage Limit: <strong>{STD_WASTAGE}%</strong>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 h-8 text-sm" onClick={() => setShow(true)}>Generate</Button>
                {show && <Button variant="outline" className="h-8 text-sm" onClick={() => window.print()}><Printer className="h-3.5 w-3.5 mr-1.5" />Print</Button>}
            </div>
            {show && (
                <div className="bg-white border rounded-lg shadow-sm p-8 max-w-[210mm] mx-auto print:border-none print:shadow-none print:p-4">
                    <ReportPrintHeader reportTitle="Scrap Wastage Report" subtitle={`Standard Limit: ${STD_WASTAGE}%`} hierarchyLabel="Sub Accounts (Leaf)" />
                    <table className="w-full border-collapse text-[11px]">
                        <thead>
                            <tr className="bg-slate-100 border-b-2 border-slate-800">
                                <th className="py-2 px-2 text-left font-bold">Date</th>
                                <th className="py-2 px-2 text-left font-bold">Machine</th>
                                <th className="py-2 px-2 text-left font-bold">Batch</th>
                                <th className="py-2 px-2 text-right font-bold">Consumed</th>
                                <th className="py-2 px-2 text-right font-bold">Produced</th>
                                <th className="py-2 px-2 text-right font-bold text-amber-700">Scrap</th>
                                <th className="py-2 px-2 text-right font-bold">Actual %</th>
                                <th className="py-2 px-2 text-right font-bold text-slate-400">Std %</th>
                                <th className="py-2 px-2 text-center font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {DATA.map((r, i) => {
                                const pct = (r.scrap / r.consumed) * 100;
                                const bad = pct > STD_WASTAGE;
                                return (
                                    <tr key={i} className={`border-b ${bad ? "bg-rose-50 print:bg-transparent" : i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                                        <td className="py-1.5 px-2">{r.date}</td>
                                        <td className="py-1.5 px-2 text-slate-600">{r.machine}</td>
                                        <td className="py-1.5 px-2 font-mono text-slate-500">{r.batch}</td>
                                        <td className="py-1.5 px-2 text-right">{r.consumed.toLocaleString()} kg</td>
                                        <td className="py-1.5 px-2 text-right text-emerald-700">{r.produced.toLocaleString()} kg</td>
                                        <td className="py-1.5 px-2 text-right text-amber-700">{r.scrap} kg</td>
                                        <td className={`py-1.5 px-2 text-right font-bold ${bad ? "text-rose-700" : "text-slate-700"}`}>{pct.toFixed(2)}%</td>
                                        <td className="py-1.5 px-2 text-right text-slate-400">{STD_WASTAGE}%</td>
                                        <td className="py-1.5 px-2 text-center">
                                            {bad ? <span className="text-rose-700 font-semibold flex items-center justify-center gap-1"><AlertTriangle className="h-3 w-3"/>EXCEEDS</span>
                                                  : <span className="text-emerald-700 flex items-center justify-center gap-1"><CheckCircle className="h-3 w-3"/>OK</span>}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

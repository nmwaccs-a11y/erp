import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { ReportPrintHeader } from "./ReportPrintHeader";

const STOCK = [
    { code: "12101", item: "Copper Scrap (Raw)", warehouse: "Main Factory", qtyIn: 85000, qtyOut: 72400, valIn: 25500000 },
    { code: "12101", item: "Cathode Copper (Raw)", warehouse: "Main Factory", qtyIn: 12000, qtyOut: 10500, valIn: 4800000 },
    { code: "12102", item: "Wire No 8 / Rod (WIP)", warehouse: "Drawing Floor", qtyIn: 52400, qtyOut: 48900, valIn: 18340000 },
    { code: "12103", item: "28 SWG Enameled (FG)", warehouse: "Finished Goods", qtyIn: 30200, qtyOut: 27800, valIn: 12080000 },
    { code: "12103", item: "30 SWG Enameled (FG)", warehouse: "Finished Goods", qtyIn: 18700, qtyOut: 16200, valIn: 8415000 },
];

export default function StockValuationReport() {
    const [show, setShow] = useState(false);

    const rows = STOCK.map(s => {
        const remainQty = s.qtyIn - s.qtyOut;
        const wac = s.valIn / s.qtyIn;
        const totalVal = remainQty * wac;
        return { ...s, remainQty, wac, totalVal };
    });
    const grandTotal = rows.reduce((s, r) => s + r.totalVal, 0);

    return (
        <div className="space-y-4">
            <div className="flex items-end gap-3 p-4 bg-slate-50 rounded-lg border print:hidden">
                <Button className="bg-blue-600 hover:bg-blue-700 h-8 text-sm" onClick={() => setShow(true)}>Generate Stock Valuation</Button>
                {show && <Button variant="outline" className="h-8 text-sm" onClick={() => window.print()}><Printer className="h-3.5 w-3.5 mr-1.5" />Print</Button>}
            </div>
            {show && (
                <div className="bg-white border rounded-lg shadow-sm p-8 max-w-[210mm] mx-auto print:border-none print:shadow-none print:p-4">
                    <ReportPrintHeader reportTitle="Stock Valuation Report" subtitle="Weighted Average Cost (WAC) Method" hierarchyLabel="Sub Accounts (Leaf)" />
                    <table className="w-full border-collapse text-[11px]">
                        <thead>
                            <tr className="bg-slate-100 border-b-2 border-slate-800">
                                <th className="py-2 px-2 text-left font-bold">Code</th>
                                <th className="py-2 px-2 text-left font-bold">Item</th>
                                <th className="py-2 px-2 text-left font-bold">Warehouse</th>
                                <th className="py-2 px-2 text-right font-bold">Qty In</th>
                                <th className="py-2 px-2 text-right font-bold">Qty Out</th>
                                <th className="py-2 px-2 text-right font-bold text-blue-800">Remaining</th>
                                <th className="py-2 px-2 text-right font-bold">WAC/KG</th>
                                <th className="py-2 px-2 text-right font-bold text-slate-900">Total Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r, i) => (
                                <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                                    <td className="py-1.5 px-2 font-mono text-slate-500">{r.code}</td>
                                    <td className="py-1.5 px-2 font-medium text-slate-800">{r.item}</td>
                                    <td className="py-1.5 px-2 text-slate-600">{r.warehouse}</td>
                                    <td className="py-1.5 px-2 text-right">{r.qtyIn.toLocaleString()} kg</td>
                                    <td className="py-1.5 px-2 text-right">{r.qtyOut.toLocaleString()} kg</td>
                                    <td className="py-1.5 px-2 text-right font-bold text-blue-800">{r.remainQty.toLocaleString()} kg</td>
                                    <td className="py-1.5 px-2 text-right text-slate-700">₨ {r.wac.toFixed(2)}</td>
                                    <td className="py-1.5 px-2 text-right font-bold text-slate-900">₨ {r.totalVal.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-slate-100 border-t-2 border-slate-800 font-bold print:bg-transparent">
                                <td colSpan={7} className="py-2 px-2 text-right uppercase tracking-wider">Grand Total Stock Value:</td>
                                <td className="py-2 px-2 text-right text-slate-900 text-sm underline decoration-double">₨ {grandTotal.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
}

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useRef } from "react";

interface PrintPOSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: any;
}

export function PrintPOSheet({ open, onOpenChange, order }: PrintPOSheetProps) {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const printContent = printRef.current;
        if (printContent) {
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContent.innerHTML;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload(); // Reload to restore event listeners
        }
    };

    if (!order) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-end mb-4 no-print">
                    <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 gap-2">
                        <Printer className="h-4 w-4" /> Print Order
                    </Button>
                </div>

                <div ref={printRef} className="bg-white p-8 border border-slate-200 shadow-sm print:shadow-none print:border-none">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b pb-6 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">COPPER<span className="text-blue-600">SYNC</span> Industries</h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Plot 45, Industrial Estate<br />
                                Gujranwala, Pakistan<br />
                                +92 300 1234567 | info@coppersync.com
                            </p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-semibold text-slate-900">PURCHASE ORDER</h2>
                            <p className="text-sm text-slate-500 mt-1">Original Copy</p>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Vendor</h3>
                            <div className="text-slate-900 font-medium">{order.supplier}</div>
                            <div className="text-sm text-slate-500">
                                Designated Vendor Address<br />
                                Pakistan
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">PO #</h3>
                                <div className="text-slate-900 font-mono">{order.id}</div>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Date</h3>
                                <div className="text-slate-900">{order.date}</div>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</h3>
                                <div className="text-slate-900">{order.status}</div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <table className="w-full mb-8">
                        <thead>
                            <tr className="border-b-2 border-slate-900">
                                <th className="text-left py-2 text-xs font-bold text-slate-900 uppercase">Item Description</th>
                                <th className="text-right py-2 text-xs font-bold text-slate-900 uppercase">Quantity</th>
                                <th className="text-right py-2 text-xs font-bold text-slate-900 uppercase">Rate</th>
                                <th className="text-right py-2 text-xs font-bold text-slate-900 uppercase">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items && Array.isArray(order.items) ? (
                                order.items.map((item: any, index: number) => (
                                    <tr key={index} className="border-b border-slate-100">
                                        <td className="py-2 text-sm text-slate-900">{item.item || "Unknown Item"}</td>
                                        <td className="py-2 text-sm text-right text-slate-600">{item.qty || 0}</td>
                                        <td className="py-2 text-sm text-right text-slate-600">{Number(item.rate || 0).toLocaleString()}</td>
                                        <td className="py-2 text-sm text-right font-medium text-slate-900">
                                            {(Number(item.qty || 0) * Number(item.rate || 0)).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-4 text-center text-slate-500 italic">
                                        {typeof order.items === 'string' ? order.items : "No items listed"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={3} className="pt-4 text-right text-sm font-bold text-slate-900">Total Amount:</td>
                                <td className="pt-4 text-right text-lg font-bold text-blue-600">
                                    {order.amount ? order.amount.toLocaleString() :
                                        (order.items && Array.isArray(order.items) ? order.items.reduce((sum: number, i: any) => sum + (Number(i.qty || 0) * Number(i.rate || 0)), 0).toLocaleString() : "0")}
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* Footer */}
                    <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-slate-200">
                        <div>
                            <p className="text-sm text-slate-500">
                                <strong>Terms & Conditions:</strong><br />
                                1. Supply must be as per specification.<br />
                                2. Invoice must reference PO number.<br />
                                3. Delivery required by expected date.
                            </p>
                        </div>
                        <div className="text-center mt-8">
                            <div className="border-t border-slate-400 w-40 mx-auto mb-2"></div>
                            <p className="text-xs text-slate-500 uppercase">Authorized Signature</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

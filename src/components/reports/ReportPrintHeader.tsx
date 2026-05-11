import { format } from "date-fns";

interface ReportPrintHeaderProps {
    reportTitle: string;
    subtitle?: string;
    dateFrom?: string;
    dateTo?: string;
    hierarchyLabel?: "Master Account (Groups)" | "Sub Accounts (Leaf)";
    printedBy?: string;
}

export function ReportPrintHeader({
    reportTitle,
    subtitle,
    dateFrom,
    dateTo,
    hierarchyLabel = "Sub Accounts (Leaf)",
    printedBy = "Admin User",
}: ReportPrintHeaderProps) {
    const now = new Date();
    const timestamp = format(now, "dd-MMM-yyyy HH:mm");

    return (
        <div className="mb-6 pb-5 border-b-2 border-slate-800">
            {/* Company Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-wider">
                        CopperSync Manufacturing
                    </h1>
                    <p className="text-slate-500 text-xs mt-0.5">42 Industrial Estate, Gujranwala, Pakistan</p>
                    <p className="text-slate-500 text-xs">Phone: +92 300 1234567 | NTN: 1234567-8</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-light text-slate-400 uppercase tracking-widest">{reportTitle}</h2>
                    {subtitle && <p className="text-slate-600 text-sm mt-0.5">{subtitle}</p>}
                    {dateFrom && dateTo && (
                        <p className="text-slate-700 font-medium text-sm mt-1">
                            Period: {format(new Date(dateFrom), "dd MMM yyyy")} – {format(new Date(dateTo), "dd MMM yyyy")}
                        </p>
                    )}
                </div>
            </div>

            {/* Global Metadata Strip */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                <span>
                    <span className="font-semibold text-slate-700">Generated:</span> {timestamp} PKT
                </span>
                <span>
                    <span className="font-semibold text-slate-700">Printed By:</span> {printedBy}
                </span>
                <span>
                    <span className="font-semibold text-slate-700">Grouped By:</span> {hierarchyLabel}
                </span>
            </div>
        </div>
    );
}

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, Download, Printer } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ReportPrintHeader } from "@/components/reports/ReportPrintHeader";

// --- MOCK DATA ---
const MOCK_ACCOUNTS = {
    Party: [
        { id: "P-01", name: "Alpha Cables (Customer)" },
        { id: "P-02", name: "Gamma Scrap (Vendor)" },
    ],
    Bank: [
        { id: "B-01", name: "Meezan Bank" },
        { id: "B-02", name: "HBL Current" },
        { id: "C-01", name: "Main Cash" }
    ],
    Expense: [
        { id: "E-01", name: "Wage Expense" },
        { id: "E-02", name: "Utility Expense" }
    ],
    Sales: [
        { id: "S-01", name: "Sales (Direct)" },
        { id: "S-02", name: "Sales (Premium)" }
    ],
    Purchases: [
        { id: "PR-01", name: "Purchases (Raw Material)" }
    ]
};

const MOCK_FINANCIAL_TRANSACTIONS = [
    { id: "TX-1", date: "2026-04-10", ref: "OB", desc: "Opening Balance", particulars: "-", weight: null, rate: null, debit: 0, credit: 0, type: "Party", accId: "P-01", isOpening: true, startingBal: 500000 },
    { id: "TX-2", date: "2026-04-11", ref: "SI-26-001", desc: "Sale", particulars: "28 SWG Enameled Wire", weight: 50, rate: 2400, debit: 120000, credit: 0, type: "Party", accId: "P-01" },
    { id: "TX-3", date: "2026-04-12", ref: "CV-26-008", desc: "Cash Received", particulars: "Bank Transfer", weight: null, rate: null, debit: 0, credit: 50000, type: "Party", accId: "P-01" },
    { id: "TX-4", date: "2026-04-13", ref: "SI-26-002", desc: "Sale", particulars: "30 SWG Fine Wire", weight: 30, rate: 2666.67, debit: 80000, credit: 0, type: "Party", accId: "P-01" },
    
    { id: "TX-5", date: "2026-04-10", ref: "OB", desc: "Opening Balance", particulars: "-", weight: null, rate: null, debit: 0, credit: 0, type: "Bank", accId: "B-01", isOpening: true, startingBal: 1200000 },
    { id: "TX-6", date: "2026-04-12", ref: "CV-26-008", desc: "Cash Deposit", particulars: "Alpha Cables", weight: null, rate: null, debit: 50000, credit: 0, type: "Bank", accId: "B-01" },
    { id: "TX-7", date: "2026-04-14", ref: "CV-26-009", desc: "Factory Rent", particulars: "Bank Transfer", weight: null, rate: null, debit: 0, credit: 35000, type: "Bank", accId: "B-01" },
    
    { id: "TX-8", date: "2026-04-10", ref: "OB", desc: "Opening Balance", particulars: "-", weight: null, rate: null, debit: 0, credit: 0, type: "Party", accId: "P-02", isOpening: true, startingBal: -200000 },
    { id: "TX-9", date: "2026-04-13", ref: "PI-26-003", desc: "Purchase Invoice", particulars: "Wire No 8 Raw", weight: 50, rate: 3000, debit: 0, credit: 150000, type: "Party", accId: "P-02" },
];

const MOCK_METAL_TRANSACTIONS = [
    { id: "MX-1", date: "2026-04-10", ref: "OB", material: "N/A", desc: "Opening Metal Balance", weightIn: 0, weightOut: 0, type: "Party", accId: "P-01", isOpening: true, startingBal: 150 }, // 150 KG advance from customer
    { id: "MX-2", date: "2026-04-11", ref: "SI-26-001", material: "Copper Scrap", desc: "Scrap Allocated against Sale", weightIn: 0, weightOut: 50, type: "Party", accId: "P-01" }, 
    
    { id: "MX-3", date: "2026-04-10", ref: "OB", material: "N/A", desc: "Opening Metal Balance", weightIn: 0, weightOut: 0, type: "Party", accId: "P-02", isOpening: true, startingBal: -800 }, // We owe vendor 800 KG
    { id: "MX-4", date: "2026-04-12", ref: "VR-26-002", material: "Wire No 8", desc: "Vendor Settlement Receipt", weightIn: 500, weightOut: 0, type: "Party", accId: "P-02" }, 
];

export default function UnifiedLedgers() {
    const [dateFrom, setDateFrom] = useState(() => {
        const d = new Date();
        d.setDate(1); // 1st of current month
        return d.toISOString().split('T')[0];
    });
    const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
    const [accountType, setAccountType] = useState<keyof typeof MOCK_ACCOUNTS | "Select">("Select");
    const [selectedAccountId, setSelectedAccountId] = useState("Select");
    const [ledgerViewMode, setLedgerViewMode] = useState("Both"); // Both, Financial, Material
    const [isFiltering, setIsFiltering] = useState(false);

    const availableAccounts = accountType !== "Select" ? MOCK_ACCOUNTS[accountType as keyof typeof MOCK_ACCOUNTS] : [];

    const handleFilter = () => {
        setIsFiltering(true);
        setTimeout(() => setIsFiltering(false), 500); // simulate loading
    };

    // Calculate Financial Ledger running balance
    const financialLedgerRows = useMemo(() => {
        let runningBalance = 0;
        const filtered = MOCK_FINANCIAL_TRANSACTIONS.filter(t => t.accId === selectedAccountId).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        return filtered.map(t => {
            if (t.isOpening) {
                runningBalance = t.startingBal || 0;
            } else {
                runningBalance = runningBalance + t.debit - t.credit;
            }
            return { ...t, runningBalance };
        });
    }, [selectedAccountId, isFiltering]);

    // Calculate Metal Ledger running balance
    const metalLedgerRows = useMemo(() => {
        let runningBalance = 0;
        const filtered = MOCK_METAL_TRANSACTIONS.filter(t => t.accId === selectedAccountId).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        return filtered.map(t => {
            if (t.isOpening) {
                runningBalance = t.startingBal || 0;
            } else {
                runningBalance = runningBalance + t.weightIn - t.weightOut;
            }
            return { ...t, runningBalance };
        });
    }, [selectedAccountId, isFiltering]);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="print:hidden">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                        <BookOpen className="h-8 w-8 text-blue-600" /> Unified Ledgers
                    </h1>
                    <p className="text-slate-500 mt-2">View transactions across all financial, bank, and party multi-currency (PKR & Metal) accounts.</p>
                </div>

                <Card className="shadow-sm border-slate-200 bg-white print:hidden">
                    <CardHeader className="pb-4 border-b bg-slate-50/50">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Search className="h-4 w-4" /> Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                            <div className="space-y-2">
                                <Label className="text-xs">Account Type</Label>
                                <Select value={accountType} onValueChange={(v : any) => { setAccountType(v); setSelectedAccountId("Select"); }}>
                                    <SelectTrigger className="bg-white h-9">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(MOCK_ACCOUNTS).map(type => (
                                            <SelectItem key={type} value={type}>{type} Accounts</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-xs">Select Account</Label>
                                <Select value={selectedAccountId} onValueChange={setSelectedAccountId} disabled={accountType === "Select"}>
                                    <SelectTrigger className="bg-white h-9">
                                        <SelectValue placeholder="Loading..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableAccounts.map(acc => (
                                            <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {accountType === "Party" && (
                                <div className="space-y-2">
                                    <Label className="text-xs">Ledger View</Label>
                                    <Select value={ledgerViewMode} onValueChange={setLedgerViewMode}>
                                        <SelectTrigger className="bg-white h-9 border-blue-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Both">Combined Statement</SelectItem>
                                            <SelectItem value="Financial">Financial Statement Only</SelectItem>
                                            <SelectItem value="Material">Material Statement Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label className="text-xs">Date Range</Label>
                                <div className="flex items-center gap-1">
                                    <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-9 w-1/2 p-1 text-xs" />
                                    <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-9 w-1/2 p-1 text-xs" />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button onClick={handleFilter} className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm h-9 px-2 text-xs" disabled={selectedAccountId === "Select" || isFiltering}>
                                    {isFiltering ? "Loading..." : "Load Ledger"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {selectedAccountId !== "Select" && !isFiltering && financialLedgerRows.length > 0 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex justify-end gap-2 mb-4 print:hidden">
                            <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-300" onClick={() => window.print()}>
                                <Printer className="h-4 w-4 mr-2 text-slate-600" /> Print / Export PDF
                            </Button>
                        </div>
                        
                        {/* --- PROFESSIONAL PRINTABLE LEDGER AREA --- */}
                        <div className="bg-white border rounded-lg shadow-sm p-8 max-w-[210mm] mx-auto print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none print:w-full print:block min-h-[297mm]">

                            <ReportPrintHeader
                                reportTitle={`${accountType} Ledger`}
                                dateFrom={dateFrom}
                                dateTo={dateTo}
                                hierarchyLabel="Sub Accounts (Leaf)"
                            />

                            {/* Account Details */}
                            <div className="flex justify-between items-end bg-slate-50 p-4 rounded-lg border border-slate-100 mb-8 print:bg-transparent print:border-b print:border-slate-300 print:rounded-none print:p-0 print:pb-4">
                                <div>
                                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Account Title</h3>
                                    <p className="text-xl font-bold text-slate-900">{availableAccounts.find(a => a.id === selectedAccountId)?.name}</p>
                                    {accountType === "Party" && <p className="text-sm text-slate-600 mt-1">Address: Main Metal Market, G-Block, Gujranwala</p>}
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Account ID</p>
                                    <p className="font-mono font-medium text-slate-800 bg-white px-2 py-1 border rounded shadow-sm print:shadow-none print:border-none print:p-0">{selectedAccountId}</p>
                                </div>
                            </div>
                            
                            {/* Financial Ledger Section */}
                            {(ledgerViewMode === "Both" || ledgerViewMode === "Financial" || accountType !== "Party") && (
                            <div className="mb-8 relative auto-rows-min">
                                <div className="flex justify-between items-end mb-3">
                                    <h3 className="text-lg font-bold text-slate-800 tracking-wide border-b-2 border-blue-800 pb-0.5 inline-block uppercase print:border-black">
                                        {accountType === "Bank" && "Bank Statement"}
                                        {accountType === "Expense" && "Expense Ledger Register"}
                                        {accountType === "Sales" && "Sales & Revenue Ledger"}
                                        {accountType === "Purchases" && "Purchases Ledger"}
                                        {accountType === "Party" && "Statement of Account (Financial)"}
                                        {accountType === "Select" && "Ledger"}
                                    </h3>
                                </div>
                                
                                <div className="border border-slate-300 print:border-slate-800 rounded-sm overflow-hidden shadow-sm print:shadow-none bg-white">
                                    <Table className="text-[11px] print:text-[10px] w-full">
                                        <TableHeader>
                                            <TableRow className="bg-slate-100 print:bg-slate-200 border-b-2 border-slate-300 print:border-slate-800">
                                                <TableHead className="w-[80px] font-bold text-slate-800 py-2 h-auto border-r border-slate-300 print:border-slate-400">Date</TableHead>
                                                <TableHead className="w-[100px] font-bold text-slate-800 py-2 h-auto border-r border-slate-300 print:border-slate-400">Ref No.</TableHead>
                                                <TableHead className="font-bold text-slate-800 py-2 h-auto border-r border-slate-300 print:border-slate-400">Description</TableHead>
                                                <TableHead className="font-bold text-slate-800 py-2 h-auto border-r border-slate-300 print:border-slate-400">Particulars / Details</TableHead>
                                                <TableHead className="text-right w-[60px] font-bold text-slate-800 py-2 h-auto border-r border-slate-300 print:border-slate-400">Wt/Qty</TableHead>
                                                <TableHead className="text-right w-[70px] font-bold text-slate-800 py-2 h-auto border-r border-slate-300 print:border-slate-400">Rate</TableHead>
                                                <TableHead className="text-right w-[90px] font-bold text-slate-800 py-2 h-auto bg-slate-50 print:bg-transparent border-r border-slate-300 print:border-slate-400">Debit (₨)</TableHead>
                                                <TableHead className="text-right w-[90px] font-bold text-slate-800 py-2 h-auto bg-slate-50 print:bg-transparent border-r border-slate-300 print:border-slate-400">Credit (₨)</TableHead>
                                                <TableHead className="text-right w-[100px] font-bold text-slate-900 py-2 h-auto bg-blue-50/50 print:bg-transparent">Balance</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="[&_tr:last-child]:border-0">
                                            {financialLedgerRows.map((row, index) => (
                                                <TableRow key={`fin-${index}`} className={`border-b border-slate-200 print:border-slate-300 print:h-6 hover:bg-transparent ${row.isOpening ? "bg-amber-50/30 print:bg-transparent font-medium" : index % 2 === 0 ? "bg-white print:bg-transparent" : "bg-slate-50/50 print:bg-transparent"}`}>
                                                    <TableCell className="py-1.5 whitespace-nowrap border-r border-slate-200 print:border-slate-400">{format(new Date(row.date), "dd-MMM-yy")}</TableCell>
                                                    <TableCell className="py-1.5 font-mono text-slate-600 border-r border-slate-200 print:border-slate-400">{row.ref}</TableCell>
                                                    <TableCell className="py-1.5 leading-tight font-medium text-slate-800 border-r border-slate-200 print:border-slate-400">{row.desc}</TableCell>
                                                    <TableCell className="py-1.5 leading-tight text-slate-600 border-r border-slate-200 print:border-slate-400">{row.particulars}</TableCell>
                                                    <TableCell className="py-1.5 text-right text-slate-600 border-r border-slate-200 print:border-slate-400">{row.weight || "-"}</TableCell>
                                                    <TableCell className="py-1.5 text-right text-slate-600 border-r border-slate-200 print:border-slate-400">{row.rate?.toLocaleString() || "-"}</TableCell>
                                                    <TableCell className="py-1.5 text-right text-slate-800 font-medium border-r border-slate-200 print:border-slate-400 bg-slate-50/30 print:bg-transparent">{row.debit > 0 ? row.debit.toLocaleString() : "-"}</TableCell>
                                                    <TableCell className="py-1.5 text-right text-slate-800 font-medium border-r border-slate-200 print:border-slate-400 bg-slate-50/30 print:bg-transparent">{row.credit > 0 ? row.credit.toLocaleString() : "-"}</TableCell>
                                                    <TableCell className={`py-1.5 text-right font-bold tracking-tight bg-blue-50/20 print:bg-transparent ${row.runningBalance >= 0 ? 'text-slate-900' : 'text-slate-900'}`}>
                                                        {Math.abs(row.runningBalance).toLocaleString()} <span className="text-[9px] text-slate-500 font-normal ml-0.5">{row.runningBalance >= 0 ? 'Dr' : 'Cr'}</span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="flex justify-end pt-2 print:pt-1">
                                    <div className="text-right print:pr-1 bg-slate-100 print:bg-transparent px-4 py-2 rounded-md border border-slate-200 print:border-none inline-block shadow-sm print:shadow-none">
                                        <span className="text-slate-700 font-bold mr-3 text-xs justify-center uppercase tracking-wider">Closing Balance:</span>
                                        <span className="text-base font-bold text-slate-900 underline decoration-double underline-offset-4">₨ {Math.abs(financialLedgerRows[financialLedgerRows.length-1].runningBalance).toLocaleString()} <span className="text-xs text-slate-600 ml-1 font-semibold">{financialLedgerRows[financialLedgerRows.length-1].runningBalance >= 0 ? 'Dr' : 'Cr'}</span></span>
                                    </div>
                                </div>
                            </div>
                            )}

                            {/* Metal Ledger Section */}
                            {accountType === "Party" && (ledgerViewMode === "Both" || ledgerViewMode === "Material") && (
                                <div className="mb-12">
                                    <h3 className="text-lg font-bold text-amber-800 tracking-wide border-b-2 border-amber-800 pb-0.5 inline-block mb-3 uppercase print:border-black print:text-black">Statement of Material Position (Metal Weight)</h3>
                                    
                                    <div className="border border-slate-300 print:border-slate-800 rounded-sm overflow-hidden shadow-sm print:shadow-none bg-white">
                                        <Table className="text-[11px] print:text-[10px] w-full">
                                            <TableHeader>
                                                <TableRow className="bg-amber-50/50 print:bg-slate-200 border-b-2 border-slate-300 print:border-slate-800">
                                                    <TableHead className="w-[100px] font-bold text-slate-800 py-2 h-auto border-r border-slate-300 print:border-slate-400">Date</TableHead>
                                                    <TableHead className="w-[120px] font-bold text-slate-800 py-2 h-auto border-r border-slate-300 print:border-slate-400">Ref No.</TableHead>
                                                    <TableHead className="font-bold text-slate-800 py-2 h-auto border-r border-slate-300 print:border-slate-400">Description / Particulars</TableHead>
                                                    <TableHead className="text-right w-[100px] font-bold text-slate-800 py-2 h-auto bg-emerald-50/50 print:bg-transparent border-r border-slate-300 print:border-slate-400">Wt Received (+)</TableHead>
                                                    <TableHead className="text-right w-[100px] font-bold text-slate-800 py-2 h-auto bg-rose-50/50 print:bg-transparent border-r border-slate-300 print:border-slate-400">Wt Issued (-)</TableHead>
                                                    <TableHead className="text-right w-[110px] font-bold text-slate-900 py-2 h-auto bg-amber-50 print:bg-transparent">Net Wt Balance</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody className="[&_tr:last-child]:border-0">
                                                {metalLedgerRows.map((row, index) => (
                                                    <TableRow key={`met-${index}`} className={`border-b border-slate-200 print:border-slate-300 print:h-6 hover:bg-transparent ${row.isOpening ? "bg-amber-50/30 print:bg-transparent font-medium" : index % 2 === 0 ? "bg-white print:bg-transparent" : "bg-slate-50/50 print:bg-transparent"}`}>
                                                        <TableCell className="py-1.5 whitespace-nowrap border-r border-slate-200 print:border-slate-400">{format(new Date(row.date), "dd-MMM-yy")}</TableCell>
                                                        <TableCell className="py-1.5 font-mono text-slate-600 border-r border-slate-200 print:border-slate-400">{row.ref}</TableCell>
                                                        <TableCell className="py-1.5 leading-tight border-r border-slate-200 print:border-slate-400">
                                                            <span className="font-semibold text-slate-800 pr-1">{row.material !== "N/A" ? row.material : ""}</span>
                                                            <span className="text-slate-600">{row.desc}</span>
                                                        </TableCell>
                                                        <TableCell className="py-1.5 text-right text-emerald-700 font-medium border-r border-slate-200 print:border-slate-400 bg-emerald-50/20 print:bg-transparent">{row.weightIn > 0 ? `${row.weightIn.toLocaleString()} kg` : "-"}</TableCell>
                                                        <TableCell className="py-1.5 text-right text-amber-700 font-medium border-r border-slate-200 print:border-slate-400 bg-rose-50/20 print:bg-transparent">{row.weightOut > 0 ? `${row.weightOut.toLocaleString()} kg` : "-"}</TableCell>
                                                        <TableCell className="py-1.5 text-right font-bold text-slate-900 bg-amber-50/40 print:bg-transparent">
                                                            {Math.abs(row.runningBalance).toLocaleString()} kg <span className="text-[9px] text-slate-600 font-normal ml-0.5">{row.runningBalance >= 0 ? '(Adv)' : '(Owed)'}</span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    {metalLedgerRows.length > 0 && (
                                        <div className="flex justify-end pt-2 print:pt-1">
                                            <div className="text-right print:pr-1 bg-amber-50/50 print:bg-transparent px-4 py-2 rounded-md border border-amber-200 print:border-none inline-block shadow-sm print:shadow-none">
                                                <span className="text-slate-700 font-bold mr-3 text-xs uppercase tracking-wider">Closing Net Weight:</span>
                                                <span className="text-base font-bold text-slate-900 underline decoration-double underline-offset-4">{Math.abs(metalLedgerRows[metalLedgerRows.length-1].runningBalance).toLocaleString()} kg <span className="text-xs text-slate-700 font-semibold ml-1">{metalLedgerRows[metalLedgerRows.length-1].runningBalance >= 0 ? '(Advance Given)' : '(Owed to Us)'}</span></span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Signatures Section */}
                            <div className="grid grid-cols-3 gap-8 mt-16 pt-8 print:mt-24">
                                <div className="text-center">
                                    <div className="border-b border-slate-400 mx-8 mb-2"></div>
                                    <p className="text-sm font-semibold text-slate-700 uppercase">Prepared By</p>
                                </div>
                                <div className="text-center">
                                    <div className="border-b border-slate-400 mx-8 mb-2"></div>
                                    <p className="text-sm font-semibold text-slate-700 uppercase">Authorized Signature</p>
                                </div>
                                {accountType === "Party" ? (
                                    <div className="text-center">
                                        <div className="border-b border-slate-400 mx-8 mb-2"></div>
                                        <p className="text-sm font-semibold text-slate-700 uppercase">Customer / Vendor</p>
                                    </div>
                                ) : (
                                    <div></div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                
                {selectedAccountId !== "Select" && !isFiltering && financialLedgerRows.length === 0 && (
                    <div className="p-12 text-center border-2 border-dashed rounded-lg text-slate-500">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                        <h2 className="text-xl font-semibold text-slate-700">No entries found.</h2>
                        <p className="text-slate-500 max-w-sm mx-auto mt-2">Try adjusting the date filters or check if this account has had recent activity.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, ArrowRightLeft, Wallet, History, FileText, Save, AlertCircle, Search, Edit, Trash2 } from "lucide-react";
import { useState, useMemo, useRef } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const COA_ACCOUNTS = [
    { id: "1110", name: "Cash in Hand" },
    { id: "1121", name: "Meezan Bank" },
    { id: "1122", name: "HBL Current A/C" },
    { id: "1131", name: "Alpha Cables (Customer)" },
    { id: "1132", name: "Gateway Motors (Customer)" },
    { id: "2111", name: "Gamma Scrap (Vendor)" },
    { id: "5100", name: "Wage Expense" },
    { id: "5200", name: "Utility Expense" },
    { id: "5300", name: "Misc Expense" },
];

const MOCK_PARCHI_COMMITMENTS = [
    { parchi_id: "P-105", party_id: "1131", party_name: "Alpha Cables (Customer)", total_amount: 500000, cleared_amount: 200000, available_balance: 300000, status: "Pending" },
    { parchi_id: "P-106", party_id: "1131", party_name: "Alpha Cables (Customer)", total_amount: 100000, cleared_amount: 0, available_balance: 100000, status: "Pending" },
    { parchi_id: "P-201", party_id: "2111", party_name: "Gamma Scrap (Vendor)", total_amount: 750000, cleared_amount: 500000, available_balance: 250000, status: "Partially Cleared" },
];

const INITIAL_LEDGER = [
    { id: "TXN-001", pageNo: "1", date: "2026-05-08", account: "Cash in Hand", voucherType: "Opening", mode: "System", desc: "Opening Balance", debit: 10450, credit: 0, balance: 10450 },
    { id: "TXN-002", pageNo: "1", date: "2026-05-08", account: "Gateway Motors (Customer)", voucherType: "CRV", mode: "Cash", desc: "Sale Payment", debit: 2500, credit: 0, balance: 12950 },
    { id: "TXN-003", pageNo: "1", date: "2026-05-08", account: "Misc Expense", voucherType: "CPV", mode: "Cash", desc: "Tea & Misc Expenses", debit: 0, credit: 500, balance: 12450 },
];

export default function Financials() {
    const [ledgerData, setLedgerData] = useState(INITIAL_LEDGER);
    const [parchiData, setParchiData] = useState(MOCK_PARCHI_COMMITMENTS);
    const currentBalance = ledgerData.length > 0 ? ledgerData[ledgerData.length - 1].balance : 0;

    const accountBtnRef = useRef<HTMLButtonElement>(null);
    const [accountOpen, setAccountOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [voucherId, setVoucherId] = useState(`V-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [pageNo, setPageNo] = useState("1");
    const [actionType, setActionType] = useState("CRV");
    const [clearanceMode, setClearanceMode] = useState("Cash");
    const [party, setParty] = useState("");
    const [amount, setAmount] = useState("");
    const [desc, setDesc] = useState("");

    const [searchQuery, setSearchQuery] = useState("");

    const [selectedParchiId, setSelectedParchiId] = useState("");
    const [parchiDueDate, setParchiDueDate] = useState("");

    const selectedParchi = useMemo(() => parchiData.find(p => p.parchi_id === selectedParchiId), [selectedParchiId, parchiData]);
    const pageEntries = useMemo(() => ledgerData.filter(r => r.date === date && r.pageNo === pageNo), [ledgerData, date, pageNo]);
    const filteredLedger = useMemo(() => pageEntries.filter(row =>
        searchQuery === "" || row.account.toLowerCase().includes(searchQuery.toLowerCase()) || row.desc.toLowerCase().includes(searchQuery.toLowerCase()) || row.id.toLowerCase().includes(searchQuery.toLowerCase())
    ), [pageEntries, searchQuery]);

    const { openingBalance, closingBalance } = useMemo(() => {
        let opening = 0;
        if (pageEntries.length > 0) {
            const firstIdx = ledgerData.findIndex(r => r.id === pageEntries[0].id);
            if (firstIdx > 0) opening = ledgerData[firstIdx - 1].balance;
        } else {
            opening = ledgerData.length > 0 ? ledgerData[ledgerData.length - 1].balance : 0;
        }
        let closing = opening;
        if (pageEntries.length > 0) closing = pageEntries[pageEntries.length - 1].balance;
        return { openingBalance: opening, closingBalance: closing };
    }, [ledgerData, pageEntries]);

    const receiptAmount = Number(amount) || 0;

    const maxAllowedAmount = useMemo(() => {
        if (!selectedParchi) return 0;
        let oldAmount = 0;
        if (editingId && clearanceMode === "Clear Parchi") {
            const oldRow = ledgerData.find(r => r.id === editingId);
            if (oldRow) {
                oldAmount = oldRow.debit > 0 ? oldRow.debit : oldRow.credit;
            }
        }
        return selectedParchi.available_balance + oldAmount;
    }, [selectedParchi, editingId, clearanceMode, ledgerData]);

    const isOverCleared = clearanceMode === "Clear Parchi" && selectedParchi && receiptAmount > maxAllowedAmount;

    const isReadyToSave = () => {
        if (!party || receiptAmount <= 0) return false;
        if (actionType === "ISSUE_PARCHI" && !parchiDueDate) return false;
        if (clearanceMode === "Clear Parchi") {
            if (editingId) return !isOverCleared && receiptAmount > 0;
            return !isOverCleared && selectedParchiId !== "";
        }
        return desc.trim() !== "";
    };

    const recalculateBalances = (data: any[]) => {
        let currentBal = 0;
        return data.map(row => {
            currentBal = currentBal + row.debit - row.credit;
            return { ...row, balance: currentBal };
        });
    };

    const handleSave = () => {
        if (!isReadyToSave()) return;

        let newDebit = 0;
        let newCredit = 0;

        if (actionType === "CRV") newDebit = receiptAmount;
        if (actionType === "CPV") newCredit = receiptAmount;

        const newLedgerEntry = {
            id: editingId || voucherId,
            pageNo: pageNo,
            date: date,
            account: party,
            voucherType: actionType === "ISSUE_PARCHI" ? "Parchi Issued" : actionType,
            mode: actionType === "ISSUE_PARCHI" ? "Commitment" : clearanceMode,
            desc: actionType === "ISSUE_PARCHI" ? `Issued Parchi Due: ${parchiDueDate}` : (clearanceMode === "Clear Parchi" ? (desc.trim() ? `${desc.trim()} [${selectedParchiId}]` : `Cleared against ${selectedParchiId}`) : desc),
            debit: newDebit,
            credit: newCredit,
            balance: 0
        };

        if (editingId) {
            setLedgerData(prev => recalculateBalances(prev.map(r => r.id === editingId ? newLedgerEntry : r)));
            setEditingId(null);
        } else {
            setLedgerData(prev => recalculateBalances([...prev, newLedgerEntry]));
            setVoucherId(`V-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
        }

        if (clearanceMode === "Clear Parchi" && selectedParchiId) {
            let amountDifference = receiptAmount;
            if (editingId) {
                const oldRow = ledgerData.find(r => r.id === editingId);
                const oldAmount = oldRow ? (oldRow.debit > 0 ? oldRow.debit : oldRow.credit) : 0;
                amountDifference = receiptAmount - oldAmount;
            }
            setParchiData(prev => prev.map(p => {
                if (p.parchi_id === selectedParchiId) {
                    const newCleared = p.cleared_amount + amountDifference;
                    const newAvail = p.total_amount - newCleared;
                    return { ...p, cleared_amount: newCleared, available_balance: newAvail, status: newAvail === 0 ? "Cleared" : "Partially Cleared" };
                }
                return p;
            }));
        }

        if (actionType === "ISSUE_PARCHI") {
            const newParchi = {
                parchi_id: `P-${Math.floor(Math.random() * 1000)}`,
                party_id: party,
                party_name: party,
                total_amount: receiptAmount,
                cleared_amount: 0,
                available_balance: receiptAmount,
                status: "Pending"
            };
            setParchiData(prev => [...prev, newParchi]);
        }

        setAmount(""); setDesc(""); setSelectedParchiId(""); setParty("");
        setTimeout(() => accountBtnRef.current?.focus(), 0);
    };

    const handleDelete = () => {
        if (!editingId) return;
        setLedgerData(prev => recalculateBalances(prev.filter(r => r.id !== editingId)));
        setEditingId(null);
        setAmount(""); setDesc(""); setSelectedParchiId(""); setParty("");
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* ── HEADER ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financials</h1>
                        <p className="text-slate-500">Integrated Cash, Bank, and Hwala Commitments</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="shadow-soft border-slate-100 bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-slate-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Cash in Hand</CardTitle>
                            <Wallet className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₨ {currentBalance.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-soft border-slate-100 bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-slate-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Bank Balance</CardTitle>
                            <History className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₨ 145,200</div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-soft border-slate-100 bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-slate-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Parchi Liability</CardTitle>
                            <FileText className="h-4 w-4 text-slate-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₨ {parchiData.reduce((acc, curr) => acc + curr.available_balance, 0).toLocaleString()}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* ── ENTRY FORM CARD ── */}
                <Card className="shadow-soft border-slate-100 bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-slate-200">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <ArrowRightLeft className="mr-2 h-5 w-5 text-blue-600" />
                            New Entry Form
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Date</Label>
                                        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Page No.</Label>
                                        <Input value={pageNo} onChange={(e) => setPageNo(e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Action Type</Label>
                                    <div className="flex bg-slate-100 p-1 rounded-md">
                                        <button
                                            className={cn("flex-1 py-1.5 px-3 rounded-sm text-sm font-medium transition-all", actionType === "CRV" ? "bg-white shadow-sm text-emerald-700" : "text-slate-500 hover:text-slate-700")}
                                            onClick={() => { setActionType("CRV"); setClearanceMode("Cash"); setSelectedParchiId(""); }}
                                        >
                                            CRV (Receipt)
                                        </button>
                                        <button
                                            className={cn("flex-1 py-1.5 px-3 rounded-sm text-sm font-medium transition-all", actionType === "CPV" ? "bg-white shadow-sm text-rose-700" : "text-slate-500 hover:text-slate-700")}
                                            onClick={() => { setActionType("CPV"); setClearanceMode("Cash"); setSelectedParchiId(""); }}
                                        >
                                            CPV (Payment)
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 flex flex-col">
                                    <Label>Account / Party</Label>
                                    <Popover open={accountOpen} onOpenChange={setAccountOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" aria-expanded={accountOpen} className="w-full justify-between font-normal" ref={accountBtnRef}>
                                                {party ? COA_ACCOUNTS.find((acc) => acc.name === party)?.name : "Search account..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[400px] p-0" align="start">
                                            <Command>
                                                <CommandInput placeholder="Search by name or ID..." />
                                                <CommandList>
                                                    <CommandEmpty>No account found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {COA_ACCOUNTS.map((acc) => (
                                                            <CommandItem key={acc.id} value={`${acc.id} ${acc.name}`} onSelect={() => { setParty(acc.name); setSelectedParchiId(""); setAccountOpen(false); }}>
                                                                <Check className={`mr-2 h-4 w-4 ${party === acc.name ? "opacity-100" : "opacity-0"}`} />
                                                                [{acc.id}] {acc.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2">
                                    <Label>Payment Mode</Label>
                                    <div className="flex bg-slate-100 p-1 rounded-md">
                                        <button
                                            className={cn("flex-1 py-1.5 px-3 rounded-sm text-sm font-medium transition-all", clearanceMode === "Cash" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700")}
                                            onClick={() => { setClearanceMode("Cash"); setSelectedParchiId(""); }}
                                        >
                                            Direct Cash / Bank
                                        </button>
                                        {actionType === "CRV" && (
                                            <button
                                                className={cn("flex-1 py-1.5 px-3 rounded-sm text-sm font-medium transition-all", clearanceMode === "Clear Parchi" ? "bg-white shadow-sm text-blue-700" : "text-slate-500 hover:text-slate-700")}
                                                onClick={() => setClearanceMode("Clear Parchi")}
                                            >
                                                Clear Pending Parchi
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-md border border-slate-100 h-full flex flex-col justify-center">
                                {clearanceMode === "Clear Parchi" ? (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Select Parchi to Clear</Label>
                                            <Select value={selectedParchiId} onValueChange={setSelectedParchiId} disabled={!party}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={party ? "Available Parchis..." : "Select Account First"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {parchiData.filter(p => p.party_name === party && p.available_balance > 0).map(p => (
                                                        <SelectItem key={p.parchi_id} value={p.parchi_id}>
                                                            {p.parchi_id} (Avail: ₨ {p.available_balance.toLocaleString()})
                                                        </SelectItem>
                                                    ))}
                                                    {parchiData.filter(p => p.party_name === party && p.available_balance > 0).length === 0 && (
                                                        <SelectItem value="none" disabled>No pending parchis</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {selectedParchi && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white p-3 rounded-md border border-slate-100 shadow-sm">
                                                    <Label className="text-xs text-slate-500">Parchi Total</Label>
                                                    <div className="font-medium text-sm mt-1">₨ {selectedParchi.total_amount.toLocaleString()}</div>
                                                </div>
                                                <div className="bg-white p-3 rounded-md border border-slate-100 shadow-sm">
                                                    <Label className="text-xs text-slate-500">Available Bal.</Label>
                                                    <div className="font-medium text-sm mt-1 text-blue-600">₨ {selectedParchi.available_balance.toLocaleString()}</div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-2 mt-4">
                                            <Label className={isOverCleared ? "text-red-600" : ""}>Clearance Amount</Label>
                                            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                                                className={isOverCleared ? "border-red-500 focus-visible:ring-red-500" : ""}
                                                placeholder="0.00" disabled={!selectedParchi} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. Cleared via HBL transfer..." disabled={!selectedParchi} />
                                        </div>

                                        {isOverCleared && (
                                            <Alert variant="destructive" className="py-2">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription className="ml-2 font-medium text-xs">Cannot exceed ₨ {maxAllowedAmount.toLocaleString()}.</AlertDescription>
                                            </Alert>
                                        )}

                                        {selectedParchi && !isOverCleared && receiptAmount > 0 && (
                                            <div className="p-3 bg-emerald-50 rounded-md text-sm text-emerald-800 font-medium">
                                                Status update: {receiptAmount === maxAllowedAmount ? "Cleared" : "Partially Cleared"}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Amount (₨)</Label>
                                            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Enter details..." />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between pt-4 border-t border-slate-100">
                            {editingId ? (
                                <Button variant="destructive" onClick={handleDelete}>
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete Entry
                                </Button>
                            ) : <div />}
                            <Button onClick={handleSave} disabled={!isReadyToSave()} className="bg-blue-600 hover:bg-blue-700 min-w-[200px]">
                                <Save className="h-4 w-4 mr-2" />
                                {editingId ? "Update Entry" : "Record Entry"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* ── BOTTOM SECTION: CASHBOOK LEDGER ── */}
                <Card className="shadow-soft border-slate-100 bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-slate-200">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2">
                                    Daily Transaction Ledger
                                    <Badge variant="secondary">{filteredLedger.length} Entries</Badge>
                                </CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                    <Input placeholder="Search entries..." className="pl-9 w-[250px]" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <div className="bg-slate-50 border-y border-slate-100 px-6 py-2 flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-medium">Opening Balance:</span>
                            <span className="font-medium text-slate-900">₨ {openingBalance.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-medium">Closing Balance:</span>
                            <span className="font-semibold text-blue-600">₨ {closingBalance.toLocaleString()}</span>
                        </div>
                    </div>

                    <CardContent className="pt-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Voucher</TableHead>
                                    <TableHead>Page</TableHead>
                                    <TableHead>Account</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Mode</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Received (+)</TableHead>
                                    <TableHead className="text-right">Payment (-)</TableHead>
                                    <TableHead className="text-right">Balance</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLedger.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell className="text-slate-500">{row.date.slice(5)}</TableCell>
                                        <TableCell className="font-medium text-slate-700">{row.id}</TableCell>
                                        <TableCell className="text-slate-500">{row.pageNo}</TableCell>
                                        <TableCell className="font-medium">{row.account}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={row.voucherType === "CRV" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : row.voucherType === "CPV" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-slate-50 text-slate-600 border-slate-200"}>
                                                {row.voucherType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-600">{row.mode}</TableCell>
                                        <TableCell className="text-slate-600">{row.desc}</TableCell>
                                        <TableCell className="text-right font-medium text-emerald-600">
                                            {row.debit > 0 ? `+${row.debit.toLocaleString()}` : "-"}
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-rose-600">
                                            {row.credit > 0 ? `-${row.credit.toLocaleString()}` : "-"}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-slate-900">
                                            {row.balance.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm" onClick={() => {
                                                setEditingId(row.id);
                                                setAmount(row.debit > 0 ? row.debit.toString() : row.credit.toString());

                                                setParty(row.account);
                                                setActionType(row.voucherType === "CRV" ? "CRV" : "CPV");
                                                setDate(row.date);
                                                setPageNo(row.pageNo || "1");
                                                const restoredMode = row.mode === "Clear Parchi" ? "Clear Parchi" : "Cash";
                                                setClearanceMode(restoredMode);

                                                if (restoredMode === "Clear Parchi") {
                                                    const match = row.desc.match(/\[(P-\d+)\]|Cleared against (P-\d+)/);
                                                    const pId = match ? (match[1] || match[2]) : "";
                                                    setSelectedParchiId(pId);

                                                    if (match && match[1]) {
                                                        setDesc(row.desc.replace(` [${pId}]`, ''));
                                                    } else {
                                                        setDesc("");
                                                    }
                                                } else {
                                                    setDesc(row.desc);
                                                    setSelectedParchiId("");
                                                }
                                            }}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredLedger.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={11} className="h-24 text-center text-slate-500">
                                            No transactions found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

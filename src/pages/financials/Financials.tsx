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

function BalanceCard({ label, value, icon: Icon, accent }: { label: string; value: string; icon: any; accent: "emerald" | "blue" | "slate" }) {
    const colors = {
        emerald: { bg: "from-emerald-50 via-white to-white", icon: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-400" },
        blue: { bg: "from-blue-50 via-white to-white", icon: "bg-blue-100 text-blue-700", bar: "bg-blue-400" },
        slate: { bg: "from-slate-50 via-white to-white", icon: "bg-slate-100 text-slate-700", bar: "bg-slate-400" },
    }[accent];

    return (
        <div className={`relative overflow-hidden rounded-2xl p-4 flex items-center gap-4 bg-gradient-to-br ${colors.bg} border border-white/60 flex-1 min-w-[240px]`}
            style={{ boxShadow: "0 2px 0 0 rgba(0,0,0,0.05), 0 8px 24px -4px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)" }}>
            <div className={`p-3 rounded-xl ${colors.icon} shadow-sm`} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.5)" }}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</p>
                <div className="font-bold text-xl tracking-tight text-slate-900 leading-none mt-1">{value}</div>
            </div>
        </div>
    );
}

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
    
    // Calculate the true max allowed amount, accounting for the old amount if editing
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
        // When editing an existing parchi-mode entry, we don't require re-selecting
        // the parchi — just let the user update amount/desc freely.
        if (clearanceMode === "Clear Parchi") {
            if (editingId) return !isOverCleared && receiptAmount > 0;
            return !isOverCleared && selectedParchiId !== "";
        }
        return desc.trim() !== ""; // Cash mode requires desc
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

        const oldRow = ledgerData.find(r => r.id === editingId);
        if (oldRow && clearanceMode === "Clear Parchi" && selectedParchiId) {
            const oldAmount = oldRow.debit > 0 ? oldRow.debit : oldRow.credit;
            
            setParchiData(prev => prev.map(p => {
                if (p.parchi_id === selectedParchiId) {
                    const newCleared = p.cleared_amount - oldAmount;
                    const newAvail = p.total_amount - newCleared;
                    return { ...p, cleared_amount: newCleared, available_balance: newAvail, status: newAvail === 0 ? "Cleared" : (newCleared === 0 ? "Pending" : "Partially Cleared") };
                }
                return p;
            }));
        }

        setLedgerData(prev => recalculateBalances(prev.filter(r => r.id !== editingId)));
        setEditingId(null);
        setAmount(""); setDesc(""); setSelectedParchiId(""); setParty("");
        setClearanceMode("Cash");
        setActionType("CRV");
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 max-w-7xl mx-auto">
                {/* ── HEADER ── */}
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Financials</p>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Unified Cashbook</h1>
                        <p className="text-slate-500 mt-1 text-sm">Integrated Cash, Bank, and Hwala Commitments</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                        <BalanceCard label="Cash in Hand" value={`₨ ${currentBalance.toLocaleString()}`} icon={Wallet} accent="emerald" />
                        <BalanceCard label="Bank Balance" value="₨ 145,200" icon={History} accent="blue" />
                        <BalanceCard label="Parchi Liability" value={`₨ ${parchiData.reduce((acc, curr) => acc + curr.available_balance, 0).toLocaleString()}`} icon={FileText} accent="slate" />
                    </div>
                </div>

                {/* ── ENTRY FORM CARD ── */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                    style={{ boxShadow: "0 1px 0 0 rgba(0,0,0,0.04), 0 4px 16px -2px rgba(0,0,0,0.07)" }}>
                    <div className="bg-slate-50/50 border-b border-slate-100 p-5 px-6">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center">
                            <ArrowRightLeft className="mr-2 h-5 w-5 text-blue-600" />
                            New Entry Form
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Date</Label>
                                        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-white border-slate-200 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Page No.</Label>
                                        <Input value={pageNo} onChange={(e) => setPageNo(e.target.value)} className="bg-white border-slate-200 rounded-xl" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Action Type</Label>
                                    <div className="flex bg-slate-100 p-1 rounded-xl">
                                        <button 
                                            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-bold transition-colors ${actionType === "CRV" ? "bg-white shadow-sm text-emerald-700 border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
                                            onClick={() => { setActionType("CRV"); setClearanceMode("Cash"); setSelectedParchiId(""); }}
                                        >
                                            CRV (Receipt)
                                        </button>
                                        <button 
                                            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-bold transition-colors ${actionType === "CPV" ? "bg-white shadow-sm text-rose-700 border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
                                            onClick={() => { setActionType("CPV"); setClearanceMode("Cash"); setSelectedParchiId(""); }}
                                        >
                                            CPV (Payment)
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 flex flex-col">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Account / Party</Label>
                                    <Popover open={accountOpen} onOpenChange={setAccountOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" aria-expanded={accountOpen} className="w-full justify-between bg-white border-slate-200 rounded-xl font-normal h-10" ref={accountBtnRef}>
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
                                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Payment Mode</Label>
                                    <div className="flex bg-slate-100 p-1 rounded-xl">
                                        <button 
                                            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-colors ${clearanceMode === "Cash" ? "bg-white shadow-sm text-slate-900 border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
                                            onClick={() => { setClearanceMode("Cash"); setSelectedParchiId(""); }}
                                        >
                                            Direct Cash / Bank
                                        </button>
                                        {actionType === "CRV" && (
                                            <button 
                                                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-colors ${clearanceMode === "Clear Parchi" ? "bg-blue-50 shadow-sm text-blue-800 border border-blue-200" : "text-slate-500 hover:text-slate-700"}`}
                                                onClick={() => setClearanceMode("Clear Parchi")}
                                            >
                                                Clear Pending Parchi
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50/80 p-6 rounded-xl border border-slate-200 h-full flex flex-col justify-center">
                                {clearanceMode === "Clear Parchi" ? (
                                    <div className="space-y-5 animate-in fade-in">
                                        <div className="space-y-2">
                                            <Label className="text-blue-900 font-bold">Select Parchi to Clear</Label>
                                            <Select value={selectedParchiId} onValueChange={setSelectedParchiId} disabled={!party}>
                                                <SelectTrigger className="border-blue-300 shadow-sm rounded-xl h-10">
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
                                                <div className="bg-white p-3 rounded-xl border border-slate-100">
                                                    <Label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Parchi Total</Label>
                                                    <div className="font-mono text-slate-700 text-sm mt-1">₨ {selectedParchi.total_amount.toLocaleString()}</div>
                                                </div>
                                                <div className="bg-white p-3 rounded-xl border border-blue-100">
                                                    <Label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Available Bal.</Label>
                                                    <div className="font-mono font-bold text-blue-700 text-sm mt-1">₨ {selectedParchi.available_balance.toLocaleString()}</div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-2 mt-4">
                                            <Label className={`${isOverCleared ? "text-red-600" : "text-slate-700"} font-bold`}>Clearance Amount</Label>
                                            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} 
                                                className={`font-mono text-xl h-12 rounded-xl ${isOverCleared ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300"}`}
                                                placeholder="0.00" disabled={!selectedParchi} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Description</Label>
                                            <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. Cleared via HBL transfer..." className="border-slate-300 h-11 rounded-xl" disabled={!selectedParchi} />
                                        </div>

                                        {isOverCleared && (
                                            <Alert variant="destructive" className="py-2 border-red-200 bg-red-50">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription className="ml-2 font-medium text-xs">Cannot exceed ₨ {maxAllowedAmount.toLocaleString()}.</AlertDescription>
                                            </Alert>
                                        )}

                                        {selectedParchi && !isOverCleared && receiptAmount > 0 && (
                                            <div className="p-3 bg-emerald-50 rounded-xl text-sm text-emerald-800 font-medium flex justify-between border border-emerald-100">
                                                Status update: <span className="font-bold">{receiptAmount === maxAllowedAmount ? "Cleared" : "Partially Cleared"}</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-5 animate-in fade-in">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Amount (₨)</Label>
                                            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="font-mono text-2xl font-bold border-slate-300 h-14 rounded-xl" placeholder="0.00" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Description</Label>
                                            <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Enter details..." className="border-slate-300 h-12 rounded-xl" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between pt-4 border-t border-slate-100">
                            {editingId ? (
                                <Button variant="destructive" onClick={handleDelete} className="rounded-xl">
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete Entry
                                </Button>
                            ) : <div />}
                            <Button size="lg" onClick={handleSave} disabled={!isReadyToSave()} 
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white min-w-[200px] rounded-xl shadow-md"
                                style={{ boxShadow: "0 4px 12px rgba(37,99,235,0.30)" }}>
                                <Save className="h-4 w-4 mr-2" />
                                {editingId ? "Update Entry" : "Record Entry"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ── BOTTOM SECTION: CASHBOOK LEDGER ── */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                    style={{ boxShadow: "0 1px 0 0 rgba(0,0,0,0.04), 0 4px 16px -2px rgba(0,0,0,0.07)" }}>
                    <div className="bg-slate-50/50 p-5 px-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <h3 className="font-bold text-slate-900 text-base">Daily Transaction Ledger</h3>
                            <Badge variant="outline" className="bg-white shadow-sm rounded-lg">{filteredLedger.length} Entries</Badge>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input placeholder="Search entries..." className="pl-9 w-[250px] bg-white border-slate-200 rounded-xl h-9 text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                    </div>
                    
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex justify-between items-center text-sm shadow-inner">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Opening Balance</span>
                            <span className="font-mono font-bold text-slate-800 text-base">₨ {openingBalance.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Closing Balance</span>
                            <span className="font-mono font-black text-blue-700 text-lg">₨ {closingBalance.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-white hover:bg-white border-b-slate-200">
                                <TableHead className="w-[80px] font-semibold text-xs uppercase tracking-widest text-slate-500">Date</TableHead>
                                <TableHead className="w-[90px] font-semibold text-xs uppercase tracking-widest text-slate-500">Voucher</TableHead>
                                <TableHead className="w-[70px] font-semibold text-xs uppercase tracking-widest text-slate-500">Page</TableHead>
                                <TableHead className="font-semibold text-xs uppercase tracking-widest text-slate-500">Account</TableHead>
                                <TableHead className="font-semibold text-xs uppercase tracking-widest text-slate-500">Type</TableHead>
                                <TableHead className="font-semibold text-xs uppercase tracking-widest text-slate-500">Mode</TableHead>
                                <TableHead className="font-semibold text-xs uppercase tracking-widest text-slate-500">Description</TableHead>
                                <TableHead className="text-right font-semibold text-xs uppercase tracking-widest text-emerald-600">Received (+)</TableHead>
                                <TableHead className="text-right font-semibold text-xs uppercase tracking-widest text-rose-600">Payment (-)</TableHead>
                                <TableHead className="text-right font-semibold text-xs uppercase tracking-widest text-blue-800">Balance</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLedger.map((row) => (
                                <TableRow key={row.id} className="hover:bg-slate-50/80 transition-colors">
                                    <TableCell className="text-xs text-slate-500 font-mono">{row.date.slice(5)}</TableCell>
                                    <TableCell className="font-mono text-xs font-bold text-slate-700">{row.id}</TableCell>
                                    <TableCell className="font-mono text-xs text-slate-500 text-center">{row.pageNo}</TableCell>
                                    <TableCell className="font-bold text-slate-900 text-sm">{row.account}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`text-[10px] shadow-sm ${row.voucherType === "CRV" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : row.voucherType === "CPV" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                                            {row.voucherType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-600 text-xs font-medium">{row.mode}</TableCell>
                                    <TableCell className="text-slate-600 text-sm">{row.desc}</TableCell>
                                    <TableCell className="text-right font-mono font-bold text-emerald-600">
                                        {row.debit > 0 ? `+${row.debit.toLocaleString()}` : "-"}
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-bold text-rose-600">
                                        {row.credit > 0 ? `-${row.credit.toLocaleString()}` : "-"}
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-black text-slate-900 bg-slate-50/50">
                                        {row.balance.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" onClick={() => {
                                            setEditingId(row.id);
                                            setAmount(row.debit > 0 ? row.debit.toString() : row.credit.toString());
                                            
                                            setParty(row.account);
                                            setActionType(row.voucherType === "CRV" ? "CRV" : "CPV");
                                            setDate(row.date);
                                            setPageNo(row.pageNo || "1");
                                            // Restore payment mode so the form renders correctly
                                            const restoredMode = row.mode === "Clear Parchi" ? "Clear Parchi" : "Cash";
                                            setClearanceMode(restoredMode);
                                            
                                            if (restoredMode === "Clear Parchi") {
                                                const match = row.desc.match(/\[(P-\d+)\]|Cleared against (P-\d+)/);
                                                const pId = match ? (match[1] || match[2]) : "";
                                                setSelectedParchiId(pId);
                                                
                                                // Extract the actual description without the parchi ID
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
                </div>
            </div>
        </DashboardLayout>
    );
}

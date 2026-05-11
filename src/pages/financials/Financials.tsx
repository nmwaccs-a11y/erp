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
import { Check, ChevronsUpDown, ArrowUpRight, ArrowDownRight, Wallet, History, FileText, Save, AlertCircle, ArrowRightLeft, Search, Edit, Trash2 } from "lucide-react";
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

export default function Financials() {
    // --- LEDGER STATE ---
    const [ledgerData, setLedgerData] = useState(INITIAL_LEDGER);
    const [parchiData, setParchiData] = useState(MOCK_PARCHI_COMMITMENTS);
    const currentBalance = ledgerData.length > 0 ? ledgerData[ledgerData.length - 1].balance : 0;

    // --- FORM STATE ---
    const accountBtnRef = useRef<HTMLButtonElement>(null);
    const [accountOpen, setAccountOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [voucherId, setVoucherId] = useState(`V-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [pageNo, setPageNo] = useState("1");
    const [actionType, setActionType] = useState("CRV"); // "CRV" | "CPV" | "ISSUE_PARCHI"
    const [clearanceMode, setClearanceMode] = useState("Cash"); // "Cash" | "Clear Parchi"
    const [party, setParty] = useState("");
    const [amount, setAmount] = useState("");
    const [desc, setDesc] = useState("");
    
    // Search State
    const [searchQuery, setSearchQuery] = useState("");
    
    // Parchi Specific
    const [selectedParchiId, setSelectedParchiId] = useState("");
    const [parchiDueDate, setParchiDueDate] = useState("");

    // --- COMPUTED / DERIVED ---
    const selectedParchi = useMemo(() => {
        return parchiData.find(p => p.parchi_id === selectedParchiId);
    }, [selectedParchiId, parchiData]);

    const pageEntries = useMemo(() => {
        return ledgerData.filter(r => r.date === date && r.pageNo === pageNo);
    }, [ledgerData, date, pageNo]);

    const filteredLedger = useMemo(() => {
        return pageEntries.filter(row => 
            searchQuery === "" ||
            row.account.toLowerCase().includes(searchQuery.toLowerCase()) || 
            row.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [pageEntries, searchQuery]);

    const { openingBalance, closingBalance } = useMemo(() => {
        let opening = 0;
        if (pageEntries.length > 0) {
            const firstIdx = ledgerData.findIndex(r => r.id === pageEntries[0].id);
            if (firstIdx > 0) {
                opening = ledgerData[firstIdx - 1].balance;
            }
        } else {
            opening = ledgerData.length > 0 ? ledgerData[ledgerData.length - 1].balance : 0;
        }
        
        let closing = opening;
        if (pageEntries.length > 0) {
            closing = pageEntries[pageEntries.length - 1].balance;
        }
        return { openingBalance: opening, closingBalance: closing };
    }, [ledgerData, pageEntries]);

    const receiptAmount = Number(amount) || 0;
    const isOverCleared = clearanceMode === "Clear Parchi" && selectedParchi && receiptAmount > selectedParchi.available_balance;
    
    const isReadyToSave = () => {
        if (!party || receiptAmount <= 0) return false;
        if (actionType === "ISSUE_PARCHI" && !parchiDueDate) return false;
        if (clearanceMode === "Clear Parchi") {
            return !isOverCleared && selectedParchiId !== "";
        }
        return desc.trim() !== ""; // Cash mode requires desc
    };

    // --- HANDLERS ---
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
            desc: actionType === "ISSUE_PARCHI" ? `Issued Parchi Due: ${parchiDueDate}` : (clearanceMode === "Clear Parchi" ? `Cleared against ${selectedParchiId}` : desc),
            debit: newDebit,
            credit: newCredit,
            balance: 0 // Will be recalculated
        };

        // Update Ledger
        if (editingId) {
            setLedgerData(prev => recalculateBalances(prev.map(r => r.id === editingId ? newLedgerEntry : r)));
            setEditingId(null);
        } else {
            setLedgerData(prev => recalculateBalances([...prev, newLedgerEntry]));
            setVoucherId(`V-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
        }

        // Update Parchi Status if clearing
        if (clearanceMode === "Clear Parchi" && selectedParchi) {
            setParchiData(prev => prev.map(p => {
                if (p.parchi_id === selectedParchiId) {
                    const newCleared = p.cleared_amount + receiptAmount;
                    const newAvail = p.total_amount - newCleared;
                    return {
                        ...p,
                        cleared_amount: newCleared,
                        available_balance: newAvail,
                        status: newAvail === 0 ? "Cleared" : "Partially Cleared"
                    };
                }
                return p;
            }));
        }

        // If issuing parchi, add to parchi array
        if (actionType === "ISSUE_PARCHI") {
            const newParchi = {
                parchi_id: `P-${Math.floor(Math.random() * 1000)}`,
                party_id: party,
                party_name: party, // Simplified
                total_amount: receiptAmount,
                cleared_amount: 0,
                available_balance: receiptAmount,
                status: "Pending"
            };
            setParchiData(prev => [...prev, newParchi]);
        }

        // Reset
        setAmount("");
        setDesc("");
        setSelectedParchiId("");
        setParty("");
        
        // Auto-focus back to account selection
        setTimeout(() => {
            accountBtnRef.current?.focus();
        }, 0);
    };

    const handleDelete = () => {
        if (!editingId) return;
        setLedgerData(prev => recalculateBalances(prev.filter(r => r.id !== editingId)));
        setEditingId(null);
        // Reset form
        setAmount("");
        setDesc("");
        setSelectedParchiId("");
        setParty("");
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-7xl mx-auto">
                {/* HEADER SECTION */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Unified Cashbook</h1>
                        <p className="text-slate-500">Integrated Cash, Bank, and Hwala Commitments</p>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 shadow-sm">
                            <Wallet className="h-5 w-5 text-emerald-600" />
                            <div>
                                <p className="text-xs text-emerald-800 font-medium">Cash in Hand</p>
                                <p className="text-lg font-bold text-slate-900">₨ {currentBalance.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 shadow-sm">
                            <History className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-xs text-blue-800 font-medium">Bank Balance</p>
                                <p className="text-lg font-bold text-slate-900">₨ 145,200</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                            <FileText className="h-5 w-5 text-slate-600" />
                            <div>
                                <p className="text-xs text-slate-800 font-medium">Parchi Liability</p>
                                <p className="text-lg font-bold text-slate-900">₨ {parchiData.reduce((acc, curr) => acc + curr.available_balance, 0).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ENTRY FORM CARD */}
                <Card className="shadow-md border-blue-100 bg-white">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg flex items-center">
                            <ArrowRightLeft className="mr-2 h-5 w-5 text-blue-600" />
                            New Entry Form
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        {/* Action Toggles */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-500 font-semibold">Date</Label>
                                        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-white border-slate-300" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-500 font-semibold">Page No.</Label>
                                        <Input value={pageNo} onChange={(e) => setPageNo(e.target.value)} className="bg-white border-slate-300" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-500 font-semibold">Action Type</Label>
                                    <div className="flex bg-slate-100 p-1 rounded-lg">
                                        <button 
                                            className={`flex-1 py-2 px-3 rounded-md text-sm font-bold transition-colors ${actionType === "CRV" ? "bg-white shadow-sm text-emerald-700 border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
                                            onClick={() => { setActionType("CRV"); setClearanceMode("Cash"); setSelectedParchiId(""); }}
                                        >
                                            CRV (Receipt)
                                        </button>
                                        <button 
                                            className={`flex-1 py-2 px-3 rounded-md text-sm font-bold transition-colors ${actionType === "CPV" ? "bg-white shadow-sm text-rose-700 border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
                                            onClick={() => { setActionType("CPV"); setClearanceMode("Cash"); setSelectedParchiId(""); }}
                                        >
                                            CPV (Payment)
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 flex flex-col">
                                    <Label className="text-slate-500 font-semibold">Account / Party</Label>
                                    <Popover open={accountOpen} onOpenChange={setAccountOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={accountOpen}
                                                className="w-full justify-between bg-white border-slate-300 font-normal"
                                                ref={accountBtnRef}
                                            >
                                                {party
                                                    ? COA_ACCOUNTS.find((acc) => acc.name === party)?.name
                                                    : "Search account..."}
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
                                                            <CommandItem
                                                                key={acc.id}
                                                                value={`${acc.id} ${acc.name}`}
                                                                onSelect={() => {
                                                                    setParty(acc.name);
                                                                    setSelectedParchiId("");
                                                                    setAccountOpen(false);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={`mr-2 h-4 w-4 ${party === acc.name ? "opacity-100" : "opacity-0"}`}
                                                                />
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
                                    <Label className="text-slate-500 font-semibold">Payment Mode</Label>
                                    <div className="flex bg-slate-100 p-1 rounded-lg">
                                        <button 
                                            className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-colors ${clearanceMode === "Cash" ? "bg-white shadow-sm text-slate-900 border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
                                            onClick={() => { setClearanceMode("Cash"); setSelectedParchiId(""); }}
                                        >
                                            Direct Cash / Bank
                                        </button>
                                        {actionType === "CRV" && (
                                            <button 
                                                className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-colors ${clearanceMode === "Clear Parchi" ? "bg-blue-50 shadow-sm text-blue-800 border border-blue-200" : "text-slate-500 hover:text-slate-700"}`}
                                                onClick={() => setClearanceMode("Clear Parchi")}
                                            >
                                                Clear Pending Parchi
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Dynamic Form Engine */}
                            <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200">
                                {clearanceMode === "Clear Parchi" ? (
                                    // CLEAR PARCHI MODE
                                    <div className="space-y-4 animate-in fade-in">
                                        <div className="space-y-2">
                                            <Label className="text-blue-900 font-bold">Select Parchi to Clear</Label>
                                            <Select value={selectedParchiId} onValueChange={setSelectedParchiId} disabled={!party}>
                                                <SelectTrigger className="border-blue-300 shadow-sm">
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
                                            <div className="grid grid-cols-2 gap-4 mt-2">
                                                <div>
                                                    <Label className="text-xs text-slate-500">Parchi Total</Label>
                                                    <div className="font-mono text-slate-700">₨ {selectedParchi.total_amount.toLocaleString()}</div>
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-slate-500">Available Bal.</Label>
                                                    <div className="font-mono font-bold text-blue-700">₨ {selectedParchi.available_balance.toLocaleString()}</div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-2 mt-4">
                                            <Label className={`${isOverCleared ? "text-red-600" : "text-slate-700"}`}>Clearance Amount</Label>
                                            <Input 
                                                type="number" 
                                                value={amount} 
                                                onChange={(e) => setAmount(e.target.value)} 
                                                className={`font-mono text-lg ${isOverCleared ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                                placeholder="0.00" 
                                                disabled={!selectedParchi}
                                            />
                                        </div>

                                        {isOverCleared && (
                                            <Alert variant="destructive" className="mt-2 py-2">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription className="ml-2 font-medium text-xs">
                                                    Cannot exceed ₨ {selectedParchi?.available_balance.toLocaleString()}.
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        {selectedParchi && !isOverCleared && receiptAmount > 0 && (
                                            <div className="p-2 bg-emerald-50 rounded text-sm text-emerald-800 font-medium flex justify-between">
                                                Status update:
                                                <span className="font-bold">
                                                    {receiptAmount === selectedParchi.available_balance ? "Cleared" : "Partially Cleared"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // STANDARD CASH/BANK MODE
                                    <div className="space-y-4 animate-in fade-in">
                                        <div className="space-y-2">
                                            <Label>Amount (₨)</Label>
                                            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="font-mono text-xl font-bold border-slate-300" placeholder="0.00" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Enter details..." className="border-slate-300" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-between pt-4 border-t border-slate-100">
                            {editingId ? (
                                <Button variant="destructive" onClick={handleDelete}>
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete Entry
                                </Button>
                            ) : (
                                <div></div> /* Spacer */
                            )}
                            <Button 
                                size="lg" 
                                onClick={handleSave} 
                                disabled={!isReadyToSave()} 
                                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px]"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {editingId ? "Update Entry" : "Record Entry"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* BOTTOM SECTION: CASHBOOK LEDGER */}
                {/* BOTTOM SECTION: CASHBOOK LEDGER */}
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="bg-slate-50/50 pb-3 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <CardTitle className="text-lg">Daily Transaction Ledger (Cashbook)</CardTitle>
                            <Badge variant="outline" className="bg-white">{filteredLedger.length} Entries</Badge>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                <Input 
                                    placeholder="Search entries..." 
                                    className="pl-9 w-[250px] bg-white" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <div className="bg-white border-b border-slate-100 px-6 py-3 flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-medium">Opening Balance:</span>
                            <span className="font-mono font-bold text-slate-900">₨ {openingBalance.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-medium">Closing Balance:</span>
                            <span className="font-mono font-bold text-blue-700 text-base">₨ {closingBalance.toLocaleString()}</span>
                        </div>
                    </div>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                    <TableHead className="w-[80px] font-semibold">Date</TableHead>
                                    <TableHead className="w-[90px] font-semibold">Voucher</TableHead>
                                    <TableHead className="w-[70px] font-semibold">Page</TableHead>
                                    <TableHead className="font-semibold">Account</TableHead>
                                    <TableHead className="font-semibold">Type</TableHead>
                                    <TableHead className="font-semibold">Mode</TableHead>
                                    <TableHead className="font-semibold">Description</TableHead>
                                    <TableHead className="text-right font-semibold text-emerald-700">Received (+)</TableHead>
                                    <TableHead className="text-right font-semibold text-rose-700">Payment (-)</TableHead>
                                    <TableHead className="text-right font-semibold text-blue-900">Balance</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLedger.map((row) => (
                                    <TableRow key={row.id} className="hover:bg-slate-50">
                                        <TableCell className="text-xs text-slate-500">{row.date}</TableCell>
                                        <TableCell className="font-mono text-xs text-slate-500">{row.id}</TableCell>
                                        <TableCell className="font-mono text-xs text-slate-500">{row.pageNo}</TableCell>
                                        <TableCell className="font-medium text-slate-900">{row.account}</TableCell>
                                        <TableCell>
                                            <Badge variant={row.voucherType === "CRV" ? "default" : row.voucherType === "CPV" ? "destructive" : "secondary"} 
                                                className={row.voucherType === "CRV" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" : row.voucherType === "CPV" ? "bg-rose-100 text-rose-800 hover:bg-rose-100" : ""}>
                                                {row.voucherType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-600 text-sm">{row.mode}</TableCell>
                                        <TableCell className="text-slate-600">{row.desc}</TableCell>
                                        <TableCell className="text-right font-mono font-medium text-emerald-700">
                                            {row.debit > 0 ? `+${row.debit.toLocaleString()}` : "-"}
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-medium text-rose-700">
                                            {row.credit > 0 ? `-${row.credit.toLocaleString()}` : "-"}
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-bold text-slate-900 bg-slate-50/50">
                                            {row.balance.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => {
                                                setEditingId(row.id);
                                                setAmount(row.debit > 0 ? row.debit.toString() : row.credit.toString());
                                                setDesc(row.desc);
                                                setParty(row.account);
                                                setActionType(row.voucherType === "CRV" ? "CRV" : "CPV");
                                                setDate(row.date);
                                                setPageNo(row.pageNo || "1");
                                            }}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

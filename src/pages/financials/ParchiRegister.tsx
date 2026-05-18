import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Search, Edit, Trash2, CheckCircle, AlertCircle, ReceiptText } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

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

const INITIAL_PARCHIS = [
    { id: "PAR-26-105", parchi_type: "Company Parchi", date: "2026-05-01", due_date: "2026-05-15", party: "Alpha Cables (Customer)", total_amount: 500000, cleared_amount: 200000, available_balance: 300000, status: "Pending" },
    { id: "PAR-26-106", parchi_type: "Bank Cheque", cheque_no: "992831", bank: "Meezan Bank", date: "2026-05-02", due_date: "2026-05-20", party: "Alpha Cables (Customer)", total_amount: 100000, cleared_amount: 0, available_balance: 100000, status: "Pending" },
    { id: "PAR-26-201", parchi_type: "Company Parchi", date: "2026-04-10", due_date: "2026-04-30", party: "Gamma Scrap (Vendor)", total_amount: 750000, cleared_amount: 500000, available_balance: 250000, status: "Partially Cleared" },
    { id: "PAR-26-099", parchi_type: "Company Parchi", date: "2026-03-01", due_date: "2026-03-15", party: "Gateway Motors (Customer)", total_amount: 300000, cleared_amount: 300000, available_balance: 0, status: "Cleared" },
];

export default function ParchiRegister() {
    const [parchis, setParchis] = useState(INITIAL_PARCHIS);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingParchi, setEditingParchi] = useState<any>(null);

    // Form States
    const [party, setParty] = useState("");
    const [amount, setAmount] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [direction, setDirection] = useState<"Received" | "Issued">("Received");
    const [guarantor, setGuarantor] = useState("");
    const [narration, setNarration] = useState("");
    const [bank, setBank] = useState("");
    const [parchiType, setParchiType] = useState<"Company Parchi" | "Bank Cheque">("Company Parchi");
    const [chequeNo, setChequeNo] = useState("");

    const filteredParchis = parchis.filter(p => 
        p.party.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalLiability = parchis.reduce((acc, curr) => acc + curr.available_balance, 0);
    const pendingCount = parchis.filter(p => p.status !== "Cleared").length;

    const handleOpenAdd = () => {
        setEditingParchi(null);
        setParty("");
        setAmount("");
        setDueDate("");
        setDate(new Date().toISOString().split('T')[0]);
        setDirection("Received");
        setGuarantor("");
        setNarration("");
        setBank("");
        setParchiType("Company Parchi");
        setChequeNo("");
        setIsModalOpen(true);
    };

    const handleOpenEdit = (p: any) => {
        setEditingParchi(p);
        setParty(p.party);
        setAmount(p.total_amount.toString());
        setDueDate(p.due_date);
        setDate(p.date);
        setDirection(p.direction || "Received");
        setGuarantor(p.guarantor || "");
        setNarration(p.narration || "");
        setBank(p.bank || "");
        setParchiType(p.parchi_type || "Company Parchi");
        setChequeNo(p.cheque_no || "");
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to void this Parchi?")) {
            setParchis(parchis.filter(p => p.id !== id));
        }
    };

    const handleSave = () => {
        if (editingParchi) {
            setParchis(parchis.map(p => {
                if (p.id === editingParchi.id) {
                    const numAmount = Number(amount);
                    const diff = numAmount - p.total_amount;
                    return {
                        ...p,
                        party,
                        date,
                        due_date: dueDate,
                        direction,
                        guarantor,
                        narration,
                        bank,
                        parchi_type: parchiType,
                        cheque_no: chequeNo,
                        total_amount: numAmount,
                        available_balance: p.available_balance + diff,
                    };
                }
                return p;
            }));
        } else {
            const numAmount = Number(amount);
            const newParchi = {
                id: `PAR-26-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
                date,
                due_date: dueDate,
                party,
                direction,
                guarantor,
                narration,
                bank,
                parchi_type: parchiType,
                cheque_no: chequeNo,
                total_amount: numAmount,
                cleared_amount: 0,
                available_balance: numAmount,
                status: "Pending"
            };
            setParchis([newParchi, ...parchis]);
        }
        setIsModalOpen(false);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Parchi Register</h1>
                        <p className="text-slate-500">Manage all Hwala commitments and informal slips.</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Pending Slips</p>
                                <p className="text-lg font-bold text-slate-900">{pendingCount}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 shadow-sm">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-xs text-blue-800 font-medium">Total Liability</p>
                                <p className="text-lg font-bold text-slate-900">₨ {totalLiability.toLocaleString()}</p>
                            </div>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm h-12" onClick={handleOpenAdd}>
                            <Plus className="h-4 w-4 mr-2" />
                            Issue Parchi
                        </Button>
                    </div>
                </div>

                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Commitment Ledger</CardTitle>
                                <CardDescription>All issued parchis and their clearance status.</CardDescription>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                <Input 
                                    placeholder="Search Party or ID..." 
                                    className="pl-9 w-[300px] bg-white" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 bg-slate-50/50">
                        {filteredParchis.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <ReceiptText className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                                <p>No parchis found.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredParchis.map((p) => (
                                    <div key={p.id} className="relative bg-white border border-slate-200 shadow-sm rounded-lg flex flex-col group transition-all hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 overflow-hidden">
                                        
                                        {/* Subtle dot pattern background */}
                                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />

                                        {/* Top section: The Header & Details */}
                                        <div className="p-5 flex flex-col gap-4 relative z-10 bg-[#fdfdfc]">
                                            {/* Header row */}
                                            <div className="flex justify-between items-start">
                                                <div className="flex flex-col gap-1">
                                                    <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                        {p.parchi_type}
                                                    </div>
                                                    <div className="text-lg font-mono font-bold text-slate-800 tracking-tight">{p.id}</div>
                                                    {p.parchi_type === "Bank Cheque" && <div className="text-[10px] font-mono font-bold tracking-wider text-blue-600 mt-1">CHQ: {p.cheque_no} • {p.bank}</div>}
                                                </div>
                                                {/* Status Stamp */}
                                                <div className={`px-2 py-1 rounded border-2 border-dashed transform rotate-[-8deg] text-xs font-black uppercase tracking-widest ${p.status === 'Cleared' ? 'text-emerald-600 border-emerald-600/30' : p.status === 'Pending' ? 'text-rose-600 border-rose-600/30' : 'text-blue-600 border-blue-600/30'}`}>
                                                    {p.status}
                                                </div>
                                            </div>

                                            {/* Body Info */}
                                            <div className="bg-white rounded-md border border-slate-100 p-3 shadow-sm space-y-3">
                                                <div>
                                                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Pay To / Receive From</div>
                                                    <div className="font-semibold text-slate-900 text-sm leading-none">{p.party}</div>
                                                </div>
                                                <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                                                    <div>
                                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Issue Date</div>
                                                        <div className="text-xs font-mono font-medium text-slate-600">{format(new Date(p.date), "dd MMM yyyy")}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Due Date</div>
                                                        <div className="text-xs font-mono font-bold text-rose-600">{format(new Date(p.due_date), "dd MMM yyyy")}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tear line with ticket holes */}
                                        <div className="relative h-4 w-full bg-[#fdfdfc]">
                                            <div className="absolute top-1/2 left-0 right-0 border-t-[1.5px] border-dashed border-slate-200"></div>
                                            {/* Left hole */}
                                            <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-50 border border-slate-200 shadow-inner"></div>
                                            {/* Right hole */}
                                            <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-50 border border-slate-200 shadow-inner"></div>
                                        </div>

                                        {/* Bottom Section: Financials (The Stub) */}
                                        <div className="p-5 flex flex-col gap-3 relative z-10 bg-white">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Cleared Amount</div>
                                                    <div className="text-sm font-mono font-medium text-slate-500">₨ {p.cleared_amount.toLocaleString()}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-0.5">Balance</div>
                                                    <div className="text-2xl font-mono font-black text-slate-900 tracking-tight leading-none">₨ {p.available_balance.toLocaleString()}</div>
                                                </div>
                                            </div>
                                            
                                            {/* Action Buttons & Barcode */}
                                            <div className="flex justify-between items-center mt-2 pt-3 border-t border-slate-100">
                                                {/* Fake Barcode lines */}
                                                <div className="flex gap-[2px] items-center h-5 opacity-20">
                                                    <div className="w-0.5 h-full bg-slate-900"></div>
                                                    <div className="w-1 h-full bg-slate-900"></div>
                                                    <div className="w-0.5 h-full bg-slate-900"></div>
                                                    <div className="w-[3px] h-full bg-slate-900"></div>
                                                    <div className="w-0.5 h-full bg-slate-900"></div>
                                                    <div className="w-1 h-full bg-slate-900"></div>
                                                    <div className="w-0.5 h-full bg-slate-900"></div>
                                                    <div className="w-1.5 h-full bg-slate-900"></div>
                                                    <div className="w-0.5 h-full bg-slate-900"></div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" className="h-7 px-2 text-[10px] font-semibold text-slate-500 hover:text-blue-600 border-slate-200" onClick={() => handleOpenEdit(p)}>
                                                        <Edit className="h-3 w-3 mr-1" /> Edit
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="h-7 px-2 text-[10px] font-semibold text-slate-500 hover:text-rose-600 border-slate-200" onClick={() => handleDelete(p.id)}>
                                                        <Trash2 className="h-3 w-3 mr-1" /> Void
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden">
                        <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <DialogTitle className="text-xl font-bold text-slate-800">{editingParchi ? "Edit Parchi" : "Issue New Parchi"}</DialogTitle>
                            <DialogDescription>
                                Enter the commitment details below.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-6 px-6 py-4 max-h-[75vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                            
                            {/* Top Section: Type & Direction */}
                            <div className="grid grid-cols-2 gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parchi Type</Label>
                                    <Select value={parchiType} onValueChange={(v: any) => setParchiType(v)}>
                                        <SelectTrigger className="bg-white shadow-sm border-slate-200"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Company Parchi">Company Parchi</SelectItem>
                                            <SelectItem value="Bank Cheque">Bank Cheque</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Direction</Label>
                                    <div className="grid grid-cols-2 gap-1 bg-slate-200/50 p-1 rounded-lg shadow-inner">
                                        <Button 
                                            type="button" size="sm"
                                            variant={direction === "Received" ? "default" : "ghost"} 
                                            className={direction === "Received" ? "bg-emerald-600 hover:bg-emerald-700 shadow-sm text-xs font-bold" : "hover:bg-slate-200 text-xs font-medium text-slate-600"}
                                            onClick={() => setDirection("Received")}
                                        >
                                            Received (In)
                                        </Button>
                                        <Button 
                                            type="button" size="sm"
                                            variant={direction === "Issued" ? "default" : "ghost"}
                                            className={direction === "Issued" ? "bg-blue-600 hover:bg-blue-700 shadow-sm text-xs font-bold" : "hover:bg-slate-200 text-xs font-medium text-slate-600"}
                                            onClick={() => setDirection("Issued")}
                                        >
                                            Issued (Out)
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* ID and Cheque Info */}
                            <div className="grid grid-cols-3 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parchi ID (Auto)</Label>
                                    <Input disabled value={editingParchi ? editingParchi.id : "Auto-Generated"} className="bg-slate-50 font-mono text-slate-400 border-dashed" />
                                </div>

                                {parchiType === "Bank Cheque" && (
                                    <>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-blue-600 uppercase tracking-wider">Cheque No.</Label>
                                            <Input placeholder="e.g. 838192" value={chequeNo} onChange={(e) => setChequeNo(e.target.value)} className="font-mono font-bold text-slate-700 border-blue-200 focus-visible:ring-blue-500 bg-blue-50/30" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-blue-600 uppercase tracking-wider">Bank Name</Label>
                                            <Input placeholder="e.g. Meezan Bank" value={bank} onChange={(e) => setBank(e.target.value)} className="border-blue-200 focus-visible:ring-blue-500 bg-blue-50/30 font-medium" />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="h-px bg-slate-100" />

                            {/* Parties */}
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Party Name</Label>
                                    <Select value={party} onValueChange={setParty}>
                                        <SelectTrigger className="shadow-sm">
                                            <SelectValue placeholder="Select party" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {COA_ACCOUNTS.filter(acc => acc.name.includes('(Customer)') || acc.name.includes('(Vendor)')).map(acc => (
                                                <SelectItem key={acc.id} value={acc.name}>
                                                    [{acc.id}] {acc.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Guarantor / Broker (Opt)</Label>
                                    <Select value={guarantor} onValueChange={setGuarantor}>
                                        <SelectTrigger className="shadow-sm"><SelectValue placeholder="Select Guarantor" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
                                            <SelectItem value="Broker A">Broker A</SelectItem>
                                            <SelectItem value="Broker B">Broker B</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Financial Details Box */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 bg-[#fffdf5] p-5 rounded-xl border border-[#e5e0d8] shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 bottom-0 w-1 bg-amber-500"></div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-amber-800 uppercase tracking-wider">Issue Date</Label>
                                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-white border-amber-200 focus-visible:ring-amber-500 shadow-sm" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-rose-700 uppercase tracking-wider">Maturity Date</Label>
                                    <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="bg-white border-rose-200 focus-visible:ring-rose-500 shadow-sm font-bold text-rose-700" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-blue-800 uppercase tracking-wider">Total Amount (₨)</Label>
                                    <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="font-mono font-black text-xl text-blue-900 border-blue-300 focus-visible:ring-blue-600 bg-white shadow-inner h-10" placeholder="0" />
                                </div>
                            </div>

                            {/* Attachments */}
                            <div className="grid grid-cols-2 gap-5 mb-2">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Narration / Ref.</Label>
                                    <Input placeholder="e.g., Against Wire No 8 Hwala delivery." value={narration} onChange={(e) => setNarration(e.target.value)} className="bg-slate-50" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parchi Image (Optional)</Label>
                                    <div className="flex items-center">
                                        <Input type="file" accept="image/*" className="cursor-pointer file:bg-slate-200 file:text-slate-700 file:font-semibold file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 file:hover:bg-slate-300 text-sm h-9 flex items-center bg-slate-50" />
                                    </div>
                                </div>
                            </div>

                        </div>
                        <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50">
                            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="font-medium">Cancel</Button>
                            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 font-bold shadow-md" disabled={!party || !amount || !dueDate}>
                                Save Parchi
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}

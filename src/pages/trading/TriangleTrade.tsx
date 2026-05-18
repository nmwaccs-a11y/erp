import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Replace, Search, Pencil, Filter, X } from "lucide-react";
import { useState, useMemo } from "react";
import { CreateTriangleTradeModal } from "@/components/sales/CreateTriangleTradeModal";
import { Badge } from "@/components/ui/badge";

const MOCK_TRADES = [
    {
        id: "SCRAP-2026-001",
        date: "2026-05-11",
        dateLabel: "May 11, 2026 — 10:00 AM",
        sourceId: "CUST-001",
        destinationId: "VEND-101",
        source: "Gateway Motors",
        destination: "Gamma Scrap Traders",
        biltyNo: "BL-1249",
        vehicleNo: "LEA-991",
        grossWeight: 1520,
        tareWeight: 20,
        netWeight: "1,500 kg",
        rateValue: 2400,
        rate: "2400 PKR/kg",
        amount: "3,600,000 PKR",
        status: "Recorded",
    },
    {
        id: "SCRAP-2026-002",
        date: "2026-05-10",
        dateLabel: "May 10, 2026 — 02:30 PM",
        sourceId: "CUST-002",
        destinationId: "VEND-102",
        source: "Alpha Wire Supply",
        destination: "Delta Copper",
        biltyNo: "BL-1250",
        vehicleNo: "KHI-221",
        grossWeight: 2050,
        tareWeight: 50,
        netWeight: "2,000 kg",
        rateValue: 2350,
        rate: "2350 PKR/kg",
        amount: "4,700,000 PKR",
        status: "Posted",
    },
    {
        id: "SCRAP-2026-003",
        date: "2026-05-09",
        dateLabel: "May 09, 2026 — 09:15 AM",
        sourceId: "CUST-001",
        destinationId: "VEND-102",
        source: "Gateway Motors",
        destination: "Delta Copper",
        biltyNo: "BL-1251",
        vehicleNo: "LHR-554",
        grossWeight: 800,
        tareWeight: 10,
        netWeight: "790 kg",
        rateValue: 2300,
        rate: "2300 PKR/kg",
        amount: "1,817,000 PKR",
        status: "Pending",
    },
];

const STATUS_COLORS: Record<string, string> = {
    Recorded: "bg-blue-50 text-blue-700 border-blue-300",
    Posted: "bg-emerald-50 text-emerald-700 border-emerald-300",
    Pending: "bg-amber-50 text-amber-700 border-amber-300",
};

export default function TriangleTrade() {
    const [createOpen, setCreateOpen] = useState(false);
    const [selectedTrade, setSelectedTrade] = useState<any>(null);
    const [trades, setTrades] = useState(MOCK_TRADES);

    // Filter/Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterSource, setFilterSource] = useState("all");
    const [filterDest, setFilterDest] = useState("all");

    const filteredTrades = useMemo(() => {
        return trades.filter(t => {
            const q = searchQuery.toLowerCase();
            const matchesSearch = !q || (
                t.id.toLowerCase().includes(q) ||
                t.source.toLowerCase().includes(q) ||
                t.destination.toLowerCase().includes(q) ||
                t.biltyNo.toLowerCase().includes(q) ||
                t.vehicleNo.toLowerCase().includes(q)
            );
            const matchesStatus = filterStatus === "all" || t.status === filterStatus;
            const matchesSource = filterSource === "all" || t.sourceId === filterSource;
            const matchesDest = filterDest === "all" || t.destinationId === filterDest;
            return matchesSearch && matchesStatus && matchesSource && matchesDest;
        });
    }, [trades, searchQuery, filterStatus, filterSource, filterDest]);

    const activeFiltersCount = [
        filterStatus !== "all",
        filterSource !== "all",
        filterDest !== "all",
        searchQuery !== "",
    ].filter(Boolean).length;

    const handleEdit = (trade: any) => {
        setSelectedTrade(trade);
        setCreateOpen(true);
    };

    const handleSave = (updatedData: any) => {
        setTrades(prev =>
            prev.map(t => t.id === updatedData.id
                ? {
                    ...t, ...updatedData,
                    netWeight: `${updatedData.netWeight} kg`,
                    rate: `${updatedData.rateValue} PKR/kg`,
                }
                : t
            )
        );
    };

    const handleCreateNew = () => {
        setSelectedTrade(null);
        setCreateOpen(true);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setFilterStatus("all");
        setFilterSource("all");
        setFilterDest("all");
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Scrap</h1>
                        <p className="text-slate-500 mt-1">Manage toll-drop scrap transfers between customers and vendors.</p>
                    </div>
                    <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700 shadow-md">
                        <Plus className="h-4 w-4 mr-2" /> New Scrap Trade
                    </Button>
                </div>

                {/* Search & Filters Bar */}
                <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search by ID, party, bilty no, vehicle..."
                            className="pl-9 h-10 bg-slate-50"
                        />
                    </div>

                    {/* Status Filter */}
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[150px] h-10 bg-slate-50">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Recorded">Recorded</SelectItem>
                            <SelectItem value="Posted">Posted</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Source Filter */}
                    <Select value={filterSource} onValueChange={setFilterSource}>
                        <SelectTrigger className="w-[170px] h-10 bg-slate-50">
                            <SelectValue placeholder="Source" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sources</SelectItem>
                            <SelectItem value="CUST-001">Gateway Motors</SelectItem>
                            <SelectItem value="CUST-002">Alpha Wire Supply</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Destination Filter */}
                    <Select value={filterDest} onValueChange={setFilterDest}>
                        <SelectTrigger className="w-[170px] h-10 bg-slate-50">
                            <SelectValue placeholder="Destination" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Destinations</SelectItem>
                            <SelectItem value="VEND-101">Gamma Scrap Traders</SelectItem>
                            <SelectItem value="VEND-102">Delta Copper</SelectItem>
                        </SelectContent>
                    </Select>

                    {activeFiltersCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10 text-slate-500 hover:text-rose-600">
                            <X className="h-4 w-4 mr-1" /> Clear ({activeFiltersCount})
                        </Button>
                    )}
                </div>

                {/* Results Count */}
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Filter className="h-4 w-4" />
                    Showing <span className="font-bold text-slate-700">{filteredTrades.length}</span> of {trades.length} trades
                    {activeFiltersCount > 0 && <span className="text-blue-600 font-medium">({activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} active)</span>}
                </div>

                {/* Cards Grid */}
                {filteredTrades.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white border border-dashed border-slate-200 rounded-xl">
                        <Search className="h-10 w-10 mb-3 opacity-40" />
                        <p className="font-semibold text-slate-500">No trades match your filters</p>
                        <p className="text-sm mt-1">Try adjusting your search or clearing filters</p>
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-4 text-blue-600">Clear all filters</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredTrades.map((trade) => (
                            <Card key={trade.id} className="shadow-soft border-slate-100 flex flex-col hover:border-blue-200 transition-colors">
                                <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="font-mono text-base text-blue-700">{trade.id}</CardTitle>
                                            <CardDescription className="font-mono mt-1 text-xs">{trade.dateLabel}</CardDescription>
                                        </div>
                                        <Badge variant="outline" className={`shadow-sm ${STATUS_COLORS[trade.status] || "bg-slate-50 text-slate-600"}`}>
                                            {trade.status}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-4 flex-1 flex flex-col space-y-4">
                                    <div className="flex justify-between text-[11px] font-mono text-slate-500 bg-slate-50 p-2 rounded-md border border-slate-100">
                                        <div><span className="font-semibold text-slate-400">BILTY:</span> {trade.biltyNo}</div>
                                        <div><span className="font-semibold text-slate-400">VEH:</span> {trade.vehicleNo}</div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <div className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 mb-0.5">Source (Customer)</div>
                                            <div className="text-sm font-semibold text-slate-900">{trade.source}</div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-px bg-slate-100"></div>
                                            <Replace className="h-4 w-4 text-slate-300" />
                                            <div className="flex-1 h-px bg-slate-100"></div>
                                        </div>

                                        <div>
                                            <div className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 mb-0.5">Destination (Vendor)</div>
                                            <div className="text-sm font-semibold text-slate-900">{trade.destination}</div>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-slate-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="text-xs font-semibold text-slate-500">
                                                Net: <span className="font-mono text-blue-600 font-bold">{trade.netWeight}</span>
                                            </div>
                                            <div className="text-xs font-semibold text-slate-500">
                                                @ <span className="font-mono text-slate-700">{trade.rate}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 px-3 text-xs shadow-sm border-slate-200 text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                                                onClick={() => handleEdit(trade)}
                                            >
                                                <Pencil className="h-3 w-3 mr-1.5" /> Edit
                                            </Button>
                                            {trade.amount && (
                                                <div className="text-right">
                                                    <span className="font-mono font-bold text-emerald-700">{trade.amount}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <CreateTriangleTradeModal
                open={createOpen}
                onOpenChange={(val) => {
                    setCreateOpen(val);
                    if (!val) setSelectedTrade(null);
                }}
                initialData={selectedTrade}
                onSubmit={handleSave}
            />
        </DashboardLayout>
    );
}

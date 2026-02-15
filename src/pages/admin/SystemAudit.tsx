import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, History, Eye, Shield } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock Data matching Schema: audit_logs
// log_id, user_id, action_type, module_name, record_id, timestamp, ip_address, old_values, new_values
const MOCK_LOGS = [
    {
        log_id: "LOG-9001",
        user_id: "Ali Khan (Admin)",
        action_type: "Update",
        module_name: "Inventory",
        record_id: "ITEM-102",
        timestamp: "2026-02-14 10:30 AM",
        ip_address: "192.168.1.45",
        old_values: { qty: 450, location: "Warehouse A" },
        new_values: { qty: 500, location: "Warehouse A" }
    },
    {
        log_id: "LOG-9002",
        user_id: "Ahmed (Gatekeeper)",
        action_type: "Create",
        module_name: "Procurement",
        record_id: "IGP-5022",
        timestamp: "2026-02-14 11:15 AM",
        ip_address: "192.168.1.12",
        old_values: null,
        new_values: { supplier: "Alpha Wire", weight: 2500, driver: "Nawaz" }
    },
    {
        log_id: "LOG-9003",
        user_id: "Bilal (Sales)",
        action_type: "Delete",
        module_name: "Sales",
        record_id: "INV-Draft-001",
        timestamp: "2026-02-13 04:45 PM",
        ip_address: "192.168.1.33",
        old_values: { id: "INV-Draft-001", customer: "Gateway Motors", total: 45000 },
        new_values: null
    },
    {
        log_id: "LOG-9004",
        user_id: "System",
        action_type: "Print",
        module_name: "Reports",
        record_id: "RPT-PNL-2025",
        timestamp: "2026-02-13 09:00 AM",
        ip_address: "127.0.0.1",
        old_values: null,
        new_values: { action: "Exported PDF" }
    }
];

export default function SystemAudit() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLog, setSelectedLog] = useState<any>(null);

    const filteredLogs = MOCK_LOGS.filter(log =>
        log.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.module_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action_type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Audit Logs</h1>
                        <p className="text-slate-500">Track all sensitive actions and data changes.</p>
                    </div>
                </div>

                <Card className="shadow-soft border-slate-100">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-blue-600" />
                                    Audit Trail
                                </CardTitle>
                                <CardDescription>Immutable record of system activities.</CardDescription>
                            </div>
                            <div className="relative w-72">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                <Input
                                    placeholder="Search by User, Module, or Action..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Module</TableHead>
                                    <TableHead>Record ID</TableHead>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead className="text-right">Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLogs.map((log) => (
                                    <TableRow key={log.log_id}>
                                        <TableCell className="text-slate-500 whitespace-nowrap text-xs">{log.timestamp}</TableCell>
                                        <TableCell className="font-medium">{log.user_id}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={
                                                log.action_type === 'Create' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    log.action_type === 'Update' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                        log.action_type === 'Delete' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                                            'bg-blue-50 text-blue-700 border-blue-200'
                                            }>{log.action_type}</Badge>
                                        </TableCell>
                                        <TableCell>{log.module_name}</TableCell>
                                        <TableCell className="font-mono text-xs">{log.record_id}</TableCell>
                                        <TableCell className="text-slate-500 text-xs font-mono">{log.ip_address}</TableCell>
                                        <TableCell className="text-right">
                                            <button
                                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-100 h-8 w-8"
                                                onClick={() => setSelectedLog(log)}
                                            >
                                                <Eye className="h-4 w-4 text-slate-500" />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Audit Log Details</DialogTitle>
                            <DialogDescription>
                                Change Log ID: <span className="font-mono text-slate-900">{selectedLog?.log_id}</span>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-500 block">User</span>
                                    <span className="font-medium">{selectedLog?.user_id}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 block">Timestamp</span>
                                    <span className="font-medium">{selectedLog?.timestamp}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 block">Action</span>
                                    <span className="font-medium">{selectedLog?.action_type}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 block">Module</span>
                                    <span className="font-medium">{selectedLog?.module_name}</span>
                                </div>
                            </div>

                            <div className="border rounded-md mt-2">
                                <div className="grid grid-cols-2 border-b bg-slate-50">
                                    <div className="p-2 font-medium text-xs text-rose-700 border-r">Old Values (Before)</div>
                                    <div className="p-2 font-medium text-xs text-emerald-700">New Values (After)</div>
                                </div>
                                <div className="grid grid-cols-2 h-40">
                                    <ScrollArea className="border-r p-2">
                                        <pre className="text-xs font-mono whitespace-pre-wrap text-slate-600">
                                            {selectedLog?.old_values ? JSON.stringify(selectedLog.old_values, null, 2) : "N/A"}
                                        </pre>
                                    </ScrollArea>
                                    <ScrollArea className="p-2">
                                        <pre className="text-xs font-mono whitespace-pre-wrap text-slate-600">
                                            {selectedLog?.new_values ? JSON.stringify(selectedLog.new_values, null, 2) : "N/A"}
                                        </pre>
                                    </ScrollArea>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronRight, ChevronDown, Folder, FileText, Plus, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AddAccountModal } from "@/components/masters/AddAccountModal";

// Mock Data structure for COA
const initialCOA = [
    {
        id: "1000",
        name: "Assets",
        type: "group",
        children: [
            {
                id: "1100",
                name: "Current Assets",
                type: "group",
                children: [
                    { id: "1110", name: "Cash in Hand", type: "ledger" },
                    { id: "1120", name: "Bank Accounts", type: "ledger" },
                    { id: "1130", name: "Accounts Receivable", type: "ledger" },
                    { id: "1140", name: "Inventory", type: "ledger" },
                ]
            },
            {
                id: "1200",
                name: "Non-Current Assets",
                type: "group",
                children: [
                    { id: "1210", name: "Machinery & Equipment", type: "ledger" },
                    { id: "1220", name: "Land & Building", type: "ledger" },
                ]
            }
        ]
    },
    {
        id: "2000",
        name: "Liabilities",
        type: "group",
        children: [
            {
                id: "2100",
                name: "Current Liabilities",
                type: "group",
                children: [
                    { id: "2110", name: "Accounts Payable", type: "ledger" },
                    { id: "2120", name: "Parchi Liability", type: "ledger" },
                ]
            }
        ]
    },
    {
        id: "3000",
        name: "Equity",
        type: "group",
        children: []
    },
    {
        id: "4000",
        name: "Revenue",
        type: "group",
        children: []
    },
    {
        id: "5000",
        name: "Expenses",
        type: "group",
        children: []
    }
];

// Recursive component to render tree
const TreeNode = ({ node, level = 0 }: { node: any, level?: number }) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="select-none">
            <div
                className={cn(
                    "flex items-center gap-2 py-2 px-2 rounded-md hover:bg-slate-50 cursor-pointer border-b border-transparent hover:border-slate-100 transition-colors",
                    level === 0 ? "font-semibold text-slate-900" : "text-slate-700"
                )}
                style={{ paddingLeft: `${level * 20 + 8}px` }}
                onClick={() => hasChildren && setIsOpen(!isOpen)}
            >
                {hasChildren ? (
                    <span className="text-slate-400 p-0.5 rounded hover:bg-slate-200">
                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </span>
                ) : (
                    <span className="w-5" /> // spacer
                )}

                {node.type === "group" ? (
                    <Folder className={cn("h-4 w-4", level === 0 ? "text-blue-600" : "text-indigo-400")} />
                ) : (
                    <FileText className="h-4 w-4 text-slate-400" />
                )}

                <span className="flex-1">{node.id} - {node.name}</span>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Actions could go here */}
                </div>
            </div>

            {isOpen && hasChildren && (
                <div>
                    {node.children.map((child: any) => (
                        <TreeNode key={child.id} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function ChartOfAccounts() {
    const [isAddOpen, setIsAddOpen] = useState(false);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Chart of Accounts</h1>
                        <p className="text-slate-500">Manage financial heads and group structures.</p>
                    </div>
                    <Button onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700 shadow-soft">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Account
                    </Button>
                </div>

                <AddAccountModal open={isAddOpen} onOpenChange={setIsAddOpen} />

                <Card className="shadow-soft border-slate-100">
                    <CardHeader className="pb-4 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                            <CardTitle>Account Hierarchy</CardTitle>
                            <div className="relative w-[300px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                <Input className="pl-9 h-9" placeholder="Search accounts..." />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="p-2">
                            {initialCOA.map((node) => (
                                <TreeNode key={node.id} node={node} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

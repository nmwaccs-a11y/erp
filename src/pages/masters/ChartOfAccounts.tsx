import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronRight, ChevronDown, Folder, FileText, Plus, Search, Anchor } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AddAccountModal } from "@/components/masters/AddAccountModal";
import { Badge } from "@/components/ui/badge";

// Version 6.0 - CopperSync Standard COA
const initialCOA = [
    {
        id: "10000",
        name: "ASSETS",
        type: "group",
        children: [
            {
                id: "11000",
                name: "Current Assets",
                type: "group",
                children: [
                    {
                        id: "11100",
                        name: "Cash & Bank",
                        type: "group",
                        children: [
                            { id: "11101", name: "Main Factory Cash Drawer", type: "leaf" },
                            { id: "11102", name: "Meezan Bank", type: "leaf" },
                            { id: "11103", name: "HBL", type: "leaf" },
                        ]
                    },
                    {
                        id: "11200",
                        name: "Trade Receivables",
                        type: "group",
                        children: [
                            { id: "11201", name: "Accounts Receivable - Customers", type: "group", isAnchor: true },
                            { id: "11202", name: "Parchi Receivables", type: "leaf" },
                            { id: "11203", name: "Advance Cash Given to Vendors", type: "leaf" },
                        ]
                    }
                ]
            },
            {
                id: "12000",
                name: "Inventory Assets",
                type: "group",
                children: [
                    {
                        id: "12100",
                        name: "Factory Stock Value",
                        type: "group",
                        children: [
                            { id: "12101", name: "Raw Material Value - Scrap/Cathode", type: "leaf" },
                            { id: "12102", name: "WIP Value - Wire No 8/Rod", type: "leaf" },
                            { id: "12103", name: "Finished Goods Value - Enameled Wire", type: "leaf" },
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "20000",
        name: "LIABILITIES",
        type: "group",
        children: [
            {
                id: "21000",
                name: "Current Liabilities",
                type: "group",
                children: [
                    {
                        id: "21100",
                        name: "Trade Payables",
                        type: "group",
                        children: [
                            { id: "21101", name: "Accounts Payable - Vendors", type: "group", isAnchor: true },
                            { id: "21102", name: "Vendor Mazdoori Payable", type: "leaf" },
                            { id: "21103", name: "Parchi Payables", type: "leaf" },
                            { id: "21104", name: "Advance Cash Received from Customers", type: "leaf" },
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "30000",
        name: "EQUITY",
        type: "group",
        children: [
            {
                id: "31000",
                name: "Capital Accounts",
                type: "group",
                children: [
                    { id: "31001", name: "Owner's Capital Investment", type: "leaf" },
                    { id: "31002", name: "Owner Drawings", type: "leaf" },
                ]
            },
            {
                id: "32000",
                name: "Retained Earnings",
                type: "group",
                children: [
                    { id: "32001", name: "Accumulated Factory Profits", type: "leaf" },
                ]
            }
        ]
    },
    {
        id: "40000",
        name: "INCOME / REVENUE",
        type: "group",
        children: [
            {
                id: "41000",
                name: "Operating Revenue",
                type: "group",
                children: [
                    { id: "41001", name: "Direct Wire Sales", type: "leaf" },
                    { id: "41002", name: "Premium / Watta Income", type: "leaf" },
                    { id: "41003", name: "Scrap Sales", type: "leaf" },
                ]
            }
        ]
    },
    {
        id: "50000",
        name: "EXPENSES & COGS",
        type: "group",
        children: [
            {
                id: "51000",
                name: "Direct Cost of Goods Sold",
                type: "group",
                children: [
                    { id: "51001", name: "Raw Material Consumed", type: "leaf" },
                    { id: "51002", name: "Vendor Processing / Triangle Mazdoori", type: "leaf" },
                    { id: "51003", name: "Factory Furnace & Enamel Utilities", type: "leaf" },
                    { id: "51004", name: "Direct Factory Wages - Operators", type: "leaf" },
                ]
            },
            {
                id: "52000",
                name: "Operating & Admin Expenses",
                type: "group",
                children: [
                    { id: "52001", name: "Office / Gatekeeper Salaries", type: "leaf" },
                    { id: "52002", name: "Logistics, Freight & Unloading Labor", type: "leaf" },
                    { id: "52003", name: "Machine Maintenance & Spares", type: "leaf" },
                ]
            }
        ]
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
                    level === 0 ? "font-bold text-slate-900 bg-slate-50/50" : "text-slate-700"
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
                    <Folder className={cn("h-4 w-4", level === 0 ? "text-slate-800" : "text-blue-500")} />
                ) : (
                    <FileText className="h-4 w-4 text-slate-400" />
                )}

                <span className={cn("flex-1", node.type === "group" && level > 0 && "font-semibold text-slate-800")}>
                    <span className="font-mono text-slate-500 mr-2">{node.id}</span>
                    {node.name}
                </span>

                {node.isAnchor && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 ml-2">
                        <Anchor className="h-3 w-3 mr-1" /> Anchor Point
                    </Badge>
                )}
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
            <div className="space-y-6 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Chart of Accounts</h1>
                        <p className="text-slate-500">Manage financial heads and standard structural hierarchy.</p>
                    </div>
                    <Button onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700 shadow-soft">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Structural Account
                    </Button>
                </div>

                <AddAccountModal open={isAddOpen} onOpenChange={setIsAddOpen} />

                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Standard COA Hierarchy</CardTitle>
                            <div className="relative w-[300px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                <Input className="pl-9 h-9 bg-white" placeholder="Search accounts..." />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="p-4">
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

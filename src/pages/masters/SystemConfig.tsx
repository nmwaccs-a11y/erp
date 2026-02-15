import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Save, Plus } from "lucide-react";

export default function SystemConfig() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Configuration</h1>
                        <p className="text-slate-500">Manage global settings and fiscal years.</p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 shadow-soft">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="shadow-soft border-slate-100">
                        <CardHeader>
                            <CardTitle>Company Profile</CardTitle>
                            <CardDescription>Basic information about your organization.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Company Name</Label>
                                <Input defaultValue="CopperSync Industries Ltd." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tax ID (NTN)</Label>
                                    <Input defaultValue="7788990-1" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Sales Tax Reg</Label>
                                    <Input defaultValue="STRN-112233" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Address</Label>
                                <Input defaultValue="Plot 45, Small Industrial Estate, Gujranwala" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-soft border-slate-100">
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>Access control and session management.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Auto-Logout (Minutes)</Label>
                                    <p className="text-xs text-slate-500">Idle time before session expiry.</p>
                                </div>
                                <Input className="w-20" type="number" defaultValue="30" />
                            </div>
                            <div className="space-y-2">
                                <Label>IP Whitelisting (CIDR)</Label>
                                <Input defaultValue="192.168.1.0/24, 10.0.0.0/8" />
                                <p className="text-xs text-slate-500">Comma separated allowed IP ranges.</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Enforce 2FA for Admin</Label>
                                    <p className="text-xs text-slate-500">Require OTP for high-privilege accounts.</p>
                                </div>
                                <Switch checked={true} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-soft border-slate-100">
                        <CardHeader>
                            <CardTitle>Fiscal Year Settings</CardTitle>
                            <CardDescription>Manage accounting periods and locking.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Current Fiscal Year</Label>
                                    <Input defaultValue="FY-2026" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Input type="date" defaultValue="2025-07-01" />
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Lock Previous Periods</Label>
                                    <p className="text-xs text-slate-500">Prevent editing of transactions before the lock date.</p>
                                </div>
                                <Switch checked={true} />
                            </div>
                            <div className="space-y-2">
                                <Label>Lock Date</Label>
                                <Input type="date" defaultValue="2026-01-31" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-soft border-slate-100">
                        <CardHeader>
                            <CardTitle>Warehouse Configuration</CardTitle>
                            <CardDescription>Define physical and virtual locations.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 border rounded bg-slate-50">
                                    <span className="text-sm font-medium">Main Factory Floor</span>
                                    <Badge>Physical</Badge>
                                </div>
                                <div className="flex items-center justify-between p-2 border rounded bg-slate-50">
                                    <span className="text-sm font-medium">Scrap Yard A</span>
                                    <Badge>Physical</Badge>
                                </div>
                                <div className="flex items-center justify-between p-2 border rounded bg-slate-50">
                                    <span className="text-sm font-medium">Vendor Virtual (Hwala)</span>
                                    <Badge variant="outline">Virtual</Badge>
                                </div>
                                <Button variant="outline" size="sm" className="w-full">
                                    <Plus className="h-3 w-3 mr-2" /> Add Warehouse
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-soft border-slate-100 md:col-span-2">
                        <CardHeader>
                            <CardTitle>Inventory & Production Rules</CardTitle>
                            <CardDescription>Configure how the system handles stock and manufacturing logic.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Allow Negative Stock</Label>
                                        <p className="text-xs text-slate-500">Warning: Can cause valuation errors.</p>
                                    </div>
                                    <Switch />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Strict Batch Enforcement</Label>
                                        <p className="text-xs text-slate-500">Require Batch ID for all output entries.</p>
                                    </div>
                                    <Switch checked={true} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label>Machine Wastage Tolerances (%)</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-xs text-slate-500">Drawing Machine</span>
                                        <Input type="number" defaultValue="1.5" />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs text-slate-500">Enameling Plant</span>
                                        <Input type="number" defaultValue="0.8" />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs text-slate-500">Extruder</span>
                                        <Input type="number" defaultValue="2.0" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}

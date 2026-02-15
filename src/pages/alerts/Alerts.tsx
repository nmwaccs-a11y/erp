import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, ShieldAlert, Plus, CheckCircle2, Activity } from "lucide-react";
import { useState } from "react";
import { CreateRuleModal } from "@/components/alerts/CreateRuleModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

export default function Alerts() {
    const [createOpen, setCreateOpen] = useState(false);

    // Mock Data
    const [rules, setRules] = useState([
        { id: 1, name: "Critical Wastage", metric: "Production Wastage %", condition: ">", value: "5", severity: "critical", status: true },
        { id: 2, name: "Low Stock Warning", metric: "Stock Level", condition: "<", value: "100", severity: "warning", status: true },
        { id: 3, name: "Parchi Due Soon", metric: "Parchi Due Date", condition: "<", value: "3 Days", severity: "info", status: false },
    ]);

    const [alerts, setAlerts] = useState([
        { id: 101, message: "High Wastage recorded on Machine 01 (6.2%)", time: "10 mins ago", severity: "critical" },
        { id: 102, message: "Inventory Low: Copper Rod 8mm is below 100kg", time: "2 hours ago", severity: "warning" },
        { id: 103, message: "Parchi #P-502 is due tomorrow", time: "5 hours ago", severity: "info" },
    ]);

    const handleCreateRule = (data: any) => {
        const newRule = {
            id: rules.length + 1,
            name: data.name,
            metric: data.metric === "wastage" ? "Production Wastage %" :
                data.metric === "stock" ? "Stock Level" :
                    data.metric === "credit" ? "Credit Limit" : "Parchi Due Date",
            condition: data.condition === "greater_than" ? ">" : data.condition === "less_than" ? "<" : "=",
            value: data.threshold,
            severity: data.severity,
            status: true
        };
        setRules([...rules, newRule]);
    };

    const toggleRule = (id: number) => {
        setRules(rules.map(r => r.id === id ? { ...r, status: !r.status } : r));
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Alerts & Risk</h1>
                        <p className="text-slate-500">System health monitoring and automated notifications.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button className="bg-blue-600 hover:bg-blue-700 shadow-soft" onClick={() => setCreateOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            New Alert Rule
                        </Button>
                    </div>
                </div>

                <CreateRuleModal open={createOpen} onOpenChange={setCreateOpen} onSubmit={handleCreateRule} />

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="shadow-soft border-slate-100 bg-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                            <Bell className="h-4 w-4 text-rose-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-rose-600">{alerts.length}</div>
                            <p className="text-xs text-slate-500">Requires attention</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-soft border-slate-100 bg-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
                            <ShieldAlert className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600">{rules.filter(r => r.status).length}</div>
                            <p className="text-xs text-slate-500">Monitoring system</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-soft border-slate-100 bg-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">System Health</CardTitle>
                            <Activity className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">98%</div>
                            <p className="text-xs text-slate-500">Operational uptime</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="active" className="space-y-4">
                    <TabsList className="bg-slate-100 p-1">
                        <TabsTrigger value="active" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Active Alerts</TabsTrigger>
                        <TabsTrigger value="rules" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Rule Configuration</TabsTrigger>
                    </TabsList>

                    <TabsContent value="active">
                        <Card className="shadow-soft border-slate-100">
                            <CardHeader>
                                <CardTitle>Current Notifications</CardTitle>
                                <CardDescription>Real-time alerts triggered by your rules.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {alerts.map((alert) => (
                                        <div key={alert.id} className={`flex items-start p-4 rounded-lg border ${alert.severity === 'critical' ? 'bg-rose-50 border-rose-100' :
                                                alert.severity === 'warning' ? 'bg-amber-50 border-amber-100' :
                                                    'bg-blue-50 border-blue-100'
                                            }`}>
                                            <div className="mr-4 mt-0.5">
                                                {alert.severity === 'critical' ? <AlertTriangle className="h-5 w-5 text-rose-600" /> :
                                                    alert.severity === 'warning' ? <AlertTriangle className="h-5 w-5 text-amber-600" /> :
                                                        <Bell className="h-5 w-5 text-blue-600" />}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`text-sm font-semibold ${alert.severity === 'critical' ? 'text-rose-900' :
                                                        alert.severity === 'warning' ? 'text-amber-900' :
                                                            'text-blue-900'
                                                    }`}>
                                                    {alert.severity.toUpperCase()} ALERT
                                                </h4>
                                                <p className="text-sm text-slate-700 mt-1">{alert.message}</p>
                                                <p className="text-xs text-slate-500 mt-2">{alert.time}</p>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-8">Dismiss</Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="rules">
                        <Card className="shadow-soft border-slate-100">
                            <CardHeader>
                                <CardTitle>Alert Rules</CardTitle>
                                <CardDescription>Configure the conditions that trigger notifications.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Rule Name</TableHead>
                                            <TableHead>Metric</TableHead>
                                            <TableHead>Condition</TableHead>
                                            <TableHead>Threshold</TableHead>
                                            <TableHead>Severity</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rules.map((rule) => (
                                            <TableRow key={rule.id}>
                                                <TableCell className="font-medium">{rule.name}</TableCell>
                                                <TableCell>{rule.metric}</TableCell>
                                                <TableCell className="font-mono text-xs">{rule.condition}</TableCell>
                                                <TableCell>{rule.value}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={
                                                        rule.severity === 'critical' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                                            rule.severity === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                                'bg-blue-50 text-blue-700 border-blue-200'
                                                    }>{rule.severity}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Switch checked={rule.status} onCheckedChange={() => toggleRule(rule.id)} />
                                                        <span className="text-xs text-slate-500">{rule.status ? 'Active' : 'Disabled'}</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}

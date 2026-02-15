import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Shield, ShieldAlert, Key, UserCheck, Lock } from "lucide-react";
import { useState } from "react";
import { AddUserModal } from "@/components/admin/AddUserModal";

export default function UserManagement() {
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);

    const users = [
        { id: 1, name: "Ali Raza", email: "ali@copper.com", role: "Super Admin", status: "Active", lastLogin: "2 mins ago" },
        { id: 2, name: "Bilal Ahmed", email: "bilal@copper.com", role: "Accountant", status: "Active", lastLogin: "1 hour ago" },
        { id: 3, name: "Gatekeeper 1", email: "gate@copper.com", role: "Gatekeeper", status: "Locked", lastLogin: "2 days ago" },
        { id: 4, name: "Production Mgr", email: "prod@copper.com", role: "Manager", status: "Active", lastLogin: "5 hours ago" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Administration & Security</h1>
                        <p className="text-slate-500">Manage users, roles, and system security.</p>
                    </div>
                    <Button onClick={() => setIsAddUserOpen(true)} className="bg-blue-600 hover:bg-blue-700 shadow-soft">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New User
                    </Button>
                </div>

                <AddUserModal open={isAddUserOpen} onOpenChange={setIsAddUserOpen} />

                <Tabs defaultValue="users" className="space-y-4">
                    <TabsList className="bg-slate-100 p-1 w-full sm:w-auto overflow-x-auto justify-start">
                        <TabsTrigger value="users" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">User Management</TabsTrigger>
                        <TabsTrigger value="roles" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Role Permissions</TabsTrigger>
                        <TabsTrigger value="logs" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Activity Logs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="users" className="space-y-4">
                        <Card className="shadow-soft border-slate-100">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>System Users</CardTitle>
                                        <CardDescription>Manage access and credentials.</CardDescription>
                                    </div>
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                        <Input className="pl-9 w-[250px]" placeholder="Search users..." />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>User</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Last Login</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-900">{user.name}</p>
                                                            <p className="text-xs text-slate-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={user.status === "Active" ? "default" : "destructive"}
                                                        className={user.status === "Active" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-rose-100 text-rose-700 hover:bg-rose-100"}
                                                    >
                                                        {user.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-slate-500">{user.lastLogin}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600">
                                                        Edit
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-700 hover:bg-rose-50">
                                                        Force Logout
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="roles" className="space-y-4">
                        <Card className="shadow-soft border-slate-100">
                            <CardHeader>
                                <CardTitle>Permission Matrix</CardTitle>
                                <CardDescription>Configure access levels for each role.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Module</TableHead>
                                            <TableHead>Super Admin</TableHead>
                                            <TableHead>Accountant</TableHead>
                                            <TableHead>Gatekeeper</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {["Procurement", "Production", "Financials", "Settings"].map((module) => (
                                            <TableRow key={module}>
                                                <TableCell className="font-medium">{module}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-emerald-600">
                                                        <Shield className="h-4 w-4" /> Full Access
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {module === "Settings" ? (
                                                        <div className="flex items-center gap-1 text-rose-500">
                                                            <Lock className="h-4 w-4" /> No Access
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1 text-blue-600">
                                                            <UserCheck className="h-4 w-4" /> Edit
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {module === "Procurement" ? (
                                                        <div className="flex items-center gap-1 text-blue-600">
                                                            <UserCheck className="h-4 w-4" /> Create Only
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1 text-rose-500">
                                                            <Lock className="h-4 w-4" /> No Access
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="logs" className="space-y-4">
                        <Card className="shadow-soft border-slate-100">
                            <CardHeader>
                                <CardTitle>Security Logs</CardTitle>
                                <CardDescription>Recent login activity and security events.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex items-start justify-between pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-1 p-2 rounded-full ${i === 2 ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-500"}`}>
                                                    {i === 2 ? <ShieldAlert className="h-4 w-4" /> : <Key className="h-4 w-4" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">
                                                        {i === 2 ? "Failed Login Attempt" : "Successful Login"}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {i === 2 ? "IP: 192.168.1.45 (Unknown Device)" : "User: Ali Raza (Chrome/Windows)"}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-400">
                                                {i * 15} mins ago
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}

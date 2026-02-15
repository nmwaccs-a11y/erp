import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Printer, FileText, Search, AlertCircle, Zap } from "lucide-react";
import { useState } from "react";
import { WeighbridgeModal } from "@/components/procurement/WeighbridgeModal";
import { CreatePOModal } from "@/components/procurement/CreatePOModal";
import { CreateDebitNoteModal } from "@/components/procurement/CreateDebitNoteModal";

export default function Procurement() {
    const [activeTab, setActiveTab] = useState("igp");
    const [ratePending, setRatePending] = useState(true);
    const [grossWeight, setGrossWeight] = useState<number | string>("");
    const [tareWeight, setTareWeight] = useState<number | string>("");
    const [isTarePending, setIsTarePending] = useState(false);
    const [poReference, setPoReference] = useState("");
    const [remarks, setRemarks] = useState("");
    const [wbImage, setWbImage] = useState<File | null>(null);
    const [poOpen, setPoOpen] = useState(false);
    const [debitNoteOpen, setDebitNoteOpen] = useState(false);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Procurement</h1>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="shadow-soft bg-white" onClick={() => setDebitNoteOpen(true)}>
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Debit Note (Return)
                        </Button>
                        <Button variant="outline" className="shadow-soft bg-white">
                            <Printer className="h-4 w-4 mr-2" />
                            Print Log
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 shadow-soft" onClick={() => setPoOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            New Order
                        </Button>
                    </div>
                </div>

                <CreatePOModal open={poOpen} onOpenChange={setPoOpen} />
                <CreateDebitNoteModal open={debitNoteOpen} onOpenChange={setDebitNoteOpen} onSubmit={() => { }} />

                <Tabs defaultValue="igp" className="space-y-4" onValueChange={setActiveTab}>
                    <TabsList className="bg-slate-100 p-1">
                        <TabsTrigger value="igp" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Inward Gate Pass (IGP)</TabsTrigger>
                        <TabsTrigger value="po" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Purchase Orders</TabsTrigger>
                        <TabsTrigger value="returns" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Debit Notes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="igp" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            {/* IGP Form */}
                            <Card className="col-span-4 border-slate-200 shadow-soft">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>New Inward Entry</CardTitle>
                                            <CardDescription>Record incoming raw material or scrap.</CardDescription>
                                        </div>
                                        <Badge variant="outline" className="bg-slate-50 text-slate-500">
                                            IGP-2026-001
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Gate Pass Type</Label>
                                            <Select defaultValue="purchase">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="purchase">Purchase</SelectItem>
                                                    <SelectItem value="return">Sales Return</SelectItem>
                                                    <SelectItem value="hwala">Hwala Inward</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Party</Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Vendor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="alpha">Alpha Wire Supply</SelectItem>
                                                    <SelectItem value="beta">Beta Transformers</SelectItem>
                                                    <SelectItem value="gamma">Gamma Scrap Traders</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>PO Reference (Optional)</Label>
                                        <Select value={poReference} onValueChange={setPoReference}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Purchase Order" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PO-2026-101">PO-2026-101 (Copper Cathode)</SelectItem>
                                                <SelectItem value="PO-2026-102">PO-2026-102 (Scrap)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-4 border rounded-lg p-3 bg-slate-50/50">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-base font-semibold text-slate-700">Weight Capture</Label>
                                            <div className="flex items-center gap-2">
                                                <Label htmlFor="tare-pending" className="text-sm text-amber-700 cursor-pointer">Tare Pending?</Label>
                                                <Switch
                                                    id="tare-pending"
                                                    checked={isTarePending}
                                                    onCheckedChange={setIsTarePending}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 items-end">
                                            <div className="space-y-2">
                                                <Label>Gross Weight (kg)</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={grossWeight}
                                                    onChange={(e) => setGrossWeight(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Tare Weight (kg)</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={tareWeight}
                                                    onChange={(e) => setTareWeight(e.target.value)}
                                                    disabled={isTarePending}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Net Weight (kg)</Label>
                                                <div className="h-10 px-3 py-2 bg-slate-100 rounded-md border border-slate-200 font-mono font-semibold text-slate-700">
                                                    {(Number(grossWeight) - Number(tareWeight)).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <WeighbridgeModal onCapture={(w) => setGrossWeight(w)} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Item</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Item" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="copper">Copper Cathode</SelectItem>
                                                <SelectItem value="scrap">Mixed Scrap</SelectItem>
                                                <SelectItem value="rod">8mm Rod</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className={`p-4 rounded-lg border transition-all duration-300 ${ratePending ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Label className={`text-base font-semibold ${ratePending ? 'text-amber-900' : 'text-blue-900'}`}>
                                                    Rate Status
                                                </Label>
                                                {ratePending ? (
                                                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200">
                                                        <AlertCircle className="h-3 w-3 mr-1" /> Pending (Suda)
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                                        <Zap className="h-3 w-3 mr-1" /> Fixed Rate
                                                    </Badge>
                                                )}
                                            </div>
                                            <Switch
                                                checked={!ratePending}
                                                onCheckedChange={(c) => setRatePending(!c)}
                                                className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-amber-400"
                                            />
                                        </div>

                                        {ratePending ? (
                                            <p className="text-xs text-amber-700">
                                                Inventory will be updated immediately. Value will be posted as 0 until rate is fixed in <strong>Rate Management</strong>.
                                            </p>
                                        ) : (
                                            <div className="mt-2 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-blue-700">Rate (PKR)</Label>
                                                    <Input className="h-8 bg-white" placeholder="0.00" />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-blue-700">Total Value</Label>
                                                    <Input className="h-8 bg-white" placeholder="0.00" disabled />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Driver Name</Label>
                                            <Input placeholder="Enter name" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Vehicle No.</Label>
                                            <Input placeholder="LEA-1234" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Weighbridge Image</Label>
                                            <Input type="file" onChange={(e) => setWbImage(e.target.files?.[0] || null)} />
                                            <p className="text-[10px] text-slate-500">Upload weight slip image.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Remarks</Label>
                                            <Input
                                                placeholder="Any comments..."
                                                value={remarks}
                                                onChange={(e) => setRemarks(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="justify-end gap-2">
                                    <Button variant="ghost">Reset</Button>
                                    <Button className="bg-blue-600 hover:bg-blue-700">Create Gate Pass</Button>
                                </CardFooter>
                            </Card>

                            {/* Recent IGPs */}
                            <Card className="col-span-3 border-slate-200 shadow-soft bg-slate-50/50">
                                <CardHeader>
                                    <CardTitle className="text-base">Recent Gate Passes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                        <FileText className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">IGP-{1000 + i}</p>
                                                        <p className="text-xs text-slate-500">Alpha Wire Supply</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-slate-900">5,000 kg</p>
                                                    <Badge variant="secondary" className="text-[10px] h-5 bg-amber-100 text-amber-700 hover:bg-amber-100">Pending</Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="po">
                        <Card className="border-slate-200 shadow-soft">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Purchase Orders</CardTitle>
                                        <CardDescription>Manage your procurement orders.</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                            <Input className="pl-9 w-[250px]" placeholder="Search orders..." />
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>PO ID</TableHead>
                                            <TableHead>Vendor</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Items</TableHead>
                                            <TableHead>Total Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <TableRow key={i}>
                                                <TableCell className="font-medium">PO-202{i}</TableCell>
                                                <TableCell>Alpha Wire Supply</TableCell>
                                                <TableCell className="text-slate-500">Feb 12, 2026</TableCell>
                                                <TableCell>Copper Cathode (10T)</TableCell>
                                                <TableCell>$85,000</TableCell>
                                                <TableCell>
                                                    <Badge variant={i === 1 ? 'default' : 'secondary'} className={i === 1 ? 'bg-blue-600' : ''}>
                                                        {i === 1 ? 'Open' : 'Delivered'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm">View</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="returns">
                        <Card className="border-slate-200 shadow-soft">
                            <CardHeader>
                                <CardTitle>Purchase Returns (Debit Notes)</CardTitle>
                                <CardDescription>Records of rejected material sent back to suppliers.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-slate-500">No debit notes issued this month.</div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}

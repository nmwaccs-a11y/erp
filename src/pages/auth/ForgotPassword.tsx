import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    const [emailSent, setEmailSent] = useState(false);

    // Mock strength meter (visual only for this prototype)
    const [password, setPassword] = useState("");
    const strength = Math.min(password.length * 10, 100);

    const getColor = (s: number) => {
        if (s < 30) return "bg-rose-500";
        if (s < 70) return "bg-amber-500";
        return "bg-emerald-500";
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg border-slate-200">
                <CardHeader className="space-y-1">
                    <Link to="/auth/login" className="mb-4 inline-flex items-center text-sm text-slate-500 hover:text-slate-900">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Login
                    </Link>
                    <CardTitle className="text-2xl font-bold text-slate-900">Reset Password</CardTitle>
                    <CardDescription>
                        {emailSent
                            ? "Check your email for the reset link."
                            : "Enter your email address and we'll send you a link to reset your password."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!emailSent ? (
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="name@company.com" />
                        </div>
                    ) : (
                        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Check className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div className="text-sm font-medium">Reset link sent successfully!</div>
                        </div>
                    )}

                    {/* 
                Visual demonstration of Password Strength Meter 
                (Normally shown on the Reset Password page, adding here for prototype breadth)
            */}
                    {!emailSent && (
                        <div className="pt-4 border-t border-slate-100">
                            <p className="text-xs text-slate-400 mb-2 uppercase font-semibold">Preview: New Password UI</p>
                            <div className="space-y-2">
                                <Label>New Password</Label>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Type to see strength check"
                                />
                                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${getColor(strength)}`}
                                        style={{ width: `${strength}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Weak</span>
                                    <span>Strong</span>
                                </div>
                            </div>
                        </div>
                    )}

                </CardContent>
                <CardFooter>
                    {!emailSent && (
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => setEmailSent(true)}
                        >
                            Send Reset Link
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}

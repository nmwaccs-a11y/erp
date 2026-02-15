import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShieldCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TwoFactor() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== "" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        // In a real app, verify OTP here
        navigate("/auth/tenant-selection");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg border-slate-200">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <ShieldCheck className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">Two-Factor Authentication</CardTitle>
                    <CardDescription>
                        Enter the 6-digit code sent to your device.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center gap-2 my-4">
                        {otp.map((digit, index) => (
                            <Input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                className="w-10 h-12 text-center text-lg font-bold border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        ))}
                    </div>
                    <div className="text-center text-sm text-slate-500 mb-4">
                        Didn't receive code? <button className="text-blue-600 hover:underline font-medium">Resend</button>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                        onClick={handleVerify}
                    >
                        Verify Identity
                    </Button>
                </CardFooter>
            </Card>

            <div className="absolute bottom-4 text-center text-xs text-slate-400">
                CopperSync ERP • Secure Access
            </div>
        </div>
    );
}

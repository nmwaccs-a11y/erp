import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import PageMotion from "@/components/layout/PageMotion";
import { useState } from "react";

export default function Login() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            navigate("/auth/tenant-selection");
        }, 800);
    };

    return (
        <PageMotion>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Subtle background pattern matching the flat ERP theme */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+CjxyZWN0IHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIgZmlsbD0icmdiYSgyMDMsIDIxMywgMjI1LCAwLjQpIi8+Cjwvc3ZnPg==')] opacity-60"></div>
            
            {/* Premium, Wide Centered Card */}
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-500">
                
                {/* ── LEFT COLUMN: Brand Panel ── */}
                <div className="hidden md:flex md:w-5/12 bg-slate-900 p-10 flex-col justify-between relative overflow-hidden">
                    {/* Decorative abstract shape */}
                    <div className="absolute top-[-20%] left-[-10%] w-[150%] h-[150%] bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-3xl mix-blend-screen"></div>
                    <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-slate-900 to-transparent z-0"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                                <Zap className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">CopperSync</span>
                        </div>
                        
                        <div className="mt-16 space-y-4">
                            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 bg-blue-900/30 text-blue-300 border border-blue-800/50">
                                ERP Version 2.0
                            </div>
                            <h2 className="text-3xl font-bold text-white tracking-tight leading-tight">
                                Intelligence for <br/>Modern Manufacturing.
                            </h2>
                            <p className="text-slate-400 text-sm leading-relaxed mt-4 max-w-[250px]">
                                A unified platform designed to streamline production, track inventory, and maintain financial clarity.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-3 mt-12">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span>Real-time Financial Ledgers</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span>Triangle Scrap Trading</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span>Automated Parchi Register</span>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT COLUMN: Login Form ── */}
                <div className="flex-1 p-8 sm:p-12 md:p-16 bg-white flex flex-col justify-center">
                    
                    {/* Mobile Header */}
                    <div className="md:hidden flex items-center gap-2 mb-8">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                            <Zap className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">CopperSync</span>
                    </div>

                    <div className="space-y-2 mb-8">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
                        <p className="text-sm text-slate-500">Please enter your credentials to securely access your workspace.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 font-medium text-sm">Work Email</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="name@company.com" 
                                className="h-11 bg-white border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all rounded-lg shadow-sm"
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-slate-700 font-medium text-sm">Password</Label>
                                <Link to="/auth/forgot-password" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input 
                                id="password" 
                                type="password" 
                                placeholder="••••••••"
                                className="h-11 bg-white border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all rounded-lg shadow-sm"
                                required 
                            />
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all duration-300 shadow-sm hover:shadow-md rounded-lg group mt-4"
                            disabled={isLoading}
                        >
                            {isLoading ? "Authenticating..." : "Sign in to Workspace"}
                            {!isLoading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
                        <Shield className="h-3.5 w-3.5 text-slate-400" />
                        Protected by enterprise-grade security
                    </div>
                </div>
            </div>
        </div>
        </PageMotion>
    );
}

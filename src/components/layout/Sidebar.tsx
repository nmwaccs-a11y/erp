import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    LayoutDashboard,
    ShoppingCart,
    Factory,
    Package,
    FileText,
    Shield,
    CreditCard,
    BarChart3,
    Archive,
    Menu,
    X,
    Zap,
    LogOut,
    Database,
    Bell,
    Settings,
    TrendingUp,
    ShoppingBag,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Replace
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    isCollapsed?: boolean;
    onToggle?: () => void;
}

export function Sidebar({ className, isCollapsed = false, onToggle }: SidebarProps) {
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
            color: "text-blue-400",
        },
        {
            label: "Purchase",
            icon: ShoppingCart,
            href: "/purchase",
            color: "text-emerald-400",
        },
        {
            label: "Rate Mgmt (Suda)",
            icon: TrendingUp,
            href: "/rate-management",
            color: "text-teal-400",
        },
        {
            label: "Production",
            icon: Factory,
            href: "/production",
            color: "text-amber-400",
        },
        {
            label: "Inventory",
            icon: Package,
            href: "/inventory",
            color: "text-indigo-400",
        },
        {
            label: "Financials",
            icon: CreditCard,
            href: "/financials",
            color: "text-rose-400",
        },
        {
            label: "Parchi Register",
            icon: FileText,
            href: "/parchis",
            color: "text-orange-300",
        },
        {
            label: "Ledgers",
            icon: BookOpen,
            href: "/ledgers",
            color: "text-cyan-400",
        },
        {
            label: "Sales & Dispatch",
            icon: ShoppingBag,
            href: "/sales",
            color: "text-blue-300",
        },
        {
            label: "Scrap",
            icon: Replace,
            href: "/scrap",
            color: "text-sky-400",
        },
        {
            label: "Reports",
            icon: BarChart3,
            href: "/reports",
            color: "text-purple-400",
        },
        {
            label: "Alerts & Risk",
            icon: Bell,
            href: "/alerts",
            color: "text-rose-300",
        },
        {
            label: "Market Intel",
            icon: TrendingUp,
            href: "/market",
            color: "text-emerald-300",
        },
        {
            label: "Audit Logs",
            icon: Shield,
            href: "/audit",
            color: "text-slate-400",
        },
    ];

    const masterRoutes = [
        {
            label: "Item Master",
            icon: Package,
            href: "/masters/items",
            color: "text-orange-400",
        },
        {
            label: "Party Master",
            icon: Database,
            href: "/masters/parties",
            color: "text-blue-300",
        },
        {
            label: "Chart of Accounts",
            icon: FileText,
            href: "/masters/coa",
            color: "text-emerald-300",
        },
        {
            label: "Labor Rates",
            icon: TrendingUp,
            href: "/masters/labor-rates",
            color: "text-amber-300",
        },
    ];

    const SidebarItem = ({ route }: { route: any }) => (
        <Link to={route.href}>
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full font-medium transition-all duration-300 ease-in-out mb-0.5 rounded-lg relative",
                                isCollapsed ? "justify-center px-2 h-10" : "justify-start px-3 h-9",
                                location.pathname === route.href
                                    ? "bg-white/15 text-white shadow-[0_0_12px_rgba(255,255,255,0.06)] hover:bg-white/15 hover:text-white backdrop-blur-sm border border-white/10"
                                    : "text-white/60 hover:bg-white/8 hover:text-white/90"
                            )}
                        >
                            {location.pathname === route.href && (
                                <div className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full", route.color?.replace('text-', 'bg-') || 'bg-blue-400')} />
                            )}
                            <route.icon
                                className={cn(
                                    "h-4 w-4 shrink-0 transition-all duration-300",
                                    location.pathname === route.href ? route.color || "text-white" : "text-white/50",
                                    isCollapsed ? "mr-0" : "mr-3"
                                )}
                            />
                            {!isCollapsed && <span className="text-[13px]">{route.label}</span>}
                        </Button>
                    </TooltipTrigger>
                    {isCollapsed && (
                        <TooltipContent side="right" className="bg-slate-900/95 text-white border-white/10 backdrop-blur-md shadow-xl">
                            {route.label}
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
        </Link>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div
                className={cn(
                    "hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40 border-r border-white/[0.06] transition-all duration-300 ease-in-out",
                    isCollapsed ? "w-16" : "w-60",
                    className
                )}
                style={{
                    background: "linear-gradient(180deg, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.92) 50%, rgba(15,23,42,0.97) 100%)",
                    backdropFilter: "blur(20px) saturate(1.8)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.8)",
                }}
            >
                {/* Logo */}
                <div className={cn("flex items-center h-14 shrink-0 border-b border-white/[0.06]", isCollapsed ? "justify-center" : "px-4")}>
                    <div className="relative">
                        <Zap className="h-5 w-5 text-blue-400 shrink-0" />
                        <div className="absolute inset-0 blur-md bg-blue-400/30 rounded-full" />
                    </div>
                    {!isCollapsed && (
                        <h2 className="ml-2.5 text-sm font-bold tracking-tight text-white/90 whitespace-nowrap">
                            CopperSync
                        </h2>
                    )}
                </div>

                <ScrollArea className="flex-1 px-2 py-3">
                    <div className="space-y-5">
                        <div className="space-y-0.5">
                            {routes.map((route) => (
                                <SidebarItem key={route.href} route={route} />
                            ))}
                        </div>

                        <div>
                            {!isCollapsed && (
                                <div className="flex items-center gap-2 mb-2 px-3">
                                    <div className="h-px flex-1 bg-white/[0.06]" />
                                    <span className="text-[10px] font-semibold tracking-widest text-white/30 uppercase">Masters</span>
                                    <div className="h-px flex-1 bg-white/[0.06]" />
                                </div>
                            )}
                            {isCollapsed && <div className="h-px mx-2 my-2 bg-white/[0.06]" />}
                            <div className="space-y-0.5">
                                {masterRoutes.map((route) => (
                                    <SidebarItem key={route.href} route={route} />
                                ))}
                            </div>
                        </div>

                        <div>
                            {!isCollapsed && (
                                <div className="flex items-center gap-2 mb-2 px-3">
                                    <div className="h-px flex-1 bg-white/[0.06]" />
                                    <span className="text-[10px] font-semibold tracking-widest text-white/30 uppercase">System</span>
                                    <div className="h-px flex-1 bg-white/[0.06]" />
                                </div>
                            )}
                            {isCollapsed && <div className="h-px mx-2 my-2 bg-white/[0.06]" />}
                            <div className="space-y-0.5">
                                <SidebarItem route={{ label: "Settings", icon: Settings, href: "/masters/config", color: "text-slate-400" }} />
                                <SidebarItem route={{ label: "Logout", icon: LogOut, href: "/auth/login", color: "text-rose-400" }} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <div className="p-2 border-t border-white/[0.06]">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggle}
                        className="w-full h-8 text-white/40 hover:bg-white/8 hover:text-white/70 rounded-lg transition-all"
                    >
                        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Trigger */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Button size="icon" variant="outline" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                    {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
            </div>

            {/* Mobile Sidebar */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-40 md:hidden p-4 pt-16 animate-in slide-in-from-left-80"
                    style={{
                        background: "linear-gradient(180deg, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.95) 100%)",
                        backdropFilter: "blur(24px) saturate(1.8)",
                        WebkitBackdropFilter: "blur(24px) saturate(1.8)",
                    }}>
                    <div className="space-y-0.5">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                to={route.href}
                                onClick={() => setIsMobileOpen(false)}
                            >
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start mb-0.5 rounded-lg relative",
                                        location.pathname === route.href
                                            ? "bg-white/15 text-white backdrop-blur-sm border border-white/10"
                                            : "text-white/60 hover:text-white/90 hover:bg-white/8"
                                    )}
                                >
                                    {location.pathname === route.href && (
                                        <div className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full", route.color?.replace('text-', 'bg-') || 'bg-blue-400')} />
                                    )}
                                    <route.icon className={cn("h-4 w-4 mr-3", location.pathname === route.href ? route.color : "text-white/50")} />
                                    <span className="text-[13px]">{route.label}</span>
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

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
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", accent: "#60a5fa" },
        { label: "Purchase", icon: ShoppingCart, href: "/purchase", accent: "#34d399" },
        { label: "Rate Mgmt (Suda)", icon: TrendingUp, href: "/rate-management", accent: "#2dd4bf" },
        { label: "Production", icon: Factory, href: "/production", accent: "#fbbf24" },
        { label: "Inventory", icon: Package, href: "/inventory", accent: "#818cf8" },
        { label: "Financials", icon: CreditCard, href: "/financials", accent: "#fb7185" },
        { label: "Parchi Register", icon: FileText, href: "/parchis", accent: "#fdba74" },
        { label: "Ledgers", icon: BookOpen, href: "/ledgers", accent: "#22d3ee" },
        { label: "Sales & Dispatch", icon: ShoppingBag, href: "/sales", accent: "#93c5fd" },
        { label: "Scrap", icon: Replace, href: "/scrap", accent: "#38bdf8" },
        { label: "Reports", icon: BarChart3, href: "/reports", accent: "#c084fc" },
        { label: "Alerts & Risk", icon: Bell, href: "/alerts", accent: "#fda4af" },
        { label: "Market Intel", icon: TrendingUp, href: "/market", accent: "#6ee7b7" },
        { label: "Audit Logs", icon: Shield, href: "/audit", accent: "#94a3b8" },
    ];

    const masterRoutes = [
        { label: "Item Master", icon: Package, href: "/masters/items", accent: "#fb923c" },
        { label: "Party Master", icon: Database, href: "/masters/parties", accent: "#93c5fd" },
        { label: "Chart of Accounts", icon: FileText, href: "/masters/coa", accent: "#6ee7b7" },
        { label: "Labor Rates", icon: TrendingUp, href: "/masters/labor-rates", accent: "#fcd34d" },
    ];

    const isActive = (href: string) => location.pathname === href;

    const NavItem = ({ route }: { route: typeof routes[0] }) => {
        const active = isActive(route.href);

        return (
            <Link to={route.href}>
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className={cn(
                                    "group relative flex items-center rounded-xl transition-all duration-200 cursor-pointer",
                                    isCollapsed ? "justify-center h-10 w-10 mx-auto" : "px-3 h-9",
                                    active
                                        ? "text-white"
                                        : "text-white/50 hover:text-white/80"
                                )}
                                style={active ? {
                                    background: `linear-gradient(135deg, ${route.accent}18 0%, ${route.accent}08 100%)`,
                                    boxShadow: `inset 0 0 0 1px ${route.accent}20, 0 0 20px ${route.accent}08`,
                                } : undefined}
                            >
                                {/* Active indicator — glowing dot */}
                                {active && !isCollapsed && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[1px]">
                                        <div className="w-[4px] h-[4px] rounded-full" style={{ background: route.accent, boxShadow: `0 0 6px 2px ${route.accent}60` }} />
                                    </div>
                                )}

                                <route.icon
                                    className={cn("h-[18px] w-[18px] shrink-0 transition-all duration-200", isCollapsed ? "" : "mr-2.5")}
                                    style={active ? { color: route.accent, filter: `drop-shadow(0 0 4px ${route.accent}40)` } : undefined}
                                />

                                {!isCollapsed && (
                                    <span className={cn("text-[13px] font-medium tracking-wide", active && "font-semibold")}>{route.label}</span>
                                )}

                                {/* Hover shimmer for inactive items */}
                                {!active && (
                                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)" }} />
                                )}
                            </div>
                        </TooltipTrigger>
                        {isCollapsed && (
                            <TooltipContent
                                side="right"
                                className="border-0 shadow-2xl px-3 py-1.5 text-[12px] font-medium"
                                style={{
                                    background: "rgba(15,23,42,0.95)",
                                    backdropFilter: "blur(12px)",
                                    color: active ? route.accent : "#e2e8f0",
                                    boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.06)`,
                                }}
                            >
                                {route.label}
                            </TooltipContent>
                        )}
                    </Tooltip>
                </TooltipProvider>
            </Link>
        );
    };

    const SectionDivider = ({ label }: { label: string }) => (
        <>
            {!isCollapsed ? (
                <div className="flex items-center gap-2.5 px-3 pt-3 pb-1">
                    <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.22)" }}>{label}</span>
                    <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />
                </div>
            ) : (
                <div className="mx-3 my-3 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />
            )}
        </>
    );

    return (
        <>
            {/* ════════ DESKTOP SIDEBAR ════════ */}
            <div
                className={cn(
                    "hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    "bg-black/20 backdrop-blur-2xl backdrop-saturate-[180%] border-r border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_rgba(0,0,0,0.3)]",
                    isCollapsed ? "w-16" : "w-60",
                    className
                )}
            >
                {/* Ambient light effect at top */}
                <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% -20%, rgba(96,165,250,0.06) 0%, transparent 70%)" }} />

                {/* ── Logo ── */}
                <div className={cn("relative flex items-center shrink-0 h-14", isCollapsed ? "justify-center" : "px-4")}>
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-lg"
                        style={{
                            background: "linear-gradient(135deg, rgba(96,165,250,0.15) 0%, rgba(96,165,250,0.05) 100%)",
                            boxShadow: "0 0 0 1px rgba(96,165,250,0.15), 0 2px 8px rgba(96,165,250,0.10)",
                        }}>
                        <Zap className="h-4 w-4 text-blue-400 relative z-10" />
                    </div>
                    {!isCollapsed && (
                        <div className="ml-2.5 flex flex-col">
                            <span className="text-[14px] font-bold tracking-tight text-white/90 leading-none">CopperSync</span>
                            <span className="text-[9px] font-medium tracking-[0.15em] uppercase mt-0.5" style={{ color: "rgba(96,165,250,0.5)" }}>ERP SYSTEM</span>
                        </div>
                    )}
                </div>

                {/* Subtle separator under logo */}
                <div className="mx-3 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />

                {/* ── Navigation ── */}
                <ScrollArea className="flex-1 px-2 pt-3 pb-2">
                    <div className="space-y-0.5">
                        {routes.map((route) => (
                            <NavItem key={route.href} route={route} />
                        ))}
                    </div>

                    <SectionDivider label="Masters" />
                    <div className="space-y-0.5">
                        {masterRoutes.map((route) => (
                            <NavItem key={route.href} route={route} />
                        ))}
                    </div>

                    <SectionDivider label="System" />
                    <div className="space-y-0.5">
                        <NavItem route={{ label: "Settings", icon: Settings, href: "/masters/config", accent: "#94a3b8" }} />
                        <NavItem route={{ label: "Logout", icon: LogOut, href: "/auth/login", accent: "#fb7185" }} />
                    </div>
                </ScrollArea>

                {/* ── Collapse toggle ── */}
                <div className="p-2">
                    <div className="h-px mb-2" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggle}
                        className="w-full h-8 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all"
                    >
                        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* ════════ MOBILE TRIGGER ════════ */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Button
                    size="icon"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="border-0 shadow-xl h-10 w-10 rounded-xl"
                    style={{
                        background: "rgba(15,23,42,0.85)",
                        backdropFilter: "blur(12px)",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.7)",
                    }}
                >
                    {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
            </div>

            {/* ════════ MOBILE SIDEBAR ════════ */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 md:hidden p-5 pt-20 animate-in fade-in slide-in-from-left-8 duration-300 bg-black/20 backdrop-blur-2xl backdrop-saturate-[180%]"
                >
                    <div className="space-y-0.5">
                        {routes.map((route) => {
                            const active = isActive(route.href);
                            return (
                                <Link key={route.href} to={route.href} onClick={() => setIsMobileOpen(false)}>
                                    <div
                                        className={cn(
                                            "flex items-center px-3 h-10 rounded-xl transition-all duration-200 relative",
                                            active ? "text-white" : "text-white/50"
                                        )}
                                        style={active ? {
                                            background: `linear-gradient(135deg, ${route.accent}18 0%, ${route.accent}08 100%)`,
                                            boxShadow: `inset 0 0 0 1px ${route.accent}20`,
                                        } : undefined}
                                    >
                                        {active && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2">
                                                <div className="w-[4px] h-[4px] rounded-full" style={{ background: route.accent, boxShadow: `0 0 6px 2px ${route.accent}60` }} />
                                            </div>
                                        )}
                                        <route.icon className="h-[18px] w-[18px] mr-3 shrink-0" style={active ? { color: route.accent } : undefined} />
                                        <span className={cn("text-[13px] font-medium", active && "font-semibold")}>{route.label}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    <SectionDivider label="Masters" />
                    <div className="space-y-0.5">
                        {masterRoutes.map((route) => {
                            const active = isActive(route.href);
                            return (
                                <Link key={route.href} to={route.href} onClick={() => setIsMobileOpen(false)}>
                                    <div
                                        className={cn("flex items-center px-3 h-10 rounded-xl transition-all", active ? "text-white" : "text-white/50")}
                                        style={active ? { background: `linear-gradient(135deg, ${route.accent}18 0%, ${route.accent}08 100%)`, boxShadow: `inset 0 0 0 1px ${route.accent}20` } : undefined}
                                    >
                                        <route.icon className="h-[18px] w-[18px] mr-3 shrink-0" style={active ? { color: route.accent } : undefined} />
                                        <span className={cn("text-[13px] font-medium", active && "font-semibold")}>{route.label}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
}

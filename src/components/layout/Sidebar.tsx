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
    ChevronLeft,
    ChevronRight
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
            label: "Procurement",
            icon: ShoppingCart,
            href: "/procurement",
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
            label: "Sales & Dispatch",
            icon: ShoppingBag,
            href: "/sales",
            color: "text-blue-300",
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
                                "w-full font-medium transition-all duration-300 ease-in-out mb-1",
                                isCollapsed ? "justify-center px-2" : "justify-start px-3",
                                location.pathname === route.href
                                    ? "bg-white text-slate-900 shadow-md hover:bg-white hover:text-slate-900 translate-x-1"
                                    : "text-blue-100 hover:bg-blue-900 hover:text-white hover:translate-x-1"
                            )}
                        >
                            <route.icon
                                className={cn(
                                    "h-5 w-5 shrink-0 transition-colors duration-300",
                                    location.pathname === route.href ? "text-slate-900" : "text-white",
                                    isCollapsed ? "mr-0" : "mr-3"
                                )}
                            />
                            {!isCollapsed && <span>{route.label}</span>}
                        </Button>
                    </TooltipTrigger>
                    {isCollapsed && (
                        <TooltipContent side="right" className="bg-slate-900 text-white border-slate-800">
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
                    "hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40 bg-blue-950 border-r border-blue-900 transition-all duration-300 ease-in-out",
                    isCollapsed ? "w-16" : "w-64",
                    className
                )}
            >
                <div className={cn("flex items-center h-16 shrink-0", isCollapsed ? "justify-center" : "px-4")}>
                    <Zap className="h-6 w-6 text-white shrink-0" />
                    {!isCollapsed && (
                        <h2 className="ml-2 text-lg font-bold tracking-tight text-white whitespace-nowrap">
                            CopperSync
                        </h2>
                    )}
                </div>

                <ScrollArea className="flex-1 px-3 py-2">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            {routes.map((route) => (
                                <SidebarItem key={route.href} route={route} />
                            ))}
                        </div>

                        <div className="py-2">
                            {!isCollapsed && (
                                <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-white/90 uppercase">
                                    Master Data
                                </h2>
                            )}
                            <div className="space-y-1">
                                {masterRoutes.map((route) => (
                                    <SidebarItem key={route.href} route={route} />
                                ))}
                            </div>
                        </div>

                        <div className="py-2">
                            {!isCollapsed && (
                                <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-white/90 uppercase">
                                    System
                                </h2>
                            )}
                            <div className="space-y-1">
                                <SidebarItem route={{ label: "Settings", icon: Settings, href: "/masters/config" }} />
                                <SidebarItem route={{ label: "Logout", icon: LogOut, href: "/auth/login" }} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <div className="p-3 mt-auto border-t border-blue-900/50">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggle}
                        className="w-full h-8 text-white hover:bg-blue-900 hover:text-white"
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
                <div className="fixed inset-0 z-40 bg-blue-950/95 backdrop-blur-sm md:hidden p-4 pt-16 animate-in slide-in-from-left-80">
                    <div className="space-y-1">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                to={route.href}
                                onClick={() => setIsMobileOpen(false)}
                            >
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start mb-1",
                                        location.pathname === route.href
                                            ? "bg-blue-900 text-white"
                                            : "text-white hover:text-white hover:bg-blue-900"
                                    )}
                                >
                                    <route.icon className="h-4 w-4 mr-3 text-white" />
                                    {route.label}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

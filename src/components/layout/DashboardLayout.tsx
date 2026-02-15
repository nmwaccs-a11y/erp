import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("sidebarCollapsed") === "true";
        }
        return false;
    });

    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem("sidebarCollapsed", String(newState));
    };

    const location = useLocation();

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
            <main className={cn("transition-all duration-300 ease-in-out", isCollapsed ? "md:pl-16" : "md:pl-64")}>
                <div className="container py-6 px-4 md:px-8 max-w-7xl mx-auto">
                    <div
                        key={location.pathname}
                        className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both"
                    >
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}

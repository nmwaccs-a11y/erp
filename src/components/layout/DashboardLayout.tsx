import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
};

const pageTransition = {
    type: "spring",
    stiffness: 380,
    damping: 38,
    mass: 0.6,
};

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
                    <motion.div
                        key={location.pathname}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

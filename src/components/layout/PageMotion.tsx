import { motion } from "framer-motion";
import { ReactNode } from "react";

const variants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
};

const transition = {
    type: "spring" as const,
    stiffness: 380,
    damping: 38,
    mass: 0.6,
};

export default function PageMotion({ children }: { children: ReactNode }) {
    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            style={{ willChange: "opacity, transform" }}
        >
            {children}
        </motion.div>
    );
}

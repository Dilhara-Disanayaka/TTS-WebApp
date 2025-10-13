"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface BackgroundCirclesProps {
    title?: string;
    description?: string;
    className?: string;
}

// Sri Lankan flag colors: Orange, Green, Maroon
const SRI_LANKAN_COLORS = {
    border: [
        "border-orange-500/60",    // Orange
        "border-green-600/60",     // Green  
        "border-red-800/60",       // Maroon
        "border-yellow-500/60"    // Yellow 
    ],
    gradient: "from-orange-500/30",
};

const AnimatedGrid = () => (
    <motion.div
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]"
        animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
            duration: 40,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
        }}
    >
        <div className="h-full w-full [background-image:repeating-linear-gradient(100deg,#64748B_0%,#64748B_1px,transparent_1px,transparent_4%)] opacity-20" />
    </motion.div>
);

// Floating Sinhala Letters Component
const FloatingSinhalaLetters = () => {
    const sinhalaLetters = ["අ", "ආ", "ඇ", "ඈ", "ඉ", "ඊ", "උ", "ඌ", "ඍ", "ඎ", "එ", "ඒ", "ඓ", "ඔ", "ඕ", "ඖ", "ක", "ග", "ච", "ජ", "ට", "ඩ", "ණ", "ත", "ද", "න", "ප", "බ", "ම", "ය", "ර", "ල", "ව", "ශ", "ෂ", "ස", "හ", "ළ", "ෆ"];
    const [windowHeight, setWindowHeight] = useState(800); // Fallback height for SSR
    const [letterConfigs, setLetterConfigs] = useState<Array<{
        letter: string;
        delay: number;
        duration: number;
        startX: number;
        endX: number;
    }>>([]);

    useEffect(() => {
        // Update window height on client side
        setWindowHeight(window.innerHeight);

        // Generate letter configurations on client side only
        const configs = Array.from({ length: 20 }).map(() => ({
            letter: sinhalaLetters[Math.floor(Math.random() * sinhalaLetters.length)],
            delay: Math.random() * 10,
            duration: 15 + Math.random() * 10,
            startX: Math.random() * 100,
            endX: Math.random() * 100,
        }));
        setLetterConfigs(configs);

        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Don't render letters until client-side configurations are ready
    if (letterConfigs.length === 0) {
        return <div className="absolute inset-0 overflow-hidden pointer-events-none" />;
    }

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {letterConfigs.map((config, i) => (
                <motion.div
                    key={i}
                    className="absolute text-2xl md:text-5xl font-bold opacity-10 text-white"
                    style={{
                        left: `${config.startX}%`,
                        top: '110%',
                    }}
                    animate={{
                        y: [0, -windowHeight - 100],
                        x: [`${config.startX}%`, `${config.endX}%`],
                        rotate: [0, 360],
                        opacity: [0, 0.3, 0.3, 0],
                    }}
                    transition={{
                        duration: config.duration,
                        delay: config.delay,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                    }}
                >
                    {config.letter}
                </motion.div>
            ))}
        </div>
    );
};

export function BackgroundCircles({
    title = "Background Circles",
    description = "Optional Description",
    className,
}: BackgroundCirclesProps) {
    const router = useRouter();

    const handleEnter = () => {
        router.push("/home");
    };

    return (
        <div
            className={clsx(
                "relative flex h-screen w-full items-center justify-center overflow-hidden",
                "bg-black/5",
                className
            )}
        >
            <AnimatedGrid />
            <FloatingSinhalaLetters />

            {/* Clickable button area covering the circles */}
            <button
                onClick={handleEnter}
                className="absolute h-[480px] w-[480px] rounded-full cursor-pointer hover:scale-105 transition-transform duration-300 z-20 flex flex-col items-center justify-center"
                aria-label="Enter application"
            >
                <motion.div className="absolute h-full w-full">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className={clsx(
                                "absolute inset-0 rounded-full",
                                "border-2 bg-gradient-to-br to-transparent",
                                SRI_LANKAN_COLORS.border[i],
                                SRI_LANKAN_COLORS.gradient
                            )}
                            animate={{
                                rotate: 360,
                                scale: [1, 1.05 + i * 0.05, 1],
                                opacity: [0.8, 1, 0.8],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                            }}
                        >
                            <div
                                className={clsx(
                                    "absolute inset-0 rounded-full mix-blend-screen",
                                    `bg-[radial-gradient(ellipse_at_center,${SRI_LANKAN_COLORS.gradient.replace(
                                        "from-",
                                        ""
                                    )}/10%,transparent_70%)]`
                                )}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Text content inside the circle */}
                <motion.div
                    className="relative z-10 text-center px-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1
                        className={clsx(
                            "text-3xl font-bold tracking-tight md:text-5xl",
                            "bg-gradient-to-b from-slate-100 to-slate-300 bg-clip-text text-transparent",
                            "drop-shadow-[0_0_32px_rgba(255,165,0,0.4)]"
                        )}
                    >
                        {title}
                    </h1>

                    <motion.p
                        className="mt-4 text-sm md:text-lg text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {description}
                    </motion.p>

                    <motion.div
                        className="mt-6 text-xl md:text-2xl font-semibold text-orange-400"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        Enter
                    </motion.div>
                </motion.div>
            </button>

            <div className="absolute inset-0 [mask-image:radial-gradient(90%_60%_at_50%_50%,#000_40%,transparent)]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#FF8C00/30%,transparent_70%)] blur-[120px]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#228B22/15%,transparent)] blur-[80px]" />
            </div>
        </div>
    );
}



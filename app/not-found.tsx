"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Home, ArrowLeft } from "lucide-react"

import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Particles } from "@/components/ui/particles"

export default function NotFoundPage() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
            {/* Background: Particles with primary color */}
            <Particles
                className="absolute inset-0 z-0"
                quantity={80}
                color="#DCF763"
                size={0.6}
                staticity={30}
                ease={60}
            />

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center gap-6 text-center"
            >
                {/* Large 404 */}
                <AnimatedGradientText
                    colorFrom="#DCF763"
                    colorTo="#4AE0A5"
                    speed={0.8}
                    className="text-8xl font-extrabold tracking-tighter sm:text-9xl"
                >
                    404
                </AnimatedGradientText>

                {/* Subtitle */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                >
                    <h2 className="text-2xl font-semibold text-foreground">
                        Page Not Found
                    </h2>
                    <p className="max-w-md text-muted-foreground">
                        The page you&apos;re looking for doesn&apos;t exist or has been moved.
                        Let&apos;s get you back on track.
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-4 pt-4"
                >
                    <Link href="/">
                        <ShinyButton className="h-12 px-8 rounded-lg text-base">
                            <span className="flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                Go Home
                            </span>
                        </ShinyButton>
                    </Link>
                    <Link href="/">
                        <motion.button
                            whileHover={{ x: -3 }}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Go back
                        </motion.button>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    )
}

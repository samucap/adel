"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Loader2, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react"

import { useAuthStore } from "@/stores/authStore"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Meteors } from "@/components/ui/meteors"
import { DotPattern } from "@/components/ui/dot-pattern"
import { cn } from "@/lib/utils"

const signupSchema = z
    .object({
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    })

type SignupForm = z.infer<typeof signupSchema>

export default function SignupPage() {
    const router = useRouter()
    const signup = useAuthStore((s) => s.signup)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
    })

    const onSubmit = async (data: SignupForm) => {
        setIsSubmitting(true)
        try {
            await signup(data.email, data.password)
            toast.success("Account created! 🎉", {
                description: "Welcome to Notable Dough.",
            })
            router.replace("/")
        } catch (err) {
            const message = err instanceof Error ? err.message : "Registration failed"
            toast.error("Sign up failed", { description: message })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
            {/* Background: DotPattern with radial fade */}
            <DotPattern
                glow
                width={24}
                height={24}
                cr={1}
                className={cn(
                    "text-primary/20",
                    "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]"
                )}
            />

            {/* Background: Meteors */}
            <Meteors number={20} className="before:from-primary/40" />

            {/* Signup Card */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md"
            >
                <Card className="border-border/50 bg-card/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-primary/5">
                    <CardHeader className="space-y-3 pb-4 pt-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <AnimatedGradientText
                                colorFrom="#DCF763"
                                colorTo="#4AE0A5"
                                speed={1}
                                className="text-3xl font-bold tracking-tight"
                            >
                                Create Account
                            </AnimatedGradientText>
                        </motion.div>
                        <CardDescription className="text-muted-foreground text-sm">
                            Join Notable Dough and start trading
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-6 pb-2">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Email Field */}
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-2"
                            >
                                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                                    <Mail className="h-3.5 w-3.5" />
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="h-11 rounded-lg bg-background/50 border-border/60 pl-3 text-sm transition-all focus-visible:border-primary/50 focus-visible:ring-primary/30 focus-visible:ring-2"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xs text-destructive"
                                    >
                                        {errors.email.message}
                                    </motion.p>
                                )}
                            </motion.div>

                            {/* Password Field */}
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-2"
                            >
                                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                    <Lock className="h-3.5 w-3.5" />
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="h-11 rounded-lg bg-background/50 border-border/60 pl-3 text-sm transition-all focus-visible:border-primary/50 focus-visible:ring-primary/30 focus-visible:ring-2"
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xs text-destructive"
                                    >
                                        {errors.password.message}
                                    </motion.p>
                                )}
                            </motion.div>

                            {/* Confirm Password Field */}
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="space-y-2"
                            >
                                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    className="h-11 rounded-lg bg-background/50 border-border/60 pl-3 text-sm transition-all focus-visible:border-primary/50 focus-visible:ring-primary/30 focus-visible:ring-2"
                                    {...register("confirmPassword")}
                                />
                                {errors.confirmPassword && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xs text-destructive"
                                    >
                                        {errors.confirmPassword.message}
                                    </motion.p>
                                )}
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="pt-2"
                            >
                                {isSubmitting ? (
                                    <div className="flex h-12 w-full items-center justify-center rounded-lg border border-border bg-card">
                                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                    </div>
                                ) : (
                                    <ShinyButton className="w-full h-12 text-base rounded-lg">
                                        <span className="flex items-center justify-center gap-2">
                                            Create Account
                                            <ArrowRight className="h-4 w-4" />
                                        </span>
                                    </ShinyButton>
                                )}
                            </motion.div>
                        </form>
                    </CardContent>

                    <CardFooter className="flex justify-center border-t-0 pb-8 pt-4">
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-sm text-muted-foreground"
                        >
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors"
                            >
                                Sign in
                            </Link>
                        </motion.p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}

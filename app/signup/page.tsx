"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Loader2, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react"

import { useAuthStore } from "@/stores/authStore"
import { formatAuthError } from "@/lib/auth-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import { Button } from "@/components/ui/button"
import { ParticleNetwork } from "@/components/ui/particle-network"

const passwordSchema = z
    .string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a digit")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character")

const signupSchema = z
    .object({
        email: z.string().email("Please enter a valid email address"),
        password: passwordSchema,
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
        mode: "onBlur",
        reValidateMode: "onBlur",
    })

    const onSubmit = useCallback(
        async (data: SignupForm) => {
            setIsSubmitting(true)
            try {
                await signup(data.email, data.password)
                toast.success("Account created", {
                    description: "Welcome to Notable Dough.",
                })
                router.replace("/")
            } catch (err) {
                toast.error("Sign up failed", { description: formatAuthError(err) })
            } finally {
                setIsSubmitting(false)
            }
        },
        [router, signup]
    )

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
            <ParticleNetwork />

            <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both">
                <Card className="border-border/50 bg-card/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-primary/5">
                    <CardHeader className="space-y-3 pb-4 pt-8 text-center">
                        <div>
                            <AnimatedGradientText
                                colorFrom="#DCF763"
                                colorTo="#4AE0A5"
                                speed={1}
                                className="text-3xl font-bold tracking-tight"
                            >
                                Create Account
                            </AnimatedGradientText>
                        </div>
                        <CardDescription className="text-muted-foreground text-sm">
                            Join Notable Dough and start trading
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-6 pb-2">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                                    <Mail className="h-3.5 w-3.5" />
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    className="h-11 rounded-lg bg-background/50 border-border/60 pl-3 text-sm transition-all focus-visible:border-primary/50 focus-visible:ring-primary/30 focus-visible:ring-2"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-xs text-destructive">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                    <Lock className="h-3.5 w-3.5" />
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="••••••••••••"
                                    className="h-11 rounded-lg bg-background/50 border-border/60 pl-3 text-sm transition-all focus-visible:border-primary/50 focus-visible:ring-primary/30 focus-visible:ring-2"
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <p className="text-xs text-destructive">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="••••••••••••"
                                    className="h-11 rounded-lg bg-background/50 border-border/60 pl-3 text-sm transition-all focus-visible:border-primary/50 focus-visible:ring-primary/30 focus-visible:ring-2"
                                    {...register("confirmPassword")}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <div className="pt-2">
                                {isSubmitting ? (
                                    <div className="flex h-12 w-full items-center justify-center rounded-lg border border-border bg-card">
                                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                    </div>
                                ) : (
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full h-12 rounded-lg text-base gap-2"
                                    >
                                        Create Account
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>

                    <CardFooter className="flex justify-center border-t-0 pb-8 pt-4">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const res = await signIn.email({
                email,
                password,
            })

            if (res.error) {
                setError(res.error.message || "Failed to sign in")
            } else {
                router.push("/dashboard");
            }

        } catch (err) {
            setError(`Unexpected error occured, ${err}`);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4"> 
            <Card className="w-full max-w-md border-gray-200 shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-black">Sign In</CardTitle>
                    <CardDescription className="text-sm font-medium text-gray-500">Sign in to your account</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <CardContent className="space-y-4">
                        {error && 
                            <div className="text-sm rounded-md p-3 text-destructive bg-destructive/25">
                                {error}
                            </div>
                        }
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-800">Email</Label>
                            <Input id="email" type="email" placeholder="max.verstappen@example.com" required 
                            className="border-gray-300 focus:border-primary focus:ring-primary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-800">Password</Label>
                            <Input id="password" type="password" placeholder="••••••••" minLength={6} required 
                            className="border-gray-300 focus:border-primary focus:ring-primary"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2 space-y-4">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                        <p>Don&apos;t have an account? <Link href="/sign-up" className="text-primary hover:underline">Sign up</Link></p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
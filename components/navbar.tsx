"use client";

import { ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useSession } from "@/lib/auth/auth-client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import SignOutBtn from "./sign-out-btn";

export default function NavBar() {
    const { data: session } = useSession();
    return (
        <nav className="border-b border-gray-200 bg-white">
            <div className="container mx-auto flex h-16 items-center px-4 justify-between">
                <Link href="/" className="flex gap-2 text-xl font-bold text-primary">
                    <Briefcase />
                    Jobs Tracker
                </Link>
                <div className="flex items-center gap-2">
                    {session?.user ? (
                        <div className="flex items-center gap-2">
                            <Link href="/dashboard">
                                <Button variant="ghost">Dashboard</Button>
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Avatar className="cursor-pointer">
                                        <AvatarFallback className="bg-primary text-white">
                                            {session.user.name?.[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuGroup>
                                    <DropdownMenuContent className="w-full" align="end">
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm text-black font-medium leading-none">{session.user.name}</p>
                                                <p className="text-xs text-muted-foreground loading-none">{session.user.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <SignOutBtn />
                                    </DropdownMenuContent>
                                </DropdownMenuGroup>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/sign-in">
                                <Button variant={"outline"} className={"px-6 py-3"}>
                                    Log in 
                                </Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button className={"px-6 py-3 hover:bg-primary/90"}>
                                    Get Started <ArrowRight/>
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
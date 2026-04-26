"use client";

import { signOut } from "@/lib/auth/auth-client";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function SignOutBtn() {
    const router = useRouter();
    return (
        <DropdownMenuItem
            className="cursor-pointer text-destructive"
            onClick={async() => {
                const result = await signOut()
                if(result.data) {
                    router.push("/sign-in");
                }else{
                    alert(result.error?.message || "Failed to sign out")
                }
            }}
        >
            Sign Out
        </DropdownMenuItem>
    )
}
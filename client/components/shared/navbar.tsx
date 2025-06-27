"use client"

import { MessageSquare, Settings, User } from "lucide-react"
import Link from "next/link"
import { AuthLogout } from "./auth-logout"
import { useCheckAuthQuery } from "@/store/apiSlice"

export const Navbar = () => {
    const { data } = useCheckAuthQuery()

    return (
        <div className="container mx-auto px-4 h-16">
            <div className="flex items-center justify-between h-full">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                        <div className="size-9 rounded-lg bg-blue-600/20 flex items-center justify-center">
                            <MessageSquare className="size-5 text-blue-500" />
                        </div>
                        <h1 className="text-lg font-bold text-white">Chatty</h1>
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/settings" className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 transition-all px-3 py-2 rounded-lg text-neutral-300 hover:text-white">
                        <Settings className="size-4" />
                        <span className="hidden sm:inline">Настройки</span>
                    </Link>
                    {data &&
                        <>
                            <Link href="/profile" className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 transition-all px-4 py-2 rounded-lg text-neutral-300 hover:text-white">
                                <User className="size-5" />
                                <span className="hidden sm:inline">Профиль</span>
                            </Link>
                            <AuthLogout />
                        </>
                    }
                </div>
            </div>
        </div>
    )
}
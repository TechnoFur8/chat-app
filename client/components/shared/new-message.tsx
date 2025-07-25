"use client"

import { formMessageTime } from "@/lib/form-data"
import { useCheckAuthQuery, useGetOneUserQuery } from "@/store/apiSlice"
import { useSocketStore } from "@/store/socketSlice"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

interface MessageType {
    id: number
    senderId: number
    receiverId: number
    userIdChat: number
    text: string
    createdAt: string
    img: string
}

export const NewMessage = () => {
    const [userSend, setUserSend] = useState(0)
    const [lastMessage, setLastMessage] = useState<MessageType | null>(null)
    const { subscribe, unsubscribe } = useSocketStore()
    const { data } = useCheckAuthQuery()
    const { data: user } = useGetOneUserQuery(userSend)

    useEffect(() => {
        const handleMessage = (msg: MessageType) => {
            if (msg.senderId !== data?.id) {
                setUserSend(msg.senderId)
                setLastMessage(msg)
            }
        }
        subscribe("message", handleMessage)
        return () => unsubscribe("message", handleMessage)
    }, [subscribe, unsubscribe, data?.id])

    useEffect(() => {

        if (user && lastMessage && userSend === lastMessage.senderId) {
            toast.custom((t) => (
                <div
                    className={cn(
                        "max-w-md w-full bg-slate-800 text-white rounded-xl shadow-lg p-4",
                        t.visible ? "animate-enter" : "animate-leave"
                    )}
                >
                    <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10 ring-2 ring-slate-600 flex-shrink-0">
                            <AvatarImage src={user?.img} />
                            <AvatarFallback className="bg-slate-700 font-medium">
                                {user?.fullName[0]}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-grow">
                            <p className="font-semibold text-sm">{user.fullName}</p>
                            <p className="text-slate-200 text-sm mt-1">{lastMessage.text.length > 100 ? lastMessage.text.slice(0, 100) + "..." : lastMessage.text}</p>
                        </div>

                        <div className="flex-shrink-0">
                            <Button
                                onClick={() => toast.dismiss(t.id)}
                                variant="ghost"
                                className="h-6 w-6 p-0 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white"
                            >
                                <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                                <span className="sr-only">Close</span>
                            </Button>
                        </div>
                    </div>
                    <div className="text-right text-xs text-slate-500 mt-2">
                        {formMessageTime(lastMessage.createdAt)}
                    </div>
                </div>
            ))
        }

    }, [lastMessage, user, userSend])

    return null
}
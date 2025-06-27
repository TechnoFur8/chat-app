"use client"

import { useGetOneUserQuery } from "@/store/apiSlice"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { AvatarImage } from "@radix-ui/react-avatar"
import { useSocketStore } from "@/store/socketSlice"
import { MoreHorizontal, Phone, Video } from "lucide-react"
import { Button } from "../ui/button"
import { CallControls } from "./call-controls"

interface Props {
    selectedChat: number
}

export const ChatCompanionUser = ({ selectedChat }: Props) => {
    const { data, isLoading, isError } = useGetOneUserQuery(selectedChat)
    const { onlineUsers, makeCall } = useSocketStore()

    if (isLoading) return (
        <div className="flex items-center gap-3 p-4 border-b border-neutral-700 bg-neutral-800">
            <div className="h-10 w-10 bg-neutral-700 rounded-full animate-pulse" />
            <div className="flex-1">
                <div className="h-4 bg-neutral-700 rounded animate-pulse mb-2" />
                <div className="h-3 bg-neutral-700 rounded w-20 animate-pulse" />
            </div>
        </div>
    )

    if (isError) return (
        <div className="flex items-center justify-center p-4 border-b border-neutral-700 bg-neutral-800">
            <div className="text-red-400">Ошибка загрузки пользователя</div>
        </div>
    )

    const handleCall = async () => {
        if (data?.fullName && selectedChat) {
            await makeCall(String(selectedChat), data.fullName)
        }
    }

    return (
        <div className="flex flex-col border-b border-neutral-700 bg-neutral-800 rounded-lg">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Avatar className="h-10 w-10 ring-2 ring-neutral-700">
                            <AvatarImage src={data?.img} alt={data?.fullName} />
                            <AvatarFallback className="bg-neutral-600 text-white font-medium">
                                {data?.fullName?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        {onlineUsers.includes(String(selectedChat)) && (
                            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-neutral-800" />
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-white">
                            {data?.fullName}
                        </p>
                        <div className="flex items-center gap-2">
                            {onlineUsers.includes(String(selectedChat)) ? (
                                <span className="text-xs text-green-500 font-medium">В сети</span>
                            ) : (
                                <span className="text-xs text-neutral-400">Не в сети</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-neutral-700"
                        onClick={handleCall}
                        title="Позвонить"
                    >
                        <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-neutral-700">
                        <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-neutral-700">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {data && (
                <div className="px-4 pb-4">
                    <CallControls
                        receiverId={String(selectedChat)}
                        receiverName={data.fullName}
                    />
                </div>
            )}
        </div>
    )
}
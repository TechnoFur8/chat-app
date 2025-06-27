"use client"

import { useGetAllUsersQuery } from "@/store/apiSlice"
import { Input } from "../ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { ScrollArea } from "../ui/scroll-area"
import { useSocketStore } from "@/store/socketSlice"
import { Search, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
    setSelectedChat: React.Dispatch<React.SetStateAction<number>>
    selectedChat: number
}

export const ChatSidebar = ({ setSelectedChat, selectedChat }: Props) => {
    const { data, isLoading, isError } = useGetAllUsersQuery()
    const { onlineUsers } = useSocketStore()

    if (isLoading) return (
        <div className="flex items-center justify-center h-full bg-neutral-800">
            <div className="text-neutral-300">Загрузка...</div>
        </div>
    )
    if (isError) return (
        <div className="flex items-center justify-center h-full bg-neutral-800">
            <div className="text-red-400">Ошибка загрузки</div>
        </div>
    )

    return (
        <div className="flex flex-col h-full bg-neutral-800 border-r border-neutral-700">
            <div className="p-4 border-b border-neutral-700">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-neutral-400" />
                    <h2 className="text-lg font-semibold text-white">Чаты</h2>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                        placeholder="Поиск пользователей..."
                        className="pl-10 bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:bg-neutral-600 transition-colors"
                    />
                </div>
            </div>
            <ScrollArea className="max-h-full">
                {data?.user.map(user => (
                    <div
                        key={user.id}
                        onClick={() => setSelectedChat(user.id)}
                        className={cn(
                            "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-neutral-700/50 group",
                            selectedChat === user.id
                                ? "bg-neutral-700 border border-neutral-600 shadow-sm"
                                : "hover:border-neutral-600/50"
                        )}
                    >
                        <div className="relative">
                            <Avatar className="h-12 w-12 ring-2 ring-neutral-700">
                                <AvatarImage src={user.img} alt={user.fullName} />
                                <AvatarFallback className="bg-neutral-600 text-white font-medium">
                                    {user.fullName?.[0]?.toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            {onlineUsers.includes(String(user.id)) && (
                                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-neutral-800" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">
                                {user.fullName}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                {onlineUsers.includes(String(user.id)) ? (
                                    <span className="text-xs text-green-500 font-medium">В сети</span>
                                ) : (
                                    <span className="text-xs text-neutral-400">Не в сети</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </ScrollArea>
        </div>
    )
}
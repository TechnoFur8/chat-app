"use client"

import { useCheckAuthQuery, useGetMessagesQuery, useMarkMessageAsReadMutation } from "@/store/apiSlice"
import { useSocketStore } from "@/store/socketSlice"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { formMessageTime } from "@/lib/form-data"
import { ChatInput } from "./chat-input"
import { ScrollArea } from "../ui/scroll-area"
import { ChatCompanionUser } from "./chat-companion-user"
import { MessageCircle } from "lucide-react"
import { ChatCheck } from "./chat-check"

interface Props {
    selectedChat: number
}

interface MessageType {
    id: number
    senderId: number
    receiverId: number
    userIdChat: number
    text: string
    createdAt: string
}

export const ChatContainer = ({ selectedChat }: Props) => {
    const { data, isLoading, isError, refetch } = useGetMessagesQuery(selectedChat)
    const [messageCheck] = useMarkMessageAsReadMutation()
    const { data: user } = useCheckAuthQuery()
    const { subscribe, unsubscribe } = useSocketStore()

    const messageEndRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (selectedChat) {
            refetch()
        }
    }, [selectedChat, refetch])

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "auto" })
        }
    }, [data])

    useEffect(() => {
        const handleMessage = (msg: MessageType) => {
            console.log("Получено сообщение в чате:", msg)
            console.log("Текущий выбранный чат:", selectedChat)

            if (
                msg.userIdChat == selectedChat ||
                msg.senderId == selectedChat ||
                msg.receiverId == selectedChat
            ) {
                refetch()
            }
        }

        subscribe("message", handleMessage)

        return () => {
            unsubscribe("message", handleMessage)
        }
    }, [subscribe, unsubscribe, refetch, selectedChat, user?.id])

    useEffect(() => {
        if (data && data.length > 0 && selectedChat && user?.id) {
            const hasUnread = data.some(
                msg => msg.receiverId === user.id && !msg.readUserMessage
            )
            if (hasUnread) {
                console.log('Вызов messageCheck', selectedChat)
                messageCheck(selectedChat)
            }
        }
    }, [data, selectedChat, user?.id, messageCheck])

    useEffect(() => {
        const handleMessageRead = (data: { chattedWith: number }) => {
            if (data.chattedWith === selectedChat) {
                refetch()
            }
        }

        useSocketStore.getState().subscribe("message-read", handleMessageRead)

        return () => {
            useSocketStore.getState().unsubscribe("message-read", handleMessageRead)
        }
    }, [selectedChat, refetch])

    if (isLoading) return (
        <div className="flex items-center justify-center h-full w-full bg-neutral-900">
            <div className="text-neutral-300">Загрузка сообщений...</div>
        </div>
    )
    if (isError) return (
        <div className="flex items-center justify-center h-full w-full bg-neutral-900">
            <div className="text-red-400">Ошибка загрузки сообщений</div>
        </div>
    )

    return (
        <div className="flex flex-col h-full w-full bg-neutral-900">
            <div className=" p-4 border-b border-neutral-700">
                <ChatCompanionUser selectedChat={selectedChat} />
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
                <ScrollArea className="h-full w-full">
                    <div className="py-4 space-y-4 px-4">
                        {data && data.length > 0 ? (
                            data?.map(el => {
                                const isMessage = el.senderId === user?.id
                                return (
                                    <div key={el.id}>
                                        <div className={cn("flex", isMessage ? "justify-end" : "justify-start")}>
                                            <div className={cn("max-w-[70%] rounded-2xl px-4 py-3 shadow-sm flex space-x-1", isMessage
                                                ? "bg-blue-600 text-white rounded-br-md"
                                                : "bg-neutral-800 text-white rounded-bl-md border border-neutral-700"
                                            )}>
                                                <p className="break-all text-sm leading-relaxed">{el.text}</p>
                                                <p className={cn("text-xs mt-2 opacity-70 text-white", isMessage ? "text-right" : "text-left")}>
                                                    {formMessageTime(el.createdAt)}
                                                </p>
                                                {isMessage && <ChatCheck isRead={el.readUserMessage} />}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <MessageCircle className="size-12 text-neutral-400 mb-4" />
                                <p className="text-neutral-300">Нет сообщений</p>
                                <p className="text-sm text-neutral-400 mt-1">Начните разговор, отправив первое сообщение</p>
                            </div>
                        )}
                        <div ref={messageEndRef} />
                    </div>
                </ScrollArea>
            </div>

            <div className="border-t border-neutral-700 p-4 bg-neutral-900 w-full">
                <ChatInput receiverId={selectedChat} />
            </div>

        </div>
    )
}
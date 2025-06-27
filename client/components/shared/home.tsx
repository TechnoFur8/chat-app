"use client"

import { useState } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { ChatNoChat } from "./chat-no-chat"
import { ChatContainer } from "./chat-container"
import { NewMessage } from "./new-message"

export const Home = () => {
    const [selectedChat, setSelectedChat] = useState<number>(0)

    return (
        <div className={"h-screen bg-neutral-900"}>
            <NewMessage selectedChat={selectedChat} />
            <div className={"pt-20 px-4 h-full"}>
                <div className={"bg-neutral-800 rounded-lg shadow-lg w-full h-[calc(100vh-8rem)] border border-neutral-700"}>
                    <div className={"flex h-full rounded-lg"}>
                        <div className={"w-80 border-r border-neutral-700 flex-shrink-0"}>
                            <ChatSidebar setSelectedChat={setSelectedChat} selectedChat={selectedChat} />
                        </div>
                        <div className={"w-full"}>
                            {selectedChat === 0
                                ?
                                <ChatNoChat />
                                :
                                <ChatContainer selectedChat={selectedChat} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
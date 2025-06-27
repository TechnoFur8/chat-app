"use client"

import { useState } from "react"
import { useSendMessageMutation } from "@/store/apiSlice"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import toast from "react-hot-toast"
import { Send, Paperclip, Smile } from "lucide-react"

interface Props {
    receiverId: number
}

export const ChatInput = ({ receiverId }: Props) => {
    const [text, setText] = useState("")
    const [postMessage, { isLoading }] = useSendMessageMutation()

    const handleSend = async () => {
        if (!text.trim()) return

        const messageData = {
            receiverId: String(receiverId),
            text: text,
            createdAt: new Date().toISOString()
        }

        try {
            await postMessage({
                id: Number(receiverId),
                body: messageData
            }).unwrap()
            setText("")
        } catch (err) {
            console.error(err)
            toast.error("Что-то пошло не так")
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="flex items-end gap-2">
            <div className="flex items-center gap-2 flex-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-neutral-700">
                    <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-neutral-700">
                    <Smile className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex-1 relative">
                <Textarea
                    placeholder="Написать сообщение..."
                    className="min-h-[44px] max-h-32 resize-none border-neutral-600 bg-neutral-800 text-white placeholder:text-neutral-400 focus:bg-neutral-700 transition-colors pr-12"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={{ height: "auto" }}
                />
            </div>

            <Button
                onClick={handleSend}
                disabled={isLoading || !text.trim()}
                size="sm"
                className="h-[44px] w-[44px] p-0 bg-blue-600 hover:bg-blue-700 text-white"
            >
                <Send className="h-4 w-4" />
            </Button>
        </div>
    )
}
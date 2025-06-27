"use client"

import { useSocketStore } from "@/store/socketSlice"
import { Phone, PhoneOff, Volume } from "lucide-react"
import { useEffect, useRef } from "react"
import { Button } from "../ui/button"


export const CallIncomingNotification = () => {
    const { callState, answerCall, rejectCall, setBusy } = useSocketStore()
    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        if (callState.isIncomingCall && audioRef.current) {
            audioRef.current.play().catch(console.error)
        } else if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }
    }, [callState.isIncomingCall])

    if (!callState.isIncomingCall) return null

    return (
        <div className={"fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border p-4 min-2-80"}>
            <audio ref={audioRef} loop src="/Cat.mp3" />
            <div className={"flex items-center gap-3 mb-4"}>
                <div className={"size-12 bg-green-100 rounded-full flex items-center justify-center"}>
                    <Phone className={"size-6 text-green-600"} />
                </div>
                <div className={"flex-1"}>
                    <h3 className={"font-semibold text-neutral-900"}>Входящий звонок</h3>
                    <p className={"text-sm text-neutral-600"}>{callState.callerName}</p>
                </div>
                <Volume className={"size-5 text-neutral-400 animate-pulse"} />
            </div>
            <div className={"flex gap-2"}>
                <Button onClick={answerCall} className={"flex-1 bg-green-600 hover:bg-green-700"} size={"sm"}>
                    <Phone className={"size-4 mr-2"} />
                    Принять
                </Button>
                <Button onClick={() => rejectCall()} variant={"destructive"} size={"sm"}>
                    <PhoneOff />
                    Отклонить
                </Button>
                <Button onClick={setBusy} variant={"outline"} size={"sm"}>
                    Занято
                </Button>
            </div>
        </div>
    )
}
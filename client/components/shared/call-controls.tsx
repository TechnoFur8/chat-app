"use client"

import { useSocketStore } from "@/store/socketSlice"
import { useEffect, useRef } from "react"
import { Button } from "../ui/button"
import { Phone, PhoneOff } from "lucide-react"


interface Props {
    receiverId?: string
    receiverName?: string
}

export const CallControls = ({ receiverId, receiverName }: Props) => {
    const { callState, makeCall, answerCall, rejectCall, endCall, setBusy } = useSocketStore()

    const localAudioRef = useRef<HTMLAudioElement>(null)
    const remoteAudioRef = useRef<HTMLAudioElement>(null)
    const ringtoneRef = useRef<HTMLAudioElement>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (callState.localStream && localAudioRef.current) {
            localAudioRef.current.srcObject = callState.localStream
        }
    }, [callState.localStream])

    useEffect(() => {
        if (callState.remoteStream && remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = callState.remoteStream
        }
    }, [callState.remoteStream])

    // const handleMakeCall = async () => {
    //     if (receiverId && receiverName) {
    //         await makeCall(receiverId, receiverName)
    //     }
    // }

    const handleAnswerCall = async () => {
        await answerCall()
    }

    const handleRejectCall = () => {
        rejectCall()
    }

    const handleEndCall = () => {
        endCall()
    }

    const handleSetBusy = () => {
        setBusy()
    }

    useEffect(() => {
        if (callState.isOutgoingCall) {
            intervalRef.current = setInterval(() => {
                if (ringtoneRef.current) {
                    ringtoneRef.current.currentTime = 0
                    ringtoneRef.current.play()
                }
            }, 2000)
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
            if (ringtoneRef.current) {
                ringtoneRef.current.pause()
                ringtoneRef.current.currentTime = 0
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
            if (ringtoneRef.current) {
                ringtoneRef.current.pause()
                ringtoneRef.current.currentTime = 0
            }
        }
    }, [callState.isOutgoingCall])

    return (
        <div className={"flex flex-col gap-4"}>
            <audio ref={localAudioRef} autoPlay muted />
            <audio ref={remoteAudioRef} autoPlay />

            {callState.isOutgoingCall && (
                <>
                    <audio ref={ringtoneRef} src="/Sound_01352 (mp3cut.net).mp3" />
                    <div className={"flex flex-col items-center gap-4 p-4 bg-blue-50 rounded-lg border"}>
                        <div className={"text-center"}>
                            <h3 className={"font-semibold text-blue-800"}>Исходящий звонок</h3>
                            <p className={"text-sm text-blue-600"}>{receiverName}</p>
                        </div>
                        <div className={"flex gap-2"}>
                            <Button size={"lg"} variant={"destructive"} onClick={handleEndCall}>
                                <PhoneOff className={"size-5 mr-2"} />
                                Отменить
                            </Button>
                        </div>
                    </div>
                </>
            )}

            {callState.isIncomingCall && (
                <div className={"flex flex-col items-center gap-4 p-4 bg-green-50 rounded-lg border"}>
                    <div className={"text-center"}>
                        <h3 className={"font-semibold text-green-800"}>Входящий звонок</h3>
                        <p className={"text-sm text-green-600"}>{callState.callerName}</p>
                    </div>
                    <div className={"flex gap-2"}>
                        <Button onClick={handleAnswerCall} className={"bg-green-600 hover:bg-green-700"} size={"lg"}>
                            <Phone className={"size-5 mr-2"} />
                            Принять
                        </Button>
                        <Button onClick={handleRejectCall} variant={"destructive"} size={"lg"}>
                            <PhoneOff className={"size-5 mr-2"} />
                            Отклонить
                        </Button>
                        <Button onClick={handleSetBusy} variant={"outline"} size={"lg"}>
                            Занято
                        </Button>
                    </div>
                </div>
            )}

            {callState.isInCall && (
                <div className={"flex flex-col items-center gap-4 p-4 bg-purple-50 rounded-lg border"}>
                    <div className={"text-center"}>
                        <h3 className={"font-semibold text-purple-800"}>Активный звонок</h3>
                        <p className={"text-sm text-purple-600"}>{callState.callerName || receiverName}</p>
                    </div>
                    <div className={"flex gap-2"}>
                        <Button onClick={handleEndCall} variant={"destructive"} size={"lg"}>
                            <PhoneOff className={"size-5 mr-2"} />
                            Завершить
                        </Button>
                    </div>
                </div>
            )}

            {/* {!callState.isIncomingCall && !callState.isOutgoingCall && !callState.isInCall && receiverId && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-neutral-700"
                    onClick={handleMakeCall}
                    title="Позвонить"
                >
                    <Phone className="h-4 w-4" />
                </Button>
            )} */}
        </div>
    )
}
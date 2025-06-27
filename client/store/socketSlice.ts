import { io, Socket } from "socket.io-client"
import { create } from "zustand"

interface CallState {
    isIncomingCall: boolean
    isOutgoingCall: boolean
    isInCall: boolean
    callerId: string | null
    callerName: string | null
    receiverId: string | null
    peerConnection: RTCPeerConnection | null
    localStream: MediaStream | null
    remoteStream: MediaStream | null
    incomingOffer?: RTCSessionDescriptionInit | null
}

interface SocketState {
    socket: Socket | null
    isConnected: boolean
    connect: (token: string) => void
    onlineUsers: string[]
    wasConnected: boolean
    sendMessage: (payload: { receiverId: string, text: string, img?: string, createdAt: string }) => void
    disconnect: () => void
    subscribe: (event: string, callback: (data: any) => void) => void
    unsubscribe: (event: string, callback: (data: any) => void) => void
    callState: CallState
    makeCall: (receiverId: string, receiverName: string) => Promise<void>
    answerCall: () => Promise<void>
    rejectCall: (reason?: string) => void
    endCall: () => void
    setBusy: () => void
}

const initialCallState: CallState = {
    isIncomingCall: false,
    isOutgoingCall: false,
    isInCall: false,
    callerId: null,
    callerName: null,
    receiverId: null,
    peerConnection: null,
    localStream: null,
    remoteStream: null,
    incomingOffer: null
}

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    isConnected: false,
    onlineUsers: [],
    wasConnected: false,
    callState: initialCallState,

    connect: (token) => {
        if (get().isConnected || get().socket) return

        const socket = io("http://localhost:5000", {
            query: {
                userId: localStorage.getItem("userId")
            },
            auth: { token },
            transports: ["websocket"],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000
        })

        socket.on("connect", () => {
            console.log("Подключение установлено")
            set({ isConnected: true, wasConnected: true })
        })

        socket.on("disconnect", () => {
            console.log("Подключение разорвано")
            set({ isConnected: false })
        })

        socket.on("getOnlineUsers", (users: string[]) => {
            console.log("Пользователи онлайн", users)
            set({ onlineUsers: users })
        })

        socket.on("call:answer", async ({ answer, from }) => {
            const { peerConnection } = get().callState

            if (peerConnection) {
                try {
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
                    console.log("Ответ на звонок установлен")
                    set(state => ({
                        callState: {
                            ...state.callState,
                            isOutgoingCall: false,
                            isInCall: true
                        }
                    }))
                } catch (err) {
                    console.error("Ошибка установки ответа на звонок", err)
                }
            }
        })

        socket.on("call:ice-candidate", async ({ candidate, from }) => {
            const { peerConnection } = get().callState

            if (peerConnection) {
                try {
                    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
                    console.log("ICE кандидат установлен")
                } catch (err) {
                    console.error("Ошибка установки кандидата", err)
                }
            }
        })

        socket.on("call:reject", ({ from, reason }) => {
            console.log("Звонок отклонен", reason)
            set(state => ({
                callState: {
                    ...initialCallState,
                    isOutgoingCall: false
                }
            }))
        })

        socket.on("call:end", ({ from }) => {
            console.log("Звонок завершен", from)
            const { peerConnection, localStream } = get().callState
            if (peerConnection) {
                peerConnection.close()
            }
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop())
            }
            set(state => ({
                callState: initialCallState
            }))
        })

        socket.on("call:busy", ({ from }) => {
            console.log("Пользователь занят")
            set(state => ({
                callState: {
                    ...initialCallState,
                    isOutgoingCall: false
                }
            }))
        })

        socket.on("call:offer", async ({ offer, callerId, callerName, from }) => {
            console.log("call:offer получен на клиенте", offer, callerId, callerName, from);
            set(state => ({
                callState: {
                    ...state.callState,
                    isIncomingCall: true,
                    callerId,
                    callerName,
                    receiverId: from,
                    incomingOffer: offer
                }
            }))
        })

        set({ socket })

    },

    disconnect: () => {
        get().socket?.disconnect()
        set({ socket: null, isConnected: false })
    },

    subscribe: (event, callback) => {
        get().socket?.on(event, callback)
    },

    unsubscribe: (event, callback) => {
        get().socket?.off(event, callback)
    },

    sendMessage: ({ receiverId, text, img, createdAt }) => {
        const socket = get().socket
        if (!socket) return
        socket.emit("sendMessage", { receiverId, text, img, createdAt })
    },

    makeCall: async (receiverId: string, receiverName: string) => {

        const socket = get().socket
        if (!socket) return

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            })

            const peerConnection = new RTCPeerConnection({
                iceServers: [
                    { urls: "stun:stun.l.google.com:19302" },
                    { urls: "stun:stun1.l.google.com:19302" }
                ]
            })

            stream.getTracks().forEach(track => {
                peerConnection.addTrack(track, stream)
            })

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit("call:ice-candidate", {
                        to: receiverId,
                        candidate: event.candidate
                    })
                }
            }

            peerConnection.ontrack = (event) => {
                set(state => ({
                    callState: {
                        ...state.callState,
                        remoteStream: event.streams[0]
                    }
                }))
            }

            const offer = await peerConnection.createOffer()
            await peerConnection.setLocalDescription(offer)

            socket.emit("call:offer", {
                to: receiverId,
                offer,
                callerId: localStorage.getItem("userId"),
                callerName: localStorage.getItem("userName") || "Пользователь"
            })

            set(state => ({
                callState: {
                    ...state.callState,
                    isOutgoingCall: true,
                    receiverId,
                    peerConnection,
                    localStream: stream
                }
            }))

            console.log("Звонок инициирован к ", receiverName)
        } catch (err) {
            console.error("Ошибка инициирования звонка", err)
        }
    },

    answerCall: async () => {
        const socket = get().socket
        const { callerId, peerConnection, incomingOffer } = get().callState
        if (!socket || !callerId || !incomingOffer) return

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            })

            let pc = peerConnection

            if (!pc) {
                pc = new RTCPeerConnection({
                    iceServers: [
                        { urls: "stun:stun.l.google.com:19302" },
                        { urls: "stun:stun1.l.google.com:19302" }
                    ]
                })

                stream.getTracks().forEach(track => {
                    pc?.addTrack(track, stream)
                })

                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit("call:ice-candidate", {
                            to: callerId,
                            candidate: event.candidate
                        })
                    }
                }

                pc.ontrack = (event) => {
                    set(state => ({
                        callState: {
                            ...state.callState,
                            remoteStream: event.streams[0]
                        }
                    }))
                }
            }

            await pc.setRemoteDescription(new RTCSessionDescription(incomingOffer))

            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)

            socket.emit("call:answer", {
                to: callerId,
                answer
            })

            set(state => ({
                callState: {
                    ...state.callState,
                    isIncomingCall: false,
                    isInCall: true,
                    peerConnection: pc,
                    localStream: stream,
                    incomingOffer: null,
                    callerId: state.callState.callerId,
                    receiverId: localStorage.getItem("userId")
                }
            }))

            console.log("Звонок принят")
        } catch (err) {
            console.error("Ошибка принятия звонка", err)
        }
    },

    rejectCall: (reason = "Отклонено пользователем") => {
        const socket = get().socket
        const { callerId } = get().callState
        if (!socket || !callerId) return

        socket.emit("call:reject", {
            to: callerId,
            reason
        })

        set(state => ({
            callState: initialCallState
        }))

        console.log("Звонок отклонен")
    },

    endCall: () => {
        const socket = get().socket
        const { receiverId, callerId, peerConnection, localStream } = get().callState
        if (!socket) return

        const targetId = callerId || receiverId

        console.log("endCall: звонящий, receiverId (userId):", receiverId)

        if (receiverId) {
            socket.emit("call:end", { to: receiverId })
        }

        if (callerId) {
            socket.emit("call:end", { to: callerId })
        }

        if (targetId) {
            socket.emit("call:end", { to: targetId })
        }

        if (peerConnection) {
            peerConnection.close()
        }

        if (localStream) {
            localStream.getTracks().forEach(track => track.stop())
        }

        set(state => ({
            callState: initialCallState
        }))

        console.log("Звонок завершен")
    },

    setBusy: () => {
        const socket = get().socket
        const { callerId } = get().callState
        if (!socket || !callerId) return

        socket.emit("call:busy", { to: callerId })

        set(state => ({
            callState: initialCallState
        }))

        console.log("Занято")
    },
}))
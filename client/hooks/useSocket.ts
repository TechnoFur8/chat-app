// import { useEffect } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { RootState } from "@/store/store"
// import { connectSocket, disconnectSocket, setConnectionStatus } from "@/store/socketSlice"

// export const useSocket = () => {
//     const dispatch = useDispatch()
//     const { socket, isConnected } = useSelector((state: RootState) => state.socket)

//     const connect = (token: string) => {
//         dispatch(connectSocket(token))
//     }

//     const disconnect = () => {
//         dispatch(disconnectSocket())
//     }

//     useEffect(() => {
//         // Очистка при размонтировании компонента
//         return () => {
//             if (socket) {
//                 socket.disconnect()
//             }
//         }
//     }, [socket])

//     return {
//         socket,
//         isConnected,
//         connect,
//         disconnect
//     }
// } 
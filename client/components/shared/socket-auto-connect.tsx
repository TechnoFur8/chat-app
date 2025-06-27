"use client"

import { useCheckAuthQuery } from "@/store/apiSlice"
import { useSocketStore } from "@/store/socketSlice"
import { useEffect } from "react"

export const SocketAutoConnect = () => {
    const { data, isSuccess } = useCheckAuthQuery()
    const connect = useSocketStore((state) => state.connect)
    const isConnected = useSocketStore((state) => state.isConnected)

    useEffect(() => {
        if (isSuccess && data && !isConnected) {
            connect("dummy")
        }
    }, [isSuccess, data, isConnected, connect])

    return null
} 
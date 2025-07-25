"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { getCookie } from "cookies-next"

export const useSocket = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const token = getCookie("jwt")
        if (token) {
            // Здесь должна быть логика подключения к сокету
            console.log("Token found:", token)
        }
    }, [dispatch])
}
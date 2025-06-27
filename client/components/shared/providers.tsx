"use client"

import { store } from "@/store/store"
import { PropsWithChildren } from "react"
import { Provider } from 'react-redux'
import { Navbar } from "./navbar"
import { SocketAutoConnect } from "./socket-auto-connect"

export const Providers = ({ children }: PropsWithChildren) => {
    return (
        <Provider store={store}>
            <SocketAutoConnect />
            <header className={"bg-neutral-900 border-b border-gray-300 fixed w-full top-0 z-40 backdrop-blur-lg"}>
                <Navbar />
            </header>
            <main>
                {children}
            </main>
        </Provider>
    )
}
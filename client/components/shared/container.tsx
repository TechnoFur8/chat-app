import { PropsWithChildren } from "react"

export const Container = ({ children }: PropsWithChildren) => {
    return (
        <div className={"max-w-screen"}>
            {children}
        </div>
    )
}
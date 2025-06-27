"use client"

import { Check, CheckCheck } from "lucide-react"

interface Props {
    isRead: boolean
}

export const ChatCheck = ({ isRead }: Props) => {

    return (
        <span>
            {isRead ?
                <CheckCheck />
                :
                <Check />
            }
        </span>
    )
}
import { Mail, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

interface Props {
    name?: string
    email?: string
    img?: string
    createdAt?: string
}

export const ProfilMy = ({ name, email, img, createdAt }: Props) => {
    return (
        <div className="flex items-center flex-col gap-4">
            <Avatar className="size-32 ring-4 ring-neutral-700">
                <AvatarImage src={img} />
                <AvatarFallback className="text-2xl bg-neutral-600 text-white">{name && name[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-6 w-full">
                <div className="space-y-1.5">
                    <div className="text-sm text-neutral-400 flex items-center gap-2">
                        <User className="size-4" />
                        <span>Имя пользователя</span>
                    </div>
                    <p className="px-4 py-2.5 bg-neutral-700 text-white rounded-lg border border-neutral-600 w-full">{name}</p>
                </div>
                <div className="space-y-1.5">
                    <div className="text-sm text-neutral-400 flex items-center gap-2">
                        <Mail className="size-4" />
                        <span>Email</span>
                    </div>
                    <p className="px-4 py-2.5 bg-neutral-700 text-white rounded-lg border border-neutral-600">{email}</p>
                </div>
            </div>
            <div className="mt-6 bg-neutral-700 rounded-xl p-6 w-full border border-neutral-600">
                <h2 className="text-lg font-medium mb-4 text-white">Информация об аккаунте</h2>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-neutral-600">
                        <span className="text-neutral-300">Дата регистрации</span>
                        <span className="text-white">{createdAt?.split("T")[0]}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span className="text-neutral-300">Статус аккаунта</span>
                        <span className="text-green-500">Онлайн</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
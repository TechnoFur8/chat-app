import { MessageSquare, Users } from "lucide-react"

export const ChatNoChat = () => {
    return (
        <div className=" h-full flex flex-1 flex-col items-center justify-center p-16 bg-neutral-900">
            <div className="max-w-md text-center space-y-6">
                <div className="flex justify-center gap-4 mb-4">
                    <div className="relative">
                        <div className="size-20 rounded-2xl bg-blue-600/20 flex items-center justify-center animate-bounce">
                            <MessageSquare className="w-10 h-10 text-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">Добро пожаловать в Chatty!</h2>
                    <p className="text-neutral-300 leading-relaxed">
                        Выберите пользователя из списка слева, чтобы начать общение.
                    </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-neutral-400">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Все ваши чаты появятся здесь</span>
                </div>
            </div>
        </div>
    )
}
import { useLogoutMutation } from "@/store/apiSlice"
import toast from "react-hot-toast"
import { Button } from "../ui/button"
import { LoaderCircle, LogOut } from "lucide-react"
import { useSocketStore } from "@/store/socketSlice"

export const AuthLogout = () => {
    const [logout, { isLoading }] = useLogoutMutation()
    const { disconnect } = useSocketStore()

    const handleClickLogout = async () => {
        try {
            await logout().unwrap()
            disconnect()
            window.location.href = "/auth/login"
            toast.success("Вы успешно вышли из аккаунта")
        } catch (err) {
            console.error(err)
            toast.error("Что-то пошло не так")
        }
    }

    return (
        <Button className={"flex gap-2 items-center cursor-pointer bg-blue-600 hover:bg-blue-700"} onClick={handleClickLogout}>
            {isLoading
                ?
                <LoaderCircle className={"size-5 animate-spin"} />
                :
                <LogOut className={"size-5"} />}
            <span className="hidden sm:inline">Выйти</span>
        </Button>
    )
}
"use client"

import { useLoginMutation } from "@/store/apiSlice"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, MessageSquare, Lock, LoaderCircle, EyeOff, Eye } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { AuthImagePattern } from "./auth-image-pattern"
import { Button } from "../ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSocketStore } from "@/store/socketSlice"

export const AuthLogin = () => {
    const router = useRouter()
    const [login, { isLoading }] = useLoginMutation()
    const [checkPassword, setCheckPassword] = useState(false)
    const connectSocket = useSocketStore((state) => state.connect)

    const formSchema = z.object({
        email: z.string().email({ message: "Введите корректный email" }),
        password: z.string().min(8, { message: "Пароль должен быть не менее 8 символов" }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const result = await login({
                email: data.email,
                password: data.password,
            }).unwrap()
            localStorage.setItem("userId", String(result.loginUser.id))
            localStorage.setItem("userName", String(result.loginUser.fullName))
            connectSocket(result.token)
            router.push("/")
            toast.success("Вы успешно вошли")
        } catch (err) {
            console.error(err)
            toast.error("Что-то пошло не так")
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-neutral-900">
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-12 rounded-2xl bg-blue-600/20 flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                                <MessageSquare className="size-6 text-blue-500" />
                            </div>
                            <h1 className="text-2xl font-bold text-white">Добро пожаловать</h1>
                            <span className="text-neutral-400">Войдите в свой аккаунт</span>
                        </div>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-300">Почта</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail className="size-5 text-neutral-400" />
                                                </div>
                                                <Input
                                                    className="w-full pl-10 bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-400 focus:bg-neutral-700 focus:border-neutral-500"
                                                    type="email"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-300">Пароль</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="size-5 text-neutral-400" />
                                                </div>
                                                <Input
                                                    className="w-full pl-10 bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-400 focus:bg-neutral-700 focus:border-neutral-500"
                                                    type={checkPassword ? "text" : "password"}
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    className="cursor-pointer absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-300"
                                                    onClick={() => setCheckPassword(!checkPassword)}
                                                >
                                                    {checkPassword
                                                        ?
                                                        <Eye className="size-5" />
                                                        :
                                                        <EyeOff className="size-5" />
                                                    }
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                disabled={isLoading}
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {isLoading && <LoaderCircle className="animate-spin size-5 mr-2" />}
                                Войти
                            </Button>
                        </form>
                    </Form>
                    <div className="text-center">
                        <p className="text-neutral-400">Еще нет аккаунта?{" "}
                            <Link className="text-blue-500 underline underline-offset-2 hover:text-blue-400 transition-colors" href="/auth/signup">Зарегистрируйтесь</Link>
                        </p>
                    </div>
                </div>
            </div>
            <AuthImagePattern title="С возвращением" subtitle="Войдите, чтобы продолжить общение" />
        </div>
    )
}
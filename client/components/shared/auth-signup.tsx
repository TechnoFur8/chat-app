"use client"

import { useSignupMutation } from "@/store/apiSlice"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Eye, EyeOff, Mail, MessageSquare, User, Lock, LoaderCircle } from "lucide-react"
import Link from "next/link"
import { AuthImagePattern } from "./auth-image-pattern"
import toast from "react-hot-toast"
import { useSocketStore } from "@/store/socketSlice"
import { useRouter } from "next/navigation"

export const AuthSignup = () => {
    const rounter = useRouter()
    const [signup, { isLoading }] = useSignupMutation()
    const [checkPassword, setCheckPassword] = useState(false)
    const connectSocket = useSocketStore((state) => state.connect)

    const formSchema = z.object({
        fullName: z.string().min(2, { message: "Имя должно быть не менее 2 символов" }),
        email: z.string().email({ message: "Введите корректный email" }),
        password: z.string().min(8, { message: "Пароль должен быть не менее 8 символов" }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const result = await signup ({
                fullName: data.fullName,
                email: data.email,
                password: data.password
            }).unwrap()
            localStorage.setItem("userId", String(result.signupUser.id))
            localStorage.setItem("userName", String(result.signupUser.fullName))
            connectSocket(result.token)
            rounter.push("/")
            toast.success("Вы успешно зарегистрировались")
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
                            <h1 className="text-2xl font-bold text-white">Создать аккаунт</h1>
                            <span className="text-neutral-400">Зарегистрируйтесь бесплатно, чтобы начать общаться</span>
                        </div>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-300">Имя</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <User className="size-5 text-neutral-400" />
                                                </div>
                                                <Input 
                                                    className="w-full pl-10 bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-400 focus:bg-neutral-700 focus:border-neutral-500" 
                                                    type="text" 
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
                                Зарегистрироваться
                            </Button>
                        </form>
                    </Form>
                    <div className="text-center">
                        <p className="text-neutral-400">Уже есть аккаунт?{" "}
                            <Link className="text-blue-500 underline underline-offset-2 hover:text-blue-400 transition-colors" href="/auth/login">Войти</Link>
                        </p>
                    </div>
                </div>
            </div>
            <AuthImagePattern title="Присоединитесь к нашему сообществу" subtitle="Общайтесь с друзьями, делитесь моментами и оставайтесь на связи с близкими." />
        </div>
    )
}
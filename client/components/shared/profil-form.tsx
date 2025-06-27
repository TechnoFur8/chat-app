import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Camera, LoaderCircle, Mail, User } from "lucide-react"
import { Input } from "../ui/input"
import React, { ChangeEvent, useState } from "react"
import { useUpdateProfilMutation } from "@/store/apiSlice"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { Button } from "../ui/button"
import toast from "react-hot-toast"

interface Props {
    img?: string
    name?: string
    email?: string
    isSetEdit: React.Dispatch<React.SetStateAction<boolean>>
    refetch: () => void
}

export const ProfilForm = ({ img, name, email, isSetEdit, refetch }: Props) => {
    const [updateProfil, { isLoading }] = useUpdateProfilMutation()
    const [previewUrl, setPreviewUrl] = useState<string>(img || "")

    const formSchema = z.object({
        img: z.instanceof(File).optional(),
        fullName: z.string().min(2, { message: "Имя должно быть не менее 2 символов" }),
        email: z.string().email({ message: "Введите корректный email" }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            img: undefined,
            fullName: name,
            email: email
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await updateProfil({
                img: previewUrl || undefined,
                fullName: data.fullName,
                email: data.email
            }).unwrap()
            toast.success("Вы успешно изменили данные")
            isSetEdit(false)
            refetch()
        } catch (err) {
            console.error(err)
            toast.error("Что-то пошло не так")
            isSetEdit(true)
            refetch()
        }
    }

    const handleImageChande = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            if (typeof reader.result === "string") {
                setPreviewUrl(reader.result)
            }
        }
    }

    return (
        <>
            <Button
                className="absolute top-4 left-4 text-base bg-neutral-700 hover:bg-neutral-600 text-neutral-300 hover:text-white cursor-pointer"
                onClick={() => isSetEdit(false)}
                variant="ghost"
            >
                Отмена
            </Button>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Button disabled={isLoading} className="absolute right-4 top-4 text-base bg-blue-600 hover:bg-blue-700 text-white" onClick={form.handleSubmit(onSubmit)}>
                        {isLoading && <LoaderCircle className="animate-spin" />}
                        {isLoading ? "Сохранение" : "Сохранить"}
                    </Button>
                    <div className="flex items-center flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="img"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="relative">
                                        <Avatar className="size-32 ring-4 ring-neutral-700">
                                            <AvatarImage src={previewUrl} />
                                            <AvatarFallback className="text-2xl bg-neutral-600 text-white">{name && name[0]}</AvatarFallback>
                                        </Avatar>
                                        <FormLabel className="absolute right-0 bottom-0">
                                            <div className="bg-neutral-600/80 hover:bg-neutral-500/80 rounded-full p-3 transition-all">
                                                <Camera className="size-6 text-white" />
                                            </div>
                                        </FormLabel>
                                    </div>
                                    <FormControl>
                                        <Input type="file" className="hidden" accept="image/*" onChange={handleImageChande} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="space-y-6 w-full">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-300">Имя пользователя</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <User className="size-5 text-neutral-400" />
                                                </div>
                                                <Input
                                                    className="w-full pl-10 bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:bg-neutral-600"
                                                    {...field}
                                                    type="text"
                                                />
                                            </div>
                                        </FormControl>
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
                                                    className="w-full pl-10 bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:bg-neutral-600"
                                                    {...field}
                                                    type="text"
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </form>
            </Form>
        </>
    )
}
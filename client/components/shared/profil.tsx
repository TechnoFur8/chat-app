"use client"

import { useCheckAuthQuery } from "@/store/apiSlice"
import { ProfilForm } from "./profil-form"
import { useState } from "react"
import { ProfilMy } from "./profil-my"
import { Button } from "../ui/button"

export const Profil = () => {
    const { data, isLoading, isError, refetch } = useCheckAuthQuery()
    const [edit, setEdit] = useState(false)

    if (isLoading) return (
        <div className="h-screen pt-20 bg-neutral-900">
            <div className="flex items-center justify-center h-full">
                <div className="text-neutral-300">Загрузка профиля...</div>
            </div>
        </div>
    )
    if (isError) return (
        <div className="h-screen pt-20 bg-neutral-900">
            <div className="flex items-center justify-center h-full">
                <div className="text-red-400">Ошибка загрузки профиля</div>
            </div>
        </div>
    )

    return (
        <div className="h-screen pt-20 bg-neutral-900">
            <div className="max-w-2xl mx-auto p-4 py-8">
                <div className="bg-neutral-800 rounded-xl p-6 space-y-8 relative border border-neutral-700">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold text-white">Профиль</h1>
                        <p className="mt-2 text-neutral-300">Информация о пользователе</p>
                    </div>
                    {edit
                        ?
                        <ProfilForm refetch={refetch} isSetEdit={setEdit} name={data?.fullName} email={data?.email} img={data?.img} />
                        :
                        <>
                            <ProfilMy name={data?.fullName} email={data?.email} img={data?.img} createdAt={data?.createdAt} />
                            <Button className="absolute top-4 right-4 text-base text-white cursor-pointer bg-blue-600 hover:bg-blue-700" onClick={() => setEdit(!edit)}>
                                Изменить
                            </Button>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

interface Auth {
    fullName?: string
    email: string
    password: string
}

interface User {
    id: number
    fullName: string
    email: string
    img?: string
    createdAt: string
}

interface Chat {
    id: number
    senderId?: number
    receiverId: number
    text: string
    img?: string
    createdAt: string
    readUserMessage: boolean
}

interface sendMessage {
    receiverId: string
    text: string
    img?: string
    createdAt: string
}

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5000",
        credentials: "include"
    }),
    tagTypes: ["Auth", "User", "Chat"],
    endpoints: (builder) => ({
        signup: builder.mutation<{ token: string, signupUser: { id: number, fullName: string } }, Auth>({
            query: (user) => ({
                url: "/api/auth/signup",
                method: "POST",
                body: user,
            }),
            invalidatesTags: ["Auth"]
        }),
        login: builder.mutation<{ token: string, loginUser: { id: number, fullName: string } }, Auth>({
            query: (user) => ({
                url: "/api/auth/login",
                method: "POST",
                body: user,
            }),
            invalidatesTags: ["Auth"]
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: "/api/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ["Auth"]
        }),
        checkAuth: builder.query<User, void>({
            query: () => "/api/auth/check",
            providesTags: ["Auth"]
        }),


        getAllUsers: builder.query<{ user: User[] }, void>({
            query: () => "/api/auth/users",
            providesTags: ["User"]
        }),
        updateProfil: builder.mutation<void, Partial<User>>({
            query: (body) => ({
                url: "/api/auth/update-profil",
                method: "PUT",
                body: body
            }),
            invalidatesTags: ["User"]
        }),
        getOneUser: builder.query<User, number>({
            query: (id) => `/api/auth/user/${id}`,
            providesTags: ["User"]
        }),

        getMessages: builder.query<Chat[], number>({
            query: (idUserChat) => `/api/message/${idUserChat}`,
            providesTags: ["Chat"]
        }),
        sendMessage: builder.mutation<void, { body: sendMessage, id: number }>({
            query: ({ body, id }) => ({
                url: `/api/message/send/${id}`,
                method: "POST",
                body: body
            }),
            invalidatesTags: ["Chat"]
        }),
        markMessageAsRead: builder.mutation<void, number>({
            query: (chatId) => ({
                url: `/api/message/read/${chatId}`,
                method: "PUT"
            }),
            invalidatesTags: ["Chat"]
        })

    })
})

export const {
    useSignupMutation,
    useLoginMutation,
    useLogoutMutation,
    useGetAllUsersQuery,

    useUpdateProfilMutation,
    useCheckAuthQuery,
    useGetOneUserQuery,

    useGetMessagesQuery,
    useSendMessageMutation,
    useMarkMessageAsReadMutation,
} = apiSlice
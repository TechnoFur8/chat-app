import { cn } from "@/lib/utils"

interface Props {
    title: string
    subtitle: string
}

export const AuthImagePattern = ({ title, subtitle }: Props) => {
    return (
        <div className="hidden lg:flex items-center justify-center bg-neutral-800 p-12 border-l border-neutral-700">
            <div className="max-w-md text-center">
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className={cn("aspect-square rounded-2xl bg-blue-600/20", i % 2 === 0 && "animate-pulse")} />
                    ))}
                </div>
                <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
                <p className="text-base text-neutral-300 leading-relaxed">{subtitle}</p>
            </div>
        </div>
    )
}
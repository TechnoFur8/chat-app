export function formMessageTime(date: string) {
    return new Date(date).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })
}
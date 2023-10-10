"use client"

export interface ChatHistory {
    role: "assistant" | "user",
    content: string
}

const Chat = ({ name, chatHistory }: { name: string, chatHistory: ChatHistory[] }) => {

    const ChatBubble = (type: "start" | "end", content: string) => (
        <div className={`chat chat-${type} ${type === "end" ? "place-items-end grid-cols-[1fr_auto] grid-rows-none" : ""}`}>
            <div className={`chat-bubble`} style={{ gridColumnStart: "1", backgroundColor: (type === "start" ? "#bae637" : "#ffec3d") }}>{content}</div>
        </div>
    )

    return chatHistory.map(chat => ChatBubble((chat.role === "assistant" ? "start" : "end"), chat.content))
}

export default Chat;
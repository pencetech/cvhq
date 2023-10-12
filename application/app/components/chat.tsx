"use client"

export interface ChatHistory {
    role: "assistant" | "user",
    content: string
}

const Chat = ({ name, chatHistory }: { name: string, chatHistory: ChatHistory[] }) => {

    const ChatBubble = (type: "start" | "end", content: string) => (
        <div className={`chat chat-${type} grid-cols-[1fr_auto] ${type === "end" ? "place-items-end grid-rows-none" : ""}`}>
            <div className="flex flex-row chat-bubble text-white" style={{ 
                gridColumnStart: "1", 
                backgroundColor: (type === "start" ? "#3f6600" : "#876800"),
            }}>{content}</div>
        </div>
    )

    return chatHistory.map(chat => ChatBubble((chat.role === "assistant" ? "start" : "end"), chat.content))
}

export default Chat;
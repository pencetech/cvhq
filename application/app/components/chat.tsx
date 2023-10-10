"use client"
import { useState } from 'react';

export interface ChatHistory {
    role: "assistant" | "user",
    content: string
}

const Chat = ({ name, chatHistory }: { name: string, chatHistory: ChatHistory[] }) => {

    const ChatBubble = (type: "start" | "end", content: string) => (
        <div className={`chat chat-${type} ${type === "end" ? "place-items-end grid-cols-[1fr_auto] grid-rows-none" : ""}`}>
            <div className="avatar placeholder">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                    <span>{type === "start" ? "A" : name[0]}</span>
                </div>
            </div>
            <div className={`chat-bubble chat-bubble-${type === "start" ? "primary" : "info"}`}>{content}</div>
        </div>
    )

    return chatHistory.map(chat => ChatBubble((chat.role === "assistant" ? "start" : "end"), chat.content))
}

export default Chat;
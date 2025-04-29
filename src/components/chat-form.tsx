"use client"

import { useChat } from "@ai-sdk/react"
import { ArrowUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useRef } from "react"
import { AutoResizeTextarea } from "@/components/autoresize-textarea"

export function ChatForm() {
    const { messages, input, setInput, append } = useChat({ api: "/api/chat" })
    const endRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const onSubmit = () => {
        if (!input.trim()) return
        append({ role: "user", content: input })
        setInput("")
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            onSubmit()
        }
    }

    const isEmpty = messages.length === 0

    return (
        <main className="flex flex-col min-h-[80vh] w-2/3 mx-auto border">
            {/* Messages area */}
            <div
                className={`flex-1 overflow-y-auto ${isEmpty
                        ? "flex flex-col items-center justify-center"
                        : "flex flex-col justify-end space-y-4 pb-24"
                    }`}
            >
                {isEmpty ? (
                    <div className="text-center text-red-500">
                        <h1 className="text-2xl font-semibold">Sports GPT</h1>
                        <p className="text-sm text-muted-foreground mt-2">
                            AI-powered chatbot for all your sports data needs.
                        </p>
                    </div>
                ) : (
                    <>
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={
                                    "max-w-[80%] rounded-xl px-3 py-2 text-sm " +
                                    (m.role === "user"
                                        ? "self-end bg-blue-500 text-white"
                                        : "self-start bg-gray-100 text-black")
                                }
                            >
                                {m.content}
                            </div>
                        ))}
                        <div ref={endRef} />
                    </>
                )}
            </div>

            {/* Sticky input area with padding */}
            <div className="flex sticky bottom-1 bg-white border rounded-md">

                <AutoResizeTextarea
                    value={input}
                    onChange={setInput}
                    onKeyDown={onKeyDown}
                    placeholder="Type your message…"
                    className="flex-1 p-2 resize-none min-h-[2rem] max-h-[20rem] bg-transparent focus:outline-none"
                />

                <Button onClick={onSubmit} type="button" variant="ghost" size="sm">
                    <ArrowUpIcon size={16} />
                </Button>

            </div>

        </main>
    )
}

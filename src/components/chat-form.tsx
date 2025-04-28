"use client"

import { useChat } from "@ai-sdk/react"
import { ArrowUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useRef } from "react"
import { AutoResizeTextarea } from "@/components/autoresize-textarea"


export function ChatForm({ className, ...props }: React.ComponentProps<"form">) {
  const { messages, input, setInput, append } = useChat({
    api: "/api/chat",
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void append({ content: input, role: "user" })
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  const header = (
    <header className="m-auto flex max-w-96 flex-col gap-5 text-center">
      <h1 className="text-2xl font-semibold leading-none tracking-tight text-red-500">Sports GPT - A Chatbot for Sports</h1>
      <p className="text-muted-foreground text-sm">
        This is an AI chatbot for sports. It's fine-tuned to provide accurate and helpful information about sports data.
      </p>
    </header>
  )

  return (
    <main
      className={`mx-auto flex h-[90vh] max-h-[90vh] w-full max-w-[55rem] flex-col items-stretch border-none ${className || ''}`}
      {...props}
    >
      <div className="flex-1 overflow-y-auto px-6 pb-2 flex flex-col justify-end">
        {messages.length ? (
          <div className="chat-messages-container flex flex-col gap-4">
            {messages.map((message, index) => (
              <div
                key={index}
                data-role={message.role}
                className="chat-message max-w-[80%] rounded-xl px-3 py-2 text-sm data-[role=assistant]:self-start data-[role=user]:self-end data-[role=assistant]:bg-gray-100 data-[role=user]:bg-blue-500 data-[role=assistant]:text-black data-[role=user]:text-white"
              >
                {message.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : header}
      </div>
      <div className="chat-input-container sticky bottom-0 bg-background p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-background mx-6 mb-4 flex items-center gap-4 text-sm p-4" 
        >
          <AutoResizeTextarea
            onKeyDown={handleKeyDown}
            onChange={setInput}
            value={input}
            placeholder="Enter a message"
            className="placeholder:text-muted-foreground w-full flex-1 bg-transparent"
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="size-8 rounded-full shrink-0"
            type="submit"
          >
            <ArrowUpIcon size={16} />
          </Button>
        </form>
      </div>
    </main>
  )
}

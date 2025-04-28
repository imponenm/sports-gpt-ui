"use client"

import { useChat } from "@ai-sdk/react"
import { ArrowUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ChatForm({ className, ...props }: React.ComponentProps<"form">) {
  const { messages, input, setInput, append } = useChat({
    api: "/api/chat",
  })

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
      <h1 className="text-2xl font-semibold leading-none tracking-tight text-red-500">Basic AI Chatbot Template</h1>
      <p className="text-muted-foreground text-sm">
        This is an AI chatbot app template built with <span className="text-foreground">Next.js</span>, the{" "}
        <span className="text-foreground">Vercel AI SDK</span>, and <span className="text-foreground">Vercel KV</span>.
      </p>
      <p className="text-muted-foreground text-sm">
        Connect an API Key from your provider and send a message to get started.
      </p>
    </header>
  )

  const messageList = (
    <div className="chat-messages-container flex h-fit min-h-full flex-col gap-4">
      {messages.map((message, index) => (
        <div
          key={index}
          data-role={message.role}
          className="chat-message max-w-[80%] rounded-xl px-3 py-2 text-sm data-[role=assistant]:self-start data-[role=user]:self-end data-[role=assistant]:bg-gray-100 data-[role=user]:bg-blue-500 data-[role=assistant]:text-black data-[role=user]:text-white"
        >
          {message.content}
        </div>
      ))}
    </div>
  )

  return (
    <main
      className={`mx-auto flex h-svh max-h-svh w-full max-w-[35rem] flex-col items-stretch border-none ${className || ''}`}
      {...props}
    >
      <div className="flex-1 content-center overflow-y-auto px-6">
        {messages.length ? messageList : header}
      </div>
      <div className="chat-input-container">
        <form
          onSubmit={handleSubmit}
          className="border-input bg-background focus-within:ring-ring/10 relative mx-6 mb-6 flex items-center rounded-[16px] border px-3 py-1.5 pr-8 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0"
        >
          <textarea
            onKeyDown={handleKeyDown}
            onChange={(e) => setInput(e.target.value)}
            value={input}
            placeholder="Enter a message"
            className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none resize-none min-h-[24px] max-h-[200px] py-1"
            rows={1}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute bottom-1 right-1 size-6 rounded-full"
            type="submit"
          >
            <ArrowUpIcon size={16} />
          </Button>
        </form>
      </div>
    </main>
  )
}

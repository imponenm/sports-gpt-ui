"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useChat } from "@ai-sdk/react"
import { ArrowUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AutoResizeTextarea } from "@/components/autoresize-textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useState, useEffect } from "react"

interface SQLBlock {
  sql: string
  messageIndex: number
}

export function ChatForm({ className, ...props }: React.ComponentProps<"form">) {
  const [selectedSport, setSelectedSport] = useState("basketball")
  const [sqlBlocks, setSqlBlocks] = useState<SQLBlock[]>([])
  const [queryResults, setQueryResults] = useState<Record<string, any>[]>([])
//   const [displayMessages, setDisplayMessages] = useState([])

  const { messages, input, setInput, append } = useChat({
    api: "/api/chat",
    onFinish: (message) => {
      // This runs when the streaming response is complete
      const queries = extractSqlQueries(message.content)
      if (queries.length > 0) {
        void sendQueriesToAPI(queries)
      }
    },
  })

  // Extract SQL queries from message content
  const extractSqlQueries = (content: string): string[] => {
    const queries: string[] = []
    const regex = /```sql\n([\s\S]*?)```/g
    let match

    while ((match = regex.exec(content)) !== null) {
      queries.push(match[1].trim())
    }

    return queries
  }

  const sendQueriesToAPI = async (queries: string[]) => {
    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query_list: queries }),
      })

      const data = await response.json()
      console.log("Query Results:", data.results)
      // Flatten the array of arrays into a single array of results
      const flattenedResults = data.results.flatMap((resultList: any[]) => resultList)
      setQueryResults(flattenedResults)
    } catch (error) {
      console.error("Error executing queries:", error)
    }
  }

  // Update displayMessages whenever messages or queryResults change
//   useEffect(() => {
//     // Create a deep copy of messages to avoid modifying the original
//     const updatedMessages = JSON.parse(JSON.stringify(messages))
//     setDisplayMessages(updatedMessages)
//   }, [messages, queryResults])

  // Extract SQL blocks from messages for display purposes
  useEffect(() => {
    const newBlocks: SQLBlock[] = []

    messages.forEach((message, messageIndex) => {
      const regex = /```sql\n([\s\S]*?)```/g
      let match
      while ((match = regex.exec(message.content)) !== null) {
        const sql = match[1].trim()
        newBlocks.push({
          sql,
          messageIndex,
        })
      }
    })

    setSqlBlocks(newBlocks)
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

  function displayTableHTML(results: Array<Record<string, any>>): string {
    if (!results.length) return "<p>No results to display.</p>"

    const headers = Object.keys(results[0])
    const headerRow = headers.map((h) => `<th>${h}</th>`).join("")

    const rows = results
      .map((row) => "<tr>" + headers.map((h) => `<td>${String(row[h])}</td>`).join("") + "</tr>")
      .join("")

    return `
      <table border="1" cellpadding="5" cellspacing="0">
        <thead><tr>${headerRow}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `
  }

  const header = (
    <header className="m-auto flex max-w-lg flex-col gap-5 text-center">
      <h1 className="text-2xl font-semibold leading-none tracking-tight">Sports GPT</h1>
      <p className="text-muted-foreground text-md">
        A chatbot that has been fine-tuned to provide accurate sports data.
      </p>
      <div className="w-48 mx-auto">
        <Select value={selectedSport} onValueChange={setSelectedSport}>
          <SelectTrigger>
            <SelectValue placeholder="Select a sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basketball">Basketball</SelectItem>
            <SelectItem value="football" disabled>
              Football (Coming Soon)
            </SelectItem>
            <SelectItem value="baseball" disabled>
              Baseball (Coming Soon)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  )

  const messageList = (
    <div className="my-4 flex h-fit min-h-full flex-col gap-4">
      {messages.map((message, index) => {
        const associatedSqlBlocks = sqlBlocks.filter((block) => block.messageIndex === index)
        const hasSqlBlock = associatedSqlBlocks.length > 0

        if (message.role === "assistant" && hasSqlBlock) {
          return (
            <div key={index} className="self-start">
              {associatedSqlBlocks.map((block, sqlIndex) => (
                <div
                  key={`sql-${index}-${sqlIndex}`}
                  className="mt-2 max-w-[80%] w-full rounded-lg bg-gray-900 p-4 text-sm font-mono text-white"
                >
                  <div className="mb-1 text-xs text-gray-400">Generated SQL:</div>
                  {block.sql}
                  <div className="mt-2" dangerouslySetInnerHTML={{ __html: displayTableHTML(queryResults) }} />
                </div>
              ))}
            </div>
          )
        }

        const displayContent =
          message.role === "assistant" ? message.content.replace(/```sql[\s\S]*?```/g, "").trim() : message.content

        return (
          <div key={index}>
            <div
              data-role={message.role}
              className="max-w-[80%] rounded-xl px-3 py-2 text-sm data-[role=assistant]:self-start data-[role=user]:self-end data-[role=assistant]:bg-gray-100 data-[role=user]:bg-blue-500 data-[role=assistant]:text-black data-[role=user]:text-white"
            >
              {displayContent}
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <main
      className={cn(
        "ring-none mx-auto flex h-[85vh] w-full max-w-[55rem] flex-col items-stretch border-none",
        className,
      )}
      {...props}
    >
      <div className="flex-1 content-center overflow-y-auto px-6">{messages.length ? messageList : header}</div>
      <form
        onSubmit={handleSubmit}
        className="border-input bg-background focus-within:ring-ring/10 relative mx-6 mb-6 flex items-center rounded-[16px] border px-3 py-1.5 pr-8 text-sm focus-within:outline-none focus-within:ring-1 focus-within:ring-offset-0"
      >
        <AutoResizeTextarea
          onKeyDown={handleKeyDown}
          onChange={(value: string) => setInput(value)}
          value={input}
          placeholder="Enter a message"
          className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none"
        />

        <Button variant="ghost" size="sm" className="absolute bottom-1 right-1 size-6 rounded-full">
          <ArrowUpIcon size={16} />
        </Button>
      </form>
    </main>
  )
}

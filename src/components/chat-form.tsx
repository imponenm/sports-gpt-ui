"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { ArrowUpIcon, ThumbsUpIcon, ThumbsDownIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AutoResizeTextarea } from "@/components/autoresize-textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useState, useEffect } from "react"
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

interface SQLBlock {
  sql: string
  messageIndex: number
  results?: Record<string, any>[]
  pagination?: {
    page: number
    rowsPerPage: number
    totalRows: number
    totalPages: number
  }
  feedbackGiven?: boolean
  feedbackValue?: boolean
  hasError?: boolean
  isExpanded?: boolean
  errorMessage?: string
}

export function ChatForm({ className, user, ...props }: React.ComponentProps<"form"> & { user: User | null }) {
  const router = useRouter()
  const [selectedSport, setSelectedSport] = useState("NBA")
  const [sqlBlocks, setSqlBlocks] = useState<SQLBlock[]>([])
  const [messages, setMessages] = useState<{ content: string; role: string }[]>([])
  const [input, setInput] = useState("")
  const [rowsPerPage] = useState(100); // Configure rows per page

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

  // Function to fetch a specific page of results
  const fetchPagedResults = async (sql: string, messageIndex: number, page: number) => {
    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          query_list: [sql],
          page: page,
          rowsPerPage: rowsPerPage
        }),
      });

      const data = await response.json();
      console.log("Paged results:", data);
      
      if (data.results[0] && data.results[0].data) {
        setSqlBlocks(prevBlocks => {
          return prevBlocks.map(block => {
            if (block.messageIndex === messageIndex && block.sql === sql) {
              return {
                ...block,
                results: data.results[0].data,
                pagination: data.results[0].pagination,
                hasError: false
              };
            }
            return block;
          });
        });
      } else {
        setSqlBlocks(prevBlocks => {
          return prevBlocks.map(block => {
            if (block.messageIndex === messageIndex && block.sql === sql) {
              return {
                ...block,
                hasError: true,
                errorMessage: data.results[0]?.error || "No results returned"
              };
            }
            return block;
          });
        });
      }
    } catch (error) {
      console.error("Error fetching paged results:", error);
      setSqlBlocks(prevBlocks => {
        return prevBlocks.map(block => {
          if (block.messageIndex === messageIndex && block.sql === sql) {
            return {
              ...block,
              hasError: true,
              errorMessage: "Error fetching paged results"
            };
          }
          return block;
        });
      });
    }
  };

  // Modify the sendQueriesToAPI function to include pagination
  const sendQueriesToAPI = async (queries: string[], messageIndex: number) => {
    try {
      console.log("Sending queries:", queries);
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          query_list: queries,
          page: 0, // Start with the first page
          rowsPerPage: rowsPerPage
        }),
      });

      const data = await response.json();
      console.log("API response:", data);
      
      // Update the specific SQL blocks with their results
      setSqlBlocks(prevBlocks => {
        const newBlocks = [...prevBlocks];
        // For each query that matches this messageIndex
        queries.forEach((query, queryIndex) => {
          const blockIndex = newBlocks.findIndex(
            block => block.messageIndex === messageIndex && block.sql === query.trim()
          );
          
          if (blockIndex !== -1) {
            const resultData = data.results[queryIndex];
            
            if (resultData && resultData.data) {
              newBlocks[blockIndex].results = resultData.data;
              newBlocks[blockIndex].pagination = resultData.pagination;
            } else if (resultData && resultData.error) {
              // Handle error case
              newBlocks[blockIndex].hasError = true;
              newBlocks[blockIndex].errorMessage = resultData.error;
            } else {
              // Mark as error if no results or unexpected format
              newBlocks[blockIndex].hasError = true;
              newBlocks[blockIndex].errorMessage = "No results or invalid response format";
            }
          }
        });
        
        return newBlocks;
      });
    } catch (error) {
      console.error("Error executing queries:", error);
      // Mark all queries as having errors
      setSqlBlocks(prevBlocks => {
        return prevBlocks.map(block => {
          if (block.messageIndex === messageIndex) {
            return {
              ...block,
              hasError: true,
              errorMessage: "Error sending query request"
            }
          }
          return block;
        });
      });
    }
  };

  // Function to handle page navigation
  const changePage = (block: SQLBlock, page: number) => {
    // Only fetch if the page is different from current
    if (block.pagination && page !== block.pagination.page) {
      fetchPagedResults(block.sql, block.messageIndex, page);
    }
  };

  // Extract SQL blocks from messages for display purposes
  useEffect(() => {
    // Instead of creating entirely new blocks, merge with existing ones
    setSqlBlocks(prevBlocks => {
      const newBlocks: SQLBlock[] = []

      messages.forEach((message, messageIndex) => {
        const regex = /```sql\n([\s\S]*?)```/g
        let match
        while ((match = regex.exec(message.content)) !== null) {
          const sql = match[1].trim()
          
          // Look for existing block with the same sql and messageIndex
          const existingBlock = prevBlocks.find(block => 
            block.messageIndex === messageIndex && block.sql === sql
          )
          
          if (existingBlock) {
            // Keep the existing block with its results
            newBlocks.push(existingBlock)
          } else {
            // Add new block
            newBlocks.push({
              sql,
              messageIndex,
              isExpanded: false
            })
          }
        }
      })

      return newBlocks
    })
  }, [messages])

  // Toggle function to expand/collapse SQL blocks
  const toggleSqlBlock = (messageIndex: number, sqlIndex: number) => {
    setSqlBlocks(prevBlocks => {
      return prevBlocks.map((block, idx) => {
        if (block.messageIndex === messageIndex && idx === sqlIndex) {
          return {
            ...block,
            isExpanded: !block.isExpanded
          }
        }
        return block;
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Check if user is logged in
    if (!user) {
      router.push("/login")
      return
    }

    // Add the user's message to the messages list
    const userMessage = { content: input, role: "user" }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    
    // Add a temporary "Thinking..." message
    const thinkingMessage = { content: "Thinking...", role: "assistant" }
    setMessages((prevMessages) => [...prevMessages, thinkingMessage])

    // Send the message to the API
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      const data = await response.json()
      const assistantMessage = { content: data.text, role: "assistant" }

      // Replace the thinking message with the actual response
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages]
        // Replace the last message (thinking) with the actual response
        newMessages[newMessages.length - 1] = assistantMessage
        return newMessages
      })

      // Extract SQL queries from the assistant's message
      const queries = extractSqlQueries(assistantMessage.content)
      if (queries.length > 0) {
        // Pass the current message index to associate results with the right message
        void sendQueriesToAPI(queries, messages.length + 1) // +1 because we just added user message and will add assistant message
      } else {
        console.log("No queries found in the assistant's message.")
      }

    } catch (error) {
      console.error("Error sending message:", error)
    }

    // Clear the input field
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  // Function to display table with pagination info
  function displayTableHTML(results: Array<Record<string, any>>, pagination?: SQLBlock['pagination']): string {
    if (!results.length) return "<p>No results to display.</p>";

    const headers = Object.keys(results[0]);
    const headerRow = headers.map((h) => `<th style="text-align: left; padding: 8px; white-space: nowrap;">${h}</th>`).join("");

    const rows = results
      .map((row) => "<tr style=\"border-top: 1px solid #e5e7eb;\">" + 
        headers.map((h) => `<td style="text-align: left; padding: 8px;">${String(row[h])}</td>`).join("") + 
        "</tr>")
      .join("");

    // Add pagination info if available
    const paginationInfo = pagination ? `
      <div style="margin-top: 10px; font-size: 0.875rem; color: #6b7280;">
        Showing ${pagination.page * pagination.rowsPerPage + 1}-${Math.min((pagination.page + 1) * pagination.rowsPerPage, pagination.totalRows)} of ${pagination.totalRows} results
      </div>
    ` : '';

    return `
      <div style="overflow-x: auto; margin-top: 10px;">
        <table style="border-collapse: collapse; width: 100%; font-size: 0.875rem;">
          <thead>
            <tr style="border-bottom: 2px solid #d1d5db;">
              ${headerRow}
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        ${paginationInfo}
      </div>
    `;
  }

  const submitFeedback = async (sqlBlock: SQLBlock, isThumbsUp: boolean) => {
    if (!user) {
      console.log("User not logged in, feedback not submitted")
      return
    }
    
    try {
      // Find the user query that prompted this SQL response
      const userMessageIndex = sqlBlock.messageIndex - 1
      const userQuery = userMessageIndex >= 0 ? messages[userMessageIndex].content : ""
      
      const supabase = createClient()
      const { error } = await supabase
        .schema('feedback')
        .from('query_feedback')
        .insert({
          user_id: user.id,
          league: 'NBA',
          user_query: userQuery,
          sql_query: sqlBlock.sql,
          is_thumbs_up: isThumbsUp
        })
      
      if (error) {
        console.error("Error submitting feedback:", error)
        return
      }
      
      // Update the local state to reflect feedback was given
      setSqlBlocks(prevBlocks => {
        return prevBlocks.map(block => {
          if (block.messageIndex === sqlBlock.messageIndex && block.sql === sqlBlock.sql) {
            return {
              ...block,
              feedbackGiven: true,
              feedbackValue: isThumbsUp
            }
          }
          return block
        })
      })
      
      console.log("Feedback submitted successfully")
    } catch (error) {
      console.error("Error in feedback submission:", error)
    }
  }

  const header = (
    <header className="m-auto flex max-w-lg flex-col gap-5 text-center">
      <h1 className="text-2xl font-semibold leading-none tracking-tight">Sports GPT</h1>
      <p className="text-muted-foreground text-md">
        The best chatbot for sports data and analysis.
      </p>
      <p className="text-muted-foreground text-sm">
        SportsGPT queries data from a reliable sports database to ensure accuracy.
      </p>
      <div className="w-48 mx-auto">
        <Select value={selectedSport} onValueChange={setSelectedSport}>
          <SelectTrigger>
            <SelectValue placeholder="Select a sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NBA">NBA</SelectItem>
            <SelectItem value="NFL" disabled>
              NFL (Coming Soon)
            </SelectItem>
            <SelectItem value="MLB" disabled>
              MLB (Coming Soon)
            </SelectItem>
            <SelectItem value="MLB" disabled>
              Soccer (Coming Soon)
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
                  className="mt-2 max-w-[80%] min-w-[400px] w-full rounded-lg bg-gray-900 p-4 text-sm font-mono text-white"
                >
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleSqlBlock(block.messageIndex, sqlIndex)}
                      className="text-gray-400 hover:text-white transition-transform duration-200"
                      aria-label={block.isExpanded ? "Hide SQL query" : "Show SQL query"}
                    >
                      <ChevronRightIcon 
                        size={18} 
                        className={`transition-transform ${block.isExpanded ? 'rotate-90' : ''}`} 
                      />
                    </button>
                    <div className="text-xs text-gray-400">View SQL:</div>
                  </div>
                  
                  {block.isExpanded && (
                    <div className="mt-2 pl-5 border-l border-gray-700 py-1">
                      {block.sql}
                    </div>
                  )}
                  
                  <div className="mt-2" dangerouslySetInnerHTML={{ 
                    __html: block.hasError 
                      ? `<p class='text-red-400'>Error: ${block.errorMessage || "The query might be invalid or the database unavailable."}</p>` 
                      : block.results 
                        ? displayTableHTML(block.results, block.pagination) 
                        : "<p>Loading results...</p>" 
                  }} />
                  
                  {/* Pagination Controls */}
                  {block.pagination && block.pagination.totalPages > 1 && (
                    <div className="mt-3 flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                        onClick={() => changePage(block, block.pagination!.page - 1)}
                        disabled={block.pagination.page <= 0}
                      >
                        ← Previous
                      </Button>
                      <div className="text-xs text-gray-400">
                        Page {block.pagination.page + 1} of {block.pagination.totalPages}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                        onClick={() => changePage(block, block.pagination!.page + 1)}
                        disabled={block.pagination.page >= block.pagination.totalPages - 1}
                      >
                        Next →
                      </Button>
                    </div>
                  )}
                  
                  {/* Feedback buttons */}
                  {block.results && (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="text-xs text-gray-400">Was this helpful?</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`p-1 ${block.feedbackGiven && block.feedbackValue ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => submitFeedback(block, true)}
                        disabled={block.feedbackGiven}
                      >
                        <ThumbsUpIcon size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`p-1 ${block.feedbackGiven && !block.feedbackValue ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => submitFeedback(block, false)}
                        disabled={block.feedbackGiven}
                      >
                        <ThumbsDownIcon size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        }

        const displayContent =
          message.role === "assistant" ? message.content.replace(/```sql[\s\S]*?```/g, "").trim() : message.content

        return (
          <div key={index} className="flex flex-col">
            <div
              data-role={message.role}
              className="max-w-[70%] rounded-xl px-3 py-2 text-sm data-[role=assistant]:self-start data-[role=user]:self-end data-[role=assistant]:bg-gray-100 data-[role=user]:bg-blue-500 data-[role=assistant]:text-black data-[role=user]:text-white"
            >
              {displayContent}
            </div>
          </div>
        )
      })}
    </div>
  )

  // Add a new function to handle textarea click
  const handleTextareaClick = () => {
    // Check if user is logged in
    if (!user) {
      router.push("/login")
    }
  }

  return (
    <main
      className={cn(
        "ring-none mx-auto flex h-[85vh] w-full max-w-[95rem] flex-col items-stretch border-none",
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
          onTextareaClick={handleTextareaClick}
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

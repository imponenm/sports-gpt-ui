"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { ArrowUpIcon, ThumbsUpIcon, ThumbsDownIcon, ShareIcon, CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AutoResizeTextarea } from "@/components/autoresize-textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useState, useEffect } from "react"
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { ResultsTable } from "@/components/results-table"

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rowsPerPage] = useState(100); // Configure rows per page
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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
          rowsPerPage: rowsPerPage,
          sport: selectedSport
        }),
      });

      const data = await response.json();
      
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
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          query_list: queries,
          page: 0, // Start with the first page
          rowsPerPage: rowsPerPage,
          sport: selectedSport
        }),
      });

      const data = await response.json();
      
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
//   const toggleSqlBlock = (messageIndex: number, sqlIndex: number) => {
//     setSqlBlocks(prevBlocks => {
//       return prevBlocks.map((block, idx) => {
//         if (block.messageIndex === messageIndex && idx === sqlIndex) {
//           return {
//             ...block,
//             isExpanded: !block.isExpanded
//           }
//         }
//         return block;
//       });
//     });
//   };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Prevent duplicate submissions
    if (isSubmitting || !input.trim()) return

    // Check if user is logged in
    if (!user) {
      router.push("/login")
      return
    }

    setIsSubmitting(true)

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
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          sport: selectedSport 
        }),
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
    } finally {
      setIsSubmitting(false)
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

  // Add function to share conversation
  const shareConversation = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setIsSharing(true);
    
    try {
      const supabase = createClient();
      
      // Save the conversation to the database
      const { data, error } = await supabase
        .schema('shared_conversations')
        .from('shared_conversations')
        .insert({
          user_id: user.id,
          sport: selectedSport,
          messages: messages,
          sql_blocks: sqlBlocks
        })
        .select('id')
        .single();
      
      if (error) {
        console.error("Error sharing conversation:", error);
        return;
      }
      
      // Generate share URL
      const shareUrl = `${window.location.origin}/shared/${data.id}`;
      setShareUrl(shareUrl);
      setShowShareDialog(true);
      
    } catch (error) {
      console.error("Error in sharing conversation:", error);
    } finally {
      setIsSharing(false);
    }
  };

  // Function to copy share URL to clipboard
  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const header = (
    <header className="m-auto flex max-w-lg flex-col gap-5 text-center">
      <h1 className="text-3xl md:text-4xl font-semibold leading-none tracking-tight text-purple-300">Sports GPT</h1>
      <p className="text-gray-400 text-lg md:text-xl">
        The best chatbot for sports data and analysis.
      </p>
      <p className="text-gray-400 text-base md:text-lg">
        SportsGPT queries data from a reliable sports database to ensure accuracy.
      </p>
      <div className="text-gray-400 text-sm md:text-base mt-1 mb-2 mx-auto max-w-md">
        <ul className="text-left list-disc pl-5">
          {selectedSport === "NBA" ? (
            <>
              <li>We support data from 2000 - present.</li>
              <li>We support season and game data.</li>
              <li>Play-in games are counted as regular season games.</li>
            </>
          ) : (
            <>
                <li>We support data from 2002 and onwards.</li>
                <li>We support season, game, and quarter data.</li>
            </>
          )}
        </ul>
      </div>
      <div className="w-48 mx-auto">
        <Select value={selectedSport} onValueChange={setSelectedSport}>
          <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100 text-base">
            <SelectValue placeholder="Select a sport" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
            <SelectItem value="NBA">NBA</SelectItem>
            <SelectItem value="NFL">NFL</SelectItem>
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
      <div className="flex justify-between items-center text-sm md:text-base text-gray-400 mb-2">
        <div>
          Selected Sport: <span className="font-medium text-purple-300">{selectedSport}</span>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-purple-300 flex items-center gap-1"
            onClick={shareConversation}
            disabled={isSharing || messages.length === 0}
          >
            <ShareIcon size={16} />
            <span>Share</span>
          </Button>
        )}
      </div>
      
      {messages.map((message, index) => {
        const associatedSqlBlocks = sqlBlocks.filter((block) => block.messageIndex === index)
        const hasSqlBlock = associatedSqlBlocks.length > 0

        if (message.role === "assistant" && hasSqlBlock) {
          return (
            <div key={index} className="w-full">
              {associatedSqlBlocks.map((block, sqlIndex) => (
                <div
                  key={`sql-${index}-${sqlIndex}`}
                  className="mt-2 w-full rounded-lg bg-gray-800 border border-gray-700 p-4 text-sm font-mono text-gray-100"
                >
                  <div className="mt-2">
                    <QueryResult block={block} />
                  </div>
                  
                  {/* Pagination Controls */}
                  {block.pagination && block.pagination.totalPages > 1 && (
                    <div className="mt-3 flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-purple-300"
                        onClick={() => changePage(block, block.pagination!.page - 1)}
                        disabled={block.pagination.page <= 0}
                      >
                        ← Previous
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-purple-300 ml-2"
                        onClick={() => changePage(block, block.pagination!.page + 1)}
                        disabled={block.pagination.page >= block.pagination.totalPages - 1}
                      >
                        Next →
                      </Button>
                      <div className="text-xs text-gray-400 ml-auto">
                        Page {block.pagination.page + 1} of {block.pagination.totalPages}
                      </div>
                    </div>
                  )}
                  
                  {/* Feedback buttons */}
                  {block.results && (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="text-xs text-gray-400">Was this helpful?</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`p-1 ${block.feedbackGiven && block.feedbackValue ? 'text-purple-400' : 'text-gray-400 hover:text-purple-300'}`}
                        onClick={() => submitFeedback(block, true)}
                        disabled={block.feedbackGiven}
                      >
                        <ThumbsUpIcon size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`p-1 ${block.feedbackGiven && !block.feedbackValue ? 'text-red-400' : 'text-gray-400 hover:text-purple-300'}`}
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
              className="max-w-[70%] rounded-xl px-3 py-2 text-sm md:text-base data-[role=assistant]:self-start data-[role=user]:self-end data-[role=assistant]:bg-gray-800 data-[role=user]:bg-purple-700 data-[role=assistant]:text-gray-100 data-[role=user]:text-white"
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

  // Add share dialog component
  const shareDialog = (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${showShareDialog ? '' : 'hidden'}`}>
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-medium text-purple-300 mb-4">Share Conversation</h3>
        <p className="text-gray-300 mb-4">Anyone with this link can view this conversation:</p>
        
        <div className="flex items-center mb-6 gap-2">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 bg-gray-900 border border-gray-700 rounded-md py-2 px-3 text-gray-100"
          />
          <Button 
            onClick={copyShareUrl}
            disabled={isCopied}
            className={`${isCopied ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-md py-2 px-4 min-w-[70px]`}
          >
            {isCopied ? <CheckIcon size={16} /> : "Copy"}
          </Button>
        </div>
        
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => setShowShareDialog(false)}
            className="text-gray-300 hover:text-purple-300"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <main
      className={cn(
        "ring-none mx-auto flex h-[85vh] w-full max-w-[95rem] flex-col items-stretch border-none",
        className,
      )}
      {...props}
    >
      <div className="flex-1 content-center overflow-y-auto px-6">{messages.length ? messageList : header}</div>
      
      {/* Example prompts - only show when no messages */}
      {messages.length === 0 && (
        <div className="mx-6 mb-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-sm md:text-base">
            <p className="text-gray-400 mb-2 font-medium">Try asking:</p>
            <div className="space-y-2 text-gray-300">
              {selectedSport === "NBA" ? (
                <>
                  <p 
                    className="cursor-pointer hover:text-purple-300 transition-colors" 
                    onClick={() => setInput("How many games has Steph Curry score 10 or more 3 point shots in a game?")}
                  >
                    How many games has Steph Curry scored 10 or more 3 point shots in a game?
                  </p>
                  <p 
                    className="cursor-pointer hover:text-purple-300 transition-colors" 
                    onClick={() => setInput("Show me Damin Lillard's top 5 scoring playoff games.")}
                  >
                    Show me Damin Lillard&apos;s top 5 scoring playoff games.
                  </p>
                  <p 
                    className="cursor-pointer hover:text-purple-300 transition-colors" 
                    onClick={() => setInput("How many times have the Celtics won a championship?")}
                  >
                    How many times have the Celtics won a championship?
                  </p>
                </>
              ) : (
                <>
                  <p 
                    className="cursor-pointer hover:text-purple-300 transition-colors" 
                    onClick={() => setInput("Which quarterback had the highest passer rating last season?")}
                  >
                    Which quarterback had the highest passer rating last season?
                  </p>
                  <p 
                    className="cursor-pointer hover:text-purple-300 transition-colors" 
                    onClick={() => setInput("Which team scored the most points in the first quarter throughout the current season?")}
                  >
                    Which team scored the most points in the first quarter throughout the current season?
                  </p>
                  <p 
                    className="cursor-pointer hover:text-purple-300 transition-colors" 
                    onClick={() => setInput("What's the win-loss record for teams playing after a bye week?")}
                  >
                    What&apos;s the win-loss record for teams playing after a bye week?
                  </p>
                  <p 
                    className="cursor-pointer hover:text-purple-300 transition-colors" 
                    onClick={() => setInput("When Tyreek Hill played for Kansas City, what were his average receiving yards per game against the Chargers?")}
                  >
                    When Tyreek Hill played for Kansas City, what were his average receiving yards per game against the Chargers?
                  </p>
                  <p 
                    className="cursor-pointer hover:text-purple-300 transition-colors" 
                    onClick={() => setInput("Which kicker has been most accurate from beyond 50 yards over the last 5 seasons?")}
                  >
                    Which kicker has been most accurate from beyond 50 yards over the last 5 seasons?
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      <form
        onSubmit={handleSubmit}
        className="border-gray-700 bg-gray-800 focus-within:ring-purple-900/50 relative mx-6 mb-6 flex items-center rounded-[16px] border px-3 py-1.5 pr-8 text-sm focus-within:outline-none focus-within:ring-1 focus-within:ring-offset-0"
      >
        <AutoResizeTextarea
          onKeyDown={handleKeyDown}
          onChange={(value: string) => setInput(value)}
          onTextareaClick={handleTextareaClick}
          value={input}
          placeholder="Enter a message"
          disabled={isSubmitting}
          className="placeholder:text-gray-500 text-gray-100 flex-1 bg-transparent focus:outline-none"
        />

        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute bottom-1 right-1 size-6 rounded-full text-purple-300 hover:text-purple-200 hover:bg-purple-900/20" 
          disabled={isSubmitting}
        >
          <ArrowUpIcon size={16} />
        </Button>
      </form>
      
      {/* Add share dialog */}
      {shareDialog}
    </main>
  )
}

function QueryResult({ block }: { block: SQLBlock }) {
  if (block.hasError) {
    return <p className="text-red-400">Error: {block.errorMessage || "The query might be invalid or the database unavailable."}</p>;
  }
  
  if (!block.results) {
    return <p className="text-gray-400">Loading results...</p>;
  }
  
  return <ResultsTable results={block.results} pagination={block.pagination} />;
}

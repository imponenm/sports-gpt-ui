"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ResultsTable } from "@/components/results-table";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

interface SQLBlock {
  sql: string;
  messageIndex: number;
  results?: Record<string, any>[];
  pagination?: {
    page: number;
    rowsPerPage: number;
    totalRows: number;
    totalPages: number;
  };
  hasError?: boolean;
  errorMessage?: string;
}

interface SharedConversation {
  id: string;
  user_id: string;
  sport: string;
  messages: { content: string; role: string }[];
  sql_blocks: SQLBlock[];
  created_at: string;
  title?: string;
}

export default function SharedConversationPage() {
  const params = useParams();
  const id = params.id as string;
  const [conversation, setConversation] = useState<SharedConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .schema('shared_conversations')
          .from("shared_conversations")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        setConversation(data as SharedConversation);
      } catch (err) {
        console.error("Error fetching shared conversation:", err);
        setError("Failed to load the conversation. It may have been deleted or the link is invalid.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchConversation();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-purple-300">Loading conversation...</div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <div className="text-xl text-red-400">{error || "Conversation not found"}</div>
        <Link href="/">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            Return to Home
          </Button>
        </Link>
      </div>
    );
  }

  function QueryResult({ block }: { block: SQLBlock }) {
    if (block.hasError) {
      return <p className="text-red-400">Error: {block.errorMessage || "The query might be invalid or the database unavailable."}</p>;
    }
    
    if (!block.results) {
      return <p className="text-gray-400">No results available</p>;
    }
    
    return <ResultsTable results={block.results} pagination={block.pagination} />;
  }

  return (
    <main className="mx-auto flex h-screen w-full max-w-[95rem] flex-col items-stretch">
      <div className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="mx-auto max-w-[95rem] flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-purple-300 hover:text-purple-200">
            <ArrowLeftIcon size={16} />
            <span>Back to SportsGPT</span>
          </Link>
          <div className="text-gray-400">
            Sport: <span className="font-medium text-purple-300">{conversation.sport}</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-[95rem]">
          <h1 className="text-2xl font-semibold text-purple-300 mb-6">
            {conversation.title || "Shared Conversation"}
          </h1>
          
          <div className="flex flex-col gap-4">
            {conversation.messages.map((message, index) => {
              // Only process user messages
              if (message.role === "user") {
                return (
                  <div key={index} className="flex flex-col">
                    <div
                      data-role={message.role}
                      className="max-w-[70%] rounded-xl px-3 py-2 text-sm md:text-base self-end bg-purple-700 text-white"
                    >
                      {message.content}
                    </div>
                  </div>
                );
              }
              
              // For assistant messages, only show SQL results if they exist
              if (message.role === "assistant") {
                const associatedSqlBlocks = conversation.sql_blocks.filter(
                  (block) => block.messageIndex === index
                );
                
                if (associatedSqlBlocks.length > 0) {
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
                        </div>
                      ))}
                    </div>
                  );
                }
                
                // Return null for assistant messages with no SQL blocks
                return null;
              }
              
              return null;
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

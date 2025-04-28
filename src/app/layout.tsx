import type { ReactNode } from "react"
import "./globals.css"

export const metadata = {
  title: "Sports GPT - An AI chatbot for sports",
  description: "Sports GPT is an AI chatbot for sports. It's fine-tuned to provide accurate and helpful information about sports data.",
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="">
        {children}
      </body>
    </html>
  )
}

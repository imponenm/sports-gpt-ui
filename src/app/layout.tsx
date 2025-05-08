import type { ReactNode } from "react"
import "./globals.css"
// import { MainFooter } from "@/components/MainFooter"

export const metadata = {
  title: "Sports GPT - An AI chatbot for sports",
  description: "Sports GPT is an AI chatbot for sports. It's fine-tuned to provide accurate and helpful information about sports data.",
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <main className="pt-24 flex-grow">
          {children}
        </main>
        {/* <MainFooter /> */}
      </body>
    </html>
  )
}

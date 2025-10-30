"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Bot, User, Lightbulb, FileText, Calculator, HelpCircle } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  prompt: string
}

const quickActions: QuickAction[] = [
  {
    id: "eligibility",
    title: "Check Eligibility",
    description: "Am I eligible for ITR-1?",
    icon: <HelpCircle className="h-4 w-4" />,
    prompt: "List the eligibility criteria for filing ITR-1 (Sahaj) for AY 2025-26.",
  },
  {
    id: "filing-process",
    title: "Filing Steps",
    description: "How to file ITR-1 online",
    icon: <FileText className="h-4 w-4" />,
    prompt: "Guide me through the steps to file ITR-1 (Sahaj) online.",
  },
  {
    id: "deductions",
    title: "Tax Deductions",
    description: "Available deductions",
    icon: <Calculator className="h-4 w-4" />,
    prompt: "List common deductions available under ITR-1 (Sahaj).",
  },
  {
    id: "tax-regime",
    title: "Tax Regime",
    description: "Old vs New regime",
    icon: <Lightbulb className="h-4 w-4" />,
    prompt: "Explain the difference between the old and new tax regimes and how to choose between them.",
  },
]

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI Tax Assistant. I'm here to help you with ITR-1 (Sahaj) filing for Assessment Year 2025-26. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: content }),
      })
      const data = await res.json()
      const answerText = data?.answer || "Sorry, I couldn't generate an answer."

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: answerText,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    } catch (err) {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "There was an error answering your question. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: QuickAction) => {
    sendMessage(action.prompt)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Bot className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold text-foreground">AI Tax Copilot</h1>
                <Badge variant="secondary" className="text-xs">
                  ITR-1 Specialist
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Quick Actions Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <h2 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="ghost"
                    className="w-full justify-start h-auto p-3 text-left"
                    onClick={() => handleQuickAction(action)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-1 bg-primary/10 rounded">{action.icon}</div>
                      <div>
                        <div className="font-medium text-sm">{action.title}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col bg-card/50 backdrop-blur border-border/50">
              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <div
                        className={`p-2 rounded-full ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent text-accent-foreground"
                        }`}
                      >
                        {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "text-right" : ""}`}>
                        <div
                          className={`p-4 rounded-lg ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground ml-auto"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-full bg-accent text-accent-foreground">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="p-4 rounded-lg bg-muted">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                            <div
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t border-border/40 p-4">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me anything about ITR-1 filing..."
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage(inputMessage)
                      }
                    }}
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => sendMessage(inputMessage)}
                    disabled={isLoading || !inputMessage.trim()}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Press Enter to send, Shift+Enter for new line</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

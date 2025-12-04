"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send, Bot } from "lucide-react"

/**
 * Ask AI Modal - Chat interface for asking questions about cargo
 */
export function AskAIModal({ open, onOpenChange, cargo }) {
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const quickQuestions = [
    "Why is this best?",
    "What are the risks?",
    "Compare to alternatives",
    "What if weather changes?",
  ]

  const handleQuickQuestion = async (q) => {
    setQuestion(q)
    await handleSend(q)
  }

  const handleSend = async (q = question) => {
    if (!q.trim()) return

    const userMessage = { type: "user", text: q }
    setMessages((prev) => [...prev, userMessage])
    setQuestion("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      let response = ""
      if (q.toLowerCase().includes("why") || q.toLowerCase().includes("best")) {
        response = `This cargo is the best option because:\n\n• Highest profit at $${(cargo.profit / 1000).toFixed(0)}K compared to average of $${((cargo.profit * 0.8) / 1000).toFixed(0)}K\n• ${cargo.bunkerPorts?.length || 0} reliable bunker ports available\n• Low risk profile with ${cargo.confidence}% confidence\n• Perfect timing alignment with vessel availability\n• Established route with proven bunker suppliers`
      } else if (q.toLowerCase().includes("risk")) {
        response = `Risk Assessment:\n\n• Overall Risk: ${cargo.risk}\n• Weather Risk: 15% delay probability (manageable)\n• Bunker Availability: ${cargo.bunkerPorts?.length || 0} options (good)\n• Supplier Reliability: ${cargo.bunkerPorts?.[0]?.reliability || 0}% (excellent)\n• Route Safety: Established trade route with minimal hazards`
      } else if (q.toLowerCase().includes("compare")) {
        response = `Comparison with alternatives:\n\n• Profit: $${(cargo.profit / 1000).toFixed(0)}K (highest)\n• Bunker Cost: $${(cargo.bunkerCost / 1000).toFixed(0)}K (competitive)\n• Risk: ${cargo.risk} (lowest)\n• Confidence: ${cargo.confidence}% (highest)\n\nThis option outperforms alternatives on all key metrics.`
      } else if (q.toLowerCase().includes("weather")) {
        response = `Weather Impact Analysis:\n\n• Current Forecast: 15% delay risk\n• If weather worsens (30% delay):\n  - Additional costs: ~$15K\n  - Still profitable: Yes\n  - Mitigation: Alternative route available\n\n• If weather improves (5% delay):\n  - Potential savings: ~$8K\n  - Early arrival bonus possible`
      } else {
        response = `Based on the analysis:\n\n• This cargo offers strong profitability at $${(cargo.profit / 1000).toFixed(0)}K\n• ${cargo.bunkerPorts?.length || 0} bunker options provide flexibility\n• ${cargo.confidence}% confidence indicates high reliability\n• ${cargo.risk} risk level is acceptable for this route`
      }

      setMessages((prev) => [
        ...prev,
        { type: "assistant", text: response },
      ])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary-600" />
            Ask AI About This Cargo
          </DialogTitle>
          <DialogDescription>
            Get insights and answers about this cargo opportunity
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {/* Quick Questions */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">
              Quick Questions:
            </div>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleQuickQuestion(q)}
                  disabled={isLoading}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            {/* Chat History */}
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                <Bot className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Ask a question to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.type === "user"
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-line">
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="border-t pt-4">
          <div className="flex gap-2">
            <Input
              placeholder="Type your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!question.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


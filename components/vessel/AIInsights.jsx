"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

/**
 * AI Insights & Tips
 * Provides helpful tips and insights for the vessel crew
 */
export function AIInsights({ insights = [] }) {
  if (!insights || insights.length === 0) return null

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">💡</span>
        <h2 className="text-lg font-semibold text-gray-900">AI INSIGHTS & TIPS (For You)</h2>
      </div>

      <div className="space-y-4">
        {insights.map((insight, idx) => (
          <Card key={idx} className="border-2">
            <CardHeader>
              <CardTitle className="text-sm">{insight.icon} {insight.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {insight.message && (
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {insight.message}
                </div>
              )}

              {insight.ifYouMatch && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <div className="text-xs font-semibold text-gray-900 mb-2">If you match their performance:</div>
                  <div className="space-y-1 text-xs text-gray-700">
                    {insight.ifYouMatch.map((item, i) => (
                      <div key={i}>• {item}</div>
                    ))}
                  </div>
                </div>
              )}

              {insight.costAwareness && (
                <div className="space-y-2 text-sm text-gray-700">
                  {insight.costAwareness.map((item, i) => (
                    <div key={i}>• {item}</div>
                  ))}
                </div>
              )}

              {insight.action && (
                <Button variant="outline" size="sm" className="text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  {insight.action}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


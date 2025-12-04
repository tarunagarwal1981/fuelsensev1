"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Operator Contribution Analysis
 * Shows savings generated and costs incurred by operator decisions
 */
export function OperatorContributionAnalysis({ contribution }) {
  if (!contribution) return null

  const { savings = [], costs = [], netImpact = 0, assessment = "" } = contribution

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">OPERATOR CONTRIBUTION ANALYSIS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Savings Generated */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">💰 SAVINGS GENERATED:</h4>
          <div className="space-y-3">
            {savings.map((saving, idx) => (
              <div key={idx} className="bg-green-50 border border-green-200 rounded-md p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{idx + 1}. {saving.title}</div>
                    <div className="text-xs text-gray-600 mt-1">{saving.description}</div>
                  </div>
                  <Badge className="bg-success text-white text-xs">
                    +${(saving.amount / 1000).toFixed(0)}K
                  </Badge>
                </div>
                {saving.details && (
                  <div className="mt-2 space-y-1 text-xs text-gray-700">
                    {saving.details.map((detail, i) => (
                      <div key={i}>• {detail}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Costs Incurred */}
        {costs.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">COSTS INCURRED:</h4>
            <div className="space-y-3">
              {costs.map((cost, idx) => (
                <div key={idx} className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{idx + 1}. {cost.title}</div>
                      <div className="text-xs text-gray-600 mt-1">{cost.description}</div>
                    </div>
                    <Badge className="bg-warning text-black text-xs">
                      -${(cost.amount / 1000).toFixed(0)}K
                    </Badge>
                  </div>
                  {cost.details && (
                    <div className="mt-2 space-y-1 text-xs text-gray-700">
                      {cost.details.map((detail, i) => (
                        <div key={i}>• {detail}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Net Impact */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-sm">NET OPERATOR IMPACT:</div>
            <Badge className={cn(
              "text-sm px-3 py-1",
              netImpact >= 0 ? "bg-success text-white" : "bg-warning text-black"
            )}>
              {netImpact >= 0 ? "+" : ""}${(netImpact / 1000).toFixed(1)}K 💰
            </Badge>
          </div>
          {assessment && (
            <div className="mt-2 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-lg">💡</span>
                <div>
                  <div className="font-semibold mb-1">ASSESSMENT:</div>
                  <div>{assessment}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


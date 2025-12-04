"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Root Cause Analysis - AI-Powered
 * Shows detailed analysis of performance factors
 */
export function RootCauseAnalysis({ analysis }) {
  if (!analysis || !analysis.factors) return null

  const { factors = [], controllable = 0, uncontrollable = 0 } = analysis

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">🔍 ROOT CAUSE ANALYSIS (AI-Powered)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          The AI has analyzed {factors.length} performance factors:
        </div>

        {factors.map((factor, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{factor.icon}</span>
                <span className="font-semibold text-sm">
                  {idx + 1}. {factor.name}: {factor.contribution}% contribution
                </span>
              </div>
              {factor.isPrimary && (
                <Badge className="bg-warning text-black text-xs">⚠️ PRIMARY CAUSE</Badge>
              )}
            </div>

            {factor.details && (
              <Card className="bg-gray-50 border border-gray-200">
                <CardContent className="p-3 space-y-2 text-xs">
                  {factor.details.map((detail, i) => (
                    <div key={i} className={cn(
                      i === 0 && "font-medium text-gray-900",
                      "text-gray-700"
                    )}>
                      {detail}
                    </div>
                  ))}

                  {factor.impact && (
                    <div className="mt-2 pt-2 border-t border-gray-300">
                      <div className="font-medium mb-1">Fouling Impact:</div>
                      {factor.impact.map((impact, i) => (
                        <div key={i} className="text-gray-700">
                          {i === factor.impact.length - 1 ? "└─" : "├─"} {impact}
                        </div>
                      ))}
                    </div>
                  )}

                  {factor.comparison && (
                    <div className="mt-2 pt-2 border-t border-gray-300">
                      <div className="font-medium mb-1">Sister Vessel Comparison:</div>
                      {factor.comparison.map((comp, i) => (
                        <div key={i} className="text-gray-700">
                          • {comp}
                        </div>
                      ))}
                    </div>
                  )}

                  {factor.confidence && (
                    <div className="mt-2 pt-2 border-t border-gray-300">
                      <div className="text-gray-700">
                        💡 <span className="font-medium">CONFIDENCE:</span> {factor.confidence}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        ))}

        {/* Summary */}
        <div className="pt-3 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold text-gray-900">CONTROLLABLE FACTORS:</div>
              <div className="text-gray-700">{controllable}% (Hull + Speed)</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">UNCONTROLLABLE FACTORS:</div>
              <div className="text-gray-700">{uncontrollable}% (Weather + Engine)</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Risk Breakdown Component
 * Shows overall risk assessment and breakdown by category
 */
export function RiskBreakdown({ riskBreakdown, aiAssessment, overallRiskScore, confidence }) {
  const getRiskColor = (score) => {
    if (score >= 9) return "bg-success"
    if (score >= 7) return "bg-warning"
    if (score >= 5) return "bg-warning"
    return "bg-danger"
  }

  const getRiskLabel = (score) => {
    if (score >= 9) return "LOW"
    if (score >= 7) return "LOW-MEDIUM"
    if (score >= 5) return "MEDIUM"
    return "HIGH"
  }

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📊</span>
          <h4 className="font-semibold text-sm">OVERALL RISK ASSESSMENT</h4>
        </div>

        {/* Overall Risk Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Risk Score:</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">
                {overallRiskScore}/10
              </span>
              <Badge className={cn(
                "text-xs",
                overallRiskScore >= 8 ? "bg-success text-white" :
                overallRiskScore >= 6 ? "bg-warning text-black" :
                "bg-danger text-white"
              )}>
                {getRiskLabel(overallRiskScore)} RISK
              </Badge>
            </div>
          </div>
          <Progress
            value={overallRiskScore * 10}
            className={cn("h-3", getRiskColor(overallRiskScore))}
          />
        </div>

        {/* Risk Breakdown */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Risk Breakdown:</div>
          <div className="space-y-2 text-xs">
            {Object.entries(riskBreakdown).map(([category, score]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-600 capitalize">
                  {category.replace(/([A-Z])/g, " $1").trim()} Risk:
                </span>
                <div className="flex items-center gap-2">
                  <Progress
                    value={score * 10}
                    className={cn("w-20 h-2", getRiskColor(score))}
                  />
                  <span className="font-medium w-12 text-right">
                    {score}/10 ({getRiskLabel(score)})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confidence Level */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Confidence Level:</span>
            <span className="text-sm font-bold">{confidence}%</span>
          </div>
          <Progress value={confidence} className="h-3 bg-gray-200" />
        </div>

        {/* AI Assessment */}
        {aiAssessment && (
          <div className="bg-white rounded-md p-3 border border-blue-200">
            <div className="flex items-start gap-2 mb-2">
              <HelpCircle className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-xs font-semibold text-gray-900 mb-1">
                  💡 AI ASSESSMENT:
                </div>
                <p className="text-xs text-gray-700 italic">
                  "{aiAssessment.summary}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recommendation */}
        {aiAssessment?.recommendation && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="text-sm font-semibold text-gray-900">
                RECOMMENDATION: {aiAssessment.recommendation.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


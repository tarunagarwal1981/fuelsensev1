"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export function RootCauseAnalysis({ analysis }) {
  if (!analysis || !Array.isArray(analysis)) return null

  const totalContribution = analysis.reduce((sum, item) => sum + item.contribution, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Root Cause Analysis (AI-Powered)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-700 mb-4">
          Why is consumption {analysis[0]?.actualConsumption || "25"} MT/day vs expected {analysis[0]?.expectedConsumption || "22"} MT/day?
        </div>

        <div className="space-y-3">
          {analysis.map((item, idx) => {
            const isCritical = item.contribution >= 30
            return (
              <div key={idx} className={`p-4 rounded-lg border-2 ${isCritical ? "bg-red-50 border-red-300" : "bg-gray-50 border-gray-200"}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isCritical ? <AlertCircle className="h-5 w-5 text-red-600" /> : <CheckCircle2 className="h-5 w-5 text-gray-600" />}
                    <span className="font-semibold">
                      {idx + 1}. {item.factor} ({item.contribution}% of variance)
                    </span>
                    {isCritical && <Badge variant="destructive">🔴</Badge>}
                  </div>
                </div>
                <div className="ml-7 space-y-1 text-sm text-gray-700">
                  <div>├─ {item.details}</div>
                  <div>├─ Fuel impact: +{item.fuelImpact} MT/day</div>
                  <div>└─ Action: {item.action}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-300">
          <div className="font-semibold text-sm mb-2">RECOMMENDATION SUMMARY:</div>
          <ul className="text-sm text-gray-700 space-y-1">
            {analysis
              .filter((item) => item.contribution >= 30)
              .map((item, idx) => (
                <li key={idx}>
                  • {idx === 0 ? "PRIMARY" : "SECONDARY"} ACTION: {item.action}
                </li>
              ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}


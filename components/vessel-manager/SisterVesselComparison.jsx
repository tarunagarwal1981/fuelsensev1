"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, AlertCircle } from "lucide-react"

export function SisterVesselComparison({ comparison, currentVessel }) {
  if (!comparison || !Array.isArray(comparison)) return null

  // Sort by consumption (ascending - best first)
  const sorted = [...comparison].sort((a, b) => a.consumption - b.consumption)
  const currentIndex = sorted.findIndex((v) => v.vessel === currentVessel)
  const best = sorted[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sister Vessel Comparison (Same Route)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">Route: Singapore → Rotterdam</div>

        <div className="space-y-2">
          {sorted.map((vessel, idx) => {
            const isCurrent = vessel.vessel === currentVessel
            const isBest = idx === 0

            return (
              <div
                key={vessel.vessel}
                className={`p-3 rounded-lg border-2 ${
                  isCurrent ? "bg-red-50 border-red-300" : isBest ? "bg-green-50 border-green-300" : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isBest && <Trophy className="h-4 w-4 text-yellow-600" />}
                    {isCurrent && <AlertCircle className="h-4 w-4 text-red-600" />}
                    <span className={`font-semibold ${isCurrent ? "text-red-700" : ""}`}>
                      {idx === 0 && "🥇"} {idx === 1 && "🥈"} {idx === 2 && "🥉"} {vessel.vessel}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{vessel.consumption} MT/day</span>
                    <Badge variant="secondary" className="text-xs">
                      (Cleaned {vessel.cleanedDaysAgo} days ago)
                    </Badge>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {currentIndex > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-300">
            <div className="text-sm font-semibold text-gray-900 mb-1">
              Your vessel is consuming {((sorted[currentIndex].consumption / best.consumption - 1) * 100).toFixed(0)}% more than best performer.
            </div>
            <div className="text-sm text-gray-700">
              Gap = ${((sorted[currentIndex].consumption - best.consumption) * 645).toLocaleString()}/day = $
              {((sorted[currentIndex].consumption - best.consumption) * 645 * 30).toLocaleString()}/month wasted
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


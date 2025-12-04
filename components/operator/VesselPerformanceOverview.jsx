"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Vessel Performance Overview
 * Shows Technical, Commercial, and Health metrics side by side
 */
export function VesselPerformanceOverview({ performance }) {
  if (!performance) return null

  const {
    technical = {},
    commercial = {},
    health = {},
    voyageImpact = {},
  } = performance

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">📊 PERFORMANCE OVERVIEW</h3>
          <div className="flex items-center gap-2">
            <Badge className={cn(
              performance.status === "ATTENTION" && "bg-warning text-black",
              performance.status === "CRITICAL" && "bg-danger text-white",
              performance.status === "ON_TRACK" && "bg-success text-white"
            )}>
              Status: {performance.status === "ATTENTION" ? "⚠️ ATTENTION" : performance.status === "CRITICAL" ? "🔴 CRITICAL" : "✅ ON TRACK"} - {performance.statusMessage}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Technical */}
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="text-xs font-semibold text-gray-600 mb-3">TECHNICAL</div>
              <div className="space-y-2">
                <div>
                  <div className="text-gray-600 text-xs">Consumption:</div>
                  <div className="text-lg font-bold">{technical.consumption} MT/day</div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs">vs Plan:</div>
                  <div className="text-sm">{technical.planned} MT/day</div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs">Variance:</div>
                  <div className={cn(
                    "text-sm font-semibold",
                    technical.variance >= 0 ? "text-warning" : "text-success"
                  )}>
                    {technical.variance >= 0 ? "+" : ""}{technical.variance} MT/day ⚠️
                    {technical.variancePercent && ` (${technical.variancePercent > 0 ? "+" : ""}${technical.variancePercent}%)`}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commercial */}
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="text-xs font-semibold text-gray-600 mb-3">COMMERCIAL</div>
              <div className="space-y-2">
                <div>
                  <div className="text-gray-600 text-xs">Daily Cost:</div>
                  <div className="text-lg font-bold">${commercial.dailyCost?.toLocaleString()}/day</div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs">vs Plan:</div>
                  <div className="text-sm">${commercial.plannedCost?.toLocaleString()}/day</div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs">Extra Cost:</div>
                  <div className={cn(
                    "text-sm font-semibold",
                    commercial.extraCost >= 0 ? "text-warning" : "text-success"
                  )}>
                    {commercial.extraCost >= 0 ? "+" : ""}${commercial.extraCost?.toLocaleString()}/day ⚠️
                    {commercial.extraCostPercent && ` (${commercial.extraCostPercent > 0 ? "+" : ""}${commercial.extraCostPercent}%)`}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health */}
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="text-xs font-semibold text-gray-600 mb-3">HEALTH</div>
              <div className="space-y-2">
                <div>
                  <div className="text-gray-600 text-xs">Score:</div>
                  <div className="text-lg font-bold">{health.score}/100</div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs">Rating:</div>
                  <div className={cn(
                    "text-sm font-semibold",
                    health.score >= 80 ? "text-success" : health.score >= 60 ? "text-warning" : "text-danger"
                  )}>
                    {health.rating}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs">Trend:</div>
                  <div className="flex items-center gap-1 text-warning text-sm">
                    <TrendingDown className="h-3 w-3" />
                    {health.trend}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Voyage Impact */}
        {voyageImpact && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="text-xs font-semibold text-gray-900 mb-2">VOYAGE IMPACT (if trend continues):</div>
            <div className="space-y-1 text-xs text-gray-700">
              {voyageImpact.extraFuel && (
                <div>├─ Extra fuel: {voyageImpact.extraFuel} MT ({voyageImpact.extraFuelDays} days remaining)</div>
              )}
              {voyageImpact.extraCost && (
                <div>├─ Extra cost: ${voyageImpact.extraCost.toLocaleString()} ({voyageImpact.extraCostDays} days)</div>
              )}
              {voyageImpact.profitImpact && (
                <div className="text-danger font-semibold">
                  └─ Profit impact: {voyageImpact.profitImpact >= 0 ? "+" : ""}${Math.abs(voyageImpact.profitImpact).toLocaleString()} ({voyageImpact.profitImpactPercent}% of planned profit) 🔴
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


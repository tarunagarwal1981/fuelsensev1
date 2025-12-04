"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Current Voyage Performance
 * Shows voyage progress, fuel status, performance metrics, and weather
 */
export function CurrentVoyagePerformance({ voyage }) {
  if (!voyage) return null

  const {
    route,
    currentDay,
    totalDays,
    progress = {},
    fuel = {},
    performance = {},
    weather = {},
  } = voyage

  const progressPercent = totalDays > 0 ? Math.round((currentDay / totalDays) * 100) : 0

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-sm">📊 CURRENT VOYAGE PERFORMANCE</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Route Header */}
        <div>
          <div className="text-base font-semibold text-gray-900 mb-1">
            {route} (Day {currentDay} of {totalDays})
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-primary-600 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-xs text-gray-600 text-right">{progressPercent}% Complete</div>
        </div>

        {/* Progress */}
        {progress.status && (
          <div className="border rounded-md p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-gray-900">Progress:</div>
              <Badge className={cn(
                progress.status === "ON_TRACK" && "bg-success text-white",
                progress.status === "DELAYED" && "bg-warning text-black",
                "text-xs"
              )}>
                {progress.status === "ON_TRACK" ? "✅" : "⚠️"} {progress.status}
              </Badge>
            </div>
            <div className="space-y-1 text-xs text-gray-700 ml-4">
              {progress.distanceDone && (
                <div>├─ Distance done: {progress.distanceDone}</div>
              )}
              {progress.eta && (
                <div>├─ ETA {progress.etaPort}: {progress.eta} {progress.etaStatus && `(${progress.etaStatus})`}</div>
              )}
              {progress.nextWaypoint && (
                <div>└─ Next waypoint: {progress.nextWaypoint}</div>
              )}
            </div>
          </div>
        )}

        {/* Fuel Status */}
        {fuel.rob && (
          <div className="border rounded-md p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-gray-900">Fuel Status:</div>
              <Badge className={cn(
                fuel.status === "GOOD" && "bg-success text-white",
                fuel.status === "WATCH" && "bg-warning text-black",
                fuel.status === "LOW" && "bg-danger text-white",
                "text-xs"
              )}>
                {fuel.status === "GOOD" ? "✅" : fuel.status === "WATCH" ? "⚠️" : "🔴"} {fuel.status}
              </Badge>
            </div>
            <div className="space-y-1 text-xs text-gray-700 ml-4">
              {fuel.rob && (
                <div>├─ ROB: {fuel.rob} MT</div>
              )}
              {fuel.toNextPort && (
                <div>├─ To {fuel.nextPortName}: {fuel.toNextPort} needed {fuel.toNextPortStatus && `(${fuel.toNextPortStatus})`}</div>
              )}
              {fuel.toDestination && (
                <div>├─ To {fuel.destinationName}: {fuel.toDestination} needed {fuel.toDestinationStatus && `(${fuel.toDestinationStatus})`}</div>
              )}
              {fuel.bunkerPlan && (
                <div>└─ Bunker plan: {fuel.bunkerPlan}</div>
              )}
            </div>
          </div>
        )}

        {/* Performance */}
        {performance.consumption && (
          <div className="border rounded-md p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-gray-900">Performance:</div>
              <Badge className={cn(
                performance.status === "ON_TARGET" && "bg-success text-white",
                performance.status === "BELOW_TARGET" && "bg-warning text-black",
                "text-xs"
              )}>
                {performance.status === "ON_TARGET" ? "✅" : "⚠️"} {performance.status}
              </Badge>
            </div>
            <div className="space-y-1 text-xs text-gray-700 ml-4">
              {performance.consumption && (
                <div>├─ Consumption: {performance.consumption} vs {performance.planned} planned {performance.consumptionVariance && `(${performance.consumptionVariance})`}</div>
              )}
              {performance.speed && (
                <div>├─ Speed: {performance.speed} knots {performance.speedVariance && `(${performance.speedVariance})`}</div>
              )}
              {performance.efficiency && (
                <div>├─ Efficiency: {performance.efficiency}/100 vs {performance.efficiencyTarget}/100 target {performance.efficiencyStatus && performance.efficiencyStatus}</div>
              )}
              {performance.sisterShipRank && (
                <div>└─ vs Sister ships: {performance.sisterShipRank} of {performance.sisterShipTotal} {performance.sisterShipNote && `(${performance.sisterShipNote})`}</div>
              )}
            </div>
          </div>
        )}

        {/* Weather */}
        {weather.current && (
          <div className="border rounded-md p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-gray-900">Weather:</div>
              <Badge className="bg-blue-100 text-blue-900 text-xs">
                🌊 {weather.status}
              </Badge>
            </div>
            <div className="space-y-1 text-xs text-gray-700 ml-4">
              {weather.current && (
                <div>├─ Current: {weather.current}</div>
              )}
              {weather.forecast && (
                <div>├─ Forecast: {weather.forecast}</div>
              )}
              {weather.impact && (
                <div>└─ Impact: {weather.impact}</div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" className="text-xs">
            <BarChart3 className="h-3 w-3 mr-1" />
            View Full Voyage Plan
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <MapPin className="h-3 w-3 mr-1" />
            View on Map
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


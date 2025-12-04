"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Commercial Impact Analysis
 * Shows financial impact of performance issues
 */
export function CommercialImpactAnalysis({ impact }) {
  if (!impact) return null

  const {
    originalPlan = {},
    currentTrajectory = {},
    charterPartyRisk = {},
    timeValue = {},
  } = impact

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">💰 COMMERCIAL IMPACT ANALYSIS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Voyage Economics */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">CURRENT VOYAGE ECONOMICS:</h4>
          
          {originalPlan.consumption && (
            <div className="mb-3">
              <div className="text-xs font-semibold text-gray-700 mb-2">Original Plan:</div>
              <div className="space-y-1 text-xs text-gray-600 ml-4">
                {originalPlan.consumption && (
                  <div>├─ Planned consumption: {originalPlan.consumption} MT ({originalPlan.consumptionDays} days)</div>
                )}
                {originalPlan.bunkerCost && (
                  <div>├─ Planned bunker cost: ${originalPlan.bunkerCost.toLocaleString()} @ ${originalPlan.bunkerPrice}/MT</div>
                )}
                {originalPlan.profit && (
                  <div>└─ Planned voyage profit: ${originalPlan.profit.toLocaleString()}</div>
                )}
              </div>
            </div>
          )}

          {currentTrajectory.consumption && (
            <div className="mb-3">
              <div className="text-xs font-semibold text-gray-700 mb-2">Current Trajectory (if no action):</div>
              <div className="space-y-1 text-xs text-gray-600 ml-4">
                {currentTrajectory.consumption && (
                  <div>├─ Projected consumption: {currentTrajectory.consumption} MT ({currentTrajectory.consumptionDays} days)</div>
                )}
                {currentTrajectory.bunkerCost && (
                  <div>├─ Projected bunker cost: ${currentTrajectory.bunkerCost.toLocaleString()} @ ${currentTrajectory.bunkerPrice}/MT</div>
                )}
                {currentTrajectory.extraCost && (
                  <div className="text-danger font-semibold">├─ Extra cost: ${currentTrajectory.extraCost.toLocaleString()} 🔴</div>
                )}
                {currentTrajectory.profit && (
                  <div className="text-warning font-semibold">
                    └─ Revised voyage profit: ${currentTrajectory.profit.toLocaleString()} ({currentTrajectory.profitVariance}% vs plan) ⚠️
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Charter Party Risk */}
        {charterPartyRisk.terms && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <div className="text-xs font-semibold text-gray-900">CHARTER PARTY RISK:</div>
            </div>
            <div className="space-y-1 text-xs text-gray-700 ml-6">
              <div>├─ CP Terms: "{charterPartyRisk.terms}"</div>
              {charterPartyRisk.actual && (
                <div>├─ Actual: {charterPartyRisk.actual}</div>
              )}
              {charterPartyRisk.status && (
                <div>├─ Status: {charterPartyRisk.status}</div>
              )}
              {charterPartyRisk.risk && (
                <div>└─ Risk: {charterPartyRisk.risk}</div>
              )}
            </div>
          </div>
        )}

        {/* Time Value */}
        {timeValue.dailyHire && (
          <div>
            <div className="text-xs font-semibold text-gray-700 mb-2">TIME VALUE:</div>
            <div className="space-y-1 text-xs text-gray-600 ml-4">
              {timeValue.dailyHire && (
                <div>├─ Daily hire/opportunity cost: ${timeValue.dailyHire.toLocaleString()}/day</div>
              )}
              {timeValue.daySaved && (
                <div>├─ Each day saved: ${timeValue.daySaved.toLocaleString()} revenue potential</div>
              )}
              {timeValue.downtimeCost && (
                <div>└─ Hull cleaning downtime cost: ${timeValue.downtimeCost.toLocaleString()} ({timeValue.downtimeDays} day)</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


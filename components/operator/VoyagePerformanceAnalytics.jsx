"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

/**
 * Voyage Performance Analytics
 * Shows operator performance summary and insights
 */
export function VoyagePerformanceAnalytics({ analytics }) {
  if (!analytics) return null

  const {
    totalSavings = 0,
    savingsBreakdown = {},
    avgCpCompliance = 0,
    complianceBreakdown = {},
    voyagesByPerformance = {},
    insight = "",
  } = analytics

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">OPERATOR PERFORMANCE SUMMARY (This Month)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Savings */}
        <div>
          <div className="text-lg font-bold text-gray-900">
            Total Operator Savings: ${(totalSavings / 1000).toFixed(0)}K
          </div>
          <div className="mt-2 space-y-1 text-sm text-gray-700">
            {savingsBreakdown.bunkerOptimization && (
              <div>├─ From bunker optimization: ${(savingsBreakdown.bunkerOptimization / 1000).toFixed(0)}K ({savingsBreakdown.bunkerOptimizationPercent}%)</div>
            )}
            {savingsBreakdown.consumptionMonitoring && (
              <div>├─ From consumption monitoring: ${(savingsBreakdown.consumptionMonitoring / 1000).toFixed(0)}K ({savingsBreakdown.consumptionMonitoringPercent}%)</div>
            )}
            {savingsBreakdown.timingOptimization && (
              <div>└─ From timing optimization: ${(savingsBreakdown.timingOptimization / 1000).toFixed(0)}K ({savingsBreakdown.timingOptimizationPercent}%)</div>
            )}
          </div>
        </div>

        {/* Average CP Compliance */}
        <div>
          <div className="text-lg font-bold text-gray-900">
            Average CP Compliance: {avgCpCompliance}% ✅
          </div>
          <div className="mt-2 space-y-1 text-sm text-gray-700">
            {complianceBreakdown.speedConsumption && (
              <div>├─ Speed/Consumption: {complianceBreakdown.speedConsumption}%</div>
            )}
            {complianceBreakdown.onTime && (
              <div>├─ On-Time: {complianceBreakdown.onTime}%</div>
            )}
            {complianceBreakdown.quality && (
              <div>├─ Quality: {complianceBreakdown.quality}%</div>
            )}
            {complianceBreakdown.costManagement && (
              <div>└─ Cost Management: {complianceBreakdown.costManagement}%</div>
            )}
          </div>
        </div>

        {/* Voyages by Performance */}
        <div>
          <div className="text-sm font-semibold text-gray-900 mb-2">Voyages by Performance:</div>
          <div className="space-y-1 text-sm text-gray-700">
            {voyagesByPerformance.exceeding && (
              <div>├─ Exceeding plan: {voyagesByPerformance.exceeding} voyages ({voyagesByPerformance.exceedingPercent}%)</div>
            )}
            {voyagesByPerformance.onPlan && (
              <div>├─ On plan: {voyagesByPerformance.onPlan} voyages ({voyagesByPerformance.onPlanPercent}%)</div>
            )}
            {voyagesByPerformance.belowPlan && (
              <div>└─ Below plan: {voyagesByPerformance.belowPlan} voyage{voyagesByPerformance.belowPlan !== 1 ? "s" : ""} ({voyagesByPerformance.belowPlanPercent}%)</div>
            )}
          </div>
        </div>

        {/* Management Insight */}
        {insight && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-start gap-2">
              <span className="text-lg">💡</span>
              <div className="flex-1">
                <div className="font-semibold text-sm mb-1">MANAGEMENT INSIGHT:</div>
                <div className="text-sm text-gray-700">{insight}</div>
              </div>
            </div>
          </div>
        )}

        {/* Action */}
        <div className="pt-2 border-t">
          <Button variant="outline" size="sm" className="w-full">
            <Mail className="h-3 w-3 mr-1" />
            Email Report to Charterer/Management
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


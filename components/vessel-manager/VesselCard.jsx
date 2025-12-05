"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle2, TrendingUp, BarChart3, Wrench, MessageSquare, FileText } from "lucide-react"
import { format } from "date-fns"

export function VesselCard({ vessel, onClick }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "CRITICAL":
      case "ATTENTION_NEEDED":
        return "text-red-600"
      case "WARNING":
        return "text-yellow-600"
      case "HEALTHY":
      case "EXCELLENT":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "CRITICAL":
      case "ATTENTION_NEEDED":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case "EXCELLENT":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
    }
  }

  const getScoreBadge = (score) => {
    if (score >= 90) return <Badge className="bg-green-600">🟢</Badge>
    if (score >= 75) return <Badge className="bg-yellow-600">🟡</Badge>
    return <Badge variant="destructive">🔴</Badge>
  }

  return (
    <Card className="border-2 hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(vessel.status)}
            <CardTitle className="text-lg">{vessel.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Score: {vessel.performanceScore}/100</span>
            {getScoreBadge(vessel.performanceScore)}
          </div>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            Status: <strong className={getStatusColor(vessel.status)}>{vessel.status}</strong> - {vessel.statusReason}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Voyage */}
        {vessel.currentVoyage && (
          <div>
            <h4 className="font-semibold text-sm mb-2">CURRENT VOYAGE:</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <div>
                {vessel.currentVoyage.from} → {vessel.currentVoyage.to} (Day {vessel.currentVoyage.day} of {vessel.currentVoyage.totalDays})
              </div>
              <div className="ml-4 space-y-1">
                <div>├─ ETA: {format(new Date(vessel.currentVoyage.eta), "MMM d, HH:mm")} {vessel.currentVoyage.onTime && "✅"}</div>
                <div>├─ ROB: {vessel.rob?.vlsfo || 0} MT ({vessel.rob?.daysRemaining || 0} days remaining)</div>
                {vessel.currentVoyage.nextOperation && (
                  <div>└─ Next operation: {vessel.currentVoyage.nextOperation}</div>
                )}
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Performance Metrics */}
        <div>
          <h4 className="font-semibold text-sm mb-2">PERFORMANCE METRICS:</h4>
          <div className="space-y-3 text-sm">
            {/* Consumption Efficiency */}
            {vessel.metrics?.consumptionEfficiency && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span>Consumption Efficiency: {vessel.metrics.consumptionEfficiency.score}/100</span>
                  {vessel.metrics.consumptionEfficiency.score < 70 ? (
                    <Badge variant="destructive">🔴</Badge>
                  ) : vessel.metrics.consumptionEfficiency.score >= 90 ? (
                    <Badge className="bg-green-600">✅</Badge>
                  ) : (
                    <Badge className="bg-yellow-600">⚠️</Badge>
                  )}
                </div>
                <div className="ml-4 space-y-1 text-gray-600">
                  <div>
                    ├─ Actual: {vessel.metrics.consumptionEfficiency.actual} MT/day vs Plan:{" "}
                    {vessel.metrics.consumptionEfficiency.plan} MT/day ({vessel.metrics.consumptionEfficiency.variance > 0 ? "+" : ""}
                    {vessel.metrics.consumptionEfficiency.variance}%)
                  </div>
                  <div>├─ Root cause: {vessel.metrics.consumptionEfficiency.rootCause}</div>
                  <div>
                    └─ Cost impact: ${vessel.metrics.consumptionEfficiency.costImpact?.toLocaleString()}/day = $
                    {vessel.metrics.consumptionEfficiency.totalWasted?.toLocaleString()} wasted this voyage
                  </div>
                </div>
              </div>
            )}

            {/* Hull Performance */}
            {vessel.metrics?.hullPerformance && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span>Hull Performance: {vessel.metrics.hullPerformance.score}/100</span>
                  {vessel.metrics.hullPerformance.score < 70 ? (
                    <Badge variant="destructive">🔴</Badge>
                  ) : (
                    <Badge className="bg-green-600">✅</Badge>
                  )}
                </div>
                <div className="ml-4 space-y-1 text-gray-600">
                  <div>├─ Days since cleaning: {vessel.metrics.hullPerformance.daysSinceCleaning} {vessel.metrics.hullPerformance.daysOverdue > 0 && `(${vessel.metrics.hullPerformance.daysOverdue} days overdue)`}</div>
                  {vessel.metrics.hullPerformance.resistanceIncrease && (
                    <div>├─ Resistance increase: +{vessel.metrics.hullPerformance.resistanceIncrease}%</div>
                  )}
                  <div>└─ Action: {vessel.metrics.hullPerformance.action}</div>
                </div>
              </div>
            )}

            {/* Engine Performance */}
            {vessel.metrics?.enginePerformance && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span>Engine Performance: {vessel.metrics.enginePerformance.score}/100</span>
                  <Badge className="bg-green-600">✅</Badge>
                </div>
                <div className="ml-4 space-y-1 text-gray-600">
                  <div>├─ Efficiency: {vessel.metrics.enginePerformance.efficiency}</div>
                  <div>└─ {vessel.metrics.enginePerformance.issues?.length === 0 ? "No issues detected" : vessel.metrics.enginePerformance.issues?.join(", ")}</div>
                </div>
              </div>
            )}

            {/* Charter Party Compliance */}
            {vessel.metrics?.charterPartyCompliance && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span>Charter Party Compliance: {vessel.metrics.charterPartyCompliance.score}/100</span>
                  {vessel.metrics.charterPartyCompliance.score >= 98 ? (
                    <Badge className="bg-green-600">✅</Badge>
                  ) : (
                    <Badge className="bg-yellow-600">⚠️</Badge>
                  )}
                </div>
                <div className="ml-4 space-y-1 text-gray-600">
                  <div>├─ Speed: {vessel.metrics.charterPartyCompliance.speed === "WITHIN_TOLERANCE" ? "Within tolerance ✅" : vessel.metrics.charterPartyCompliance.speed}</div>
                  <div>
                    ├─ Consumption: {vessel.metrics.charterPartyCompliance.consumption === "MARGINAL" ? "Marginal" : vessel.metrics.charterPartyCompliance.consumption} {vessel.metrics.charterPartyCompliance.consumptionVariance && `(${vessel.metrics.charterPartyCompliance.consumptionVariance > 0 ? "+" : ""}${vessel.metrics.charterPartyCompliance.consumptionVariance}% over CP terms)`} ⚠️
                  </div>
                  {vessel.metrics.charterPartyCompliance.risk && (
                    <div>└─ Risk: {vessel.metrics.charterPartyCompliance.risk}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Commercial Impact */}
        {vessel.commercialImpact && (
          <div>
            <h4 className="font-semibold text-sm mb-2">COMMERCIAL IMPACT:</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <div>
                ├─ Voyage P&L: {vessel.commercialImpact.voyagePnL > 0 ? "+" : ""}$
                {Math.abs(vessel.commercialImpact.voyagePnL).toLocaleString()} vs plan{" "}
                {vessel.commercialImpact.voyagePnL > 0 ? "(excellent!) ✅" : "(due to over-consumption)"}
              </div>
              <div>
                ├─ Bunker cost: ${vessel.commercialImpact.bunkerCost?.actual?.toLocaleString()} vs $
                {vessel.commercialImpact.bunkerCost?.budget?.toLocaleString()} budgeted ({vessel.commercialImpact.bunkerCost?.variance > 0 ? "+" : ""}
                {vessel.commercialImpact.bunkerCost?.variance}%)
              </div>
              {vessel.commercialImpact.savingsPotential && (
                <div>└─ Operator savings potential: ${vessel.commercialImpact.savingsPotential.toLocaleString()} if hull cleaned</div>
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Compliance Status */}
        {vessel.compliance && (
          <div>
            <h4 className="font-semibold text-sm mb-2">COMPLIANCE STATUS:</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <div>├─ EU ETS: {vessel.compliance.euEts === "TRACKED" ? "✅ Tracked" : vessel.compliance.euEts}</div>
              <div>
                ├─ FuelEU: {vessel.compliance.fuelEu === "NON_COMPLIANT" ? "⚠️" : "✅"} {vessel.compliance.fuelEu === "NON_COMPLIANT" ? `${vessel.compliance.fuelEuVariance}% over limit (non-compliant)` : "Well below limit"}
              </div>
              <div>
                ├─ CII Rating: {vessel.compliance.cii} {vessel.compliance.ciiPercentToD && `(${vessel.compliance.ciiPercentToD}% toward D)`} {vessel.compliance.ciiPercentToD > 70 ? "⚠️" : vessel.compliance.cii === "A" ? "🏆" : ""}
              </div>
              {vessel.compliance.ciiPercentToD > 70 && (
                <div>└─ Action needed: Reduce consumption or use biofuel</div>
              )}
            </div>
          </div>
        )}

        {/* Best Practice Learnings */}
        {vessel.bestPractices && (
          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">💡 BEST PRACTICE LEARNINGS:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              {vessel.bestPractices.map((practice, idx) => (
                <li key={idx}>• {practice}</li>
              ))}
            </ul>
          </div>
        )}

        <Separator />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onClick(vessel) }}>
            <BarChart3 className="mr-2 h-4 w-4" />
            View Full Analysis
          </Button>
          {vessel.status === "ATTENTION_NEEDED" && (
            <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
              <Wrench className="mr-2 h-4 w-4" />
              Request Maintenance
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact Master
          </Button>
          <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
            <FileText className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


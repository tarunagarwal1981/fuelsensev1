"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Charter Party Compliance Section
 * Shows compliance status for speed/consumption, on-time, quality, and cost
 */
export function CharterPartyCompliance({ compliance }) {
  if (!compliance) return null

  const {
    speedConsumption = {},
    onTime = {},
    quality = {},
    cost = {},
    overall = 98,
  } = compliance

  const getStatusIcon = (status) => {
    if (status === "COMPLIANT" || status === "EXCELLENT") {
      return <CheckCircle2 className="h-4 w-4 text-success" />
    }
    return <AlertTriangle className="h-4 w-4 text-warning" />
  }

  const getStatusBadge = (status) => {
    if (status === "COMPLIANT" || status === "EXCELLENT") {
      return <Badge className="bg-success text-white text-xs">✅ COMPLIANT</Badge>
    }
    if (status === "MINOR_VARIANCE") {
      return <Badge className="bg-warning text-black text-xs">⚠️ MINOR VARIANCE</Badge>
    }
    return <Badge className="bg-danger text-white text-xs">❌ VARIANCE</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">CHARTER PARTY COMPLIANCE</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Speed/Consumption */}
        {speedConsumption.status && (
          <div className="border rounded-md p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(speedConsumption.status)}
                <span className="font-medium text-sm">Speed/Consumption:</span>
              </div>
              {getStatusBadge(speedConsumption.status)}
            </div>
            {speedConsumption.cpTerms && (
              <div className="text-xs text-gray-600 space-y-1">
                <div>├─ CP Terms: "{speedConsumption.cpTerms}"</div>
                {speedConsumption.actual && (
                  <div>├─ Actual: {speedConsumption.actual}</div>
                )}
                {speedConsumption.statusText && (
                  <div>└─ Status: {speedConsumption.statusText}</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* On-Time Performance */}
        {onTime.status && (
          <div className="border rounded-md p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(onTime.status)}
                <span className="font-medium text-sm">On-Time Performance:</span>
              </div>
              {getStatusBadge(onTime.status)}
            </div>
            {onTime.plannedETA && (
              <div className="text-xs text-gray-600 space-y-1">
                <div>├─ Planned ETA: {onTime.plannedETA}</div>
                {onTime.currentETA && (
                  <div>├─ Current ETA: {onTime.currentETA}</div>
                )}
                {onTime.reason && (
                  <div>└─ Reason: {onTime.reason}</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Bunker Quality */}
        {quality.status && (
          <div className="border rounded-md p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(quality.status)}
                <span className="font-medium text-sm">Bunker Quality:</span>
              </div>
              {getStatusBadge(quality.status)}
            </div>
            {quality.details && (
              <div className="text-xs text-gray-600 space-y-1">
                {quality.details.map((detail, i) => (
                  <div key={i}>
                    {i === quality.details.length - 1 ? "└─" : "├─"} {detail}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cost vs Budget */}
        {cost.status && (
          <div className="border rounded-md p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(cost.status)}
                <span className="font-medium text-sm">Cost vs Budget:</span>
              </div>
              {getStatusBadge(cost.status)}
            </div>
            {cost.planned && (
              <div className="text-xs text-gray-600 space-y-1">
                <div>├─ Planned bunker: ${cost.planned.toLocaleString()}</div>
                {cost.actual && (
                  <div>├─ Actual bunker: ${cost.actual.toLocaleString()}</div>
                )}
                {cost.variance && (
                  <div>└─ Variance: {cost.variance}</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Overall Compliance Score */}
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-sm">OVERALL CP COMPLIANCE:</div>
            <Badge className="bg-success text-white text-sm px-3 py-1">
              {overall}/100 ✅ EXCELLENT
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


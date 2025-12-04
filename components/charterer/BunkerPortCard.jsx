"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

/**
 * Bunker Port Card - Individual port comparison card
 * Shows detailed breakdown for a single bunker port option
 */
export function BunkerPortCard({ port, isRecommended, isExpensive, savingsVsBest }) {
  const getAvailabilityIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <CheckCircle2 className="h-4 w-4 text-success" />
      case "subject to berth":
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case "unavailable":
        return <XCircle className="h-4 w-4 text-danger" />
      default:
        return <CheckCircle2 className="h-4 w-4 text-success" />
    }
  }

  const getAvailabilityText = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "✅ Confirmed"
      case "subject to berth":
        return "⚠️ Subject to berth"
      case "pending":
        return "⚠️ Pending confirmation"
      case "unavailable":
        return "❌ Unavailable"
      default:
        return "✅ Confirmed"
    }
  }

  return (
    <Card
      className={cn(
        "border-2 transition-all",
        isRecommended && "border-success bg-green-50/50",
        isExpensive && "border-red-200 bg-red-50/30",
        !isRecommended && !isExpensive && "border-gray-200"
      )}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm">
                {port.name} ({port.country})
              </h4>
              {isRecommended && (
                <Badge className="bg-success text-white text-xs">
                  🏆 RECOMMENDED
                </Badge>
              )}
              {isExpensive && (
                <Badge className="bg-danger text-white text-xs">
                  🔴 EXPENSIVE
                </Badge>
              )}
            </div>
            {isRecommended && (
              <p className="text-xs text-gray-600">Best value</p>
            )}
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-600">Bunker Price:</span>
              <div className="font-medium">
                ${port.price}/MT
                {port.priceDifference && (
                  <span className={cn(
                    "ml-1",
                    port.priceDifference > 0 ? "text-danger" : "text-success"
                  )}>
                    ({port.priceDifference > 0 ? "+" : ""}${port.priceDifference}/MT)
                  </span>
                )}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Quantity:</span>
              <div className="font-medium">{port.quantity} MT</div>
            </div>
            <div>
              <span className="text-gray-600">Bunker Cost:</span>
              <div className="font-medium">
                ${(port.bunkerCost / 1000).toFixed(0)}K
              </div>
            </div>
            <div>
              <span className="text-gray-600">Port Charges:</span>
              <div className="font-medium">
                ${(port.portCharges / 1000).toFixed(1)}K
              </div>
            </div>
          </div>

          {/* Deviation Info */}
          {port.deviation && (
            <div className="pt-2 border-t space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Deviation:</span>
                <span className="font-medium">
                  {port.deviation.distance > 0 ? "+" : ""}
                  {port.deviation.distance} nm
                  {port.deviation.time > 0 && (
                    <span className="text-gray-500 ml-1">
                      (+{port.deviation.time.toFixed(1)} days)
                    </span>
                  )}
                </span>
              </div>
              {port.deviation.totalCost > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    Deviation Cost:
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">
                            Fuel cost: ${(port.deviation.fuelCost / 1000).toFixed(1)}K
                            <br />
                            Time cost: ${(port.deviation.timeCost / 1000).toFixed(1)}K
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                  <span className="font-medium">
                    ${(port.deviation.totalCost / 1000).toFixed(1)}K
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Total Cost */}
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">TOTAL COST:</span>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-lg font-bold",
                  isRecommended && "text-success",
                  isExpensive && "text-danger"
                )}>
                  ${(port.totalCost / 1000).toFixed(0)}K
                </span>
                {isRecommended && (
                  <Badge className="bg-success text-white text-xs">LOWEST</Badge>
                )}
              </div>
            </div>
            {savingsVsBest !== 0 && (
              <div className={cn(
                "text-xs mt-1 text-right",
                savingsVsBest > 0 ? "text-danger" : "text-success"
              )}>
                {savingsVsBest > 0 ? "+" : ""}
                ${(Math.abs(savingsVsBest) / 1000).toFixed(1)}K vs Port Klang
              </div>
            )}
          </div>
        </div>

        {/* Supplier Info */}
        <div className="pt-3 border-t space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Supplier:</span>
            <span className="font-medium">{port.supplier?.name || port.supplier}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Reliability:</span>
            <span className="font-medium">{port.reliability || port.supplier?.reliability || 0}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 flex items-center gap-1">
              Availability:
              {getAvailabilityIcon(port.availabilityStatus || port.supplier?.availabilityStatus)}
            </span>
            <span className="font-medium">
              {getAvailabilityText(port.availabilityStatus || port.supplier?.availabilityStatus)}
              {port.deliveryTime && ` (${port.deliveryTime || port.supplier?.deliveryTime || 0}-hour delivery)`}
            </span>
          </div>
          {port.qualityScore && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Quality Score:</span>
              <span className="font-medium">{port.qualityScore}/10</span>
            </div>
          )}
        </div>

        {/* AI Insight for expensive options */}
        {isExpensive && port.aiInsight && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900 mb-1">AI Insight:</div>
                <p className="text-gray-700">{port.aiInsight}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


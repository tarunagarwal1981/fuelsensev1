"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertTriangle, XCircle, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Constraint Card - Individual constraint validation card
 * Shows status, risk score, and details for a single constraint
 */
export function ConstraintCard({ constraint, onViewDetails }) {
  const getStatusIcon = () => {
    if (constraint.passed) {
      return <CheckCircle2 className="h-5 w-5 text-success" />
    }
    return <XCircle className="h-5 w-5 text-danger" />
  }

  const getStatusBadge = () => {
    const variants = {
      VERIFIED: "bg-success text-white",
      CONFIRMED: "bg-success text-white",
      PERFECT_FIT: "bg-success text-white",
      ADEQUATE: "bg-success text-white",
      MANAGEABLE_CAUTION: "bg-warning text-black",
      CAUTION: "bg-warning text-black",
      FAILED: "bg-danger text-white",
    }
    return (
      <Badge className={cn("text-xs", variants[constraint.status] || "bg-gray-500")}>
        {constraint.status.replace(/_/g, " ")}
      </Badge>
    )
  }

  const getRiskColor = (risk) => {
    if (risk >= 9) return "bg-success"
    if (risk >= 7) return "bg-warning"
    if (risk >= 5) return "bg-warning"
    return "bg-danger"
  }

  const getRiskLabel = (risk) => {
    if (risk >= 9) return "No risk"
    if (risk >= 7) return "Low risk"
    if (risk >= 5) return "Medium risk"
    return "High risk"
  }

  return (
    <Card className={cn(
      "border-2 transition-all",
      constraint.passed ? "border-green-200 bg-green-50/30" : "border-red-200 bg-red-50/30"
    )}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1">
            {getStatusIcon()}
            <h4 className="font-semibold text-sm">{constraint.name}</h4>
          </div>
          {getStatusBadge()}
        </div>

        {/* Risk Score */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Risk:</span>
            <div className="flex items-center gap-2">
              <Progress
                value={constraint.risk * 10}
                className={cn("w-24 h-2", getRiskColor(constraint.risk))}
              />
              <span className="text-xs font-medium">
                {constraint.risk}/10 ({getRiskLabel(constraint.risk)})
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        {constraint.details && (
          <div className="space-y-2 text-xs text-gray-700">
            {constraint.details.portsFound && (
              <div>
                <span className="font-medium">{constraint.details.portsFound} ports confirmed</span>
                {constraint.details.ports && (
                  <ul className="mt-1 ml-4 space-y-1">
                    {constraint.details.ports.map((port, idx) => (
                      <li key={idx}>
                        • {port.name}: {port.quantity} MT available, delivery {port.deliveryTime} hrs
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {constraint.details.vesselName && (
              <div>
                <div className="font-medium">{constraint.details.vesselName}</div>
                {constraint.details.currentLocation && (
                  <div>• Current location: {constraint.details.currentLocation}</div>
                )}
                {constraint.details.availableDate && (
                  <div>• Next availability: {constraint.details.availableDate}</div>
                )}
                {constraint.details.suitability !== undefined && (
                  <div>• Vessel is {constraint.details.suitability ? "suitable" : "not suitable"} for cargo type</div>
                )}
              </div>
            )}

            {constraint.details.cargoLaycan && (
              <div>
                <div>• Cargo laycan: {constraint.details.cargoLaycan}</div>
                {constraint.details.vesselAvailable && (
                  <div>• Vessel available: {constraint.details.vesselAvailable}</div>
                )}
                {constraint.details.bufferTime && (
                  <div>• Buffer time: {constraint.details.bufferTime}</div>
                )}
                {constraint.details.loadPortReadiness && (
                  <div>• Load port readiness: {constraint.details.loadPortReadiness}</div>
                )}
              </div>
            )}

            {constraint.details.currentROB !== undefined && (
              <div>
                <div>• Current ROB: {constraint.details.currentROB} MT</div>
                {constraint.details.distanceToPort && (
                  <div>• Distance to bunker port: {constraint.details.distanceToPort} nm</div>
                )}
                {constraint.details.fuelNeeded && (
                  <div>• Fuel needed: ~{constraint.details.fuelNeeded} MT (conservative estimate)</div>
                )}
                {constraint.details.safetyMargin && (
                  <div>• Safety margin: {constraint.details.safetyMargin} ({constraint.details.safetyMarginRatio}x requirement)</div>
                )}
                {constraint.details.insight && (
                  <div className="text-primary-600 mt-1">💡 {constraint.details.insight}</div>
                )}
              </div>
            )}

            {constraint.details.issue && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
                <div className="font-medium text-gray-900 mb-1">{constraint.details.issue}</div>
                {constraint.details.probability && (
                  <div>• {constraint.details.probability}% probability of {constraint.details.impact}</div>
                )}
                {constraint.details.mitigation && (
                  <div>• {constraint.details.mitigation}</div>
                )}
                {constraint.details.nextUpdate && (
                  <div className="text-gray-600 mt-1">Next update: {constraint.details.nextUpdate}</div>
                )}
              </div>
            )}

            {constraint.details.loadPort && (
              <div>
                <div>• Load port ({constraint.details.loadPort}): {constraint.details.loadPortStatus}</div>
                {constraint.details.dischargePort && (
                  <div>• Discharge port ({constraint.details.dischargePort}): {constraint.details.dischargePortStatus}</div>
                )}
                {constraint.details.waitingTime && (
                  <div>• Expected waiting time: {constraint.details.waitingTime}</div>
                )}
                {constraint.details.congestion && (
                  <div>• Port congestion: {constraint.details.congestion}</div>
                )}
              </div>
            )}

            {constraint.details.vesselDraft && (
              <div>
                <div>• Vessel draft (loaded): {constraint.details.vesselDraft}m</div>
                {constraint.details.portLimit && (
                  <div>• Port limit: {constraint.details.portLimit}m</div>
                )}
                {constraint.details.clearance && (
                  <div>• Clearance: {constraint.details.clearance}m (adequate safety margin)</div>
                )}
                {constraint.details.tidalConstraints && (
                  <div>• Tidal constraints: {constraint.details.tidalConstraints}</div>
                )}
              </div>
            )}

            {constraint.details.lastVerified && (
              <div className="text-gray-500 text-xs mt-2">
                Last verified: {constraint.details.lastVerified}
              </div>
            )}
          </div>
        )}

        {/* Action Links */}
        {constraint.actionLinks && (
          <div className="flex gap-2 mt-3 pt-3 border-t">
            {constraint.actionLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => onViewDetails && onViewDetails(link.action)}
                className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                {link.label}
                <ExternalLink className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}


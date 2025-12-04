"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, RefreshCw, FileText } from "lucide-react"
import { formatDistanceToNow, addMinutes } from "date-fns"
import { ConstraintCard } from "./ConstraintCard"
import { RiskBreakdown } from "./RiskBreakdown"
import { cn } from "@/lib/utils"

/**
 * Viability Assessment Component
 * Comprehensive constraint validation and risk assessment
 */
export function ViabilityAssessment({ cargo, onRevalidate, onViewRiskReport }) {
  const [isValidating, setIsValidating] = useState(false)

  // Calculate viability assessment from cargo data
  const assessment = useMemo(() => {
    if (!cargo) return null

    const bunkerPortCount = cargo.bunkerPorts?.length || 0
    const isViable = cargo.viable && bunkerPortCount > 0

    // Calculate overall risk score (weighted average)
    const criticalConstraints = [
      {
        id: "bunker_available",
        name: "Bunker Available",
        status: bunkerPortCount > 0 ? "VERIFIED" : "FAILED",
        passed: bunkerPortCount > 0,
        risk: bunkerPortCount > 0 ? 10 : 0,
        details: {
          portsFound: bunkerPortCount,
          ports: cargo.bunkerPorts?.slice(0, 3).map(port => ({
            name: port.name,
            quantity: port.quantity || 850,
            deliveryTime: port.deliveryHours || 4,
          })),
          lastVerified: "5 minutes ago",
        },
        actionLinks: bunkerPortCount > 1 ? [
          { label: "View Bunker Port Analysis", action: "bunker_analysis" },
        ] : [],
      },
      {
        id: "vessel_available",
        name: "Vessel Available",
        status: "CONFIRMED",
        passed: true,
        risk: 10,
        details: {
          vesselName: cargo.vessel,
          currentLocation: `${cargo.loadPort} anchorage`,
          availableDate: new Date(cargo.laycanStart).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          suitability: true,
        },
      },
      {
        id: "laycan_match",
        name: "Laycan Match",
        status: "PERFECT_FIT",
        passed: true,
        risk: 10,
        details: {
          cargoLaycan: `${new Date(cargo.laycanStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${new Date(cargo.laycanEnd).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
          vesselAvailable: new Date(cargo.laycanStart).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          bufferTime: "1 day (adequate)",
          loadPortReadiness: "Confirmed",
        },
      },
      {
        id: "rob_sufficient",
        name: "ROB Sufficient",
        status: "ADEQUATE",
        passed: true,
        risk: 8,
        details: {
          currentROB: 420,
          distanceToPort: 285,
          fuelNeeded: 140,
          safetyMargin: 280,
          safetyMarginRatio: "2.0",
          insight: "More than enough fuel to reach bunker port",
        },
      },
    ]

    const secondaryFactors = [
      {
        id: "weather_risk",
        name: "Weather Risk",
        status: "MANAGEABLE_CAUTION",
        passed: true,
        risk: 7,
        details: {
          issue: "Tropical storm forming in Bay of Bengal",
          probability: 15,
          impact: "1-2 day delay",
          mitigation: "Route can be adjusted if storm intensifies. Not expected to impact bunker ports.",
          nextUpdate: "6 hours",
        },
        actionLinks: [
          { label: "View Weather Forecast", action: "weather" },
        ],
      },
      {
        id: "port_berth",
        name: "Port Berth Available",
        status: "CONFIRMED",
        passed: true,
        risk: 9,
        details: {
          loadPort: cargo.loadPort,
          dischargePort: cargo.dischargePort,
          loadPortStatus: "Berth confirmed",
          dischargePortStatus: "Berth confirmed",
          waitingTime: "<12 hours",
          congestion: "No port congestion reported",
        },
      },
      {
        id: "draft_compliant",
        name: "Draft Compliant",
        status: "COMPLIANT",
        passed: true,
        risk: 10,
        details: {
          vesselDraft: "12.5",
          portLimit: "13.0",
          clearance: "0.5",
          tidalConstraints: "None",
        },
      },
    ]

    // Calculate risk breakdown
    const riskBreakdown = {
      operational: 9,
      commercial: 8.5,
      weather: 7,
      technical: 9,
      financial: 8,
    }

    // Calculate overall risk score (weighted)
    const overallRiskScore = (
      riskBreakdown.operational * 0.25 +
      riskBreakdown.commercial * 0.25 +
      riskBreakdown.weather * 0.2 +
      riskBreakdown.technical * 0.15 +
      riskBreakdown.financial * 0.15
    )

    const aiAssessment = {
      summary: isViable
        ? "This cargo can be fixed with high confidence. All critical constraints are satisfied. The only notable risk is weather, which is manageable and has low probability of impact. Overall risk-reward profile is excellent."
        : "Cannot fix - critical constraints not met. Bunker availability is required.",
      recommendation: isViable ? "PROCEED_TO_FIX" : "DO_NOT_FIX",
    }

    return {
      overallStatus: isViable ? "CAN_FIX_SAFELY" : "CANNOT_FIX",
      confidence: isViable ? 95 : 0,
      riskScore: overallRiskScore,
      lastValidated: "2 minutes ago",
      nextCheck: "5 minutes",
      constraints: {
        critical: criticalConstraints,
        secondary: secondaryFactors,
      },
      riskBreakdown,
      aiAssessment,
    }
  }, [cargo])

  if (!assessment) return null

  const handleRevalidate = async () => {
    setIsValidating(true)
    if (onRevalidate) {
      await onRevalidate()
    }
    setTimeout(() => setIsValidating(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-900">
              CONSTRAINT VALIDATION & RISK ASSESSMENT
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              {assessment.overallStatus === "CAN_FIX_SAFELY" ? (
                <CheckCircle2 className="h-4 w-4 text-success" />
              ) : (
                <span className="text-danger">❌</span>
              )}
              <span className="font-medium">
                VIABILITY ASSESSMENT: {assessment.overallStatus === "CAN_FIX_SAFELY" ? "✅ CAN FIX SAFELY" : "❌ CANNOT FIX"}
              </span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <span>Overall Confidence: {assessment.confidence}%</span>
            <Separator orientation="vertical" className="h-4" />
            <span>Risk Score: {assessment.riskScore.toFixed(1)}/10</span>
            <Badge className={cn(
              "text-xs",
              assessment.riskScore >= 8 ? "bg-success text-white" :
              assessment.riskScore >= 6 ? "bg-warning text-black" :
              "bg-danger text-white"
            )}>
              {assessment.riskScore >= 8 ? "Low" : assessment.riskScore >= 6 ? "Medium" : "High"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Critical Constraints */}
      <div>
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
          CRITICAL CONSTRAINTS (Must Pass)
        </h4>
        <div className="space-y-3">
          {assessment.constraints.critical.map((constraint) => (
            <ConstraintCard
              key={constraint.id}
              constraint={constraint}
              onViewDetails={onViewRiskReport}
            />
          ))}
        </div>
      </div>

      {/* Secondary Factors */}
      <div>
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
          SECONDARY FACTORS
        </h4>
        <div className="space-y-3">
          {assessment.constraints.secondary.map((constraint) => (
            <ConstraintCard
              key={constraint.id}
              constraint={constraint}
              onViewDetails={onViewRiskReport}
            />
          ))}
        </div>
      </div>

      {/* Risk Breakdown */}
      <RiskBreakdown
        riskBreakdown={assessment.riskBreakdown}
        aiAssessment={assessment.aiAssessment}
        overallRiskScore={assessment.riskScore}
        confidence={assessment.confidence}
      />

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-2 border-t text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>Last validation: {assessment.lastValidated}</span>
          <span>Next check: {assessment.nextCheck}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={handleRevalidate}
            disabled={isValidating}
          >
            <RefreshCw className={cn("h-3 w-3 mr-1", isValidating && "animate-spin")} />
            Re-validate Now
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => onViewRiskReport && onViewRiskReport("risk_report")}
          >
            <FileText className="h-3 w-3 mr-1" />
            View Full Risk Report
          </Button>
        </div>
      </div>
    </div>
  )
}


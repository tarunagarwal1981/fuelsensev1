"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { VesselPerformanceOverview } from "./VesselPerformanceOverview"
import { RootCauseAnalysis } from "./RootCauseAnalysis"
import { CommercialImpactAnalysis } from "./CommercialImpactAnalysis"
import { OptimizationOptions } from "./OptimizationOptions"
import { HistoricalPerformanceTrend } from "./HistoricalPerformanceTrend"
import { OtherTechnicalFactors } from "./OtherTechnicalFactors"
import { MessageSquare, Mail, FileText } from "lucide-react"
import { useStore } from "@/lib/store"

/**
 * Vessel Performance - Main component
 * Links technical performance to commercial impact with optimization recommendations
 */
export function VesselPerformance() {
  const { vessels, cargoes } = useStore()
  const [selectedVessel, setSelectedVessel] = useState("all")

  // Get vessel options
  const vesselOptions = useMemo(() => {
    return vessels.map((v) => ({ value: v.imo, label: v.name }))
  }, [vessels])

  // Mock performance data - in real app, calculate from actual vessel data
  const performanceData = useMemo(() => {
    // This would be calculated from actual vessel data
    return {
      vessel: "MV Ocean Star",
      route: "Singapore → Rotterdam",
      dayOfVoyage: 15,
      totalDays: 35,
      currentSpeed: 13.6,
      rob: 395,
      status: "ATTENTION",
      statusMessage: "Over-consuming fuel",
      performance: {
        technical: {
          consumption: 25,
          planned: 22,
          variance: 3,
          variancePercent: 14,
        },
        commercial: {
          dailyCost: 16125,
          plannedCost: 14190,
          extraCost: 1935,
          extraCostPercent: 14,
        },
        health: {
          score: 72,
          rating: "FAIR ⚠️",
          trend: "Declining",
        },
        voyageImpact: {
          extraFuel: 60,
          extraFuelDays: 20,
          extraCost: 38700,
          extraCostDays: 20,
          profitImpact: -38700,
          profitImpactPercent: 12,
        },
      },
      rootCause: {
        factors: [
          {
            name: "HULL FOULING",
            contribution: 40,
            icon: "🐚",
            isPrimary: true,
            details: [
              "Detected hull resistance increase: +18%",
              "├─ Last hull cleaning: 142 days ago (Port Klang)",
              "├─ Recommended interval: 120 days",
              "└─ Days overdue: 22 days",
            ],
            impact: [
              "Extra fuel: ~1.2 MT/day",
              "Cost impact: $774/day",
              "Total since overdue: $17,028 wasted 🔴",
            ],
            comparison: [
              "MV Atlantic (cleaned 45 days ago): 21.5 MT/day",
              "MV Baltic (cleaned 60 days ago): 22.8 MT/day",
              "MV Ocean Star (142 days ago): 25.0 MT/day ⚠️",
            ],
            confidence: "95% - Pattern matches hull fouling",
          },
          {
            name: "WEATHER IMPACT",
            contribution: 30,
            icon: "🌊",
            details: [
              "Heavy seas: Beaufort 6 (past 3 days)",
              "Extra fuel: ~0.9 MT/day",
              "Outside operator control ✅",
              "Weather improving tomorrow (-0.5 MT/day expected)",
            ],
          },
          {
            name: "SPEED VARIANCE",
            contribution: 20,
            icon: "⚡",
            details: [
              "Running 13.6 knots vs planned 13.5 knots",
              "Extra fuel: ~0.6 MT/day",
              "Reason: Making up time from weather delay",
              "Action: Can reduce to 13.3 knots (save 0.8 MT/day)",
            ],
          },
          {
            name: "ENGINE PERFORMANCE",
            contribution: 10,
            icon: "🔧",
            details: [
              "Main engine efficiency: 97% (normal for age)",
              "Extra fuel: ~0.3 MT/day",
              "Within acceptable range ✅",
              "No action needed",
            ],
          },
        ],
        controllable: 60,
        uncontrollable: 40,
      },
      commercialImpact: {
        originalPlan: {
          consumption: "770 MT",
          consumptionDays: "22 MT/day × 35 days",
          bunkerCost: 496650,
          bunkerPrice: 645,
          profit: 312000,
        },
        currentTrajectory: {
          consumption: "875 MT",
          consumptionDays: "25 MT/day × 35 days",
          bunkerCost: 564375,
          bunkerPrice: 645,
          extraCost: 67725,
          profit: 244275,
          profitVariance: "-22%",
        },
        charterPartyRisk: {
          terms: "About 13.5 knots, VLSFO 8.2 MT/day",
          actual: "13.6 knots, 8.3 MT/day (per knot basis)",
          status: "Within tolerance (just barely) ⚠️",
          risk: "If consumption increases further, CP claim possible",
        },
        timeValue: {
          dailyHire: 18500,
          daySaved: 18500,
          downtimeCost: 9250,
          downtimeDays: "0.5 day",
        },
      },
      optimizationOptions: [
        {
          id: "rotterdam",
          title: "HULL CLEANING AT ROTTERDAM",
          isRecommended: false,
          action: "Schedule underwater hull cleaning on arrival",
          costs: {
            "Cleaning service": "$8,500 (professional ROV)",
            "Port time": "0.5 day (12 hours)",
            "Downtime cost": "$9,250 (0.5 × $18,500)",
            "TOTAL COST": "$17,750",
          },
          benefits: [
            "Consumption improvement: -3 MT/day (back to 22 MT)",
            "Daily savings: $1,935/day",
            "Payback period: 9 days",
          ],
          next60Days: {
            "Fuel saved": "180 MT (3 MT/day × 60 days)",
            "Cost saved": "$116,100",
            "Less cleaning cost": "-$17,750",
            "NET SAVINGS": "$98,350 ✅",
          },
          roi: "554% (in 60 days)",
          operationalDetails: {
            "Location": "Rotterdam Anchorage",
            "Provider": "HullWiper International (rated 4.8/5)",
            "Timing": "After discharge, before ballast departure",
            "Weather window": "Required (good forecast ✅)",
            "Port approval": "Pre-approved for this service",
            "Environmental": "Compliant (capture system used)",
            "ROUTE DEVIATION": "None (on route)",
          },
          actions: [
            { label: "Request Quote", icon: "quote" },
            { label: "Approve & Schedule", icon: "approve", primary: true },
          ],
        },
        {
          id: "lisbon",
          title: "HULL CLEANING AT INTERMEDIATE PORT",
          isRecommended: true,
          action: "Deviate to Lisbon for hull cleaning (Day 22)",
          costs: {
            "Cleaning service": "$7,200 (Lisbon pricing)",
            "Deviation": "+85 nm (+8 hours)",
            "Deviation fuel": "8 MT @ $645/MT = $5,160",
            "Time cost": "$6,167 (0.33 day)",
            "Port charges": "$3,500",
            "TOTAL COST": "$22,027",
          },
          benefits: [
            "Earlier cleaning (save 7 days of over-consumption)",
            "Extra savings: $13,545 (7 days × $1,935)",
            "Next 60 days savings: $116,100 (same as Option A)",
            "NET SAVINGS: $107,618 ✅ (+$9,268 vs Option A)",
          ],
          roi: "589% (higher due to earlier intervention)",
          tradeoffs: [
            "⚠️ Requires route deviation approval",
            "⚠️ Slight ETA delay (+8 hours) - check with charterer",
            "✅ Better long-term savings",
          ],
          actions: [
            { label: "Request Quote", icon: "quote" },
            { label: "Contact Charterer", icon: "contact" },
          ],
        },
        {
          id: "speed",
          title: "SPEED OPTIMIZATION (NO CLEANING)",
          isRecommended: false,
          action: "Reduce speed to optimize fuel consumption",
          costs: {
            "Cleaning cost": "$0",
            "Delay cost": "$13,875 (0.75 day late)",
            "TOTAL COST": "$13,875",
          },
          benefits: [
            "Remaining voyage savings: $10,320 (20 days)",
            "NET IMPACT: -$3,555 ❌ (Not economical)",
          ],
          issues: [
            "❌ Doesn't solve root cause (hull still fouled)",
            "❌ Over-consumption continues on next voyage",
            "❌ Late arrival may have commercial penalties",
            "⚠️ NOT RECOMMENDED",
          ],
        },
        {
          id: "nothing",
          title: "DO NOTHING (BASELINE)",
          isRecommended: false,
          action: "Continue current operations, clean next drydock",
          costs: {
            "This voyage extra fuel": "$38,700",
            "Next 2 voyages (60 days)": "$116,100",
            "TOTAL COST": "$154,800 🔴",
          },
          issues: [
            "❌ Performance degradation worsens",
            "❌ Possible CP compliance issues",
            "❌ Competitive disadvantage (higher costs)",
            "⚠️ NOT RECOMMENDED",
          ],
        },
      ],
      recommendation: {
        title: "Option B (Lisbon cleaning)",
        reasoning: [
          "Best ROI: 589% over 60 days",
          "Solves root cause immediately",
          "Saves $107,618 vs doing nothing",
          "Minimal route deviation (85 nm acceptable)",
          "Weather window favorable",
          "Prevents CP compliance risk",
        ],
        nextSteps: [
          "Contact Charterer for Approval",
          "Request Quote",
          "Notify Vessel",
          "Update Voyage Plan",
        ],
      },
      historicalTrend: {
        vessel: "MV Ocean Star",
        data: [
          { month: "Jan", consumption: 21.2 },
          { month: "Feb", consumption: 21.5 },
          { month: "Mar", consumption: 21.8 },
          { month: "Apr", consumption: 22.1 },
          { month: "May", consumption: 22.4 },
          { month: "Jun", consumption: 22.7, cleaning: true },
          { month: "Jul", consumption: 21.8 },
          { month: "Aug", consumption: 22.1 },
          { month: "Sep", consumption: 22.4 },
          { month: "Oct", consumption: 22.7 },
          { month: "Nov", consumption: 23.0 },
          { month: "Dec", consumption: 23.3 },
          { month: "Now", consumption: 25.0 },
        ],
        pattern: {
          degradation: "0.21 MT/day per month",
          lastCleaningImpact: "-4 MT/day improvement",
          optimalInterval: "120 days",
          currentlyOverdue: "22 days",
        },
        comparison: [
          { vessel: "MV Atlantic (same design)", consumption: "21.5", note: "cleaned recently" },
          { vessel: "MV Baltic (same design)", consumption: "22.8", note: "cleaned 60d ago" },
          { vessel: "MV Ocean Star", consumption: "25.0", note: "overdue cleaning", flag: "⚠️" },
        ],
      },
      otherFactors: {
        engine: {
          efficiency: "97.2%",
          auxiliary: "Normal operation",
          fuelQuality: "Within spec ✅",
          nextMaintenance: "245 hours (18 days)",
        },
        trim: {
          current: "0.5m by stern (acceptable)",
          potential: "Minimal (~0.1 MT/day)",
          status: "Optimized ✅",
        },
        propeller: {
          lastInspection: "89 days ago",
          condition: "Good (no fouling detected)",
          nextInspection: "186 days",
        },
        weatherRouting: {
          currentRoute: "Optimal for conditions",
          alternatives: "2",
          potentialSavings: "<1% (not worth deviation)",
        },
      },
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">VESSEL PERFORMANCE - Technical & Commercial Integration</h2>
        <p className="text-gray-600 mt-1">Real-time monitoring with optimization recommendations</p>
      </div>

      {/* Vessel Selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">SELECT VESSEL:</span>
          <Select value={selectedVessel} onValueChange={setSelectedVessel}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select vessel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vessels</SelectItem>
              {vesselOptions.map((v) => (
                <SelectItem key={v.value} value={v.value}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Vessel Info Header */}
      <div className="bg-gray-100 border-2 border-gray-300 rounded-md p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-gray-900">
              {performanceData.vessel} - {performanceData.route}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Day {performanceData.dayOfVoyage} of {performanceData.totalDays} | Current Speed: {performanceData.currentSpeed} knots | ROB: {performanceData.rob} MT
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <VesselPerformanceOverview performance={performanceData.performance} />

      {/* Root Cause Analysis */}
      <RootCauseAnalysis analysis={performanceData.rootCause} />

      {/* Commercial Impact Analysis */}
      <CommercialImpactAnalysis impact={performanceData.commercialImpact} />

      {/* Optimization Options */}
      <OptimizationOptions
        options={performanceData.optimizationOptions}
        recommendation={performanceData.recommendation}
      />

      {/* Historical Performance Trend */}
      <HistoricalPerformanceTrend trend={performanceData.historicalTrend} />

      {/* Other Technical Factors */}
      <OtherTechnicalFactors factors={performanceData.otherFactors} />

      {/* Footer Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <Button variant="outline" size="sm">
          <MessageSquare className="h-3 w-3 mr-1" />
          Contact Vessel
        </Button>
        <Button variant="outline" size="sm">
          <Mail className="h-3 w-3 mr-1" />
          Report to Charterer
        </Button>
        <Button variant="outline" size="sm">
          <FileText className="h-3 w-3 mr-1" />
          Export PDF
        </Button>
      </div>
    </div>
  )
}


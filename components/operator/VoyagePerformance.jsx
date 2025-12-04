"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { VoyagePerformanceMetrics } from "./VoyagePerformanceMetrics"
import { VoyagePerformanceCard } from "./VoyagePerformanceCard"
import { CompletedVoyagesTable } from "./CompletedVoyagesTable"
import { VoyagePerformanceAnalytics } from "./VoyagePerformanceAnalytics"
import { useStore } from "@/lib/store"

/**
 * Voyage Performance - Main component
 * Shows operator impact on voyage economics
 */
export function VoyagePerformance() {
  const { vessels, bunkerPlans, cargoes } = useStore()
  const [filter, setFilter] = useState("all") // 'all' | 'time' | 'voyage' | 'spot'
  const [sortBy, setSortBy] = useState("savings") // 'savings' | 'risk' | 'status'

  // Calculate fleet-wide metrics
  const metrics = useMemo(() => {
    // Mock metrics - in real app, calculate from actual voyage data
    return {
      activeVoyages: 12,
      bunkerSavings: 234000,
      onTimePerformance: 94,
      cpCompliance: 98,
      onTimeTrend: "+3",
    }
  }, [])

  // Mock active voyages data - in real app, calculate from vessels/cargoes
  const activeVoyages = useMemo(() => {
    return [
      {
        vessel: "MV Ocean Star",
        route: "Singapore → Rotterdam",
        charterType: "Time Charter",
        charterRate: "$18,500/day",
        status: "IN_PROGRESS",
        dayOfVoyage: 15,
        totalDays: 35,
        economics: {
          freightRevenue: 1250000,
          freightDetails: "Daily Hire: $18,500/day × 35 days",
          freightStatus: "On track",
          bunkerCost: {
            actual: 548250,
            planned: 585000,
            savings: 36750,
            savingsPercent: 6.3,
          },
          portCosts: {
            actual: 180000,
            planned: 180000,
          },
          canalPilot: {
            actual: 45000,
            planned: 45000,
          },
          otherCosts: 15000,
          netResult: {
            actual: 461750,
            planned: 425000,
            variance: 36750,
          },
        },
        operatorContribution: {
          savings: [
            {
              title: "Bunker Port Selection",
              amount: 37000,
              description: "Chose Port Klang vs planned Singapore",
              details: [
                "Price: $645/MT vs $695/MT",
                "Quantity: 850 MT",
                "Deviation cost: -$12,500",
                "Net savings: $37,000 ✅",
              ],
            },
            {
              title: "Market Timing",
              amount: 4500,
              description: "Delayed bunker by 6 hours for price drop",
              details: [
                "Price saved: $5/MT on 900 MT",
              ],
            },
            {
              title: "Consumption Monitoring",
              amount: 2250,
              description: "Caught over-consumption early (Day 8)",
              details: [
                "Speed optimization recommended",
                "Saved ~30 MT fuel",
              ],
            },
          ],
          costs: [
            {
              title: "Weather Delay",
              amount: 9250,
              description: "0.5 day delay (heavy seas)",
              details: [
                "Outside operator control",
                "Impact: 0.5 × $18,500/day",
              ],
            },
          ],
          netImpact: 34500,
          assessment: "Excellent performance. Operator's decisions added $34.5K value to this voyage through optimal bunker strategy and active monitoring. Weather delay was unavoidable.",
        },
        cpCompliance: {
          speedConsumption: {
            status: "COMPLIANT",
            cpTerms: "About 13.5 knots, VLSFO 8.2 MT/day",
            actual: "13.6 knots, 8.1 MT/day",
            statusText: "Within tolerances ✅",
          },
          onTime: {
            status: "MINOR_VARIANCE",
            plannedETA: "Dec 20, 08:00",
            currentETA: "Dec 20, 20:00 (+12 hours)",
            reason: "Weather (Force Majeure) ✅",
          },
          quality: {
            status: "COMPLIANT",
            details: [
              "All samples tested and approved",
              "No off-spec incidents",
              "Certificates in order",
            ],
          },
          cost: {
            status: "EXCELLENT",
            planned: 585000,
            actual: 548250,
            variance: "-6.3% (savings) ✅",
          },
          overall: 98,
        },
      },
      {
        vessel: "MV Pacific Voyager",
        route: "Tokyo → Los Angeles",
        charterType: "Voyage Charter",
        charterRate: "$45/MT",
        status: "IN_PROGRESS",
        dayOfVoyage: 8,
        totalDays: 18,
        economics: {
          freightRevenue: 2025000,
          freightDetails: "45,000 MT @ $45/MT",
          bunkerCost: {
            actual: 485000,
            planned: 478000,
          },
          portCosts: {
            actual: 195000,
          },
          netResult: {
            actual: 1345000,
          },
        },
        alerts: [
          "Over-consuming fuel",
          "Actual consumption: 9.2 MT/day",
          "Planned: 8.2 MT/day",
          "Variance: +12% (Past 3 days)",
          "Extra cost if continues: ~$35,000",
          "Action: Speed optimization recommended",
        ],
        cpCompliance: {
          speedConsumption: {
            status: "VARIANCE",
            cpTerms: "About 14 knots, 8.2 MT/day",
            actual: "14.2 knots, 9.2 MT/day ⚠️",
            statusText: "Investigating: Weather or hull fouling?",
          },
        },
      },
    ]
  }, [])

  // Mock completed voyages
  const completedVoyages = useMemo(() => {
    return [
      { vessel: "MV Atlantic", route: "SIN→ROT", cpType: "Time", operatorImpact: 28000, cpCompliance: 99 },
      { vessel: "MV Baltic", route: "DXB→LON", cpType: "Voyage", operatorImpact: 15000, cpCompliance: 97 },
      { vessel: "MV Coral", route: "TYO→LA", cpType: "Spot", operatorImpact: 8000, cpCompliance: 95 },
      { vessel: "MV Aegean", route: "MUM→SIN", cpType: "Time", operatorImpact: -2000, cpCompliance: 94 },
    ]
  }, [])

  // Mock analytics
  const analytics = useMemo(() => {
    return {
      totalSavings: 234000,
      savingsBreakdown: {
        bunkerOptimization: 187000,
        bunkerOptimizationPercent: 80,
        consumptionMonitoring: 28000,
        consumptionMonitoringPercent: 12,
        timingOptimization: 19000,
        timingOptimizationPercent: 8,
      },
      avgCpCompliance: 97.2,
      complianceBreakdown: {
        speedConsumption: 96,
        onTime: 98,
        quality: 99,
        costManagement: 97,
      },
      voyagesByPerformance: {
        exceeding: 8,
        exceedingPercent: 67,
        onPlan: 3,
        onPlanPercent: 25,
        belowPlan: 1,
        belowPlanPercent: 8,
      },
      insight: "Operator team added $234K value this month through strategic bunker management while maintaining 97% charter party compliance. Only 1 of 12 voyages underperformed, due to unexpected hull fouling.",
    }
  }, [])

  // Filter and sort voyages
  const filteredVoyages = useMemo(() => {
    let filtered = activeVoyages
    if (filter !== "all") {
      filtered = filtered.filter((v) => {
        const type = v.charterType.toLowerCase()
        return (
          (filter === "time" && type.includes("time")) ||
          (filter === "voyage" && type.includes("voyage")) ||
          (filter === "spot" && type.includes("spot"))
        )
      })
    }
    return filtered.sort((a, b) => {
      if (sortBy === "savings") {
        return (b.operatorContribution?.netImpact || 0) - (a.operatorContribution?.netImpact || 0)
      }
      return 0
    })
  }, [activeVoyages, filter, sortBy])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">VOYAGE PERFORMANCE</h2>
        <p className="text-gray-600 mt-1">Track operator impact on voyage economics</p>
      </div>

      {/* Fleet-wide Metrics */}
      <VoyagePerformanceMetrics metrics={metrics} />

      {/* Filters and Sort */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filter:</span>
          {["all", "time", "voyage", "spot"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f === "time" ? "Time Charter" : f === "voyage" ? "Voyage Charter" : "Spot"}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort:</span>
          {["savings", "risk", "status"].map((s) => (
            <Button
              key={s}
              variant={sortBy === s ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => setSortBy(s)}
            >
              {s === "savings" ? "Savings" : s === "risk" ? "Risk" : "Status"}
            </Button>
          ))}
        </div>
      </div>

      {/* Active Voyages */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ACTIVE VOYAGES - PERFORMANCE VIEW</h3>
        <div className="space-y-4">
          {filteredVoyages.map((voyage, idx) => (
            <VoyagePerformanceCard key={idx} voyage={voyage} />
          ))}
        </div>
      </div>

      {/* Completed Voyages */}
      <CompletedVoyagesTable voyages={completedVoyages} />

      {/* Analytics */}
      <VoyagePerformanceAnalytics analytics={analytics} />
    </div>
  )
}


"use client"

import { useState } from "react"
import { VesselDailyBriefHeader } from "./VesselDailyBriefHeader"
import { TodayStatusCards } from "./TodayStatusCards"
import { AttentionNeeded } from "./AttentionNeeded"
import { ROBReportAlert } from "./ROBReportAlert"
import { CurrentVoyagePerformance } from "./CurrentVoyagePerformance"
import { AIInsights } from "./AIInsights"
import { UpcomingEvents } from "./UpcomingEvents"
import { QuickActions } from "./QuickActions"
import { useStore } from "@/lib/store"
import { toast } from "sonner"

/**
 * Vessel Today Dashboard - Main component
 * Focused daily operations dashboard for Master/Chief Engineer
 */
export function VesselTodayDashboard() {
  const { vessels, cargoes } = useStore()
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set())

  // Get current vessel (in real app, this would be from user context)
  const currentVessel = vessels[0] || null
  const currentCargo = cargoes.find((c) => c.vessel === currentVessel?.name)

  // Mock data - in real app, calculate from actual vessel/cargo data
  const vesselData = {
    vessel: currentVessel || { name: "MV Ocean Star" },
    voyage: {
      route: currentCargo ? `${currentCargo.loadPort} → ${currentCargo.dischargePort}` : "Singapore → Rotterdam",
      currentDay: 15,
      totalDays: 35,
      position: "285nm from Port Klang",
    },
    status: {
      fuel: {
        rob: 395,
        status: "GOOD",
        daysLeft: 15.8,
      },
      performance: {
        consumption: 25,
        variance: 3,
        variancePercent: 14,
        actionNeeded: true,
      },
      actions: {
        count: 2,
        priority: "Medium",
      },
      reports: {
        dueToday: "ROB Report",
        nextDue: "Noon: 12h",
      },
    },
    alerts: [
      {
        id: "fuel-over-consumption",
        icon: "⚠️",
        title: "FUEL OVER-CONSUMPTION DETECTED",
        priority: "MEDIUM",
        issue: [
          "Consuming 25 MT/day vs planned 22 MT/day (+14%)",
          "Started 3 days ago",
          "Extra cost: $1,935/day",
        ],
        aiAnalysis: {
          description: "Root causes identified:",
          rootCauses: [
            "40% Heavy weather (Beaufort 6 past 3 days)",
            "30% Speed increase (13.6 vs 13.5 knots planned)",
            "20% Hull condition (last cleaning 142 days ago)",
            "10% Normal engine variance",
          ],
        },
        recommendations: [
          {
            title: "Reduce speed to 13.3 knots → Save 0.8 MT/day",
            details: [
              "Trade-off: +4 hours ETA (acceptable)",
              "Savings: $516/day",
            ],
          },
          {
            title: "Wait 6 hours for weather → Save 0.5 MT/day",
            details: [
              "Forecast: Seas improving this evening",
              "No ETA impact if delayed now",
            ],
          },
          {
            title: "Request hull cleaning at Rotterdam → Save long-term",
            details: [
              "ROI: $98K savings over next 60 days",
              "Requires: 12 hours port time",
              "AI will create request for operator approval",
            ],
          },
        ],
        actions: [
          { label: "Apply Speed Reduction", icon: "check", type: "apply", primary: true },
          { label: "Contact Operator", icon: "message", type: "contact" },
          { label: "View Detailed Analysis", icon: "chart", type: "view" },
          { label: "Dismiss for Now", icon: "pause", type: "dismiss" },
        ],
      },
    ],
    robReport: {
      dueTime: "12:00 Noon",
      dueAt: new Date(Date.now() + 4 * 60 * 60 * 1000 + 32 * 60 * 1000), // 4h 32m from now
      currentROB: {
        vlsfo: 395,
        vlsfoAccuracy: 5,
        lsmgo: 82,
        lsmgoAccuracy: 2,
        freshWater: 156,
      },
      consumption: {
        vlsfo: "25 MT/day",
        lsmgo: "0.8 MT/day",
      },
      voyageData: {
        distance: "325 nm",
        speed: "13.6 knots",
      },
      dataQuality: {
        level: "HIGH",
        confidence: 95,
        basedOn: "Yesterday's ROB + calculated consumption",
        validated: "Historical patterns, weather, speed",
      },
    },
    voyagePerformance: {
      route: "Singapore → Rotterdam",
      currentDay: 15,
      totalDays: 35,
      progress: {
        status: "ON_TRACK",
        distanceDone: "3,625 nm of 8,450 nm",
        eta: "Dec 20, 08:00",
        etaPort: "Rotterdam",
        etaStatus: "as planned ✅",
        nextWaypoint: "Port Klang (18 hours)",
      },
      fuel: {
        rob: "395 MT",
        status: "WATCH",
        nextPortName: "Port Klang",
        toNextPort: "140 MT",
        toNextPortStatus: "safe ✅",
        destinationName: "Rotterdam",
        toDestination: "550 MT",
        toDestinationStatus: "must bunker ✅",
        bunkerPlan: "Port Klang, 850 MT (approved)",
      },
      performance: {
        consumption: "25 MT/day",
        planned: "22 planned",
        consumptionVariance: "+14%",
        speed: "13.6 knots",
        speedVariance: "(0.1 above plan)",
        efficiency: 72,
        efficiencyTarget: 85,
        efficiencyStatus: "⚠️",
        status: "BELOW_TARGET",
        sisterShipRank: 6,
        sisterShipTotal: 8,
        sisterShipNote: "needs improvement",
      },
      weather: {
        current: "Beaufort 6 (Strong breeze)",
        forecast: "Improving to Beaufort 4 (6 hours)",
        impact: "+10% consumption (temporary)",
        status: "MODERATE",
      },
    },
    insights: [
      {
        icon: "🎯",
        title: "PERFORMANCE TIP:",
        message: `"Your sister ship MV Atlantic achieved 21.5 MT/day on
the same route last month by:
• Reducing speed by 0.5 knots in heavy weather
• Hull was cleaned 45 days prior to voyage
• Optimal trim: 0.3m by stern

If you match their performance:
• Save: 3.5 MT/day = $2,257/day
• Voyage savings: $45,140
• Operator will notice (good for you!) ✨"`,
        action: "Request Detailed Comparison",
      },
      {
        icon: "💰",
        title: "COST AWARENESS:",
        message: `"Your decisions today impact voyage profitability:"`,
        costAwareness: [
          "Current bunker cost: $548,250 (planned $496,650)",
          "Over budget by: $51,600 (10.4%) ⚠️",
          "Main reason: Over-consumption past 3 days",
          "",
          "If you reduce consumption back to plan:",
          "• Save remaining voyage: $38,700",
          "• Operator saves money = better for everyone",
          "",
          "💡 Every MT matters!",
        ],
      },
    ],
    upcomingEvents: [
      {
        time: "18 hours",
        title: "Arrival Port Klang",
        actions: [
          "Action: Prepare for bunkering (850 MT VLSFO)",
          "Supplier: Shell Marine (confirmed)",
          "Duration: 4 hours",
        ],
        actionButton: "View Bunkering Checklist",
      },
      {
        time: "24 hours",
        title: "Noon report due (tomorrow)",
        actions: [
          "AI will pre-fill based on today's data",
        ],
      },
      {
        time: "42 hours",
        title: "Weather change expected",
        actions: [
          "Seas calming to Beaufort 3",
          "Good time to optimize speed",
        ],
      },
    ],
  }

  const handleDismissAlert = (alertId) => {
    setDismissedAlerts(new Set([...dismissedAlerts, alertId]))
    toast.info("Alert dismissed", { description: "You can view it again in the alerts section" })
  }

  const handleSubmitROB = () => {
    toast.success("ROB Report submitted", { description: "Report sent to operator" })
  }

  const handleContactOperator = () => {
    toast.info("Opening contact form", { description: "You can message the operator directly" })
  }

  const handleViewDetails = () => {
    toast.info("Opening detailed view", { description: "Viewing full performance analysis" })
  }

  // Filter out dismissed alerts
  const activeAlerts = vesselData.alerts.filter((a) => !dismissedAlerts.has(a.id))

  return (
    <div className="space-y-6">
      {/* Header */}
      <VesselDailyBriefHeader vessel={vesselData.vessel} voyage={vesselData.voyage} />

      {/* Today's Status Cards */}
      <div>
        <div className="text-sm font-semibold text-gray-900 mb-4">TODAY'S STATUS - Quick Overview</div>
        <TodayStatusCards
          status={vesselData.status}
          onViewActions={() => toast.info("Viewing pending actions")}
          onSubmitReport={handleSubmitROB}
        />
      </div>

      {/* Attention Needed */}
      {activeAlerts.length > 0 && (
        <AttentionNeeded
          alerts={activeAlerts}
          onDismiss={handleDismissAlert}
          onContactOperator={handleContactOperator}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* ROB Report Alert */}
      <ROBReportAlert
        report={vesselData.robReport}
        onSubmit={handleSubmitROB}
        onEdit={() => toast.info("Opening ROB edit form")}
        onViewFull={() => toast.info("Opening full ROB form")}
      />

      {/* Current Voyage Performance */}
      <div>
        <div className="text-sm font-semibold text-gray-900 mb-4">📊 CURRENT VOYAGE PERFORMANCE</div>
        <CurrentVoyagePerformance voyage={vesselData.voyagePerformance} />
      </div>

      {/* AI Insights */}
      <AIInsights insights={vesselData.insights} />

      {/* Upcoming Events */}
      <UpcomingEvents events={vesselData.upcomingEvents} />

      {/* Quick Actions */}
      <div>
        <div className="text-sm font-semibold text-gray-900 mb-4">🎯 QUICK ACTIONS</div>
        <QuickActions
          onSubmitReport={handleSubmitROB}
          onContactOperator={handleContactOperator}
          onViewDetails={handleViewDetails}
          onViewMap={() => toast.info("Opening voyage map")}
          onViewTrends={() => toast.info("Opening performance trends")}
          onSettings={() => toast.info("Opening settings")}
        />
      </div>
    </div>
  )
}


"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TrendingDown, TrendingUp, CheckCircle2, AlertTriangle, FileText, Mail } from "lucide-react"
import { CostTrendChart } from "./CostTrendChart"
import { CostBreakdownTable } from "./CostBreakdownTable"
import { ROIAnalysis } from "./ROIAnalysis"

export function CostOverview({ data }) {
  const defaultData = {
    summary: {
      bunkerCost: {
        ytd: 98400000,
        budget: 100700000,
        variance: -2.3,
        avgCostPerMT: 652,
        marketAvg: 665,
        vsMarket: -2,
      },
      maintenance: {
        ytd: 4800000,
        budget: 4610000,
        variance: 4.2,
        unplannedRepairs: 280000,
        hullCleaningVariance: -90000,
      },
      totalOpex: {
        ytd: 128500000,
        budget: 130800000,
        variance: -1.8,
      },
      savings: {
        ytd: 2800000,
        aiOptimization: 1200000,
        earlyBunkering: 540000,
        routeOptimization: 380000,
      },
    },
    byVessel: [
      {
        vessel: "MV Ocean Star",
        bunker: 9200000,
        maintenance: 420000,
        total: 10800000,
        vsBudget: 8.5,
        status: "NEEDS_WORK",
      },
      {
        vessel: "MV Atlantic",
        bunker: 7800000,
        maintenance: 380000,
        total: 9200000,
        vsBudget: -4.2,
        status: "EXCELLENT",
      },
      {
        vessel: "MV Pacific Voyager",
        bunker: 8500000,
        maintenance: 680000,
        total: 10400000,
        vsBudget: 12,
        status: "ENGINE_ISSUE",
      },
      {
        vessel: "MV Baltic",
        bunker: 8100000,
        maintenance: 390000,
        total: 9500000,
        vsBudget: -1.8,
        status: "GOOD",
      },
      {
        vessel: "MV Indian Ocean",
        bunker: 8300000,
        maintenance: 410000,
        total: 9700000,
        vsBudget: 2.1,
        status: "MONITOR",
      },
    ],
    roi: {
      initiatives: [
        {
          name: "Hull cleaning program",
          investment: 324000,
          savings: 1800000,
          roi: 456,
          status: "ACTIVE",
        },
        {
          name: "AI bunker optimization",
          investment: 180000,
          savings: 1200000,
          roi: 567,
          status: "ACTIVE",
        },
        {
          name: "Weather routing",
          investment: 45000,
          savings: 380000,
          roi: 744,
          status: "ACTIVE",
        },
        {
          name: "Speed optimization",
          investment: 0,
          savings: 540000,
          roi: Infinity,
          status: "ACTIVE",
        },
        {
          name: "Engine monitoring",
          investment: 95000,
          savings: 240000,
          roi: 153,
          status: "ACTIVE",
        },
      ],
      total: {
        investment: 644000,
        savings: 4140000,
        roi: 543,
      },
    },
  }

  const costs = data || defaultData

  const formatCurrency = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      {/* Financial Performance Summary */}
      <div>
        <h3 className="text-lg font-bold mb-4">FINANCIAL PERFORMANCE SUMMARY - 2025 YTD</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className={costs.summary.bunkerCost.variance < 0 ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}>
            <CardContent className="pt-4">
              <div className="text-sm text-gray-600 mb-1">BUNKER COST</div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(costs.summary.bunkerCost.ytd)}</div>
              <div className={`text-xs mt-1 flex items-center gap-1 ${costs.summary.bunkerCost.variance < 0 ? "text-green-700" : "text-red-700"}`}>
                {costs.summary.bunkerCost.variance < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                {Math.abs(costs.summary.bunkerCost.variance)}% vs budget {costs.summary.bunkerCost.variance < 0 ? "✅" : "⚠️"}
              </div>
            </CardContent>
          </Card>
          <Card className={costs.summary.maintenance.variance > 0 ? "border-yellow-300 bg-yellow-50" : "border-green-300 bg-green-50"}>
            <CardContent className="pt-4">
              <div className="text-sm text-gray-600 mb-1">MAINTENANCE</div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(costs.summary.maintenance.ytd)}</div>
              <div className={`text-xs mt-1 flex items-center gap-1 ${costs.summary.maintenance.variance > 0 ? "text-yellow-700" : "text-green-700"}`}>
                {costs.summary.maintenance.variance > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {costs.summary.maintenance.variance > 0 ? "+" : ""}{costs.summary.maintenance.variance}% vs budget {costs.summary.maintenance.variance > 0 ? "⚠️" : "✅"}
              </div>
            </CardContent>
          </Card>
          <Card className={costs.summary.totalOpex.variance < 0 ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}>
            <CardContent className="pt-4">
              <div className="text-sm text-gray-600 mb-1">TOTAL OPEX</div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(costs.summary.totalOpex.ytd)}</div>
              <div className={`text-xs mt-1 flex items-center gap-1 ${costs.summary.totalOpex.variance < 0 ? "text-green-700" : "text-red-700"}`}>
                {costs.summary.totalOpex.variance < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                {Math.abs(costs.summary.totalOpex.variance)}% vs budget {costs.summary.totalOpex.variance < 0 ? "✅" : "⚠️"}
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-300 bg-green-50">
            <CardContent className="pt-4">
              <div className="text-sm text-gray-600 mb-1">SAVINGS</div>
              <div className="text-2xl font-bold text-green-700">{formatCurrency(costs.summary.savings.ytd)}</div>
              <div className="text-xs text-green-700 mt-1">Achieved YTD ✅</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Key Highlights */}
      <Card>
        <CardHeader>
          <CardTitle>KEY HIGHLIGHTS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="font-semibold">Bunker costs: {formatCurrency(Math.abs(costs.summary.bunkerCost.ytd - costs.summary.bunkerCost.budget))} under budget ({Math.abs(costs.summary.bunkerCost.variance)}%)</span>
            </div>
            <div className="ml-7 text-sm text-gray-700 space-y-1">
              <div>• Avg cost/MT: ${costs.summary.bunkerCost.avgCostPerMT} vs ${costs.summary.bunkerCost.marketAvg} market ({costs.summary.bunkerCost.vsMarket > 0 ? "+" : ""}{costs.summary.bunkerCost.vsMarket}% better)</div>
              <div>• AI optimization savings: {formatCurrency(costs.summary.savings.aiOptimization)}</div>
              <div>• Early bunkering savings: {formatCurrency(costs.summary.savings.earlyBunkering)}</div>
              <div>• Route optimization: {formatCurrency(costs.summary.savings.routeOptimization)}</div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="font-semibold">Maintenance: {formatCurrency(costs.summary.maintenance.ytd - costs.summary.maintenance.budget)} over budget ({costs.summary.maintenance.variance}%)</span>
            </div>
            <div className="ml-7 text-sm text-gray-700 space-y-1">
              <div>• Unplanned repairs: {formatCurrency(costs.summary.maintenance.unplannedRepairs)} (MV Pacific Voyager engine)</div>
              <div>• Hull cleaning: {formatCurrency(Math.abs(costs.summary.maintenance.hullCleaningVariance))} under budget (efficient scheduling)</div>
              <div>• Net: Still acceptable variance</div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="font-semibold">Overall: {formatCurrency(Math.abs(costs.summary.totalOpex.ytd - costs.summary.totalOpex.budget))} under operating budget ({Math.abs(costs.summary.totalOpex.variance)}%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Month-over-Month Trend */}
      <CostTrendChart />

      {/* Cost Breakdown by Vessel */}
      <CostBreakdownTable vessels={costs.byVessel} />

      {/* ROI Analysis */}
      <ROIAnalysis roi={costs.roi} />
    </div>
  )
}


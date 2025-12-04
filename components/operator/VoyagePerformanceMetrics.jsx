"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

/**
 * Fleet-wide metrics for Voyage Performance
 * Shows 4 key metrics: Active Voyages, Bunker Savings, On-Time Performance, CP Compliance
 */
export function VoyagePerformanceMetrics({ metrics }) {
  const {
    activeVoyages = 12,
    bunkerSavings = 234000,
    onTimePerformance = 94,
    cpCompliance = 98,
    onTimeTrend = "+3",
  } = metrics || {}

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-600">Active Voyages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">{activeVoyages}</div>
        </CardContent>
      </Card>

      <Card className="border-2 border-success">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-600">Bunker Savings This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-success">+${(bunkerSavings / 1000).toFixed(0)}K</div>
          <div className="text-xs text-gray-600 mt-1">vs planned</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-600">On-Time Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold text-gray-900">{onTimePerformance}%</div>
            <div className="flex items-center text-success text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              {onTimeTrend}% MoM
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-success">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-600">CP Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-success">{cpCompliance}%</div>
          <div className="text-xs text-gray-600 mt-1">✅ Excellent</div>
        </CardContent>
      </Card>
    </div>
  )
}


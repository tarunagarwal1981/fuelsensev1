"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function VesselPerformanceMetrics({ vessel }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {vessel.metrics && (
            <>
              {vessel.metrics.consumptionEfficiency && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Consumption Efficiency</span>
                    <Badge variant={vessel.metrics.consumptionEfficiency.score < 70 ? "destructive" : "secondary"}>
                      {vessel.metrics.consumptionEfficiency.score}/100
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Actual: {vessel.metrics.consumptionEfficiency.actual} MT/day</div>
                    <div>Plan: {vessel.metrics.consumptionEfficiency.plan} MT/day</div>
                    <div>Variance: {vessel.metrics.consumptionEfficiency.variance > 0 ? "+" : ""}{vessel.metrics.consumptionEfficiency.variance}%</div>
                  </div>
                </div>
              )}

              {vessel.metrics.hullPerformance && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Hull Performance</span>
                    <Badge variant={vessel.metrics.hullPerformance.score < 70 ? "destructive" : "secondary"}>
                      {vessel.metrics.hullPerformance.score}/100
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Days since cleaning: {vessel.metrics.hullPerformance.daysSinceCleaning}
                  </div>
                </div>
              )}

              {vessel.metrics.enginePerformance && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Engine Performance</span>
                    <Badge className="bg-green-600">{vessel.metrics.enginePerformance.score}/100</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Efficiency: {vessel.metrics.enginePerformance.efficiency}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


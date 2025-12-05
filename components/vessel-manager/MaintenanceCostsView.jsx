"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function MaintenanceCostsView({ data }) {
  const defaultData = {
    summary: {
      ytd: 4800000,
      budget: 4610000,
      variance: 4.2,
      unplannedRepairs: 280000,
      hullCleaningVariance: -90000,
    },
    breakdown: {
      hullCleaning: 324000,
      drydocking: 850000,
      engineMaintenance: 1200000,
      unplannedRepairs: 280000,
      other: 2146000,
    },
  }

  const maintenance = data || defaultData

  const formatCurrency = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    return `$${(value / 1000).toFixed(0)}K`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Cost Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600">YTD Cost:</div>
              <div className="text-2xl font-bold">{formatCurrency(maintenance.summary.ytd)}</div>
            </div>
            <div>
              <div className="text-gray-600">vs Budget:</div>
              <div className={`text-2xl font-bold ${maintenance.summary.variance > 0 ? "text-yellow-600" : "text-green-600"}`}>
                +{maintenance.summary.variance}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Hull Cleaning:</span>
              <span className="font-semibold">{formatCurrency(maintenance.breakdown.hullCleaning)}</span>
            </div>
            <div className="flex justify-between">
              <span>Drydocking:</span>
              <span className="font-semibold">{formatCurrency(maintenance.breakdown.drydocking)}</span>
            </div>
            <div className="flex justify-between">
              <span>Engine Maintenance:</span>
              <span className="font-semibold">{formatCurrency(maintenance.breakdown.engineMaintenance)}</span>
            </div>
            <div className="flex justify-between">
              <span>Unplanned Repairs:</span>
              <span className="font-semibold text-red-600">{formatCurrency(maintenance.breakdown.unplannedRepairs)}</span>
            </div>
            <div className="flex justify-between">
              <span>Other:</span>
              <span className="font-semibold">{formatCurrency(maintenance.breakdown.other)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {maintenance.summary.unplannedRepairs > 0 && (
        <Card className="border-yellow-300 bg-yellow-50">
          <CardHeader>
            <CardTitle>⚠️ Unplanned Repairs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-700">
              Unplanned repairs: {formatCurrency(maintenance.summary.unplannedRepairs)} (MV Pacific Voyager engine)
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Hull cleaning: {formatCurrency(Math.abs(maintenance.summary.hullCleaningVariance))} under budget (efficient scheduling)
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


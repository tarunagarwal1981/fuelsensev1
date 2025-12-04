"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

/**
 * Other Technical Factors
 * Shows engine, trim, propeller, and weather routing status
 */
export function OtherTechnicalFactors({ factors }) {
  if (!factors) return null

  const {
    engine = {},
    trim = {},
    propeller = {},
    weatherRouting = {},
  } = factors

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">⚙️ OTHER TECHNICAL FACTORS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Engine Performance */}
        {engine.efficiency && (
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-2">ENGINE PERFORMANCE:</div>
            <div className="space-y-1 text-xs text-gray-700 ml-4">
              {engine.efficiency && (
                <div className="flex items-center gap-2">
                  ├─ Main engine efficiency: {engine.efficiency}
                  {engine.efficiency >= 97 && <CheckCircle2 className="h-3 w-3 text-success" />}
                </div>
              )}
              {engine.auxiliary && (
                <div>├─ Auxiliary engines: {engine.auxiliary}</div>
              )}
              {engine.fuelQuality && (
                <div className="flex items-center gap-2">
                  ├─ Fuel quality: {engine.fuelQuality}
                  {engine.fuelQuality.includes("Within spec") && <CheckCircle2 className="h-3 w-3 text-success" />}
                </div>
              )}
              {engine.nextMaintenance && (
                <div>└─ Next maintenance: {engine.nextMaintenance}</div>
              )}
            </div>
          </div>
        )}

        {/* Trim & Draft Optimization */}
        {trim.current && (
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-2">TRIM & DRAFT OPTIMIZATION:</div>
            <div className="space-y-1 text-xs text-gray-700 ml-4">
              {trim.current && (
                <div>├─ Current trim: {trim.current}</div>
              )}
              {trim.potential && (
                <div>├─ Optimization potential: {trim.potential}</div>
              )}
              {trim.status && (
                <div className="flex items-center gap-2">
                  └─ Status: {trim.status}
                  {trim.status.includes("Optimized") && <CheckCircle2 className="h-3 w-3 text-success" />}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Propeller Condition */}
        {propeller.lastInspection && (
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-2">PROPELLER CONDITION:</div>
            <div className="space-y-1 text-xs text-gray-700 ml-4">
              {propeller.lastInspection && (
                <div>├─ Last inspection: {propeller.lastInspection}</div>
              )}
              {propeller.condition && (
                <div>├─ Condition: {propeller.condition}</div>
              )}
              {propeller.nextInspection && (
                <div>└─ Next inspection: {propeller.nextInspection}</div>
              )}
            </div>
          </div>
        )}

        {/* Weather Routing */}
        {weatherRouting.currentRoute && (
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-2">WEATHER ROUTING:</div>
            <div className="space-y-1 text-xs text-gray-700 ml-4">
              {weatherRouting.currentRoute && (
                <div>├─ Current route: {weatherRouting.currentRoute}</div>
              )}
              {weatherRouting.alternatives && (
                <div>├─ Alternative routes evaluated: {weatherRouting.alternatives}</div>
              )}
              {weatherRouting.potentialSavings && (
                <div>└─ Potential savings: {weatherRouting.potentialSavings}</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


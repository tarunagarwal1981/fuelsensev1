"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, FileText, MessageSquare } from "lucide-react"

export function FuelEUView({ data }) {
  const defaultData = {
    status: "MIXED",
    nonCompliantCount: 1,
    fleetAvgIntensity: 90.5,
    limit: 91.2,
    margin: 0.8,
    nonCompliant: [
      {
        vessel: "MV Ocean Star",
        intensity: 92.5,
        overLimit: 1.4,
        penaltyEstimate: 24500,
        rootCause: "Hull fouling (142 days since cleaning)",
        solutions: [
          { action: "Hull cleaning", result: 89.2, compliant: true },
          { action: "10% biofuel blend", result: 90.1, compliant: true },
          { action: "Speed reduction 0.5 knots", result: 90.8, compliant: true },
        ],
        recommended: "Hull cleaning (solves root cause)",
      },
    ],
    approaching: [
      { vessel: "MV Baltic", intensity: 90.8, margin: 0.4 },
      { vessel: "MV Indian Ocean", intensity: 91.0, margin: 0.2 },
    ],
  }

  const fuelEu = data || defaultData

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <CardTitle>FuelEU Maritime (GHG Intensity Regulation)</CardTitle>
          </div>
          <Badge className={fuelEu.nonCompliantCount > 0 ? "bg-yellow-600" : "bg-green-600"}>
            {fuelEu.nonCompliantCount > 0 ? "⚠️ 1 VESSEL NON-COMPLIANT" : "✅ COMPLIANT"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">FLEET SUMMARY:</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <div>├─ Fleet avg intensity: {fuelEu.fleetAvgIntensity} gCO2/MJ</div>
            <div>├─ 2025 limit: {fuelEu.limit} gCO2/MJ</div>
            <div>├─ Margin: {fuelEu.margin}% below limit ✅</div>
            <div>└─ Status: COMPLIANT (but tight margin) ⚠️</div>
          </div>
        </div>

        {fuelEu.nonCompliant && fuelEu.nonCompliant.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold text-sm mb-2">NON-COMPLIANT VESSELS:</h4>
              {fuelEu.nonCompliant.map((vessel, idx) => (
                <div key={idx} className="bg-red-50 p-4 rounded-lg border border-red-300 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="font-semibold">🔴 {vessel.vessel}:</span>
                  </div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>├─ Intensity: {vessel.intensity} gCO2/MJ ({vessel.overLimit}% over limit) 🔴</div>
                    <div>├─ Penalty estimate: €{vessel.penaltyEstimate.toLocaleString()}</div>
                    <div>├─ Root cause: {vessel.rootCause}</div>
                    <div>└─ Action: Hull cleaning will bring into compliance</div>
                  </div>

                  {vessel.solutions && (
                    <div className="mt-3">
                      <h5 className="font-semibold text-xs mb-2">COMPLIANCE SOLUTIONS:</h5>
                      <div className="text-sm text-gray-700 space-y-1">
                        <div>For {vessel.vessel}:</div>
                        {vessel.solutions.map((solution, sIdx) => (
                          <div key={sIdx}>
                            Option {sIdx + 1}: {solution.action} → Reduce to {solution.result} gCO2/MJ{" "}
                            {solution.compliant && "✅"}
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-sm font-semibold text-green-700">
                        RECOMMENDATION: {vessel.recommended}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {fuelEu.approaching && fuelEu.approaching.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold text-sm mb-2">VESSELS APPROACHING LIMIT:</h4>
              {fuelEu.approaching.map((vessel, idx) => (
                <div key={idx} className="bg-yellow-50 p-3 rounded-lg border border-yellow-300 mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="font-semibold">🟡 {vessel.vessel}:</span>
                  </div>
                  <div className="text-sm text-gray-700">
                    ├─ Intensity: {vessel.intensity} gCO2/MJ ({vessel.margin}% below limit) ⚠️
                  </div>
                  <div className="text-sm text-gray-700">
                    └─ Action: {vessel.vessel === "MV Baltic" ? "Monitor closely, optimize where possible" : "Consider biofuel blend for next voyage"}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Generate Compliance Plan
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="mr-2 h-4 w-4" />
            Discuss with Operator
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


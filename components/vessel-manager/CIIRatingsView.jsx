"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Trophy, CheckCircle2, FileText } from "lucide-react"

export function CIIRatingsView({ data }) {
  const defaultData = {
    status: "MIXED",
    distribution: {
      A: 1,
      B: 4,
      C: 6,
      D: 1,
      E: 0,
    },
    fleetAvg: "C+",
    vesselsAtRisk: [
      {
        vessel: "MV Ocean Star",
        currentRating: "C",
        trendingTo: "D",
        percentToThreshold: 68,
        action: "Hull cleaning + consumption optimization",
        consequencesIfDowngrade: "Port restrictions, higher insurance",
      },
      {
        vessel: "MV Baltic",
        currentRating: "C",
        riskYear: 2026,
        percentToThreshold: 72,
        action: "Speed optimization on next 2 voyages",
      },
      {
        vessel: "MV Indian Ocean",
        currentRating: "C",
        riskYear: 2026,
        percentToThreshold: 75,
        action: "Monitor, may need biofuel blend",
      },
    ],
    improvementPlan: {
      actions: [
        { vessel: "MV Ocean Star", action: "Hull cleaning", prevents: "D rating" },
        { vessel: "MV Baltic", action: "Speed optimization", maintains: "C rating" },
        { vessel: "MV Indian Ocean", action: "Monitor closely", contingency: "biofuel if needed" },
      ],
      projectedOutcome: {
        allMaintainC: true,
        fleetAvgImproves: "B-",
        complianceCost: 45000,
        penaltyIfDowngrade: 120000,
      },
    },
  }

  const cii = data || defaultData

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚓</span>
            <CardTitle>CII (Carbon Intensity Indicator) Ratings</CardTitle>
          </div>
          <Badge className="bg-yellow-600">⚠️ MIXED PERFORMANCE</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">FLEET DISTRIBUTION:</h4>
          <div className="text-sm space-y-1">
            <div className="flex items-center justify-between">
              <span>Rating</span>
              <span>Vessels</span>
              <span>Status</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span>A (Excellent)</span>
              <span>{cii.distribution.A}</span>
              <span>🏆 MV Atlantic</span>
            </div>
            <div className="flex items-center justify-between">
              <span>B (Good)</span>
              <span>{cii.distribution.B}</span>
              <span>✅ On track</span>
            </div>
            <div className="flex items-center justify-between">
              <span>C (Average)</span>
              <span>{cii.distribution.C}</span>
              <span>⚠️ Monitor closely</span>
            </div>
            <div className="flex items-center justify-between">
              <span>D (Poor)</span>
              <span>{cii.distribution.D}</span>
              <span>🔴 MV Ocean Star (action needed)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>E (Very Poor)</span>
              <span>{cii.distribution.E}</span>
              <span>✅ None</span>
            </div>
            <Separator />
            <div className="font-semibold">Fleet Average: {cii.fleetAvg} (Acceptable, room for improvement)</div>
          </div>
        </div>

        {cii.vesselsAtRisk && cii.vesselsAtRisk.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold text-sm mb-2">VESSELS AT RISK OF DOWNGRADE:</h4>
              {cii.vesselsAtRisk.map((vessel, idx) => (
                <div key={idx} className={`p-3 rounded-lg border mb-2 ${vessel.percentToThreshold < 70 ? "bg-red-50 border-red-300" : "bg-yellow-50 border-yellow-300"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {vessel.percentToThreshold < 70 ? <AlertCircle className="h-4 w-4 text-red-600" /> : <AlertCircle className="h-4 w-4 text-yellow-600" />}
                    <span className="font-semibold">
                      {vessel.percentToThreshold < 70 ? "🔴" : "🟡"} {vessel.vessel} (Currently {vessel.currentRating} → {vessel.trendingTo ? `Trending to ${vessel.trendingTo}` : `Risk of ${vessel.riskYear}`})
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>├─ Current CII: {vessel.percentToThreshold}% toward {vessel.trendingTo || "D"} threshold</div>
                    <div>├─ Action needed: {vessel.action}</div>
                    {vessel.consequencesIfDowngrade && <div>├─ Impact if downgrade: {vessel.consequencesIfDowngrade}</div>}
                    {vessel.percentToThreshold < 70 && <div>└─ 3 consecutive years of D/E = Corrective action plan req.</div>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {cii.improvementPlan && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold text-sm mb-2">IMPROVEMENT PLAN (Will prevent all downgrades):</h4>
              <div className="space-y-2">
                {cii.improvementPlan.actions.map((action, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <strong>{action.vessel}:</strong> {action.action} → {action.prevents || action.maintains || action.contingency}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {cii.improvementPlan.projectedOutcome && (
              <div className="mt-3 bg-green-50 p-3 rounded-lg border border-green-300">
                <h4 className="font-semibold text-sm mb-2">PROJECTED OUTCOME:</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  {cii.improvementPlan.projectedOutcome.allMaintainC && <div>├─ All vessels maintain C rating or better ✅</div>}
                  <div>├─ Fleet average improves to {cii.improvementPlan.projectedOutcome.fleetAvgImproves}</div>
                  <div>├─ Compliance cost: €{cii.improvementPlan.projectedOutcome.complianceCost.toLocaleString()} (vs €{cii.improvementPlan.projectedOutcome.penaltyIfDowngrade.toLocaleString()} penalty if downgrade)</div>
                  <div>└─ Reputational benefit: Industry-leading performance</div>
                </div>
              </div>
            )}

            <div className="mt-3">
              <Button className="bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve Improvement Plan
              </Button>
              <Button variant="outline" className="ml-2">
                <FileText className="mr-2 h-4 w-4" />
                View Projections
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}


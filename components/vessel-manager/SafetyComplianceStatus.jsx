"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, FileText, Mail } from "lucide-react"

export function SafetyComplianceStatus({ data }) {
  const defaultData = {
    safety: {
      incidents: "No active safety incidents",
      certificates: "All vessels have valid safety certificates",
      inspections: "No overdue inspections",
    },
    euEts: {
      totalEmissions: "28,450 tCO2 (YTD)",
      allowancesRequired: "14,225 tCO2",
      estimatedCost: "€1.2M @ €85/tonne",
      status: "On track, well documented",
    },
    fuelEu: {
      avgIntensity: "90.5 gCO2/MJ",
      limit2025: "91.2 gCO2/MJ",
      status: "COMPLIANT (0.8% margin)",
      note: "1 vessel close to limit (MV Ocean Star)",
    },
    cii: {
      a: 1,
      aVessel: "MV Atlantic - excellent!",
      b: 4,
      c: 6,
      d: 1,
      dVessel: "MV Ocean Star - action needed",
      fleetAverage: "C+ (acceptable)",
    },
    surveys: [
      { vessel: "MV Pacific Voyager", type: "Special Survey", date: "March 2026" },
      { vessel: "MV Baltic", type: "Intermediate Survey", date: "May 2026" },
    ],
  }

  const compliance = data || defaultData

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">⚠️ SAFETY & COMPLIANCE STATUS</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              View Full Compliance Report
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Email to Management
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Safety Overview */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-gray-900">SAFETY OVERVIEW:</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              {compliance.safety.incidents}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              {compliance.safety.certificates}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              {compliance.safety.inspections}
            </div>
          </div>
        </div>

        {/* Compliance Status */}
        <div className="pt-4 border-t">
          <h3 className="font-semibold text-lg mb-3 text-gray-900">COMPLIANCE STATUS:</h3>

          {/* EU ETS */}
          <div className="mb-4">
            <div className="font-semibold text-sm mb-2">EU ETS:</div>
            <div className="ml-4 space-y-1 text-sm text-gray-600">
              <div>├─ Fleet total emissions: {compliance.euEts.totalEmissions}</div>
              <div>├─ Allowances required: {compliance.euEts.allowancesRequired}</div>
              <div>├─ Estimated cost: {compliance.euEts.estimatedCost}</div>
              <div>
                └─ Status: <Badge className="bg-green-600">✅ {compliance.euEts.status}</Badge>
              </div>
            </div>
          </div>

          {/* FuelEU Maritime */}
          <div className="mb-4">
            <div className="font-semibold text-sm mb-2">FuelEU Maritime:</div>
            <div className="ml-4 space-y-1 text-sm text-gray-600">
              <div>├─ Fleet avg intensity: {compliance.fuelEu.avgIntensity}</div>
              <div>├─ 2025 limit: {compliance.fuelEu.limit2025}</div>
              <div>
                ├─ Status: <Badge className="bg-green-600">✅ {compliance.fuelEu.status}</Badge>
              </div>
              <div>└─ Note: {compliance.fuelEu.note} ⚠️</div>
            </div>
          </div>

          {/* CII Ratings */}
          <div className="mb-4">
            <div className="font-semibold text-sm mb-2">CII Ratings:</div>
            <div className="ml-4 space-y-1 text-sm text-gray-600">
              <div>
                ├─ A rating: {compliance.cii.a} vessel ({compliance.cii.aVessel})
              </div>
              <div>├─ B rating: {compliance.cii.b} vessels</div>
              <div>├─ C rating: {compliance.cii.c} vessels</div>
              <div>
                ├─ D rating: {compliance.cii.d} vessel ({compliance.cii.dVessel}) ⚠️
              </div>
              <div>└─ Fleet average: {compliance.cii.fleetAverage}</div>
            </div>
          </div>

          {/* Upcoming Surveys */}
          <div>
            <div className="font-semibold text-sm mb-2">UPCOMING SURVEYS:</div>
            <div className="ml-4 space-y-1 text-sm text-gray-600">
              {compliance.surveys.map((survey, idx) => (
                <div key={idx}>
                  {idx === compliance.surveys.length - 1 ? "└─" : "├─"} {survey.vessel}: {survey.type} ({survey.date})
                </div>
              ))}
              <div className="mt-2">
                └─ All scheduled and on track <CheckCircle2 className="inline h-4 w-4 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


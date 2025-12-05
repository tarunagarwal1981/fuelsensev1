"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import { format } from "date-fns"

export function MRVView({ data }) {
  const defaultData = {
    status: "COMPLIANT",
    dataQualityScore: 92,
    metrics: {
      robReporting: 98,
      consumptionData: 94,
      distanceData: 100,
      fuelQualityDocs: 89,
    },
    reporting: {
      q4_2025: { status: "SUBMITTED", date: "2025-12-15" },
      annual_2025: { status: "DUE", date: "2026-03-31" },
      verification: { status: "SCHEDULED", date: "2026-02" },
    },
  }

  const mrv = data || defaultData

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <CardTitle>MRV (Monitoring, Reporting, Verification)</CardTitle>
          </div>
          <Badge className="bg-green-600">✅ COMPLIANT</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          Status: <strong>✅ COMPLIANT (High data quality)</strong>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">DATA QUALITY METRICS:</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <div>Fleet Average Score: {mrv.dataQualityScore}/100 ✅</div>
            <div className="ml-4 space-y-1">
              <div>├─ ROB reporting: {mrv.metrics.robReporting}% (on time & accurate)</div>
              <div>├─ Consumption data: {mrv.metrics.consumptionData}% (high quality)</div>
              <div>├─ Distance data: {mrv.metrics.distanceData}% (verified via AIS)</div>
              <div>├─ Fuel quality docs: {mrv.metrics.fuelQualityDocs}% (some delays)</div>
              <div>└─ No critical data gaps ✅</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">REPORTING STATUS:</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <div className="flex items-center gap-2">
              ├─ Q4 2025 report: <CheckCircle2 className="h-4 w-4 text-green-600" /> Submitted ({format(new Date(mrv.reporting.q4_2025.date), "MMMM d")})
            </div>
            <div>
              ├─ Annual 2025 report: 📅 Due {format(new Date(mrv.reporting.annual_2025.date), "MMMM d, yyyy")}
            </div>
            <div>└─ Verification: Scheduled for {mrv.reporting.verification.date}</div>
          </div>
        </div>

        <div className="text-sm text-gray-700">
          All vessels meet MRV requirements for EU operations ✅
        </div>
      </CardContent>
    </Card>
  )
}


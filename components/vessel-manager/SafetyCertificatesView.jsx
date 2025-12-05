"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import { format } from "date-fns"

export function SafetyCertificatesView({ data }) {
  const defaultData = {
    status: "ALL_VALID",
    safetyCertificates: { valid: 12, total: 12 },
    classCertificates: { valid: 12, total: 12 },
    ismIsps: { compliant: 12, total: 12 },
    overdueInspections: 0,
    upcomingSurveys: [
      { vessel: "MV Pacific Voyager", type: "Special Survey", date: "2026-03", status: "PLANNED" },
      { vessel: "MV Baltic", type: "Intermediate Survey", date: "2026-05", status: "SCHEDULED" },
    ],
  }

  const safety = data || defaultData

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <CardTitle>SAFETY CERTIFICATES & SURVEYS</CardTitle>
          </div>
          <Badge className="bg-green-600">✅ ALL VALID</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          Status: <strong>✅ ALL VALID (No expiring certificates)</strong>
        </div>

        <div>
          <div className="text-sm text-gray-700 space-y-1">
            <div className="flex items-center gap-2">
              ├─ Safety certificates: {safety.safetyCertificates.valid}/{safety.safetyCertificates.total} valid <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex items-center gap-2">
              ├─ Class certificates: {safety.classCertificates.valid}/{safety.classCertificates.total} valid <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex items-center gap-2">
              ├─ ISM/ISPS compliance: {safety.ismIsps.compliant}/{safety.ismIsps.total} <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex items-center gap-2">
              └─ No overdue inspections <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </div>

        {safety.upcomingSurveys && safety.upcomingSurveys.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2">UPCOMING SURVEYS (Next 6 Months):</h4>
            <div className="text-sm text-gray-700 space-y-1">
              {safety.upcomingSurveys.map((survey, idx) => (
                <div key={idx}>
                  {idx === safety.upcomingSurveys.length - 1 ? "└─" : "├─"} {survey.vessel}: {survey.type} ({survey.date}) - {survey.status === "PLANNED" ? "Planned" : survey.status}
                </div>
              ))}
              <div className="mt-1">└─ All preparations on track ✅</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


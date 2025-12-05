"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle2, TrendingUp, FileText, Mail } from "lucide-react"
import { EUETSView } from "./EUETSView"
import { FuelEUView } from "./FuelEUView"
import { CIIRatingsView } from "./CIIRatingsView"
import { MRVView } from "./MRVView"
import { SafetyCertificatesView } from "./SafetyCertificatesView"

export function ComplianceOverview({ data }) {
  const defaultData = {
    overview: {
      critical: 0,
      warning: 3,
      compliant: 9,
      score: 89,
    },
    riskSummary: {
      high: 0,
      medium: 3,
      low: 9,
    },
    estimatedCosts2026: {
      euEtsAllowances: 1210000,
      fuelEuPenalties: 0,
      ciiImprovements: 45000,
      mrvVerification: 24000,
      safetySurveys: 85000,
      total: 1364000,
    },
  }

  const compliance = data || defaultData

  return (
    <div className="space-y-6">
      {/* Fleet Compliance Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-300 bg-red-50">
          <CardContent className="pt-4">
            <div className="text-sm text-gray-600 mb-1">🔴 CRITICAL</div>
            <div className="text-2xl font-bold text-red-700">{compliance.overview.critical} vessels</div>
            <div className="text-xs text-gray-600 mt-1">Urgent fix</div>
          </CardContent>
        </Card>
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="pt-4">
            <div className="text-sm text-gray-600 mb-1">🟡 WARNING</div>
            <div className="text-2xl font-bold text-yellow-700">{compliance.overview.warning} vessels</div>
            <div className="text-xs text-gray-600 mt-1">Monitor</div>
          </CardContent>
        </Card>
        <Card className="border-green-300 bg-green-50">
          <CardContent className="pt-4">
            <div className="text-sm text-gray-600 mb-1">🟢 COMPLIANT</div>
            <div className="text-2xl font-bold text-green-700">{compliance.overview.compliant} vessels</div>
            <div className="text-xs text-gray-600 mt-1">On track</div>
          </CardContent>
        </Card>
        <Card className="border-blue-300 bg-blue-50">
          <CardContent className="pt-4">
            <div className="text-sm text-gray-600 mb-1">SCORE</div>
            <div className="text-2xl font-bold text-blue-700">{compliance.overview.score}/100</div>
            <div className="text-xs text-gray-600 mt-1">Good ✅</div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance by Regulation */}
      <div>
        <h3 className="text-lg font-bold mb-4">COMPLIANCE BY REGULATION:</h3>
        <div className="space-y-4">
          <EUETSView data={compliance.euEts} />
          <FuelEUView data={compliance.fuelEu} />
          <CIIRatingsView data={compliance.cii} />
          <MRVView data={compliance.mrv} />
          <SafetyCertificatesView data={compliance.safety} />
        </div>
      </div>

      {/* Compliance Risk Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-300 bg-red-50">
          <CardContent className="pt-4">
            <div className="text-sm text-gray-600 mb-1">HIGH RISK</div>
            <div className="text-2xl font-bold text-red-700">{compliance.riskSummary.high} issues</div>
            <div className="text-xs text-gray-600 mt-1">✅ None</div>
          </CardContent>
        </Card>
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="pt-4">
            <div className="text-sm text-gray-600 mb-1">MEDIUM RISK</div>
            <div className="text-2xl font-bold text-yellow-700">{compliance.riskSummary.medium} issues</div>
            <div className="text-xs text-gray-600 mt-1">⚠️ Monitor</div>
          </CardContent>
        </Card>
        <Card className="border-green-300 bg-green-50">
          <CardContent className="pt-4">
            <div className="text-sm text-gray-600 mb-1">LOW RISK</div>
            <div className="text-2xl font-bold text-green-700">All others</div>
            <div className="text-xs text-gray-600 mt-1">✅ On track</div>
          </CardContent>
        </Card>
      </div>

      {/* Estimated Compliance Costs */}
      <Card>
        <CardHeader>
          <CardTitle>ESTIMATED COMPLIANCE COSTS (2026):</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-700 space-y-1">
            <div>├─ EU ETS allowances: €{compliance.estimatedCosts2026.euEtsAllowances.toLocaleString()}</div>
            <div>├─ FuelEU penalties: €{compliance.estimatedCosts2026.fuelEuPenalties.toLocaleString()} {compliance.estimatedCosts2026.fuelEuPenalties === 0 && "(if actions taken) ✅"}</div>
            <div>├─ CII improvements: €{compliance.estimatedCosts2026.ciiImprovements.toLocaleString()}</div>
            <div>├─ MRV verification: €{compliance.estimatedCosts2026.mrvVerification.toLocaleString()}</div>
            <div>├─ Safety/class surveys: €{compliance.estimatedCosts2026.safetySurveys.toLocaleString()}</div>
            <div className="font-semibold">└─ Total: €{compliance.estimatedCosts2026.total.toLocaleString()}</div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Export Compliance Dashboard
        </Button>
        <Button variant="outline">
          <Mail className="mr-2 h-4 w-4" />
          Send to Management
        </Button>
      </div>
    </div>
  )
}


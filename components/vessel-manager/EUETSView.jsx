"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, TrendingUp, FileText, Mail } from "lucide-react"

export function EUETSView({ data }) {
  const defaultData = {
    status: "COMPLIANT",
    fleetEmissions: 28450,
    allowancesRequired: 14225,
    euaPrice: 85,
    estimatedCost: 1210000,
    budget: 1150000,
    variance: 5.2,
    trend: "INCREASING",
    emissionsTrend: 3,
    priceTrend: 12,
    topEmitters: [
      { vessel: "MV Ocean Star", emissions: 3240 },
      { vessel: "MV Pacific Voyager", emissions: 2890 },
      { vessel: "MV Baltic", emissions: 2675 },
    ],
    savingsOpportunity: {
      vessel: "MV Ocean Star",
      potential: 186,
      cost: 15810,
    },
  }

  const euEts = data || defaultData

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            <CardTitle>EU ETS (Emissions Trading System)</CardTitle>
          </div>
          <Badge className={euEts.status === "COMPLIANT" ? "bg-green-600" : "bg-yellow-600"}>
            {euEts.status === "COMPLIANT" ? "✅ COMPLIANT" : euEts.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          Status: <strong>{euEts.status === "COMPLIANT" ? "✅ COMPLIANT (All vessels tracked and reported)" : euEts.status}</strong>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">2025 PERFORMANCE:</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <div>├─ Fleet total emissions: {euEts.fleetEmissions.toLocaleString()} tCO2 (Jan-Dec YTD)</div>
            <div>├─ Allowances required: {euEts.allowancesRequired.toLocaleString()} tCO2 (50% EU scope)</div>
            <div>├─ Current EUA price: €{euEts.euaPrice}/tonne</div>
            <div>├─ Estimated cost: €{euEts.estimatedCost.toLocaleString()}</div>
            <div>
              └─ vs Budget: €{euEts.budget.toLocaleString()} ({euEts.variance > 0 ? "+" : ""}
              {euEts.variance}% over budget) {euEts.variance > 0 && "⚠️"}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">TRENDS:</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <div className="flex items-center gap-2">
              ├─ Emissions trending: <TrendingUp className="h-4 w-4" /> {euEts.emissionsTrend > 0 ? "+" : ""}
              {euEts.emissionsTrend}% vs 2024
            </div>
            <div className="flex items-center gap-2">
              ├─ EUA price trending: <TrendingUp className="h-4 w-4" /> +€{euEts.priceTrend}/tonne vs Q3
            </div>
            <div>└─ Impact: Carbon costs increasing</div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">TOP EMITTERS (2025):</h4>
          <div className="text-sm text-gray-700 space-y-1">
            {euEts.topEmitters.map((emitter, idx) => (
              <div key={idx}>
                {idx + 1}. {emitter.vessel}: {emitter.emissions.toLocaleString()} tCO2
                {idx === 0 && " (highest - needs optimization)"}
              </div>
            ))}
          </div>
        </div>

        {euEts.savingsOpportunity && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-300">
            <h4 className="font-semibold text-sm mb-2">COST SAVINGS OPPORTUNITY:</h4>
            <div className="text-sm text-gray-700">
              If {euEts.savingsOpportunity.vessel} consumption reduced to fleet average:
            </div>
            <div className="text-sm text-gray-700 mt-1">
              └─ Save: {euEts.savingsOpportunity.potential} tCO2/year = €{euEts.savingsOpportunity.cost.toLocaleString()}/year
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            View Detailed Report
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Export for Management
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Download, FileText } from "lucide-react"

export function FleetPerformanceSnapshot({ data }) {
  const defaultData = {
    technical: {
      avgConsumptionEfficiency: 82,
      trend: "+2 vs last month",
      best: { vessel: "MV Atlantic", score: 94 },
      worst: { vessel: "MV Ocean Star", score: 68, issue: "Hull cleaning needed" },
      fleetTrend: "Improving",
    },
    hull: {
      withinInterval: 8,
      approachingDue: 3,
      overdue: 1,
      overdueVessel: "MV Ocean Star",
      avgDaysSinceCleaning: 78,
      targetDays: 120,
    },
    engine: {
      allEfficient: true,
      efficiency: "95%+",
      maintenanceIssues: "No maintenance issues",
    },
    commercial: {
      bunkerCost: "$8.2M/month",
      vsBudget: "-2.3% (Under budget)",
      vsMarket: "-$3/MT avg (Beating market)",
      potentialSavings: "$234K/month",
    },
    cpCompliance: {
      withinTerms: 11,
      marginal: 1,
      marginalVessel: "MV Ocean Star - over-consuming",
      compliance: "98% (Excellent)",
    },
  }

  const snapshot = data || defaultData

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">📊 FLEET PERFORMANCE SNAPSHOT</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              View Detailed Analytics
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Technical Performance */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-gray-900">TECHNICAL PERFORMANCE:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span>Avg Consumption Efficiency:</span>
              <Badge className="bg-green-600">{snapshot.technical.avgConsumptionEfficiency}/100</Badge>
              <span className="text-green-600">✅</span>
              <span className="text-gray-500">({snapshot.technical.trend})</span>
            </div>
            <div className="ml-4 space-y-1 text-gray-600">
              <div>
                ├─ Best: <strong>{snapshot.technical.best.vessel}</strong> ({snapshot.technical.best.score}/100)
              </div>
              <div>
                ├─ Worst: <strong>{snapshot.technical.worst.vessel}</strong> ({snapshot.technical.worst.score}/100) -{" "}
                {snapshot.technical.worst.issue}
              </div>
              <div>
                └─ Fleet trending: <TrendingUp className="inline h-4 w-4 text-green-600" /> {snapshot.technical.fleetTrend}
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="font-semibold">Hull Performance:</div>
            <div className="ml-4 space-y-1 text-gray-600">
              <div>
                ├─ {snapshot.hull.withinInterval} vessels: Within cleaning interval ✅
              </div>
              <div>
                ├─ {snapshot.hull.approachingDue} vessels: Approaching due date ⚠️
              </div>
              <div>
                ├─ {snapshot.hull.overdue} vessel: Overdue ({snapshot.hull.overdueVessel}) 🔴
              </div>
              <div>
                └─ Avg days since cleaning: {snapshot.hull.avgDaysSinceCleaning} days (target: &lt;{snapshot.hull.targetDays} days)
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="font-semibold">Engine Performance:</div>
            <div className="ml-4 space-y-1 text-gray-600">
              <div>
                ├─ All vessels: {snapshot.engine.efficiency} efficiency ✅
              </div>
              <div>└─ {snapshot.engine.maintenanceIssues}</div>
            </div>
          </div>
        </div>

        {/* Commercial Impact */}
        <div className="pt-4 border-t">
          <h3 className="font-semibold text-lg mb-3 text-gray-900">COMMERCIAL IMPACT:</h3>
          <div className="space-y-2 text-sm">
            <div>
              Fleet bunker cost: <strong>{snapshot.commercial.bunkerCost}</strong>
            </div>
            <div className="ml-4 space-y-1 text-gray-600">
              <div>
                ├─ Vs budget: {snapshot.commercial.vsBudget} ✅
              </div>
              <div>
                ├─ Vs market: {snapshot.commercial.vsMarket} ✅
              </div>
              <div>
                └─ Potential savings identified: <strong className="text-green-600">{snapshot.commercial.potentialSavings}</strong>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="font-semibold">Performance vs Charter Party:</div>
            <div className="ml-4 space-y-1 text-gray-600">
              <div>
                ├─ {snapshot.cpCompliance.withinTerms} vessels: Within CP terms ✅
              </div>
              <div>
                ├─ {snapshot.cpCompliance.marginal} vessel: Marginal ({snapshot.cpCompliance.marginalVessel}) ⚠️
              </div>
              <div>
                └─ CP compliance: <strong>{snapshot.cpCompliance.compliance}</strong>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


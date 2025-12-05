"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle2, Calendar, FileText, Download } from "lucide-react"
import { format } from "date-fns"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export function HullCleaningManagement({ data }) {
  const defaultData = {
    summary: {
      overdue: 1,
      dueSoon: 3,
      onTime: 8,
      avgDays: 78,
      target: 120,
    },
    vessels: [
      {
        vessel: "MV Ocean Star",
        status: "OVERDUE",
        lastCleaned: "2025-08-15",
        daysAgo: 142,
        overdueDays: 22,
        nextDue: "2025-11-13",
        performanceImpact: {
          consumptionIncrease: 14,
          fuelImpactPerDay: 3,
          costPerDay: 1935,
          totalWasted: 42570,
          projectedWaste60Days: 154800,
        },
        options: [
          {
            id: "OPT-A",
            location: "Rotterdam",
            date: "2025-12-20",
            vendor: "HullWiper",
            cleaningCost: 8500,
            downtimeCost: 9250,
            totalCost: 17750,
            duration: 12,
            slotStatus: "CONFIRMED",
            savings60Days: 98350,
            recommended: false,
          },
          {
            id: "OPT-B",
            location: "Lisbon",
            date: "2025-12-12",
            vendor: "SubSea Services",
            cleaningCost: 7200,
            deviationCost: 5160,
            timeCost: 6167,
            portCost: 3500,
            totalCost: 22027,
            duration: 18,
            slotStatus: "PENDING",
            earlyCleaningSavings: 13545,
            savings60Days: 107618,
            recommended: true,
          },
        ],
      },
      {
        vessel: "MV Baltic",
        status: "DUE_SOON",
        lastCleaned: "2025-09-05",
        daysAgo: 105,
        nextDue: "2025-12-15",
        daysUntilDue: 15,
        performanceScore: 88,
        consumption: 22.1,
        nextPortCall: {
          port: "Singapore",
          date: "2025-12-18",
        },
        vendorOptions: [
          { vendor: "Keppel Offshore", cost: 9200, duration: 14 },
          { vendor: "Sembcorp Marine", cost: 8800, duration: 12, recommended: true },
        ],
      },
      {
        vessel: "MV Atlantic",
        status: "ON_SCHEDULE",
        lastCleaned: "2025-10-20",
        daysAgo: 45,
        nextDue: "2026-02-18",
        daysUntilDue: 75,
        performanceScore: 98,
        consumption: 21.5,
        note: "Best in fleet - benchmark vessel",
      },
    ],
    analytics: {
      annualCleaningCost: 324000,
      annualFuelSavings: 1800000,
      netBenefit: 1476000,
      roi: 456,
    },
  }

  const hullData = data || defaultData

  // Chart data for consumption vs days since cleaning
  const chartData = [
    { days: 0, consumption: 20 },
    { days: 30, consumption: 20.5 },
    { days: 60, consumption: 21 },
    { days: 90, consumption: 21.8 },
    { days: 120, consumption: 22.5 },
    { days: 150, consumption: 23.5 },
    { days: 180, consumption: 24.5 },
    { days: 210, consumption: 25.5 },
    { days: 240, consumption: 26.5 },
  ]

  return (
    <div className="space-y-6">
      {/* Fleet Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-300 bg-red-50">
          <CardContent className="pt-4">
            <div className="text-sm text-gray-600 mb-1">🔴 OVERDUE</div>
            <div className="text-2xl font-bold text-red-700">{hullData.summary.overdue} vessel</div>
            <div className="text-xs text-gray-600 mt-1">&gt;120 days</div>
            <div className="text-xs text-gray-600">Action: Now</div>
          </CardContent>
        </Card>
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="pt-4">
            <div className="text-sm text-gray-600 mb-1">🟡 DUE SOON</div>
            <div className="text-2xl font-bold text-yellow-700">{hullData.summary.dueSoon} vessels</div>
            <div className="text-xs text-gray-600 mt-1">105-120 days</div>
            <div className="text-xs text-gray-600">Plan: 2 wks</div>
          </CardContent>
        </Card>
        <Card className="border-green-300 bg-green-50">
          <CardContent className="pt-4">
            <div className="text-sm text-gray-600 mb-1">🟢 ON TIME</div>
            <div className="text-2xl font-bold text-green-700">{hullData.summary.onTime} vessels</div>
            <div className="text-xs text-gray-600 mt-1">&lt;105 days</div>
            <div className="text-xs text-gray-600">Monitor</div>
          </CardContent>
        </Card>
        <Card className="border-blue-300 bg-blue-50">
          <CardContent className="pt-4">
            <div className="text-sm text-gray-600 mb-1">AVG DAYS</div>
            <div className="text-2xl font-bold text-blue-700">{hullData.summary.avgDays} days</div>
            <div className="text-xs text-gray-600 mt-1">Target: &lt;{hullData.summary.target} days</div>
          </CardContent>
        </Card>
      </div>

      {/* Vessel-by-Vessel Status */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">VESSEL-BY-VESSEL STATUS:</h3>
        {hullData.vessels.map((vessel, idx) => (
          <Card key={idx} className={vessel.status === "OVERDUE" ? "border-2 border-red-500" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {vessel.status === "OVERDUE" ? (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  ) : vessel.status === "DUE_SOON" ? (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                  <CardTitle>
                    {vessel.status === "OVERDUE" ? "🔴" : vessel.status === "DUE_SOON" ? "🟡" : "🟢"} {vessel.vessel}
                    {vessel.status === "OVERDUE" && " - URGENT ACTION REQUIRED"}
                    {vessel.status === "DUE_SOON" && " - CLEANING DUE SOON"}
                    {vessel.status === "ON_SCHEDULE" && " - ON SCHEDULE"}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-1">
                <div>Last Cleaned: {format(new Date(vessel.lastCleaned), "MMM d, yyyy")} ({vessel.daysAgo} days ago) {vessel.status === "OVERDUE" && "🔴"}</div>
                {vessel.overdueDays && <div>Overdue by: {vessel.overdueDays} days</div>}
                <div>Next Cleaning Due: {vessel.nextDue ? format(new Date(vessel.nextDue), "MMM d, yyyy") : "N/A"}</div>
                {vessel.daysUntilDue && <div>Days until due: {vessel.daysUntilDue}</div>}
              </div>

              {vessel.performanceImpact && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-sm mb-2">PERFORMANCE IMPACT:</h4>
                    <div className="text-sm text-gray-700 space-y-1">
                      <div>├─ Consumption increase: +{vessel.performanceImpact.consumptionIncrease}% (+{vessel.performanceImpact.fuelImpactPerDay} MT/day)</div>
                      <div>├─ Cost impact: ${vessel.performanceImpact.costPerDay.toLocaleString()}/day wasted</div>
                      <div>├─ Total wasted ({vessel.overdueDays} days): ${vessel.performanceImpact.totalWasted.toLocaleString()}</div>
                      <div>└─ If not cleaned: ${vessel.performanceImpact.projectedWaste60Days.toLocaleString()} over next 60 days</div>
                    </div>
                  </div>
                </>
              )}

              {vessel.options && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-sm mb-2">CLEANING OPTIONS:</h4>
                    <div className="space-y-3">
                      {vessel.options.map((option) => (
                        <div
                          key={option.id}
                          className={`p-4 rounded-lg border-2 ${option.recommended ? "bg-green-50 border-green-300" : "bg-gray-50 border-gray-200"}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-semibold">Option {option.id.split("-")[1]}: {option.location} - {format(new Date(option.date), "MMM d")}</span>
                              {option.recommended && <Badge className="ml-2 bg-green-600">⭐ RECOMMENDED</Badge>}
                            </div>
                          </div>
                          <div className="text-sm text-gray-700 space-y-1">
                            <div>├─ Vendor: {option.vendor}</div>
                            <div>├─ Cost: ${option.cleaningCost.toLocaleString()} (cleaning) {option.downtimeCost && `+ $${option.downtimeCost.toLocaleString()} (downtime)`} = ${option.totalCost.toLocaleString()}</div>
                            <div>├─ Duration: {option.duration} hours {option.deviationCost && `+ ${(option.duration - 10)} hours deviation`}</div>
                            <div>├─ Slot available: {option.slotStatus === "CONFIRMED" ? "✅ Confirmed" : "⏳ Pending confirmation"}</div>
                            {option.earlyCleaningSavings && (
                              <div>├─ Saves 7 days of over-consumption: +${option.earlyCleaningSavings.toLocaleString()}</div>
                            )}
                            <div>└─ Savings: ${option.savings60Days.toLocaleString()} over next 60 days {option.recommended && "(Better by $9,268!)"}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button className="bg-green-600 hover:bg-green-700">
                        ✅ Book Option {vessel.options.find((o) => o.recommended)?.id.split("-")[1] || "A"}
                      </Button>
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        View Full Analysis
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {vessel.nextPortCall && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-sm mb-2">NEXT PORT CALL:</h4>
                    <div className="text-sm text-gray-700">
                      {vessel.nextPortCall.port} - {format(new Date(vessel.nextPortCall.date), "MMM d")}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Recommended: Schedule cleaning during this port call</div>
                    {vessel.vendorOptions && (
                      <div className="mt-2">
                        <div className="font-semibold text-xs mb-1">Vendor Options:</div>
                        {vessel.vendorOptions.map((vendor, vIdx) => (
                          <div key={vIdx} className="text-sm text-gray-700">
                            {vIdx + 1}. {vendor.vendor}: ${vendor.cost.toLocaleString()}, {vendor.duration} hours {vendor.recommended && "⭐"}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-2 flex gap-2">
                      <Button variant="outline" size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Cleaning
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {vessel.note && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-300">
                  <div className="text-sm text-gray-700">{vessel.note}</div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>HULL CLEANING PERFORMANCE ANALYTICS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Consumption vs Days Since Cleaning (Fleet Data):</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="days" label={{ value: "Days Since Cleaning", position: "insideBottom", offset: -5 }} />
                  <YAxis label={{ value: "MT/day", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Scatter dataKey="consumption" fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              💡 INSIGHT: Consumption increases ~1% per 15 days after 120 days. Optimal cleaning interval: 110-120 days.
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2">ANNUAL CLEANING COSTS VS SAVINGS:</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <div>Total cleaning costs (12 vessels): ${hullData.analytics.annualCleaningCost.toLocaleString()}/year</div>
              <div>Fuel savings from optimal cleaning: ${hullData.analytics.annualFuelSavings.toLocaleString()}/year</div>
              <div className="font-semibold text-green-600">Net benefit: ${hullData.analytics.netBenefit.toLocaleString()}/year</div>
              <div className="font-semibold">ROI: {hullData.analytics.roi}%</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Export Full Report
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Calendar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


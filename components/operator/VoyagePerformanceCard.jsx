"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BarChart3, FileText, MessageSquare, Mail, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { OperatorContributionAnalysis } from "./OperatorContributionAnalysis"
import { CharterPartyCompliance } from "./CharterPartyCompliance"

/**
 * Individual Voyage Performance Card
 * Shows detailed economics, operator contribution, and CP compliance
 */
export function VoyagePerformanceCard({ voyage }) {
  if (!voyage) return null

  const {
    vessel,
    route,
    charterType,
    charterRate,
    status,
    dayOfVoyage,
    totalDays,
    economics,
    operatorContribution,
    cpCompliance,
    alerts = [],
  } = voyage

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">
              {vessel} - {route}
            </CardTitle>
            <div className="text-xs text-gray-600 mt-1">
              Charter Party: {charterType} @ {charterRate}
            </div>
          </div>
          <Badge className={cn(
            status === "IN_PROGRESS" && "bg-primary-600",
            status === "COMPLETED" && "bg-success",
            status === "DELAYED" && "bg-warning",
            "text-white"
          )}>
            {status === "IN_PROGRESS" ? `IN PROGRESS (Day ${dayOfVoyage} of ${totalDays})` : status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-sm mb-1">⚠️ ATTENTION:</div>
                {alerts.map((alert, idx) => (
                  <div key={idx} className="text-sm text-gray-700">
                    {alert}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Voyage Economics */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">VOYAGE ECONOMICS:</h4>
          <Card className="bg-gray-50">
            <CardContent className="p-4 space-y-3 text-sm">
              {economics.freightRevenue && (
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Freight Revenue:</span>
                    <span className="font-medium">${economics.freightRevenue.toLocaleString()}</span>
                  </div>
                  {economics.freightDetails && (
                    <div className="text-xs text-gray-600 ml-4 mt-1">
                      {economics.freightDetails}
                    </div>
                  )}
                  {economics.freightStatus && (
                    <div className="text-xs text-success mt-1">✅ {economics.freightStatus}</div>
                  )}
                </div>
              )}

              <Separator />

              <div>
                <div className="font-medium text-gray-700 mb-2">Voyage Costs:</div>
                <div className="space-y-2 ml-4">
                  {economics.bunkerCost && (
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Bunker Cost (Actual):</span>
                        <span className="font-medium">${economics.bunkerCost.actual.toLocaleString()}</span>
                      </div>
                      {economics.bunkerCost.planned && (
                        <div className="text-xs text-gray-600">
                          vs Planned: ${economics.bunkerCost.planned.toLocaleString()}
                        </div>
                      )}
                      {economics.bunkerCost.savings && (
                        <div className="text-xs text-success font-medium">
                          💰 OPERATOR SAVED: ${economics.bunkerCost.savings.toLocaleString()} ({economics.bunkerCost.savingsPercent}%)
                        </div>
                      )}
                    </div>
                  )}

                  {economics.portCosts && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Port Costs:</span>
                      <span className="font-medium">
                        ${economics.portCosts.actual.toLocaleString()}
                        {economics.portCosts.planned && ` (vs plan: $${economics.portCosts.planned.toLocaleString()} ${economics.portCosts.actual === economics.portCosts.planned ? "✅" : ""})`}
                      </span>
                    </div>
                  )}

                  {economics.canalPilot && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Canal/Pilot:</span>
                      <span className="font-medium">
                        ${economics.canalPilot.actual.toLocaleString()}
                        {economics.canalPilot.planned && ` (vs plan: $${economics.canalPilot.planned.toLocaleString()} ${economics.canalPilot.actual === economics.canalPilot.planned ? "✅" : ""})`}
                      </span>
                    </div>
                  )}

                  {economics.otherCosts && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Other:</span>
                      <span className="font-medium">${economics.otherCosts.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {economics.netResult && (
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Net Voyage Result:</span>
                    <span className="font-bold text-lg">${economics.netResult.actual.toLocaleString()}</span>
                  </div>
                  {economics.netResult.planned && (
                    <div className="text-xs text-gray-600">
                      vs Planned: ${economics.netResult.planned.toLocaleString()}
                    </div>
                  )}
                  {economics.netResult.variance && (
                    <div className={cn(
                      "text-xs font-medium mt-1",
                      economics.netResult.variance >= 0 ? "text-success" : "text-warning"
                    )}>
                      Variance: {economics.netResult.variance >= 0 ? "+" : ""}${economics.netResult.variance.toLocaleString()} {economics.netResult.variance >= 0 ? "✅ (Better than plan)" : "⚠️ (Below plan)"}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Operator Contribution Analysis */}
        {operatorContribution && (
          <OperatorContributionAnalysis contribution={operatorContribution} />
        )}

        {/* Charter Party Compliance */}
        {cpCompliance && (
          <CharterPartyCompliance compliance={cpCompliance} />
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-3 w-3 mr-1" />
            View Detailed Timeline
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-3 w-3 mr-1" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-3 w-3 mr-1" />
            Add Notes
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="h-3 w-3 mr-1" />
            Share with Charterer
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


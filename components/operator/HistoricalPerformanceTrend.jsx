"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { BarChart3, FileText } from "lucide-react"

/**
 * Historical Performance Trend
 * Shows consumption pattern over time with cleaning events
 */
export function HistoricalPerformanceTrend({ trend }) {
  if (!trend || !trend.data) return null

  const { data = [], pattern = {}, comparison = [] } = trend

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">📈 HISTORICAL PERFORMANCE TREND</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm text-gray-700 mb-3">
            {trend.vessel} - Last 12 Months Consumption Pattern:
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[20, 26]} />
                <Tooltip />
                <ReferenceLine y={22} stroke="#10b981" strokeDasharray="5 5" label="Plan" />
                <Line
                  type="monotone"
                  dataKey="consumption"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Consumption (MT/day)"
                />
                {data.map((point, idx) => 
                  point.cleaning ? (
                    <ReferenceLine
                      key={idx}
                      x={point.month}
                      stroke="#3b82f6"
                      strokeDasharray="3 3"
                      label={{ value: "Hull cleaned", position: "top", fontSize: 10 }}
                    />
                  ) : null
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pattern Detected */}
        {pattern.degradation && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-start gap-2">
              <span className="text-lg">💡</span>
              <div className="flex-1">
                <div className="font-semibold text-sm mb-2">PATTERN DETECTED:</div>
                <div className="space-y-1 text-xs text-gray-700">
                  {pattern.degradation && (
                    <div>• Consistent degradation curve ({pattern.degradation} MT/day per month)</div>
                  )}
                  {pattern.lastCleaningImpact && (
                    <div>• Last cleaning impact: {pattern.lastCleaningImpact} MT/day improvement</div>
                  )}
                  {pattern.optimalInterval && (
                    <div>• Optimal cleaning interval: {pattern.optimalInterval} days</div>
                  )}
                  {pattern.currentlyOverdue && (
                    <div>• Currently {pattern.currentlyOverdue} days overdue</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sister Vessel Comparison */}
        {comparison.length > 0 && (
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-2">SISTER VESSEL COMPARISON:</div>
            <div className="space-y-1 text-xs text-gray-700">
              {comparison.map((comp, idx) => (
                <div key={idx}>
                  • {comp.vessel}: {comp.consumption} MT/day {comp.note && `(${comp.note})`}
                  {comp.flag && <span className="ml-2">{comp.flag}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" className="text-xs">
            <BarChart3 className="h-3 w-3 mr-1" />
            View Full Technical History
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <FileText className="h-3 w-3 mr-1" />
            Maintenance Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


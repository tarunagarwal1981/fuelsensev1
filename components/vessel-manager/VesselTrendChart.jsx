"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

export function VesselTrendChart({ trend }) {
  if (!trend || !trend.months || !trend.consumption) return null

  const data = trend.months.map((month, idx) => ({
    month,
    consumption: trend.consumption[idx],
  }))

  const lastCleaningIndex = trend.lastCleaning ? trend.months.indexOf(trend.lastCleaning) : -1

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Trend (Last 6 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis label={{ value: "Consumption (MT/day)", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Line type="monotone" dataKey="consumption" stroke="#3b82f6" strokeWidth={2} />
              {lastCleaningIndex >= 0 && (
                <ReferenceLine
                  x={trend.months[lastCleaningIndex]}
                  stroke="#10b981"
                  strokeDasharray="5 5"
                  label={{ value: "Last cleaned", position: "top" }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          💡 INSIGHT: {trend.insight || "Clear degradation pattern. Hull cleaning every 120 days keeps consumption optimal."}
        </div>
      </CardContent>
    </Card>
  )
}


"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export function CostTrendChart({ data }) {
  const defaultData = [
    { month: "Jan", actual: 8.2, budget: 8.5 },
    { month: "Feb", actual: 8.5, budget: 8.7 },
    { month: "Mar", actual: 9.1, budget: 9.2 },
    { month: "Apr", actual: 9.8, budget: 10.0 },
    { month: "May", actual: 10.2, budget: 10.5 },
    { month: "Jun", actual: 10.5, budget: 10.8 },
    { month: "Jul", actual: 10.8, budget: 11.0 },
    { month: "Aug", actual: 11.2, budget: 11.3 },
    { month: "Sep", actual: 10.9, budget: 11.1 },
    { month: "Oct", actual: 10.5, budget: 10.8 },
    { month: "Nov", actual: 10.2, budget: 10.5 },
    { month: "Dec", actual: 9.8, budget: 10.0 },
  ]

  const chartData = data || defaultData

  return (
    <Card>
      <CardHeader>
        <CardTitle>MONTH-OVER-MONTH TREND</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis label={{ value: "Cost ($M)", angle: -90, position: "insideLeft" }} />
              <Tooltip formatter={(value) => `$${value}M`} />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} name="Actual" />
              <Line type="monotone" dataKey="budget" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="Budget" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          💡 INSIGHT: Seasonal variation normal. Consistently beating budget through smart planning and AI optimization.
        </div>
      </CardContent>
    </Card>
  )
}





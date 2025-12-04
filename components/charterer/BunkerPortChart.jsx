"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { cn } from "@/lib/utils"

/**
 * Bunker Port Comparison Chart
 * Simple horizontal bar chart showing total costs
 */
export function BunkerPortChart({ ports, recommendedPortName }) {
  const chartData = ports
    .map((port) => ({
      name: port.name,
      cost: port.totalCost / 1000, // Convert to K
      isRecommended: port.name === recommendedPortName,
      isExpensive: port.totalCost > Math.min(...ports.map((p) => p.totalCost)) * 1.1,
    }))
    .sort((a, b) => a.cost - b.cost)

  const maxCost = Math.max(...chartData.map((d) => d.cost))
  const minCost = Math.min(...chartData.map((d) => d.cost))

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-900">Cost Comparison</h4>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[minCost * 0.95, maxCost * 1.05]} />
            <YAxis
              dataKey="name"
              type="category"
              width={70}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => `$${value.toFixed(0)}K`}
              contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
            />
            <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.isRecommended
                      ? "#10b981"
                      : entry.isExpensive
                      ? "#ef4444"
                      : "#3b82f6"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-success rounded" />
          <span>Recommended</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-primary-600 rounded" />
          <span>Standard</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-danger rounded" />
          <span>Expensive</span>
        </div>
      </div>
    </div>
  )
}


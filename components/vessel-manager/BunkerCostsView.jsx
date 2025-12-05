"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export function BunkerCostsView({ data }) {
  const defaultData = {
    summary: {
      ytd: 98400000,
      budget: 100700000,
      variance: -2.3,
      avgCostPerMT: 652,
      marketAvg: 665,
      vsMarket: -2,
    },
    savings: {
      aiOptimization: 1200000,
      earlyBunkering: 540000,
      routeOptimization: 380000,
      total: 2120000,
    },
    byVessel: [
      { vessel: "MV Ocean Star", cost: 9200000, consumption: 14100 },
      { vessel: "MV Atlantic", cost: 7800000, consumption: 11950 },
      { vessel: "MV Pacific Voyager", cost: 8500000, consumption: 13030 },
    ],
  }

  const bunker = data || defaultData

  const formatCurrency = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    return `$${(value / 1000).toFixed(0)}K`
  }

  const chartData = bunker.byVessel.map((v) => ({
    vessel: v.vessel.replace("MV ", ""),
    cost: v.cost / 1000000,
  }))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bunker Cost Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600">YTD Cost:</div>
              <div className="text-2xl font-bold">{formatCurrency(bunker.summary.ytd)}</div>
            </div>
            <div>
              <div className="text-gray-600">vs Budget:</div>
              <div className={`text-2xl font-bold ${bunker.summary.variance < 0 ? "text-green-600" : "text-red-600"}`}>
                {bunker.summary.variance < 0 ? "-" : "+"}{Math.abs(bunker.summary.variance)}%
              </div>
            </div>
            <div>
              <div className="text-gray-600">Avg Cost/MT:</div>
              <div className="text-xl font-semibold">${bunker.summary.avgCostPerMT}</div>
            </div>
            <div>
              <div className="text-gray-600">vs Market:</div>
              <div className="text-xl font-semibold text-green-600">{bunker.summary.vsMarket}% better</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bunker Costs by Vessel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vessel" />
                <YAxis label={{ value: "Cost ($M)", angle: -90, position: "insideLeft" }} />
                <Tooltip formatter={(value) => `$${value}M`} />
                <Bar dataKey="cost" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Savings Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <div>• AI optimization: {formatCurrency(bunker.savings.aiOptimization)}</div>
            <div>• Early bunkering: {formatCurrency(bunker.savings.earlyBunkering)}</div>
            <div>• Route optimization: {formatCurrency(bunker.savings.routeOptimization)}</div>
            <div className="font-semibold pt-2 border-t">Total savings: {formatCurrency(bunker.savings.total)}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


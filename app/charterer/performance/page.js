"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Notifications } from "@/components/Notifications"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Building2, CalendarDays, TrendingUp, TrendingDown, Download, Mail, RefreshCw } from "lucide-react"

// Simple metric card
function MetricCard({ label, value, sublabel, trendLabel, trendDirection, targetLabel, status }) {
  const trendColor =
    trendDirection === "up" ? "text-success" : trendDirection === "down" ? "text-danger" : "text-gray-500"

  const statusColor =
    status === "good" ? "bg-success text-white" : status === "warn" ? "bg-warning text-black" : "bg-danger text-white"

  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">{label}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {sublabel && <div className="text-xs text-gray-500">{sublabel}</div>}
        <div className="flex items-center justify-between text-xs mt-2">
          <div className={cn("flex items-center gap-1", trendColor)}>
            {trendDirection === "up" && <TrendingUp className="h-3 w-3" />}
            {trendDirection === "down" && <TrendingDown className="h-3 w-3" />}
            <span>{trendLabel}</span>
          </div>
          {targetLabel && (
            <Badge className={cn("text-[10px] px-2 py-0.5", statusColor)}>
              {targetLabel}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Profit trend chart
function ProfitTrendChart({ data }) {
  return (
    <Card className="h-80">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Monthly Profit Trend (Last 12 Months)</CardTitle>
        <CardDescription>Actual vs target profit</CardDescription>
      </CardHeader>
      <CardContent className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}M`} />
            <RechartsTooltip
              formatter={(value, name) => [`$${value}M`, name === "actual" ? "Actual" : "Target"]}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#9CA3AF"
              strokeDasharray="5 5"
              dot={false}
              name="Target"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#2563EB"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Actual"
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-3 text-xs text-gray-600">
          Target: <span className="font-medium">$3.0M</span> (dotted) • Actual:{" "}
          <span className="font-medium text-success">$3.2M</span> (7% above target)
        </div>
      </CardContent>
    </Card>
  )
}

// Bunker cost analysis panel
function BunkerCostPanel() {
  const ports = [
    { name: "Port Klang", volume: 4200, price: 645, flag: "good" },
    { name: "Fujairah", volume: 3500, price: 650, flag: "good" },
    { name: "Singapore", volume: 2100, price: 695, flag: "warn" },
    { name: "Colombo", volume: 2240, price: 652, flag: "neutral" },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Bunker Cost Analysis</CardTitle>
        <CardDescription>This month&apos;s bunker spend and opportunities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total Bunker Spend This Month:</span>
            <span className="font-semibold">$7.8M</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Average Price Paid:</span>
            <span className="font-semibold">$648/MT</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">vs Market Index:</span>
            <span className="font-semibold text-success">-$2/MT (0.3% below market)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total Quantity:</span>
            <span className="font-semibold">12,040 MT</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Bunker as % of Total Cost:</span>
            <span className="font-semibold text-success">42% (vs 45% target)</span>
          </div>
        </div>

        <Separator />

        <div>
          <div className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            Top Bunker Ports by Volume
          </div>
          <div className="space-y-1 text-xs">
            {ports.map((p, idx) => (
              <div key={p.name} className="flex items-center justify-between">
                <span>
                  {idx + 1}. {p.name}{" "}
                  {p.flag === "warn" && <span className="text-warning">⚠️ Expensive</span>}
                </span>
                <span>
                  <span className="font-medium">{p.volume.toLocaleString()} MT</span> - Avg ${p.price}/MT
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="text-xs text-gray-700">
          💡 <span className="font-semibold">Savings Opportunity:</span> Shifting 30% of Singapore bunkers to Port Klang
          could save ~<span className="font-semibold">$105K/month</span>.
        </div>
      </CardContent>
    </Card>
  )
}

// Fleet utilization panel
function FleetUtilizationPanel() {
  const vessels = [
    { name: "MV Star", utilization: 87, cargoes: 3 },
    { name: "MV Pride", utilization: 92, cargoes: 4 },
    { name: "MV Carrier", utilization: 82, cargoes: 2 },
    { name: "MV Swift", utilization: 52, cargoes: 1, flag: "warn" },
    { name: "MV Ocean", utilization: 98, cargoes: 4 },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Fleet Utilization</CardTitle>
        <CardDescription>How effectively your fleet is being used</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Active Vessels:</span>
          <span className="font-semibold">5</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Utilization Rate:</span>
          <span className="font-semibold text-success">87% (vs 85% target)</span>
        </div>

        <Separator />

        <div className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
          Vessel Performance
        </div>
        <div className="space-y-2 text-xs">
          {vessels.map((v) => (
            <div key={v.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{v.name}</span>
                <span>
                  {v.utilization}% ({v.cargoes} cargo{v.cargoes !== 1 ? "es" : ""})
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    v.flag === "warn" ? "bg-warning" : "bg-primary-600"
                  )}
                  style={{ width: `${v.utilization}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="text-xs text-warning">
          ⚠️ <span className="font-semibold">MV Swift underutilized</span> - only 1 cargo this month. Vessel was
          unavailable for 10 days (repair), expected to normalize next month.
        </div>
      </CardContent>
    </Card>
  )
}

// Top routes table
function TopRoutesTable() {
  const routes = [
    { route: "Singapore → Rotterdam", cargoes: 3, avgProfit: 310000, totalProfit: 930000 },
    { route: "Dubai → London", cargoes: 2, avgProfit: 245000, totalProfit: 490000 },
    { route: "Tokyo → Los Angeles", cargoes: 2, avgProfit: 195000, totalProfit: 390000 },
    { route: "Mumbai → Singapore", cargoes: 3, avgProfit: 158000, totalProfit: 474000 },
    { route: "Shanghai → Hamburg", cargoes: 2, avgProfit: 280000, totalProfit: 560000 },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Top Performing Routes</CardTitle>
        <CardDescription>Routes ranked by total profit</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead className="text-right">Cargoes</TableHead>
                <TableHead className="text-right">Avg Profit</TableHead>
                <TableHead className="text-right">Total Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((r) => (
                <TableRow key={r.route}>
                  <TableCell>{r.route}</TableCell>
                  <TableCell className="text-right">{r.cargoes}</TableCell>
                  <TableCell className="text-right">${(r.avgProfit / 1000).toFixed(0)}K</TableCell>
                  <TableCell className="text-right">${(r.totalProfit / 1000).toFixed(0)}K</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

// AI performance insights
function AiPerformanceInsights() {
  const findings = [
    {
      title: "Strong Month - Exceeded profit target by 7%",
      details: [
        "Singapore–EU route particularly profitable",
        "Good bunker cost management",
      ],
    },
    {
      title: "Success Rate Dip - Down 2% from last month",
      details: [
        "2 cargoes rejected due to weather",
        "Consider being more selective in Q1",
      ],
    },
    {
      title: "MV Swift Underutilized - Only 52% this month",
      details: [
        "Vessel was unavailable for 10 days (repair)",
        "Expected to normalize next month",
      ],
    },
    {
      title: "Bunker Efficiency Excellent - Saved $234K",
      details: [
        "Consistently choosing optimal bunker ports",
        "Port Klang strategy paying off",
      ],
    },
    {
      title: "Recommendation: Continue current strategy",
      details: [
        "Maintain focus on Singapore–EU route",
        "Watch Q1 seasonal patterns (typically slower)",
        "Consider fixing MV Swift ASAP for Jan loading",
      ],
    },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">AI Performance Insights</CardTitle>
        <CardDescription>Key findings and recommendations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-xs text-gray-700">
        {findings.map((f, idx) => (
          <div key={idx} className="space-y-1">
            <div className="font-semibold">💡 {f.title}</div>
            <ul className="list-disc list-inside space-y-0.5">
              {f.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default function ChartererPerformancePage() {
  const router = useRouter()
  const { currentUser, cargoes } = useStore()
  const [range, setRange] = useState("month") // 'month' | '30d' | 'quarter' | 'ytd'

  // Mocked metrics from cargoes
  const metrics = useMemo(() => {
    const totalProfit = cargoes.reduce((sum, c) => sum + (c.profit || 0), 0)
    const fixedCargoes = cargoes.filter((c) => c.status === "FIXED").length
    const totalCargoes = cargoes.length
    const successRate = totalCargoes > 0 ? Math.round((fixedCargoes / totalCargoes) * 100) : 0
    const avgProfit = totalCargoes > 0 ? Math.round(totalProfit / totalCargoes) : 0

    return {
      totalProfit,
      fixedCargoes,
      successRate,
      avgProfit,
    }
  }, [cargoes])

  const profitTrendData = [
    { month: "Jan", actual: 1.2, target: 1.5 },
    { month: "Feb", actual: 1.4, target: 1.6 },
    { month: "Mar", actual: 1.6, target: 1.8 },
    { month: "Apr", actual: 1.9, target: 2.0 },
    { month: "May", actual: 2.1, target: 2.2 },
    { month: "Jun", actual: 2.4, target: 2.4 },
    { month: "Jul", actual: 2.6, target: 2.6 },
    { month: "Aug", actual: 2.8, target: 2.8 },
    { month: "Sep", actual: 3.0, target: 3.0 },
    { month: "Oct", actual: 3.1, target: 3.0 },
    { month: "Nov", actual: 3.0, target: 3.0 },
    { month: "Dec", actual: 3.2, target: 3.0 },
  ]

  // Auth guard
  if (!currentUser || currentUser.role !== "CHARTERER") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/charterer" className="flex items-center gap-2">
              <span className="text-2xl">⚓</span>
              <span className="text-xl font-bold text-gray-900">Fuel Sense</span>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Performance Dashboard
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                <CalendarDays className="h-3 w-3" />
                Dec 2025
              </Badge>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Notifications />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md">
              <Building2 className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {currentUser.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Range filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Timeframe:</span>
            <div className="inline-flex gap-2">
              {[
                { id: "month", label: "This Month" },
                { id: "30d", label: "Last 30 Days" },
                { id: "quarter", label: "Last Quarter" },
                { id: "ytd", label: "YTD" },
              ].map((r) => (
                <Button
                  key={r.id}
                  variant={range === r.id ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => setRange(r.id)}
                >
                  {r.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Download className="h-3 w-3 mr-1" /> Export Report
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Mail className="h-3 w-3 mr-1" /> Email to Team
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <RefreshCw className="h-3 w-3 mr-1" /> Refresh
            </Button>
          </div>
        </div>

        {/* Key metrics row */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            label="Total Profit"
            value={`$${(metrics.totalProfit / 1_000_000).toFixed(1)}M`}
            sublabel="Across all fixed cargoes"
            trendLabel="+15% MoM"
            trendDirection="up"
            targetLabel="107% of target"
            status="good"
          />
          <MetricCard
            label="Cargoes Fixed"
            value={metrics.fixedCargoes || 12}
            sublabel="This period"
            trendLabel="+3 MoM"
            trendDirection="up"
            targetLabel="100% of target"
            status="good"
          />
          <MetricCard
            label="Success Rate"
            value={`${metrics.successRate || 89}%`}
            sublabel="Fixed vs evaluated"
            trendLabel="-2% MoM"
            trendDirection="down"
            targetLabel="99% of target"
            status="warn"
          />
          <MetricCard
            label="Avg Profit per Cargo"
            value={`$${(metrics.avgProfit / 1000 || 265).toFixed(0)}K`}
            sublabel="Blended across fleet"
            trendLabel="+12% MoM"
            trendDirection="up"
            targetLabel="103% of target"
            status="good"
          />
        </section>

        {/* Profit trend + bunker analysis */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProfitTrendChart data={profitTrendData} />
          </div>
          <BunkerCostPanel />
        </section>

        {/* Fleet utilization + top routes + AI insights */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <FleetUtilizationPanel />
          <TopRoutesTable />
          <AiPerformanceInsights />
        </section>
      </main>
    </div>
  )
}



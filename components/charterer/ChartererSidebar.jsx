"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { PendingTasks } from "@/components/PendingTasks"
import {
  BarChart3,
  List,
  CheckCircle2,
  TrendingUp,
  Filter,
  RotateCcw,
} from "lucide-react"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

/**
 * Charterer Sidebar - Left sidebar with navigation, tasks, stats, and filters
 * Takes 20% width, fixed position
 */
export function ChartererSidebar({ activeView, onViewChange, filters, onFiltersChange, cargoes }) {
  const { getPendingTasksByUser, currentUser } = useStore()
  const pathname = usePathname()
  const isPerformancePage = pathname === "/charterer/performance"
  
  // Initialize local state from props
  const [profitRange, setProfitRange] = useState([0, 500])
  const [riskLevels, setRiskLevels] = useState({
    low: filters.riskLevel === "all" || filters.riskLevel === "LOW",
    medium: filters.riskLevel === "all" || filters.riskLevel === "MEDIUM",
    high: filters.riskLevel === "all" || filters.riskLevel === "HIGH",
  })
  const [statuses, setStatuses] = useState({
    ready: filters.status === "all" || filters.status === "ready",
    fixed: filters.status === "fixed",
    rejected: filters.status === "rejected",
  })

  const tasks = currentUser ? getPendingTasksByUser(currentUser.role) : []
  const totalTaskCount = tasks.reduce((sum, task) => sum + (task.count || 1), 0)

  // Calculate stats
  const stats = {
    analyzedToday: cargoes?.length || 0,
    fixedThisMonth: cargoes?.filter(c => c.status === "FIXED").length || 0,
    avgProfit: cargoes?.length > 0
      ? Math.round(cargoes.reduce((sum, c) => sum + c.profit, 0) / cargoes.length / 1000)
      : 0,
    successRate: cargoes?.length > 0
      ? Math.round((cargoes.filter(c => c.status === "FIXED").length / cargoes.length) * 100)
      : 0,
  }

  // Update parent filters when local state changes
  const updateFilters = () => {
    const riskLevel = 
      riskLevels.low && riskLevels.medium && riskLevels.high ? "all" :
      riskLevels.low && !riskLevels.medium && !riskLevels.high ? "LOW" :
      !riskLevels.low && riskLevels.medium && !riskLevels.high ? "MEDIUM" :
      !riskLevels.low && !riskLevels.medium && riskLevels.high ? "HIGH" : "all"
    
    const status = 
      statuses.ready && !statuses.fixed && !statuses.rejected ? "ready" :
      !statuses.ready && statuses.fixed && !statuses.rejected ? "fixed" :
      !statuses.ready && !statuses.fixed && statuses.rejected ? "rejected" : "all"
    
    const profitRangeStr = profitRange[0] === 0 && profitRange[1] === 500 
      ? "all" 
      : `${profitRange[0]}-${profitRange[1]}`
    
    onFiltersChange({
      profitRange: profitRangeStr,
      riskLevel,
      bunkerAvailable: filters.bunkerAvailable || "all",
      status,
    })
  }

  const handleResetFilters = () => {
    setProfitRange([0, 500])
    setRiskLevels({ low: true, medium: true, high: true })
    setStatuses({ ready: true, fixed: false, rejected: false })
    onFiltersChange({
      profitRange: "all",
      riskLevel: "all",
      bunkerAvailable: "all",
      status: "all",
    })
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
      {/* Navigation */}
      <nav className="p-4 space-y-1 border-b">
        <Button
          variant={!isPerformancePage && activeView === "dashboard" ? "default" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link href="/charterer">
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
        </Button>
        <Button
          variant={!isPerformancePage && activeView === "all-cargoes" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => !isPerformancePage && onViewChange("all-cargoes")}
        >
          <List className="h-4 w-4 mr-2" />
          All Cargoes
        </Button>
        <Button
          variant={!isPerformancePage && activeView === "fixed" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => !isPerformancePage && onViewChange("fixed")}
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Fixed Cargoes
        </Button>
        <Button
          variant={isPerformancePage ? "default" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link href="/charterer/performance">
            <TrendingUp className="h-4 w-4 mr-2" />
            Performance
          </Link>
        </Button>
      </nav>

      {/* Pending Tasks */}
      <div className="p-4 border-b">
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <span className="text-warning">⚠️</span>
                PENDING
              </CardTitle>
              {totalTaskCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {totalTaskCount}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {totalTaskCount > 0 ? (
              <>
                <div className="text-xs space-y-1">
                  {tasks.slice(0, 2).map((task) => (
                    <div key={task.id} className="flex items-start gap-2">
                      <span className={cn(
                        task.priority === "URGENT" && "text-danger",
                        task.priority === "HIGH" && "text-warning"
                      )}>
                        {task.priority === "URGENT" ? "🔴" : "🟡"}
                      </span>
                      <span className="text-gray-700">{task.title}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  View All Tasks
                </Button>
              </>
            ) : (
              <p className="text-xs text-gray-500">All caught up! No pending tasks</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-b space-y-3">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          Quick Stats
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Analyzed Today:</span>
            <span className="font-medium">{stats.analyzedToday}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Fixed This Month:</span>
            <span className="font-medium">{stats.fixedThisMonth}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Avg Profit:</span>
            <span className="font-medium text-success">${stats.avgProfit}K</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Success Rate:</span>
            <span className="font-medium">{stats.successRate}%</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
            <Filter className="h-3 w-3" />
            Filters
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={handleResetFilters}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>

        <div className="space-y-4">
          {/* Profit Range Slider */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">
              Profit Range: ${profitRange[0]}K - ${profitRange[1]}K
            </label>
            <Slider
              value={profitRange}
              onValueChange={(value) => {
                setProfitRange(value)
                setTimeout(updateFilters, 0)
              }}
              min={0}
              max={500}
              step={10}
              className="w-full"
            />
          </div>

          {/* Risk Level Checkboxes */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">
              Risk Level
            </label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
              <Checkbox
                id="risk-low"
                checked={riskLevels.low}
                onCheckedChange={(checked) => {
                  setRiskLevels({ ...riskLevels, low: checked })
                  setTimeout(updateFilters, 0)
                }}
              />
                <label
                  htmlFor="risk-low"
                  className="text-xs text-gray-700 cursor-pointer"
                >
                  Low
                </label>
              </div>
              <div className="flex items-center space-x-2">
              <Checkbox
                id="risk-medium"
                checked={riskLevels.medium}
                onCheckedChange={(checked) => {
                  setRiskLevels({ ...riskLevels, medium: checked })
                  setTimeout(updateFilters, 0)
                }}
              />
                <label
                  htmlFor="risk-medium"
                  className="text-xs text-gray-700 cursor-pointer"
                >
                  Medium
                </label>
              </div>
              <div className="flex items-center space-x-2">
              <Checkbox
                id="risk-high"
                checked={riskLevels.high}
                onCheckedChange={(checked) => {
                  setRiskLevels({ ...riskLevels, high: checked })
                  setTimeout(updateFilters, 0)
                }}
              />
                <label
                  htmlFor="risk-high"
                  className="text-xs text-gray-700 cursor-pointer"
                >
                  High
                </label>
              </div>
            </div>
          </div>

          {/* Status Checkboxes */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">
              Status
            </label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
              <Checkbox
                id="status-ready"
                checked={statuses.ready}
                onCheckedChange={(checked) => {
                  setStatuses({ ...statuses, ready: checked })
                  setTimeout(updateFilters, 0)
                }}
              />
                <label
                  htmlFor="status-ready"
                  className="text-xs text-gray-700 cursor-pointer"
                >
                  Ready
                </label>
              </div>
              <div className="flex items-center space-x-2">
              <Checkbox
                id="status-fixed"
                checked={statuses.fixed}
                onCheckedChange={(checked) => {
                  setStatuses({ ...statuses, fixed: checked })
                  setTimeout(updateFilters, 0)
                }}
              />
                <label
                  htmlFor="status-fixed"
                  className="text-xs text-gray-700 cursor-pointer"
                >
                  Fixed
                </label>
              </div>
              <div className="flex items-center space-x-2">
              <Checkbox
                id="status-rejected"
                checked={statuses.rejected}
                onCheckedChange={(checked) => {
                  setStatuses({ ...statuses, rejected: checked })
                  setTimeout(updateFilters, 0)
                }}
              />
                <label
                  htmlFor="status-rejected"
                  className="text-xs text-gray-700 cursor-pointer"
                >
                  Rejected
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}


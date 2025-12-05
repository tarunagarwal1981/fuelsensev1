"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PendingTasks } from "@/components/PendingTasks"
import {
  LayoutDashboard,
  Ship,
  Wrench,
  ShieldCheck,
  DollarSign,
  Filter,
  RotateCcw,
} from "lucide-react"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

/**
 * Vessel Manager Sidebar - Left sidebar with navigation, tasks, and quick stats
 * Takes 20% width, fixed position
 */
export function VesselManagerSidebar({ activeTab, onTabChange }) {
  const { getPendingTasksByUser, currentUser, vessels } = useStore()
  const pathname = usePathname()

  const tasks = currentUser ? getPendingTasksByUser("VESSEL_MANAGER") : []
  const totalTaskCount = tasks.reduce((sum, task) => sum + (task.count || 1), 0)

  // Calculate fleet stats
  const fleetStats = {
    total: vessels.length,
    critical: vessels.filter((v) => {
      // Mock logic - in real app, this would check vessel status
      return v.name === "MV Ocean Star"
    }).length,
    attention: 3,
    healthy: vessels.length - 4,
  }

  const navItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      href: "#overview",
    },
    {
      id: "vessels",
      label: "Vessels",
      icon: Ship,
      href: "#vessels",
    },
    {
      id: "maintenance",
      label: "Maintenance",
      icon: Wrench,
      href: "#maintenance",
    },
    {
      id: "compliance",
      label: "Compliance",
      icon: ShieldCheck,
      href: "#compliance",
    },
    {
      id: "costs",
      label: "Costs",
      icon: DollarSign,
      href: "#costs",
    },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
      {/* Navigation */}
      <nav className="p-4 space-y-1 border-b">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      {/* Pending Tasks */}
      <div className="p-4 border-b">
        <PendingTasks userRole="VESSEL_MANAGER" />
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-b">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Fleet Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Vessels</span>
              <Badge variant="secondary">{fleetStats.total}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Critical</span>
              <Badge variant="destructive">{fleetStats.critical}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Attention</span>
              <Badge className="bg-yellow-600">{fleetStats.attention}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Healthy</span>
              <Badge className="bg-green-600">{fleetStats.healthy}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Filter className="h-4 w-4 mr-2" />
              Filter Vessels
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <RotateCcw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}


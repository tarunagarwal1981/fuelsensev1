"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VesselCard } from "./VesselCard"
import { VesselDetailView } from "./VesselDetailView"
import { useStore } from "@/lib/store"
import { getVesselManagerData } from "@/lib/mock-data"

export function VesselsTab() {
  const { vessels } = useStore()
  const [selectedVessel, setSelectedVessel] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [performanceFilter, setPerformanceFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("performance")

  // Get enhanced vessel data with manager-specific details
  const vesselData = useMemo(() => {
    return vessels.map((vessel) => {
      const managerData = getVesselManagerData(vessel.imo)
      return {
        ...vessel,
        ...managerData,
      }
    })
  }, [vessels])

  // Filter and sort vessels
  const filteredVessels = useMemo(() => {
    let filtered = vesselData

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((v) => v.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Performance filter
    if (performanceFilter !== "all") {
      if (performanceFilter === "excellent") {
        filtered = filtered.filter((v) => (v.performanceScore || 0) >= 90)
      } else if (performanceFilter === "good") {
        filtered = filtered.filter((v) => {
          const score = v.performanceScore || 0
          return score >= 75 && score < 90
        })
      } else if (performanceFilter === "poor") {
        filtered = filtered.filter((v) => (v.performanceScore || 0) < 75)
      }
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((v) => {
        const status = v.status || "HEALTHY"
        return status.toLowerCase().includes(statusFilter.toLowerCase())
      })
    }

    // Sort
    if (sortBy === "performance") {
      filtered = [...filtered].sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0))
    } else if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "consumption") {
      filtered = [...filtered].sort((a, b) => {
        const aCons = a.metrics?.consumptionEfficiency?.actual || 0
        const bCons = b.metrics?.consumptionEfficiency?.actual || 0
        return bCons - aCons
      })
    }

    return filtered
  }, [vesselData, searchQuery, performanceFilter, statusFilter, sortBy])

  if (selectedVessel) {
    return <VesselDetailView vessel={selectedVessel} onBack={() => setSelectedVessel(null)} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">VESSELS - Fleet Overview & Individual Analysis</h2>
        <p className="text-gray-600">Drill down into individual vessel performance and make vessel-specific decisions</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Search</label>
            <Input
              placeholder="Vessel name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Performance</label>
            <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vessels</SelectItem>
                <SelectItem value="excellent">Excellent (90+)</SelectItem>
                <SelectItem value="good">Good (75-89)</SelectItem>
                <SelectItem value="poor">Poor (&lt;75)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="attention">Attention Needed</SelectItem>
                <SelectItem value="healthy">Healthy</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="performance">Performance Score</SelectItem>
                <SelectItem value="name">Vessel Name</SelectItem>
                <SelectItem value="consumption">Consumption</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Vessel Grid */}
      <div className="space-y-4">
        {filteredVessels.length === 0 ? (
          <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
            <p className="text-gray-500">No vessels found matching your filters.</p>
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-600 mb-2">
              Showing {filteredVessels.length} vessel{filteredVessels.length !== 1 ? "s" : ""}
            </div>
            <div className="space-y-4">
              {filteredVessels.map((vessel) => (
                <VesselCard key={vessel.imo} vessel={vessel} onClick={() => setSelectedVessel(vessel)} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

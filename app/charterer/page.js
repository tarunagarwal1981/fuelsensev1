"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Notifications } from "@/components/Notifications"
import { useStore } from "@/lib/store"
import { Building2, RefreshCw, Zap } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { simulateAIAnalysis } from "@/lib/simulator"
import { cn } from "@/lib/utils"

// Charterer-specific components
import { FeaturedCargoCard } from "@/components/charterer/FeaturedCargoCard"
import { OtherCargoesList } from "@/components/charterer/OtherCargoesList"
import { ChartererSidebar } from "@/components/charterer/ChartererSidebar"
import { FixCargoDialog } from "@/components/charterer/FixCargoDialog"
import { CargoDetailsPanel } from "@/components/charterer/CargoDetailsPanel"
import { AskAIModal } from "@/components/charterer/AskAIModal"
import { AllCargoesTable } from "@/components/charterer/AllCargoesTable"
import { CompareCargoesModal } from "@/components/charterer/CompareCargoesModal"

export default function ChartererPage() {
  const router = useRouter()
  const {
    currentUser,
    cargoes,
    fixCargo,
    updateCargoStatus,
  } = useStore()

  const [activeView, setActiveView] = useState("dashboard")
  const [filters, setFilters] = useState({
    profitRange: "all",
    riskLevel: "all",
    bunkerAvailable: "all",
    status: "all",
  })
  const [selectedCargo, setSelectedCargo] = useState(null)
  const [isFixDialogOpen, setIsFixDialogOpen] = useState(false)
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false)
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false)
  const [cargoesToCompare, setCargoesToCompare] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Redirect if not authorized
  useEffect(() => {
    if (!currentUser || currentUser.role !== "CHARTERER") {
      router.push("/")
    }
  }, [currentUser, router])

  // Filter cargoes based on filters
  const filteredCargoes = useMemo(() => {
    let filtered = cargoes

    if (filters.profitRange !== "all") {
      const [min, max] = filters.profitRange.split("-").map(Number)
      if (filters.profitRange === "300+") {
        filtered = filtered.filter((c) => c.profit >= 300000)
      } else {
        filtered = filtered.filter(
          (c) => c.profit >= min * 1000 && c.profit <= max * 1000
        )
      }
    }

    if (filters.riskLevel !== "all") {
      filtered = filtered.filter((c) => c.risk === filters.riskLevel)
    }

    if (filters.bunkerAvailable !== "all") {
      filtered = filtered.filter(
        (c) =>
          (filters.bunkerAvailable === "yes" && c.viable) ||
          (filters.bunkerAvailable === "no" && !c.viable)
      )
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((c) => {
        if (filters.status === "ready") return c.status === "READY_FOR_DECISION"
        if (filters.status === "fixed") return c.status === "FIXED"
        if (filters.status === "rejected") return c.status === "REJECTED"
        return true
      })
    }

    return filtered
  }, [cargoes, filters])

  // Get best cargo (featured)
  const featuredCargo = useMemo(() => {
    const viable = filteredCargoes.filter(
      (c) => c.viable && c.status === "READY_FOR_DECISION"
    )
    if (viable.length === 0) return null
    return viable.sort((a, b) => b.profit - a.profit)[0]
  }, [filteredCargoes])

  // Get other cargoes (excluding featured)
  const otherCargoes = useMemo(() => {
    return filteredCargoes
      .filter((c) => c.id !== featuredCargo?.id)
      .slice(0, 3)
  }, [filteredCargoes, featuredCargo])

  // Get ready cargoes count
  const readyCount = useMemo(() => {
    return filteredCargoes.filter(
      (c) => c.status === "READY_FOR_DECISION" && c.viable
    ).length
  }, [filteredCargoes])

  // Don't render if not authorized
  if (!currentUser || currentUser.role !== "CHARTERER") {
    return null
  }

  // Handlers
  const handleFixCargo = (cargo) => {
    setSelectedCargo(cargo)
    setIsFixDialogOpen(true)
  }

  const handleConfirmFix = (cargo) => {
    fixCargo(cargo.id)
    toast.success("✅ Cargo fixed!", {
      description: "Notification sent to operator",
    })
    // Show success animation (confetti could be added here)
  }

  const handleViewDetails = (cargo) => {
    setSelectedCargo(cargo)
    setIsDetailsPanelOpen(true)
  }

  const handleAskAI = (cargo) => {
    setSelectedCargo(cargo)
    setIsAIModalOpen(true)
  }

  const handleSkip = (cargo) => {
    // Move to next cargo (featured will update automatically)
    toast.info("Skipped", {
      description: "Next cargo will be shown",
    })
  }

  const handleCompare = (selectedCargoes) => {
    setCargoesToCompare(selectedCargoes)
    setIsCompareModalOpen(true)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await simulateAIAnalysis(filteredCargoes.map((c) => c.id))
    setTimeout(() => {
      setIsRefreshing(false)
      toast.success("Analysis refreshed", {
        description: "All cargoes have been re-analyzed",
      })
    }, 2600)
  }

  // Get personalized greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">⚓</span>
              <span className="text-xl font-bold text-gray-900">Fuel Sense</span>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-lg font-semibold text-gray-900">
              Charterer Dashboard
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

      <div className="flex">
        {/* Sidebar (20%) */}
        <ChartererSidebar
          activeView={activeView}
          onViewChange={setActiveView}
          filters={filters}
          onFiltersChange={setFilters}
          cargoes={filteredCargoes}
        />

        {/* Main Content (80%) */}
        <main className="flex-1 p-6">
          {activeView === "dashboard" && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {getGreeting()}, {currentUser.name.split(" ")[0]}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {readyCount} cargo{readyCount !== 1 ? "es" : ""} analyzed and ready for your decision
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    <RefreshCw
                      className={cn(
                        "h-4 w-4 mr-2",
                        isRefreshing && "animate-spin"
                      )}
                    />
                    Refresh Analysis
                  </Button>
                  <Button variant="outline" size="sm">
                    Compare All
                  </Button>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-12 gap-6">
                {/* Featured Cargo (70% - spans 8 columns) */}
                <div className="col-span-12 lg:col-span-8">
                  {featuredCargo ? (
                    <FeaturedCargoCard
                      cargo={featuredCargo}
                      onFix={handleFixCargo}
                      onViewDetails={handleViewDetails}
                      onAskAI={handleAskAI}
                      onSkip={handleSkip}
                    />
                  ) : (
                    <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                      <p className="text-gray-500">No featured cargo available</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Adjust filters or wait for new analyses
                      </p>
                    </div>
                  )}
                </div>

                {/* Other Cargoes (30% - spans 4 columns) */}
                <div className="col-span-12 lg:col-span-4">
                  <OtherCargoesList
                    cargoes={otherCargoes}
                    onSelect={handleViewDetails}
                    onFix={handleFixCargo}
                  />
                </div>
              </div>
            </div>
          )}

          {activeView === "all-cargoes" && (
            <AllCargoesTable
              cargoes={filteredCargoes}
              onViewDetails={handleViewDetails}
              onFix={handleFixCargo}
              onCompare={handleCompare}
            />
          )}

          {activeView === "fixed" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Fixed Cargoes</h2>
              <AllCargoesTable
                cargoes={filteredCargoes.filter((c) => c.status === "FIXED")}
                onViewDetails={handleViewDetails}
                onFix={handleFixCargo}
                onCompare={handleCompare}
              />
            </div>
          )}

          {activeView === "performance" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Performance</h2>
              <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
                <p>Performance analytics coming soon</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals and Panels */}
      <FixCargoDialog
        open={isFixDialogOpen}
        onOpenChange={setIsFixDialogOpen}
        cargo={selectedCargo}
        onConfirm={handleConfirmFix}
      />

      <CargoDetailsPanel
        open={isDetailsPanelOpen}
        onOpenChange={setIsDetailsPanelOpen}
        cargo={selectedCargo}
      />

      <AskAIModal
        open={isAIModalOpen}
        onOpenChange={setIsAIModalOpen}
        cargo={selectedCargo}
      />

      <CompareCargoesModal
        open={isCompareModalOpen}
        onOpenChange={setIsCompareModalOpen}
        cargoes={cargoesToCompare}
        onFixBest={handleConfirmFix}
      />
    </div>
  )
}

"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Notifications } from "@/components/Notifications"
import { PendingTasks } from "@/components/PendingTasks"
import { AIExplainer } from "@/components/AIExplainer"
import { useStore } from "@/lib/store"
import {
  Building2,
  List,
  BarChart3,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MapPin,
  Ship,
  Calendar,
  Zap,
  Filter,
  Download,
  ArrowRight,
  X,
  Loader2,
} from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { simulateAIAnalysis } from "@/lib/simulator"

export default function ChartererPage() {
  const router = useRouter()
  const {
    currentUser,
    cargoes,
    selectedCargo,
    setSelectedCargo,
    fixCargo,
    updateCargoStatus,
    requestAlternative,
    getBunkerPlansByCargo,
    getAIOutputsByCargo,
  } = useStore()

  const [activeTab, setActiveTab] = useState("overview")
  const [selectedCargoDetail, setSelectedCargoDetail] = useState(null)
  const [isFixDialogOpen, setIsFixDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [isRequestingAlternative, setIsRequestingAlternative] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [filters, setFilters] = useState({
    profitRange: "all",
    riskLevel: "all",
    bunkerAvailable: "all",
    route: "all",
  })

  // Filter cargoes based on filters
  const filteredCargoes = useMemo(() => {
    return cargoes.filter((cargo) => {
      if (filters.profitRange !== "all") {
        const [min, max] = filters.profitRange.split("-").map(Number)
        if (filters.profitRange === "300+") {
          if (cargo.profit < 300000) return false
        } else if (cargo.profit < min * 1000 || cargo.profit > max * 1000) {
          return false
        }
      }
      if (filters.riskLevel !== "all" && cargo.risk !== filters.riskLevel) {
        return false
      }
      if (
        filters.bunkerAvailable !== "all" &&
        ((filters.bunkerAvailable === "yes" && !cargo.viable) ||
          (filters.bunkerAvailable === "no" && cargo.viable))
      ) {
        return false
      }
      if (filters.route !== "all") {
        const route = `${cargo.loadPort}-${cargo.dischargePort}`.toLowerCase()
        if (!route.includes(filters.route.toLowerCase())) return false
      }
      return true
    })
  }, [cargoes, filters])

  // Get best cargo (highest profit, viable, ready for decision)
  const bestCargo = useMemo(() => {
    return filteredCargoes
      .filter((c) => c.viable && c.status === "READY_FOR_DECISION")
      .sort((a, b) => b.profit - a.profit)[0]
  }, [filteredCargoes])

  // Get other cargoes (excluding best)
  const otherCargoes = useMemo(() => {
    return filteredCargoes.filter((c) => c.id !== bestCargo?.id)
  }, [filteredCargoes, bestCargo])

  // Calculate stats
  const stats = useMemo(() => {
    const viable = filteredCargoes.filter((c) => c.viable).length
    const ready = filteredCargoes.filter(
      (c) => c.status === "READY_FOR_DECISION"
    ).length
    const avgProfit =
      filteredCargoes.reduce((sum, c) => sum + c.profit, 0) /
      filteredCargoes.length || 0
    const avgConfidence =
      filteredCargoes.reduce((sum, c) => sum + c.confidence, 0) /
      filteredCargoes.length || 0

    return {
      total: filteredCargoes.length,
      viable,
      ready,
      avgProfit: Math.round(avgProfit / 1000),
      avgConfidence: Math.round(avgConfidence),
    }
  }, [filteredCargoes])

  // Don't render if not authorized
  if (!currentUser || currentUser.role !== "CHARTERER") {
    return null
  }

  const handleFixCargo = () => {
    if (!selectedCargoDetail) return
    fixCargo(selectedCargoDetail.id)
    setIsFixDialogOpen(false)
    setSelectedCargoDetail(null)
    toast.success("Cargo fixed successfully!", {
      description: "Notification sent to operator",
    })
  }

  const handleRejectCargo = () => {
    if (!selectedCargoDetail || !rejectReason.trim()) return
    updateCargoStatus(selectedCargoDetail.id, "REJECTED")
    setIsRejectDialogOpen(false)
    setRejectReason("")
    setSelectedCargoDetail(null)
    toast.success("Cargo rejected", {
      description: rejectReason,
    })
  }

  const handleRequestAlternative = async () => {
    if (!selectedCargoDetail) return
    setIsRequestingAlternative(true)
    try {
      requestAlternative(selectedCargoDetail.id)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast.success("Alternative bunker plan requested", {
        description: "AI is analyzing alternatives...",
      })
    } catch (error) {
      toast.error("Failed to request alternative")
    } finally {
      setIsRequestingAlternative(false)
    }
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case "LOW":
        return "bg-success text-white"
      case "MEDIUM":
        return "bg-warning text-white"
      case "HIGH":
        return "bg-danger text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      READY_FOR_DECISION: "bg-primary-600 text-white",
      PENDING_ANALYSIS: "bg-warning text-white",
      FIXED: "bg-success text-white",
      REJECTED: "bg-danger text-white",
    }
    return variants[status] || "bg-gray-500 text-white"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
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
        {/* Left Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-1">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={activeTab === "cargo-list" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("cargo-list")}
            >
              <List className="h-4 w-4 mr-2" />
              Cargo List
            </Button>
            <Button
              variant={activeTab === "analytics" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("analytics")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </nav>
          <div className="px-4 pt-4">
            <PendingTasks />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="cargo-list">Cargo List</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-12 gap-6">
                {/* Left Column - Stats & Filters (25%) */}
                <div className="col-span-12 lg:col-span-3 space-y-4">
                  {/* Quick Stats */}
                  <div className="space-y-3">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Cargoes Analyzed
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-gray-900">
                          {stats.total}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Ready for Decision
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-primary-600">
                          {stats.ready}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Average Profit
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-success">
                          ${stats.avgProfit}K
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Avg Confidence
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-warning">
                          {stats.avgConfidence}%
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Filters */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">
                          Profit Range
                        </label>
                        <Select
                          value={filters.profitRange}
                          onValueChange={(value) =>
                            setFilters({ ...filters, profitRange: value })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="0-200">$0K - $200K</SelectItem>
                            <SelectItem value="200-300">$200K - $300K</SelectItem>
                            <SelectItem value="300+">$300K+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">
                          Risk Level
                        </label>
                        <Select
                          value={filters.riskLevel}
                          onValueChange={(value) =>
                            setFilters({ ...filters, riskLevel: value })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">
                          Bunker Available
                        </label>
                        <Select
                          value={filters.bunkerAvailable}
                          onValueChange={(value) =>
                            setFilters({ ...filters, bunkerAvailable: value })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    className="w-full mt-2"
                    variant="outline"
                    disabled={isAnalyzing}
                    onClick={() => {
                      setIsAnalyzing(true)
                      simulateAIAnalysis(filteredCargoes.map((c) => c.id))
                      setTimeout(() => setIsAnalyzing(false), 2600)
                    }}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing cargoes...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Analyze Cargoes with AI
                      </>
                    )}
                  </Button>
                </div>

                {/* Middle Column - Featured Cargo (50%) */}
                <div className="col-span-12 lg:col-span-6 space-y-4">
                  {bestCargo ? (
                    <>
                      <Card className="border-2 border-primary-200 bg-gradient-to-br from-blue-50 to-white shadow-lg">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-2xl mb-2">
                                {bestCargo.loadPort} → {bestCargo.dischargePort}
                              </CardTitle>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {bestCargo.distance} nm
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {bestCargo.duration} days
                                </span>
                                <span className="flex items-center gap-1">
                                  <Ship className="h-4 w-4" />
                                  {bestCargo.vessel}
                                </span>
                              </div>
                            </div>
                            <Badge className={getRiskColor(bestCargo.risk)}>
                              {bestCargo.risk} Risk
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-success">
                              ${(bestCargo.profit / 1000).toFixed(0)}K
                            </span>
                            <span className="text-sm text-gray-600">profit</span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Bunker Cost:</span>
                              <span className="ml-2 font-medium">
                                ${(bestCargo.bunkerCost / 1000).toFixed(0)}K
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Confidence:</span>
                              <span className="ml-2 font-medium">
                                {bestCargo.confidence}%
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-md">
                            <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                            <span className="text-sm text-gray-700">
                              Bunker available at {bestCargo.bunkerPorts[0]?.name}
                            </span>
                          </div>

                          <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              AI Summary
                            </p>
                            <p className="text-xs text-gray-700">
                              Best option - highest profit, low risk, bunker available
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              className="flex-1 bg-primary-600 hover:bg-primary-700"
                              size="lg"
                              onClick={() => {
                                setSelectedCargoDetail(bestCargo)
                                setIsFixDialogOpen(true)
                              }}
                            >
                              Fix This Cargo
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setSelectedCargoDetail(bestCargo)}
                            >
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedCargoDetail(bestCargo)
                                // Scroll to AI panel
                              }}
                            >
                              Ask AI Why
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Other Cargoes */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-700">
                          Other Cargoes
                        </h3>
                        {otherCargoes.map((cargo) => (
                          <Card
                            key={cargo.id}
                            className="hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedCargoDetail(cargo)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium">
                                      {cargo.loadPort} → {cargo.dischargePort}
                                    </h4>
                                    <Badge className={getRiskColor(cargo.risk)}>
                                      {cargo.risk}
                                    </Badge>
                                    {cargo.viable ? (
                                      <CheckCircle2 className="h-4 w-4 text-success" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-danger" />
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-gray-600">
                                    <span>${(cargo.profit / 1000).toFixed(0)}K</span>
                                    <span>{cargo.confidence}% confidence</span>
                                    <span>{cargo.status}</span>
                                  </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-gray-400" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <p className="text-gray-500">No cargoes available</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Right Column - AI Analysis (25%) */}
                <div className="col-span-12 lg:col-span-3 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary-600" />
                        AI Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Agent Status</span>
                          <Badge variant="secondary" className="text-xs">
                            All Completed
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          All analyses completed in &lt;30s
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-gray-700">
                          Key Insights
                        </h4>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p>
                            {stats.viable} viable cargoes,{" "}
                            {stats.total - stats.viable} rejected (no bunker)
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-gray-700">
                          Recommendations
                        </h4>
                        <div className="space-y-1 text-xs">
                          {bestCargo && (
                            <div className="p-2 bg-green-50 rounded border border-green-200">
                              <div className="font-medium text-gray-900">
                                {bestCargo.loadPort} → {bestCargo.dischargePort}
                              </div>
                              <div className="text-gray-600">
                                Highest profit, low risk
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-xs text-gray-600">
                        <div>3 cargoes analyzed</div>
                        <div>1 bunker plan created</div>
                        <div>AI analysis completed</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Cargo List Tab */}
            <TabsContent value="cargo-list">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>All Cargoes</CardTitle>
                      <CardDescription>
                        Manage and compare all cargo opportunities
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Route</TableHead>
                          <TableHead>Profit</TableHead>
                          <TableHead>Bunker Cost</TableHead>
                          <TableHead>Risk</TableHead>
                          <TableHead>Confidence</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCargoes.map((cargo) => (
                          <TableRow key={cargo.id}>
                            <TableCell className="font-medium">
                              {cargo.loadPort} → {cargo.dischargePort}
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold text-success">
                                ${(cargo.profit / 1000).toFixed(0)}K
                              </span>
                            </TableCell>
                            <TableCell>
                              ${(cargo.bunkerCost / 1000).toFixed(0)}K
                            </TableCell>
                            <TableCell>
                              <Badge className={getRiskColor(cargo.risk)}>
                                {cargo.risk}
                              </Badge>
                            </TableCell>
                            <TableCell>{cargo.confidence}%</TableCell>
                            <TableCell>
                              <Badge className={getStatusBadge(cargo.status)}>
                                {cargo.status.replace(/_/g, " ")}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedCargoDetail(cargo)}
                                >
                                  View
                                </Button>
                                {cargo.status === "READY_FOR_DECISION" && (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedCargoDetail(cargo)
                                      setIsFixDialogOpen(true)
                                    }}
                                  >
                                    Fix
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>
                    Performance metrics and insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Analytics coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Fix Cargo Dialog */}
      <Dialog open={isFixDialogOpen} onOpenChange={setIsFixDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fix Cargo</DialogTitle>
            <DialogDescription>
              Are you sure you want to fix this cargo? This will send a
              notification to the operator.
            </DialogDescription>
          </DialogHeader>
          {selectedCargoDetail && (
            <div className="space-y-2 py-4">
              <div className="text-sm">
                <span className="font-medium">Route:</span>{" "}
                {selectedCargoDetail.loadPort} →{" "}
                {selectedCargoDetail.dischargePort}
              </div>
              <div className="text-sm">
                <span className="font-medium">Profit:</span> $
                {(selectedCargoDetail.profit / 1000).toFixed(0)}K
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFixDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleFixCargo}>Confirm Fix</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Cargo Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Cargo</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this cargo.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRejectDialogOpen(false)
                setRejectReason("")
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectCargo}
              disabled={!rejectReason.trim()}
              variant="destructive"
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cargo Detail Modal */}
      {selectedCargoDetail && !isFixDialogOpen && !isRejectDialogOpen && (
        <Dialog
          open={!!selectedCargoDetail}
          onOpenChange={() => setSelectedCargoDetail(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedCargoDetail.loadPort} →{" "}
                {selectedCargoDetail.dischargePort}
              </DialogTitle>
              <DialogDescription>
                Detailed cargo analysis and bunker planning
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Voyage Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Voyage Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Distance:</span>
                      <div className="font-medium">
                        {selectedCargoDetail.distance} nm
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <div className="font-medium">
                        {selectedCargoDetail.duration} days
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Vessel:</span>
                      <div className="font-medium">
                        {selectedCargoDetail.vessel}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profitability Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Profitability Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Freight (Revenue)</TableCell>
                        <TableCell className="text-right font-medium">
                          ${(selectedCargoDetail.freight / 1000).toFixed(0)}K
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Bunker Cost</TableCell>
                        <TableCell className="text-right">
                          -${(selectedCargoDetail.bunkerCost / 1000).toFixed(0)}K
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Port Costs</TableCell>
                        <TableCell className="text-right">
                          -${(selectedCargoDetail.portCosts / 1000).toFixed(0)}K
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Other Costs</TableCell>
                        <TableCell className="text-right">
                          -${(selectedCargoDetail.otherCosts / 1000).toFixed(0)}K
                        </TableCell>
                      </TableRow>
                      <TableRow className="font-semibold">
                        <TableCell>Net Profit</TableCell>
                        <TableCell className="text-right text-success">
                          ${(selectedCargoDetail.profit / 1000).toFixed(0)}K
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* AI Explainer */}
              <AIExplainer
                bunkerPlan={getBunkerPlansByCargo(selectedCargoDetail.id)[0]}
                cargoId={selectedCargoDetail.id}
              />

              {/* Bunker Plan Details */}
              {selectedCargoDetail.bunkerPorts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Bunker Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedCargoDetail.bunkerPorts.map((port, idx) => (
                        <div
                          key={idx}
                          className="p-3 border rounded-md bg-gray-50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{port.name}</span>
                            <Badge>${port.price}/MT</Badge>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div>Quantity: {port.quantity} MT</div>
                            <div>Supplier: {port.supplier}</div>
                            <div>Reliability: {port.reliability}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => {
                    setIsFixDialogOpen(true)
                  }}
                >
                  Fix Cargo
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRequestAlternative}
                  disabled={isRequestingAlternative}
                >
                  {isRequestingAlternative ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Requesting...
                    </>
                  ) : (
                    "Request Alternative"
                  )}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setIsRejectDialogOpen(true)}
                >
                  Reject
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

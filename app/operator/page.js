"use client"

import { useState, useMemo, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Notifications } from "@/components/Notifications"
import { AIExplainer } from "@/components/AIExplainer"
import { Skeleton } from "@/components/ui/skeleton"
import { useStore } from "@/lib/store"
import {
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MapPin,
  Ship,
  Calendar,
  TrendingUp,
  DollarSign,
  Zap,
  ChevronDown,
  ChevronUp,
  Download,
  Edit,
  HelpCircle,
  Clock,
  Activity,
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { simulateVoyageProgress } from "@/lib/simulator"

export default function OperatorPage() {
  const router = useRouter()
  const {
    currentUser,
    bunkerPlans,
    vessels,
    cargoes,
    updateBunkerPlanStatus,
    getCargoById,
    getBunkerPlansByCargo,
    getAIOutputsByCargo,
  } = useStore()

  const [activeTab, setActiveTab] = useState("approval")
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [expandedAlternatives, setExpandedAlternatives] = useState(new Set())
  const [expandedAI, setExpandedAI] = useState(new Set())
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [approvalNote, setApprovalNote] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false)
  const [isMonitoringLoading, setIsMonitoringLoading] = useState(true)

  // Get pending approvals
  const pendingPlans = useMemo(() => {
    return bunkerPlans.filter((plan) => plan.status === "PENDING_APPROVAL")
  }, [bunkerPlans])

  // Get recently approved
  const approvedPlans = useMemo(() => {
    return bunkerPlans
      .filter((plan) => plan.status === "APPROVED")
      .sort(
        (a, b) =>
          new Date(b.approvedAt || 0) - new Date(a.approvedAt || 0)
      )
      .slice(0, 5)
  }, [bunkerPlans])

  // Get active voyages
  const activeVoyages = useMemo(() => {
    return vessels.filter((v) => v.status === "ON_VOYAGE" || v.status === "BUNKERING")
  }, [vessels])

  const handleApprove = () => {
    if (!selectedPlan) return
    updateBunkerPlanStatus(
      selectedPlan.id,
      "APPROVED",
      `${currentUser.name} (Operator)`,
      null
    )
    setIsApproveDialogOpen(false)
    setApprovalNote("")
    setSelectedPlan(null)
    toast.success("Bunker plan approved", {
      description: "Notification sent to charterer and vessel",
    })
  }

  const handleReject = () => {
    if (!selectedPlan || !rejectReason.trim()) return
    updateBunkerPlanStatus(
      selectedPlan.id,
      "REJECTED",
      null,
      rejectReason
    )
    setIsRejectDialogOpen(false)
    setRejectReason("")
    setSelectedPlan(null)
    toast.success("Bunker plan rejected", {
      description: "Alternative requested from AI",
    })
  }

  const toggleAlternatives = (planId) => {
    const newSet = new Set(expandedAlternatives)
    if (newSet.has(planId)) {
      newSet.delete(planId)
    } else {
      newSet.add(planId)
    }
    setExpandedAlternatives(newSet)
  }

  const toggleAI = (planId) => {
    const newSet = new Set(expandedAI)
    if (newSet.has(planId)) {
      newSet.delete(planId)
    } else {
      newSet.add(planId)
    }
    setExpandedAI(newSet)
  }

  const getROBStatus = (vessel) => {
    const vlsfo = vessel.currentROB.VLSFO
    if (vlsfo < 200) return { status: "ALERT", color: "text-danger", icon: "🔴" }
    if (vlsfo < 400) return { status: "WATCH", color: "text-warning", icon: "🟡" }
    return { status: "ON_TRACK", color: "text-success", icon: "🟢" }
  }

  // Analytics data
  const savingsData = [
    { month: "Jan", savings: 2.1 },
    { month: "Feb", savings: 2.5 },
    { month: "Mar", savings: 3.2 },
    { month: "Apr", savings: 3.5 },
    { month: "May", savings: 3.8 },
    { month: "Jun", savings: 3.8 },
  ]

  const vesselSavings = [
    { vessel: "Atlantic Star", savings: 4.2 },
    { vessel: "Pacific Voyager", savings: 3.8 },
    { vessel: "Ocean Express", savings: 3.5 },
    { vessel: "Indian Ocean", savings: 3.1 },
  ]

  const riskData = [
    { name: "Low", value: 65, color: "#10b981" },
    { name: "Medium", value: 25, color: "#f59e0b" },
    { name: "High", value: 10, color: "#ef4444" },
  ]

  // Simulate initial monitoring table load
  useEffect(() => {
    const id = setTimeout(() => setIsMonitoringLoading(false), 500)
    return () => clearTimeout(id)
  }, [])

  // Run voyage progress simulation while on Monitoring tab
  useEffect(() => {
    if (activeTab !== "monitoring") return
    const id = setInterval(() => {
      simulateVoyageProgress()
    }, 30000)
    return () => clearInterval(id)
  }, [activeTab])

  // Redirect if not logged in as operator
  useEffect(() => {
    if (!currentUser || currentUser.role !== "OPERATOR") {
      router.push("/")
    }
  }, [currentUser, router])

  // Don't render if not authorized
  if (!currentUser || currentUser.role !== "OPERATOR") {
    return null
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
              Operator Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Notifications />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md">
              <Users className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {currentUser.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="approval">
              Approval Queue
              {pendingPlans.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingPlans.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Approval Queue Tab */}
          <TabsContent value="approval" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Approval Queue
                </h2>
                <p className="text-gray-600 mt-1">
                  Review and approve bunker plans
                </p>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-1">
                {pendingPlans.length} Pending
              </Badge>
            </div>

            {/* Pending Approvals */}
            <div className="space-y-4">
              {pendingPlans.map((plan) => {
                const cargo = getCargoById(plan.cargoId)
                const aiOutputs = getAIOutputsByCargo(plan.cargoId)
                const latestAI = aiOutputs
                  .filter((o) => o.status === "COMPLETED")
                  .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0]

                return (
                  <Card key={plan.id} className="border-2">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {plan.cargoName}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                <Ship className="h-3 w-3" />
                                {cargo?.vessel || "N/A"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(new Date(plan.createdAt), {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                          </CardDescription>
                        </div>
                        <Badge className="bg-warning text-white">
                          PENDING APPROVAL
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Left Side - 60% */}
                        <div className="lg:col-span-3 space-y-4">
                          {/* AI Recommendation */}
                          {latestAI && (
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-900">
                                  AI Recommendation
                                </span>
                                <Badge
                                  variant={
                                    latestAI.confidence >= 90
                                      ? "default"
                                      : latestAI.confidence >= 75
                                      ? "secondary"
                                      : "outline"
                                  }
                                >
                                  {latestAI.confidence}% Confidence
                                </Badge>
                              </div>
                              <Progress value={latestAI.confidence} className="h-2 mb-2" />
                              {cargo && (
                                <Badge className={cn(
                                  cargo.risk === "LOW" && "bg-success",
                                  cargo.risk === "MEDIUM" && "bg-warning",
                                  cargo.risk === "HIGH" && "bg-danger",
                                  "text-white"
                                )}>
                                  {cargo.risk} Risk
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Bunker Plan Details */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm text-gray-900">
                              Bunker Plan Details
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  Port:
                                </span>
                                <div className="font-medium">{plan.port}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Quantity:</span>
                                <div className="font-medium">
                                  {plan.quantity} MT {plan.fuelType}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-600">Supplier:</span>
                                <div className="font-medium">{plan.supplier}</div>
                                <Badge variant="secondary" className="mt-1 text-xs">
                                  {plan.reliability}% Reliability
                                </Badge>
                              </div>
                              <div>
                                <span className="text-gray-600">Price:</span>
                                <div className="font-medium">
                                  ${plan.pricePerMT}/MT
                                </div>
                                <div className="text-xs text-gray-500">
                                  Total: ${plan.totalCost.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Why This Plan */}
                          {cargo && cargo.aiReasoning && (
                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm text-gray-900">
                                Why This Plan?
                              </h4>
                              <ul className="space-y-1 text-sm text-gray-700">
                                {cargo.aiReasoning.slice(0, 5).map((reason, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-primary-600 mt-0.5">•</span>
                                    <span>{reason}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* View Alternatives */}
                          {plan.alternatives && plan.alternatives.length > 0 && (
                            <div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleAlternatives(plan.id)}
                                className="w-full"
                              >
                                {expandedAlternatives.has(plan.id) ? (
                                  <>
                                    <ChevronUp className="h-4 w-4 mr-2" />
                                    Hide Alternatives
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-4 w-4 mr-2" />
                                    View Alternatives ({plan.alternatives.length})
                                  </>
                                )}
                              </Button>
                              {expandedAlternatives.has(plan.id) && (
                                <div className="mt-3 space-y-2">
                                  {plan.alternatives.map((alt, idx) => (
                                    <div
                                      key={idx}
                                      className="p-3 border rounded-md bg-gray-50"
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-sm">
                                          {alt.port}
                                        </span>
                                        <span className="text-sm font-semibold">
                                          ${alt.totalCost.toLocaleString()}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-600">
                                        {alt.reason}
                                      </p>
                                      <div className="text-xs text-gray-500 mt-1">
                                        ${alt.pricePerMT}/MT • {alt.quantity} MT
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* AI Reasoning Details */}
                          <div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleAI(plan.id)}
                              className="w-full justify-between"
                            >
                              <span>AI Reasoning Details</span>
                              {expandedAI.has(plan.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                            {expandedAI.has(plan.id) && (
                              <div className="mt-3">
                                <AIExplainer
                                  bunkerPlan={plan}
                                  cargoId={plan.cargoId}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right Side - Action Panel (40%) */}
                        <div className="lg:col-span-2">
                          <div className="sticky top-24 space-y-4">
                            {/* Action Buttons */}
                            <Card className="border-2">
                              <CardHeader>
                                <CardTitle className="text-sm">Actions</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <Button
                                  className="w-full bg-success hover:bg-green-600"
                                  onClick={() => {
                                    setSelectedPlan(plan)
                                    setIsApproveDialogOpen(true)
                                  }}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full"
                                  onClick={() => {
                                    setSelectedPlan(plan)
                                    setIsModifyDialogOpen(true)
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modify Parameters
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full"
                                  onClick={() => toggleAI(plan.id)}
                                >
                                  <HelpCircle className="h-4 w-4 mr-2" />
                                  Ask AI Why
                                </Button>
                                <Button
                                  variant="destructive"
                                  className="w-full"
                                  onClick={() => {
                                    setSelectedPlan(plan)
                                    setIsRejectDialogOpen(true)
                                  }}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject & Request Alternative
                                </Button>
                              </CardContent>
                            </Card>

                            {/* Quick Stats */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-sm">Quick Stats</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2 text-sm">
                                {plan.alternatives && plan.alternatives.length > 0 && (
                                  <div>
                                    <span className="text-gray-600">
                                      Expected Savings:
                                    </span>
                                    <div className="font-semibold text-success">
                                      $
                                      {(
                                        plan.alternatives[0].totalCost -
                                        plan.totalCost
                                      ).toLocaleString()}{" "}
                                      vs alternatives
                                    </div>
                                  </div>
                                )}
                                <div>
                                  <span className="text-gray-600">
                                    Delivery Window:
                                  </span>
                                  <div className="font-medium">
                                    {format(
                                      new Date(plan.deliveryWindow.start),
                                      "MMM d, HH:mm"
                                    )}{" "}
                                    -{" "}
                                    {format(
                                      new Date(plan.deliveryWindow.end),
                                      "HH:mm"
                                    )}
                                  </div>
                                </div>
                                {latestAI && (
                                  <div>
                                    <span className="text-gray-600">
                                      Data Quality:
                                    </span>
                                    <div className="font-medium">
                                      {latestAI.dataQuality?.overallQuality || 0}%
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {pendingPlans.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-success" />
                    <p className="text-gray-500">No pending approvals</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Recently Approved */}
            {approvedPlans.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Recently Approved</h3>
                <div className="space-y-2">
                  {approvedPlans.map((plan) => (
                    <Card key={plan.id} className="bg-green-50/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{plan.cargoName}</div>
                            <div className="text-sm text-gray-600">
                              {plan.port} • Approved by {plan.approvedBy}
                            </div>
                          </div>
                          <Badge className="bg-success text-white">
                            APPROVED
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Monitoring</h2>
              <p className="text-gray-600 mt-1">
                Track active voyages and alerts
              </p>
            </div>

            {/* Alerts Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Critical Alerts */}
              <Card className="border-2 border-danger">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-danger" />
                    Critical Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {activeVoyages
                      .filter((v) => v.currentROB.VLSFO < 200)
                      .map((vessel) => (
                        <div
                          key={vessel.imo}
                          className="p-2 bg-red-50 rounded border border-red-200"
                        >
                          <div className="text-sm font-medium">
                            Low ROB: {vessel.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {vessel.currentROB.VLSFO} MT remaining
                          </div>
                        </div>
                      ))}
                    {activeVoyages.filter((v) => v.currentROB.VLSFO < 200)
                      .length === 0 && (
                      <p className="text-sm text-gray-500">No critical alerts</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Warnings */}
              <Card className="border-2 border-warning">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    Warnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                      <div className="text-sm font-medium">Price Change Alert</div>
                      <div className="text-xs text-gray-600">
                        Fujairah prices increased 2.3%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Info */}
              <Card className="border-2 border-primary-200">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary-600" />
                    Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="p-2 bg-blue-50 rounded border border-blue-200">
                      <div className="text-sm font-medium">Bunker Completed</div>
                      <div className="text-xs text-gray-600">
                        MV Pacific Voyager at Fujairah
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Voyages Table */}
            <Card>
              <CardHeader>
                <CardTitle>Active Voyages</CardTitle>
                <CardDescription>
                  Real-time status of all active voyages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  {isMonitoringLoading ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="grid grid-cols-6 gap-3 items-center py-2"
                        >
                          <Skeleton className="h-4 w-28 col-span-1" />
                          <Skeleton className="h-4 w-40 col-span-2" />
                          <Skeleton className="h-4 w-24 col-span-1" />
                          <Skeleton className="h-4 w-20 col-span-1" />
                          <Skeleton className="h-4 w-16 col-span-1" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vessel</TableHead>
                          <TableHead>Current Route</TableHead>
                          <TableHead>Next Bunker Port</TableHead>
                          <TableHead>ETA</TableHead>
                          <TableHead>ROB Status</TableHead>
                          <TableHead>Overall Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeVoyages.map((vessel) => {
                          const robStatus = getROBStatus(vessel)
                          const cargo = cargoes.find((c) => c.vessel === vessel.name)
                          return (
                            <TableRow key={vessel.imo}>
                              <TableCell className="font-medium">
                                {vessel.name}
                              </TableCell>
                              <TableCell>
                                {cargo
                                  ? `${cargo.loadPort} → ${cargo.dischargePort}`
                                  : "N/A"}
                              </TableCell>
                              <TableCell>{vessel.nextPort}</TableCell>
                              <TableCell>
                                {format(new Date(vessel.ETA), "MMM d, HH:mm")}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span>{robStatus.icon}</span>
                                  <span className={robStatus.color}>
                                    {vessel.currentROB.VLSFO} MT
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={cn(
                                    robStatus.status === "ON_TRACK" &&
                                      "bg-success",
                                    robStatus.status === "WATCH" && "bg-warning",
                                    robStatus.status === "ALERT" && "bg-danger",
                                    "text-white"
                                  )}
                                >
                                  {robStatus.status.replace("_", " ")}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
              <p className="text-gray-600 mt-1">
                Performance metrics and insights
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-600">
                    Avg Cost Savings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success">3.8%</div>
                  <div className="text-xs text-success mt-1">
                    +0.3% vs last month
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-600">
                    AI Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary-600">
                    94.2%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Confidence score
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-600">
                    Voyages Optimized
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-warning">47</div>
                  <div className="text-xs text-gray-500 mt-1">This month</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-600">
                    Total Savings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success">$1.05M</div>
                  <div className="text-xs text-gray-500 mt-1">YTD</div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Savings Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Savings Trend</CardTitle>
                  <CardDescription>6-month cost savings percentage</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={savingsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="savings"
                        stroke="#2563eb"
                        strokeWidth={2}
                        name="Savings %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Vessel Savings */}
              <Card>
                <CardHeader>
                  <CardTitle>Cost Savings by Vessel</CardTitle>
                  <CardDescription>Average savings per vessel</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={vesselSavings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="vessel" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="savings" fill="#10b981" name="Savings %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Risk Distribution */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Risk Distribution</CardTitle>
                  <CardDescription>Distribution of cargo risk levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={riskData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {riskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Metrics Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Detailed Metrics</CardTitle>
                    <CardDescription>
                      Performance breakdown by vessel, route, and month
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vessel</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Month</TableHead>
                        <TableHead>Savings</TableHead>
                        <TableHead>Bunker Cost</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vesselSavings.map((vessel, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">
                            {vessel.vessel}
                          </TableCell>
                          <TableCell>Singapore → Rotterdam</TableCell>
                          <TableCell>June 2024</TableCell>
                          <TableCell className="text-success font-semibold">
                            {vessel.savings}%
                          </TableCell>
                          <TableCell>$580K</TableCell>
                          <TableCell>
                            <Badge className="bg-success text-white">
                              Completed
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Bunker Plan</DialogTitle>
            <DialogDescription>
              Confirm approval of this bunker plan. You can add an optional note.
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4 py-4">
              <div className="text-sm">
                <span className="font-medium">Plan:</span> {selectedPlan.cargoName}
              </div>
              <div className="text-sm">
                <span className="font-medium">Port:</span> {selectedPlan.port}
              </div>
              <div className="text-sm">
                <span className="font-medium">Total Cost:</span> $
                {selectedPlan.totalCost.toLocaleString()}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Approval Note (Optional)
                </label>
                <Textarea
                  placeholder="Add any notes about this approval..."
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsApproveDialogOpen(false)
                setApprovalNote("")
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleApprove} className="bg-success hover:bg-green-600">
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Bunker Plan</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection. An alternative will be
              requested automatically.
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <div className="py-4">
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}
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
              onClick={handleReject}
              disabled={!rejectReason.trim()}
              variant="destructive"
            >
              Reject & Request Alternative
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modify Dialog */}
      <Dialog open={isModifyDialogOpen} onOpenChange={setIsModifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modify Parameters</DialogTitle>
            <DialogDescription>
              Adjust bunker plan parameters (coming soon)
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModifyDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

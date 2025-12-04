"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertTriangle,
  CheckCircle2,
  Activity,
  RefreshCw,
  Phone,
  MapPin,
  FileText,
  TrendingUp,
  TrendingDown,
  Clock,
  Ship,
  BarChart3,
} from "lucide-react"
import { format, formatDistanceToNow, differenceInHours } from "date-fns"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"

/**
 * Fleet Health Monitor - Comprehensive fleet operational intelligence dashboard
 * Provides prioritized alerts and actionable insights for operators
 */
export function FleetHealthMonitor() {
  const { vessels, bunkerPlans, cargoes } = useStore()
  const [filter, setFilter] = useState("all") // 'all' | 'critical' | 'attention' | 'onTrack'
  const [view, setView] = useState("priority") // 'priority' | 'map' | 'timeline'
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Calculate vessel health status
  const vesselHealth = useMemo(() => {
    return vessels.map((vessel) => {
      const rob = vessel.currentROB?.VLSFO || 0
      const cargo = cargoes.find((c) => c.vessel === vessel.name)
      const bunkerPlan = bunkerPlans.find((p) => p.id === vessel.bunkerPlanId)
      
      // Calculate time to next bunker port
      const eta = vessel.ETA ? new Date(vessel.ETA) : null
      const hoursToPort = eta ? differenceInHours(eta, new Date()) : null
      
      // Calculate consumption rate
      const plannedConsumption = vessel.estimatedConsumption?.VLSFO || 8
      const actualConsumption = vessel.actualConsumption?.VLSFO || plannedConsumption
      const consumptionDiff = ((actualConsumption - plannedConsumption) / plannedConsumption) * 100
      
      // Determine priority level
      let priority = "onTrack"
      let issues = []
      let aiRecommendation = ""
      
      // Critical: Low ROB and no bunker plan approved
      if (rob < 180 && (!bunkerPlan || bunkerPlan.status !== "APPROVED")) {
        priority = "critical"
        issues.push({
          type: "low_rob",
          severity: "critical",
          message: `ROB Critical: ${rob} MT VLSFO (Below safety margin)`,
          details: {
            safeMinimum: 180,
            consumptionRate: `${plannedConsumption} MT/day`,
            timeToCritical: hoursToPort ? `${Math.round(hoursToPort)} hours` : "Unknown",
            matchesETA: hoursToPort && Math.abs(hoursToPort - (hoursToPort || 0)) < 2 ? "⚠️ MATCHES ETA!" : "",
          },
        })
        if (!bunkerPlan) {
          issues.push({
            type: "no_bunker_plan",
            severity: "critical",
            message: "No bunker plan approved yet",
            details: {
              planStatus: "None",
            },
          })
        } else if (bunkerPlan.status === "PENDING_APPROVAL") {
          issues.push({
            type: "pending_approval",
            severity: "critical",
            message: `No bunker plan approved yet`,
            details: {
              planSubmitted: `Plan submitted ${formatDistanceToNow(new Date(bunkerPlan.createdAt), { addSuffix: true })} (${bunkerPlan.id})`,
              waitingFor: "Waiting for your approval",
            },
          })
        }
        const planAction = bunkerPlan && bunkerPlan.status === "PENDING_APPROVAL" 
          ? `Approve bunker plan ${bunkerPlan.id} immediately.` 
          : "Create and approve bunker plan immediately."
        aiRecommendation = `URGENT: ${planAction} Vessel will arrive ${vessel.nextPort || "next port"} with <100 MT if delayed by weather. No alternative bunker ports within range. This is a critical safety situation.`
      }
      // Attention: Over-consuming fuel
      else if (consumptionDiff > 10) {
        priority = "attention"
        issues.push({
          type: "over_consumption",
          severity: "attention",
          message: `Fuel Over-Consumption: +${consumptionDiff.toFixed(0)}% vs plan`,
          details: {
            planned: `${plannedConsumption} MT/day`,
            actual: `${actualConsumption} MT/day`,
            extraCost: `~$${Math.round((actualConsumption - plannedConsumption) * 650)}/day`,
            duration: "Past 3 days",
            possibleCauses: [
              "Bad weather (heavy seas reported)",
              "Speed increase (vessel going faster?)",
              "Hull fouling (performance degradation?)",
            ],
          },
        })
        aiRecommendation = "Contact vessel to investigate over-consumption. If weather-related, consider speed reduction to optimize fuel usage. If persistent, schedule hull inspection at next port. Current ROB is safe, but monitor closely."
      }
      // Attention: Bunker needed soon
      else if (hoursToPort && hoursToPort < 48 && rob < 500) {
        priority = "attention"
        issues.push({
          type: "bunker_soon",
          severity: "attention",
          message: "Bunker needed within 48 hours",
          details: {
            currentROB: `${rob} MT (adequate)`,
            plannedBunker: bunkerPlan ? `${bunkerPlan.quantity} MT` : "Not planned",
            planStatus: bunkerPlan?.status || "None",
            supplier: bunkerPlan?.supplier || "Not confirmed",
            deliveryWindow: bunkerPlan?.deliveryWindow ? format(new Date(bunkerPlan.deliveryWindow.start), "MMM d, HH:mm") : "Not set",
          },
        })
        aiRecommendation = "Bunkering on track. No action needed unless ETA changes. System will alert if any issues arise."
      }
      // On Track
      else {
        priority = "onTrack"
        aiRecommendation = "Vessel operating normally. All systems green."
      }
      
      return {
        vessel,
        priority,
        issues,
        aiRecommendation,
        rob,
        hoursToPort,
        consumptionDiff,
        bunkerPlan,
        cargo,
      }
    })
  }, [vessels, bunkerPlans, cargoes])

  // Calculate fleet statistics
  const fleetStats = useMemo(() => {
    const critical = vesselHealth.filter((v) => v.priority === "critical").length
    const attention = vesselHealth.filter((v) => v.priority === "attention").length
    const onTrack = vesselHealth.filter((v) => v.priority === "onTrack").length
    const total = vesselHealth.length
    const utilization = total > 0 ? Math.round((onTrack / total) * 100) : 0
    
    return { critical, attention, onTrack, total, utilization }
  }, [vesselHealth])

  // Filter vessels
  const filteredVessels = useMemo(() => {
    if (filter === "all") return vesselHealth
    return vesselHealth.filter((v) => v.priority === filter)
  }, [vesselHealth, filter])

  // Sort by priority (critical first, then attention, then on track)
  const sortedVessels = useMemo(() => {
    const priorityOrder = { critical: 0, attention: 1, onTrack: 2 }
    return [...filteredVessels].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  }, [filteredVessels])

  const handleRefresh = () => {
    setLastRefresh(new Date())
    // In a real app, this would trigger a data refresh
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "critical":
        return "🔴"
      case "attention":
        return "🟡"
      case "onTrack":
        return "🟢"
      default:
        return "⚪"
    }
  }

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "critical":
        return "CRITICAL"
      case "attention":
        return "ATTENTION"
      case "onTrack":
        return "ON TRACK"
      default:
        return "UNKNOWN"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">FLEET HEALTH MONITOR</h2>
          <p className="text-sm text-gray-600 mt-1">
            Last updated: {formatDistanceToNow(lastRefresh, { addSuffix: true })}{" "}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          </p>
        </div>
      </div>

      {/* Fleet Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-danger">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-2xl">🔴</span>
              CRITICAL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-danger">{fleetStats.critical} Vessel{fleetStats.critical !== 1 ? "s" : ""}</div>
            <div className="text-xs text-gray-600 mt-1">Needs urgent action</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-warning">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-2xl">🟡</span>
              ATTENTION
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{fleetStats.attention} Vessel{fleetStats.attention !== 1 ? "s" : ""}</div>
            <div className="text-xs text-gray-600 mt-1">Needs review within 24hrs</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-success">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-2xl">🟢</span>
              ON TRACK
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{fleetStats.onTrack} Vessel{fleetStats.onTrack !== 1 ? "s" : ""}</div>
            <div className="text-xs text-gray-600 mt-1">All good</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary-600" />
              FLEET UTILIZATION
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-600">{fleetStats.utilization}%</div>
            <div className="text-xs text-gray-600 mt-1">vs 85% target</div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Vessels */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">PRIORITY VESSELS</h3>
        {sortedVessels
          .filter((v) => v.priority !== "onTrack")
          .map((vesselHealth) => {
            const { vessel, priority, issues, aiRecommendation, rob, hoursToPort, bunkerPlan, cargo } = vesselHealth
            
            return (
              <Card
                key={vessel.imo}
                className={cn(
                  "border-2",
                  priority === "critical" && "border-danger bg-red-50/30",
                  priority === "attention" && "border-warning bg-yellow-50/30"
                )}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getPriorityIcon(priority)}</span>
                      <CardTitle className="text-base">
                        {getPriorityLabel(priority)}: {vessel.name}
                      </CardTitle>
                    </div>
                    <Badge
                      className={cn(
                        priority === "critical" && "bg-danger text-white",
                        priority === "attention" && "bg-warning text-black"
                      )}
                    >
                      {priority === "critical" ? "Action Required: URGENT" : "Action Required: Review"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Vessel Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Current Position:</div>
                      <div className="font-medium">
                        {vessel.currentPosition?.port || "Unknown"} ({vessel.currentPosition?.country || "N/A"})
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Next Port:</div>
                      <div className="font-medium">
                        {vessel.nextPort || "N/A"} {hoursToPort && `(ETA: ${Math.round(hoursToPort)} hours)`}
                      </div>
                    </div>
                  </div>

                  {/* Issues */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      {priority === "critical" ? "CRITICAL ISSUES:" : "ISSUES DETECTED:"}
                    </h4>
                    <div className="space-y-3">
                      {issues.map((issue, idx) => (
                        <div key={idx} className="bg-white rounded-md p-3 border border-gray-200">
                          <div className="flex items-start gap-2 mb-2">
                            <span className="text-lg">
                              {issue.severity === "critical" ? "🔴" : "🟡"}
                            </span>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{issue.message}</div>
                              {issue.details && (
                                <div className="mt-2 space-y-1 text-xs text-gray-600">
                                  {Object.entries(issue.details).map(([key, value]) => {
                                    if (Array.isArray(value)) {
                                      return (
                                        <div key={key}>
                                          <div className="font-medium">{key.replace(/([A-Z])/g, " $1").trim()}:</div>
                                          <ul className="ml-4 list-disc">
                                            {value.map((item, i) => (
                                              <li key={i}>{item}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )
                                    }
                                    return (
                                      <div key={key}>
                                        <span className="font-medium">{key.replace(/([A-Z])/g, " $1").trim()}:</span> {String(value)}
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Recommendation */}
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">💡</span>
                      <div className="flex-1">
                        <div className="font-semibold text-sm mb-1">AI RECOMMENDATION:</div>
                        <div className="text-sm text-gray-700">{aiRecommendation}</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {priority === "critical" && bunkerPlan && bunkerPlan.status === "PENDING_APPROVAL" && (
                      <Button 
                        size="sm" 
                        className="bg-danger hover:bg-red-600"
                        onClick={() => {
                          // In a real app, this would open the approval dialog
                          console.log("Approve bunker plan:", bunkerPlan.id)
                        }}
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Approve Bunker Plan Now
                      </Button>
                    )}
                    {priority === "attention" && (
                      <>
                        <Button variant="outline" size="sm">
                          <Phone className="h-3 w-3 mr-1" />
                          Contact Vessel
                        </Button>
                        <Button variant="outline" size="sm">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          View Consumption Trend
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-3 w-3 mr-1" />
                          Investigation Report
                        </Button>
                        <Button variant="outline" size="sm">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Acknowledge
                        </Button>
                      </>
                    )}
                    {priority === "critical" && (
                      <>
                        <Button variant="outline" size="sm">
                          <Phone className="h-3 w-3 mr-1" />
                          Contact Vessel
                        </Button>
                        <Button variant="outline" size="sm">
                          <MapPin className="h-3 w-3 mr-1" />
                          View on Map
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-3 w-3 mr-1" />
                          Full Details
                        </Button>
                      </>
                    )}
                    {priority === "attention" && issues.some(i => i.type === "bunker_soon") && (
                      <>
                        <Button variant="outline" size="sm">
                          <FileText className="h-3 w-3 mr-1" />
                          View Bunker Plan
                        </Button>
                        <Button variant="outline" size="sm">
                          <MapPin className="h-3 w-3 mr-1" />
                          Track Progress
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Last Report */}
                  <div className="text-xs text-gray-500">
                    Last ROB Report: {vessel.lastReportTime ? formatDistanceToNow(new Date(vessel.lastReportTime), { addSuffix: true }) : "Unknown"}
                  </div>
                </CardContent>
              </Card>
            )
          })}
      </div>

      {/* All Vessels Status Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>ALL VESSELS STATUS</CardTitle>
              <CardDescription>Click to expand for details</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {["all", "critical", "attention", "onTrack"].map((f) => (
                  <Button
                    key={f}
                    variant={filter === f ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                    onClick={() => setFilter(f)}
                  >
                    {f === "all" ? "All" : f === "critical" ? "Critical" : f === "attention" ? "Attention" : "On Track"}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vessel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>ROB</TableHead>
                  <TableHead>Next Bunker</TableHead>
                  <TableHead>ETA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedVessels.map((vesselHealth) => {
                  const { vessel, priority, rob, hoursToPort } = vesselHealth
                  return (
                    <TableRow key={vessel.imo}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span>{getPriorityIcon(priority)}</span>
                          {vessel.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            priority === "critical" && "bg-danger text-white",
                            priority === "attention" && "bg-warning text-black",
                            priority === "onTrack" && "bg-success text-white"
                          )}
                        >
                          {getPriorityLabel(priority)}
                        </Badge>
                      </TableCell>
                      <TableCell>{rob} MT</TableCell>
                      <TableCell>
                        {hoursToPort ? `${Math.round(hoursToPort)} hrs` : "N/A"}
                      </TableCell>
                      <TableCell>
                        {vessel.nextPort || "N/A"}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


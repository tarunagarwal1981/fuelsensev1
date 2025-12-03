"use client"

import { useEffect, useMemo, useState } from "react"
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Notifications } from "@/components/Notifications"
import { useStore } from "@/lib/store"
import {
  Ship,
  MapPin,
  Compass,
  Clock,
  AlertTriangle,
  CheckCircle2,
  CloudDrizzle,
  Wind,
  History,
  Upload,
  ChevronDown,
} from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const ROB_DRAFT_KEY = "fuel-sense-vessel-rob-draft"

export default function VesselPage() {
  const router = useRouter()
  const {
    currentUser,
    vessels,
    cargoes,
    updateVesselROB,
    flagVesselIssue,
  } = useStore()

  const [activeTab, setActiveTab] = useState("current")
  const [selectedVesselImo, setSelectedVesselImo] = useState(null)
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false)
  const [issueType, setIssueType] = useState("")
  const [issueDescription, setIssueDescription] = useState("")

  // ROB form state (with draft)
  const [robForm, setRobForm] = useState({
    dateTime: new Date().toISOString().slice(0, 16),
    lat: "",
    lon: "",
    vlsfoTank1: "",
    vlsfoTank2: "",
    vlsfoTank3: "",
    lsmgoTank4: "",
    vlsfoCons24h: "",
    lsmgoCons24h: "",
    mode: "LADEN",
    seaState: "Calm",
    wind: "BF3",
    comments: "",
  })

  // Initialize vessel selection
  useEffect(() => {
    if (!selectedVesselImo && vessels.length > 0) {
      setSelectedVesselImo(vessels[0].imo)
    }
  }, [vessels, selectedVesselImo])

  const selectedVessel = useMemo(
    () => vessels.find((v) => v.imo === selectedVesselImo),
    [vessels, selectedVesselImo]
  )

  const currentCargo = useMemo(
    () => (selectedVessel ? cargoes.find((c) => c.vessel === selectedVessel.name) : null),
    [cargoes, selectedVessel]
  )

  // Load ROB draft from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return
    const draft = window.localStorage.getItem(ROB_DRAFT_KEY)
    if (draft) {
      try {
        const parsed = JSON.parse(draft)
        setRobForm((prev) => ({ ...prev, ...parsed }))
      } catch {
        // ignore
      }
    }
  }, [])

  // Save ROB draft
  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(ROB_DRAFT_KEY, JSON.stringify(robForm))
  }, [robForm])

  // Redirect if not logged in as vessel user
  useEffect(() => {
    if (!currentUser || currentUser.role !== "VESSEL") {
      router.push("/")
    }
  }, [currentUser, router])

  // Don't render if not authorized
  if (!currentUser || currentUser.role !== "VESSEL") {
    return null
  }

  const totalVlsfo =
    Number(robForm.vlsfoTank1 || 0) +
    Number(robForm.vlsfoTank2 || 0) +
    Number(robForm.vlsfoTank3 || 0)

  const handleRobChange = (field, value) => {
    setRobForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmitRobReport = () => {
    if (!selectedVessel) return

    const newRob = {
      VLSFO: totalVlsfo,
      LSMGO: Number(robForm.lsmgoTank4 || 0),
    }

    updateVesselROB(selectedVessel.imo, newRob)
    toast.success("ROB report submitted", {
      description: "Operator has been notified of the new ROB data.",
    })
  }

  const handleSubmitIssue = () => {
    if (!selectedVessel || !issueType) return
    flagVesselIssue(
      selectedVessel.imo,
      `${issueType}: ${issueDescription || "No additional details"}`
    )
    toast.success("Issue submitted to operator")
    setIsIssueDialogOpen(false)
    setIssueType("")
    setIssueDescription("")
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "ON_VOYAGE":
        return "bg-primary-600 text-white"
      case "BUNKERING":
        return "bg-success text-white"
      case "IN_PORT":
        return "bg-neutral text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const voyageProgress = currentCargo ? Math.min(95, Math.round((currentCargo.duration / 30) * 100)) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">⚓</span>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  Fuel Sense
                </span>
                <span className="text-[11px] sm:text-xs text-gray-500">
                  Vessel Dashboard
                </span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {selectedVessel && (
              <Select
                value={selectedVesselImo || ""}
                onValueChange={setSelectedVesselImo}
              >
                <SelectTrigger className="h-8 w-[140px] sm:w-[200px] text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {vessels.map((v) => (
                    <SelectItem key={v.imo} value={v.imo}>
                      {v.name} ({v.imo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Notifications />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-3 sm:p-4 lg:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full max-w-xl mb-4 overflow-x-auto">
            <TabsTrigger value="current" className="flex-1 text-xs sm:text-sm">
              Current Voyage
            </TabsTrigger>
            <TabsTrigger value="rob" className="flex-1 text-xs sm:text-sm">
              ROB Update
            </TabsTrigger>
            <TabsTrigger value="bunker" className="flex-1 text-xs sm:text-sm">
              Bunker Operations
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1 text-xs sm:text-sm">
              History
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Current Voyage */}
          <TabsContent value="current" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Vessel Info */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Ship className="h-4 w-4" />
                      Vessel Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm sm:text-base">
                    {selectedVessel ? (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">
                              {selectedVessel.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              IMO {selectedVessel.imo}
                            </div>
                          </div>
                          <Badge className={getStatusBadge(selectedVessel.status)}>
                            {selectedVessel.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="flex items-center gap-1 text-gray-600">
                            <MapPin className="h-3 w-3" />
                            Position
                          </span>
                          <span className="font-medium">
                            {selectedVessel.currentPosition.latitude.toFixed(2)}°,
                            {" "}
                            {selectedVessel.currentPosition.longitude.toFixed(2)}°
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="flex items-center gap-1 text-gray-600">
                            <Compass className="h-3 w-3" />
                            Route
                          </span>
                          <span className="font-medium">
                            {currentCargo
                              ? `${currentCargo.loadPort} → ${currentCargo.dischargePort}`
                              : "N/A"}
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No vessel selected
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Validation Checklist */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm sm:text-base">
                      Validation Checklist
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs sm:text-sm">
                    {[
                      "ROB confirmed",
                      "Consumption estimate verified",
                      "Plan feasible from vessel perspective",
                      "Crew briefed",
                    ].map((label) => (
                      <div key={label} className="flex items-center gap-2">
                        <Checkbox id={label} className="h-4 w-4" />
                        <label
                          htmlFor={label}
                          className="text-gray-700 leading-tight"
                        >
                          {label}
                        </label>
                      </div>
                    ))}
                    <div className="flex flex-col sm:flex-row gap-2 mt-3">
                      <Button className="flex-1">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Approve Voyage Plan
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setIsIssueDialogOpen(true)}
                      >
                        <AlertTriangle className="h-4 w-4 mr-2 text-warning" />
                        Flag Issue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Voyage Plan */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base">
                      Voyage Plan
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Route and progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs sm:text-sm">
                    {currentCargo ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {currentCargo.loadPort} → {currentCargo.dischargePort}
                          </span>
                          <span className="text-gray-500 text-[11px] sm:text-xs">
                            {currentCargo.distance} nm • {currentCargo.duration} days
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] sm:text-xs">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{voyageProgress}%</span>
                          </div>
                          <Progress value={voyageProgress} className="h-2" />
                        </div>
                        {selectedVessel && (
                          <div className="flex items-center justify-between text-[11px] sm:text-xs">
                            <span className="flex items-center gap-1 text-gray-600">
                              <Clock className="h-3 w-3" />
                              ETA Next Port
                            </span>
                            <span className="font-medium">
                              {format(new Date(selectedVessel.ETA), "MMM d, HH:mm")}
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No voyage assigned to this vessel
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Bunker Plan */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base">
                      Bunker Plan & ROB
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Fuel status and upcoming bunkering
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs sm:text-sm">
                    {selectedVessel ? (
                      <>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">VLSFO ROB</span>
                            <span className="font-medium">
                              {selectedVessel.currentROB.VLSFO} MT
                            </span>
                          </div>
                          <Progress
                            value={Math.min(
                              100,
                              (selectedVessel.currentROB.VLSFO / 600) * 100
                            )}
                            className="h-2"
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">LSMGO ROB</span>
                            <span className="font-medium">
                              {selectedVessel.currentROB.LSMGO} MT
                            </span>
                          </div>
                          <Progress
                            value={Math.min(
                              100,
                              (selectedVessel.currentROB.LSMGO / 150) * 100
                            )}
                            className="h-2"
                          />
                        </div>
                        <div className="pt-2 border-t border-gray-200 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Est. VLSFO to next port
                            </span>
                            <span className="font-medium">120 MT</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Required bunker quantity
                            </span>
                            <span className="font-medium">300 MT</span>
                          </div>
                          <div className="mt-2">
                            <span className="text-gray-600">
                              Next bunker port
                            </span>
                            <div className="font-medium">
                              {selectedVessel.nextPort}
                            </div>
                            <div className="text-[11px] text-gray-500">
                              Schedule: {format(new Date(selectedVessel.ETA), "MMM d, HH:mm")}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No bunker plan available
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: ROB Update */}
          <TabsContent value="rob" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base">
                      ROB Report
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Report remaining on board fuel
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs sm:text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] mb-1">
                          Date / Time (UTC)
                        </label>
                        <Input
                          type="datetime-local"
                          value={robForm.dateTime}
                          onChange={(e) =>
                            handleRobChange("dateTime", e.target.value)
                          }
                          className="h-9"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] mb-1">
                          Position (Lat / Lon)
                        </label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Lat"
                            value={robForm.lat}
                            onChange={(e) => handleRobChange("lat", e.target.value)}
                            className="h-9"
                          />
                          <Input
                            placeholder="Lon"
                            value={robForm.lon}
                            onChange={(e) => handleRobChange("lon", e.target.value)}
                            className="h-9"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Fuel Tanks */}
                    <div className="pt-2 border-t border-gray-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">
                          VLSFO Tanks
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          placeholder="Tank 1 (MT)"
                          value={robForm.vlsfoTank1}
                          onChange={(e) =>
                            handleRobChange("vlsfoTank1", e.target.value)
                          }
                          className="h-9"
                        />
                        <Input
                          placeholder="Tank 2 (MT)"
                          value={robForm.vlsfoTank2}
                          onChange={(e) =>
                            handleRobChange("vlsfoTank2", e.target.value)
                          }
                          className="h-9"
                        />
                        <Input
                          placeholder="Tank 3 (MT)"
                          value={robForm.vlsfoTank3}
                          onChange={(e) =>
                            handleRobChange("vlsfoTank3", e.target.value)
                          }
                          className="h-9"
                        />
                      </div>
                      <div className="text-[11px] text-gray-600">
                        Total VLSFO:{" "}
                        <span className="font-semibold">{totalVlsfo} MT</span>
                      </div>

                      <div className="mt-2">
                        <span className="font-medium text-gray-800">
                          LSMGO Tank
                        </span>
                        <Input
                          placeholder="Tank 4 (MT)"
                          value={robForm.lsmgoTank4}
                          onChange={(e) =>
                            handleRobChange("lsmgoTank4", e.target.value)
                          }
                          className="h-9 mt-1"
                        />
                      </div>
                    </div>

                    {/* Consumption */}
                    <div className="pt-2 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] mb-1">
                          VLSFO Consumption (last 24h, MT)
                        </label>
                        <Input
                          value={robForm.vlsfoCons24h}
                          onChange={(e) =>
                            handleRobChange("vlsfoCons24h", e.target.value)
                          }
                          className="h-9"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] mb-1">
                          LSMGO Consumption (last 24h, MT)
                        </label>
                        <Input
                          value={robForm.lsmgoCons24h}
                          onChange={(e) =>
                            handleRobChange("lsmgoCons24h", e.target.value)
                          }
                          className="h-9"
                        />
                      </div>
                    </div>

                    {/* Mode & Weather */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-200">
                      <div>
                        <label className="block text-[11px] mb-1">
                          Operating Mode
                        </label>
                        <Select
                          value={robForm.mode}
                          onValueChange={(value) => handleRobChange("mode", value)}
                        >
                          <SelectTrigger className="h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LADEN">Laden</SelectItem>
                            <SelectItem value="BALLAST">Ballast</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-[11px] mb-1">
                          Sea State
                        </label>
                        <Select
                          value={robForm.seaState}
                          onValueChange={(value) =>
                            handleRobChange("seaState", value)
                          }
                        >
                          <SelectTrigger className="h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["Calm", "Slight", "Moderate", "Rough", "Very Rough"].map(
                              (opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-[11px] mb-1">
                          Wind (Beaufort)
                        </label>
                        <Select
                          value={robForm.wind}
                          onValueChange={(value) => handleRobChange("wind", value)}
                        >
                          <SelectTrigger className="h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["BF2", "BF3", "BF4", "BF5", "BF6", "BF7"].map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Comments */}
                    <div className="pt-2 border-t border-gray-200 space-y-2">
                      <label className="block text-[11px] mb-1">
                        Comments
                      </label>
                      <Textarea
                        placeholder="Any additional remarks..."
                        value={robForm.comments}
                        onChange={(e) =>
                          handleRobChange("comments", e.target.value)
                        }
                        className="min-h-[80px] text-xs sm:text-sm"
                      />
                      <div className="flex flex-col sm:flex-row gap-2 mt-1">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 justify-center"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Tank Photos
                        </Button>
                        <Button
                          type="button"
                          className="flex-1 justify-center"
                          onClick={handleSubmitRobReport}
                        >
                          ✅ Submit ROB Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Last report summary (placeholder) */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base">
                      Last ROB Summary
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Previous report and trend
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs sm:text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last Report</span>
                      <span className="font-medium">24h ago</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">VLSFO ROB</span>
                        <span className="font-medium">420 MT</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">
                          VLSFO Consumption (24h)
                        </span>
                        <span className="font-medium">40 MT</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <span className="text-gray-600">Trend</span>
                      <div className="flex items-center gap-2 mt-1">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span className="text-[11px] text-gray-600">
                          Consumption within expected range
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: Bunker Operations (simplified, form-focused) */}
          <TabsContent value="bunker" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Upcoming schedule & checklist */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base">
                      Upcoming Bunker Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs sm:text-sm">
                    {selectedVessel ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Port</span>
                          <span className="font-medium">
                            {selectedVessel.nextPort}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">ETA</span>
                          <span className="font-medium">
                            {format(new Date(selectedVessel.ETA), "MMM d, HH:mm")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Quantity Ordered</span>
                          <span className="font-medium">600 MT VLSFO</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Supplier</span>
                          <span className="font-medium">Gulf Bunkering LLC</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No upcoming bunker schedule
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base">
                      Pre-bunkering Checklist
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs sm:text-sm">
                    {[
                      "Bunker plan received and understood",
                      "Supplier confirmed",
                      "Berth/anchorage arranged",
                      "Crew briefed (safety meeting held)",
                      "Tanks prepared and sounded",
                      "Equipment checked (hoses, meters)",
                      "Communication established with supplier",
                    ].map((label) => (
                      <div key={label} className="flex items-center gap-2">
                        <Checkbox className="h-4 w-4" />
                        <span>{label}</span>
                      </div>
                    ))}
                    <Button className="w-full mt-2">Mark All Complete</Button>
                  </CardContent>
                </Card>
              </div>

              {/* During / Post bunkering forms (simplified) */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base">
                      During Bunkering
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs sm:text-sm">
                    <Input placeholder="Barge/truck alongside time" className="h-9" />
                    <Input placeholder="Start pumping time" className="h-9" />
                    <div className="flex items-center gap-2 mt-1">
                      <Checkbox className="h-4 w-4" />
                      <span>Supplier sample taken</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox className="h-4 w-4" />
                      <span>Vessel sample taken</span>
                    </div>
                    <Input placeholder="Flow rate (MT/hr)" className="h-9" />
                    <Input placeholder="Running total (MT)" className="h-9" />
                    <Input placeholder="Temperature (°C)" className="h-9" />
                    <Textarea
                      placeholder="Issues / observations"
                      className="min-h-[80px]"
                    />
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" className="flex-1">
                        Pause Bunkering
                      </Button>
                      <Button className="flex-1">Complete Bunkering</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base">
                      Post-bunkering Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs sm:text-sm">
                    <Input placeholder="Final sounding (MT)" className="h-9" />
                    <Input placeholder="Quantity received (MT)" className="h-9" />
                    <Input placeholder="BDN number" className="h-9" />
                    <Select defaultValue="PASS">
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Quality check" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PASS">Quality: Pass</SelectItem>
                        <SelectItem value="FAIL">Quality: Fail</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex flex-col sm:flex-row gap-2 mt-1">
                      <Button variant="outline" className="flex-1">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload BDN
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Sample Photos
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Final comments"
                      className="min-h-[80px]"
                    />
                    <Button className="w-full mt-2">
                      ✅ Submit Bunker Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: History (simplified timeline) */}
          <TabsContent value="history" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Vessel History
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  ROB reports, bunker operations, and issues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search history..."
                    className="h-9 flex-1"
                  />
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="mt-1">
                        <div className="h-2 w-2 rounded-full bg-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            ROB Report Submitted
                          </span>
                          <span className="text-[11px] text-gray-500">
                            4h ago
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-600">
                          VLSFO: 420 MT • LSMGO: 110 MT • Cons: 40/2 MT
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="mt-1">
                        <div className="h-2 w-2 rounded-full bg-success" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            Bunkering Completed
                          </span>
                          <span className="text-[11px] text-gray-500">
                            Yesterday
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-600">
                          600 MT VLSFO received at Fujairah
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Issue Flagging Dialog */}
      <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag Issue to Operator</DialogTitle>
            <DialogDescription>
              Select the type of issue and provide a short description.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm">
            <div>
              <label className="block text-xs mb-1">Issue Type</label>
              <Select value={issueType} onValueChange={setIssueType}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ROB discrepancy">
                    ROB discrepancy
                  </SelectItem>
                  <SelectItem value="Higher than expected consumption">
                    Higher than expected consumption
                  </SelectItem>
                  <SelectItem value="Port accessibility concerns">
                    Port accessibility concerns
                  </SelectItem>
                  <SelectItem value="Weather/route concerns">
                    Weather/route concerns
                  </SelectItem>
                  <SelectItem value="Equipment issues">
                    Equipment issues
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs mb-1">Description</label>
              <Textarea
                placeholder="Describe the issue..."
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsIssueDialogOpen(false)
                setIssueType("")
                setIssueDescription("")
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitIssue}
              disabled={!issueType}
              className="bg-warning hover:bg-yellow-600"
            >
              Submit to Operator
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


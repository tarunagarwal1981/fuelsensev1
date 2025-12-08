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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Notifications } from "@/components/Notifications"
import { useStore } from "@/lib/store"
import { toast } from "sonner"

export default function VesselPage() {
  const router = useRouter()
  const { currentUser, setCurrentUser, vessels, cargoes, updateVesselROB } = useStore()

  const [selectedVesselImo, setSelectedVesselImo] = useState(null)

  // Ensure vessel user
  useEffect(() => {
    if (!currentUser) {
      setCurrentUser({ role: "VESSEL", name: "Vessel", email: "vessel@fuelsense.com" })
      return
    }
    if (currentUser.role !== "VESSEL") {
      router.push("/")
    }
  }, [currentUser, router, setCurrentUser])

  // Default vessel selection
  useEffect(() => {
    if (!selectedVesselImo && vessels.length > 0) {
      setSelectedVesselImo(vessels[0].imo)
    }
  }, [vessels, selectedVesselImo])

  const selectedVessel = useMemo(
    () => vessels.find((v) => v.imo === selectedVesselImo) || vessels[0],
    [vessels, selectedVesselImo]
  )

  const currentCargo = useMemo(
    () => (selectedVessel ? cargoes.find((c) => c.vessel === selectedVessel.name) : null),
    [cargoes, selectedVessel]
  )

  const baseline = selectedVessel?.estimatedConsumption?.VLSFO || 42

  const handleRobChange = (field, value) => {
    if (!selectedVessel) return
    updateVesselROB(selectedVessel.imo, {
      ...selectedVessel.currentROB,
      [field]: Number(value || 0),
    })
  }

  const handleSubmitRob = () => {
    if (!selectedVessel) return
    toast.success("ROB submitted to operator")
  }

  const handleAckPlan = () => {
    toast.success("Acknowledged bunker plan")
  }

  if (!currentUser || currentUser.role !== "VESSEL") return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">⚓</span>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-gray-900">Fuel Sense</span>
                <span className="text-[11px] sm:text-xs text-gray-500">Vessel</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {selectedVessel && (
              <Select value={selectedVesselImo || ""} onValueChange={setSelectedVesselImo}>
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

      <main className="p-4 sm:p-6 space-y-4">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle>Vessel snapshot</CardTitle>
              <CardDescription>Confirm ROB and consumption for bunker planning</CardDescription>
            </div>
            <Badge className="bg-primary-600 text-white">
              {selectedVessel?.status?.replace("_", " ") || "No vessel"}
            </Badge>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Info title="Vessel" value={selectedVessel?.name || "N/A"} subtitle={`IMO ${selectedVessel?.imo || "-"}`} />
            <Info
              title="Route"
              value={currentCargo ? `${currentCargo.loadPort} → ${currentCargo.dischargePort}` : "Not assigned"}
              subtitle={`${currentCargo?.distance?.toLocaleString?.() || 0} nm`}
            />
            <Info
              title="Next port / ETA"
              value={selectedVessel?.nextPort || "TBD"}
              subtitle={selectedVessel ? new Date(selectedVessel.ETA).toLocaleString() : "-"}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>ROB verification</CardTitle>
              <CardDescription>Report current ROB</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="VLSFO ROB (MT)"
                  value={selectedVessel?.currentROB?.VLSFO ?? ""}
                  onChange={(e) => handleRobChange("VLSFO", e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="LSMGO ROB (MT)"
                  value={selectedVessel?.currentROB?.LSMGO ?? ""}
                  onChange={(e) => handleRobChange("LSMGO", e.target.value)}
                />
              </div>
              <div className="text-xs text-gray-500">
                Source: last vessel report {selectedVessel?.lastReportTime ? `(${new Date(selectedVessel.lastReportTime).toLocaleString()})` : "(none)"}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSubmitRob}>Submit ROB</Button>
                <Button variant="outline" onClick={() => toast.info("Verification request sent to operator/TSI")}>Request verification</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consumption baselines</CardTitle>
              <CardDescription>Laden / Ballast, good vs bad weather</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Laden • Good weather", value: `${baseline} MT/day` },
                { label: "Laden • Bad weather", value: `${baseline + 6} MT/day` },
                { label: "Ballast • Good weather", value: `${baseline - 4} MT/day` },
                { label: "Ballast • Bad weather", value: `${baseline + 2} MT/day` },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between border rounded-md px-3 py-2">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{row.label}</div>
                    <div className="text-xs text-gray-500">Source: vessel profile (demo)</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">{row.value}</div>
                </div>
              ))}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => toast.info("Sent to bunker planner for verification")}>Ask planner to verify</Button>
                <Button variant="outline" onClick={() => toast.info("Sent to vessel/TSI for verification")}>Ask vessel/TSI</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Voyage context</CardTitle>
              <CardDescription>Distance, weather, geofencing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <InfoRow label="Distance to go" value={`${currentCargo?.distance?.toLocaleString?.() || 0} nm`} />
              <InfoRow label="Weather" value="Favorable, light swell (forecast demo)" />
              <InfoRow label="Geofencing" value="No ECA deviations flagged" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bunker schedule</CardTitle>
              <CardDescription>Next bunkering and acknowledgment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Bunker port" value={selectedVessel?.nextPort || "TBD"} />
              <InfoRow label="ETA" value={selectedVessel ? new Date(selectedVessel.ETA).toLocaleString() : "-"} />
              <InfoRow label="Planned quantity" value="Planned qty per bunker plan (demo)" />
              <div className="flex gap-2">
                <Button onClick={handleAckPlan}>Acknowledge plan</Button>
                <Button variant="outline" onClick={() => toast.info("Clarification requested from planner")}>Request clarification</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function Info({ title, value, subtitle }) {
  return (
    <div className="border rounded-lg p-3 bg-white space-y-1">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-lg font-bold text-gray-900">{value}</div>
      {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border rounded-md px-3 py-2">
      <span className="text-sm text-gray-700">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  )
}

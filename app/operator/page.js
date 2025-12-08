"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { differenceInHours } from "date-fns"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Notifications } from "@/components/Notifications"
import { useStore } from "@/lib/store"
import { MapPin, Ship, Users } from "lucide-react"

export default function OperatorPage() {
  const router = useRouter()
  const { currentUser, setCurrentUser, cargoes, bunkerPlans, vessels, updateBunkerPlanStatus } =
    useStore()

  const [selectedCargoId, setSelectedCargoId] = useState(null)

  // Ensure operator user
  useEffect(() => {
    if (!currentUser) {
      setCurrentUser({
        role: "OPERATOR",
        name: "Operator",
        email: "operator@fuelsense.com",
      })
      return
    }
    if (currentUser.role !== "OPERATOR") {
      router.push("/")
    }
  }, [currentUser, router, setCurrentUser])

  // Default selection
  useEffect(() => {
    if (!selectedCargoId && cargoes.length > 0) {
      setSelectedCargoId(cargoes[0].id)
    }
  }, [cargoes, selectedCargoId])

  const selectedCargo = useMemo(
    () => cargoes.find((c) => c.id === selectedCargoId) || cargoes[0],
    [cargoes, selectedCargoId]
  )

  const selectedVessel = useMemo(() => {
    if (!selectedCargo) return null
    return vessels.find((v) => v.cargoId === selectedCargo.id || v.name === selectedCargo.vessel)
  }, [selectedCargo, vessels])

  const plan = useMemo(() => {
    if (!selectedCargo) return null
    const existing = bunkerPlans.find((p) => p.cargoId === selectedCargo.id)
    if (existing) return existing
    if (selectedCargo.bunkerPorts?.length) {
      const best = [...selectedCargo.bunkerPorts].sort((a, b) => a.totalCost - b.totalCost)[0]
      return {
        id: `SIM-${selectedCargo.id}`,
        cargoId: selectedCargo.id,
        cargoName: `${selectedCargo.loadPort} → ${selectedCargo.dischargePort}`,
        port: best.name,
        quantity: best.quantity,
        fuelType: best.fuelType,
        supplier: best.supplier,
        reliability: best.reliability,
        pricePerMT: best.price,
        totalCost: best.totalCost,
        status: "PENDING_APPROVAL",
        createdAt: new Date().toISOString(),
      }
    }
    return null
  }, [bunkerPlans, selectedCargo])

  const robBadge = useMemo(() => {
    if (!selectedVessel?.lastReportTime) return { label: "Not verified", color: "bg-warning" }
    const hours = differenceInHours(new Date(), new Date(selectedVessel.lastReportTime))
    return hours <= 24
      ? { label: "ROB verified (<24h)", color: "bg-success" }
      : { label: "Needs ROB verification", color: "bg-warning" }
  }, [selectedVessel])

  const handleApprove = () => {
    if (!plan) return
    updateBunkerPlanStatus(plan.id, "APPROVED", `${currentUser.name} (Operator)`, null)
    toast.success("Plan approved and sent to charterer & vessel")
  }

  const handleRequestVerification = () => {
    toast.info("Verification request sent to vessel/TSI")
  }

  if (!currentUser || currentUser.role !== "OPERATOR") return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">⚓</span>
              <span className="text-xl font-bold text-gray-900">Fuel Sense</span>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-lg font-semibold text-gray-900">Operator — Optimization</h1>
          </div>
          <div className="flex items-center gap-3">
            <Notifications />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md">
              <Users className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{currentUser.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
              <CardTitle>Select voyage</CardTitle>
              <CardDescription>Review inputs and approve bunker recommendation</CardDescription>
            </div>
            <Select value={selectedCargoId || ""} onValueChange={setSelectedCargoId}>
              <SelectTrigger className="w-[260px]">
                <SelectValue placeholder="Pick voyage" />
              </SelectTrigger>
              <SelectContent>
                {cargoes.map((cargo) => (
                  <SelectItem key={cargo.id} value={cargo.id}>
                    {cargo.loadPort} → {cargo.dischargePort} ({cargo.vessel})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
        </Card>

        <Tabs defaultValue="inputs" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="inputs">Verified inputs</TabsTrigger>
            <TabsTrigger value="recommendation">Recommendation</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="inputs">
            <Card>
                    <CardHeader>
                <CardTitle>Verification summary</CardTitle>
                <CardDescription>ROB, consumption, weather, geofence</CardDescription>
                    </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MiniInfo title="ROB status" value={`${selectedVessel?.currentROB?.VLSFO || 0} MT`} badge={robBadge} />
                <MiniInfo
                  title="Consumption baseline"
                  value={`${selectedVessel?.estimatedConsumption?.VLSFO || 42} MT/day`}
                  badge={{ label: "Source: vessel profile", color: "bg-primary-600" }}
                />
                <MiniInfo
                  title="Route & distance"
                  value={`${selectedCargo?.loadPort} → ${selectedCargo?.dischargePort}`}
                  badge={{ label: `${(selectedCargo?.distance || 0).toLocaleString()} nm`, color: "bg-secondary" }}
                />
                <MiniInfo title="Weather" value="Favorable (forecast)" badge={{ label: "Source: NOAA (demo)", color: "bg-muted text-gray-900" }} />
                <MiniInfo title="Geofencing" value="No extra deviation" badge={{ label: "Route cleared", color: "bg-success text-white" }} />
                <MiniInfo title="Data freshness" value="All inputs <24h" badge={{ label: "OK", color: "bg-success text-white" }} />
                              </CardContent>
                            </Card>
          </TabsContent>

          <TabsContent value="recommendation">
                            <Card>
                              <CardHeader>
                <CardTitle>Recommended bunker plan</CardTitle>
                <CardDescription>Minimum cost while maintaining quality</CardDescription>
                              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-3 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary-600" />
                      <span className="font-semibold text-gray-900">Port & supplier</span>
                                    </div>
                    <Badge className="bg-success text-white">Best value</Badge>
                                  </div>
                  {plan ? (
                    <>
                      <div className="text-lg font-bold text-gray-900">{plan.port}</div>
                      <div className="text-sm text-gray-700">
                        Supplier: {plan.supplier} ({plan.reliability}% reliability)
                                  </div>
                      <div className="text-sm text-gray-700">
                        Quantity: {plan.quantity} MT {plan.fuelType}
                                </div>
                      <div className="text-sm text-gray-700">Price: ${plan.pricePerMT}/MT</div>
                      <div className="text-sm text-gray-700">
                        Total cost: ${plan.totalCost?.toLocaleString?.() || plan.totalCost}
                      </div>
                      <div className="text-xs text-gray-500">Data source: market feed & route ports</div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">No plan available.</p>
              )}
            </div>

                <div className="border rounded-lg p-3 bg-white space-y-2">
                  <div className="flex items-center gap-2">
                    <Ship className="h-4 w-4 text-primary-600" />
                    <span className="font-semibold text-gray-900">Inputs used</span>
                            </div>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>ROB: {selectedVessel?.currentROB?.VLSFO || 0} MT ({robBadge.label})</li>
                    <li>Consumption baseline: {selectedVessel?.estimatedConsumption?.VLSFO || 42} MT/day</li>
                    <li>Distance: {(selectedCargo?.distance || 0).toLocaleString()} nm</li>
                    <li>Weather: Favorable (forecast)</li>
                    <li>Geofence: Cleared</li>
                  </ul>
                  <div className="text-xs text-gray-500">Confidence: 90% (demo)</div>
                        </div>
                      </CardContent>
                    </Card>
          </TabsContent>

          <TabsContent value="actions">
            <Card>
              <CardHeader>
                <CardTitle>Decide & notify</CardTitle>
                <CardDescription>Confirm, request verification, or ask for alternatives</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  <Button className="bg-success hover:bg-green-600" onClick={handleApprove}>
                    Approve & notify
                  </Button>
                  <Button variant="outline" onClick={handleRequestVerification}>
                    Request vessel/TSI verification
                  </Button>
                  <Button variant="outline" onClick={() => toast.info("Alternative request sent")}>
                    Request alternative
                  </Button>
                  <Button variant="outline" onClick={() => toast.info("Asked AI for reasoning")}>
                    Ask AI why
                  </Button>
                </div>
                <div className="text-xs text-gray-500">
                  Actions send alerts to charterer, vessel, and bunker planner (simulated).
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
              </div>
  )
}

function MiniInfo({ title, value, badge }) {
  return (
    <div className="border rounded-lg p-3 bg-white space-y-1">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-lg font-bold text-gray-900">{value}</div>
      {badge && <Badge className={`${badge.color} text-white`}>{badge.label}</Badge>}
    </div>
  )
}

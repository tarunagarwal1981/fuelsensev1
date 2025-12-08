"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { formatDistanceToNow, differenceInHours } from "date-fns"
import { toast } from "sonner"
import {
  AlertTriangle,
  Anchor,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Cloud,
  MapPin,
  MessageSquare,
  Radio,
  Ship,
  ThermometerSun,
  Waypoints,
} from "lucide-react"

import { Notifications } from "@/components/Notifications"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const BASELINES = [
  { mode: "Laden", weather: "Good", rate: 42, source: "Vessel profile (last 30d)" },
  { mode: "Laden", weather: "Bad", rate: 48, source: "Vessel profile (last 30d)" },
  { mode: "Ballast", weather: "Good", rate: 38, source: "Vessel profile (last 30d)" },
  { mode: "Ballast", weather: "Bad", rate: 44, source: "Vessel profile (last 30d)" },
]

export default function ChartererPage() {
  const router = useRouter()
  const { currentUser, setCurrentUser, cargoes, vessels, fixCargo } = useStore()
  const [selectedCargoId, setSelectedCargoId] = useState(null)
  const [qaResponse, setQaResponse] = useState("")

  // Redirect / set user
  useEffect(() => {
    if (!currentUser) {
      setCurrentUser({
        role: "CHARTERER",
        name: "Charterer",
        email: "charterer@fuelsense.com",
      })
      return
    }
    if (currentUser.role !== "CHARTERER") {
      router.push("/")
    }
  }, [currentUser, router, setCurrentUser])

  // Default cargo selection
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

  // Derived metrics
  const robVerified = useMemo(() => {
    if (!selectedVessel?.lastReportTime) return { label: "Not verified", color: "bg-warning" }
    const hours = differenceInHours(new Date(), new Date(selectedVessel.lastReportTime))
    return hours <= 24
      ? { label: "Verified (<24h)", color: "bg-success" }
      : { label: "Needs verification", color: "bg-warning" }
  }, [selectedVessel])

  const distanceNm = selectedCargo?.distance || 0
  const baselineRate = selectedVessel?.estimatedConsumption?.VLSFO || BASELINES[0].rate
  const expectedConsumption = baselineRate * (selectedCargo?.duration || 0)
  const robOnBoard = selectedVessel?.currentROB?.VLSFO || 0
  const bunkerRequirement = Math.max(0, Math.round(expectedConsumption - robOnBoard))

  const bestPort = useMemo(() => {
    if (!selectedCargo?.bunkerPorts?.length) return null
    return [...selectedCargo.bunkerPorts].sort((a, b) => a.totalCost - b.totalCost)[0]
  }, [selectedCargo])

  const topSuppliers = useMemo(() => {
    return (selectedCargo?.bunkerPorts || []).map((p) => ({
      port: p.name,
      supplier: p.supplier,
      price: p.price,
      reliability: p.reliability,
      fuelType: p.fuelType,
    }))
  }, [selectedCargo])

  const handleFix = () => {
    if (!selectedCargo) return
    fixCargo(selectedCargo.id)
    toast.success("Cargo confirmed and sent to bunker planner")
  }

  const handleVerificationRequest = (target) => {
    toast.info(`Verification request sent to ${target}`)
  }

  const handleQA = (question) => {
    if (!selectedCargo || !selectedVessel) return
    const answers = {
      consumption: `${selectedVessel.name}: ${baselineRate} MT/day (VLSFO baseline)`,
      distance: `${selectedCargo.loadPort} → ${selectedCargo.dischargePort}: ${distanceNm.toLocaleString()} nm`,
      prices: `Lowest along route: ${bestPort?.name || "N/A"} at $${bestPort?.price || "—"}/MT`,
      suppliers: `${topSuppliers.slice(0, 3).map((s) => `${s.supplier} (${s.port})`).join(", ")}`,
      weather: `Forecast: Favorable, small swell. Source: NOAA model`,
      hull: `${selectedVessel.name}: clean hull (last clean 45 days ago)`,
      emissions: `${selectedVessel.name}: CII rating B (simulated)`,
      speedProfile: `Typical: 12-15 kts; consumption 38-48 MT/day depending on weather`,
    }
    setQaResponse(answers[question] || "No data")
  }

  if (!currentUser || currentUser.role !== "CHARTERER") return null

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
            <h1 className="text-lg font-semibold text-gray-900">Charterer — Bunker Planning</h1>
          </div>
          <div className="flex items-center gap-3">
            <Notifications />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md">
              <Building2 className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{currentUser.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Voyage selector + quick stats */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle>Select voyage option</CardTitle>
              <CardDescription>Ask agent with one-click and see bunker requirements</CardDescription>
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
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Stat title="Distance to go" value={`${distanceNm.toLocaleString()} nm`} icon={<Waypoints className="h-4 w-4" />} />
            <Stat title="Current ROB" value={`${robOnBoard} MT VLSFO`} badge={robVerified} icon={<Radio className="h-4 w-4" />} />
            <Stat title="Expected burn" value={`${Math.round(expectedConsumption)} MT`} subtitle={`Baseline ${baselineRate} MT/day`} icon={<ThermometerSun className="h-4 w-4" />} />
            <Stat title="Bunker needed" value={`${bunkerRequirement} MT`} subtitle="Before arrival" icon={<Anchor className="h-4 w-4" />} />
          </CardContent>
        </Card>

        <Tabs defaultValue="verify" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="verify">Verify inputs</TabsTrigger>
            <TabsTrigger value="market">Route & market</TabsTrigger>
            <TabsTrigger value="optimize">Optimization</TabsTrigger>
            <TabsTrigger value="bot">Bot Q&A</TabsTrigger>
          </TabsList>

          {/* Verification */}
          <TabsContent value="verify" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>ROB & consumption verification</CardTitle>
                <CardDescription>Confirm the numbers before running optimization</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  title="Current ROB"
                  value={`${robOnBoard} MT VLSFO`}
                  badge={robVerified}
                  items={[
                    `Source: vessel self report (${formatDistanceToNow(new Date(selectedVessel?.lastReportTime || new Date()))} ago)`,
                    "Action: request vessel/TSI verification",
                  ]}
                  onAction={() => handleVerificationRequest("vessel / TSI")}
                />
                <InfoCard
                  title="Consumption baselines"
                  value={`${baselineRate} MT/day (VLSFO)`}
                  items={BASELINES.map((b) => `${b.mode} • ${b.weather}: ${b.rate} MT/day (${b.source})`)}
                  onAction={() => handleVerificationRequest("bunker planner")}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Voyage estimates</CardTitle>
                <CardDescription>Distance, weather, geofencing</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoPill title="Route & distance" lines={[`${selectedCargo?.loadPort} → ${selectedCargo?.dischargePort}`, `${distanceNm.toLocaleString()} nm`, "Source: route engine (simulated)"]} icon={<Waypoints className="h-4 w-4" />} />
                <InfoPill title="Weather forecast" lines={["Favorable, light swell", "Source: NOAA GFS (6h)"]} icon={<Cloud className="h-4 w-4" />} />
                <InfoPill title="Geofencing" lines={["No ECA deviations flagged", "Source: planned route constraints"]} icon={<AlertTriangle className="h-4 w-4 text-warning" />} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market & ports */}
          <TabsContent value="market">
            <Card>
              <CardHeader>
                <CardTitle>Ports & suppliers along route</CardTitle>
                <CardDescription>Prices, suppliers, quality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topSuppliers.map((s) => (
                  <div key={`${s.port}-${s.supplier}`} className="flex items-center justify-between border rounded-md p-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary-600" />
                        <span className="font-semibold">{s.port}</span>
                        <Badge variant="secondary">{s.fuelType}</Badge>
                      </div>
                      <div className="text-sm text-gray-700">{s.supplier}</div>
                      <div className="text-xs text-gray-500">Data source: market feed (demo)</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">${s.price}/MT</div>
                      <Badge className="bg-success text-white">{s.reliability}% quality</Badge>
                    </div>
                  </div>
                ))}
                {!topSuppliers.length && <p className="text-sm text-gray-500">No ports on this route.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Optimization */}
          <TabsContent value="optimize">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle>Run optimization</CardTitle>
                  <CardDescription>Minimum cost while keeping quality</CardDescription>
                </div>
                <Button onClick={handleFix}>
                  Confirm & alert planner
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Recommended port</h4>
                  {bestPort ? (
                    <div className="border rounded-md p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{bestPort.name}</span>
                        <Badge className="bg-success text-white">Best value</Badge>
                      </div>
                      <div className="text-sm text-gray-700">
                        Supplier: {bestPort.supplier} • {bestPort.reliability}% reliability
                      </div>
                      <div className="text-sm text-gray-700">Quantity: {bestPort.quantity} MT {bestPort.fuelType}</div>
                      <div className="text-sm text-gray-700">Total cost: ${bestPort.totalCost.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Data source: route ports & market feed</div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No port options available.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Inputs used</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>ROB: {robOnBoard} MT ({robVerified.label})</li>
                    <li>Baseline: {baselineRate} MT/day (Laden good weather)</li>
                    <li>Distance: {distanceNm.toLocaleString()} nm</li>
                    <li>Weather: Favorable (forecast)</li>
                    <li>Geofencing: No extra deviation</li>
                  </ul>
                  <Separator />
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleVerificationRequest("bunker planner")}>
                      Request planner verification
                    </Button>
                    <Button variant="outline" onClick={() => handleVerificationRequest("vessel")}>
                      Ask vessel to confirm
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bot */}
          <TabsContent value="bot">
            <Card>
              <CardHeader>
                <CardTitle>Ask the bunker bot</CardTitle>
                <CardDescription>Quick answers for this voyage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Chip onClick={() => handleQA("consumption")}>Tell me bunker consumption</Chip>
                  <Chip onClick={() => handleQA("distance")}>Distance between two ports</Chip>
                  <Chip onClick={() => handleQA("prices")}>Bunker prices for ports</Chip>
                  <Chip onClick={() => handleQA("suppliers")}>List suppliers by port</Chip>
                  <Chip onClick={() => handleQA("weather")}>Weather forecast</Chip>
                  <Chip onClick={() => handleQA("hull")}>Vessel hull condition</Chip>
                  <Chip onClick={() => handleQA("emissions")}>Current emissions rating</Chip>
                  <Chip onClick={() => handleQA("speedProfile")}>Speed/consumption profile</Chip>
                </div>
                <div className="border rounded-md p-3 bg-gray-50 min-h-[80px]">
                  {qaResponse || "Select a question to see the answer."}
                </div>
                <div className="text-xs text-gray-500">All responses are mock data for demo mode.</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function Stat({ title, value, subtitle, badge, icon }) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-white p-3">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {icon}
          <span>{title}</span>
        </div>
        <div className="text-xl font-bold text-gray-900">{value}</div>
        {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
      </div>
      {badge && <Badge className={`${badge.color} text-white`}>{badge.label}</Badge>}
    </div>
  )
}

function InfoCard({ title, value, items = [], badge, onAction }) {
  return (
    <div className="border rounded-lg p-3 bg-white space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-gray-900">{title}</div>
        {badge && <Badge className={`${badge.color} text-white`}>{badge.label}</Badge>}
      </div>
      <div className="text-lg font-bold text-gray-900">{value}</div>
      <ul className="space-y-1 text-sm text-gray-700">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Request verification
        </Button>
      )}
    </div>
  )
}

function InfoPill({ title, lines = [], icon }) {
  return (
    <div className="border rounded-lg p-3 bg-white space-y-1">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
        {icon}
        <span>{title}</span>
      </div>
      {lines.map((line) => (
        <div key={line} className="text-sm text-gray-700">
          {line}
        </div>
      ))}
    </div>
  )
}

function Chip({ children, onClick }) {
  return (
    <Button variant="outline" size="sm" className="rounded-full" onClick={onClick}>
      {children}
    </Button>
  )
}

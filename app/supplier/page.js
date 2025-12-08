"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Notifications } from "@/components/Notifications"
import { useStore } from "@/lib/store"
import { DollarSign, Fuel, MapPin, Star } from "lucide-react"

export default function SupplierPage() {
  const router = useRouter()
  const { currentUser, setCurrentUser, cargoes } = useStore()
  const [selectedCargoId, setSelectedCargoId] = useState(null)

  useEffect(() => {
    if (!currentUser) {
      setCurrentUser({
        role: "SUPPLIER",
        name: "Supplier",
        email: "supplier@fuelsense.com",
      })
      return
    }
    if (currentUser.role !== "SUPPLIER") {
      router.push("/")
    }
  }, [currentUser, router, setCurrentUser])

  useEffect(() => {
    if (!selectedCargoId && cargoes.length > 0) {
      setSelectedCargoId(cargoes[0].id)
    }
  }, [cargoes, selectedCargoId])

  const selectedCargo = useMemo(
    () => cargoes.find((c) => c.id === selectedCargoId) || cargoes[0],
    [cargoes, selectedCargoId]
  )

  const ports = useMemo(() => selectedCargo?.bunkerPorts || [], [selectedCargo])

  const handleOfferQuote = (port) => {
    toast.success(`Quote offered for ${port.name} (${port.supplier})`)
  }

  if (!currentUser || currentUser.role !== "SUPPLIER") return null

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
            <h1 className="text-lg font-semibold text-gray-900">Supplier — Route Ports</h1>
          </div>
          <div className="flex items-center gap-3">
            <Notifications />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md">
              <Fuel className="h-4 w-4 text-gray-600" />
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
              <CardDescription>See ports along the route and offer quotes</CardDescription>
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

        <Tabs defaultValue="ports" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="ports">Ports & suppliers</TabsTrigger>
            <TabsTrigger value="pricing">Pricing snapshot</TabsTrigger>
          </TabsList>

          <TabsContent value="ports" className="space-y-3">
            {ports.map((port) => (
              <Card key={`${port.name}-${port.supplier}`}>
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary-600" />
                      <span className="font-semibold text-gray-900">{port.name}</span>
                      <Badge variant="secondary">{port.fuelType}</Badge>
                    </div>
                    <div className="text-sm text-gray-700">Supplier: {port.supplier}</div>
                    <div className="text-xs text-gray-500">Data source: market feed (demo)</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-semibold">${port.price}/MT</div>
                      <div className="text-sm text-gray-700">{port.quantity} MT requested</div>
                      <Badge className="bg-success text-white">{port.reliability}% quality</Badge>
                    </div>
                    <Button onClick={() => handleOfferQuote(port)}>Offer quote</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!ports.length && <p className="text-sm text-gray-500">No route ports available.</p>}
          </TabsContent>

          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Route pricing overview</CardTitle>
                <CardDescription>Fuel prices by port on this route</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {ports.map((port) => (
                  <div key={`${port.name}-price`} className="border rounded-lg p-3 bg-white space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">{port.name}</span>
                      <Badge variant="secondary">{port.fuelType}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <DollarSign className="h-4 w-4" />
                      <span>${port.price}/MT</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Star className="h-4 w-4 text-warning" />
                      <span>{port.reliability}% quality</span>
                    </div>
                    <div className="text-xs text-gray-500">Updated: live feed (demo)</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MapPin, Ship, Calendar, DollarSign, Fuel, AlertTriangle } from "lucide-react"
import { format } from "date-fns"

/**
 * Cargo Details Panel - Slide-in panel from right with tabs
 * Shows comprehensive cargo information
 */
export function CargoDetailsPanel({ open, onOpenChange, cargo }) {
  if (!cargo) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {cargo.loadPort} → {cargo.dischargePort}
          </SheetTitle>
          <SheetDescription>
            Comprehensive cargo analysis and bunker planning
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="bunker">Bunker Plan</TabsTrigger>
            <TabsTrigger value="risks">Risks</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Voyage Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium">{cargo.distance} NM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{cargo.duration} days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ship className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Vessel:</span>
                  <span className="font-medium">{cargo.vessel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Laycan:</span>
                  <span className="font-medium">
                    {format(new Date(cargo.laycanStart), "MMM d")} -{" "}
                    {format(new Date(cargo.laycanEnd), "MMM d, yyyy")}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Route Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm">
                  Interactive route map (placeholder)
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financials Tab */}
          <TabsContent value="financials" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">P&L Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Freight Revenue</TableCell>
                      <TableCell className="text-right">
                        ${(cargo.freight / 1000).toFixed(0)}K
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Bunker Cost</TableCell>
                      <TableCell className="text-right text-red-600">
                        -${(cargo.bunkerCost / 1000).toFixed(0)}K
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Port Costs</TableCell>
                      <TableCell className="text-right text-red-600">
                        -${(cargo.portCosts / 1000).toFixed(0)}K
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Other Costs</TableCell>
                      <TableCell className="text-right text-red-600">
                        -${(cargo.otherCosts / 1000).toFixed(0)}K
                      </TableCell>
                    </TableRow>
                    <TableRow className="font-bold bg-gray-50">
                      <TableCell>Net Profit</TableCell>
                      <TableCell className="text-right text-success">
                        ${(cargo.profit / 1000).toFixed(0)}K
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost per day:</span>
                  <span className="font-medium">
                    ${((cargo.bunkerCost + cargo.portCosts + cargo.otherCosts) / cargo.duration / 1000).toFixed(1)}K
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Break-even freight:</span>
                  <span className="font-medium">
                    ${((cargo.bunkerCost + cargo.portCosts + cargo.otherCosts) / 1000).toFixed(0)}K
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bunker Plan Tab */}
          <TabsContent value="bunker" className="space-y-4 mt-4">
            {cargo.bunkerPorts && cargo.bunkerPorts.length > 0 ? (
              <div className="space-y-3">
                {cargo.bunkerPorts.map((port, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Fuel className="h-4 w-4" />
                        {port.name}, {port.country}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-gray-600">Price:</span>
                          <span className="ml-2 font-medium">${port.price}/MT</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Quantity:</span>
                          <span className="ml-2 font-medium">{port.quantity} MT</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Supplier:</span>
                          <span className="ml-2 font-medium">{port.supplier}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Reliability:</span>
                          <span className="ml-2 font-medium">{port.reliability}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Delivery:</span>
                          <span className="ml-2 font-medium">{port.deliveryHours} hours</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Cost:</span>
                          <span className="ml-2 font-medium">
                            ${(port.totalCost / 1000).toFixed(0)}K
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No bunker options available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Risks Tab */}
          <TabsContent value="risks" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Overall Risk:</span>
                  <Badge className={
                    cargo.risk === "LOW" ? "bg-success text-white" :
                    cargo.risk === "MEDIUM" ? "bg-warning text-black" :
                    "bg-danger text-white"
                  }>
                    {cargo.risk}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Confidence:</span>
                  <span className="font-medium">{cargo.confidence}%</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="text-sm font-medium mb-2">Weather Forecast (7-day)</div>
                  <div className="text-xs text-gray-600">
                    <div className="mb-1">15% delay risk - manageable conditions expected</div>
                    <div>No major storms forecasted in route area</div>
                  </div>
                </div>
                {cargo.aiReasoning && (
                  <div className="pt-3 border-t">
                    <div className="text-sm font-medium mb-2">AI Reasoning</div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {cargo.aiReasoning.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span>•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}


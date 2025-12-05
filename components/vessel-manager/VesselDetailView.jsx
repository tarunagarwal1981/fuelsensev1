"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BarChart3, TrendingUp, Wrench, ShieldCheck } from "lucide-react"
import { format } from "date-fns"
import { VesselPerformanceMetrics } from "./VesselPerformanceMetrics"
import { VesselTrendChart } from "./VesselTrendChart"
import { SisterVesselComparison } from "./SisterVesselComparison"
import { RootCauseAnalysis } from "./RootCauseAnalysis"

export function VesselDetailView({ vessel, onBack }) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!vessel) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Fleet
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{vessel.name} - Detailed Analysis</h2>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance">
            <TrendingUp className="mr-2 h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <Wrench className="mr-2 h-4 w-4" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Compliance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Vessel Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>VESSEL DETAILS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">IMO:</span>
                  <span className="font-semibold">{vessel.imo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-semibold">{vessel.type || "Bulk Carrier"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Built:</span>
                  <span className="font-semibold">{vessel.built || 2015}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">DWT:</span>
                  <span className="font-semibold">{vessel.dwt?.toLocaleString() || "82,000"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Flag:</span>
                  <span className="font-semibold">{vessel.flag || "Liberia"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Class:</span>
                  <span className="font-semibold">{vessel.class || "DNV"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Master:</span>
                  <span className="font-semibold">{vessel.master || "Capt. John Smith"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chief Eng:</span>
                  <span className="font-semibold">{vessel.chiefEngineer || "Eng. Michael Johnson"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CURRENT STATUS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {vessel.currentStatus && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Position:</span>
                      <span className="font-semibold">
                        {vessel.currentStatus.position?.lat?.toFixed(1)}°N, {vessel.currentStatus.position?.lon?.toFixed(1)}°E
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance to next port:</span>
                      <span className="font-semibold">{vessel.currentStatus.distanceToNextPort} nm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Port:</span>
                      <span className="font-semibold">{vessel.currentStatus.nextPort}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Speed:</span>
                      <span className="font-semibold">{vessel.currentStatus.speed} knots</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Heading:</span>
                      <span className="font-semibold">{vessel.currentStatus.heading}°</span>
                    </div>
                    {vessel.currentStatus.voyage && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Voyage:</span>
                          <span className="font-semibold">
                            {vessel.currentStatus.voyage.from} → {vessel.currentStatus.voyage.to}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Day:</span>
                          <span className="font-semibold">
                            {vessel.currentStatus.voyage.day} of {vessel.currentStatus.voyage.totalDays}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ETA:</span>
                          <span className="font-semibold">
                            {format(new Date(vessel.currentStatus.voyage.eta), "MMM d, HH:mm")}
                          </span>
                        </div>
                      </>
                    )}
                    {vessel.currentStatus.rob && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ROB:</span>
                          <span className="font-semibold">
                            {vessel.currentStatus.rob.vlsfo} MT VLSFO, {vessel.currentStatus.rob.lsmgo} MT LSMGO
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Days remaining:</span>
                          <span className="font-semibold">{vessel.currentStatus.rob.daysRemaining}</span>
                        </div>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Performance Trend */}
          {vessel.trend && <VesselTrendChart trend={vessel.trend} />}

          {/* Sister Vessel Comparison */}
          {vessel.sisterVesselComparison && (
            <SisterVesselComparison comparison={vessel.sisterVesselComparison} currentVessel={vessel.name} />
          )}

          {/* Root Cause Analysis */}
          {vessel.rootCauseAnalysis && <RootCauseAnalysis analysis={vessel.rootCauseAnalysis} />}
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <VesselPerformanceMetrics vessel={vessel} />
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance History & Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Maintenance details coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Compliance details coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


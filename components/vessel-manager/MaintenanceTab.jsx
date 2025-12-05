"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Droplets, Ship, Wrench } from "lucide-react"
import { MaintenanceCalendar } from "./MaintenanceCalendar"
import { HullCleaningManagement } from "./HullCleaningManagement"
import { DrydockingPlanner } from "./DrydockingPlanner"
import { PMSchedule } from "./PMSchedule"

export function MaintenanceTab() {
  const [activeView, setActiveView] = useState("calendar")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">MAINTENANCE - Fleet-Wide Planning & Tracking</h2>
        <p className="text-gray-600">Plan and track all maintenance activities across the fleet</p>
      </div>

      {/* View Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="w-full max-w-2xl">
          <TabsTrigger value="calendar" className="flex-1">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="hull-cleaning" className="flex-1">
            <Droplets className="mr-2 h-4 w-4" />
            Hull Cleaning
          </TabsTrigger>
          <TabsTrigger value="drydocking" className="flex-1">
            <Ship className="mr-2 h-4 w-4" />
            Drydocking
          </TabsTrigger>
          <TabsTrigger value="pm-schedule" className="flex-1">
            <Wrench className="mr-2 h-4 w-4" />
            PM Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <MaintenanceCalendar />
        </TabsContent>

        <TabsContent value="hull-cleaning" className="mt-6">
          <HullCleaningManagement />
        </TabsContent>

        <TabsContent value="drydocking" className="mt-6">
          <DrydockingPlanner />
        </TabsContent>

        <TabsContent value="pm-schedule" className="mt-6">
          <PMSchedule />
        </TabsContent>
      </Tabs>
    </div>
  )
}

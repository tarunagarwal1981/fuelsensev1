"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Construction } from "lucide-react"

export function MaintenanceTab() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
          <Construction className="h-10 w-10 text-orange-600" />
        </div>
        <CardTitle className="text-2xl">Maintenance Tab - Coming Soon</CardTitle>
        <CardDescription className="text-base">
          Fleet-wide maintenance planning and scheduling
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-3 text-gray-900">Planned Features:</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-1">•</span>
              <span>Hull cleaning schedule and optimization</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-1">•</span>
              <span>Drydocking planner and cost analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-1">•</span>
              <span>Preventive maintenance calendar</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-1">•</span>
              <span>Spare parts tracking and inventory</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-1">•</span>
              <span>Vendor management and performance</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}


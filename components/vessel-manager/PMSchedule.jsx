"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Construction } from "lucide-react"

export function PMSchedule() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Construction className="h-5 w-5 text-orange-600" />
          <CardTitle>Preventive Maintenance Schedule</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Preventive maintenance schedule and tracking coming soon...</p>
      </CardContent>
    </Card>
  )
}


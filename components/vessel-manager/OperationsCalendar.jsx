"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download } from "lucide-react"
import { format } from "date-fns"

export function OperationsCalendar({ events = [] }) {
  const now = new Date()
  const defaultEvents = {
    bunkering: [
      {
        date: now,
        vessel: "MV Ocean Star",
        port: "Port Klang",
        quantity: "850 MT VLSFO",
        supplier: "Shell Marine",
        eta: "18:00",
        status: "confirmed",
        supplierStatus: "supplier en route",
      },
      {
        date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        vessel: "MV Pacific Voyager",
        port: "Fujairah",
        quantity: "920 MT VLSFO",
        supplier: "TotalEnergies",
        status: "pending",
        supplierStatus: "Pending supplier confirmation",
      },
      {
        date: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
        vessel: "MV Baltic",
        port: "Singapore",
        quantity: "780 MT VLSFO, 120 MT LSMGO",
        status: "approved",
        supplierStatus: "Plan approved, nomination sent",
      },
    ],
    maintenance: [
      {
        date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        vessel: "MV Atlantic",
        activity: "Main engine service",
        port: "Rotterdam",
        duration: "8 hours",
        status: "scheduled",
        details: "Scheduled with port agent",
      },
      {
        date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        vessel: "MV Coral",
        activity: "Hull cleaning",
        port: "Los Angeles",
        duration: "12 hours",
        status: "scheduled",
        details: "HullWiper booked",
      },
    ],
    portCalls: 8,
  }

  const displayEvents = events.length > 0 ? events : defaultEvents

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-600">✅ Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-600">⏳ Pending</Badge>
      case "approved":
        return <Badge className="bg-blue-600">📋 Plan approved</Badge>
      case "scheduled":
        return <Badge className="bg-green-600">✅ Scheduled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">📅 OPERATIONS CALENDAR (Next 7 Days)</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              View Full Calendar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export to iCal
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bunkering Operations */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-gray-900">BUNKERING OPERATIONS ({displayEvents.bunkering?.length || 0} planned):</h3>
          <div className="space-y-4">
            {displayEvents.bunkering?.map((event, idx) => (
              <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <div className="font-semibold text-sm">
                      {format(event.date, "MMM d")} - {event.vessel} @ {event.port}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      └─ {event.quantity}
                      {event.supplier && `, ${event.supplier}`}
                      {event.eta && `, ETA ${event.eta}`}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      └─ Status: {getStatusBadge(event.status)} {event.supplierStatus && `, ${event.supplierStatus}`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Activities */}
        <div className="pt-4 border-t">
          <h3 className="font-semibold text-lg mb-3 text-gray-900">MAINTENANCE ACTIVITIES ({displayEvents.maintenance?.length || 0} planned):</h3>
          <div className="space-y-4">
            {displayEvents.maintenance?.map((event, idx) => (
              <div key={idx} className="border-l-4 border-orange-500 pl-4 py-2">
                <div className="font-semibold text-sm">
                  {format(event.date, "MMM d")} - {event.vessel}: {event.activity} ({event.port})
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  └─ Duration: {event.duration}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  └─ Status: {getStatusBadge(event.status)} {event.details && `, ${event.details}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Port Calls */}
        <div className="pt-4 border-t">
          <div className="text-sm text-gray-600">
            <strong>PORT CALLS:</strong> {displayEvents.portCalls || 0} vessels arriving various ports
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


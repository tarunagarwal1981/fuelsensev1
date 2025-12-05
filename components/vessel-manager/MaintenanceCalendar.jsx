"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachWeekOfInterval, endOfWeek, isSameDay, addMonths, subMonths } from "date-fns"

export function MaintenanceCalendar({ events = [], currentMonth, onMonthChange }) {
  const now = new Date()
  const [month, setMonth] = useState(currentMonth || now)

  const defaultEvents = [
    { date: new Date(2025, 11, 5), vessel: "MV Ocean Star", activity: "Bunkering", port: "Port Klang", type: "bunkering" },
    { date: new Date(2025, 11, 7), vessel: "MV Pacific Voyager", activity: "Bunkering", port: "Fujairah", type: "bunkering" },
    { date: new Date(2025, 11, 7), vessel: "MV Baltic", activity: "Hull inspection", port: "Singapore", type: "inspection" },
    { date: new Date(2025, 11, 8), vessel: "MV Atlantic", activity: "Main engine service", port: "Rotterdam", type: "maintenance" },
    { date: new Date(2025, 11, 10), vessel: "MV Coral", activity: "Hull cleaning", port: "Los Angeles", type: "hull-cleaning" },
    { date: new Date(2025, 11, 12), vessel: "MV Indian Ocean", activity: "Propeller inspection", port: "Mumbai", type: "inspection" },
    { date: new Date(2025, 11, 14), vessel: "MV Caribbean", activity: "Bunker tank cleaning", port: "Fujairah", type: "maintenance" },
    { date: new Date(2025, 11, 16), vessel: "MV Aegean", activity: "Hull cleaning", port: "Piraeus", type: "hull-cleaning" },
    { date: new Date(2025, 11, 18), vessel: "MV Baltic", activity: "Main engine overhaul", port: "Singapore", type: "maintenance" },
    { date: new Date(2025, 11, 20), vessel: "MV Ocean Star", activity: "Hull cleaning", port: "Rotterdam", type: "hull-cleaning", critical: true },
    { date: new Date(2025, 11, 24), vessel: "MV Swift", activity: "Annual survey preparation", port: "Unknown", type: "survey" },
    { date: new Date(2025, 11, 28), vessel: "MV Atlantic", activity: "Auxiliary engine service", port: "Unknown", type: "maintenance" },
  ]

  const displayEvents = events.length > 0 ? events : defaultEvents

  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)
  const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 1 })

  const getEventsForDate = (date) => {
    return displayEvents.filter((event) => isSameDay(event.date, date))
  }

  const getEventColor = (type) => {
    switch (type) {
      case "hull-cleaning":
        return "bg-blue-100 border-blue-300 text-blue-800"
      case "maintenance":
        return "bg-orange-100 border-orange-300 text-orange-800"
      case "inspection":
        return "bg-purple-100 border-purple-300 text-purple-800"
      case "bunkering":
        return "bg-green-100 border-green-300 text-green-800"
      case "survey":
        return "bg-yellow-100 border-yellow-300 text-yellow-800"
      default:
        return "bg-gray-100 border-gray-300 text-gray-800"
    }
  }

  const handlePrevMonth = () => {
    const newMonth = subMonths(month, 1)
    setMonth(newMonth)
    onMonthChange?.(newMonth)
  }

  const handleNextMonth = () => {
    const newMonth = addMonths(month, 1)
    setMonth(newMonth)
    onMonthChange?.(newMonth)
  }

  const handleToday = () => {
    setMonth(now)
    onMonthChange?.(now)
  }

  // Group events by week
  const eventsByWeek = weeks.map((weekStart) => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })
    const weekEvents = displayEvents.filter((event) => {
      const eventDate = event.date
      return eventDate >= weekStart && eventDate <= weekEnd
    })
    return { weekStart, weekEnd, events: weekEvents }
  })

  const criticalCount = displayEvents.filter((e) => e.critical).length
  const dueSoonCount = displayEvents.filter((e) => e.dueSoon).length
  const onScheduleCount = displayEvents.length - criticalCount - dueSoonCount

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
            {format(subMonths(month, 1), "MMMM")}
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            {format(addMonths(month, 1), "MMMM")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h3 className="text-xl font-bold">{format(month, "MMMM yyyy")}</h3>
      </div>

      {/* Critical Actions Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-300 bg-red-50">
          <CardContent className="pt-4">
            <div className="text-sm text-gray-600 mb-1">🔴 CRITICAL</div>
            <div className="text-2xl font-bold text-red-700">{criticalCount} vessels overdue</div>
            <div className="text-xs text-gray-600 mt-1">Action: Now</div>
          </CardContent>
        </Card>
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="pt-4">
            <div className="text-sm text-gray-600 mb-1">🟡 APPROACHING</div>
            <div className="text-2xl font-bold text-yellow-700">{dueSoonCount} vessels approaching window</div>
            <div className="text-xs text-gray-600 mt-1">Plan: 2 weeks</div>
          </CardContent>
        </Card>
        <Card className="border-green-300 bg-green-50">
          <CardContent className="pt-4">
            <div className="text-sm text-gray-600 mb-1">✅ ON SCHEDULE</div>
            <div className="text-2xl font-bold text-green-700">{onScheduleCount} vessels on schedule</div>
            <div className="text-xs text-gray-600 mt-1">Monitor</div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Weeks */}
      <div className="space-y-6">
        {eventsByWeek.map((week, weekIdx) => (
          <Card key={weekIdx}>
            <CardHeader>
              <CardTitle className="text-sm">
                Week {weekIdx + 1} ({format(week.weekStart, "MMM d")} - {format(week.weekEnd, "MMM d")}):
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {week.events.map((event, eventIdx) => (
                  <div
                    key={eventIdx}
                    className={`p-2 rounded border ${getEventColor(event.type)} ${event.critical ? "border-2 border-red-500" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">
                          {format(event.date, "MMM d")}: {event.vessel} - {event.activity}
                        </div>
                        <div className="text-xs opacity-80">@ {event.port}</div>
                      </div>
                      {event.critical && <Badge variant="destructive">🔴 URGENT</Badge>}
                    </div>
                  </div>
                ))}
                {week.events.length === 0 && (
                  <div className="text-sm text-gray-400 italic">No maintenance activities scheduled</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


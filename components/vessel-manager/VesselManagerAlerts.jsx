"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, Info, Settings } from "lucide-react"

export function VesselManagerAlerts({ alerts = [] }) {
  const defaultAlerts = [
    {
      level: "CRITICAL",
      count: 1,
      items: [
        {
          vessel: "MV Ocean Star",
          message: "ROB critically low (145 MT, 18hrs to port)",
          action: "Bunker plan approved, monitoring situation",
        },
      ],
    },
    {
      level: "WARNING",
      count: 2,
      items: [
        {
          vessel: "MV Baltic",
          message: "Hull cleaning due in 15 days",
          action: "Schedule for next port visit",
        },
        {
          vessel: "MV Indian Ocean",
          message: "Weather delay (+8 hrs ETA)",
          action: "Info: Bunker window still acceptable",
        },
      ],
    },
    {
      level: "INFO",
      count: 1,
      items: [
        {
          vessel: "MV Atlantic",
          message: "Excellent performance this voyage",
          action: "Consumption 21.5 MT/day (5% better than plan) ✅",
        },
      ],
    },
  ]

  const displayAlerts = alerts.length > 0 ? alerts : defaultAlerts

  const getIcon = (level) => {
    switch (level) {
      case "CRITICAL":
        return AlertCircle
      case "WARNING":
        return AlertTriangle
      case "INFO":
        return Info
      default:
        return Info
    }
  }

  const getColor = (level) => {
    switch (level) {
      case "CRITICAL":
        return "text-red-600"
      case "WARNING":
        return "text-yellow-600"
      case "INFO":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">🔔 ALERTS & NOTIFICATIONS</CardTitle>
          <Badge variant="secondary">
            {displayAlerts.reduce((sum, alert) => sum + alert.count, 0)} new
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayAlerts.map((alertGroup, idx) => {
          const Icon = getIcon(alertGroup.level)
          const color = getColor(alertGroup.level)

          return (
            <div key={idx} className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon className={`h-5 w-5 ${color}`} />
                <span className="font-semibold text-sm">
                  {alertGroup.level} ({alertGroup.count}):
                </span>
              </div>
              <ul className="ml-7 space-y-2">
                {alertGroup.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="text-sm text-gray-700">
                    <div>
                      • <strong>{item.vessel}:</strong> {item.message}
                    </div>
                    <div className="ml-4 text-xs text-gray-500 mt-1">
                      └─ Action: {item.action}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}

        <div className="pt-4 border-t flex gap-2">
          <Button variant="outline" size="sm">
            View All Alerts (12)
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Configure Alert Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


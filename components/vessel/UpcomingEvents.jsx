"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

/**
 * Upcoming Events - Next 48 hours timeline
 */
export function UpcomingEvents({ events = [] }) {
  if (!events || events.length === 0) return null

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-sm">🔔 UPCOMING (Next 48 Hours)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event, idx) => (
            <div key={idx} className="flex items-start gap-3 pb-3 border-b last:border-0">
              <Clock className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-900 mb-1">
                  {event.time}: {event.title}
                </div>
                {event.actions && (
                  <div className="space-y-1 text-xs text-gray-700">
                    {event.actions.map((action, i) => (
                      <div key={i}>└─ {action}</div>
                    ))}
                  </div>
                )}
                {event.actionButton && (
                  <Button variant="outline" size="sm" className="text-xs mt-2">
                    {event.actionButton}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


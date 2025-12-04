"use client"

import { format } from "date-fns"
import { MapPin } from "lucide-react"

/**
 * Vessel Daily Brief Header
 * Shows vessel name, date, voyage day, and current position
 */
export function VesselDailyBriefHeader({ vessel, voyage }) {
  if (!vessel || !voyage) return null

  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🚢</span>
            <h1 className="text-xl font-bold">{vessel.name} - Daily Brief</h1>
          </div>
          <div className="text-sm opacity-90">
            {format(new Date(), "MMMM d, yyyy")} | Day {voyage.currentDay} of {voyage.totalDays} |{" "}
            <span className="flex items-center gap-1 inline-flex">
              <MapPin className="h-3 w-3" />
              {voyage.position}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}


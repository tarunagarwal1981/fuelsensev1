"use client"

import { FleetStatusCards } from "./FleetStatusCards"
import { DecisionsNeeded } from "./DecisionsNeeded"
import { FleetPerformanceSnapshot } from "./FleetPerformanceSnapshot"
import { VesselManagerAlerts } from "./VesselManagerAlerts"
import { OperationsCalendar } from "./OperationsCalendar"
import { SafetyComplianceStatus } from "./SafetyComplianceStatus"

export function OverviewTab() {
  // Mock stats for fleet status
  const fleetStats = {
    critical: 1,
    attention: 3,
    healthy: 8,
    avgScore: 82,
  }

  return (
    <div className="space-y-6">
      {/* Fleet Status at a Glance */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">FLEET STATUS AT A GLANCE</h2>
        <FleetStatusCards stats={fleetStats} />
      </div>

      {/* Decisions Needed */}
      <div>
        <DecisionsNeeded />
      </div>

      {/* Fleet Performance Snapshot */}
      <div>
        <FleetPerformanceSnapshot />
      </div>

      {/* Alerts & Notifications */}
      <div>
        <VesselManagerAlerts />
      </div>

      {/* Operations Calendar */}
      <div>
        <OperationsCalendar />
      </div>

      {/* Safety & Compliance Status */}
      <div>
        <SafetyComplianceStatus />
      </div>
    </div>
  )
}


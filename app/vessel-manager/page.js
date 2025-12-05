"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Notifications } from "@/components/Notifications"
import { ArrowLeft } from "lucide-react"
import { useStore } from "@/lib/store"
import { VesselManagerSidebar } from "@/components/vessel-manager/VesselManagerSidebar"
import { OverviewTab } from "@/components/vessel-manager/OverviewTab"
import { VesselsTab } from "@/components/vessel-manager/VesselsTab"
import { MaintenanceTab } from "@/components/vessel-manager/MaintenanceTab"
import { ComplianceTab } from "@/components/vessel-manager/ComplianceTab"
import { CostsTab } from "@/components/vessel-manager/CostsTab"

export default function VesselManagerPage() {
  const router = useRouter()
  const { currentUser, setCurrentUser } = useStore()
  const [activeTab, setActiveTab] = useState("overview")

  // Set current user if not set
  useEffect(() => {
    if (!currentUser || currentUser.role !== "VESSEL_MANAGER") {
      setCurrentUser({
        role: "VESSEL_MANAGER",
        name: "Vessel Manager",
        email: "vessel-manager@fuelsense.com",
      })
    }
  }, [currentUser, setCurrentUser])

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />
      case "vessels":
        return <VesselsTab />
      case "maintenance":
        return <MaintenanceTab />
      case "compliance":
        return <ComplianceTab />
      case "costs":
        return <CostsTab />
      default:
        return <OverviewTab />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">⚓</span>
              <span className="text-xl font-bold text-gray-900">Fuel Sense</span>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <span className="text-3xl">👨‍✈️</span>
              <h1 className="text-lg font-semibold text-gray-900">Vessel Manager</h1>
              <span className="text-sm text-gray-500">Fleet Technical & Commercial Oversight</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Notifications />
            <Button variant="outline" onClick={() => router.push("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout with Sidebar */}
      <div className="flex">
        {/* Sidebar (20%) */}
        <VesselManagerSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content (80%) */}
        <main className="flex-1 p-6">
          {renderTabContent()}
        </main>
      </div>
    </div>
  )
}

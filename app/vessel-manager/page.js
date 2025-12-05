"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Notifications } from "@/components/Notifications"
import { ArrowLeft } from "lucide-react"
import { OverviewTab } from "@/components/vessel-manager/OverviewTab"
import { VesselsTab } from "@/components/vessel-manager/VesselsTab"
import { MaintenanceTab } from "@/components/vessel-manager/MaintenanceTab"
import { ComplianceTab } from "@/components/vessel-manager/ComplianceTab"
import { CostsTab } from "@/components/vessel-manager/CostsTab"

export default function VesselManagerPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

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

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-4xl mb-6">
            <TabsTrigger value="overview" className="flex-1">
              Overview
            </TabsTrigger>
            <TabsTrigger value="vessels" className="flex-1">
              Vessels
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex-1">
              Maintenance
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex-1">
              Compliance
            </TabsTrigger>
            <TabsTrigger value="costs" className="flex-1">
              Costs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="vessels" className="space-y-6">
            <VesselsTab />
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <MaintenanceTab />
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <ComplianceTab />
          </TabsContent>

          <TabsContent value="costs" className="space-y-6">
            <CostsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

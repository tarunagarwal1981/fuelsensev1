"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutDashboard, Fuel, Wrench, TrendingUp } from "lucide-react"
import { CostOverview } from "./CostOverview"
import { BunkerCostsView } from "./BunkerCostsView"
import { MaintenanceCostsView } from "./MaintenanceCostsView"
import { ROIAnalysis } from "./ROIAnalysis"

export function CostsTab() {
  const [activeView, setActiveView] = useState("overview")

  // Mock costs data - in real app, this would come from props or store
  const costsData = {
    summary: {
      bunkerCost: {
        ytd: 98400000,
        budget: 100700000,
        variance: -2.3,
        avgCostPerMT: 652,
        marketAvg: 665,
        vsMarket: -2,
      },
      maintenance: {
        ytd: 4800000,
        budget: 4610000,
        variance: 4.2,
        unplannedRepairs: 280000,
        hullCleaningVariance: -90000,
      },
      totalOpex: {
        ytd: 128500000,
        budget: 130800000,
        variance: -1.8,
      },
      savings: {
        ytd: 2800000,
        aiOptimization: 1200000,
        earlyBunkering: 540000,
        routeOptimization: 380000,
      },
    },
    byVessel: [
      {
        vessel: "MV Ocean Star",
        bunker: 9200000,
        maintenance: 420000,
        total: 10800000,
        vsBudget: 8.5,
        status: "NEEDS_WORK",
      },
      {
        vessel: "MV Atlantic",
        bunker: 7800000,
        maintenance: 380000,
        total: 9200000,
        vsBudget: -4.2,
        status: "EXCELLENT",
      },
      {
        vessel: "MV Pacific Voyager",
        bunker: 8500000,
        maintenance: 680000,
        total: 10400000,
        vsBudget: 12,
        status: "ENGINE_ISSUE",
      },
      {
        vessel: "MV Baltic",
        bunker: 8100000,
        maintenance: 390000,
        total: 9500000,
        vsBudget: -1.8,
        status: "GOOD",
      },
      {
        vessel: "MV Indian Ocean",
        bunker: 8300000,
        maintenance: 410000,
        total: 9700000,
        vsBudget: 2.1,
        status: "MONITOR",
      },
    ],
    roi: {
      initiatives: [
        {
          name: "Hull cleaning program",
          investment: 324000,
          savings: 1800000,
          roi: 456,
          status: "ACTIVE",
        },
        {
          name: "AI bunker optimization",
          investment: 180000,
          savings: 1200000,
          roi: 567,
          status: "ACTIVE",
        },
        {
          name: "Weather routing",
          investment: 45000,
          savings: 380000,
          roi: 744,
          status: "ACTIVE",
        },
        {
          name: "Speed optimization",
          investment: 0,
          savings: 540000,
          roi: Infinity,
          status: "ACTIVE",
        },
        {
          name: "Engine monitoring",
          investment: 95000,
          savings: 240000,
          roi: 153,
          status: "ACTIVE",
        },
      ],
      total: {
        investment: 644000,
        savings: 4140000,
        roi: 543,
      },
    },
    bunkerCosts: {
      summary: {
        ytd: 98400000,
        budget: 100700000,
        variance: -2.3,
        avgCostPerMT: 652,
        marketAvg: 665,
        vsMarket: -2,
      },
      savings: {
        aiOptimization: 1200000,
        earlyBunkering: 540000,
        routeOptimization: 380000,
        total: 2120000,
      },
      byVessel: [
        { vessel: "MV Ocean Star", cost: 9200000, consumption: 14100 },
        { vessel: "MV Atlantic", cost: 7800000, consumption: 11950 },
        { vessel: "MV Pacific Voyager", cost: 8500000, consumption: 13030 },
        { vessel: "MV Baltic", cost: 8100000, consumption: 12420 },
        { vessel: "MV Indian Ocean", cost: 8300000, consumption: 12730 },
      ],
    },
    maintenanceCosts: {
      summary: {
        ytd: 4800000,
        budget: 4610000,
        variance: 4.2,
        unplannedRepairs: 280000,
        hullCleaningVariance: -90000,
      },
      breakdown: {
        hullCleaning: 324000,
        drydocking: 850000,
        engineMaintenance: 1200000,
        unplannedRepairs: 280000,
        other: 2146000,
      },
    },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">COSTS - Financial Performance & ROI Tracking</h2>
        <p className="text-gray-600">Demonstrate financial value and identify savings opportunities</p>
      </div>

      {/* View Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="w-full max-w-2xl">
          <TabsTrigger value="overview" className="flex-1">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="bunker" className="flex-1">
            <Fuel className="mr-2 h-4 w-4" />
            Bunker Costs
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex-1">
            <Wrench className="mr-2 h-4 w-4" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="roi" className="flex-1">
            <TrendingUp className="mr-2 h-4 w-4" />
            ROI Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <CostOverview data={costsData} />
        </TabsContent>

        <TabsContent value="bunker" className="mt-6">
          <BunkerCostsView data={costsData.bunkerCosts} />
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <MaintenanceCostsView data={costsData.maintenanceCosts} />
        </TabsContent>

        <TabsContent value="roi" className="mt-6">
          <ROIAnalysis roi={costsData.roi} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

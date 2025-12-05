"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutDashboard, Globe, Zap, Anchor, Shield } from "lucide-react"
import { ComplianceOverview } from "./ComplianceOverview"
import { EUETSView } from "./EUETSView"
import { FuelEUView } from "./FuelEUView"
import { CIIRatingsView } from "./CIIRatingsView"
import { SafetyCertificatesView } from "./SafetyCertificatesView"
import { MRVView } from "./MRVView"

export function ComplianceTab() {
  const [activeView, setActiveView] = useState("overview")

  // Mock compliance data - in real app, this would come from props or store
  const complianceData = {
    overview: {
      critical: 0,
      warning: 3,
      compliant: 9,
      score: 89,
    },
    euEts: {
      status: "COMPLIANT",
      fleetEmissions: 28450,
      allowancesRequired: 14225,
      euaPrice: 85,
      estimatedCost: 1210000,
      budget: 1150000,
      variance: 5.2,
      trend: "INCREASING",
      emissionsTrend: 3,
      priceTrend: 12,
      topEmitters: [
        { vessel: "MV Ocean Star", emissions: 3240 },
        { vessel: "MV Pacific Voyager", emissions: 2890 },
        { vessel: "MV Baltic", emissions: 2675 },
      ],
      savingsOpportunity: {
        vessel: "MV Ocean Star",
        potential: 186,
        cost: 15810,
      },
    },
    fuelEu: {
      status: "MIXED",
      nonCompliantCount: 1,
      fleetAvgIntensity: 90.5,
      limit: 91.2,
      margin: 0.8,
      nonCompliant: [
        {
          vessel: "MV Ocean Star",
          intensity: 92.5,
          overLimit: 1.4,
          penaltyEstimate: 24500,
          rootCause: "Hull fouling (142 days since cleaning)",
          solutions: [
            { action: "Hull cleaning", result: 89.2, compliant: true },
            { action: "10% biofuel blend", result: 90.1, compliant: true },
            { action: "Speed reduction 0.5 knots", result: 90.8, compliant: true },
          ],
          recommended: "Hull cleaning (solves root cause)",
        },
      ],
      approaching: [
        { vessel: "MV Baltic", intensity: 90.8, margin: 0.4 },
        { vessel: "MV Indian Ocean", intensity: 91.0, margin: 0.2 },
      ],
    },
    cii: {
      status: "MIXED",
      distribution: {
        A: 1,
        B: 4,
        C: 6,
        D: 1,
        E: 0,
      },
      fleetAvg: "C+",
      vesselsAtRisk: [
        {
          vessel: "MV Ocean Star",
          currentRating: "C",
          trendingTo: "D",
          percentToThreshold: 68,
          action: "Hull cleaning + consumption optimization",
          consequencesIfDowngrade: "Port restrictions, higher insurance",
        },
        {
          vessel: "MV Baltic",
          currentRating: "C",
          riskYear: 2026,
          percentToThreshold: 72,
          action: "Speed optimization on next 2 voyages",
        },
        {
          vessel: "MV Indian Ocean",
          currentRating: "C",
          riskYear: 2026,
          percentToThreshold: 75,
          action: "Monitor, may need biofuel blend",
        },
      ],
      improvementPlan: {
        actions: [
          { vessel: "MV Ocean Star", action: "Hull cleaning", prevents: "D rating" },
          { vessel: "MV Baltic", action: "Speed optimization", maintains: "C rating" },
          { vessel: "MV Indian Ocean", action: "Monitor closely", contingency: "biofuel if needed" },
        ],
        projectedOutcome: {
          allMaintainC: true,
          fleetAvgImproves: "B-",
          complianceCost: 45000,
          penaltyIfDowngrade: 120000,
        },
      },
    },
    mrv: {
      status: "COMPLIANT",
      dataQualityScore: 92,
      metrics: {
        robReporting: 98,
        consumptionData: 94,
        distanceData: 100,
        fuelQualityDocs: 89,
      },
      reporting: {
        q4_2025: { status: "SUBMITTED", date: "2025-12-15" },
        annual_2025: { status: "DUE", date: "2026-03-31" },
        verification: { status: "SCHEDULED", date: "2026-02" },
      },
    },
    safety: {
      status: "ALL_VALID",
      safetyCertificates: { valid: 12, total: 12 },
      classCertificates: { valid: 12, total: 12 },
      ismIsps: { compliant: 12, total: 12 },
      overdueInspections: 0,
      upcomingSurveys: [
        { vessel: "MV Pacific Voyager", type: "Special Survey", date: "2026-03", status: "PLANNED" },
        { vessel: "MV Baltic", type: "Intermediate Survey", date: "2026-05", status: "SCHEDULED" },
      ],
    },
    riskSummary: {
      high: 0,
      medium: 3,
      low: 9,
    },
    estimatedCosts2026: {
      euEtsAllowances: 1210000,
      fuelEuPenalties: 0,
      ciiImprovements: 45000,
      mrvVerification: 24000,
      safetySurveys: 85000,
      total: 1364000,
    },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">COMPLIANCE - Regulatory Oversight & Risk Management</h2>
        <p className="text-gray-600">Proactive compliance management with early warning system</p>
      </div>

      {/* View Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="w-full max-w-3xl">
          <TabsTrigger value="overview" className="flex-1">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="eu-ets" className="flex-1">
            <Globe className="mr-2 h-4 w-4" />
            EU ETS
          </TabsTrigger>
          <TabsTrigger value="fuel-eu" className="flex-1">
            <Zap className="mr-2 h-4 w-4" />
            FuelEU
          </TabsTrigger>
          <TabsTrigger value="cii" className="flex-1">
            <Anchor className="mr-2 h-4 w-4" />
            CII Ratings
          </TabsTrigger>
          <TabsTrigger value="certificates" className="flex-1">
            <Shield className="mr-2 h-4 w-4" />
            Certificates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <ComplianceOverview data={complianceData} />
        </TabsContent>

        <TabsContent value="eu-ets" className="mt-6">
          <EUETSView data={complianceData.euEts} />
        </TabsContent>

        <TabsContent value="fuel-eu" className="mt-6">
          <FuelEUView data={complianceData.fuelEu} />
        </TabsContent>

        <TabsContent value="cii" className="mt-6">
          <CIIRatingsView data={complianceData.cii} />
        </TabsContent>

        <TabsContent value="certificates" className="mt-6 space-y-4">
          <MRVView data={complianceData.mrv} />
          <SafetyCertificatesView data={complianceData.safety} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

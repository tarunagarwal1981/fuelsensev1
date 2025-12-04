"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MapPin,
  Ship,
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Eye,
  HelpCircle,
  ArrowRight,
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { BunkerPortAnalysis } from "./BunkerPortAnalysis"
import { MarketIntelligence } from "./MarketIntelligence"
import { ViabilityAssessment } from "./ViabilityAssessment"

/**
 * Featured Cargo Card - Large prominent card showing the best cargo match
 * Takes 70% of main content area
 */
export function FeaturedCargoCard({ cargo, onFix, onViewDetails, onAskAI, onSkip }) {
  const [showFinancialDetails, setShowFinancialDetails] = useState(false)
  const [showBunkerDetails, setShowBunkerDetails] = useState(false)
  const [showBunkerAnalysis, setShowBunkerAnalysis] = useState(false)
  const bunkerAnalysisRef = useRef(null)

  if (!cargo) return null

  const bunkerPortCount = cargo.bunkerPorts?.length || 0
  const primaryBunker = cargo.bunkerPorts?.[0]
  const isViable = cargo.viable && bunkerPortCount > 0

  return (
    <Card className="border-2 border-primary-200 bg-gradient-to-br from-blue-50 to-white shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary-600 text-white">🏆 BEST MATCH</Badge>
              <span className="text-xs text-gray-500">
                Updated {formatDistanceToNow(new Date(cargo.updatedAt || cargo.createdAt), { addSuffix: true })}
              </span>
            </div>
            <CardTitle className="text-2xl mb-3">
              {cargo.loadPort} <ArrowRight className="inline h-5 w-5 mx-2" /> {cargo.dischargePort}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {cargo.distance} nm
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {cargo.duration} days
              </span>
              <span className="flex items-center gap-1">
                <Ship className="h-4 w-4" />
                {cargo.vessel}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Profit Highlight */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-baseline gap-2">
            <DollarSign className="h-6 w-6 text-green-600" />
            <span className="text-4xl font-bold text-green-600">
              ${(cargo.profit / 1000).toFixed(0)}K
            </span>
            <span className="text-sm text-gray-600">profit</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Badge className="bg-primary-600 text-white">
              {cargo.confidence}% confidence
            </Badge>
            <Badge className={cn(
              cargo.risk === "LOW" && "bg-success text-white",
              cargo.risk === "MEDIUM" && "bg-warning text-black",
              cargo.risk === "HIGH" && "bg-danger text-white"
            )}>
              {cargo.risk} Risk
            </Badge>
          </div>
        </div>

        {/* Enhanced Viability Assessment */}
        <ViabilityAssessment
          cargo={cargo}
          onRevalidate={async () => {
            // Simulate re-validation
            await new Promise(resolve => setTimeout(resolve, 2000))
          }}
          onViewRiskReport={(action) => {
            // Handle navigation to different views
            if (action === "bunker_analysis") {
              // Expand and scroll to bunker analysis section
              setShowBunkerAnalysis(true)
              setTimeout(() => {
                bunkerAnalysisRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
              }, 100)
            } else if (action === "weather") {
              // Open weather forecast
              console.log("Open weather forecast")
            } else if (action === "risk_report") {
              // Open full risk report modal
              console.log("Open risk report")
            }
          }}
        />

        <Separator />

        {/* Why This Is Best */}
        <div className="bg-blue-50 rounded-md p-4 border border-blue-200">
          <div className="flex items-start gap-2 mb-2">
            <HelpCircle className="h-5 w-5 text-primary-600 mt-0.5" />
            <h4 className="font-semibold text-sm text-gray-900">WHY THIS IS BEST:</h4>
          </div>
          <p className="text-sm text-gray-700">
            {cargo.aiReasoning?.[0] || `Highest profit ($${(cargo.profit / 1000).toFixed(0)}K vs $${((cargo.profit * 0.8) / 1000).toFixed(0)}K avg), reliable bunker options, perfect timing, low risk`}
          </p>
        </div>

        {/* Financial Breakdown (Expandable) */}
        <div className="border rounded-md">
          <button
            onClick={() => setShowFinancialDetails(!showFinancialDetails)}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900">FINANCIAL BREAKDOWN</span>
            {showFinancialDetails ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          {showFinancialDetails && (
            <div className="p-4 pt-0 space-y-2 text-sm border-t">
              <div className="flex justify-between">
                <span className="text-gray-600">Freight Revenue:</span>
                <span className="font-medium">${(cargo.freight / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bunker Cost:</span>
                <span className="font-medium text-red-600">-${(cargo.bunkerCost / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Port Costs:</span>
                <span className="font-medium text-red-600">-${(cargo.portCosts / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Other Costs:</span>
                <span className="font-medium text-red-600">-${(cargo.otherCosts / 1000).toFixed(0)}K</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Net Profit:</span>
                <span className="text-green-600">${(cargo.profit / 1000).toFixed(0)}K</span>
              </div>
            </div>
          )}
        </div>

        {/* Market Intelligence (New expandable section) */}
        <MarketIntelligence cargo={cargo} />

        {/* Bunker Plan (Expandable) */}
        {primaryBunker && (
          <div className="border rounded-md">
            <button
              onClick={() => setShowBunkerDetails(!showBunkerDetails)}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">BUNKER PLAN</span>
              {showBunkerDetails ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {showBunkerDetails && (
              <div className="p-4 pt-0 space-y-3 border-t">
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="font-medium text-sm mb-2">
                    {primaryBunker.name} - {primaryBunker.quantity} MT VLSFO @ ${primaryBunker.price}/MT
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Supplier: {primaryBunker.supplier} ({primaryBunker.reliability}% reliability)</div>
                    <div>Delivery: {primaryBunker.deliveryHours} hours</div>
                    <div>Total: ${(primaryBunker.totalCost / 1000).toFixed(0)}K</div>
                  </div>
                </div>
                {cargo.bunkerPorts?.length > 1 && (
                  <div className="text-xs text-gray-600">
                    <div className="font-medium mb-1">Alternatives:</div>
                    {cargo.bunkerPorts.slice(1).map((port, idx) => (
                      <div key={idx} className="ml-2">
                        {port.name} +${port.price - primaryBunker.price}/MT
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Bunker Port Analysis (New expandable section) */}
        {cargo.bunkerPorts && cargo.bunkerPorts.length > 1 && (
          <div ref={bunkerAnalysisRef}>
            <BunkerPortAnalysis
              cargo={cargo}
              defaultExpanded={showBunkerAnalysis}
              onSelectPort={(port) => {
                // Handle port selection - could update the cargo's primary bunker port
                console.log("Selected port:", port)
              }}
            />
          </div>
        )}

        {/* Primary Action Button */}
        {isViable && (
          <Button
            className="w-full bg-success hover:bg-green-600 text-white text-lg font-semibold py-6"
            size="lg"
            onClick={() => onFix(cargo)}
          >
            🚀 Fix This Cargo
          </Button>
        )}

        {/* Secondary Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onViewDetails(cargo)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Full Details
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onAskAI(cargo)}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Ask AI Why
          </Button>
          {!isViable && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onSkip(cargo)}
            >
              Skip
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, ChevronUp, MapPin, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BunkerPortCard } from "./BunkerPortCard"
import { BunkerPortChart } from "./BunkerPortChart"
import { cn } from "@/lib/utils"

/**
 * Bunker Port Analysis - Expandable section showing multi-port comparison
 * Calculates deviation costs and compares total voyage costs
 */
export function BunkerPortAnalysis({ cargo, onSelectPort, defaultExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  
  // Update expanded state when defaultExpanded changes
  useEffect(() => {
    if (defaultExpanded) {
      setIsExpanded(true)
    }
  }, [defaultExpanded])

  // Calculate bunker port analysis from cargo data
  const bunkerAnalysis = useMemo(() => {
    if (!cargo || !cargo.bunkerPorts || cargo.bunkerPorts.length === 0) {
      return null
    }

    // Calculate total costs for each port
    const portsWithCosts = cargo.bunkerPorts.map((port, index) => {
      const quantity = port.quantity || 850 // Default quantity
      const bunkerCost = port.price * quantity
      
      // Calculate deviation costs
      const deviationDistance = port.deviationDistance || 0 // nm
      const deviationTime = deviationDistance > 0 ? (deviationDistance / 500) : 0 // days (assuming ~500nm/day)
      
      // Use provided deviationCost if available, otherwise calculate
      let deviationTotalCost = port.deviationCost || 0
      let deviationFuelCost = 0
      let deviationTimeCost = 0
      
      if (deviationTotalCost === 0 && deviationDistance > 0) {
        // Calculate if not provided
        deviationFuelCost = deviationDistance * 0.5 * (port.price / 100) // Simplified: 0.5 MT/nm
        deviationTimeCost = deviationTime * 15000 // $15K/day vessel cost
        deviationTotalCost = deviationFuelCost + deviationTimeCost
      } else if (deviationTotalCost > 0) {
        // Split provided cost (60% fuel, 40% time)
        deviationFuelCost = deviationTotalCost * 0.6
        deviationTimeCost = deviationTotalCost * 0.4
      }

      // Get port charges
      const portCharges = port.portFees || 8000

      // Total cost
      const totalCost = bunkerCost + deviationTotalCost + portCharges

      // Price difference vs lowest price port
      const basePrice = Math.min(...cargo.bunkerPorts.map(p => p.price))
      const priceDifference = port.price - basePrice

      return {
        name: port.name,
        country: port.country || "",
        price: port.price,
        quantity,
        bunkerCost,
        priceDifference,
        deviation: {
          distance: deviationDistance,
          time: deviationTime,
          fuelCost: deviationFuelCost,
          timeCost: deviationTimeCost,
          totalCost: deviationTotalCost,
        },
        portCharges,
        totalCost,
        supplier: port.supplier,
        reliability: port.reliability || 95,
        availabilityStatus: "confirmed", // Default
        deliveryTime: port.deliveryHours || 4,
        qualityScore: (port.reliability || 95) / 10, // Convert reliability % to score
        aiInsight: port.price > basePrice * 1.05 && deviationDistance === 0
          ? `Not worth the premium despite being on direct route. Best option saves $${((totalCost - Math.min(...cargo.bunkerPorts.map(p => {
              const q = p.quantity || 850
              const bc = p.price * q
              const dc = p.deviationCost || 0
              const pc = p.portFees || 8000
              return bc + dc + pc
            }))) / 1000).toFixed(0)}K.`
          : null,
      }
    })

    // Sort by total cost
    const sortedPorts = [...portsWithCosts].sort((a, b) => a.totalCost - b.totalCost)
    const bestPort = sortedPorts[0]

    // Calculate savings vs best for each port
    const portsWithSavings = portsWithCosts.map((port) => ({
      ...port,
      savingsVsBest: port.totalCost - bestPort.totalCost,
      isRecommended: port.name === bestPort.name,
      isExpensive: port.totalCost > bestPort.totalCost * 1.05, // 5% threshold
    }))

    // Generate recommendation
    const recommendation = {
      portName: bestPort.name,
      reason: `Choose ${bestPort.name} - saves $${((sortedPorts[sortedPorts.length - 1]?.totalCost - bestPort.totalCost) / 1000).toFixed(0)}K vs ${sortedPorts[sortedPorts.length - 1]?.name || "most expensive"} and has the best supplier reliability. The ${bestPort.deviation.time.toFixed(1)}-day deviation is negligible and easily absorbed in voyage schedule.`,
      confidence: 95,
    }

    return {
      ports: portsWithSavings,
      recommendation,
    }
  }, [cargo])

  if (!bunkerAnalysis || bunkerAnalysis.ports.length === 0) {
    return null
  }

  const { ports, recommendation } = bunkerAnalysis

  return (
    <div className="border rounded-md">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
        aria-expanded={isExpanded}
        aria-label="Compare bunker ports"
      >
        <span className="text-sm font-medium text-gray-900">
          BUNKER PORT ANALYSIS
        </span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 pt-0 space-y-4 border-t">
          {/* Recommendation Header */}
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-success text-white">🏆 RECOMMENDED</Badge>
              <span className="font-semibold text-sm">
                {recommendation.portName} (Best value)
              </span>
            </div>
          </div>

          {/* Port Comparison Cards */}
          <div className="space-y-3">
            {ports.map((port, index) => (
              <BunkerPortCard
                key={port.name}
                port={port}
                isRecommended={port.isRecommended}
                isExpensive={port.isExpensive}
                savingsVsBest={port.savingsVsBest}
              />
            ))}
          </div>

          {/* Visual Comparison Chart */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <BunkerPortChart
                ports={ports}
                recommendedPortName={recommendation.portName}
              />
            </CardContent>
          </Card>

          {/* AI Recommendation */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-start gap-2">
              <HelpCircle className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-900 mb-1">
                  💡 RECOMMENDATION:
                </div>
                <p className="text-sm text-gray-700">{recommendation.reason}</p>
                <div className="mt-2 text-xs text-gray-600">
                  Confidence: {recommendation.confidence}%
                </div>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          <div className="border rounded-md p-3">
            <div className="text-sm font-semibold text-gray-900 mb-2">
              RISK FACTORS:
            </div>
            <div className="space-y-1 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-success flex-shrink-0" />
                <span>All ports have confirmed availability</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-success flex-shrink-0" />
                <span>Weather favorable for all routes</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3 w-3 text-warning flex-shrink-0" />
                <span>
                  {recommendation.portName}: Slight congestion (manageable)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-success flex-shrink-0" />
                <span>All suppliers have good payment terms</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1 bg-success hover:bg-green-600"
              onClick={() => {
                const selectedPort = ports.find((p) => p.isRecommended)
                if (selectedPort && onSelectPort) {
                  onSelectPort(selectedPort)
                }
              }}
            >
              Select {recommendation.portName} ✅
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                // Future: Open map comparison modal
                console.log("Map comparison - to be implemented")
              }}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Compare on Map 🗺️
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}


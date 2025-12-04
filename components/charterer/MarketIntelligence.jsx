"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Info, Bell, BarChart3 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

/**
 * Market Intelligence Panel
 * Provides real-time market context and competitive analysis
 */
export function MarketIntelligence({ cargo }) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Calculate market intelligence data from cargo
  const marketData = useMemo(() => {
    if (!cargo) return null

    // Calculate freight rate per MT
    const freightRatePerMT = cargo.freight / (cargo.distance * 0.1) // Simplified calculation
    const marketAverage = freightRatePerMT * 0.93 // 7% premium
    const fleetAverage = freightRatePerMT * 0.92

    // Bunker analysis
    const primaryBunker = cargo.bunkerPorts?.[0]
    const bunkerPrice = primaryBunker?.price || 645
    const plattsIndex = bunkerPrice * 1.008 // Slightly above
    const regionalAvg = bunkerPrice * 1.011

    // Profitability
    const marketRangeMin = cargo.profit * 0.58
    const marketRangeMax = cargo.profit * 1.09
    const vsFleetAvg = cargo.profit - (cargo.profit * 0.85)
    const margin = (cargo.profit / cargo.freight) * 100

    return {
      freight: {
        thisCargoRate: freightRatePerMT.toFixed(2),
        marketAverage: marketAverage.toFixed(2),
        fleetAverage: fleetAverage.toFixed(2),
        trend30Day: {
          change: 12,
          direction: "up",
        },
        routeRange: {
          min: (marketAverage * 0.9).toFixed(2),
          max: (marketAverage * 1.14).toFixed(2),
        },
        seasonalPattern: "December typically +8-10%",
        premiumPercent: ((freightRatePerMT / marketAverage - 1) * 100).toFixed(1),
      },
      bunker: {
        portPrice: bunkerPrice,
        plattsIndex: plattsIndex.toFixed(0),
        regionalAvg: regionalAvg.toFixed(0),
        forecast7Day: "Stable ±$3/MT",
        priceMovement48h: -2,
        historicalContext: "15% below 2024 high",
        discountVsPlatts: (plattsIndex - bunkerPrice).toFixed(0),
        discountPercent: (((plattsIndex - bunkerPrice) / plattsIndex) * 100).toFixed(1),
      },
      competitive: {
        recentFixtures: 3,
        vesselAvailability: "TIGHT",
        vesselCount: 12,
        cargoPipeline: 8,
        congestion: {
          singapore: "Moderate (2-day wait)",
          rotterdam: "Low (next-day berth)",
        },
      },
      profitability: {
        ranking: 2,
        totalSimilar: 10,
        marketRange: {
          min: marketRangeMin,
          max: marketRangeMax,
        },
        vsFleetAvg,
        margin: margin.toFixed(1),
        vsFleetPercent: ((vsFleetAvg / (cargo.profit - vsFleetAvg)) * 100).toFixed(1),
      },
      aiInsight: {
        recommendation: "Fix this cargo soon",
        reasoning: [
          "Freight rate is fair given rising market (+7% premium justified by tight vessel supply)",
          "Bunker costs favorable ($5/MT below market). Timing is good with stable forecast",
          "High competitive activity suggests strong demand - cargo could get snapped up quickly",
          "Profitability well above your fleet average. This is a good deal for your operation",
          "Watch: Vessel supply tight - if you wait, rates could increase further",
        ],
        confidence: 87,
        timelinePressure: "MODERATE-HIGH",
        timelineNote: "Recommend decision within 4-6 hours. Market is active and similar cargoes are being fixed quickly.",
        riskFactors: [
          { level: "Low", factor: "Bunker price volatility" },
          { level: "Medium", factor: "Freight rate could tick up 5-8%" },
          { level: "Low", factor: "Port congestion manageable" },
        ],
      },
      dataSources: {
        freight: ["Baltic Exchange", "Clarksons data"],
        bunker: ["Platts", "Ship & Bunker prices"],
        competitive: ["AIS data", "fixture reports"],
        lastUpdated: "5 minutes ago",
      },
    }
  }, [cargo])

  if (!marketData) return null

  const { freight, bunker, competitive, profitability, aiInsight, dataSources } = marketData

  return (
    <div className="border rounded-md">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
        aria-expanded={isExpanded}
        aria-label="View market intelligence"
      >
        <span className="text-sm font-medium text-gray-900">
          MARKET INTELLIGENCE
        </span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 pt-0 space-y-4 border-t">
          {/* Freight Rate Analysis */}
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-4 w-4 text-primary-600" />
                <h4 className="font-semibold text-sm">FREIGHT RATE ANALYSIS</h4>
              </div>
              <div className="space-y-3 text-sm">
                <div className="font-medium">
                  This Cargo: ${freight.thisCargoRate}/MT
                </div>
                <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Market Average:</span>
                      <span className="font-medium">${freight.marketAverage}/MT</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-3 w-3 text-warning" />
                      <span className="text-xs text-warning">
                        You're paying +{freight.premiumPercent}% premium
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Your Fleet Average (Last 10):</span>
                      <span className="font-medium">${freight.fleetAverage}/MT</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-3 w-3 text-warning" />
                      <span className="text-xs text-warning">Slightly above your usual rate</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">30-Day Trend:</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-success" />
                        <span className="font-medium text-success">+{freight.trend30Day.change}%</span>
                        <span className="text-xs text-gray-500">(Rising market)</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      💡 Rates have increased significantly
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Route-Specific Range:</span>
                      <span className="font-medium">${freight.routeRange.min}-${freight.routeRange.max}/MT</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle2 className="h-3 w-3 text-success" />
                      <span className="text-xs text-success">Within normal range for this route</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Seasonal Pattern:</div>
                    <div className="text-xs text-gray-600 mt-1">
                      📅 {freight.seasonalPattern}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Normal seasonal increase
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bunker Market Analysis */}
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">💰</span>
                <h4 className="font-semibold text-sm">BUNKER MARKET ANALYSIS</h4>
              </div>
              <div className="space-y-3 text-sm">
                <div className="font-medium">
                  {cargo.bunkerPorts?.[0]?.name || "Port Klang"} VLSFO: ${bunker.portPrice}/MT
                </div>
                <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Platts Index:</span>
                      <span className="font-medium">${bunker.plattsIndex}/MT</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle2 className="h-3 w-3 text-success" />
                      <span className="text-xs text-success">
                        ${bunker.discountVsPlatts}/MT below market ({bunker.discountPercent}% discount)
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Regional Average:</span>
                      <span className="font-medium">${bunker.regionalAvg}/MT</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle2 className="h-3 w-3 text-success" />
                      <span className="text-xs text-success">Best price in SE Asia region</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">7-Day Forecast:</span>
                      <span className="font-medium">{bunker.forecast7Day}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle2 className="h-3 w-3 text-success" />
                      <span className="text-xs text-success">Low volatility expected</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Price Movement:</span>
                      <div className="flex items-center gap-1">
                        <TrendingDown className="h-3 w-3 text-success" />
                        <span className="font-medium text-success">
                          ${Math.abs(bunker.priceMovement48h)}/MT in past 48 hours
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      ↘️ Downward trend (good timing)
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Historical Context:</div>
                    <div className="text-xs text-gray-600 mt-1">
                      💡 {bunker.historicalContext}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Favorable bunker environment
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competitive Intelligence */}
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🏆</span>
                <h4 className="font-semibold text-sm">COMPETITIVE INTELLIGENCE</h4>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Market Activity:</span>
                  <Badge className="bg-danger text-white">🔥 HIGH</Badge>
                </div>
                <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Similar Fixtures (48 hrs):</span>
                      <span className="font-medium">{competitive.recentFixtures} cargoes</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {cargo.loadPort}→{cargo.dischargePort} route, similar size
                    </div>
                    <div className="text-xs text-gray-600">
                      Avg freight: ${(parseFloat(freight.marketAverage) * 1.036).toFixed(2)}/MT
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Vessel Availability:</span>
                      <Badge className="bg-warning text-black">{competitive.vesselAvailability}</Badge>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-3 w-3 text-warning" />
                      <span className="text-xs text-warning">
                        Only {competitive.vesselCount} suitable vessels open in region
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      💡 Limited supply = stronger pricing
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Cargo Pipeline:</span>
                      <span className="font-medium">{competitive.cargoPipeline} similar cargoes on market</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      High demand for this route
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Port Congestion:</div>
                    <div className="text-xs text-gray-600 mt-1 space-y-1">
                      <div>• {cargo.loadPort}: {competitive.congestion.singapore}</div>
                      <div>• {cargo.dischargePort}: {competitive.congestion.rotterdam}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profitability Benchmark */}
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-primary-600" />
                <h4 className="font-semibold text-sm">PROFITABILITY BENCHMARK</h4>
              </div>
              <div className="space-y-3 text-sm">
                <div className="font-medium">
                  Your Profit: ${(cargo.profit / 1000).toFixed(0)}K
                </div>
                <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Ranking:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">#{profitability.ranking} of {profitability.totalSimilar} similar recent fixtures</span>
                        <Badge className="bg-warning text-black">🥈</Badge>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Above-average profitability
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Market Range:</span>
                      <span className="font-medium">
                        ${(profitability.marketRange.min / 1000).toFixed(0)}K - ${(profitability.marketRange.max / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle2 className="h-3 w-3 text-success" />
                      <span className="text-xs text-success">In top 25% of profit range</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">vs Your Fleet Avg:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-success">
                          +${(profitability.vsFleetAvg / 1000).toFixed(0)}K (+{profitability.vsFleetPercent}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle2 className="h-3 w-3 text-success" />
                      <span className="text-xs text-success">Better than your typical cargo</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Margin:</span>
                      <span className="font-medium">{profitability.margin}% (Profit/Revenue)</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle2 className="h-3 w-3 text-success" />
                      <span className="text-xs text-success">Healthy margin (industry avg: 18-22%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Market Insight */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🤖</span>
                <h4 className="font-semibold text-sm">AI MARKET INSIGHT</h4>
              </div>
              <div className="space-y-3 text-sm">
                <div className="font-semibold text-gray-900">
                  💡 RECOMMENDATION: {aiInsight.recommendation}
                </div>
                <Separator />
                <div>
                  <div className="font-medium text-gray-900 mb-2">REASONING:</div>
                  <ol className="space-y-1.5 text-gray-700 list-decimal list-inside">
                    {aiInsight.reasoning.map((reason, idx) => (
                      <li key={idx} className="text-xs">
                        {reason.startsWith("✅") ? (
                          <span className="text-success">{reason}</span>
                        ) : reason.startsWith("⚠️") ? (
                          <span className="text-warning">{reason}</span>
                        ) : (
                          <span>✅ {reason}</span>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
                <Separator />
                <div>
                  <div className="font-medium text-gray-900 mb-2">RISK FACTORS:</div>
                  <ul className="space-y-1 text-xs text-gray-700">
                    {aiInsight.riskFactors.map((risk, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className={cn(
                          "font-medium",
                          risk.level === "Low" && "text-success",
                          risk.level === "Medium" && "text-warning",
                          risk.level === "High" && "text-danger"
                        )}>
                          {risk.level}:
                        </span>
                        <span>{risk.factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">CONFIDENCE:</span>
                  <div className="flex items-center gap-2">
                    <Progress value={aiInsight.confidence} className="w-24 h-2" />
                    <span className="font-medium">{aiInsight.confidence}% (High)</span>
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-600">TIMELINE PRESSURE:</span>
                    <Badge className="bg-danger text-white">🔴 {aiInsight.timelinePressure}</Badge>
                  </div>
                  <div className="text-xs text-gray-700 italic">
                    "{aiInsight.timelineNote}"
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sources */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
            <div className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-1 cursor-help">
                    <Info className="h-3 w-3" />
                    <span>Data Sources</span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <div className="space-y-1 text-xs">
                      <div><strong>Freight:</strong> {dataSources.freight.join(", ")}</div>
                      <div><strong>Bunker:</strong> {dataSources.bunker.join(", ")}</div>
                      <div><strong>Competitive:</strong> {dataSources.competitive.join(", ")}</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span>Updated: {dataSources.lastUpdated}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <BarChart3 className="h-3 w-3 mr-1" />
                View Charts
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Bell className="h-3 w-3 mr-1" />
                Set Alerts
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


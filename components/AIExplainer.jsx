"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Database,
  BarChart3,
} from "lucide-react"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function AIExplainer({ bunkerPlan, cargoId }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const { getAIOutputsByCargo, getCargoById } = useStore()
  
  const cargo = cargoId ? getCargoById(cargoId) : null
  const aiOutputs = cargoId ? getAIOutputsByCargo(cargoId) : []
  
  // Get the most recent completed analysis
  const latestAnalysis = aiOutputs
    .filter((output) => output.status === "COMPLETED")
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0]

  if (!bunkerPlan && !cargo) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <p className="text-sm text-gray-500 text-center">
            No bunker plan data available
          </p>
        </CardContent>
      </Card>
    )
  }

  const confidence = latestAnalysis?.confidence || cargo?.confidence || 0
  const dataQuality = latestAnalysis?.dataQuality?.overallQuality || 0
  const keyFindings = latestAnalysis?.output?.keyFindings || cargo?.aiReasoning || []

  const getConfidenceColor = (score) => {
    if (score >= 90) return "text-success"
    if (score >= 75) return "text-primary-600"
    if (score >= 60) return "text-warning"
    return "text-danger"
  }

  const getConfidenceBadgeVariant = (score) => {
    if (score >= 90) return "default"
    if (score >= 75) return "secondary"
    if (score >= 60) return "outline"
    return "destructive"
  }

  const getDataQualityLabel = (score) => {
    if (score >= 95) return "Excellent"
    if (score >= 85) return "Very Good"
    if (score >= 75) return "Good"
    if (score >= 60) return "Fair"
    return "Poor"
  }

  return (
    <Card className="border-primary-200 bg-gradient-to-br from-blue-50/50 to-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary-600" />
            <CardTitle className="text-primary-700">AI-Powered Analysis</CardTitle>
          </div>
          {latestAnalysis && (
            <Badge
              variant={getConfidenceBadgeVariant(confidence)}
              className={cn("text-xs font-semibold", getConfidenceColor(confidence))}
            >
              {confidence}% Confidence
            </Badge>
          )}
        </div>
        <CardDescription>
          {latestAnalysis
            ? `Analysis by ${latestAnalysis.agentName}`
            : "AI analysis and recommendations"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Confidence Score with Visual Gauge */}
        {confidence > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">Confidence Score</span>
              <span className={cn("font-semibold", getConfidenceColor(confidence))}>
                {confidence}%
              </span>
            </div>
            <Progress value={confidence} className="h-3" />
            <p className="text-xs text-gray-500">
              {confidence >= 90
                ? "High confidence - Recommended for approval"
                : confidence >= 75
                ? "Moderate confidence - Review recommended"
                : confidence >= 60
                ? "Low confidence - Additional review required"
                : "Very low confidence - Not recommended"}
            </p>
          </div>
        )}

        {/* Decision Factors */}
        {keyFindings.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary-600" />
              <h4 className="font-semibold text-sm text-gray-900">
                Key Decision Factors
              </h4>
            </div>
            <div className="space-y-2">
              {keyFindings.map((finding, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 bg-white rounded-md border border-gray-200"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {finding.toLowerCase().includes("risk") ||
                    finding.toLowerCase().includes("warning") ? (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    ) : finding.toLowerCase().includes("optimal") ||
                      finding.toLowerCase().includes("good") ||
                      finding.toLowerCase().includes("favorable") ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-primary-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-700 flex-1">{finding}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Quality Assessment */}
        {latestAnalysis?.dataQuality && (
          <div className="space-y-2 p-3 bg-gray-50 rounded-md border border-gray-200">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-gray-600" />
              <h4 className="font-semibold text-sm text-gray-900">Data Quality</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Overall Quality</span>
                <div className="flex items-center gap-2">
                  <Progress value={dataQuality} className="h-2 w-24" />
                  <span className="text-xs font-medium text-gray-700">
                    {getDataQualityLabel(dataQuality)}
                  </span>
                </div>
              </div>
              {latestAnalysis.dataQuality.sources && (
                <div className="space-y-1 pt-2 border-t border-gray-200">
                  {latestAnalysis.dataQuality.sources.map((source, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-gray-600">{source.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">{source.freshness}</span>
                        <Badge variant="outline" className="text-xs">
                          {source.quality}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Alternative Scenarios */}
        {bunkerPlan?.alternatives && bunkerPlan.alternatives.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-900">
              Alternative Scenarios
            </h4>
            <div className="space-y-2">
              {bunkerPlan.alternatives.map((alt, index) => (
                <div
                  key={index}
                  className="p-3 bg-white rounded-md border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-gray-900">
                      {alt.port}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      ${alt.totalCost.toLocaleString()}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{alt.reason}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>${alt.pricePerMT}/MT</span>
                    <span>{alt.quantity} MT</span>
                    <span>{alt.supplier}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Calculations (Expandable) */}
        {latestAnalysis && (
          <div className="border-t border-gray-200 pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full justify-between"
            >
              <span className="text-sm font-medium">View Detailed Calculations</span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {isExpanded && (
              <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-md border border-gray-200">
                {latestAnalysis.output?.costBreakdown && (
                  <div>
                    <h5 className="text-xs font-semibold text-gray-700 mb-2">
                      Cost Breakdown
                    </h5>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fuel Cost</span>
                        <span className="font-medium">
                          ${latestAnalysis.output.costBreakdown.fuelCost.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Port Fees</span>
                        <span className="font-medium">
                          ${latestAnalysis.output.costBreakdown.portFees?.toLocaleString() || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deviation Cost</span>
                        <span className="font-medium">
                          ${latestAnalysis.output.costBreakdown.deviationCost?.toLocaleString() || "0"}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-300 font-semibold">
                        <span>Total Cost</span>
                        <span>
                          ${latestAnalysis.output.costBreakdown.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {latestAnalysis.executionTime > 0 && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Analysis Time:</span>{" "}
                    {latestAnalysis.executionTime}ms
                  </div>
                )}
                {latestAnalysis.output?.savings && (
                  <div className="flex items-center gap-2 text-xs">
                    <TrendingDown className="h-4 w-4 text-success" />
                    <span className="text-gray-600">
                      Estimated savings:{" "}
                      <span className="font-semibold text-success">
                        ${latestAnalysis.output.savings.toLocaleString()}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

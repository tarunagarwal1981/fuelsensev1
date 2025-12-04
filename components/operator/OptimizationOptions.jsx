"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, FileText, User, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Optimization Options - AI-Recommended
 * Shows multiple optimization options with ROI analysis
 */
export function OptimizationOptions({ options, recommendation }) {
  if (!options || options.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">🛠️ OPTIMIZATION OPTIONS (AI-Recommended)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {options.map((option, idx) => {
          const isRecommended = recommendation === option.id
          const isRecommendedBadge = isRecommended && option.isRecommended

          return (
            <Card
              key={option.id}
              className={cn(
                "border-2",
                isRecommendedBadge && "border-primary-600 bg-blue-50/30"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isRecommendedBadge && (
                      <span className="text-lg">⭐</span>
                    )}
                    <CardTitle className="text-sm">
                      OPTION {String.fromCharCode(65 + idx)}: {option.title}
                      {isRecommendedBadge && " (RECOMMENDED)"}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                {/* Action */}
                <div>
                  <div className="font-semibold text-gray-900">ACTION:</div>
                  <div className="text-gray-700">{option.action}</div>
                </div>

                {/* Costs */}
                {option.costs && (
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">COSTS:</div>
                    <div className="space-y-1 text-gray-700 ml-4">
                      {Object.entries(option.costs).map(([key, value]) => (
                        <div key={key}>
                          {key === Object.keys(option.costs)[Object.keys(option.costs).length - 1] ? "└─" : "├─"} {key}: {typeof value === "number" ? `$${value.toLocaleString()}` : value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {option.benefits && (
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">BENEFITS:</div>
                    <div className="space-y-1 text-gray-700 ml-4">
                      {option.benefits.map((benefit, i) => (
                        <div key={i}>
                          {i === option.benefits.length - 1 ? "└─" : "├─"} {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Next 60 Days Impact */}
                {option.next60Days && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-2">
                    <div className="font-semibold text-gray-900 mb-1">NEXT 60 DAYS IMPACT:</div>
                    <div className="space-y-1 text-gray-700 ml-4">
                      {Object.entries(option.next60Days).map(([key, value]) => (
                        <div key={key}>
                          {key === Object.keys(option.next60Days)[Object.keys(option.next60Days).length - 1] ? "└─" : "├─"} {key}: {typeof value === "number" ? (value >= 0 ? `$${value.toLocaleString()}` : `-$${Math.abs(value).toLocaleString()}`) : value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ROI */}
                {option.roi && (
                  <div>
                    <div className="font-semibold text-gray-900">ROI: {option.roi}</div>
                  </div>
                )}

                {/* Operational Details */}
                {option.operationalDetails && (
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">OPERATIONAL DETAILS:</div>
                    <div className="space-y-1 text-gray-700 ml-4">
                      {Object.entries(option.operationalDetails).map(([key, value]) => (
                        <div key={key}>
                          {key === Object.keys(option.operationalDetails)[Object.keys(option.operationalDetails).length - 1] ? "└─" : "├─"} {key}: {value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trade-offs */}
                {option.tradeoffs && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2">
                    <div className="font-semibold text-gray-900 mb-1">TRADE-OFFS:</div>
                    <div className="space-y-1 text-gray-700">
                      {option.tradeoffs.map((tradeoff, i) => (
                        <div key={i}>
                          {tradeoff.includes("⚠️") ? "⚠️" : tradeoff.includes("✅") ? "✅" : tradeoff.includes("❌") ? "❌" : ""} {tradeoff.replace(/[⚠️✅❌]/g, "").trim()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Issues */}
                {option.issues && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-2">
                    <div className="font-semibold text-gray-900 mb-1">ISSUES:</div>
                    <div className="space-y-1 text-gray-700">
                      {option.issues.map((issue, i) => (
                        <div key={i}>
                          {issue.includes("❌") ? "❌" : issue.includes("⚠️") ? "⚠️" : ""} {issue.replace(/[❌⚠️]/g, "").trim()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  {option.actions?.map((action, i) => (
                    <Button
                      key={i}
                      variant={action.primary ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                    >
                      {action.icon === "quote" && <FileText className="h-3 w-3 mr-1" />}
                      {action.icon === "approve" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {action.icon === "contact" && <User className="h-3 w-3 mr-1" />}
                      {action.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* AI Recommendation */}
        {recommendation && (
          <Card className="bg-blue-50 border-2 border-primary-600">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">💡</span>
                <div className="font-semibold text-sm">AI RECOMMENDATION: {recommendation.title}</div>
              </div>
              <div className="text-sm text-gray-700">
                <div className="font-semibold mb-2">REASONING:</div>
                <ul className="list-disc list-inside space-y-1">
                  {recommendation.reasoning?.map((reason, i) => (
                    <li key={i}>{reason}</li>
                  ))}
                </ul>
              </div>
              {recommendation.nextSteps && (
                <div className="pt-2 border-t">
                  <div className="font-semibold text-sm mb-2">NEXT STEPS:</div>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.nextSteps.map((step, i) => (
                      <Button key={i} variant="outline" size="sm" className="text-xs">
                        {i + 1}. {step}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}


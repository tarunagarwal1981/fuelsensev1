"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, MessageSquare, BarChart3, Pause, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Attention Needed - Alert cards for issues requiring action
 */
export function AttentionNeeded({ alerts = [], onDismiss, onContactOperator, onViewDetails }) {
  if (!alerts || alerts.length === 0) return null

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-warning" />
        <h2 className="text-lg font-semibold text-gray-900">
          ⚠️ ATTENTION NEEDED ({alerts.length} item{alerts.length !== 1 ? "s" : ""})
        </h2>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, idx) => (
          <Card key={idx} className="border-2 border-warning">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">
                  {idx + 1}. {alert.icon} {alert.title}
                </CardTitle>
                {alert.priority && (
                  <Badge className={cn(
                    alert.priority === "HIGH" && "bg-danger text-white",
                    alert.priority === "MEDIUM" && "bg-warning text-black",
                    "text-xs"
                  )}>
                    {alert.priority}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Issue Details */}
              {alert.issue && (
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-2">ISSUE:</div>
                  <div className="space-y-1 text-sm text-gray-700">
                    {alert.issue.map((item, i) => (
                      <div key={i}>• {item}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Analysis */}
              {alert.aiAnalysis && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-lg">🤖</span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 mb-2">AI ANALYSIS:</div>
                      <div className="text-sm text-gray-700 mb-2">{alert.aiAnalysis.description}</div>
                      {alert.aiAnalysis.rootCauses && (
                        <div className="space-y-1 text-xs text-gray-700">
                          {alert.aiAnalysis.rootCauses.map((cause, i) => (
                            <div key={i}>• {cause}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {alert.recommendations && (
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-2">💡 RECOMMENDATIONS:</div>
                  <div className="space-y-3">
                    {alert.recommendations.map((rec, i) => (
                      <div key={i} className="bg-gray-50 border border-gray-200 rounded-md p-3">
                        <div className="font-medium text-sm mb-1">
                          [{i + 1}] {rec.title}
                        </div>
                        {rec.details && (
                          <div className="space-y-1 text-xs text-gray-700 mt-2">
                            {rec.details.map((detail, j) => (
                              <div key={j}>• {detail}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {alert.actions && (
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  {alert.actions.map((action, i) => (
                    <Button
                      key={i}
                      variant={action.primary ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        if (action.type === "apply") {
                          // Handle apply action
                        } else if (action.type === "contact") {
                          onContactOperator && onContactOperator()
                        } else if (action.type === "view") {
                          onViewDetails && onViewDetails(alert)
                        } else if (action.type === "dismiss") {
                          onDismiss && onDismiss(alert.id)
                        }
                      }}
                    >
                      {action.icon === "check" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {action.icon === "message" && <MessageSquare className="h-3 w-3 mr-1" />}
                      {action.icon === "chart" && <BarChart3 className="h-3 w-3 mr-1" />}
                      {action.icon === "pause" && <Pause className="h-3 w-3 mr-1" />}
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


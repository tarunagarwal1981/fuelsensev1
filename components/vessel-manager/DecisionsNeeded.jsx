"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, AlertTriangle, CheckCircle2, FileText, MessageSquare, Pause, TrendingUp } from "lucide-react"

export function DecisionsNeeded({ decisions = [] }) {
  const defaultDecisions = [
    {
      id: 1,
      priority: "CRITICAL",
      title: "MV OCEAN STAR - Hull Cleaning Decision",
      vessel: "MV Ocean Star",
      situation: {
        consumption: "25 MT/day vs 22 planned (+14%)",
        lastCleaned: "142 days ago (22 days overdue)",
        extraCost: "$1,935/day = $58,050 wasted so far",
        currentVoyage: "Over budget by $51,600 (10.4%)",
      },
      aiRecommendation: "Clean at Lisbon (en route)",
      options: [
        {
          id: "A",
          name: "Clean at Rotterdam (destination)",
          cost: "$17,750 (cleaning + 12hr downtime)",
          savings: "$98,350 over next 60 days",
          roi: "554%",
          payback: "9 days",
        },
        {
          id: "B",
          name: "Clean at Lisbon (en route)",
          recommended: true,
          cost: "$22,027 (includes 85nm deviation)",
          savings: "$107,618 over next 60 days",
          extraSavings: "+$13,545 (saves 7 days of over-consumption)",
          roi: "589%",
          betterBy: "$9,268 vs Option A",
        },
        {
          id: "C",
          name: "Do Nothing",
          notRecommended: true,
          cost: "$154,800 wasted over next 60 days",
          issues: ["Performance continues to degrade", "Possible CP compliance issues"],
        },
      ],
    },
    {
      id: 2,
      priority: "WARNING",
      title: "MV PACIFIC VOYAGER - Drydocking Schedule",
      vessel: "MV Pacific Voyager",
      situation: {
        specialSurvey: "March 2026 (3 months away)",
        currentVoyageEnds: "January 15, 2026",
        nextVoyage: "Jan 20 - March 5",
        drydockSlots: "Feb 10-28, March 15-30",
      },
      options: [
        {
          id: "1",
          name: "Drydock in February (Skip next voyage)",
          cost: "$850K (drydock + 18 days out of service)",
          lostRevenue: "~$350K (one voyage)",
          totalCost: "$1.2M",
          readyDate: "March 1",
        },
        {
          id: "2",
          name: "One more voyage + March drydock",
          recommended: true,
          revenue: "$450K",
          drydockCost: "$850K",
          netCost: "$400K",
          savings: "$800K vs Option 1",
          risk: "Tight timeline, must complete voyage on time",
        },
      ],
      recommendation: "Option 2 (Better financially) - But need to book drydock slot NOW",
    },
    {
      id: 3,
      priority: "WARNING",
      title: "FLEET CII RATING - Risk of Downgrade",
      situation: {
        fleetAverage: "C rating",
        target: "Maintain C or improve to B",
        risk: "3 vessels trending toward D rating",
        timeRemaining: "3 months to year-end",
      },
      vesselsAtRisk: [
        { name: "MV Ocean Star", rating: "C", threshold: "68% to D threshold" },
        { name: "MV Baltic", rating: "C", threshold: "72% to D threshold" },
        { name: "MV Indian Ocean", rating: "C", threshold: "75% to D threshold" },
      ],
      recommendations: [
        {
          action: "Approve hull cleaning for MV Ocean Star",
          impact: "Prevents downgrade, saves -3% CII",
        },
        {
          action: "Speed optimization for MV Baltic",
          details: "Reduce by 0.5 knots on next 2 voyages",
          impact: "-2% CII, minimal ETA impact",
        },
        {
          action: "MV Indian Ocean: Already optimized",
          details: "Monitor closely, may need biofuel blend",
        },
      ],
      projectedOutcome: {
        allMaintainC: true,
        fleetAverage: "C+ (better than current)",
        complianceCost: "$45K (vs $120K penalty if D rating)",
      },
    },
  ]

  const displayDecisions = decisions.length > 0 ? decisions : defaultDecisions

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">🚨 DECISIONS NEEDED</h2>
        <Badge variant="secondary" className="text-sm">
          {displayDecisions.length} items requiring your action
        </Badge>
      </div>

      {displayDecisions.map((decision) => (
        <Card key={decision.id} className="border-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {decision.priority === "CRITICAL" ? (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  )}
                  <CardTitle className="text-lg">{decision.title}</CardTitle>
                </div>
              </div>
              <Badge
                variant={decision.priority === "CRITICAL" ? "destructive" : "secondary"}
                className="ml-2"
              >
                {decision.priority}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Situation */}
            {decision.situation && (
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">SITUATION:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {Object.entries(decision.situation).map(([key, value]) => (
                    <li key={key} className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>
                        <strong className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</strong> {value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Recommendation */}
            {decision.aiRecommendation && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm">
                  <strong>🤖 AI RECOMMENDATION:</strong> {decision.aiRecommendation}
                </p>
              </div>
            )}

            {/* Options */}
            {decision.options && (
              <div className="space-y-3">
                {decision.options.map((option) => (
                  <div
                    key={option.id}
                    className={`p-4 rounded-lg border-2 ${
                      option.recommended
                        ? "bg-green-50 border-green-300"
                        : option.notRecommended
                          ? "bg-red-50 border-red-300"
                          : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">OPTION {option.id}:</span>
                        <span className="font-semibold">{option.name}</span>
                        {option.recommended && (
                          <Badge className="bg-green-600">⭐ RECOMMENDED</Badge>
                        )}
                        {option.notRecommended && (
                          <Badge variant="destructive">⚠️ NOT RECOMMENDED</Badge>
                        )}
                      </div>
                    </div>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {option.cost && (
                        <li className="flex items-start gap-2">
                          <span>├─</span>
                          <span>
                            <strong>Cost:</strong> {option.cost}
                          </span>
                        </li>
                      )}
                      {option.savings && (
                        <li className="flex items-start gap-2">
                          <span>├─</span>
                          <span>
                            <strong>Savings:</strong> {option.savings}
                          </span>
                        </li>
                      )}
                      {option.extraSavings && (
                        <li className="flex items-start gap-2">
                          <span>├─</span>
                          <span>{option.extraSavings}</span>
                        </li>
                      )}
                      {option.roi && (
                        <li className="flex items-start gap-2">
                          <span>├─</span>
                          <span>
                            <strong>ROI:</strong> {option.roi}
                          </span>
                        </li>
                      )}
                      {option.payback && (
                        <li className="flex items-start gap-2">
                          <span>└─</span>
                          <span>
                            <strong>Payback:</strong> {option.payback}
                          </span>
                        </li>
                      )}
                      {option.betterBy && (
                        <li className="flex items-start gap-2">
                          <span>└─</span>
                          <span>
                            <strong>Better than Option A by:</strong> {option.betterBy}
                          </span>
                        </li>
                      )}
                      {option.issues && (
                        <li className="flex items-start gap-2">
                          <span>└─</span>
                          <div>
                            {option.issues.map((issue, idx) => (
                              <div key={idx} className="text-red-600">
                                ❌ {issue}
                              </div>
                            ))}
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Vessels at Risk */}
            {decision.vesselsAtRisk && (
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">VESSELS AT RISK:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {decision.vesselsAtRisk.map((vessel, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span>{idx + 1}.</span>
                      <span>
                        <strong>{vessel.name}:</strong> {vessel.rating} rating, {vessel.threshold} ⚠️
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {decision.recommendations && (
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">🤖 AI RECOMMENDATIONS:</h4>
                <div className="space-y-2">
                  {decision.recommendations.map((rec, idx) => (
                    <div key={idx} className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{rec.action}</p>
                          {rec.details && <p className="text-xs text-gray-600 mt-1">└─ {rec.details}</p>}
                          {rec.impact && <p className="text-xs text-gray-600 mt-1">└─ Impact: {rec.impact}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projected Outcome */}
            {decision.projectedOutcome && (
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">PROJECTED OUTCOME (if actions taken):</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {decision.projectedOutcome.allMaintainC && (
                    <li>• All vessels maintain C rating ✅</li>
                  )}
                  <li>• Fleet average: {decision.projectedOutcome.fleetAverage}</li>
                  <li>• Compliance cost: {decision.projectedOutcome.complianceCost}</li>
                </ul>
              </div>
            )}

            {/* Recommendation Summary */}
            {decision.recommendation && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm">
                  <strong>RECOMMENDATION:</strong> {decision.recommendation}
                </p>
              </div>
            )}

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {decision.priority === "CRITICAL" && (
                <>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approve Option B
                  </Button>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Request More Info
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Discuss with Operator
                  </Button>
                  <Button variant="outline">
                    <Pause className="mr-2 h-4 w-4" />
                    Defer Decision
                  </Button>
                </>
              )}
              {decision.priority === "WARNING" && decision.id === 2 && (
                <>
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Book March Slot
                  </Button>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    View Full Analysis
                  </Button>
                </>
              )}
              {decision.priority === "WARNING" && decision.id === 3 && (
                <>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    View Detailed Plan
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approve All Actions
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


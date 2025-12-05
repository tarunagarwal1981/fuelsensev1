"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, CheckCircle2, XCircle, FileText, MessageSquare } from "lucide-react"
import { format } from "date-fns"

export function DrydockingPlanner({ data }) {
  const defaultData = {
    upcoming: [
      {
        vessel: "MV Pacific Voyager",
        surveyType: "Special Survey (5-year)",
        dueDate: "2026-03-15",
        monthsAway: 3,
        lastDrydock: "2021-03",
        currentVoyageEnds: "2026-01-15",
        nextVoyagePeriod: "Jan 20 - March 5, 2026",
        planningStatus: {
          yardSelection: "IN_PROGRESS",
          scopeDefinition: "COMPLETE",
          budgetApproval: "PENDING",
          slotBooking: "NOT_BOOKED",
        },
        options: [
          {
            id: 1,
            name: "Drydock in February (Skip next voyage)",
            period: "Feb 10-28, 2026",
            drydockCost: 850000,
            lostRevenue: 350000,
            totalCost: 1200000,
            outOfService: 18,
            readyDate: "2026-03-01",
          },
          {
            id: 2,
            name: "One more voyage + March drydock",
            voyageRevenue: 450000,
            period: "March 15-30, 2026",
            drydockCost: 850000,
            netCost: 400000,
            savingsVsOpt1: 800000,
            risk: "Tight timeline",
            recommended: true,
            action: "Book March slot NOW",
          },
        ],
        yards: [
          {
            name: "Sembcorp Marine",
            location: "Singapore",
            cost: 820000,
            duration: 14,
            slot: "March 15-30",
            available: true,
            rating: 4.5,
          },
          {
            name: "Keppel FELS",
            location: "Singapore",
            cost: 880000,
            duration: 13,
            slot: "March 20-April 2",
            available: true,
            rating: 4.8,
          },
          {
            name: "Damen Shipyard",
            location: "Amsterdam",
            cost: 950000,
            duration: 15,
            slot: "March 10-25",
            available: true,
            rating: 4.2,
          },
        ],
        scopeOfWork: {
          hullSurvey: 420000,
          mainEngineOverhaul: 180000,
          auxiliarySystems: 95000,
          paintCoating: 85000,
          classCertification: 40000,
          total: 820000,
        },
      },
    ],
    budget2026: {
      totalPlanned: 2400000,
      spentYtd: 0,
      committed: 850000,
      remaining: 1550000,
    },
  }

  const drydockData = data || defaultData

  const getStatusIcon = (status) => {
    switch (status) {
      case "COMPLETE":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "IN_PROGRESS":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "PENDING":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "NOT_BOOKED":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Upcoming Drydocking */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">UPCOMING DRYDOCKING (Next 12 Months):</h3>
        {drydockData.upcoming.map((drydock, idx) => (
          <Card key={idx} className="border-2 border-yellow-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <CardTitle>
                    🟡 {drydock.vessel} - {drydock.surveyType} Due {format(new Date(drydock.dueDate), "MMMM yyyy")}
                  </CardTitle>
                </div>
                <Badge className="bg-yellow-600">
                  {drydock.monthsAway} months away ⚠️
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Survey Type:</div>
                  <div className="font-semibold">{drydock.surveyType}</div>
                </div>
                <div>
                  <div className="text-gray-600">Due Date:</div>
                  <div className="font-semibold">{format(new Date(drydock.dueDate), "MMMM d, yyyy")}</div>
                </div>
                <div>
                  <div className="text-gray-600">Last Drydock:</div>
                  <div className="font-semibold">{drydock.lastDrydock}</div>
                </div>
                <div>
                  <div className="text-gray-600">Current Voyage Ends:</div>
                  <div className="font-semibold">{format(new Date(drydock.currentVoyageEnds), "MMM d, yyyy")}</div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-sm mb-2">PLANNING STATUS:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(drydock.planningStatus.yardSelection)}
                    <span>Yard selection: {drydock.planningStatus.yardSelection === "IN_PROGRESS" ? "⏳ In progress" : drydock.planningStatus.yardSelection}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(drydock.planningStatus.scopeDefinition)}
                    <span>Scope definition: {drydock.planningStatus.scopeDefinition === "COMPLETE" ? "✅ Complete" : drydock.planningStatus.scopeDefinition}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(drydock.planningStatus.budgetApproval)}
                    <span>Budget approval: {drydock.planningStatus.budgetApproval === "PENDING" ? "⏳ Pending" : drydock.planningStatus.budgetApproval}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(drydock.planningStatus.slotBooking)}
                    <span>Slot booking: {drydock.planningStatus.slotBooking === "NOT_BOOKED" ? "❌ Not yet booked 🔴" : drydock.planningStatus.slotBooking}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-sm mb-2">SCHEDULING OPTIONS:</h4>
                <div className="space-y-3">
                  {drydock.options.map((option) => (
                    <div
                      key={option.id}
                      className={`p-4 rounded-lg border-2 ${option.recommended ? "bg-green-50 border-green-300" : "bg-gray-50 border-gray-200"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">Option {option.id}: {option.name}</span>
                        {option.recommended && <Badge className="bg-green-600">⭐ RECOMMENDED</Badge>}
                      </div>
                      <div className="text-sm text-gray-700 space-y-1">
                        {option.period && <div>├─ Drydock period: {option.period}</div>}
                        {option.drydockCost && <div>├─ Drydock cost: ${option.drydockCost.toLocaleString()}</div>}
                        {option.lostRevenue && <div>├─ Lost revenue: ~${option.lostRevenue.toLocaleString()} (one voyage)</div>}
                        {option.voyageRevenue && <div>├─ Voyage revenue: ${option.voyageRevenue.toLocaleString()}</div>}
                        {option.outOfService && <div>├─ Out of service: {option.outOfService} days</div>}
                        {option.totalCost && <div>├─ Total cost: ${option.totalCost.toLocaleString()}</div>}
                        {option.netCost && <div>├─ Net cost: ${option.netCost.toLocaleString()}</div>}
                        {option.savingsVsOpt1 && <div>├─ Savings vs Option 1: ${option.savingsVsOpt1.toLocaleString()} ✅</div>}
                        {option.risk && <div>├─ Risk: {option.risk}</div>}
                        {option.readyDate && <div>└─ Ready for service: {format(new Date(option.readyDate), "MMM d, yyyy")}</div>}
                        {option.action && <div className="mt-2 font-semibold text-yellow-700">└─ Action required: {option.action}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-sm mb-2">AVAILABLE YARDS ({format(new Date(drydock.dueDate), "MMMM yyyy")}):</h4>
                <div className="space-y-3">
                  {drydock.yards.map((yard, yIdx) => (
                    <div key={yIdx} className="p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-semibold">{yIdx + 1}. {yard.name}</span>
                          <span className="text-sm text-gray-600 ml-2">({yard.location})</span>
                        </div>
                        {yard.available && <Badge className="bg-green-600">✅ Available</Badge>}
                      </div>
                      <div className="text-sm text-gray-700 space-y-1">
                        <div>├─ Cost estimate: ${yard.cost.toLocaleString()}</div>
                        <div>├─ Duration: {yard.duration} days</div>
                        <div>├─ Slot: {yard.slot}</div>
                        <div>└─ Rating: {yard.rating}/5 {yard.rating >= 4.5 && "(reliable, good quality)"}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-300">
                  <div className="font-semibold text-sm">RECOMMENDATION: Sembcorp Marine (Best value + timing)</div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-sm mb-2">ESTIMATED SCOPE OF WORK:</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <div>├─ Hull survey & repairs: ${drydock.scopeOfWork.hullSurvey.toLocaleString()}</div>
                  <div>├─ Main engine overhaul: ${drydock.scopeOfWork.mainEngineOverhaul.toLocaleString()}</div>
                  <div>├─ Auxiliary systems: ${drydock.scopeOfWork.auxiliarySystems.toLocaleString()}</div>
                  <div>├─ Paint & coating: ${drydock.scopeOfWork.paintCoating.toLocaleString()}</div>
                  <div>├─ Class certification: ${drydock.scopeOfWork.classCertification.toLocaleString()}</div>
                  <div className="font-semibold">└─ Total: ${drydock.scopeOfWork.total.toLocaleString()}</div>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button className="bg-green-600 hover:bg-green-700">
                  ✅ Book Sembcorp March 15-30
                </Button>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Request Quote
                </Button>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  View Full Scope
                </Button>
                <Button variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Discuss with Management
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Other Upcoming Surveys */}
      <Card>
        <CardHeader>
          <CardTitle>OTHER UPCOMING SURVEYS:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-700 space-y-1">
            <div>• MV Baltic: Intermediate Survey - May 2026 (Planned)</div>
            <div>• MV Atlantic: Annual Survey - July 2026 (Scheduled)</div>
            <div>• MV Coral: Special Survey - October 2026 (Planning)</div>
          </div>
        </CardContent>
      </Card>

      {/* Budget */}
      <Card>
        <CardHeader>
          <CardTitle>DRYDOCKING BUDGET (2026):</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-700 space-y-1">
            <div>├─ Total planned: ${drydockData.budget2026.totalPlanned.toLocaleString()}</div>
            <div>├─ Spent YTD: ${drydockData.budget2026.spentYtd.toLocaleString()}</div>
            <div>├─ Committed: ${drydockData.budget2026.committed.toLocaleString()} (MV Pacific Voyager)</div>
            <div className="font-semibold">└─ Remaining budget: ${drydockData.budget2026.remaining.toLocaleString()}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


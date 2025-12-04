"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Edit, CheckCircle2, FileText } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

/**
 * ROB Report Alert - Pre-filled ROB report ready to submit
 */
export function ROBReportAlert({ report, onSubmit, onEdit, onViewFull }) {
  if (!report) return null

  return (
    <Card className="border-2 border-primary-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">
            2. ⏰ ROB REPORT DUE TODAY ({report.dueTime})
          </CardTitle>
          <Badge className="bg-primary-600 text-white text-xs">
            Due in: {formatDistanceToNow(new Date(report.dueAt), { addSuffix: true })}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm text-gray-600 mb-2">Status: Not submitted yet</div>
        </div>

        {/* AI Pre-filled Data */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-start gap-2 mb-3">
            <span className="text-lg">🤖</span>
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-900 mb-2">AI PRE-FILLED DATA (Review & Submit):</div>
              
              {report.currentROB && (
                <div className="mb-3">
                  <div className="text-xs font-semibold text-gray-700 mb-1">Current ROB (calculated from yesterday + consumption):</div>
                  <div className="space-y-1 text-xs text-gray-700 ml-4">
                    {report.currentROB.vlsfo && (
                      <div>├─ VLSFO: {report.currentROB.vlsfo} MT {report.currentROB.vlsfoAccuracy && `(±${report.currentROB.vlsfoAccuracy} MT accuracy)`}</div>
                    )}
                    {report.currentROB.lsmgo && (
                      <div>├─ LSMGO: {report.currentROB.lsmgo} MT {report.currentROB.lsmgoAccuracy && `(±${report.currentROB.lsmgoAccuracy} MT accuracy)`}</div>
                    )}
                    {report.currentROB.freshWater && (
                      <div>└─ Fresh Water: {report.currentROB.freshWater} MT</div>
                    )}
                  </div>
                </div>
              )}

              {report.consumption && (
                <div className="mb-3">
                  <div className="text-xs font-semibold text-gray-700 mb-1">Consumption (past 24 hours):</div>
                  <div className="space-y-1 text-xs text-gray-700 ml-4">
                    {report.consumption.vlsfo && (
                      <div>├─ VLSFO: {report.consumption.vlsfo} MT/day</div>
                    )}
                    {report.consumption.lsmgo && (
                      <div>└─ LSMGO: {report.consumption.lsmgo} MT/day</div>
                    )}
                  </div>
                </div>
              )}

              {report.voyageData && (
                <div className="mb-3">
                  <div className="text-xs font-semibold text-gray-700 mb-1">Voyage Data:</div>
                  <div className="space-y-1 text-xs text-gray-700 ml-4">
                    {report.voyageData.distance && (
                      <div>├─ Distance Made Good: {report.voyageData.distance} nm</div>
                    )}
                    {report.voyageData.speed && (
                      <div>└─ Average Speed: {report.voyageData.speed} knots</div>
                    )}
                  </div>
                </div>
              )}

              {report.dataQuality && (
                <div className="mt-3 pt-3 border-t border-blue-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <div className="text-xs font-semibold text-gray-900">
                      Data Quality: {report.dataQuality.level} ({report.dataQuality.confidence}% confidence)
                    </div>
                  </div>
                  <div className="text-xs text-gray-700 mt-1 ml-6">
                    • Based on: {report.dataQuality.basedOn}
                  </div>
                  {report.dataQuality.validated && (
                    <div className="text-xs text-gray-700 ml-6">
                      • Validated against: {report.dataQuality.validated}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" className="text-xs" onClick={onEdit}>
            <Edit className="h-3 w-3 mr-1" />
            Edit Values
          </Button>
          <Button variant="default" size="sm" className="text-xs bg-success hover:bg-green-600" onClick={onSubmit}>
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Confirm & Submit
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={onViewFull}>
            <FileText className="h-3 w-3 mr-1" />
            Full Form
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


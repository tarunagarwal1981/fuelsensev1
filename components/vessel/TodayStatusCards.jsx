"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Fuel, Zap, CheckCircle2, FileText, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Today's Status Cards - Quick Overview
 * 4 cards: Fuel, Performance, Actions, Reports
 */
export function TodayStatusCards({ status, onViewActions, onSubmitReport }) {
  if (!status) return null

  const { fuel, performance, actions, reports } = status

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Fuel Card */}
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Fuel className="h-5 w-5 text-primary-600" />
            <div className="text-xs font-semibold text-gray-600">🛢️ FUEL</div>
          </div>
          <div className="space-y-2">
            <div>
              <div className="text-gray-600 text-xs">ROB:</div>
              <div className="text-xl font-bold">{fuel.rob} MT</div>
            </div>
            <div>
              <div className="text-gray-600 text-xs">Status:</div>
              <Badge className={cn(
                fuel.status === "GOOD" && "bg-success text-white",
                fuel.status === "WATCH" && "bg-warning text-black",
                fuel.status === "LOW" && "bg-danger text-white",
                "text-xs"
              )}>
                {fuel.status === "GOOD" ? "✅" : fuel.status === "WATCH" ? "⚠️" : "🔴"} {fuel.status}
              </Badge>
            </div>
            {fuel.daysLeft && (
              <div>
                <div className="text-gray-600 text-xs">Days left:</div>
                <div className="text-sm font-medium">{fuel.daysLeft} days</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Card */}
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-warning" />
            <div className="text-xs font-semibold text-gray-600">⚡ PERF</div>
          </div>
          <div className="space-y-2">
            <div>
              <div className="text-gray-600 text-xs">Consump:</div>
              <div className="text-xl font-bold">{performance.consumption} MT/day</div>
            </div>
            <div>
              <div className="text-gray-600 text-xs">vs Plan:</div>
              <Badge className={cn(
                performance.variance >= 0 ? "bg-warning text-black" : "bg-success text-white",
                "text-xs"
              )}>
                {performance.variance >= 0 ? "⚠️" : "✅"} {performance.variance >= 0 ? "+" : ""}{performance.variancePercent}%
              </Badge>
            </div>
            {performance.actionNeeded && (
              <div>
                <div className="text-gray-600 text-xs">Action:</div>
                <div className="text-xs text-warning font-medium">Needed ⚠️</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions Card */}
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <div className="text-xs font-semibold text-gray-600">✅ ACTIONS</div>
          </div>
          <div className="space-y-2">
            <div>
              <div className="text-gray-600 text-xs">Pending:</div>
              <div className="text-xl font-bold">{actions.count} task{actions.count !== 1 ? "s" : ""}</div>
            </div>
            <div>
              <div className="text-gray-600 text-xs">Priority:</div>
              <div className="text-xs font-medium">{actions.priority}</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs mt-2"
              onClick={onViewActions}
            >
              View <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports Card */}
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-primary-600" />
            <div className="text-xs font-semibold text-gray-600">📋 REPORTS</div>
          </div>
          <div className="space-y-2">
            <div>
              <div className="text-gray-600 text-xs">Due Today:</div>
              <div className="text-sm font-medium">{reports.dueToday}</div>
            </div>
            {reports.nextDue && (
              <div>
                <div className="text-gray-600 text-xs">Next:</div>
                <div className="text-xs font-medium">{reports.nextDue}</div>
              </div>
            )}
            <Button
              variant="default"
              size="sm"
              className="w-full text-xs mt-2 bg-primary-600 hover:bg-primary-700"
              onClick={onSubmitReport}
            >
              Submit <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


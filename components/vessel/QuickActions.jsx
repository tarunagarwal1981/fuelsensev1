"use client"

import { Button } from "@/components/ui/button"
import { FileText, MessageSquare, BarChart3, MapPin, TrendingUp, Settings } from "lucide-react"

/**
 * Quick Actions - Fast access buttons
 */
export function QuickActions({ onSubmitReport, onContactOperator, onViewDetails, onViewMap, onViewTrends, onSettings }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
      <Button
        variant="default"
        size="sm"
        className="bg-primary-600 hover:bg-primary-700"
        onClick={onSubmitReport}
      >
        <FileText className="h-4 w-4 mr-1" />
        Submit ROB Report
      </Button>
      <Button variant="outline" size="sm" onClick={onContactOperator}>
        <MessageSquare className="h-4 w-4 mr-1" />
        Contact Operator
      </Button>
      <Button variant="outline" size="sm" onClick={onViewDetails}>
        <BarChart3 className="h-4 w-4 mr-1" />
        View Details
      </Button>
      <Button variant="outline" size="sm" onClick={onViewMap}>
        <MapPin className="h-4 w-4 mr-1" />
        View Voyage Map
      </Button>
      <Button variant="outline" size="sm" onClick={onViewTrends}>
        <TrendingUp className="h-4 w-4 mr-1" />
        Performance Trends
      </Button>
      <Button variant="outline" size="sm" onClick={onSettings}>
        <Settings className="h-4 w-4 mr-1" />
        Settings
      </Button>
    </div>
  )
}


"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Construction } from "lucide-react"

export function CostsTab() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
          <Construction className="h-10 w-10 text-orange-600" />
        </div>
        <CardTitle className="text-2xl">Costs Tab - Coming Soon</CardTitle>
        <CardDescription className="text-base">
          Financial overview and cost analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-3 text-gray-900">Planned Features:</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-1">•</span>
              <span>Bunker cost analysis and trends</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-1">•</span>
              <span>Maintenance budget vs actual tracking</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-1">•</span>
              <span>Cost per vessel breakdown</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-1">•</span>
              <span>ROI on improvements and optimizations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-1">•</span>
              <span>Cost savings opportunities identification</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}


"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Mail } from "lucide-react"

export function CostBreakdownTable({ vessels = [] }) {
  const formatCurrency = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toLocaleString()}`
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "EXCELLENT":
        return <Badge className="bg-green-600">✅ Excellent</Badge>
      case "GOOD":
        return <Badge className="bg-blue-600">✅ Good</Badge>
      case "MONITOR":
        return <Badge className="bg-yellow-600">⚠️ Monitor</Badge>
      case "NEEDS_WORK":
        return <Badge variant="destructive">🔴 Needs work</Badge>
      case "ENGINE_ISSUE":
        return <Badge variant="destructive">🔴 Engine issue</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getVarianceBadge = (variance) => {
    if (variance < -2) return <Badge className="bg-green-600">✅</Badge>
    if (variance > 5) return <Badge variant="destructive">🔴</Badge>
    return <Badge className="bg-yellow-600">⚠️</Badge>
  }

  const fleetTotal = vessels.reduce(
    (acc, v) => ({
      bunker: acc.bunker + v.bunker,
      maintenance: acc.maintenance + v.maintenance,
      total: acc.total + v.total,
    }),
    { bunker: 0, maintenance: 0, total: 0 }
  )

  const fleetAvgVariance = vessels.reduce((sum, v) => sum + v.vsBudget, 0) / vessels.length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>COST BREAKDOWN BY VESSEL</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              View Detailed Breakdown
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vessel</TableHead>
                <TableHead className="text-right">Bunker</TableHead>
                <TableHead className="text-right">Maint</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">vs Budget</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vessels.map((vessel, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{vessel.vessel}</TableCell>
                  <TableCell className="text-right">{formatCurrency(vessel.bunker)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(vessel.maintenance)}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(vessel.total)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className={vessel.vsBudget > 5 ? "text-red-600" : vessel.vsBudget < -2 ? "text-green-600" : "text-yellow-600"}>
                        {vessel.vsBudget > 0 ? "+" : ""}{vessel.vsBudget}%
                      </span>
                      {getVarianceBadge(vessel.vsBudget)}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(vessel.status)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold bg-gray-50">
                <TableCell>FLEET TOTAL</TableCell>
                <TableCell className="text-right">{formatCurrency(fleetTotal.bunker)}</TableCell>
                <TableCell className="text-right">{formatCurrency(fleetTotal.maintenance)}</TableCell>
                <TableCell className="text-right">{formatCurrency(fleetTotal.total)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className={fleetAvgVariance < 0 ? "text-green-600" : "text-red-600"}>
                      {fleetAvgVariance > 0 ? "+" : ""}{fleetAvgVariance.toFixed(1)}%
                    </span>
                    {fleetAvgVariance < 0 ? <Badge className="bg-green-600">✅</Badge> : <Badge variant="destructive">⚠️</Badge>}
                  </div>
                </TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}


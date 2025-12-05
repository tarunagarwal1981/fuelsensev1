"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, MessageSquare } from "lucide-react"

export function ROIAnalysis({ roi }) {
  const formatCurrency = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toLocaleString()}`
  }

  const formatROI = (roi) => {
    if (roi === Infinity) return "∞"
    return `${roi}%`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>ROI FROM OPTIMIZATION INITIATIVES</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              View Initiative Details
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Share with Management
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Initiative</TableHead>
                <TableHead className="text-right">Investment</TableHead>
                <TableHead className="text-right">Savings</TableHead>
                <TableHead className="text-right">ROI</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roi.initiatives.map((initiative, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{initiative.name}</TableCell>
                  <TableCell className="text-right">{formatCurrency(initiative.investment)}</TableCell>
                  <TableCell className="text-right font-semibold text-green-600">{formatCurrency(initiative.savings)}</TableCell>
                  <TableCell className="text-right font-bold">{formatROI(initiative.roi)}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-600">✅ {initiative.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold bg-gray-50">
                <TableCell>TOTAL</TableCell>
                <TableCell className="text-right">{formatCurrency(roi.total.investment)}</TableCell>
                <TableCell className="text-right font-semibold text-green-600">{formatCurrency(roi.total.savings)}</TableCell>
                <TableCell className="text-right font-bold">{formatROI(roi.total.roi)}</TableCell>
                <TableCell>
                  <Badge className="bg-green-600">✅</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-300">
          <div className="text-sm text-gray-700">
            💡 INSIGHT: Every $1 invested in optimization returns ${(roi.total.savings / roi.total.investment).toFixed(2)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


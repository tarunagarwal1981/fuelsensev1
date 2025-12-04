"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Completed Voyages Table
 * Shows completed voyages with operator impact and CP compliance
 */
export function CompletedVoyagesTable({ voyages = [] }) {
  if (voyages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">COMPLETED VOYAGES (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-4">No completed voyages in the last 30 days</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">COMPLETED VOYAGES (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vessel</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>CP Type</TableHead>
                <TableHead className="text-right">Operator Impact</TableHead>
                <TableHead className="text-right">CP Compliance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {voyages.map((voyage, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{voyage.vessel}</TableCell>
                  <TableCell>{voyage.route}</TableCell>
                  <TableCell>{voyage.cpType}</TableCell>
                  <TableCell className="text-right">
                    <Badge className={cn(
                      voyage.operatorImpact >= 0 ? "bg-success text-white" : "bg-warning text-black",
                      "text-xs"
                    )}>
                      {voyage.operatorImpact >= 0 ? "+" : ""}${(voyage.operatorImpact / 1000).toFixed(0)}K
                      {voyage.operatorImpact >= 0 ? "✅" : "⚠️"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-sm font-medium">{voyage.cpCompliance}%</span>
                      {voyage.cpCompliance >= 95 ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-warning" />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}


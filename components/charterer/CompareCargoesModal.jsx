"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Compare Cargoes Modal
 * Side-by-side comparison of 2-3 selected cargoes
 */
export function CompareCargoesModal({ open, onOpenChange, cargoes, onFixBest }) {
  if (!cargoes || cargoes.length < 2 || cargoes.length > 3) return null

  // Find best cargo (highest profit)
  const bestCargo = cargoes.reduce((best, current) =>
    current.profit > best.profit ? current : best
  )

  const metrics = [
    {
      label: "Profit",
      getValue: (cargo) => `$${(cargo.profit / 1000).toFixed(0)}K`,
      isBest: (cargo) => cargo.profit === bestCargo.profit,
      highlight: "success",
    },
    {
      label: "Bunker Cost",
      getValue: (cargo) => `$${(cargo.bunkerCost / 1000).toFixed(0)}K`,
      isBest: (cargo) =>
        cargo.bunkerCost ===
        Math.min(...cargoes.map((c) => c.bunkerCost)),
      highlight: "success",
    },
    {
      label: "Risk",
      getValue: (cargo) => cargo.risk,
      isBest: (cargo) => cargo.risk === "LOW",
      highlight: "success",
    },
    {
      label: "Confidence",
      getValue: (cargo) => `${cargo.confidence}%`,
      isBest: (cargo) =>
        cargo.confidence === Math.max(...cargoes.map((c) => c.confidence)),
      highlight: "success",
    },
    {
      label: "Duration",
      getValue: (cargo) => `${cargo.duration} days`,
      isBest: (cargo) =>
        cargo.duration === Math.min(...cargoes.map((c) => c.duration)),
      highlight: "success",
    },
    {
      label: "Bunker Options",
      getValue: (cargo) => `${cargo.bunkerPorts?.length || 0}`,
      isBest: (cargo) =>
        (cargo.bunkerPorts?.length || 0) ===
        Math.max(...cargoes.map((c) => c.bunkerPorts?.length || 0)),
      highlight: "success",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare Cargoes</DialogTitle>
          <DialogDescription>
            Side-by-side comparison of selected cargoes
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Metric</TableHead>
                {cargoes.map((cargo, idx) => (
                  <TableHead key={idx} className="text-center">
                    {cargo.loadPort} → {cargo.dischargePort}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((metric, metricIdx) => (
                <TableRow key={metricIdx}>
                  <TableCell className="font-medium">
                    {metric.label}
                  </TableCell>
                  {cargoes.map((cargo, cargoIdx) => {
                    const isBest = metric.isBest(cargo)
                    return (
                      <TableCell
                        key={cargoIdx}
                        className={cn(
                          "text-center",
                          isBest && "bg-green-50"
                        )}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span>{metric.getValue(cargo)}</span>
                          {isBest && (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          )}
                        </div>
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            className="bg-success hover:bg-green-600"
            onClick={() => {
              onFixBest(bestCargo)
              onOpenChange(false)
            }}
          >
            Fix Best ({bestCargo.loadPort} → {bestCargo.dischargePort})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


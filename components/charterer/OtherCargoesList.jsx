"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Other Cargoes List - Compact cards showing other cargo opportunities
 * Takes 30% of main content area
 */
export function OtherCargoesList({ cargoes, onSelect, onFix }) {
  if (!cargoes || cargoes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">No other cargoes available</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Other Cargoes</h3>
      {cargoes.slice(0, 3).map((cargo) => {
        const isViable = cargo.viable && (cargo.bunkerPorts?.length || 0) > 0

        return (
          <Card
            key={cargo.id}
            className={cn(
              "hover:shadow-md transition-all cursor-pointer",
              isViable ? "border-l-4 border-success" : "border-l-4 border-danger"
            )}
            onClick={() => onSelect(cargo)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-sm truncate">
                      {cargo.loadPort} → {cargo.dischargePort}
                    </h4>
                    {isViable ? (
                      <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-danger flex-shrink-0" />
                    )}
                  </div>
                  
                  {isViable ? (
                    <>
                      <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                        <span className="font-semibold text-success">
                          ${(cargo.profit / 1000).toFixed(0)}K profit
                        </span>
                        <span>•</span>
                        <span>{cargo.confidence}% confidence</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn(
                          "text-xs",
                          cargo.risk === "LOW" && "bg-success text-white",
                          cargo.risk === "MEDIUM" && "bg-warning text-black",
                          cargo.risk === "HIGH" && "bg-danger text-white"
                        )}>
                          {cargo.risk} Risk
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          ✅ Bunker OK
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-1">
                      <Badge className="bg-danger text-white text-xs">
                        ❌ CANNOT FIX
                      </Badge>
                      <p className="text-xs text-gray-600">
                        No bunker options available
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  {isViable && cargo.status === "READY_FOR_DECISION" && (
                    <Button
                      size="sm"
                      className="text-xs h-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        onFix(cargo)
                      }}
                    >
                      Fix
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelect(cargo)
                    }}
                  >
                    Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}


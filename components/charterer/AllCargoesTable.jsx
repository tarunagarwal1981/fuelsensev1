"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, Search, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * All Cargoes Table View
 * Shows all cargoes in a sortable, filterable table
 */
export function AllCargoesTable({
  cargoes,
  onViewDetails,
  onFix,
  onCompare,
}) {
  const [selectedCargoes, setSelectedCargoes] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCargoes = cargoes.filter((cargo) => {
    const route = `${cargo.loadPort} → ${cargo.dischargePort}`.toLowerCase()
    return route.includes(searchQuery.toLowerCase())
  })

  const toggleSelection = (cargoId) => {
    const newSet = new Set(selectedCargoes)
    if (newSet.has(cargoId)) {
      newSet.delete(cargoId)
    } else {
      newSet.add(cargoId)
    }
    setSelectedCargoes(newSet)
  }

  const handleCompare = () => {
    const selected = filteredCargoes.filter((c) =>
      selectedCargoes.has(c.id)
    )
    if (selected.length >= 2 && selected.length <= 3) {
      onCompare(selected)
    }
  }

  const getRiskBadge = (risk) => {
    return (
      <Badge
        className={cn(
          "text-xs",
          risk === "LOW" && "bg-success text-white",
          risk === "MEDIUM" && "bg-warning text-black",
          risk === "HIGH" && "bg-danger text-white"
        )}
      >
        {risk}
      </Badge>
    )
  }

  const getStatusBadge = (status, viable) => {
    if (!viable) {
      return <Badge className="bg-danger text-white text-xs">❌</Badge>
    }
    const variants = {
      READY_FOR_DECISION: "bg-primary-600 text-white",
      PENDING_ANALYSIS: "bg-warning text-black",
      FIXED: "bg-success text-white",
      REJECTED: "bg-danger text-white",
    }
    return (
      <Badge className={cn("text-xs", variants[status] || "bg-gray-500")}>
        {status.replace(/_/g, " ")}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>All Cargoes ({filteredCargoes.length})</CardTitle>
            <CardDescription>
              Manage and compare all cargo opportunities
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {selectedCargoes.size >= 2 && selectedCargoes.size <= 3 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCompare}
              >
                Compare Selected ({selectedCargoes.size})
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedCargoes.size === filteredCargoes.length &&
                      filteredCargoes.length > 0
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCargoes(
                          new Set(filteredCargoes.map((c) => c.id))
                        )
                      } else {
                        setSelectedCargoes(new Set())
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Bunker Cost</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCargoes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No cargoes found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCargoes.map((cargo) => (
                  <TableRow
                    key={cargo.id}
                    className={cn(
                      "cursor-pointer hover:bg-gray-50",
                      selectedCargoes.has(cargo.id) && "bg-blue-50"
                    )}
                    onClick={() => onViewDetails(cargo)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedCargoes.has(cargo.id)}
                        onCheckedChange={() => toggleSelection(cargo.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {cargo.loadPort} → {cargo.dischargePort}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-success">
                        ${(cargo.profit / 1000).toFixed(0)}K
                      </span>
                    </TableCell>
                    <TableCell>
                      ${(cargo.bunkerCost / 1000).toFixed(0)}K
                    </TableCell>
                    <TableCell>{getRiskBadge(cargo.risk)}</TableCell>
                    <TableCell>{cargo.confidence}%</TableCell>
                    <TableCell>
                      {getStatusBadge(cargo.status, cargo.viable)}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetails(cargo)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {cargo.status === "READY_FOR_DECISION" &&
                          cargo.viable && (
                            <Button
                              size="sm"
                              onClick={() => onFix(cargo)}
                            >
                              Fix
                            </Button>
                          )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}


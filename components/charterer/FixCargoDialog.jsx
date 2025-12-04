"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Ship, Fuel, DollarSign } from "lucide-react"
import { format } from "date-fns"

/**
 * Fix Cargo Confirmation Dialog
 * Shows detailed confirmation before fixing a cargo
 */
export function FixCargoDialog({ open, onOpenChange, cargo, onConfirm }) {
  if (!cargo) return null

  const primaryBunker = cargo.bunkerPorts?.[0]
  const totalCost = cargo.bunkerCost + cargo.portCosts + cargo.otherCosts

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Cargo Fix</DialogTitle>
          <DialogDescription>
            Review the details before confirming this cargo fix
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Route */}
          <div>
            <div className="text-lg font-semibold mb-1">
              {cargo.loadPort} → {cargo.dischargePort}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Ship className="h-4 w-4" />
              <span>{cargo.vessel}</span>
            </div>
          </div>

          <Separator />

          {/* Financial Summary */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expected Profit:</span>
              <span className="text-lg font-bold text-success">
                ${(cargo.profit / 1000).toFixed(0)}K
              </span>
            </div>
            {primaryBunker && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 flex items-center gap-1">
                  <Fuel className="h-4 w-4" />
                  Bunker:
                </span>
                <span className="font-medium">
                  {primaryBunker.name}, {primaryBunker.quantity} MT
                </span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total Cost:</span>
              <span className="font-medium">${(totalCost / 1000).toFixed(0)}K</span>
            </div>
          </div>

          <Separator />

          {/* Actions that will happen */}
          <div className="bg-blue-50 rounded-md p-3">
            <div className="text-sm font-medium text-gray-900 mb-2">
              This will:
            </div>
            <ul className="space-y-1 text-xs text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3 w-3 mt-0.5 text-success flex-shrink-0" />
                <span>Reserve vessel</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3 w-3 mt-0.5 text-success flex-shrink-0" />
                <span>Create bunker nomination</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3 w-3 mt-0.5 text-success flex-shrink-0" />
                <span>Notify operator & vessel</span>
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-success hover:bg-green-600"
            onClick={() => {
              onConfirm(cargo)
              onOpenChange(false)
            }}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Confirm Fix
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


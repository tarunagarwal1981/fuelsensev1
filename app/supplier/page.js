"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Notifications } from "@/components/Notifications"
import { useStore } from "@/lib/store"
import {
  Fuel,
  Ship,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Package,
  TrendingUp,
  Star,
  Upload,
  Download,
  AlertTriangle,
} from "lucide-react"
import { format, formatDistanceToNow, isAfter } from "date-fns"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function SupplierPage() {
  const router = useRouter()
  const {
    currentUser,
    bunkerPlans,
    cargoes,
    vessels,
    updateBunkerPlanStatus,
    getCargoById,
    addNotification,
  } = useStore()

  const [activeTab, setActiveTab] = useState("nominations")
  const [selectedNomination, setSelectedNomination] = useState(null)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false)
  const [isRequestChangesDialogOpen, setIsRequestChangesDialogOpen] =
    useState(false)
  const [isInventoryUpdateOpen, setIsInventoryUpdateOpen] = useState(false)
  const [isBDNUploadOpen, setIsBDNUploadOpen] = useState(false)

  // Form states
  const [quotedPrice, setQuotedPrice] = useState("")
  const [selectedBarge, setSelectedBarge] = useState("")
  const [deliveryTime, setDeliveryTime] = useState("")
  const [deliveryNotes, setDeliveryNotes] = useState("")
  const [declineReason, setDeclineReason] = useState("")
  const [changeRequest, setChangeRequest] = useState("")
  const [inventory, setInventory] = useState({
    VLSFO: 2000,
    LSMGO: 500,
  })
  const [bdnData, setBdnData] = useState({
    bdnNumber: "",
    quantityDelivered: "",
    startTime: "",
    endTime: "",
  })

  // Get nominations for this supplier (filter by supplier name in plan)
  const pendingNominations = useMemo(() => {
    return bunkerPlans.filter(
      (plan) =>
        plan.status === "PENDING_APPROVAL" &&
        (plan.supplier.includes("Gulf") ||
          plan.supplier.includes("Bunker Marine") ||
          plan.supplier.includes("Singapore Marine"))
    )
  }, [bunkerPlans])

  const confirmedNominations = useMemo(() => {
    return bunkerPlans
      .filter((plan) => plan.status === "APPROVED")
      .sort(
        (a, b) =>
          new Date(a.deliveryWindow?.start || 0) -
          new Date(b.deliveryWindow?.start || 0)
      )
  }, [bunkerPlans])

  const completedNominations = useMemo(() => {
    return bunkerPlans
      .filter((plan) => plan.status === "COMPLETED")
      .sort(
        (a, b) =>
          new Date(b.approvedAt || 0) - new Date(a.approvedAt || 0)
      )
      .slice(0, 10)
  }, [bunkerPlans])

  // Redirect if not logged in as supplier
  useEffect(() => {
    if (!currentUser || currentUser.role !== "SUPPLIER") {
      router.push("/")
    }
  }, [currentUser, router])

  // Don't render if not authorized
  if (!currentUser || currentUser.role !== "SUPPLIER") {
    return null
  }

  const handleConfirmNomination = () => {
    if (!selectedNomination || !quotedPrice) {
      toast.error("Please enter a quoted price")
      return
    }

    // Update plan status to confirmed (we'll use a custom status)
    updateBunkerPlanStatus(
      selectedNomination.id,
      "APPROVED",
      `${currentUser.name} (Supplier)`,
      null
    )

    // Update inventory
    const newInventory = {
      ...inventory,
      VLSFO: inventory.VLSFO - selectedNomination.quantity,
    }
    setInventory(newInventory)

    // Send notification
    addNotification({
      id: `NOTIF-SUPPLIER-${Date.now()}`,
      type: "INFO",
      title: "Nomination Confirmed",
      message: `Nomination for ${selectedNomination.cargoName} has been confirmed`,
      user: "OPERATOR",
      read: false,
      createdAt: new Date().toISOString(),
      actionRequired: false,
      actionUrl: `/operator/bunker-plans/${selectedNomination.id}`,
    })

    setIsConfirmDialogOpen(false)
    setQuotedPrice("")
    setSelectedBarge("")
    setDeliveryTime("")
    setDeliveryNotes("")
    setSelectedNomination(null)
    toast.success("Nomination confirmed", {
      description: "Notification sent to operator",
    })
  }

  const handleDeclineNomination = () => {
    if (!selectedNomination || !declineReason.trim()) {
      toast.error("Please provide a decline reason")
      return
    }

    updateBunkerPlanStatus(
      selectedNomination.id,
      "REJECTED",
      null,
      declineReason
    )

    addNotification({
      id: `NOTIF-SUPPLIER-DECLINE-${Date.now()}`,
      type: "WARNING",
      title: "Nomination Declined",
      message: `Supplier declined nomination: ${declineReason}`,
      user: "OPERATOR",
      read: false,
      createdAt: new Date().toISOString(),
      actionRequired: true,
      actionUrl: `/operator/bunker-plans/${selectedNomination.id}`,
    })

    setIsDeclineDialogOpen(false)
    setDeclineReason("")
    setSelectedNomination(null)
    toast.success("Nomination declined", {
      description: "Operator has been notified",
    })
  }

  const handleRequestChanges = () => {
    if (!selectedNomination || !changeRequest.trim()) {
      toast.error("Please describe requested changes")
      return
    }

    addNotification({
      id: `NOTIF-SUPPLIER-CHANGE-${Date.now()}`,
      type: "INFO",
      title: "Change Request",
      message: `Supplier requested changes: ${changeRequest}`,
      user: "OPERATOR",
      read: false,
      createdAt: new Date().toISOString(),
      actionRequired: true,
      actionUrl: `/operator/bunker-plans/${selectedNomination.id}`,
    })

    setIsRequestChangesDialogOpen(false)
    setChangeRequest("")
    setSelectedNomination(null)
    toast.success("Change request sent", {
      description: "Operator will review your request",
    })
  }

  const checkInventoryStatus = (quantity) => {
    const afterDelivery = inventory.VLSFO - quantity
    if (afterDelivery >= 500) {
      return { status: "sufficient", message: "Sufficient stock", color: "text-success" }
    } else if (afterDelivery >= 0) {
      return {
        status: "low",
        message: "Check availability",
        color: "text-warning",
      }
    } else {
      return {
        status: "insufficient",
        message: "Insufficient stock",
        color: "text-danger",
      }
    }
  }

  const calculateTotalValue = (quantity, price) => {
    if (!price) return 0
    return (parseFloat(price) * quantity).toFixed(2)
  }

  const getDeliveryStatus = (plan) => {
    const now = new Date()
    const deliveryStart = new Date(plan.deliveryWindow?.start || 0)
    const deliveryEnd = new Date(plan.deliveryWindow?.end || 0)

    if (isAfter(now, deliveryEnd)) return "completed"
    if (isAfter(now, deliveryStart)) return "delivering"
    if (isAfter(now, new Date(deliveryStart.getTime() - 24 * 60 * 60 * 1000)))
      return "en_route"
    return "scheduled"
  }

  const barges = [
    "Barge-001 (Capacity: 2000 MT)",
    "Barge-002 (Capacity: 1500 MT)",
    "Barge-003 (Capacity: 3000 MT)",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">⚓</span>
              <span className="text-xl font-bold text-gray-900">Fuel Sense</span>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-lg font-semibold text-gray-900">
              Supplier Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Notifications />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md">
              <Fuel className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {currentUser.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="nominations">
              Nominations
              {pendingNominations.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingNominations.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Nominations Tab */}
          <TabsContent value="nominations" className="space-y-6">
            {/* Pending Nominations */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Pending Nominations
                </h2>
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  {pendingNominations.length} New
                </Badge>
              </div>

              <div className="space-y-4">
                {pendingNominations.map((plan) => {
                  const cargo = getCargoById(plan.cargoId)
                  const vessel = vessels.find((v) => v.cargoId === plan.cargoId)
                  const inventoryStatus = checkInventoryStatus(plan.quantity)
                  const totalValue = calculateTotalValue(
                    plan.quantity,
                    quotedPrice || plan.pricePerMT
                  )

                  return (
                    <Card key={plan.id} className="border-2">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-primary-600 text-white">
                                NEW NOMINATION
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {formatDistanceToNow(new Date(plan.createdAt), {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                            <CardTitle className="text-lg">
                              {plan.cargoName}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Nomination Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm text-gray-900">
                              Nomination Details
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-gray-600">Vessel:</span>
                                <div className="font-medium">
                                  {vessel?.name || cargo?.vessel || "N/A"} (
                                  {vessel?.imo || "N/A"})
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-600 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  Port:
                                </span>
                                <div className="font-medium">{plan.port}</div>
                              </div>
                              <div>
                                <span className="text-gray-600 flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  ETA:
                                </span>
                                <div className="font-medium">
                                  {format(
                                    new Date(plan.deliveryWindow.start),
                                    "MMM d, yyyy HH:mm"
                                  )}{" "}
                                  UTC
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-600">Fuel Required:</span>
                                <div className="font-medium">
                                  {plan.fuelType} (0.5% S)
                                </div>
                                <div className="text-sm text-gray-500">
                                  Quantity: {plan.quantity} MT
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-600">Delivery Window:</span>
                                <div className="font-medium">
                                  {format(
                                    new Date(plan.deliveryWindow.start),
                                    "MMM d, HH:mm"
                                  )}{" "}
                                  -{" "}
                                  {format(
                                    new Date(plan.deliveryWindow.end),
                                    "HH:mm"
                                  )}{" "}
                                  UTC
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-600">
                                  Specifications:
                                </span>
                                <div className="text-sm text-gray-700">
                                  ISO 8217:2017 compliant, Flash point ≥ 60°C
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-600">Terms:</span>
                                <div className="text-sm text-gray-700">
                                  Ex-wharf, Net 30 days
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-600">Contact:</span>
                                <div className="text-sm text-gray-700">
                                  Operator: {plan.supplierContact}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {/* Inventory Check */}
                            <div className="p-3 bg-gray-50 rounded-md border">
                              <h4 className="font-semibold text-sm text-gray-900 mb-2">
                                Inventory Check
                              </h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Current inventory:
                                  </span>
                                  <span className="font-medium">
                                    {inventory.VLSFO.toLocaleString()} MT
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    After this delivery:
                                  </span>
                                  <span className="font-medium">
                                    {(
                                      inventory.VLSFO - plan.quantity
                                    ).toLocaleString()}{" "}
                                    MT
                                  </span>
                                </div>
                                <div className="mt-2">
                                  <Badge
                                    className={cn(
                                      inventoryStatus.status === "sufficient" &&
                                        "bg-success",
                                      inventoryStatus.status === "low" &&
                                        "bg-warning",
                                      inventoryStatus.status === "insufficient" &&
                                        "bg-danger",
                                      "text-white"
                                    )}
                                  >
                                    {inventoryStatus.message}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* Price Confirmation */}
                            <div className="p-3 bg-gray-50 rounded-md border">
                              <h4 className="font-semibold text-sm text-gray-900 mb-2">
                                Price Confirmation
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="text-gray-600">
                                    Market price:
                                  </span>
                                  <div className="font-medium">
                                    ${plan.pricePerMT}/MT (reference)
                                  </div>
                                </div>
                                <div>
                                  <label className="text-gray-600 mb-1 block">
                                    Your quoted price:
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-500">$</span>
                                    <Input
                                      type="number"
                                      placeholder="Enter price"
                                      value={quotedPrice}
                                      onChange={(e) =>
                                        setQuotedPrice(e.target.value)
                                      }
                                      className="flex-1"
                                    />
                                    <span className="text-gray-500">/MT</span>
                                  </div>
                                </div>
                                {quotedPrice && (
                                  <div>
                                    <span className="text-gray-600">
                                      Total value:
                                    </span>
                                    <div className="font-semibold text-lg text-success">
                                      ${totalValue}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Delivery Details */}
                            <div className="p-3 bg-gray-50 rounded-md border">
                              <h4 className="font-semibold text-sm text-gray-900 mb-2">
                                Delivery Details
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <label className="text-gray-600 mb-1 block">
                                    Barge:
                                  </label>
                                  <Select
                                    value={selectedBarge}
                                    onValueChange={setSelectedBarge}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select barge" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {barges.map((barge) => (
                                        <SelectItem key={barge} value={barge}>
                                          {barge}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-gray-600 mb-1 block">
                                    Estimated delivery time:
                                  </label>
                                  <Input
                                    type="number"
                                    placeholder="Hours"
                                    value={deliveryTime}
                                    onChange={(e) =>
                                      setDeliveryTime(e.target.value)
                                    }
                                  />
                                </div>
                                <div>
                                  <label className="text-gray-600 mb-1 block">
                                    Additional notes:
                                  </label>
                                  <Textarea
                                    placeholder="Any special requirements..."
                                    value={deliveryNotes}
                                    onChange={(e) =>
                                      setDeliveryNotes(e.target.value)
                                    }
                                    className="min-h-[60px]"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t">
                          <Button
                            className="flex-1 bg-success hover:bg-green-600"
                            onClick={() => {
                              setSelectedNomination(plan)
                              setIsConfirmDialogOpen(true)
                            }}
                            disabled={!quotedPrice || !selectedBarge}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Confirm Nomination
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedNomination(plan)
                              setIsRequestChangesDialogOpen(true)
                            }}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Request Changes
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              setSelectedNomination(plan)
                              setIsDeclineDialogOpen(true)
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {pendingNominations.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-success" />
                      <p className="text-gray-500">No pending nominations</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Confirmed Nominations */}
            {confirmedNominations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Confirmed Nominations
                </h3>
                <div className="space-y-3">
                  {confirmedNominations.map((plan) => {
                    const status = getDeliveryStatus(plan)
                    const statusLabels = {
                      scheduled: "Scheduled",
                      en_route: "En Route",
                      delivering: "Delivering",
                      completed: "Completed",
                    }

                    return (
                      <Card key={plan.id} className="bg-green-50/50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium mb-1">
                                {plan.cargoName}
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div>
                                  {plan.port} • {plan.quantity} MT {plan.fuelType}
                                </div>
                                <div>
                                  Delivery:{" "}
                                  {format(
                                    new Date(plan.deliveryWindow.start),
                                    "MMM d, HH:mm"
                                  )}
                                </div>
                                {status !== "completed" && (
                                  <div className="text-xs text-gray-500">
                                    {formatDistanceToNow(
                                      new Date(plan.deliveryWindow.start),
                                      { addSuffix: true }
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge
                                className={cn(
                                  status === "completed" && "bg-success",
                                  status === "delivering" && "bg-primary-600",
                                  status === "en_route" && "bg-warning",
                                  status === "scheduled" && "bg-gray-500",
                                  "text-white"
                                )}
                              >
                                {statusLabels[status]}
                              </Badge>
                              <Button variant="outline" size="sm">
                                Update Status
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Completed Nominations */}
            {completedNominations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Completed Deliveries
                </h3>
                <div className="space-y-3">
                  {completedNominations.map((plan) => (
                    <Card key={plan.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{plan.cargoName}</div>
                            <div className="text-sm text-gray-600">
                              {plan.port} • {plan.quantity} MT •{" "}
                              {format(
                                new Date(plan.approvedAt || plan.createdAt),
                                "MMM d, yyyy"
                              )}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedNomination(plan)
                              setIsBDNUploadOpen(true)
                            }}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload BDN
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Inventory</h2>
              <p className="text-gray-600 mt-1">
                Manage fuel stock levels
              </p>
            </div>

            {/* Current Stock */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Current Stock</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsInventoryUpdateOpen(true)}
                  >
                    Update Inventory
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">VLSFO</div>
                    <div className="text-3xl font-bold text-gray-900">
                      {inventory.VLSFO.toLocaleString()} MT
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">LSMGO</div>
                    <div className="text-3xl font-bold text-gray-900">
                      {inventory.LSMGO.toLocaleString()} MT
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Last updated: {format(new Date(), "PPp")}
                </div>
              </CardContent>
            </Card>

            {/* Committed vs Available */}
            <Card>
              <CardHeader>
                <CardTitle>Committed vs Available</CardTitle>
                <CardDescription>
                  Allocated quantities for pending deliveries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vessel</TableHead>
                      <TableHead>Port</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {confirmedNominations.map((plan) => {
                      const vessel = vessels.find(
                        (v) => v.cargoId === plan.cargoId
                      )
                      return (
                        <TableRow key={plan.id}>
                          <TableCell className="font-medium">
                            {vessel?.name || "N/A"}
                          </TableCell>
                          <TableCell>{plan.port}</TableCell>
                          <TableCell>{plan.quantity} MT</TableCell>
                          <TableCell>
                            {format(
                              new Date(plan.deliveryWindow.start),
                              "MMM d, yyyy"
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">Committed</Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <div className="text-sm">
                    <span className="font-medium">Available for new nominations:</span>{" "}
                    {(
                      inventory.VLSFO -
                      confirmedNominations.reduce(
                        (sum, plan) => sum + plan.quantity,
                        0
                      )
                    ).toLocaleString()}{" "}
                    MT VLSFO
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Replenishment Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Replenishment Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="p-3 border rounded-md">
                    <div className="font-medium">Incoming Supply</div>
                    <div className="text-gray-600">
                      2,000 MT VLSFO • Expected: Dec 10, 2024
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Performance</h2>
              <p className="text-gray-600 mt-1">
                Key metrics and delivery history
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-600">
                    Deliveries This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">23</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-600">
                    On-Time Delivery Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success">98%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-600">
                    Average Delivery Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary-600">
                    3.8 hours
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-600">
                    Customer Satisfaction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-warning">4.8/5</div>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i <= 4.8 ? "fill-warning text-warning" : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Feedback */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">MV Atlantic Star</div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-3 w-3",
                              i <= 5
                                ? "fill-warning text-warning"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      &quot;Excellent service, on-time delivery, quality fuel. Highly
                      recommended.&quot;
                    </p>
                    <div className="text-xs text-gray-500 mt-1">
                      Dec 1, 2024
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery History */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Delivery History</CardTitle>
                    <CardDescription>
                      Past deliveries and performance
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Vessel</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedNominations.slice(0, 10).map((plan) => {
                        const vessel = vessels.find(
                          (v) => v.cargoId === plan.cargoId
                        )
  return (
                          <TableRow key={plan.id}>
                            <TableCell>
                              {format(
                                new Date(plan.approvedAt || plan.createdAt),
                                "MMM d, yyyy"
                              )}
                            </TableCell>
                            <TableCell className="font-medium">
                              {vessel?.name || "N/A"}
                            </TableCell>
                            <TableCell>{plan.quantity} MT</TableCell>
                            <TableCell>
                              <Badge className="bg-success text-white">
                                Completed
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "h-3 w-3",
                                      i <= 4
                                        ? "fill-warning text-warning"
                                        : "text-gray-300"
                                    )}
                                  />
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Confirm Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Nomination</DialogTitle>
            <DialogDescription>
              Review and confirm this nomination
            </DialogDescription>
          </DialogHeader>
          {selectedNomination && (
            <div className="space-y-4 py-4">
              <div className="text-sm space-y-2">
                <div>
                  <span className="font-medium">Vessel:</span>{" "}
                  {selectedNomination.cargoName}
                </div>
                <div>
                  <span className="font-medium">Port:</span>{" "}
                  {selectedNomination.port}
                </div>
                <div>
                  <span className="font-medium">Quantity:</span>{" "}
                  {selectedNomination.quantity} MT
                </div>
                <div>
                  <span className="font-medium">Quoted Price:</span> $
                  {quotedPrice}/MT
                </div>
                <div>
                  <span className="font-medium">Total Value:</span> $
                  {totalValue}
                </div>
                <div>
                  <span className="font-medium">Barge:</span> {selectedBarge}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmNomination} className="bg-success hover:bg-green-600">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decline Dialog */}
      <Dialog open={isDeclineDialogOpen} onOpenChange={setIsDeclineDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Nomination</DialogTitle>
            <DialogDescription>
              Please provide a reason for declining this nomination
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter decline reason..."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeclineDialogOpen(false)
                setDeclineReason("")
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeclineNomination}
              disabled={!declineReason.trim()}
              variant="destructive"
            >
              Decline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Changes Dialog */}
      <Dialog
        open={isRequestChangesDialogOpen}
        onOpenChange={setIsRequestChangesDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Changes</DialogTitle>
            <DialogDescription>
              Describe the changes you would like to request
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Describe requested changes..."
              value={changeRequest}
              onChange={(e) => setChangeRequest(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRequestChangesDialogOpen(false)
                setChangeRequest("")
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleRequestChanges} disabled={!changeRequest.trim()}>
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inventory Update Dialog */}
      <Dialog
        open={isInventoryUpdateOpen}
        onOpenChange={setIsInventoryUpdateOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Inventory</DialogTitle>
            <DialogDescription>
              Update current fuel stock levels
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Fuel Type
              </label>
              <Select defaultValue="VLSFO">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VLSFO">VLSFO</SelectItem>
                  <SelectItem value="LSMGO">LSMGO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Current Quantity (MT)
              </label>
              <Input type="number" placeholder="Enter quantity" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Reason for Update
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="replenishment">Replenishment</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                  <SelectItem value="correction">Correction</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Notes</label>
              <Textarea placeholder="Additional notes..." />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsInventoryUpdateOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => {
              setIsInventoryUpdateOpen(false)
              toast.success("Inventory updated")
            }}>
              Submit Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* BDN Upload Dialog */}
      <Dialog open={isBDNUploadOpen} onOpenChange={setIsBDNUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload BDN</DialogTitle>
            <DialogDescription>
              Submit bunker delivery note for invoicing
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                BDN Number
              </label>
              <Input
                placeholder="Enter BDN number"
                value={bdnData.bdnNumber}
                onChange={(e) =>
                  setBdnData({ ...bdnData, bdnNumber: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Actual Quantity Delivered (MT)
              </label>
              <Input
                type="number"
                placeholder="Enter quantity"
                value={bdnData.quantityDelivered}
                onChange={(e) =>
                  setBdnData({ ...bdnData, quantityDelivered: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Delivery Start Time
                </label>
                <Input
                  type="datetime-local"
                  value={bdnData.startTime}
                  onChange={(e) =>
                    setBdnData({ ...bdnData, startTime: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Delivery End Time
                </label>
                <Input
                  type="datetime-local"
                  value={bdnData.endTime}
                  onChange={(e) =>
                    setBdnData({ ...bdnData, endTime: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload BDN PDF
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBDNUploadOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsBDNUploadOpen(false)
                toast.success("BDN submitted for invoice")
              }}
            >
              Submit for Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

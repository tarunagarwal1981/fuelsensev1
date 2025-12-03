"use client"

import { useStore } from "./store"
import { toast } from "sonner"

/**
 * Simulate AI analysis for a set of cargo IDs.
 * - Marks agents as RUNNING
 * - After 2–3 seconds marks them COMPLETED
 * - Updates confidence and rankings
 * - Emits notifications on completion
 *
 * @param {string[]} cargoIds
 */
export function simulateAIAnalysis(cargoIds = []) {
  if (!cargoIds.length) return

  const state = useStore.getState()
  const timestamp = Date.now()

  // Create RUNNING agent entries
  const newAgents = cargoIds.map((cargoId, idx) => {
    const cargo = state.cargoes.find((c) => c.id === cargoId)
    const agentName =
      cargo?.risk === "HIGH" ? "Risk Assessor" : "Cost Optimizer"

    return {
      id: `AI-SIM-${timestamp}-${idx}`,
      agentName,
      cargoId,
      status: "RUNNING",
      confidence: 0,
      executionTime: 0,
      startedAt: new Date().toISOString(),
      completedAt: null,
      output: null,
      dataQuality: {
        sources: [],
        overallQuality: 0,
      },
    }
  })

  useStore.setState((prev) => ({
    agentStatuses: [...newAgents, ...(prev.agentStatuses || [])],
  }))

  // Complete after 2–3 seconds
  const delay = 2000 + Math.random() * 1000
  setTimeout(() => {
    const endState = useStore.getState()
    const updatedAgents = (endState.agentStatuses || []).map((agent) => {
      const isSimulated = newAgents.some((a) => a.id === agent.id)
      if (!isSimulated) return agent

      const cargo = endState.cargoes.find((c) => c.id === agent.cargoId)
      const baseConfidence = cargo?.confidence ?? 85

      return {
        ...agent,
        status: "COMPLETED",
        confidence: cargo?.viable ? baseConfidence : 0,
        executionTime: Math.floor(1000 + Math.random() * 1500),
        completedAt: new Date().toISOString(),
        output: {
          recommendedPlan: cargo?.bunkerPorts?.[0]?.name || "N/A",
          keyFindings: cargo?.aiReasoning || ["Analysis completed"],
        },
        dataQuality: {
          sources: [
            {
              name: "Simulated Bunker Price Feed",
              freshness: "5 min",
              quality: 95,
            },
          ],
          overallQuality: 95,
        },
      }
    })

    useStore.setState({ agentStatuses: updatedAgents })

    // Create a notification for the charterer
    const analyzedCount = cargoIds.length
    const addNotification = useStore.getState().addNotification
    addNotification({
      id: `NOTIF-AI-SIM-${Date.now()}`,
      type: "INFO",
      title: "AI analysis completed",
      message: `${analyzedCount} cargo(es) analyzed. Recommendations are ready for review.`,
      user: "CHARTERER",
      read: false,
      createdAt: new Date().toISOString(),
      actionRequired: true,
      actionUrl: "/charterer",
    })

    toast.success("AI analysis complete", {
      description: `${analyzedCount} cargoes analyzed`,
    })
  }, delay)
}

/**
 * One-tick simulation of voyage progress.
 * Intended to be called on an interval (e.g. every 30s).
 * - Updates vessel positions (simple random walk)
 * - Decrements ROB based on daily consumption
 * - Updates ETA (simple adjustment)
 * - Low ROB alerts are handled by updateVesselROB in the store
 */
export function simulateVoyageProgress() {
  const { vessels, updateVesselROB } = useStore.getState()

  vessels.forEach((vessel) => {
    // 30s step as fraction of a day
    const step = 30 / (24 * 60 * 60)
    const vlsfoUse = (vessel.estimatedConsumption?.VLSFO || 0) * step
    const lsmgoUse = (vessel.estimatedConsumption?.LSMGO || 0) * step

    const newVlsfo = Math.max(0, vessel.currentROB.VLSFO - vlsfoUse)
    const newLsmgo = Math.max(0, vessel.currentROB.LSMGO - lsmgoUse)

    updateVesselROB(vessel.imo, {
      VLSFO: newVlsfo,
      LSMGO: newLsmgo,
    })

    // Very simple ETA adjustment: if speed > 0, reduce ETA slightly
    if (vessel.speed && vessel.ETA) {
      const eta = new Date(vessel.ETA)
      eta.setMinutes(eta.getMinutes() - 1)
      useStore.setState((prev) => ({
        vessels: prev.vessels.map((v) =>
          v.imo === vessel.imo ? { ...v, ETA: eta.toISOString() } : v
        ),
      }))
    }
  })
}

/**
 * One-tick simulation of market changes.
 * - Randomly adjusts bunker prices ±2%
 * - Creates price alert notification if change > 1.5%
 */
export function simulateMarketChanges() {
  const { bunkerPlans, addNotification } = useStore.getState()

  const updatedPlans = bunkerPlans.map((plan) => {
    const factor = 1 + (Math.random() * 0.04 - 0.02) // ±2%
    const oldPrice = plan.pricePerMT
    const newPrice = Math.round(oldPrice * factor)
    const delta = (newPrice - oldPrice) / oldPrice

    if (Math.abs(delta) > 0.015) {
      const direction = delta > 0 ? "increased" : "decreased"
      addNotification({
        id: `NOTIF-PRICE-${plan.id}-${Date.now()}`,
        type: "WARNING",
        title: "Price change alert",
        message: `Prices at ${plan.port} ${direction} by ${(delta * 100).toFixed(
          1
        )}% (now $${newPrice}/MT).`,
        user: "OPERATOR",
        read: false,
        createdAt: new Date().toISOString(),
        actionRequired: false,
        actionUrl: "/operator",
      })
    }

    return {
      ...plan,
      pricePerMT: newPrice,
    }
  })

  useStore.setState({ bunkerPlans: updatedPlans })
}

/**
 * One-tick simulation of time-based events.
 * - Reminders (e.g. bunker operation in 2 hours)
 * - Status updates (e.g. vessel arrived at bunker port)
 * - Approval reminders (e.g. pending > 6 hours)
 */
export function simulateTimeBasedEvents() {
  const { vessels, bunkerPlans, addNotification } = useStore.getState()
  const now = new Date()

  // Reminder for upcoming bunker operations within 2h
  bunkerPlans.forEach((plan) => {
    if (!plan.deliveryWindow?.start) return
    const start = new Date(plan.deliveryWindow.start)
    const diffHours = (start.getTime() - now.getTime()) / (1000 * 60 * 60)
    if (diffHours > 0 && diffHours < 2) {
      addNotification({
        id: `NOTIF-REM-BUNKER-${plan.id}-${Date.now()}`,
        type: "INFO",
        title: "Bunker operation reminder",
        message: `Bunker operation at ${plan.port} starts in ${diffHours.toFixed(
          1
        )} hours.`,
        user: "OPERATOR",
        read: false,
        createdAt: new Date().toISOString(),
        actionRequired: false,
        actionUrl: "/operator",
      })
    }
  })

  // Vessel arrival status updates (simple ETA < 0 check)
  vessels.forEach((vessel) => {
    if (!vessel.ETA) return
    const eta = new Date(vessel.ETA)
    if (now > eta) {
      addNotification({
        id: `NOTIF-ARR-${vessel.imo}-${Date.now()}`,
        type: "INFO",
        title: "Vessel arrival",
        message: `${vessel.name} has arrived at ${vessel.nextPort}.`,
        user: "OPERATOR",
        read: false,
        createdAt: new Date().toISOString(),
        actionRequired: false,
        actionUrl: "/operator",
      })
    }
  })

  // Approval reminders for long-pending plans
  bunkerPlans.forEach((plan) => {
    if (plan.status !== "PENDING_APPROVAL") return
    const createdAt = new Date(plan.createdAt)
    const hoursPending =
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
    if (hoursPending > 6) {
      addNotification({
        id: `NOTIF-REM-APP-${plan.id}-${Date.now()}`,
        type: "WARNING",
        title: "Approval reminder",
        message: `Bunker plan ${plan.id} has been pending approval for more than 6 hours.`,
        user: "OPERATOR",
        read: false,
        createdAt: new Date().toISOString(),
        actionRequired: true,
        actionUrl: "/operator",
      })
    }
  })
}



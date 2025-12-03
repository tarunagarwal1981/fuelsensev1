import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  mockCargoes,
  mockBunkerPlans,
  mockVessels,
  mockNotifications,
  mockPendingTasks,
  mockAIAgentOutputs,
} from "./mock-data"

/**
 * @typedef {Object} User
 * @property {string} role - User role: 'CHARTERER' | 'OPERATOR' | 'VESSEL' | 'SUPPLIER'
 * @property {string} name - User's name
 * @property {string} email - User's email
 */

/**
 * @typedef {Object} Cargo
 * @property {string} id - Cargo ID
 * @property {string} status - Cargo status
 */

/**
 * @typedef {Object} BunkerPlan
 * @property {string} id - Bunker plan ID
 * @property {string} status - Plan status
 * @property {string|null} approvedBy - Who approved it
 * @property {string|null} rejectionReason - Reason for rejection
 */

/**
 * @typedef {Object} VesselROB
 * @property {number} VLSFO - VLSFO remaining on board (MT)
 * @property {number} LSMGO - LSMGO remaining on board (MT)
 */

/**
 * @typedef {Object} Notification
 * @property {string} id - Notification ID
 * @property {boolean} read - Whether notification is read
 */

/**
 * @typedef {Object} AIAgentStatus
 * @property {string} id - Agent execution ID
 * @property {string} cargoId - Associated cargo ID
 * @property {string} status - 'RUNNING' | 'COMPLETED' | 'FAILED'
 * @property {number} confidence - Confidence score (0-100)
 */

/**
 * Main Zustand store for the Fuel Sense application
 * Uses persist middleware to save state to localStorage
 */
export const useStore = create(
  persist(
    (set, get) => ({
      // ============================================
      // USER STATE
      // ============================================
      /**
       * Current logged-in user
       * @type {User|null}
       */
      currentUser: null,

      /**
       * Set the current user
       * @param {User} user - User object with role, name, and email
       */
      setCurrentUser: (user) => {
        set({ currentUser: user })
        // Load user-specific data when user changes
        const { loadUserData } = get()
        loadUserData(user?.role)
      },

      // ============================================
      // CARGO STATE
      // ============================================
      /**
       * Array of all cargoes
       * @type {Array<Cargo>}
       */
      cargoes: mockCargoes,

      /**
       * Currently selected/viewing cargo ID
       * @type {string|null}
       */
      selectedCargo: null,

      /**
       * Set the selected cargo
       * @param {string|null} cargoId - Cargo ID to select
       */
      setSelectedCargo: (cargoId) => {
        set({ selectedCargo: cargoId })
      },

      /**
       * Update cargo status
       * @param {string} cargoId - Cargo ID to update
       * @param {string} status - New status
       */
      updateCargoStatus: (cargoId, status) => {
        set((state) => ({
          cargoes: state.cargoes.map((cargo) =>
            cargo.id === cargoId
              ? { ...cargo, status, updatedAt: new Date().toISOString() }
              : cargo
          ),
        }))
      },

      /**
       * Fix a cargo (mark as FIXED and create notification)
       * @param {string} cargoId - Cargo ID to fix
       */
      fixCargo: (cargoId) => {
        const { updateCargoStatus, addNotification, currentUser } = get()
        const cargo = get().cargoes.find((c) => c.id === cargoId)

        if (cargo) {
          updateCargoStatus(cargoId, "FIXED")

          addNotification({
            id: `NOTIF-FIXED-${Date.now()}`,
            type: "INFO",
            title: "Cargo Fixed",
            message: `Cargo ${cargoId} (${cargo.loadPort} → ${cargo.dischargePort}) has been fixed.`,
            user: currentUser?.role || "CHARTERER",
            read: false,
            createdAt: new Date().toISOString(),
            actionRequired: false,
            actionUrl: `/charterer/cargoes/${cargoId}`,
          })
        }
      },

      // ============================================
      // BUNKER PLAN STATE
      // ============================================
      /**
       * Array of all bunker plans
       * @type {Array<BunkerPlan>}
       */
      bunkerPlans: mockBunkerPlans,

      /**
       * Update bunker plan status
       * @param {string} planId - Bunker plan ID
       * @param {string} status - New status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED'
       * @param {string|null} approvedBy - Who approved/rejected it
       * @param {string|null} reason - Rejection reason (if rejected)
       */
      updateBunkerPlanStatus: (planId, status, approvedBy = null, reason = null) => {
        set((state) => ({
          bunkerPlans: state.bunkerPlans.map((plan) =>
            plan.id === planId
              ? {
                  ...plan,
                  status,
                  approvedBy,
                  approvedAt: status === "APPROVED" ? new Date().toISOString() : plan.approvedAt,
                  rejectionReason: status === "REJECTED" ? reason : null,
                }
              : plan
          ),
        }))

        // Create notification for status change
        const plan = get().bunkerPlans.find((p) => p.id === planId)
        if (plan) {
          const { addNotification, currentUser } = get()
          addNotification({
            id: `NOTIF-BUNKER-${Date.now()}`,
            type: status === "APPROVED" ? "INFO" : status === "REJECTED" ? "WARNING" : "INFO",
            title: `Bunker Plan ${status}`,
            message: `Bunker plan ${planId} for ${plan.cargoName} has been ${status.toLowerCase()}.`,
            user: currentUser?.role || "OPERATOR",
            read: false,
            createdAt: new Date().toISOString(),
            actionRequired: status === "PENDING_APPROVAL",
            actionUrl: `/operator/bunker-plans/${planId}`,
          })
        }
      },

      /**
       * Request alternative bunker plan for a cargo
       * @param {string} cargoId - Cargo ID
       */
      requestAlternative: (cargoId) => {
        const cargo = get().cargoes.find((c) => c.id === cargoId)
        if (cargo && cargo.bunkerPorts.length > 0) {
          // Simulate creating alternative plan
          const alternative = cargo.bunkerPorts[1] || cargo.bunkerPorts[0]

          const newPlan = {
            id: `BUNKER-ALT-${Date.now()}`,
            cargoId: cargoId,
            cargoName: `${cargo.loadPort} → ${cargo.dischargePort}`,
            port: alternative.name,
            country: alternative.country,
            quantity: alternative.quantity,
            fuelType: alternative.fuelType,
            pricePerMT: alternative.price,
            supplier: alternative.supplier,
            supplierContact: "+1 234 567 8900",
            reliability: alternative.reliability,
            deliveryWindow: {
              start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
              end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            },
            portFees: alternative.portFees,
            deviationCost: alternative.deviationCost,
            totalCost: alternative.totalCost,
            alternatives: [],
            status: "PENDING_APPROVAL",
            approvedBy: null,
            approvedAt: null,
            rejectionReason: null,
            createdAt: new Date().toISOString(),
            submittedBy: "AI Agent - Alternative Generator",
          }

          set((state) => ({
            bunkerPlans: [...state.bunkerPlans, newPlan],
          }))

          const { addNotification, currentUser } = get()
          addNotification({
            id: `NOTIF-ALT-${Date.now()}`,
            type: "INFO",
            title: "Alternative Bunker Plan Created",
            message: `Alternative bunker plan created for cargo ${cargoId} at ${alternative.name}.`,
            user: currentUser?.role || "CHARTERER",
            read: false,
            createdAt: new Date().toISOString(),
            actionRequired: true,
            actionUrl: `/charterer/bunker-plans/${newPlan.id}`,
          })
        }
      },

      // ============================================
      // VESSEL STATE
      // ============================================
      /**
       * Array of all vessels
       * @type {Array}
       */
      vessels: mockVessels,

      /**
       * Update vessel ROB (Remaining On Board)
       * @param {string} vesselId - Vessel IMO number
       * @param {VesselROB} robData - New ROB data
       */
      updateVesselROB: (vesselId, robData) => {
        set((state) => ({
          vessels: state.vessels.map((vessel) =>
            vessel.imo === vesselId
              ? {
                  ...vessel,
                  currentROB: {
                    ...vessel.currentROB,
                    ...robData,
                  },
                  lastReportTime: new Date().toISOString(),
                }
              : vessel
          ),
        }))

        // Check for low ROB and create alert if needed
        const vessel = get().vessels.find((v) => v.imo === vesselId)
        if (vessel && robData.VLSFO < 200) {
          const { addNotification } = get()
          addNotification({
            id: `NOTIF-LOWROB-${Date.now()}`,
            type: "URGENT",
            title: "Low ROB Alert",
            message: `Vessel ${vessel.name} has low remaining fuel (${robData.VLSFO} MT VLSFO).`,
            user: "OPERATOR",
            read: false,
            createdAt: new Date().toISOString(),
            actionRequired: true,
            actionUrl: `/operator/vessels/${vesselId}`,
          })
        }
      },

      /**
       * Flag a vessel issue
       * @param {string} vesselId - Vessel IMO number
       * @param {string} issue - Issue description
       */
      flagVesselIssue: (vesselId, issue) => {
        const vessel = get().vessels.find((v) => v.imo === vesselId)
        if (vessel) {
          const { addNotification } = get()
          addNotification({
            id: `NOTIF-ISSUE-${Date.now()}`,
            type: "WARNING",
            title: "Vessel Issue Flagged",
            message: `Issue flagged for ${vessel.name}: ${issue}`,
            user: "OPERATOR",
            read: false,
            createdAt: new Date().toISOString(),
            actionRequired: true,
            actionUrl: `/operator/vessels/${vesselId}`,
          })
        }
      },

      // ============================================
      // NOTIFICATION STATE
      // ============================================
      /**
       * Array of all notifications
       * @type {Array<Notification>}
       */
      notifications: mockNotifications,

      /**
       * Notification preferences (in-app, sound)
       */
      notificationPreferences: {
        inApp: true,
        sound: true,
      },

      /**
       * Notification preferences (in-app, sound)
       */
      notificationPreferences: {
        inApp: true,
        sound: true,
      },

      /**
       * Get unread notification count
       * @returns {number}
       */
      get unreadCount() {
        return get().notifications.filter((n) => !n.read).length
      },

      /**
       * Add a new notification
       * @param {Notification} notification - Notification object
       */
      addNotification: (notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
        }))
      },

      /**
       * Update notification preferences
       * @param {{ inApp?: boolean; sound?: boolean }} prefs
       */
      setNotificationPreferences: (prefs) => {
        set((state) => ({
          notificationPreferences: {
            ...state.notificationPreferences,
            ...prefs,
          },
        }))
      },

      /**
       * Update notification preferences
       * @param {{ inApp?: boolean; sound?: boolean }} prefs
       */
      setNotificationPreferences: (prefs) => {
        set((state) => ({
          notificationPreferences: {
            ...state.notificationPreferences,
            ...prefs,
          },
        }))
      },

      /**
       * Mark notification as read
       * @param {string} notificationId - Notification ID
       */
      markAsRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        }))
      },

      /**
       * Clear all notifications
       */
      clearAll: () => {
        set({ notifications: [] })
      },

      // ============================================
      // PENDING TASKS STATE
      // ============================================
      /**
       * Pending tasks organized by user role
       * @type {Object}
       */
      pendingTasks: mockPendingTasks,

      /**
       * Complete a pending task
       * @param {string} taskId - Task ID to complete
       */
      completePendingTask: (taskId) => {
        const { currentUser } = get()
        if (!currentUser) return

        set((state) => {
          const role = currentUser.role
          const tasks = state.pendingTasks[role] || []

          return {
            pendingTasks: {
              ...state.pendingTasks,
              [role]: tasks.filter((task) => task.id !== taskId),
            },
          }
        })
      },

      // ============================================
      // AI AGENTS STATE
      // ============================================
      /**
       * AI agent execution statuses
       * @type {Array<AIAgentStatus>}
       */
      agentStatuses: mockAIAgentOutputs,

      /**
       * Trigger AI analysis for cargoes
       * @param {Array<string>} cargoIds - Array of cargo IDs to analyze
       */
      triggerAnalysis: (cargoIds) => {
        const newStatuses = cargoIds.map((cargoId) => {
          const cargo = get().cargoes.find((c) => c.id === cargoId)
          const agentName = cargo?.risk === "HIGH" ? "Risk Assessor" : "Cost Optimizer"

          return {
            id: `AI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

        set((state) => ({
          agentStatuses: [...newStatuses, ...state.agentStatuses],
        }))

        // Simulate completion after delay
        setTimeout(() => {
          set((state) => ({
            agentStatuses: state.agentStatuses.map((status) => {
              if (newStatuses.some((ns) => ns.id === status.id)) {
                const cargo = get().cargoes.find((c) => c.id === status.cargoId)
                return {
                  ...status,
                  status: "COMPLETED",
                  confidence: cargo ? (cargo.viable ? cargo.confidence : 0) : 85,
                  executionTime: Math.floor(Math.random() * 2000) + 1000,
                  completedAt: new Date().toISOString(),
                  output: {
                    recommendedPlan: cargo?.bunkerPorts[0]?.name || "N/A",
                    keyFindings: cargo?.aiReasoning || ["Analysis completed"],
                  },
                  dataQuality: {
                    sources: [
                      {
                        name: "Bunker Price Database",
                        freshness: "2 hours",
                        quality: 95,
                      },
                    ],
                    overallQuality: 95,
                  },
                }
              }
              return status
            }),
          }))
        }, 2000)
      },

      // ============================================
      // HELPER FUNCTIONS
      // ============================================
      /**
       * Load user-specific data when user changes
       * @param {string} role - User role
       */
      loadUserData: (role) => {
        if (!role) return

        // Filter notifications by user role
        const userNotifications = mockNotifications.filter((n) => n.user === role)
        set({ notifications: userNotifications })
      },

      /**
       * Get cargo by ID
       * @param {string} cargoId - Cargo ID
       * @returns {Cargo|undefined}
       */
      getCargoById: (cargoId) => {
        return get().cargoes.find((c) => c.id === cargoId)
      },

      /**
       * Get bunker plans by cargo ID
       * @param {string} cargoId - Cargo ID
       * @returns {Array<BunkerPlan>}
       */
      getBunkerPlansByCargo: (cargoId) => {
        return get().bunkerPlans.filter((plan) => plan.cargoId === cargoId)
      },

      /**
       * Get vessel by IMO
       * @param {string} imo - Vessel IMO number
       * @returns {Object|undefined}
       */
      getVesselByIMO: (imo) => {
        return get().vessels.find((v) => v.imo === imo)
      },

      /**
       * Get notifications by user role
       * @param {string} role - User role
       * @returns {Array<Notification>}
       */
      getNotificationsByUser: (role) => {
        return get().notifications.filter((n) => n.user === role)
      },

      /**
       * Get pending tasks by user role
       * @param {string} role - User role
       * @returns {Array}
       */
      getPendingTasksByUser: (role) => {
        return get().pendingTasks[role] || []
      },

      /**
       * Get AI outputs by cargo ID
       * @param {string} cargoId - Cargo ID
       * @returns {Array<AIAgentStatus>}
       */
      getAIOutputsByCargo: (cargoId) => {
        return get().agentStatuses.filter((output) => output.cargoId === cargoId)
      },
    }),
    {
      name: "fuel-sense-storage", // localStorage key
      partialize: (state) => ({
        // Only persist certain parts of state
        currentUser: state.currentUser,
        selectedCargo: state.selectedCargo,
        notifications: state.notifications,
        // Don't persist cargoes, bunkerPlans, vessels as they come from mock data
      }),
    }
  )
)

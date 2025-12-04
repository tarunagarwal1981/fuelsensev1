import { addDays, addHours, subDays, subHours, subMinutes } from "date-fns"

// Helper to get dates relative to now
const now = new Date()
const twoDaysFromNow = addDays(now, 2)
const fiveDaysFromNow = addDays(now, 5)
const sevenDaysFromNow = addDays(now, 7)
const tenDaysFromNow = addDays(now, 10)
const twelveDaysFromNow = addDays(now, 12)
const fifteenDaysFromNow = addDays(now, 15)
const twentyDaysFromNow = addDays(now, 20)
const threeDaysAgo = subDays(now, 3)
const oneDayAgo = subDays(now, 1)

// CARGOES
export const mockCargoes = [
  {
    id: "CARGO-001",
    loadPort: "Singapore",
    dischargePort: "Rotterdam",
    laycanStart: twoDaysFromNow.toISOString(),
    laycanEnd: fiveDaysFromNow.toISOString(),
    freight: 2850000, // Revenue in USD
    bunkerCost: 1250000,
    portCosts: 45000,
    otherCosts: 32000,
    profit: 312000,
    distance: 8500, // nautical miles
    duration: 28, // days
    vessel: "MV Atlantic Star",
    bunkerPorts: [
      {
        name: "Port Klang",
        country: "Malaysia",
        price: 645, // USD per MT
        quantity: 850, // MT
        supplier: "Shell Marine",
        reliability: 98,
        deliveryHours: 4,
        fuelType: "VLSFO",
        portFees: 8000,
        deviationCost: 12500, // Total deviation cost
        deviationDistance: 145, // nm
        totalCost: 704500,
      },
      {
        name: "Fujairah",
        country: "UAE",
        price: 650,
        quantity: 850,
        supplier: "TotalEnergies",
        reliability: 95,
        deliveryHours: 6,
        fuelType: "VLSFO",
        portFees: 12000,
        deviationCost: 8500,
        deviationDistance: 95, // nm
        totalCost: 640200,
      },
      {
        name: "Colombo",
        country: "Sri Lanka",
        price: 655,
        quantity: 850,
        supplier: "Ceylon Petroleum",
        reliability: 92,
        deliveryHours: 8,
        fuelType: "VLSFO",
        portFees: 6500,
        deviationCost: 18750,
        deviationDistance: 220, // nm
        totalCost: 582000,
      },
      {
        name: "Singapore",
        country: "Singapore",
        price: 695,
        quantity: 850,
        supplier: "Singapore Marine Fuels",
        reliability: 97,
        deliveryHours: 4,
        fuelType: "VLSFO",
        portFees: 15000,
        deviationCost: 0, // On route
        deviationDistance: 0, // nm
        totalCost: 605750,
      },
    ],
    risk: "LOW",
    confidence: 95,
    aiReasoning: [
      "Optimal route with established bunker ports",
      "Strong supplier reliability scores (95%+)",
      "Minimal deviation from direct route",
      "Favorable fuel prices in region",
      "Good laycan window allows flexibility",
    ],
    viable: true,
    status: "READY_FOR_DECISION",
    createdAt: threeDaysAgo.toISOString(),
    updatedAt: oneDayAgo.toISOString(),
  },
  {
    id: "CARGO-002",
    loadPort: "Dubai",
    dischargePort: "London",
    laycanStart: sevenDaysFromNow.toISOString(),
    laycanEnd: tenDaysFromNow.toISOString(),
    freight: 2200000,
    bunkerCost: 980000,
    portCosts: 38000,
    otherCosts: 28000,
    profit: 245000,
    distance: 7200,
    duration: 24,
    vessel: "MV Pacific Voyager",
    bunkerPorts: [
      {
        name: "Fujairah",
        country: "UAE",
        price: 572,
        quantity: 1100,
        supplier: "Gulf Bunkering LLC",
        reliability: 95,
        deliveryHours: 6,
        fuelType: "VLSFO",
        portFees: 11000,
        deviationCost: 0,
        totalCost: 640200,
      },
      {
        name: "Gibraltar",
        country: "UK Territory",
        price: 595,
        quantity: 600,
        supplier: "Gibraltar Bunkering Services",
        reliability: 92,
        deliveryHours: 12,
        fuelType: "VLSFO",
        portFees: 8500,
        deviationCost: 8000,
        totalCost: 365500,
      },
    ],
    risk: "LOW",
    confidence: 89,
    aiReasoning: [
      "Well-established trade route",
      "Primary bunker port (Fujairah) on route",
      "Secondary option (Gibraltar) provides backup",
      "Moderate fuel price volatility expected",
      "Supplier reliability above 90%",
    ],
    viable: true,
    status: "READY_FOR_DECISION",
    createdAt: subDays(now, 2).toISOString(),
    updatedAt: subHours(now, 6).toISOString(),
  },
  {
    id: "CARGO-003",
    loadPort: "Tokyo",
    dischargePort: "Los Angeles",
    laycanStart: twelveDaysFromNow.toISOString(),
    laycanEnd: fifteenDaysFromNow.toISOString(),
    freight: 1950000,
    bunkerCost: 1100000,
    portCosts: 52000,
    otherCosts: 35000,
    profit: 198000,
    distance: 5400,
    duration: 18,
    vessel: "MV Ocean Express",
    bunkerPorts: [
      {
        name: "Singapore",
        country: "Singapore",
        price: 585,
        quantity: 900,
        supplier: "Singapore Marine Fuels",
        reliability: 97,
        deliveryHours: 8,
        fuelType: "VLSFO",
        portFees: 15000,
        deviationCost: 12000,
        totalCost: 541500,
      },
      {
        name: "Honolulu",
        country: "USA",
        price: 620,
        quantity: 500,
        supplier: "Pacific Bunkering Co",
        reliability: 88,
        deliveryHours: 10,
        fuelType: "VLSFO",
        portFees: 18000,
        deviationCost: 20000,
        totalCost: 328000,
      },
    ],
    risk: "MEDIUM",
    confidence: 82,
    aiReasoning: [
      "Longer Pacific crossing increases weather risk",
      "Honolulu bunker prices higher than average",
      "Limited bunker port options mid-Pacific",
      "Secondary supplier reliability below 90%",
      "Potential weather delays in North Pacific",
    ],
    viable: true,
    status: "PENDING_ANALYSIS",
    createdAt: subDays(now, 1).toISOString(),
    updatedAt: subHours(now, 3).toISOString(),
  },
  {
    id: "CARGO-004",
    loadPort: "Mumbai",
    dischargePort: "New York",
    laycanStart: fifteenDaysFromNow.toISOString(),
    laycanEnd: twentyDaysFromNow.toISOString(),
    freight: 1800000,
    bunkerCost: 1350000,
    portCosts: 48000,
    otherCosts: 32000,
    profit: -20000, // Negative - not viable
    distance: 9800,
    duration: 32,
    vessel: "MV Indian Ocean",
    bunkerPorts: [],
    risk: "HIGH",
    confidence: 0,
    aiReasoning: [
      "No suitable bunker ports along route",
      "Excessive bunker costs make cargo unprofitable",
      "Long distance requires multiple bunker stops",
      "Limited availability in required timeframe",
      "Port fees and deviation costs too high",
    ],
    viable: false,
    status: "REJECTED",
    createdAt: subDays(now, 4).toISOString(),
    updatedAt: subDays(now, 3).toISOString(),
  },
]

// BUNKER PLANS (linked to cargoes)
export const mockBunkerPlans = [
  {
    id: "BUNKER-001",
    cargoId: "CARGO-001",
    cargoName: "Singapore → Rotterdam",
    port: "Port Klang",
    country: "Malaysia",
    quantity: 1200, // MT
    fuelType: "VLSFO",
    pricePerMT: 580,
    supplier: "Bunker Marine Services",
    supplierContact: "+60 3 1234 5678",
    reliability: 98,
    deliveryWindow: {
      start: addHours(twoDaysFromNow, 12).toISOString(),
      end: addHours(twoDaysFromNow, 18).toISOString(),
    },
    portFees: 8500,
    deviationCost: 0,
    totalCost: 704500,
    alternatives: [
      {
        port: "Fujairah",
        pricePerMT: 575,
        quantity: 800,
        supplier: "Gulf Bunkering LLC",
        totalCost: 475000,
        reason: "Lower price but requires deviation",
      },
      {
        port: "Singapore",
        pricePerMT: 590,
        quantity: 1200,
        supplier: "Singapore Marine Fuels",
        totalCost: 720000,
        reason: "Higher price, no deviation needed",
      },
    ],
    status: "PENDING_APPROVAL",
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null,
    createdAt: oneDayAgo.toISOString(),
    submittedBy: "AI Agent - Cost Optimizer",
  },
  {
    id: "BUNKER-002",
    cargoId: "CARGO-001",
    cargoName: "Singapore → Rotterdam",
    port: "Fujairah",
    country: "UAE",
    quantity: 800,
    fuelType: "VLSFO",
    pricePerMT: 575,
    supplier: "Gulf Bunkering LLC",
    supplierContact: "+971 4 2345 6789",
    reliability: 95,
    deliveryWindow: {
      start: addHours(fiveDaysFromNow, 6).toISOString(),
      end: addHours(fiveDaysFromNow, 14).toISOString(),
    },
    portFees: 12000,
    deviationCost: 15000,
    totalCost: 475000,
    alternatives: [
      {
        port: "Port Klang",
        pricePerMT: 580,
        quantity: 1200,
        supplier: "Bunker Marine Services",
        totalCost: 704500,
        reason: "On-route but higher total cost",
      },
      {
        port: "Colombo",
        pricePerMT: 600,
        quantity: 1000,
        supplier: "Ceylon Bunkering",
        totalCost: 612000,
        reason: "Higher price, moderate deviation",
      },
    ],
    status: "APPROVED",
    approvedBy: "John Smith (Charterer)",
    approvedAt: subHours(now, 12).toISOString(),
    rejectionReason: null,
    createdAt: subDays(now, 2).toISOString(),
    submittedBy: "AI Agent - Cost Optimizer",
  },
  {
    id: "BUNKER-003",
    cargoId: "CARGO-002",
    cargoName: "Dubai → London",
    port: "Fujairah",
    country: "UAE",
    quantity: 1100,
    fuelType: "VLSFO",
    pricePerMT: 572,
    supplier: "Gulf Bunkering LLC",
    supplierContact: "+971 4 2345 6789",
    reliability: 95,
    deliveryWindow: {
      start: addHours(sevenDaysFromNow, 8).toISOString(),
      end: addHours(sevenDaysFromNow, 16).toISOString(),
    },
    portFees: 11000,
    deviationCost: 0,
    totalCost: 640200,
    alternatives: [
      {
        port: "Gibraltar",
        pricePerMT: 595,
        quantity: 600,
        supplier: "Gibraltar Bunkering Services",
        totalCost: 365500,
        reason: "Higher price per MT, lower quantity needed",
      },
      {
        port: "Port Said",
        pricePerMT: 590,
        quantity: 1000,
        supplier: "Mediterranean Fuels",
        totalCost: 601000,
        reason: "Slightly higher cost, good reliability",
      },
    ],
    status: "PENDING_APPROVAL",
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null,
    createdAt: subHours(now, 8).toISOString(),
    submittedBy: "AI Agent - Route Optimizer",
  },
  {
    id: "BUNKER-004",
    cargoId: "CARGO-003",
    cargoName: "Tokyo → Los Angeles",
    port: "Singapore",
    country: "Singapore",
    quantity: 900,
    fuelType: "VLSFO",
    pricePerMT: 585,
    supplier: "Singapore Marine Fuels",
    supplierContact: "+65 6123 4567",
    reliability: 97,
    deliveryWindow: {
      start: addHours(twelveDaysFromNow, 10).toISOString(),
      end: addHours(twelveDaysFromNow, 18).toISOString(),
    },
    portFees: 15000,
    deviationCost: 12000,
    totalCost: 541500,
    alternatives: [
      {
        port: "Honolulu",
        pricePerMT: 620,
        quantity: 500,
        supplier: "Pacific Bunkering Co",
        totalCost: 328000,
        reason: "Higher price, lower quantity, significant deviation",
      },
      {
        port: "Yokohama",
        pricePerMT: 600,
        quantity: 950,
        supplier: "Japan Marine Fuels",
        totalCost: 585000,
        reason: "Load port bunkering, higher cost",
      },
    ],
    status: "PENDING_APPROVAL",
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null,
    createdAt: subHours(now, 4).toISOString(),
    submittedBy: "AI Agent - Risk Assessor",
  },
]

// VESSELS (fleet)
export const mockVessels = [
  {
    name: "MV Atlantic Star",
    imo: "9876543",
    currentROB: {
      VLSFO: 450, // MT remaining on board
      LSMGO: 120,
    },
    currentPosition: {
      latitude: 1.2897,
      longitude: 103.8501,
      port: "Singapore",
      country: "Singapore",
    },
    nextPort: "Port Klang",
    ETA: addHours(twoDaysFromNow, 12).toISOString(),
    status: "ON_VOYAGE",
    estimatedConsumption: {
      VLSFO: 42, // MT per day
      LSMGO: 2.5,
    },
    lastReportTime: subHours(now, 2).toISOString(),
    speed: 14.5, // knots
    heading: 285, // degrees
    cargoId: "CARGO-001",
    bunkerPlanId: "BUNKER-001",
  },
  {
    name: "MV Pacific Voyager",
    imo: "9876544",
    currentROB: {
      VLSFO: 320,
      LSMGO: 95,
    },
    currentPosition: {
      latitude: 25.2048,
      longitude: 55.2708,
      port: "Dubai",
      country: "UAE",
    },
    nextPort: "Fujairah",
    ETA: addHours(sevenDaysFromNow, 8).toISOString(),
    status: "IN_PORT",
    estimatedConsumption: {
      VLSFO: 38,
      LSMGO: 2.2,
    },
    lastReportTime: subHours(now, 1).toISOString(),
    speed: 0,
    heading: null,
    cargoId: "CARGO-002",
    bunkerPlanId: "BUNKER-003",
  },
  {
    name: "MV Ocean Express",
    imo: "9876545",
    currentROB: {
      VLSFO: 280,
      LSMGO: 80,
    },
    currentPosition: {
      latitude: 35.6762,
      longitude: 139.6503,
      port: "Tokyo",
      country: "Japan",
    },
    nextPort: "Singapore",
    ETA: addHours(twelveDaysFromNow, 10).toISOString(),
    status: "BUNKERING",
    estimatedConsumption: {
      VLSFO: 45,
      LSMGO: 2.8,
    },
    lastReportTime: subHours(now, 30).toISOString(),
    speed: 0,
    heading: null,
    cargoId: "CARGO-003",
    bunkerPlanId: "BUNKER-004",
  },
  {
    name: "MV Indian Ocean",
    imo: "9876546",
    currentROB: {
      VLSFO: 420, // Adequate for bunkering soon
      LSMGO: 45,
    },
    currentPosition: {
      latitude: 19.0760,
      longitude: 72.8777,
      port: "Mumbai",
      country: "India",
    },
    nextPort: "Fujairah",
    ETA: addHours(now, 42).toISOString(), // 42 hours = within 48 hours
    status: "ON_VOYAGE",
    estimatedConsumption: {
      VLSFO: 40,
      LSMGO: 2.5,
    },
    actualConsumption: {
      VLSFO: 40, // On plan
    },
    lastReportTime: subMinutes(now, 30).toISOString(),
    speed: 13.8,
    heading: 180,
    cargoId: "CARGO-002",
    bunkerPlanId: "BUNKER-003", // Approved
  },
  {
    name: "MV Ocean Star",
    imo: "9876547",
    currentROB: {
      VLSFO: 145, // Critical - below safety margin
      LSMGO: 40,
    },
    currentPosition: {
      latitude: 3.0,
      longitude: 101.4,
      port: "Port Klang",
      country: "Malaysia",
    },
    nextPort: "Port Klang",
    ETA: addHours(now, 18).toISOString(), // 18 hours - matches ETA
    status: "ON_VOYAGE",
    estimatedConsumption: {
      VLSFO: 8,
      LSMGO: 0.5,
    },
    actualConsumption: {
      VLSFO: 8,
    },
    lastReportTime: subHours(now, 4).toISOString(),
    speed: 12.5,
    heading: 90,
    cargoId: "CARGO-001",
    bunkerPlanId: "BUNKER-001", // Pending approval
  },
  {
    name: "MV Pacific Voyager",
    imo: "9876548",
    currentROB: {
      VLSFO: 380,
      LSMGO: 100,
    },
    currentPosition: {
      latitude: 20.0,
      longitude: -160.0,
      port: "Mid-Pacific Ocean",
      country: "International Waters",
    },
    nextPort: "Los Angeles",
    ETA: addDays(now, 6).toISOString(),
    status: "ON_VOYAGE",
    estimatedConsumption: {
      VLSFO: 8.2, // Planned
      LSMGO: 0.5,
    },
    actualConsumption: {
      VLSFO: 9.2, // +12% over plan
    },
    lastReportTime: subHours(now, 2).toISOString(),
    speed: 14.2,
    heading: 45,
    cargoId: "CARGO-003",
    bunkerPlanId: "BUNKER-004",
  },
  {
    name: "MV Baltic",
    imo: "9876549",
    currentROB: {
      VLSFO: 580,
      LSMGO: 120,
    },
    currentPosition: {
      latitude: 51.5074,
      longitude: -0.1278,
      port: "London",
      country: "UK",
    },
    nextPort: "Rotterdam",
    ETA: addDays(now, 5).toISOString(),
    status: "ON_VOYAGE",
    estimatedConsumption: {
      VLSFO: 35,
      LSMGO: 2.0,
    },
    actualConsumption: {
      VLSFO: 35,
    },
    lastReportTime: subHours(now, 1).toISOString(),
    speed: 15.0,
    heading: 90,
    cargoId: null,
    bunkerPlanId: null,
  },
  {
    name: "MV Caribbean",
    imo: "9876550",
    currentROB: {
      VLSFO: 710,
      LSMGO: 150,
    },
    currentPosition: {
      latitude: 1.2897,
      longitude: 103.8501,
      port: "Singapore",
      country: "Singapore",
    },
    nextPort: "Singapore",
    ETA: addDays(now, 10).toISOString(),
    status: "ON_VOYAGE",
    estimatedConsumption: {
      VLSFO: 42,
      LSMGO: 2.5,
    },
    actualConsumption: {
      VLSFO: 42,
    },
    lastReportTime: subHours(now, 3).toISOString(),
    speed: 14.5,
    heading: 180,
    cargoId: null,
    bunkerPlanId: null,
  },
  {
    name: "MV Aegean",
    imo: "9876551",
    currentROB: {
      VLSFO: 490,
      LSMGO: 110,
    },
    currentPosition: {
      latitude: 25.2048,
      longitude: 55.2708,
      port: "Dubai",
      country: "UAE",
    },
    nextPort: "Dubai",
    ETA: addDays(now, 4).toISOString(),
    status: "ON_VOYAGE",
    estimatedConsumption: {
      VLSFO: 38,
      LSMGO: 2.2,
    },
    actualConsumption: {
      VLSFO: 38,
    },
    lastReportTime: subHours(now, 2).toISOString(),
    speed: 13.8,
    heading: 270,
    cargoId: null,
    bunkerPlanId: null,
  },
  {
    name: "MV Coral",
    imo: "9876552",
    currentROB: {
      VLSFO: 820,
      LSMGO: 180,
    },
    currentPosition: {
      latitude: 31.2304,
      longitude: 121.4737,
      port: "Shanghai",
      country: "China",
    },
    nextPort: "Shanghai",
    ETA: addDays(now, 12).toISOString(),
    status: "ON_VOYAGE",
    estimatedConsumption: {
      VLSFO: 45,
      LSMGO: 2.8,
    },
    actualConsumption: {
      VLSFO: 45,
    },
    lastReportTime: subHours(now, 1).toISOString(),
    speed: 14.8,
    heading: 0,
    cargoId: null,
    bunkerPlanId: null,
  },
  {
    name: "MV Arctic",
    imo: "9876553",
    currentROB: {
      VLSFO: 560,
      LSMGO: 125,
    },
    currentPosition: {
      latitude: 51.2311,
      longitude: 4.4057,
      port: "Antwerp",
      country: "Belgium",
    },
    nextPort: "Antwerp",
    ETA: addDays(now, 6).toISOString(),
    status: "ON_VOYAGE",
    estimatedConsumption: {
      VLSFO: 36,
      LSMGO: 2.0,
    },
    actualConsumption: {
      VLSFO: 36,
    },
    lastReportTime: subHours(now, 2).toISOString(),
    speed: 15.2,
    heading: 180,
    cargoId: null,
    bunkerPlanId: null,
  },
  {
    name: "MV Caspian",
    imo: "9876554",
    currentROB: {
      VLSFO: 640,
      LSMGO: 140,
    },
    currentPosition: {
      latitude: 3.0,
      longitude: 101.4,
      port: "Port Klang",
      country: "Malaysia",
    },
    nextPort: "Port Klang",
    ETA: addDays(now, 7).toISOString(),
    status: "ON_VOYAGE",
    estimatedConsumption: {
      VLSFO: 40,
      LSMGO: 2.3,
    },
    actualConsumption: {
      VLSFO: 40,
    },
    lastReportTime: subHours(now, 1).toISOString(),
    speed: 14.0,
    heading: 90,
    cargoId: null,
    bunkerPlanId: null,
  },
  {
    name: "MV Baltic II",
    imo: "9876555",
    currentROB: {
      VLSFO: 750,
      LSMGO: 160,
    },
    currentPosition: {
      latitude: -23.5505,
      longitude: -46.6333,
      port: "Santos",
      country: "Brazil",
    },
    nextPort: "Santos",
    ETA: addDays(now, 9).toISOString(),
    status: "ON_VOYAGE",
    estimatedConsumption: {
      VLSFO: 43,
      LSMGO: 2.5,
    },
    actualConsumption: {
      VLSFO: 43,
    },
    lastReportTime: subHours(now, 3).toISOString(),
    speed: 14.3,
    heading: 45,
    cargoId: null,
    bunkerPlanId: null,
  },
  {
    name: "MV Celtic",
    imo: "9876556",
    currentROB: {
      VLSFO: 590,
      LSMGO: 130,
    },
    currentPosition: {
      latitude: 35.6762,
      longitude: 139.6503,
      port: "Tokyo",
      country: "Japan",
    },
    nextPort: "Tokyo",
    ETA: addDays(now, 5).toISOString(),
    status: "ON_VOYAGE",
    estimatedConsumption: {
      VLSFO: 39,
      LSMGO: 2.2,
    },
    actualConsumption: {
      VLSFO: 39,
    },
    lastReportTime: subHours(now, 2).toISOString(),
    speed: 14.1,
    heading: 270,
    cargoId: null,
    bunkerPlanId: null,
  },
]

// NOTIFICATIONS
export const mockNotifications = [
  {
    id: "NOTIF-001",
    type: "URGENT",
    title: "Low ROB Alert - MV Indian Ocean",
    message: "Vessel MV Indian Ocean has low remaining fuel (150 MT VLSFO). Bunker plan required within 48 hours.",
    user: "OPERATOR",
    read: false,
    createdAt: subHours(now, 2).toISOString(),
    actionRequired: true,
    actionUrl: "/operator/vessels/9876546",
  },
  {
    id: "NOTIF-002",
    type: "INFO",
    title: "Bunker Plan Approved",
    message: "Bunker plan BUNKER-002 for cargo CARGO-001 has been approved by John Smith.",
    user: "CHARTERER",
    read: false,
    createdAt: subHours(now, 12).toISOString(),
    actionRequired: false,
    actionUrl: "/charterer/bunker-plans/BUNKER-002",
  },
  {
    id: "NOTIF-003",
    type: "WARNING",
    title: "3 Cargoes Ready for Decision",
    message: "You have 3 cargo opportunities ready for your review and decision.",
    user: "CHARTERER",
    read: false,
    createdAt: subHours(now, 6).toISOString(),
    actionRequired: true,
    actionUrl: "/charterer/cargoes",
  },
  {
    id: "NOTIF-004",
    type: "INFO",
    title: "New Bunker Nomination",
    message: "New bunker nomination received for Port Klang, 1200 MT VLSFO. Review required.",
    user: "SUPPLIER",
    read: false,
    createdAt: subHours(now, 4).toISOString(),
    actionRequired: true,
    actionUrl: "/supplier/nominations",
  },
  {
    id: "NOTIF-005",
    type: "WARNING",
    title: "Bunker Schedule Review Needed",
    message: "Your bunker schedule for MV Ocean Express needs review before departure.",
    user: "VESSEL",
    read: true,
    createdAt: subDays(now, 1).toISOString(),
    actionRequired: true,
    actionUrl: "/vessel/schedule",
  },
  {
    id: "NOTIF-006",
    type: "INFO",
    title: "ROB Data Update Required",
    message: "Please update ROB data for MV Pacific Voyager. Last update was 6 hours ago.",
    user: "VESSEL",
    read: false,
    createdAt: subHours(now, 1).toISOString(),
    actionRequired: true,
    actionUrl: "/vessel/rob-update",
  },
  {
    id: "NOTIF-007",
    type: "WARNING",
    title: "2 Bunker Plans Pending Approval",
    message: "You have 2 bunker plans awaiting your approval for cargoes CARGO-002 and CARGO-003.",
    user: "OPERATOR",
    read: false,
    createdAt: subHours(now, 8).toISOString(),
    actionRequired: true,
    actionUrl: "/operator/bunker-plans",
  },
  {
    id: "NOTIF-008",
    type: "INFO",
    title: "Fujairah Inventory Update Needed",
    message: "Please update inventory levels for Fujairah port. Current data is 3 days old.",
    user: "SUPPLIER",
    read: false,
    createdAt: subDays(now, 1).toISOString(),
    actionRequired: true,
    actionUrl: "/supplier/inventory",
  },
]

// PENDING TASKS (by user role)
export const mockPendingTasks = {
  CHARTERER: [
    {
      id: "TASK-CHARTERER-001",
      title: "3 Cargoes Ready for Decision",
      description: "Review and make decisions on 3 cargo opportunities: Singapore→Rotterdam, Dubai→London, Tokyo→LA",
      priority: "HIGH",
      dueDate: addDays(now, 1).toISOString(),
      status: "PENDING",
      count: 3,
      url: "/charterer/cargoes",
      type: "CARGO_REVIEW",
    },
    {
      id: "TASK-CHARTERER-002",
      title: "1 Bunker Plan Awaiting Your Review",
      description: "Bunker plan BUNKER-001 for cargo CARGO-001 (Singapore→Rotterdam) requires your approval",
      priority: "MEDIUM",
      dueDate: addDays(now, 2).toISOString(),
      status: "PENDING",
      count: 1,
      url: "/charterer/bunker-plans/BUNKER-001",
      type: "BUNKER_APPROVAL",
    },
  ],
  OPERATOR: [
    {
      id: "TASK-OPERATOR-001",
      title: "2 Bunker Plans Pending Approval",
      description: "Approve bunker plans for cargoes CARGO-002 (Dubai→London) and CARGO-003 (Tokyo→LA)",
      priority: "HIGH",
      dueDate: addDays(now, 1).toISOString(),
      status: "PENDING",
      count: 2,
      url: "/operator/bunker-plans",
      type: "BUNKER_APPROVAL",
    },
    {
      id: "TASK-OPERATOR-002",
      title: "1 Vessel Flagged Low ROB",
      description: "MV Indian Ocean has low remaining fuel (150 MT VLSFO). Urgent bunker plan required.",
      priority: "URGENT",
      dueDate: addHours(now, 24).toISOString(),
      status: "PENDING",
      count: 1,
      url: "/operator/vessels/9876546",
      type: "LOW_ROB_ALERT",
    },
  ],
  VESSEL: [
    {
      id: "TASK-VESSEL-001",
      title: "ROB Data Update Required",
      description: "Update remaining on board (ROB) data for MV Pacific Voyager. Last update was 6 hours ago.",
      priority: "MEDIUM",
      dueDate: addHours(now, 6).toISOString(),
      status: "PENDING",
      count: 1,
      url: "/vessel/rob-update",
      type: "DATA_UPDATE",
    },
    {
      id: "TASK-VESSEL-002",
      title: "Bunker Schedule Review Needed",
      description: "Review bunker schedule for MV Ocean Express before departure from Tokyo",
      priority: "HIGH",
      dueDate: addDays(now, 2).toISOString(),
      status: "PENDING",
      count: 1,
      url: "/vessel/schedule",
      type: "SCHEDULE_REVIEW",
    },
  ],
  SUPPLIER: [
    {
      id: "TASK-SUPPLIER-001",
      title: "1 New Bunker Nomination",
      description: "New bunker nomination received for Port Klang: 1200 MT VLSFO for cargo CARGO-001",
      priority: "HIGH",
      dueDate: addDays(now, 1).toISOString(),
      status: "PENDING",
      count: 1,
      url: "/supplier/nominations",
      type: "NOMINATION_REVIEW",
    },
    {
      id: "TASK-SUPPLIER-002",
      title: "Fujairah Inventory Update Needed",
      description: "Update inventory levels for Fujairah port. Current data is 3 days old and may be outdated.",
      priority: "MEDIUM",
      dueDate: addDays(now, 2).toISOString(),
      status: "PENDING",
      count: 1,
      url: "/supplier/inventory",
      type: "INVENTORY_UPDATE",
    },
  ],
}

// AI AGENT OUTPUTS (for explainability)
export const mockAIAgentOutputs = [
  {
    id: "AI-001",
    agentName: "Cost Optimizer",
    cargoId: "CARGO-001",
    status: "COMPLETED",
    confidence: 95,
    executionTime: 1247, // ms
    startedAt: subHours(now, 3).toISOString(),
    completedAt: subHours(now, 3).toISOString(),
    output: {
      recommendedPlan: "Port Klang bunkering",
      totalCost: 704500,
      savings: 15500,
      keyFindings: [
        "Port Klang offers best price-to-reliability ratio",
        "No deviation required from direct route",
        "Supplier reliability score: 98%",
        "Total cost 2.2% lower than alternative",
      ],
      costBreakdown: {
        fuelCost: 696000,
        portFees: 8500,
        deviationCost: 0,
        total: 704500,
      },
    },
    dataQuality: {
      sources: [
        {
          name: "Bunker Price Database",
          freshness: "2 hours",
          quality: 98,
        },
        {
          name: "Port Fee Registry",
          freshness: "1 day",
          quality: 95,
        },
        {
          name: "Supplier Reliability Index",
          freshness: "6 hours",
          quality: 97,
        },
      ],
      overallQuality: 96.7,
    },
  },
  {
    id: "AI-002",
    agentName: "Risk Assessor",
    cargoId: "CARGO-003",
    status: "COMPLETED",
    confidence: 82,
    executionTime: 2156,
    startedAt: subHours(now, 4).toISOString(),
    completedAt: subHours(now, 4).toISOString(),
    output: {
      riskLevel: "MEDIUM",
      keyFindings: [
        "Long Pacific crossing increases weather risk",
        "Honolulu bunker prices 6% above average",
        "Secondary supplier reliability below 90%",
        "Limited bunker port options mid-Pacific",
        "Potential for weather delays in North Pacific",
      ],
      riskFactors: [
        {
          factor: "Weather Risk",
          severity: "MEDIUM",
          impact: "Potential 2-3 day delays",
        },
        {
          factor: "Bunker Availability",
          severity: "LOW",
          impact: "Adequate supply confirmed",
        },
        {
          factor: "Supplier Reliability",
          severity: "MEDIUM",
          impact: "Secondary supplier at 88% reliability",
        },
      ],
    },
    dataQuality: {
      sources: [
        {
          name: "Weather Forecast API",
          freshness: "3 hours",
          quality: 92,
        },
        {
          name: "Bunker Availability Database",
          freshness: "4 hours",
          quality: 89,
        },
        {
          name: "Supplier Performance History",
          freshness: "1 day",
          quality: 94,
        },
      ],
      overallQuality: 91.7,
    },
  },
  {
    id: "AI-003",
    agentName: "Route Optimizer",
    cargoId: "CARGO-002",
    status: "COMPLETED",
    confidence: 89,
    executionTime: 1834,
    startedAt: subHours(now, 8).toISOString(),
    completedAt: subHours(now, 8).toISOString(),
    output: {
      recommendedRoute: "Dubai → Fujairah → Suez → Gibraltar → London",
      totalDistance: 7200,
      estimatedDuration: 24,
      keyFindings: [
        "Fujairah bunkering on-route, no deviation",
        "Optimal fuel price at primary bunker port",
        "Gibraltar available as backup option",
        "Route avoids high-risk areas",
      ],
      routeEfficiency: 94,
    },
    dataQuality: {
      sources: [
        {
          name: "Route Planning System",
          freshness: "1 hour",
          quality: 96,
        },
        {
          name: "Port Database",
          freshness: "2 hours",
          quality: 93,
        },
        {
          name: "Traffic Analysis",
          freshness: "30 minutes",
          quality: 95,
        },
      ],
      overallQuality: 94.7,
    },
  },
  {
    id: "AI-004",
    agentName: "Viability Analyzer",
    cargoId: "CARGO-004",
    status: "COMPLETED",
    confidence: 100,
    executionTime: 3421,
    startedAt: subDays(now, 3).toISOString(),
    completedAt: subDays(now, 3).toISOString(),
    output: {
      viable: false,
      reason: "NO_BUNKER_OPTIONS",
      keyFindings: [
        "No suitable bunker ports along route",
        "Excessive bunker costs make cargo unprofitable",
        "Long distance requires multiple bunker stops",
        "Limited availability in required timeframe",
        "Port fees and deviation costs too high",
      ],
      estimatedLoss: 20000,
      recommendation: "REJECT",
    },
    dataQuality: {
      sources: [
        {
          name: "Bunker Port Database",
          freshness: "6 hours",
          quality: 98,
        },
        {
          name: "Cost Calculator",
          freshness: "1 hour",
          quality: 97,
        },
        {
          name: "Availability System",
          freshness: "2 hours",
          quality: 95,
        },
      ],
      overallQuality: 96.7,
    },
  },
  {
    id: "AI-005",
    agentName: "Cost Optimizer",
    cargoId: "CARGO-003",
    status: "RUNNING",
    confidence: 0,
    executionTime: 0,
    startedAt: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
    completedAt: null,
    output: null,
    dataQuality: {
      sources: [],
      overallQuality: 0,
    },
  },
]

// Helper function to get notifications by user
export const getNotificationsByUser = (userRole) => {
  return mockNotifications.filter((notif) => notif.user === userRole)
}

// Helper function to get pending tasks by user
export const getPendingTasksByUser = (userRole) => {
  return mockPendingTasks[userRole] || []
}

// Helper function to get cargo by ID
export const getCargoById = (cargoId) => {
  return mockCargoes.find((cargo) => cargo.id === cargoId)
}

// Helper function to get bunker plans by cargo
export const getBunkerPlansByCargo = (cargoId) => {
  return mockBunkerPlans.filter((plan) => plan.cargoId === cargoId)
}

// Helper function to get vessel by IMO
export const getVesselByIMO = (imo) => {
  return mockVessels.find((vessel) => vessel.imo === imo)
}

// Helper function to get AI outputs by cargo
export const getAIOutputsByCargo = (cargoId) => {
  return mockAIAgentOutputs.filter((output) => output.cargoId === cargoId)
}

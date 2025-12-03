# ⚓ Fuel Sense

> AI-First Bunker Planning Platform for Maritime Operations

Fuel Sense is a comprehensive web application designed to optimize marine fuel (bunker) planning and management. It provides intelligent decision-making tools for charterers, operators, vessel officers, and suppliers to collaborate effectively on bunker planning operations.

![Demo Mode](https://img.shields.io/badge/Demo-Mode-yellow)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![React](https://img.shields.io/badge/React-19.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [User Guide](#user-guide)
- [Project Structure](#project-structure)
- [Mock Data](#mock-data)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🎯 Core Functionality

- **Multi-Role Dashboards**: Specialized interfaces for Charterers, Operators, Vessel Officers, and Suppliers
- **AI-Powered Analysis**: Intelligent cargo evaluation with confidence scoring and risk assessment
- **Real-Time Notifications**: Comprehensive notification system with categorization and sound alerts
- **Bunker Plan Management**: Complete workflow from nomination to approval to execution
- **Vessel Monitoring**: Real-time tracking of vessel positions, ROB (Remaining On Board), and voyage progress
- **Market Simulation**: Dynamic price updates and market condition changes
- **Analytics Dashboard**: Performance metrics, cost savings, and risk distribution visualization

### 🎨 User Experience

- **Responsive Design**: Optimized for desktop (1920px, 1366px, 1024px) and mobile devices
- **Accessibility**: WCAG AA compliant with keyboard navigation and screen reader support
- **Micro-interactions**: Smooth transitions, hover effects, and loading states
- **Empty States**: Friendly messages and guidance when no data is available
- **Help & Guidance**: Tooltips, help icons, and keyboard shortcuts

### 🔔 Notification System

- **Real-Time Updates**: Auto-refresh every 30 seconds
- **Categorization**: Approvals (green), Alerts (red), Updates (blue), Reminders (yellow)
- **Sound Alerts**: Optional audio notifications for urgent items
- **Click-to-Navigate**: Direct links to relevant pages
- **Preferences**: Customizable in-app and sound settings

### 🤖 Simulation Engine

- **AI Analysis Simulation**: Realistic agent execution with status updates
- **Voyage Progress**: Automatic vessel position and ROB updates
- **Market Changes**: Dynamic bunker price fluctuations
- **Time-Based Events**: Automated reminders and status updates

## 🛠 Technology Stack

### Frontend

- **Framework**: [Next.js 15.5](https://nextjs.org/) (App Router)
- **UI Library**: [React 19.1](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Icons**: [Lucide React](https://lucide.dev/)

### State Management & Data

- **Global State**: [Zustand 5.0](https://zustand-demo.pmnd.rs/)
- **Data Fetching**: [TanStack Query 5.9](https://tanstack.com/query)
- **Date Handling**: [date-fns 4.1](https://date-fns.org/)

### Charts & Visualization

- **Charts**: [Recharts 3.5](https://recharts.org/)

### Notifications & UX

- **Toasts**: [Sonner 2.0](https://sonner.emilkowal.ski/)
- **Animations**: Tailwind CSS animations

### Development Tools

- **Type Checking**: TypeScript 5.0
- **Linting**: ESLint with Next.js config
- **Package Manager**: npm

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd fuelsensev1
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 📖 User Guide

### Landing Page

The landing page provides role selection:

- **Charterer**: Make cargo decisions and fix voyages
- **Operator**: Approve bunker plans and monitor fleet
- **Vessel**: Report ROB and manage bunker operations
- **Supplier**: Manage nominations and inventory

Click any role card to enter that dashboard.

### Charterer Dashboard

**Overview Tab**

- View featured cargo (highest profit, low risk)
- Filter cargoes by profit range, risk level, bunker availability, and route
- Quick stats: total analyzed, ready for decision, average profit/confidence
- AI Analysis panel with agent status
- Recent activity feed

**Cargo List Tab**

- Table view of all cargoes with sortable columns
- Click any cargo to view detailed information
- Actions: Fix, Reject, Request Alternative

**Key Actions**

- **Fix Cargo**: Approve a cargo for the operator to proceed
- **Reject Cargo**: Decline with a reason
- **Request Alternative**: Ask AI to generate alternative bunker plans
- **Analyze Cargoes**: Trigger AI analysis for selected cargoes

### Operator Dashboard

**Approval Queue Tab**

- Review pending bunker plan nominations
- View AI recommendations with confidence scores
- See bunker plan details, alternatives, and AI reasoning
- Actions: Approve, Modify, Ask AI Why, Reject

**Monitoring Tab**

- Active voyages table with vessel status
- Real-time ROB (Remaining On Board) monitoring
- Alerts for low fuel, weather delays, and arrivals
- Map view placeholder for vessel positions

**Analytics Tab**

- Performance KPIs (cost savings, AI accuracy, voyages optimized)
- Savings trend charts
- Cost savings by vessel
- Risk distribution pie chart
- Detailed metrics table with CSV export

### Vessel Dashboard

**Current Voyage Tab**

- Vessel information and current position
- Voyage plan with progress indicator
- Bunker plan details and schedule
- Validation checklist with issue flagging

**ROB Update Tab**

- Form to report Remaining On Board fuel
- Tank-by-tank entry for VLSFO and LSMGO
- Consumption tracking
- Weather and operating mode inputs

**Bunker Operations Tab**

- Upcoming bunker schedule
- Pre-bunkering checklist
- During bunkering form (flow rate, temperature, samples)
- Post-bunkering form (BDN upload, quality check)

**History Tab**

- Timeline of reports and events
- Past ROB updates
- Completed bunker operations

### Supplier Dashboard

**Nominations Tab**

- Pending nominations with inventory check
- Price confirmation and delivery details
- Actions: Confirm, Request Changes, Decline
- Confirmed nominations with delivery status
- Completed deliveries with BDN upload

**Inventory Tab**

- Current stock levels (VLSFO, LSMGO)
- Committed vs available quantities
- Replenishment schedule

**Performance Tab**

- Delivery metrics (count, on-time rate, average time)
- Customer satisfaction ratings
- Recent feedback
- Delivery history table

### Notifications

- Click the bell icon in the top bar to view notifications
- Notifications are categorized by type and role
- Click any notification to navigate to the relevant page
- Mark individual or all notifications as read
- Configure sound and in-app preferences

### Keyboard Shortcuts

- `?` - Show help dialog with keyboard shortcuts
- `Esc` - Close dialogs and modals
- `Tab` - Navigate between interactive elements
- `Enter` - Activate buttons and links

## 📁 Project Structure

```
fuelsensev1/
├── app/                      # Next.js App Router pages
│   ├── layout.js            # Root layout with providers
│   ├── page.js              # Landing page (role selection)
│   ├── providers.js         # React Query and simulation providers
│   ├── globals.css          # Global styles and Tailwind
│   ├── charterer/           # Charterer dashboard
│   │   └── page.js
│   ├── operator/            # Operator dashboard
│   │   └── page.js
│   ├── vessel/              # Vessel dashboard
│   │   └── page.js
│   └── supplier/            # Supplier dashboard
│       └── page.js
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── dialog.jsx
│   │   ├── skeleton.jsx
│   │   └── ...              # Other UI components
│   ├── Notifications.jsx    # Notification center
│   ├── AIExplainer.jsx      # AI analysis display
│   └── PendingTasks.jsx     # Pending tasks widget
├── lib/                     # Utilities and core logic
│   ├── store.js             # Zustand global state
│   ├── mock-data.js         # Mock data for demo
│   ├── simulator.js         # Simulation engine
│   └── utils.js             # Utility functions
├── public/                  # Static assets
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── next.config.js          # Next.js configuration
├── netlify.toml            # Netlify deployment config
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## 🎭 Mock Data

This application uses **mock data** for demonstration purposes. All data is generated in `lib/mock-data.js` and includes:

- **Cargoes**: Sample cargo opportunities with routes, freight, costs, and risk assessments
- **Bunker Plans**: Pre-configured bunker plans with suppliers, prices, and delivery windows
- **Vessels**: Fleet information with positions, ROB, and voyage status
- **Notifications**: Sample notifications for different scenarios
- **Pending Tasks**: Task lists for each user role
- **AI Outputs**: Simulated AI agent analysis results

### Data Persistence

- State is persisted to `localStorage` using Zustand's persist middleware
- Data persists across page refreshes
- Each role has separate notification and task data

### Simulation

The application includes a simulation engine (`lib/simulator.js`) that:

- Simulates AI analysis with realistic delays and status updates
- Updates vessel positions and ROB automatically
- Adjusts bunker prices based on market conditions
- Generates time-based events (reminders, arrivals, alerts)

## 🚢 Deployment

### Netlify Deployment

This project is configured for Netlify deployment:

1. **Connect your repository** to Netlify
2. **Build settings** (auto-detected from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `.next`
3. **Environment variables**: Add any required variables in Netlify dashboard
4. **Deploy**: Netlify will automatically deploy on push to main branch

### Manual Build

```bash
npm run build
npm run start
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

- `NEXT_PUBLIC_APP_NAME`: Application name
- `NEXT_PUBLIC_DEMO_MODE`: Set to `true` for demo mode indicator

## 🤝 Contributing

This is a demo application. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use ESLint for linting
- Follow Next.js and React best practices
- Use TypeScript for type safety (even though app uses .js files)
- Format code with Prettier

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Demo Mode Notice

**This application is in DEMO MODE and uses mock data.**

- All data is simulated and not connected to real systems
- Notifications, simulations, and updates are for demonstration only
- Do not use this application for actual maritime operations
- See "Demo data - Not for production use" indicator in the application

## 📞 Support

For questions or issues:

- Check the [User Guide](#user-guide) section above
- Review the code comments in complex sections
- Open an issue in the repository

---

**Built with ❤️ for maritime operations**

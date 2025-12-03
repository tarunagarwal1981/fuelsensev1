"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Ship, Fuel, TrendingUp, DollarSign, Zap } from "lucide-react"
import { useStore } from "@/lib/store"
import { useMemo } from "react"
import { cn } from "@/lib/utils"

export default function Home() {
  const router = useRouter()
  const { setCurrentUser, getPendingTasksByUser } = useStore()

  const roles = [
    {
      role: "CHARTERER",
      name: "Charterer",
      description: "Make cargo decisions",
      icon: Building2,
      href: "/charterer",
      color: "primary",
      bgGradient: "from-blue-50 to-blue-100/50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      buttonColor: "bg-primary-600 hover:bg-primary-700",
    },
    {
      role: "OPERATOR",
      name: "Operator",
      description: "Approve bunker plans",
      icon: Users,
      href: "/operator",
      color: "secondary",
      bgGradient: "from-green-50 to-green-100/50",
      borderColor: "border-green-200",
      iconColor: "text-success",
      buttonColor: "bg-success hover:bg-green-600",
    },
    {
      role: "VESSEL",
      name: "Vessel",
      description: "Report vessel data",
      icon: Ship,
      href: "/vessel",
      color: "tertiary",
      bgGradient: "from-yellow-50 to-yellow-100/50",
      borderColor: "border-warning",
      iconColor: "text-warning",
      buttonColor: "bg-warning hover:bg-yellow-600",
    },
    {
      role: "SUPPLIER",
      name: "Supplier",
      description: "Manage nominations",
      icon: Fuel,
      href: "/supplier",
      color: "neutral",
      bgGradient: "from-gray-50 to-gray-100/50",
      borderColor: "border-gray-300",
      iconColor: "text-neutral",
      buttonColor: "bg-neutral hover:bg-gray-700",
    },
  ]

  // Get pending task counts for each role
  const roleTaskCounts = useMemo(() => {
    return roles.reduce((acc, role) => {
      const tasks = getPendingTasksByUser(role.role)
      acc[role.role] = tasks.reduce((sum, task) => sum + (task.count || 1), 0)
      return acc
    }, {})
  }, [getPendingTasksByUser])

  const handleRoleSelect = (roleData) => {
    // Set current user in store
    setCurrentUser({
      role: roleData.role,
      name: roleData.name,
      email: `${roleData.role.toLowerCase()}@fuelsense.com`,
    })

    // Navigate to dashboard
    router.push(roleData.href)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-5xl sm:text-6xl">⚓</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
              Fuel Sense
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 font-medium">
            AI-First Bunker Planning Platform
          </p>
          <p className="text-sm sm:text-base text-gray-500 mt-2">
            Optimize fuel procurement with intelligent decision-making
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {roles.map((roleData) => {
            const Icon = roleData.icon
            const taskCount = roleTaskCounts[roleData.role] || 0

            return (
              <Card
                key={roleData.role}
                className={cn(
                  "relative overflow-hidden transition-all duration-300 cursor-pointer group",
                  "hover:shadow-xl hover:scale-105 hover:-translate-y-1",
                  `bg-gradient-to-br ${roleData.bgGradient}`,
                  `border-2 ${roleData.borderColor}`
                )}
                onClick={() => handleRoleSelect(roleData)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className={cn(
                        "p-3 rounded-lg bg-white/80 backdrop-blur-sm group-hover:bg-white transition-colors",
                        "shadow-sm"
                      )}
                    >
                      <Icon className={cn("h-6 w-6 sm:h-7 sm:w-7", roleData.iconColor)} />
                    </div>
                    {taskCount > 0 && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs font-semibold px-2 py-0.5",
                          taskCount > 5 && "bg-danger text-white"
                        )}
                      >
                        {taskCount}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl sm:text-2xl mb-1">
                    {roleData.name}
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    {roleData.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    className={cn(
                      "w-full font-semibold transition-all duration-200",
                      roleData.buttonColor,
                      "group-hover:shadow-lg"
                    )}
                    size="lg"
                  >
                    Enter Dashboard
                    <Zap className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                  </Button>
                </CardContent>
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Card>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-soft p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-blue-100">
                <TrendingUp className="h-6 w-6 text-primary-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">47</div>
              <div className="text-sm text-gray-600">Voyages Optimized</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">$1.05M</div>
              <div className="text-sm text-gray-600">Total Savings</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-yellow-100">
                <Zap className="h-6 w-6 text-warning" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">94%</div>
              <div className="text-sm text-gray-600">AI Confidence</div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center mt-8 text-xs sm:text-sm text-gray-500">
          Select your role above to access your personalized dashboard
        </div>
      </div>
    </div>
  )
}

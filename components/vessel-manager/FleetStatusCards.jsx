"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react"

export function FleetStatusCards({ stats }) {
  const cards = [
    {
      title: "CRITICAL",
      value: stats?.critical || 1,
      subtitle: "vessel",
      status: "Urgent action",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      title: "ATTENTION",
      value: stats?.attention || 3,
      subtitle: "vessels",
      status: "Review soon 24-48hrs",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      title: "HEALTHY",
      value: stats?.healthy || 8,
      subtitle: "vessels",
      status: "On track",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "AVG SCORE",
      value: `${stats?.avgScore || 82}/100`,
      subtitle: "+2 vs last month",
      status: "✅",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <Card key={idx} className={`${card.bgColor} ${card.borderColor} border-2`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg bg-white/80 ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {card.title}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">{card.value}</div>
              <div className="text-sm text-gray-600 mb-2">{card.subtitle}</div>
              <div className="text-xs text-gray-500">{card.status}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}


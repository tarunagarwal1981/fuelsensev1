"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Construction } from "lucide-react"

export default function VesselManagerPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">⚓</span>
              <span className="text-xl font-bold text-gray-900">Fuel Sense</span>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <span className="text-3xl">👨‍✈️</span>
              <h1 className="text-lg font-semibold text-gray-900">Vessel Manager</h1>
            </div>
          </div>
          <Button variant="outline" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
              <Construction className="h-10 w-10 text-orange-600" />
            </div>
            <CardTitle className="text-2xl">Dashboard Under Development</CardTitle>
            <CardDescription className="text-base">
              The Vessel Manager dashboard is currently being designed and developed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-900">Planned Features:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>
                    <strong>Fleet Performance Overview:</strong> Monitor technical performance across all vessels with
                    real-time KPIs and trends
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>
                    <strong>Technical KPI Tracking:</strong> Track consumption efficiency, hull performance, engine
                    condition, and operational metrics
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>
                    <strong>Maintenance Planning:</strong> Schedule and track hull cleaning, drydocking, and preventive
                    maintenance across the fleet
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>
                    <strong>Compliance Management:</strong> Monitor regulatory compliance (EU ETS, FuelEU, CII, MRV) for
                    all vessels
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>
                    <strong>Fleet Benchmarking:</strong> Compare vessel performance, identify best practices, and
                    standardize operations
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>
                    <strong>Cost Optimization:</strong> Identify savings opportunities through technical improvements and
                    operational efficiency
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500 text-center">
                This dashboard will provide comprehensive fleet oversight tools for technical superintendents and vessel
                managers.
              </p>
            </div>

            <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={() => router.push("/")}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}


"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { simulateMarketChanges, simulateTimeBasedEvents } from "@/lib/simulator"

export function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  )

  // Global background simulations
  useEffect(() => {
    const marketId = setInterval(() => {
      simulateMarketChanges()
    }, 60_000)

    const eventsId = setInterval(() => {
      simulateTimeBasedEvents()
    }, 60_000)

    return () => {
      clearInterval(marketId)
      clearInterval(eventsId)
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}


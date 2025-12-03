"use client"

import { cn } from "@/lib/utils"

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200/80 dark:bg-gray-700/80",
        className
      )}
      {...props}
    />
  )
}



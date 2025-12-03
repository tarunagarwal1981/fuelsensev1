"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useStore } from "@/lib/store"
import { Clock, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

/**
 * PendingTasks widget
 * - Sticky to top-right of dashboard
 * - Shows pending items for current user
 */
export function PendingTasks() {
  const { currentUser, getPendingTasksByUser, completePendingTask } = useStore()
  const [isExpanded, setIsExpanded] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const tasks = useMemo(() => {
    if (!currentUser) return []
    return getPendingTasksByUser(currentUser.role)
  }, [currentUser, getPendingTasksByUser])

  const totalCount = tasks.reduce((sum, task) => sum + (task.count || 1), 0)

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "URGENT":
        return (
          <Badge className="bg-danger text-white animate-pulse">
            Urgent
          </Badge>
        )
      case "HIGH":
        return <Badge className="bg-warning text-white">High</Badge>
      case "MEDIUM":
        return <Badge variant="secondary">Medium</Badge>
      default:
        return <Badge variant="outline">Low</Badge>
    }
  }

  const getIconForTask = (priority) => {
    if (priority === "URGENT" || priority === "HIGH") {
      return <AlertTriangle className="h-4 w-4 text-warning" />
    }
    return <Clock className="h-4 w-4 text-primary-600" />
  }

  const handleComplete = async (taskId) => {
    try {
      setIsLoading(true)
      setError(null)
      completePendingTask(taskId)
    } catch (err) {
      console.error(err)
      setError("Failed to complete task")
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentUser) return null

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <div>
              <CardTitle className="text-sm">Pending Tasks</CardTitle>
              <CardDescription className="text-xs">
                {totalCount > 0 ? `${totalCount} items` : "No pending items"}
              </CardDescription>
            </div>
          </div>
            <div className="flex items-center gap-2">
              {totalCount > 0 && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  {totalCount}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label={isExpanded ? "Collapse tasks" : "Expand tasks"}
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        {error && (
          <div className="px-4 pb-2">
            <Alert variant="destructive">
              <AlertTitle className="text-xs">Error</AlertTitle>
              <AlertDescription className="text-xs">
                {error}
              </AlertDescription>
            </Alert>
          </div>
        )}
        {isExpanded && (
          <CardContent className="pt-0 pb-3">
            {isLoading && tasks.length === 0 ? (
              <div className="py-4 text-center text-xs text-gray-500">
                Loading tasks...
              </div>
            ) : tasks.length === 0 ? (
              <div className="py-4 text-center text-xs text-gray-500 flex flex-col items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-gray-300" />
                <span>No pending tasks</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {tasks.map((task) => (
                  <Alert
                    key={task.id}
                    className={cn(
                      "p-3 border-l-4 text-xs",
                      task.priority === "URGENT" && "border-l-danger animate-pulse",
                      task.priority === "HIGH" && "border-l-warning",
                      task.priority === "MEDIUM" && "border-l-primary-600",
                      task.priority === "LOW" && "border-l-gray-300"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 flex-shrink-0">
                        {getIconForTask(task.priority)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <AlertTitle className="text-xs font-semibold line-clamp-1">
                            {task.title}
                          </AlertTitle>
                          {getPriorityBadge(task.priority)}
                        </div>
                        <AlertDescription className="text-[11px] text-gray-600 mb-1 line-clamp-2">
                          {task.description}
                        </AlertDescription>
                        <div className="flex items-center justify-between mt-1">
                          {task.dueDate && (
                            <span className="text-[10px] text-gray-400">
                              Due {format(new Date(task.dueDate), "PP")}
                            </span>
                          )}
                          <div className="flex items-center gap-1">
                            {task.url && (
                              <Link href={task.url}>
                                <Button
                                  size="xs"
                                  variant="outline"
                                  className="h-6 px-2 text-[10px]"
                                >
                                  Open
                                </Button>
                              </Link>
                            )}
                            <Button
                              size="xs"
                              variant="ghost"
                              className="h-6 px-2 text-[10px] text-gray-500 hover:text-gray-900"
                              onClick={() => handleComplete(task.id)}
                              disabled={isLoading}
                            >
                              Done
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>
  )
}


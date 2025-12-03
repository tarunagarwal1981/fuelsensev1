"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Bell, Info, AlertTriangle, AlertCircle, CheckCircle2, X, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useStore } from "@/lib/store"
import { format, formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import Link from "next/link"

export function Notifications() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    currentUser,
    notificationPreferences,
    setNotificationPreferences,
  } = useStore()

  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const previousUnreadCountRef = useRef(unreadCount)
  const intervalRef = useRef(null)
  const audioRef = useRef(null)

  // Lazy-load notification sound
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      audioRef.current = new Audio("/sounds/notify.mp3")
    } catch {
      audioRef.current = null
    }
  }, [])

  // Filter notifications by current user role
  const userNotifications = currentUser
    ? notifications.filter((n) => n.user === currentUser.role)
    : notifications

  const unreadNotifications = userNotifications.filter((n) => !n.read)

  // Auto-refresh every 30 seconds (placeholder for real-time)
  useEffect(() => {
    if (isOpen) {
      intervalRef.current = setInterval(() => {
        const urgentUnread = userNotifications.filter(
          (n) => !n.read && (n.type === "URGENT" || n.type === "ALERT")
        )
        
        if (urgentUnread.length > 0 && previousUnreadCountRef.current < unreadNotifications.length) {
          urgentUnread.forEach((notif) => {
            if (notificationPreferences?.inApp) {
              toast.error(notif.title, {
                description: notif.message,
                duration: 5000,
              })
            }
            if (notificationPreferences?.sound && audioRef.current) {
              audioRef.current.currentTime = 0
              audioRef.current.play().catch(() => {})
            }
          })
        }
        
        previousUnreadCountRef.current = unreadNotifications.length
      }, 30000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isOpen, userNotifications, unreadNotifications.length])

  // Check for new urgent notifications
  useEffect(() => {
    const urgentUnread = userNotifications.filter(
      (n) => !n.read && (n.type === "URGENT" || n.type === "ALERT")
    )
    
    if (urgentUnread.length > 0 && previousUnreadCountRef.current < unreadNotifications.length) {
      urgentUnread.forEach((notif) => {
        if (notificationPreferences?.inApp) {
          toast.error(notif.title, {
            description: notif.message,
            duration: 5000,
          })
        }
        if (notificationPreferences?.sound && audioRef.current) {
          audioRef.current.currentTime = 0
          audioRef.current.play().catch(() => {})
        }
      })
    }
    
    previousUnreadCountRef.current = unreadNotifications.length
  }, [userNotifications, unreadNotifications.length])

  const handleMarkAsRead = async (notificationId) => {
    try {
      setIsLoading(true)
      setError(null)
      markAsRead(notificationId)
    } catch (err) {
      setError("Failed to mark notification as read")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      setIsLoading(true)
      setError(null)
      unreadNotifications.forEach((notif) => {
        markAsRead(notif.id)
      })
      toast.success("All notifications marked as read")
    } catch (err) {
      setError("Failed to mark all as read")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "URGENT":
      case "ALERT":
        return <AlertCircle className="h-4 w-4 text-danger" />
      case "WARNING":
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case "INFO":
        return <Info className="h-4 w-4 text-primary-600" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case "URGENT":
      case "ALERT":
        return "border-l-danger bg-red-50/50"
      case "WARNING":
        return "border-l-warning bg-yellow-50/50"
      case "INFO":
        return "border-l-primary-600 bg-blue-50/50"
      default:
        return "border-l-gray-300 bg-gray-50/50"
    }
  }

  const getCategoryLabel = (notification) => {
    const { type, title } = notification
    if (type === "INFO" && /approved|confirmed|fixed/i.test(title || "")) {
      return "Approval"
    }
    if (type === "URGENT" || type === "ALERT" || /alert|low rob/i.test(title || "")) {
      return "Alert"
    }
    if (type === "WARNING" || /reminder|pending/i.test(title || "")) {
      return "Reminder"
    }
    return "Update"
  }

  const handleNotificationClick = (notification) => {
    if (notification.actionUrl) {
      router.push(notification.actionUrl)
    }
    if (!notification.read) {
      markAsRead(notification.id)
    }
    setIsOpen(false)
  }

  if (!currentUser) {
    return null
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={
            "relative " +
            (unreadNotifications.some((n) => n.type === "URGENT" || n.type === "ALERT")
              ? "ring-2 ring-danger/50 animate-pulse"
              : "")
          }
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadNotifications.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-semibold"
            >
              {unreadNotifications.length > 9 ? "9+" : unreadNotifications.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[400px] sm:w-[500px] p-0"
        sideOffset={8}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <h3 className="font-semibold">Notifications</h3>
            {unreadNotifications.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadNotifications.length} unread
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadNotifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={isLoading}
                className="text-xs"
              >
                Mark all as read
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              aria-label="Notification preferences"
              onClick={() =>
                setNotificationPreferences({
                  sound: !notificationPreferences?.sound,
                })
              }
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border-b border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="max-h-[500px] overflow-y-auto">
          {isLoading && userNotifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              Loading notifications...
            </div>
          ) : userNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-500">No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {userNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors border-l-4 cursor-pointer ${
                    !notification.read ? getNotificationColor(notification.type) : "border-l-transparent"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${
                              !notification.read ? "text-gray-900" : "text-gray-600"
                            }`}
                          >
                            {notification.title}
                          </p>
                          <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">
                            {getCategoryLabel(notification)}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-400">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                            {!notification.read && (
                              <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
                            )}
                          </div>
                        </div>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 flex-shrink-0"
                            onClick={() => handleMarkAsRead(notification.id)}
                            aria-label="Mark as read"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      {notification.actionRequired && notification.actionUrl && (
                        <div className="mt-3">
                          <Link href={notification.actionUrl}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full text-xs"
                              onClick={() => {
                                handleMarkAsRead(notification.id)
                                setIsOpen(false)
                              }}
                            >
                              View Details
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

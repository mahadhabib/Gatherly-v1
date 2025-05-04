"use client"

import { useState, useEffect } from "react"
import { Bell, Check, X, Info, AlertTriangle, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth.jsx"
import { mockNotifications, mockUserPreferences } from "@/lib/utils"

export default function Notifications() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [preferences, setPreferences] = useState({
    email: {
      newRsvp: true,
      eventReminders: true,
      messages: true,
      systemUpdates: false,
    },
    push: {
      newRsvp: true,
      eventReminders: true,
      messages: false,
      systemUpdates: false,
    },
    sms: {
      newRsvp: false,
      eventReminders: true,
      messages: false,
      systemUpdates: false,
    },
  })
  const [loading, setLoading] = useState(true)
  const [preferencesLoading, setPreferencesLoading] = useState(true)

  // Fetch notifications from mock data
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return

      setLoading(true)
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Filter notifications for the current user
        const userNotifications = mockNotifications.filter((notification) => notification.userId === user.uid)
        setNotifications(userNotifications)
      } catch (error) {
        console.error("Error fetching notifications:", error)
        toast({
          title: "Error",
          description: "Failed to load notifications. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    // Fetch notification preferences from mock data
    const fetchPreferences = async () => {
      if (!user) return

      setPreferencesLoading(true)
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Get user preferences if they exist
        const userPrefs = mockUserPreferences[user.uid]
        if (userPrefs?.notifications) {
          setPreferences(userPrefs.notifications)
        }
      } catch (error) {
        console.error("Error fetching notification preferences:", error)
      } finally {
        setPreferencesLoading(false)
      }
    }

    if (user) {
      fetchNotifications()
      fetchPreferences()
    }
  }, [user, toast])

  const markAsRead = async (id) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Update local state
      setNotifications(
        notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
      )

      toast({
        title: "Notification marked as read",
        description: "The notification has been updated",
      })
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast({
        title: "Error",
        description: "Failed to update notification. Please try again.",
        variant: "destructive",
      })
    }
  }

  const markAllAsRead = async () => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update local state
      setNotifications(notifications.map((notification) => ({ ...notification, read: true })))

      toast({
        title: "All notifications marked as read",
        description: "Your notifications have been updated",
      })
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast({
        title: "Error",
        description: "Failed to update notifications. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteNotification = async (id) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Update local state
      setNotifications(notifications.filter((n) => n.id !== id))

      toast({
        title: "Notification deleted",
        description: "The notification has been removed",
      })
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast({
        title: "Error",
        description: "Failed to delete notification. Please try again.",
        variant: "destructive",
      })
    }
  }

  const clearAllNotifications = async () => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update local state
      setNotifications([])

      toast({
        title: "All notifications cleared",
        description: "Your notification list has been cleared",
      })
    } catch (error) {
      console.error("Error clearing notifications:", error)
      toast({
        title: "Error",
        description: "Failed to clear notifications. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <Check className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "reminder":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString()
  }

  const handlePreferenceChange = async (category, setting, value) => {
    if (!user) return

    try {
      // Update local state first for immediate feedback
      setPreferences((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [setting]: value,
        },
      }))

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      toast({
        title: "Preferences updated",
        description: `${setting} notifications via ${category} ${value ? "enabled" : "disabled"}`,
      })
    } catch (error) {
      console.error("Error updating preferences:", error)
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      })

      // Revert local state if update failed
      setPreferences((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [setting]: !value,
        },
      }))
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (!user) {
    return (
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Bell className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">Please sign in</h2>
            <p className="text-muted-foreground max-w-md">You need to be signed in to view your notifications.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="outline" onClick={clearAllNotifications}>
              Clear all
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            All
            {notifications.length > 0 && ` (${notifications.length})`}
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadCount > 0 && ` (${unreadCount})`}
          </TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <span>Loading notifications...</span>
          </div>
        ) : (
          <>
            <TabsContent value="all">
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <Card key={notification.id} className={notification.read ? "" : "border-primary/50"}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium">{notification.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                              </div>
                              <span className="text-xs text-muted-foreground">{formatDate(notification.date)}</span>
                            </div>
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-2"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Mark as read
                              </Button>
                            )}
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => deleteNotification(notification.id)}>
                            <X className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No notifications</h3>
                    <p className="text-muted-foreground max-w-md">
                      You're all caught up! We'll notify you when there's something new.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="unread">
              {unreadCount > 0 ? (
                <div className="space-y-4">
                  {notifications
                    .filter((n) => !n.read)
                    .map((notification) => (
                      <Card key={notification.id} className="border-primary/50">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-medium">{notification.title}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                </div>
                                <span className="text-xs text-muted-foreground">{formatDate(notification.date)}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-2"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Mark as read
                              </Button>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => deleteNotification(notification.id)}>
                              <X className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <Check className="h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                    <p className="text-muted-foreground max-w-md">You have no unread notifications at the moment.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </>
        )}

        <TabsContent value="preferences">
          {preferencesLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <span>Loading preferences...</span>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>Manage what emails you receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-rsvp" className="flex-1">
                      New RSVPs
                    </Label>
                    <Switch
                      id="email-rsvp"
                      checked={preferences.email.newRsvp}
                      onCheckedChange={(checked) => handlePreferenceChange("email", "newRsvp", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-reminders" className="flex-1">
                      Event Reminders
                    </Label>
                    <Switch
                      id="email-reminders"
                      checked={preferences.email.eventReminders}
                      onCheckedChange={(checked) => handlePreferenceChange("email", "eventReminders", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-messages" className="flex-1">
                      Messages
                    </Label>
                    <Switch
                      id="email-messages"
                      checked={preferences.email.messages}
                      onCheckedChange={(checked) => handlePreferenceChange("email", "messages", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-updates" className="flex-1">
                      System Updates
                    </Label>
                    <Switch
                      id="email-updates"
                      checked={preferences.email.systemUpdates}
                      onCheckedChange={(checked) => handlePreferenceChange("email", "systemUpdates", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Push Notifications</CardTitle>
                  <CardDescription>Manage in-app notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-rsvp" className="flex-1">
                      New RSVPs
                    </Label>
                    <Switch
                      id="push-rsvp"
                      checked={preferences.push.newRsvp}
                      onCheckedChange={(checked) => handlePreferenceChange("push", "newRsvp", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-reminders" className="flex-1">
                      Event Reminders
                    </Label>
                    <Switch
                      id="push-reminders"
                      checked={preferences.push.eventReminders}
                      onCheckedChange={(checked) => handlePreferenceChange("push", "eventReminders", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-messages" className="flex-1">
                      Messages
                    </Label>
                    <Switch
                      id="push-messages"
                      checked={preferences.push.messages}
                      onCheckedChange={(checked) => handlePreferenceChange("push", "messages", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-updates" className="flex-1">
                      System Updates
                    </Label>
                    <Switch
                      id="push-updates"
                      checked={preferences.push.systemUpdates}
                      onCheckedChange={(checked) => handlePreferenceChange("push", "systemUpdates", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SMS Notifications</CardTitle>
                  <CardDescription>Manage text message alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-rsvp" className="flex-1">
                      New RSVPs
                    </Label>
                    <Switch
                      id="sms-rsvp"
                      checked={preferences.sms.newRsvp}
                      onCheckedChange={(checked) => handlePreferenceChange("sms", "newRsvp", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-reminders" className="flex-1">
                      Event Reminders
                    </Label>
                    <Switch
                      id="sms-reminders"
                      checked={preferences.sms.eventReminders}
                      onCheckedChange={(checked) => handlePreferenceChange("sms", "eventReminders", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-messages" className="flex-1">
                      Messages
                    </Label>
                    <Switch
                      id="sms-messages"
                      checked={preferences.sms.messages}
                      onCheckedChange={(checked) => handlePreferenceChange("sms", "messages", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-updates" className="flex-1">
                      System Updates
                    </Label>
                    <Switch
                      id="sms-updates"
                      checked={preferences.sms.systemUpdates}
                      onCheckedChange={(checked) => handlePreferenceChange("sms", "systemUpdates", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { format } from "date-fns"
import { Calendar, Plus, Users, Settings, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth.jsx"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { mockEvents } from "@/lib/utils"

export default function Dashboard() {
  const { toast } = useToast()
  const { user } = useAuth()
  const location = useLocation()
  const [myEvents, setMyEvents] = useState([])
  const [activeTab, setActiveTab] = useState("hosting")
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Parse the event ID from the URL if present
  const params = new URLSearchParams(location.search)
  const highlightedEventId = params.get("event")

  // Function to fetch events from mock data
  const fetchEvents = async () => {
    setLoading(true)
    try {
      if (!user) return

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const now = new Date()
      const fetchedEvents = mockEvents.map((event) => ({
        ...event,
        isPast: event.date < now,
        // Check if user is organizer based on organizerId
        isOrganizer: event.organizerId === user.uid,
      }))

      setMyEvents(fetchedEvents)
    } catch (error) {
      console.error("Error fetching events:", error)
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchEvents()
    }
  }, [user])

  // Function to handle event deletion with mock data
  const handleDeleteEvent = async (id) => {
    setEventToDelete(id)
    setShowDeleteDialog(true)
  }

  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return

    setDeleteLoading(true)
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      setMyEvents(myEvents.filter((event) => event.id !== eventToDelete))

      toast({
        title: "Event Deleted",
        description: "The event has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(false)
      setShowDeleteDialog(false)
      setEventToDelete(null)
    }
  }

  // Filter events based on active tab
  const filteredEvents = myEvents.filter((event) => {
    if (activeTab === "hosting") {
      return event.isOrganizer && !event.isPast
    } else if (activeTab === "attending") {
      return !event.isOrganizer && !event.isPast
    } else if (activeTab === "past") {
      return event.isPast
    }
    return true
  })

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage src={user?.photoURL || "/placeholder.svg?height=40&width=40"} alt="User" />
            <AvatarFallback>{user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user?.displayName || "User"}</h1>
            <p className="text-muted-foreground">Manage your events and RSVPs</p>
          </div>
        </div>
        <Button asChild>
          <Link to="/create-event">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "hosting"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("hosting")}
        >
          Hosting
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "attending"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("attending")}
        >
          Attending
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "past"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("past")}
        >
          Past Events
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading events...</span>
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className={`flex flex-col ${highlightedEventId === event.id ? "border-primary" : ""}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(event.date, "MMMM d, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2 flex-grow">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Users className="h-4 w-4 mr-1" />
                  <span>
                    {event.attendees}/{event.capacity} attendees
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2 border-t">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/events/${event.id}`}>
                    {event.isOrganizer && !event.isPast ? (
                      <>
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </>
                    ) : (
                      "View Details"
                    )}
                  </Link>
                </Button>
                {event.isOrganizer && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">No events found</h2>
          <p className="text-muted-foreground mb-6">
            {activeTab === "hosting"
              ? "You're not hosting any events yet."
              : activeTab === "attending"
                ? "You're not attending any events yet."
                : "You don't have any past events."}
          </p>
          {activeTab === "hosting" && (
            <Button asChild>
              <Link to="/create-event">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
          )}
          {activeTab === "attending" && (
            <Button asChild>
              <Link to="/events">Browse Events</Link>
            </Button>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this event?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the event, all RSVPs, comments, and invitations
              associated with it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button onClick={confirmDeleteEvent} disabled={deleteLoading} variant="destructive">
              {deleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Event"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

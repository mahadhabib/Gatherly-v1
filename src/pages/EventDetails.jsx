"use client"

import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Calendar, Clock, MapPin, Users, ArrowLeft, Edit, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth.jsx"
import LocationDisplay from "@/components/maps/location-display"
import SocialShare from "@/components/social/social-share"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventComments from "@/components/communication/event-comments"
import { mockEvents } from "@/lib/utils" // Import mockEvents

export default function EventDetails() {
  const { id } = useParams()
  const { toast } = useToast()
  const { user } = useAuth()
  const [event, setEvent] = useState(mockEvents.find((event) => event.id === id)) // Use mockEvents
  const [loading, setLoading] = useState(false) // Set loading to false

  // If loading, show a loading indicator
  if (loading) {
    return (
      <div className="container py-12 px-4 md:px-6 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-medium">Loading event details...</h2>
      </div>
    )
  }

  // If event not found, show a message
  if (!event) {
    return (
      <div className="container py-12 px-4 md:px-6 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
        <p className="text-muted-foreground mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
      </div>
    )
  }

  const { title, description, date, location, image, attendees, capacity, coordinates } = event

  // Check if event is in the past
  const isPastEvent = new Date(date) < new Date()

  return (
    <div className="container py-8 px-4 md:px-6">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/events">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-lg overflow-hidden">
            <img
              src={image || "/placeholder.svg?height=300&width=500"}
              alt={title}
              className="w-full h-auto object-cover aspect-video"
            />
          </div>

          <h1 className="text-3xl font-bold mt-6">{title}</h1>

          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-5 w-5 mr-2" />
              {format(date, "EEEE, MMMM d, yyyy")}
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-5 w-5 mr-2" />
              {format(date, "h:mm a")}
            </div>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-5 w-5 mr-2" />
              {location}
            </div>
          </div>

          <Tabs defaultValue="about" className="mt-6">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-4">
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-2">About This Event</h2>
                <p className="text-foreground">{description}</p>
              </div>
            </TabsContent>

            <TabsContent value="location" className="mt-4">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Event Location</h2>
                <LocationDisplay location={coordinates} address={location} />
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="mt-4">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Event Schedule</h2>
                <p className="text-muted-foreground">The organizer has not provided a detailed schedule yet.</p>
              </div>
            </TabsContent>

            <TabsContent value="discussion" className="mt-4">
              <EventComments eventId={id} isOrganizer={event.isOrganizer} />
            </TabsContent>

            <TabsContent value="photos" className="mt-4">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Event Photos</h2>
                <p className="text-muted-foreground">No photos have been uploaded for this event yet.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg border p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Event Details</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Date & Time</h3>
                <p className="mt-1">
                  {format(date, "EEEE, MMMM d, yyyy")} at {format(date, "h:mm a")}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                <p className="mt-1">{location}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Attendees</h3>
                <div className="flex items-center mt-1">
                  <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>{attendees} attending</span>
                  <span className="mx-2">•</span>
                  <span>{capacity - attendees} spots left</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(attendees / capacity) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Organizer</h3>
                <div className="flex items-center mt-1">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Event Organizer</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {event.isOrganizer
                ? // Show manage event button for organizers
                  !isPastEvent && (
                    <Button className="w-full" asChild>
                      <Link to={`/dashboard?event=${id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Manage Event
                      </Link>
                    </Button>
                  )
                : // Show RSVP button for attendees
                  !isPastEvent && (
                    <Button className="w-full" asChild>
                      <Link to={`/rsvp/${id}`}>RSVP Now</Link>
                    </Button>
                  )}
              <SocialShare event={event} className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

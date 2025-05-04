"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Calendar, Users, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import EventCard from "@/components/common/EventCard"
import { mockEvents } from "@/lib/utils" // Import mockEvents

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState(mockEvents.slice(0, 3)) // Use mockEvents
  const [loading, setLoading] = useState(false) // Set loading to false

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary/5 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Plan Events & Manage RSVPs with Ease
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Gatherly simplifies event planning and RSVP management. Create, share, and track your events all in
                  one place.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link to="/create-event">Create an Event</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/events">Browse Events</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Features</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to create and manage successful events
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 mt-8">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <Calendar className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Event Creation</h3>
              <p className="text-center text-muted-foreground">
                Create beautiful event pages with all the details your guests need.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <Users className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">RSVP Management</h3>
              <p className="text-center text-muted-foreground">
                Track RSVPs, send reminders, and manage your guest list effortlessly.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <MapPin className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Location Sharing</h3>
              <p className="text-center text-muted-foreground">
                Share event locations and directions with your guests automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Events</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover upcoming events and secure your spot
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link to="/events" className="flex items-center">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

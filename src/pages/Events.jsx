"use client"

import { useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventCard from "@/components/common/EventCard"
import { mockEvents } from "@/lib/utils" // Import mockEvents
import { useToast } from "@/hooks/use-toast"

export default function Events() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [activeTab, setActiveTab] = useState("upcoming")
  const [events, setEvents] = useState(mockEvents) // Use mockEvents
  const [loading, setLoading] = useState(false) // Set loading to false

  // Determine if an event is in the past
  const isPastEvent = (event) => {
    return new Date(event.date) < new Date()
  }

  // Filter events based on search term
  const filteredEvents = events.filter(
    (event) =>
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Further filter based on active tab
  const displayedEvents =
    activeTab === "upcoming" ? filteredEvents.filter((event) => !isPastEvent(event)) : filteredEvents

  // Sort events based on selected option
  const sortedEvents = [...displayedEvents].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.date) - new Date(b.date)
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title)
    } else if (sortBy === "location") {
      return a.location.localeCompare(b.location)
    } else if (sortBy === "capacity") {
      return b.capacity - a.capacity
    }
    return 0
  })

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Events</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date (Soonest)</SelectItem>
                <SelectItem value="title">Title (A-Z)</SelectItem>
                <SelectItem value="location">Location (A-Z)</SelectItem>
                <SelectItem value="capacity">Capacity (Highest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="all">All Events</TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading events...</span>
          </div>
        ) : (
          <>
            <TabsContent value="upcoming" className="mt-6">
              {sortedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 mt-8">
                  <p className="text-xl text-muted-foreground">No upcoming events found</p>
                  <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
                    Clear Search
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="mt-6">
              {sortedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 mt-8">
                  <p className="text-xl text-muted-foreground">No events found</p>
                  <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
                    Clear Search
                  </Button>
                </div>
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}

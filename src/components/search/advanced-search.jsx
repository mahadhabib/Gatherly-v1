"use client"

import { useState } from "react"
import { Search, Filter, Calendar, MapPin, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import EventCard from "@/components/common/EventCard"
import { mockEvents } from "@/lib/utils"

export default function AdvancedSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    dateRange: "all",
    location: "all",
    eventType: "all",
    capacity: "all",
    freeOnly: false,
  })
  const [sortBy, setSortBy] = useState("date")
  const [results, setResults] = useState([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    // Filter events based on search term and filters
    let filtered = [...mockEvents]

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const nextWeek = new Date(now)
      nextWeek.setDate(nextWeek.getDate() + 7)
      const nextMonth = new Date(now)
      nextMonth.setMonth(nextMonth.getMonth() + 1)

      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.date)
        switch (filters.dateRange) {
          case "today":
            return eventDate.toDateString() === now.toDateString()
          case "tomorrow":
            return eventDate.toDateString() === tomorrow.toDateString()
          case "week":
            return eventDate <= nextWeek && eventDate >= now
          case "month":
            return eventDate <= nextMonth && eventDate >= now
          default:
            return true
        }
      })
    }

    // Location filter
    if (filters.location !== "all") {
      filtered = filtered.filter((event) => event.location.includes(filters.location))
    }

    // Capacity filter
    if (filters.capacity !== "all") {
      filtered = filtered.filter((event) => {
        switch (filters.capacity) {
          case "small":
            return event.capacity < 50
          case "medium":
            return event.capacity >= 50 && event.capacity < 200
          case "large":
            return event.capacity >= 200
          default:
            return true
        }
      })
    }

    // Sort results
    filtered.sort((a, b) => {
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

    setResults(filtered)
    setHasSearched(true)
  }

  const resetFilters = () => {
    setFilters({
      dateRange: "all",
      location: "all",
      eventType: "all",
      capacity: "all",
      freeOnly: false,
    })
  }

  const hasActiveFilters = () => {
    return (
      filters.dateRange !== "all" ||
      filters.location !== "all" ||
      filters.eventType !== "all" ||
      filters.capacity !== "all" ||
      filters.freeOnly
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events by title, description, or location..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <div className="flex gap-2">
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {hasActiveFilters() && <span className="ml-1 rounded-full bg-primary w-2 h-2" />}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter Events</h4>

                  <div className="space-y-2">
                    <Label htmlFor="date-range">Date Range</Label>
                    <Select
                      value={filters.dateRange}
                      onValueChange={(value) => setFilters({ ...filters, dateRange: value })}
                    >
                      <SelectTrigger id="date-range">
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Dates</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="tomorrow">Tomorrow</SelectItem>
                        <SelectItem value="week">Next 7 Days</SelectItem>
                        <SelectItem value="month">Next 30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select
                      value={filters.location}
                      onValueChange={(value) => setFilters({ ...filters, location: value })}
                    >
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="San Francisco">San Francisco</SelectItem>
                        <SelectItem value="New York">New York</SelectItem>
                        <SelectItem value="Chicago">Chicago</SelectItem>
                        <SelectItem value="Austin">Austin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-type">Event Type</Label>
                    <Select
                      value={filters.eventType}
                      onValueChange={(value) => setFilters({ ...filters, eventType: value })}
                    >
                      <SelectTrigger id="event-type">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="networking">Networking</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Select
                      value={filters.capacity}
                      onValueChange={(value) => setFilters({ ...filters, capacity: value })}
                    >
                      <SelectTrigger id="capacity">
                        <SelectValue placeholder="Select capacity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Size</SelectItem>
                        <SelectItem value="small">Small (&lt; 50)</SelectItem>
                        <SelectItem value="medium">Medium (50-200)</SelectItem>
                        <SelectItem value="large">Large (&gt; 200)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="free-only"
                      checked={filters.freeOnly}
                      onCheckedChange={(checked) => setFilters({ ...filters, freeOnly: checked })}
                    />
                    <Label htmlFor="free-only">Free events only</Label>
                  </div>

                  <div className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                    <Button size="sm" onClick={() => setShowFilters(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date (Soonest)</SelectItem>
                <SelectItem value="title">Title (A-Z)</SelectItem>
                <SelectItem value="location">Location (A-Z)</SelectItem>
                <SelectItem value="capacity">Capacity (Highest)</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSearch}>Search</Button>
          </div>
        </div>

        {hasActiveFilters() && (
          <div className="flex flex-wrap gap-2">
            {filters.dateRange !== "all" && (
              <div className="flex items-center bg-muted text-sm rounded-full px-3 py-1">
                <Calendar className="h-3 w-3 mr-1" />
                {filters.dateRange === "today"
                  ? "Today"
                  : filters.dateRange === "tomorrow"
                    ? "Tomorrow"
                    : filters.dateRange === "week"
                      ? "Next 7 Days"
                      : "Next 30 Days"}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1"
                  onClick={() => setFilters({ ...filters, dateRange: "all" })}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {filters.location !== "all" && (
              <div className="flex items-center bg-muted text-sm rounded-full px-3 py-1">
                <MapPin className="h-3 w-3 mr-1" />
                {filters.location}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1"
                  onClick={() => setFilters({ ...filters, location: "all" })}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {filters.capacity !== "all" && (
              <div className="flex items-center bg-muted text-sm rounded-full px-3 py-1">
                <Users className="h-3 w-3 mr-1" />
                {filters.capacity === "small" ? "Small" : filters.capacity === "medium" ? "Medium" : "Large"}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1"
                  onClick={() => setFilters({ ...filters, capacity: "all" })}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {filters.freeOnly && (
              <div className="flex items-center bg-muted text-sm rounded-full px-3 py-1">
                Free Only
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1"
                  onClick={() => setFilters({ ...filters, freeOnly: false })}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            <Button variant="ghost" size="sm" className="text-sm h-6" onClick={resetFilters}>
              Clear All
            </Button>
          </div>
        )}
      </div>

      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {results.length} {results.length === 1 ? "Result" : "Results"}
            </h2>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No events found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-4">
                We couldn't find any events matching your search criteria. Try adjusting your filters or search term.
              </p>
              <Button onClick={resetFilters}>Clear Filters</Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

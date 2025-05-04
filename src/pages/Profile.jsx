"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import UserProfile from "@/components/profile/user-profile"
import TicketGenerator from "@/components/tickets/ticket-generator"
import { useAuth } from "@/hooks/use-auth.jsx"
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function Profile() {
  const { user } = useAuth()
  const [userEvents, setUserEvents] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch user's events from Firebase
  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!user) return

      try {
        const eventsRef = collection(db, "events")
        const eventsQuery = query(eventsRef, where("attendees", "array-contains", user.uid))
        const eventsSnapshot = await getDocs(eventsQuery)

        const fetchedEvents = []
        eventsSnapshot.forEach((doc) => {
          const eventData = doc.data()
          // Convert Firestore timestamp to JS Date
          const eventDate = eventData.date instanceof Timestamp ? eventData.date.toDate() : new Date(eventData.date)

          fetchedEvents.push({
            id: doc.id,
            ...eventData,
            date: eventDate,
          })
        })

        setUserEvents(fetchedEvents)
      } catch (error) {
        console.error("Error fetching user events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserEvents()
  }, [user])

  // Mock user data for the ticket generator
  const attendee = {
    id: user?.uid || "user123",
    name: user?.displayName || "Guest User",
    email: user?.email || "guest@example.com",
  }

  // Use the first event for the ticket generator
  const event = userEvents[0]

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <UserProfile />
        </TabsContent>

        <TabsContent value="tickets">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>My Tickets</CardTitle>
                <CardDescription>Access and manage your event tickets</CardDescription>
              </CardHeader>
              <CardContent>
                {event ? (
                  <TicketGenerator event={event} attendee={attendee} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">You don't have any tickets yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Events you're attending</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()} • {event.location}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">Confirmed</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Account Preferences</CardTitle>
              <CardDescription>Manage your account settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Privacy Settings</h3>
                <p className="text-sm text-muted-foreground">Manage how your information is displayed and shared</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span>Show my profile to other users</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span>Allow event organizers to contact me</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>Share my attendance with other attendees</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span>Receive event recommendations</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>Allow location-based features</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span>Receive marketing communications</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Language and Region</h3>
                <p className="text-sm text-muted-foreground">Set your preferred language and regional settings</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Language
                      <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Time Zone
                      <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        <option>Pacific Time (PT)</option>
                        <option>Mountain Time (MT)</option>
                        <option>Central Time (CT)</option>
                        <option>Eastern Time (ET)</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Accessibility</h3>
                <p className="text-sm text-muted-foreground">
                  Customize your experience to meet your accessibility needs
                </p>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Enable high contrast mode</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Enable screen reader optimizations</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Reduce animations</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

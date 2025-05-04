"use client"

import DashboardStats from "@/components/analytics/dashboard-stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, Calendar, RefreshCw } from "lucide-react"

export default function Analytics() {
  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold mb-2 md:mb-0">Analytics Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Refresh</span>
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="attendees">Attendees</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <DashboardStats />
        </TabsContent>

        <TabsContent value="events">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Event Performance</CardTitle>
                <CardDescription>Comparison of your top performing events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Tech Conference 2024", attendance: 85 },
                    { name: "Summer Music Festival", attendance: 72 },
                    { name: "Startup Networking Mixer", attendance: 95 },
                    { name: "Design Workshop", attendance: 65 },
                  ].map((event, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{event.name}</span>
                        <span className="text-muted-foreground">{event.attendance}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${event.attendance}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{event.attendance}% attendance rate</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Your scheduled events for the next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Product Launch", date: "May 15, 2024", registrations: 45, capacity: 100 },
                    { name: "Annual Gala", date: "May 22, 2024", registrations: 120, capacity: 200 },
                    { name: "Developer Meetup", date: "June 3, 2024", registrations: 28, capacity: 50 },
                    { name: "Marketing Workshop", date: "June 10, 2024", registrations: 15, capacity: 30 },
                  ].map((event, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{event.name}</h4>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {event.registrations}/{event.capacity}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {Math.round((event.registrations / event.capacity) * 100)}% filled
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendees">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Attendee Demographics</CardTitle>
                <CardDescription>Breakdown of your event attendees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Age Groups</h4>
                    <div className="space-y-2">
                      {[
                        { group: "18-24", percentage: 15 },
                        { group: "25-34", percentage: 40 },
                        { group: "35-44", percentage: 25 },
                        { group: "45-54", percentage: 12 },
                        { group: "55+", percentage: 8 },
                      ].map((item, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{item.group}</span>
                            <span>{item.percentage}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Gender</h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-md bg-primary/10">
                        <div className="text-2xl font-bold">48%</div>
                        <div className="text-xs text-muted-foreground">Male</div>
                      </div>
                      <div className="p-2 rounded-md bg-primary/10">
                        <div className="text-2xl font-bold">45%</div>
                        <div className="text-xs text-muted-foreground">Female</div>
                      </div>
                      <div className="p-2 rounded-md bg-primary/10">
                        <div className="text-2xl font-bold">7%</div>
                        <div className="text-xs text-muted-foreground">Other</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendee Engagement</CardTitle>
                <CardDescription>How attendees interact with your events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Registration Source</h4>
                    <div className="space-y-2">
                      {[
                        { source: "Direct Website", percentage: 35 },
                        { source: "Social Media", percentage: 25 },
                        { source: "Email Campaign", percentage: 20 },
                        { source: "Partner Referral", percentage: 12 },
                        { source: "Other", percentage: 8 },
                      ].map((item, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{item.source}</span>
                            <span>{item.percentage}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Repeat Attendance</h4>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2 rounded-md bg-primary/10">
                        <div className="text-2xl font-bold">65%</div>
                        <div className="text-xs text-muted-foreground">First-time Attendees</div>
                      </div>
                      <div className="p-2 rounded-md bg-primary/10">
                        <div className="text-2xl font-bold">35%</div>
                        <div className="text-xs text-muted-foreground">Returning Attendees</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

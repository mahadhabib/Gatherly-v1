"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth.jsx"

// Mock invitations data
const mockInvitations = [
  {
    id: "1",
    eventId: "1",
    status: "pending",
    invitedBy: "Jane Smith",
    invitedAt: new Date(2024, 4, 5),
  },
  {
    id: "2",
    eventId: "2",
    status: "pending",
    invitedBy: "Mike Johnson",
    invitedAt: new Date(2024, 4, 10),
  },
]

export default function Invitations() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(false)

  const handleAccept = (id) => {
    // Placeholder for accept logic
    console.log(`Accept invitation with id: ${id}`)
    toast({
      title: "Invitation Accepted",
      description: "You have accepted the invitation.",
    })
    setInvitations(
      invitations.map((invitation) => (invitation.id === id ? { ...invitation, status: "accepted" } : invitation)),
    )
  }

  const handleDecline = (id) => {
    // Placeholder for decline logic
    console.log(`Decline invitation with id: ${id}`)
    toast({
      title: "Invitation Declined",
      description: "You have declined the invitation.",
    })
    setInvitations(
      invitations.map((invitation) => (invitation.id === id ? { ...invitation, status: "declined" } : invitation)),
    )
  }

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Invitations</h1>

      {invitations.length > 0 ? (
        <div className="grid gap-6">
          {invitations.map((invitation) => (
            <Card key={invitation.id}>
              <CardHeader>
                <CardTitle>{invitation.event?.title || "Unknown Event"}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {invitation.event?.date ? format(invitation.event.date, "MMMM d, yyyy") : "Date not specified"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You were invited by <span className="font-medium">{invitation.invitedBy}</span> on{" "}
                  {invitation.invitedAt ? format(invitation.invitedAt.toDate(), "MMMM d, yyyy") : "Date not specified"}
                </p>
                <p className="mt-2">{invitation.event?.description || "No description available"}</p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                {invitation.status === "pending" ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => handleDecline(invitation.id)}>
                      <X className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                    <Button size="sm" onClick={() => handleAccept(invitation.id)}>
                      <Check className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                  </>
                ) : (
                  <div
                    className={`text-sm font-medium ${
                      invitation.status === "accepted"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {invitation.status === "accepted" ? "Accepted" : "Declined"}
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">No invitations</h2>
          <p className="text-muted-foreground max-w-md">
            You don't have any pending invitations. When someone invites you to an event, it will appear here.
          </p>
        </div>
      )}
    </div>
  )
}

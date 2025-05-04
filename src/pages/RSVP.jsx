"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import RSVPForm from "@/components/common/RSVPForm"
import { mockEvents } from "@/lib/utils" // Import mockEvents
import { useToast } from "@/hooks/use-toast"

export default function RSVP() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [event, setEvent] = useState(mockEvents.find((event) => event.id === id)) // Use mockEvents
  const [loading, setLoading] = useState(false) // Set loading to false

  // If event not found, show a message
  if (!event) {
    return (
      <div className="container py-12 px-4 md:px-6 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
        <p className="text-muted-foreground">The event you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="container py-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <RSVPForm eventId={id} eventTitle={event.title} />
      </div>
    </div>
  )
}

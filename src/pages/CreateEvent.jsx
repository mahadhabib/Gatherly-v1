"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import MapPicker from "@/components/maps/map-picker"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db } from "@/lib/firebase" // Make sure db is exported from firebase.js

export default function CreateEvent() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    coordinates: null,
    capacity: "",
    image: null,
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === "image" && files.length > 0) {
      setFormData((prev) => ({ ...prev, image: files[0] }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleLocationSelect = (locationData) => {
    setFormData((prev) => ({
      ...prev,
      location: locationData.address,
      coordinates: locationData.coordinates,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Combine date and time
      const eventDateTime = new Date(`${formData.date}T${formData.time}`)

      // Prepare event data
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: eventDateTime,
        location: formData.location,
        coordinates: formData.coordinates,
        capacity: Number.parseInt(formData.capacity),
        attendees: 0,
        createdAt: serverTimestamp(),
      }

      // Upload image if provided
      if (formData.image) {
        const storage = getStorage()
        const imageRef = ref(storage, `event-images/${Date.now()}-${formData.image.name}`)

        const snapshot = await uploadBytes(imageRef, formData.image)
        const imageUrl = await getDownloadURL(snapshot.ref)

        eventData.image = imageUrl
      }

      // Add to Firestore
      const docRef = await addDoc(collection(db, "events"), eventData)

      toast({
        title: "Event Created!",
        description: "Your event has been created successfully.",
      })

      // Redirect to events page
      setTimeout(() => {
        navigate("/events")
      }, 1500)
    } catch (error) {
      console.error("Error creating event:", error)

      toast({
        title: "Error",
        description: "There was an error creating your event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Calendar className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-3xl font-bold">Create a New Event</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Event Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event"
              rows={5}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <MapPicker onLocationSelect={handleLocationSelect} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Maximum number of attendees"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Event Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground">Recommended size: 1200 x 630 pixels</p>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate("/events")}>
              Cancel
            </Button>
            <Button type="submit">Create Event</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

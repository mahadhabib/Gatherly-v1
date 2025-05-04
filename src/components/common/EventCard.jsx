"use client"

import { Link } from "react-router-dom"
import { Calendar, MapPin, Users } from "lucide-react"
import { format } from "date-fns"
import { motion } from "framer-motion" // Added for smooth transitions
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function EventCard({ event }) {
  const { id, title, description, date, location, image, attendees, capacity } = event

  // Check if event is in the past
  const isPastEvent = new Date(date) < new Date()

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
          />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="flex items-center gap-1 text-sm">
            <Calendar className="h-4 w-4" />
            {format(date, "MMMM d, yyyy")}
          </CardDescription>
          <CardDescription className="flex items-center gap-1 text-sm">
            <MapPin className="h-4 w-4" />
            {location}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-2 border-t">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>
              {attendees}/{capacity}
            </span>
          </div>
          <div className="flex gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/events/${id}`}>Details</Link>
              </Button>
            </motion.div>
            {!isPastEvent && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" asChild>
                  <Link to={`/rsvp/${id}`}>RSVP</Link>
                </Button>
              </motion.div>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

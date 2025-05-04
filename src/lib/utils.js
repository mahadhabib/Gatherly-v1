import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function for combining class names (used by shadcn/ui components)
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Mock data for the application
export const mockUsers = [
  {
    id: "user1",
    uid: "user1",
    email: "demo@example.com",
    displayName: "Demo User",
    photoURL: "/placeholder.svg?height=40&width=40",
    bio: "Event enthusiast and community organizer",
    location: "New York, NY",
    joinDate: new Date("2023-01-15"),
    role: "user",
  },
  {
    id: "user2",
    uid: "user2",
    email: "jane@example.com",
    displayName: "Jane Smith",
    photoURL: "/placeholder.svg?height=40&width=40",
    bio: "Professional event planner with 5 years of experience",
    location: "Los Angeles, CA",
    joinDate: new Date("2023-02-20"),
    role: "user",
  },
  {
    id: "admin1",
    uid: "admin1",
    email: "admin@example.com",
    displayName: "Admin User",
    photoURL: "/placeholder.svg?height=40&width=40",
    bio: "System administrator",
    location: "Chicago, IL",
    joinDate: new Date("2023-01-01"),
    role: "admin",
  },
]

export const mockEvents = [
  {
    id: "event1",
    title: "Tech Conference 2023",
    description:
      "A conference bringing together tech enthusiasts and professionals to discuss the latest trends and innovations in technology.",
    date: new Date("2023-12-15T09:00:00"),
    location: "Convention Center, New York",
    image: "/placeholder.svg?height=400&width=600",
    organizerId: "user1",
    organizer: mockUsers.find((user) => user.id === "user1"),
    attendees: 120,
    capacity: 200,
    category: "Technology",
    isPublic: true,
    isPast: false,
    isOrganizer: true,
    status: "approved",
  },
  {
    id: "event2",
    title: "Annual Charity Gala",
    description:
      "An elegant evening to raise funds for local charities supporting education and healthcare initiatives.",
    date: new Date("2023-11-20T18:30:00"),
    location: "Grand Hotel, Boston",
    image: "/placeholder.svg?height=400&width=600",
    organizerId: "user2",
    organizer: mockUsers.find((user) => user.id === "user2"),
    attendees: 85,
    capacity: 150,
    category: "Charity",
    isPublic: true,
    isPast: true,
    isOrganizer: false,
    status: "approved",
  },
  {
    id: "event3",
    title: "Summer Music Festival",
    description:
      "A weekend of live music performances across multiple stages featuring local and international artists.",
    date: new Date("2024-07-10T12:00:00"),
    location: "City Park, Miami",
    image: "/placeholder.svg?height=400&width=600",
    organizerId: "user1",
    organizer: mockUsers.find((user) => user.id === "user1"),
    attendees: 450,
    capacity: 1000,
    category: "Music",
    isPublic: true,
    isPast: false,
    isOrganizer: true,
    status: "pending",
  },
]

export const mockRSVPs = [
  {
    id: "rsvp1",
    eventId: "event1",
    userId: "user2",
    status: "attending",
    guests: 2,
    createdAt: new Date("2023-10-05"),
  },
  {
    id: "rsvp2",
    eventId: "event2",
    userId: "user1",
    status: "attending",
    guests: 1,
    createdAt: new Date("2023-09-15"),
  },
]

export const mockComments = [
  {
    id: "comment1",
    eventId: "event1",
    userId: "user2",
    user: mockUsers.find((user) => user.id === "user2"),
    text: "Looking forward to this event! Will there be networking opportunities?",
    createdAt: new Date("2023-10-10T14:30:00"),
  },
  {
    id: "comment2",
    eventId: "event1",
    userId: "user1",
    user: mockUsers.find((user) => user.id === "user1"),
    text: "Yes, there will be dedicated networking sessions throughout the day.",
    createdAt: new Date("2023-10-10T15:45:00"),
  },
  {
    id: "comment3",
    eventId: "event2",
    userId: "user1",
    user: mockUsers.find((user) => user.id === "user1"),
    text: "The venue looks amazing. Can't wait to attend!",
    createdAt: new Date("2023-09-20T10:15:00"),
  },
]

export const mockNotifications = [
  {
    id: "notif1",
    userId: "user1",
    title: "New RSVP",
    message: "Jane Smith has RSVP'd to your Tech Conference event",
    type: "success",
    read: false,
    date: new Date("2023-10-05T09:30:00"),
  },
  {
    id: "notif2",
    userId: "user1",
    title: "Event Reminder",
    message: "Your Tech Conference event is happening tomorrow",
    type: "reminder",
    read: true,
    date: new Date("2023-12-14T10:00:00"),
  },
  {
    id: "notif3",
    userId: "user1",
    title: "New Comment",
    message: "Jane Smith commented on your Tech Conference event",
    type: "info",
    read: false,
    date: new Date("2023-10-10T15:00:00"),
  },
]

export const mockInvitations = [
  {
    id: "invite1",
    eventId: "event1",
    event: mockEvents.find((event) => event.id === "event1"),
    senderId: "user1",
    sender: mockUsers.find((user) => user.id === "user1"),
    recipientId: "user2",
    recipient: mockUsers.find((user) => user.id === "user2"),
    status: "pending",
    createdAt: new Date("2023-10-01"),
  },
  {
    id: "invite2",
    eventId: "event2",
    event: mockEvents.find((event) => event.id === "event2"),
    senderId: "user2",
    sender: mockUsers.find((user) => user.id === "user2"),
    recipientId: "user1",
    recipient: mockUsers.find((user) => user.id === "user1"),
    status: "accepted",
    createdAt: new Date("2023-09-10"),
  },
]

// Mock user preferences
export const mockUserPreferences = {
  user1: {
    notifications: {
      email: {
        newRsvp: true,
        eventReminders: true,
        messages: true,
        systemUpdates: false,
      },
      push: {
        newRsvp: true,
        eventReminders: true,
        messages: false,
        systemUpdates: false,
      },
      sms: {
        newRsvp: false,
        eventReminders: true,
        messages: false,
        systemUpdates: false,
      },
    },
  },
}

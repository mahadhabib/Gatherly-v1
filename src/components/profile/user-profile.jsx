"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth.jsx"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Facebook, Twitter, Instagram, Linkedin, Globe, MapPin, Briefcase, Calendar, Upload, Plus } from "lucide-react"

export default function UserProfile() {
  const { user, updateUserProfile } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoGallery, setPhotoGallery] = useState([])
  const [newPhoto, setNewPhoto] = useState(null)
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    photoURL: user?.photoURL || "",
    bio: "",
    location: "",
    occupation: "",
    website: "",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setNewPhoto(e.target.files[0])
    }
  }

  const uploadPhoto = async () => {
    if (!newPhoto) return

    try {
      setUploadingPhoto(true)

      // Refresh gallery
      setPhotoGallery((prev) => [...prev, { id: Date.now(), url: URL.createObjectURL(newPhoto) }])

      setNewPhoto(null)
      toast({
        title: "Photo uploaded",
        description: "Your photo has been added to the gallery.",
      })
    } catch (error) {
      console.error("Error uploading photo:", error)
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUploadingPhoto(false)
    }
  }

  const deletePhoto = async (photo) => {
    try {
      // Update state
      setPhotoGallery((prev) => prev.filter((p) => p.id !== photo.id))

      toast({
        title: "Photo deleted",
        description: "The photo has been removed from your gallery.",
      })
    } catch (error) {
      console.error("Error deleting photo:", error)
      toast({
        title: "Delete failed",
        description: "There was a problem deleting the photo.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setIsLoading(true)

    try {
      // Update Firebase Auth profile (only supports displayName and photoURL)
      await updateUserProfile({
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="relative">
          <div className="absolute right-6 top-6">
            {isEditing ? (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
          <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={formData.photoURL || "/placeholder.svg?height=96&width=96"}
                alt={formData.displayName}
              />
              <AvatarFallback>{formData.displayName?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="mt-4 sm:mt-0 text-center sm:text-left">
              <CardTitle className="text-2xl">{formData.displayName}</CardTitle>
              <CardDescription className="max-w-md mt-1">{formData.bio}</CardDescription>
              <div className="flex flex-wrap gap-4 mt-4 justify-center sm:justify-start">
                {formData.location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    {formData.location}
                  </div>
                )}
                {formData.occupation && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Briefcase className="mr-1 h-4 w-4" />
                    {formData.occupation}
                  </div>
                )}
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" />
                  Joined {new Date().toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2 mt-4 justify-center sm:justify-start">
                {formData.website && (
                  <a
                    href={formData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                )}
                {formData.facebook && (
                  <a
                    href={formData.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {formData.twitter && (
                  <a
                    href={formData.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {formData.instagram && (
                  <a
                    href={formData.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {formData.linkedin && (
                  <a
                    href={formData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        {isEditing && (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photoURL">Avatar URL</Label>
                  <Input
                    id="photoURL"
                    name="photoURL"
                    value={formData.photoURL}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    placeholder="Your job title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Social Media</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      placeholder="https://facebook.com/username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      placeholder="https://twitter.com/username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      placeholder="https://instagram.com/username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Events</CardTitle>
          <CardDescription>Events you've created or are hosting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">You haven't created any events yet.</p>
            <Button className="mt-4" asChild>
              <a href="/create-event">Create Your First Event</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Photo Gallery</CardTitle>
            <CardDescription>Photos from events you've attended</CardDescription>
          </div>
          <div>
            <input type="file" id="gallery-upload" className="hidden" accept="image/*" onChange={handlePhotoChange} />
            <label htmlFor="gallery-upload">
              <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </span>
              </Button>
            </label>
            {newPhoto && (
              <Button size="sm" className="ml-2" onClick={uploadPhoto} disabled={uploadingPhoto}>
                {uploadingPhoto ? "Uploading..." : "Add to Gallery"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {photoGallery.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photoGallery.map((photo) => (
                <div key={photo.id} className="group relative aspect-square rounded-md overflow-hidden">
                  <img
                    src={photo.url || "/placeholder.svg"}
                    alt="Gallery photo"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="destructive" size="sm" onClick={() => deletePhoto(photo)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Your gallery is empty.</p>
              <p className="text-sm text-muted-foreground mt-1">Upload photos from events you've attended.</p>
              <label htmlFor="gallery-upload" className="cursor-pointer">
                <Button variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Photo
                </Button>
              </label>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

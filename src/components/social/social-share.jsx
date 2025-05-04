"use client"

import { useState } from "react"
import { Share2, Facebook, Twitter, Linkedin, Mail, Link, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function SocialShare({ event, className }) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const eventUrl = window.location.href
  const eventTitle = event?.title || "Check out this event"
  const eventDescription = event?.description || "I found this great event on Gatherly"

  const shareText = `${eventTitle} - ${eventDescription}`

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(shareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(eventTitle)}&body=${encodeURIComponent(`${eventDescription}\n\n${eventUrl}`)}`,
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl)
    setCopied(true)

    toast({
      title: "Link copied",
      description: "Event link copied to clipboard",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform) => {
    window.open(shareLinks[platform], "_blank")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <Share2 className="mr-2 h-4 w-4" />
          Share Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this event</DialogTitle>
          <DialogDescription>Share this event with your friends and colleagues</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Input value={eventUrl} readOnly className="font-mono text-sm" />
          </div>
          <Button size="sm" className="px-3" onClick={handleCopyLink}>
            {copied ? <Check className="h-4 w-4" /> : <Link className="h-4 w-4" />}
            <span className="sr-only">Copy</span>
          </Button>
        </div>
        <div className="flex justify-center space-x-2 mt-4">
          <Button
            size="icon"
            variant="outline"
            className="rounded-full bg-[#1877F2] hover:bg-[#1877F2]/90 text-white border-none"
            onClick={() => handleShare("facebook")}
          >
            <Facebook className="h-5 w-5" />
            <span className="sr-only">Share on Facebook</span>
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white border-none"
            onClick={() => handleShare("twitter")}
          >
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Share on Twitter</span>
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white border-none"
            onClick={() => handleShare("linkedin")}
          >
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">Share on LinkedIn</span>
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full bg-gray-500 hover:bg-gray-500/90 text-white border-none"
            onClick={() => handleShare("email")}
          >
            <Mail className="h-5 w-5" />
            <span className="sr-only">Share via Email</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

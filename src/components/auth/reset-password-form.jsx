"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth.jsx"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function ResetPasswordForm() {
  const { resetPassword } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await resetPassword(email)
      setIsSubmitted(true)
      toast({
        title: "Reset email sent",
        description: "Check your email for a link to reset your password.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
          <div className="text-center text-sm">
            Remember your password?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Back to login
            </Link>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg bg-primary/10 p-4 text-center">
            <p className="text-sm">
              We've sent a password reset link to <strong>{email}</strong>. Please check your email.
            </p>
          </div>
          <Button asChild className="w-full">
            <Link to="/login">Back to Login</Link>
          </Button>
        </div>
      )}
    </>
  )
}

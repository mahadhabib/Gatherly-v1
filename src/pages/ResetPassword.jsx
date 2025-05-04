"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth.jsx"
import ResetPasswordForm from "@/components/auth/reset-password-form"
import { Calendar } from "lucide-react"

export default function ResetPassword() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate("/dashboard")
    }
  }, [user, navigate])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Calendar className="h-12 w-12 text-primary" />
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground">Enter your email to receive a password reset link</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  )
}

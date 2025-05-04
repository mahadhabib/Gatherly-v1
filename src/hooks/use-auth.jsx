"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Mock user data
const mockUser = {
  uid: "mock-user-123",
  email: "user@example.com",
  displayName: "Demo User",
  photoURL: "/placeholder.svg?height=40&width=40",
}

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate auth loading
    const timer = setTimeout(() => {
      // Check if user is stored in localStorage
      const storedUser = localStorage.getItem("mockUser")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const signup = async (email, password) => {
    try {
      // Simulate signup delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newUser = {
        ...mockUser,
        email,
        displayName: email.split("@")[0],
      }

      setUser(newUser)
      localStorage.setItem("mockUser", JSON.stringify(newUser))

      return { user: newUser }
    } catch (error) {
      console.error("Error signing up:", error)
      throw new Error("Failed to sign up")
    }
  }

  const login = async (email, password) => {
    try {
      // Simulate login delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const loggedInUser = {
        ...mockUser,
        email,
      }

      setUser(loggedInUser)
      localStorage.setItem("mockUser", JSON.stringify(loggedInUser))

      return { user: loggedInUser }
    } catch (error) {
      console.error("Error logging in:", error)
      throw new Error("Failed to log in")
    }
  }

  const logout = async () => {
    try {
      // Simulate logout delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      setUser(null)
      localStorage.removeItem("mockUser")
    } catch (error) {
      console.error("Error logging out:", error)
      throw new Error("Failed to log out")
    }
  }

  const resetPassword = async (email) => {
    try {
      // Simulate password reset delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      return true
    } catch (error) {
      console.error("Error resetting password:", error)
      throw new Error("Failed to reset password")
    }
  }

  const updateUserProfile = async (profile) => {
    try {
      // Simulate update delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedUser = {
        ...user,
        ...profile,
      }

      setUser(updatedUser)
      localStorage.setItem("mockUser", JSON.stringify(updatedUser))

      return true
    } catch (error) {
      console.error("Error updating profile:", error)
      throw new Error("Failed to update profile")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        resetPassword,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

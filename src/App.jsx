"use client"

import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { useAuth } from "@/hooks/use-auth.jsx"
import { AnimatePresence, motion } from "framer-motion" // Added for smooth transitions
import { ErrorBoundary } from "react-error-boundary"

// Layout components
import Navbar from "@/components/common/Navbar"
import Footer from "@/components/common/Footer"
import DashboardLayout from "@/components/layout/dashboard-layout"

// Pages
import Home from "@/pages/Home"
import Events from "@/pages/Events"
import EventDetails from "@/pages/EventDetails"
import CreateEvent from "@/pages/CreateEvent"
import RSVP from "@/pages/RSVP"
import Dashboard from "@/pages/Dashboard"
import NotFound from "@/pages/NotFound"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import ResetPassword from "@/pages/ResetPassword"
import Settings from "@/pages/Settings"
import Invitations from "@/pages/Invitations"
import Notifications from "@/pages/Notifications"
import Profile from "@/pages/Profile"
import Analytics from "@/pages/Analytics"
import Search from "@/pages/Search"

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  out: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { state: { from: location } })
    }
  }, [user, loading, navigate, location])

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>

  return user ? children : null
}

// Animated page wrapper
const AnimatedPage = ({ children }) => (
  <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="flex-1">
    {children}
  </motion.div>
)

function ErrorFallback({ error }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong:</h2>
      <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-w-full">{error.message}</pre>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => window.location.reload()}
      >
        Reload page
      </button>
    </div>
  )
}

function App() {
  const location = useLocation()

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider defaultTheme="light" storageKey="gatherly-theme">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public routes */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <AnimatedPage>
                    <Home />
                  </AnimatedPage>
                  <Footer />
                </>
              }
            />
            <Route
              path="/events"
              element={
                <>
                  <Navbar />
                  <AnimatedPage>
                    <Events />
                  </AnimatedPage>
                  <Footer />
                </>
              }
            />
            <Route
              path="/events/:id"
              element={
                <>
                  <Navbar />
                  <AnimatedPage>
                    <EventDetails />
                  </AnimatedPage>
                  <Footer />
                </>
              }
            />
            <Route
              path="/rsvp/:id"
              element={
                <>
                  <Navbar />
                  <AnimatedPage>
                    <RSVP />
                  </AnimatedPage>
                  <Footer />
                </>
              }
            />
            <Route
              path="/search"
              element={
                <>
                  <Navbar />
                  <AnimatedPage>
                    <Search />
                  </AnimatedPage>
                  <Footer />
                </>
              }
            />

            {/* Auth routes */}
            <Route
              path="/login"
              element={
                <AnimatedPage>
                  <Login />
                </AnimatedPage>
              }
            />
            <Route
              path="/register"
              element={
                <AnimatedPage>
                  <Register />
                </AnimatedPage>
              }
            />
            <Route
              path="/reset-password"
              element={
                <AnimatedPage>
                  <ResetPassword />
                </AnimatedPage>
              }
            />

            {/* Protected dashboard routes */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/invitations" element={<Invitations />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/my-events" element={<Dashboard />} />
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App

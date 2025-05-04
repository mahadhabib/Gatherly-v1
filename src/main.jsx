"use client"

import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./index.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/hooks/use-auth.jsx"

// Error handling for React rendering
const renderApp = () => {
  try {
    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <ErrorBoundary>
          <AuthProvider>
            <BrowserRouter>
              <App />
              <Toaster />
            </BrowserRouter>
          </AuthProvider>
        </ErrorBoundary>
      </React.StrictMode>,
    )
    console.log("App rendered successfully")
  } catch (error) {
    console.error("Failed to render app:", error)
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h1>Something went wrong</h1>
        <p>Error: ${error.message}</p>
        <button onclick="location.reload()">Reload</button>
      </div>
    `
  }
}

// Simple error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("React error boundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h1>Something went wrong</h1>
          <p>Error: {this.state.error?.message || "Unknown error"}</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      )
    }

    return this.props.children
  }
}

renderApp()

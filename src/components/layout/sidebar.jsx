"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Calendar,
  Home,
  Users,
  PlusCircle,
  Settings,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  BarChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth.jsx"
import { cn } from "@/lib/utils"

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const isActive = (path) => {
    return location.pathname === path
  }

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "My Events", path: "/my-events", icon: Calendar },
    { name: "Create Event", path: "/create-event", icon: PlusCircle },
    { name: "Invitations", path: "/invitations", icon: Users },
    { name: "Notifications", path: "/notifications", icon: Bell },
    { name: "Search", path: "/search", icon: Search },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Analytics", path: "/analytics", icon: BarChart },
    { name: "Settings", path: "/settings", icon: Settings },
  ]

  return (
    <div
      className={cn(
        "h-screen bg-background border-r transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-4 flex items-center justify-between border-b">
        {!collapsed && (
          <Link to="/" className="flex items-center">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="ml-2 font-bold">Gatherly</span>
          </Link>
        )}
        {collapsed && <Calendar className="h-6 w-6 text-primary mx-auto" />}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={collapsed ? "mx-auto" : ""}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-2 py-2 rounded-md text-sm font-medium transition-colors",
                isActive(item.path)
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className={cn("w-full justify-start text-muted-foreground", collapsed && "justify-center")}
          onClick={logout}
        >
          <LogOut className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  )
}

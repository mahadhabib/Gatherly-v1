"use client"

import { Outlet } from "react-router-dom"
import { motion } from "framer-motion" // Added for smooth transitions
import Navbar from "@/components/common/Navbar"
import Sidebar from "@/components/layout/sidebar"

// Animation variants for dashboard content
const contentVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
}

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar isDashboard={true} />
        <motion.main
          className="flex-1 overflow-auto p-4"
          initial="initial"
          animate="animate"
          variants={contentVariants}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  )
}

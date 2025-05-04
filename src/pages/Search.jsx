"use client"

import AdvancedSearch from "@/components/search/advanced-search"

export default function Search() {
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Find Events</h1>
      <AdvancedSearch />
    </div>
  )
}

"use client"

import { useEffect, useRef } from "react"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import { MapPin } from "lucide-react"

const containerStyle = {
  width: "100%",
  height: "250px",
}

export default function LocationDisplay({ location, address }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY",
  })

  const mapRef = useRef(null)

  // Default to San Francisco if no location provided
  const center = location || {
    lat: 37.7749,
    lng: -122.4194,
  }

  useEffect(() => {
    if (mapRef.current && location) {
      mapRef.current.panTo(location)
    }
  }, [location])

  if (!isLoaded) return <div className="p-4 text-center">Loading map...</div>

  return (
    <div className="space-y-2">
      <div className="flex items-center text-muted-foreground">
        <MapPin className="h-5 w-5 mr-2" />
        <span>{address || "Location not specified"}</span>
      </div>
      <div className="rounded-md overflow-hidden border">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            scrollwheel: false,
          }}
          onLoad={(map) => {
            mapRef.current = map
          }}
        >
          {location && <Marker position={location} />}
        </GoogleMap>
      </div>
    </div>
  )
}

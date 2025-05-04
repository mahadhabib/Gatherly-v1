"use client"

import { useState, useCallback, useRef } from "react"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const containerStyle = {
  width: "100%",
  height: "300px",
}

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
}

export default function MapPicker({ onLocationSelect, initialLocation = null }) {
  const [marker, setMarker] = useState(initialLocation)
  const [address, setAddress] = useState("")
  const mapRef = useRef(null)
  const geocoderRef = useRef(null)

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY",
    libraries: ["places"],
  })

  const onMapLoad = useCallback((map) => {
    mapRef.current = map
    if (window.google) {
      geocoderRef.current = new window.google.maps.Geocoder()
    }
  }, [])

  const handleMapClick = useCallback(
    (e) => {
      if (!geocoderRef.current) return

      const location = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      }
      setMarker(location)

      // Get address from coordinates
      geocoderRef.current.geocode({ location }, (results, status) => {
        if (status === "OK" && results[0]) {
          setAddress(results[0].formatted_address)
          onLocationSelect({
            address: results[0].formatted_address,
            coordinates: location,
          })
        }
      })
    },
    [onLocationSelect],
  )

  const searchAddress = () => {
    if (!address || !geocoderRef.current) return

    geocoderRef.current.geocode({ address }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location
        const coordinates = {
          lat: location.lat(),
          lng: location.lng(),
        }

        setMarker(coordinates)
        mapRef.current.panTo(coordinates)
        onLocationSelect({
          address,
          coordinates,
        })
      }
    })
  }

  if (!isLoaded) return <div className="p-4 text-center">Loading maps...</div>

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-grow">
          <Label htmlFor="address">Search Address</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter an address"
          />
        </div>
        <div className="flex items-end">
          <Button type="button" onClick={searchAddress}>
            Search
          </Button>
        </div>
      </div>

      <div className="rounded-md overflow-hidden border">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={marker || defaultCenter}
          zoom={marker ? 15 : 10}
          onClick={handleMapClick}
          onLoad={onMapLoad}
        >
          {marker && <Marker position={marker} />}
        </GoogleMap>
      </div>

      {marker && <p className="text-sm text-muted-foreground">Selected location: {address}</p>}
    </div>
  )
}

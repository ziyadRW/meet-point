import React, { useRef, useEffect } from 'react'
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api'
import { FaMapMarkerAlt } from 'react-icons/fa'

const libraries = ['places']

export default function LocationInput({ onSelectLocation, disabled }) {
  const autocompleteRef = useRef(null)
  const inputRef = useRef(null)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  })

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace()
    if (place.geometry) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address,
      }
      onSelectLocation(location)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [])

  return (
    <div className="relative w-full">
      {isLoaded ? (
        <Autocomplete
          onLoad={(autocomplete) => {
            autocompleteRef.current = autocomplete
          }}
          onPlaceChanged={handlePlaceChanged}
        >
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for a location"
              disabled={disabled}
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </Autocomplete>
      ) : (
        <p className="text-gray-500">Loading map...</p>
      )}
    </div>
  )
}


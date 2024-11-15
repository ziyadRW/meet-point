import React, { useState } from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'
import { FaTrash, FaMapMarkerAlt, FaMapMarkedAlt } from 'react-icons/fa'
import axios from 'axios'

export default function LocationList({ locations, setLocations }) {
  const [viewingLocationIndex, setViewingLocationIndex] = useState(null)

  const handleRemove = (index) => {
    setLocations(locations.filter((_, i) => i !== index))
  }

  const handleMapClick = async (index, event) => {
    const lat = event.latLng.lat()
    const lng = event.latLng.lng()
    const updatedLocations = [...locations]
    updatedLocations[index] = { ...updatedLocations[index], lat, lng }
    setLocations(updatedLocations)

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      )
      if (response.data.results.length > 0) {
        const address = response.data.results[0].formatted_address
        updatedLocations[index] = { ...updatedLocations[index], address }
        setLocations(updatedLocations)
      }
    } catch (error) {
      console.error('Error fetching updated address:', error)
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Locations:</h3>
      {locations.map((location, index) => (
        <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
          <p className="flex items-center text-gray-700">
            <FaMapMarkerAlt className="mr-2 text-blue-600" />
            Person {index + 1} - Address: {location.address}
          </p>
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => handleRemove(index)}
              className="text-red-500 hover:text-red-700 flex items-center transition duration-150 ease-in-out"
            >
              <FaTrash className="mr-1" /> Remove
            </button>
            <button
              onClick={() =>
                setViewingLocationIndex(viewingLocationIndex === index ? null : index)
              }
              className="text-blue-600 hover:text-blue-800 flex items-center transition duration-150 ease-in-out"
            >
              <FaMapMarkedAlt className="mr-1" />
              {viewingLocationIndex === index ? 'Hide Map' : 'View & Edit on Map'}
            </button>
          </div>
          {viewingLocationIndex === index && (
            <div className="w-full mt-4 h-64 rounded-lg overflow-hidden">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={{ lat: location.lat, lng: location.lng }}
                zoom={12}
                onClick={(event) => handleMapClick(index, event)}
              >
                <Marker position={{ lat: location.lat, lng: location.lng }} />
              </GoogleMap>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
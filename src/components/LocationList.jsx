import React, { useState } from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'
import { FaTrash, FaMapMarkerAlt, FaMapMarkedAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import axios from 'axios'

export default function LocationList({ locations, setLocations }) {
  const [viewingLocationIndex, setViewingLocationIndex] = useState(null)
  const [expandedLocationIndex, setExpandedLocationIndex] = useState(null)

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

  const handleNameChange = (index, name) => {
    const updatedLocations = [...locations]
    updatedLocations[index] = { ...updatedLocations[index], name }
    setLocations(updatedLocations)
  }

  const handleEmailChange = (index, email) => {
    const updatedLocations = [...locations]
    updatedLocations[index] = { ...updatedLocations[index], email }
    setLocations(updatedLocations)
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Locations:</h3>
      {locations.map((location, index) => (
        <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2 text-blue-600" />
              <input
                type="text"
                value={location.name || `Person ${index + 1}`}
                onChange={(e) => handleNameChange(index, e.target.value)}
                className="font-medium bg-transparent border-none focus:border focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />


            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleRemove(index)}
                className="text-red-500 hover:text-red-700 transition duration-150 ease-in-out"
              >
                <FaTrash />
              </button>
              <button
                onClick={() => setExpandedLocationIndex(expandedLocationIndex === index ? null : index)}
                className="text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out"
              >
                {expandedLocationIndex === index ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
          </div>
          {expandedLocationIndex === index && (
            <div className="mt-4 space-y-4">
              <p className="text-gray-700">{location.address}</p>
              <input
                type="email"
                value={location.email || ''}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                placeholder="Enter email"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setViewingLocationIndex(viewingLocationIndex === index ? null : index)}
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
          )}
        </div>
      ))}
    </div>
  )
}
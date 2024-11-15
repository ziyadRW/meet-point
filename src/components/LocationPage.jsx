import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaSearch, FaUsers, FaMapMarkerAlt } from 'react-icons/fa'
import LocationInput from './LocationInput'
import LocationList from './LocationList'
import MidpointCalculator from './MidpointCalculator'

export default function LocationPage({
  locations,
  setLocations,
  peopleCount,
  setPeopleCount,
  setMidpoint,
  keyword,
  setKeyword,
}) {
  const navigate = useNavigate()
  const [midpointAddress, setMidpointAddress] = useState('')

  useEffect(() => {
    if (locations.length === peopleCount && peopleCount > 0) {
      const midpointCoords = MidpointCalculator(locations)
      setMidpoint(midpointCoords)
      fetchMidpointAddress(midpointCoords)
    }
  }, [locations, peopleCount, setMidpoint])

  const handlePeopleCountChange = (e) => {
    const value = Number(e.target.value)
    if (value <= 100) {
      setPeopleCount(value)
    }
  }

  const handleLocationSelect = (location) => {
    setLocations((prevLocations) => [...prevLocations, location])
  }

  const fetchMidpointAddress = async (coords) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      )
      if (response.data.results.length > 0) {
        const addressComponents = response.data.results[0].address_components
        const city = addressComponents.find((component) =>
          component.types.includes('administrative_area_level_1')
        )
        const district = addressComponents.find((component) =>
          component.types.includes('sublocality_level_1')
        )
        setMidpointAddress(
          `${district ? district.long_name : ''}, ${city ? city.long_name : ''}`
        )
      }
    } catch (error) {
      console.error('Error fetching midpoint address:', error)
    }
  }

  const handleSearchSubmit = () => {
    if (keyword.trim() !== '') {
      navigate('/results')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-sm rounded-xl p-8 mb-8">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8">Enter Meetup Details</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-[20%]">
            <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              min="1"
              max="100"
              value={peopleCount}
              onChange={handlePeopleCountChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="People"
            />
          </div>
          <div className="relative w-[80%]">
            <LocationInput
              onSelectLocation={handleLocationSelect}
              disabled={locations.length === peopleCount}
            />
          </div>
        </div>

        <LocationList locations={locations} setLocations={setLocations} />

        {locations.length < peopleCount && peopleCount > 0 && (
          <p className="text-sm text-gray-600 mt-4">
            Remaining locations to enter: {peopleCount - locations.length}
          </p>
        )}

        {locations.length === peopleCount && peopleCount > 0 && (
          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Approximate Meetpoint:</h3>
            <p className="text-lg text-gray-700">
              {midpointAddress ? midpointAddress : 'Calculating midpoint address...'}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Enter keyword (e.g., coffee shop)"
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearchSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <FaSearch className="inline-block mr-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

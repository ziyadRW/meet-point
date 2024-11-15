import React, { useState } from 'react'
import { FaFilter } from 'react-icons/fa'

export default function FilterPanel({ setPlaces }) {
  const [filters, setFilters] = useState({
    rating: '',
    priceLevel: '',
  })

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value })
  }

  const applyFilters = () => {
    setPlaces((prevPlaces) => {
      return prevPlaces.filter((place) => {
        const meetsRating = filters.rating ? place.rating >= filters.rating : true
        const meetsPriceLevel = filters.priceLevel
          ? place.price_level === parseInt(filters.priceLevel)
          : true
        return meetsRating && meetsPriceLevel
      })
    })
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FaFilter className="mr-2 text-blue-600" />
        Filter Results
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating:</label>
          <input
            type="number"
            name="rating"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.rating}
            onChange={handleFilterChange}
            placeholder="Minimum Rating"
            min="0"
            max="5"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price Level:</label>
          <select
            name="priceLevel"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.priceLevel}
            onChange={handleFilterChange}
          >
            <option value="">Any</option>
            <option value="0">Free</option>
            <option value="1">Inexpensive</option>
            <option value="2">Moderate</option>
            <option value="3">Expensive</option>
            <option value="4">Very Expensive</option>
          </select>
        </div>
      </div>
      <button
        className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        onClick={applyFilters}
      >
        Apply Filters
      </button>
    </div>
  )
}
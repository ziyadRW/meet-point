import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';

function FilterPanel({ setPlaces }) {
  const [filters, setFilters] = useState({
    rating: '',
    priceLevel: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    setPlaces((prevPlaces) => {
      return prevPlaces.filter((place) => {
        const meetsRating = filters.rating ? place.rating >= filters.rating : true;
        const meetsPriceLevel = filters.priceLevel ? place.price_level === parseInt(filters.priceLevel) : true;
        return meetsRating && meetsPriceLevel;
      });
    });
  };

  return (
    <div className="filter-panel mb-6 p-4 border rounded-lg shadow-sm bg-white">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <FaFilter className="mr-2 text-primary" />
        Filter Results
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Rating:</label>
          <input
            type="number"
            name="rating"
            className="w-full p-2 border rounded-lg"
            value={filters.rating}
            onChange={handleFilterChange}
            placeholder="Minimum Rating"
          />
        </div>
        <div>
          <label className="block mb-2">Price Level:</label>
          <input
            type="number"
            name="priceLevel"
            className="w-full p-2 border rounded-lg"
            value={filters.priceLevel}
            onChange={handleFilterChange}
            placeholder="Price Level (0-4)"
          />
        </div>
      </div>
      <button
        className="bg-primary text-white px-4 py-2 rounded-lg mt-4 hover:bg-primary-dark"
        onClick={applyFilters}
      >
        Apply Filters
      </button>
    </div>
  );
}

export default FilterPanel;

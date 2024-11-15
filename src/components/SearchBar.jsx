import React, { useState } from 'react';
import axios from 'axios';

function SearchBar({ midpoint, setPlaces }) {
  const [keyword, setKeyword] = useState('');

  const handleSearch = async () => {
    try {
      // Update the API call to your backend proxy server
      const response = await axios.get(
        `http://localhost:3001/api/places`, // Your backend proxy endpoint
        {
          params: {
            query: keyword,
            location: `${midpoint.lat},${midpoint.lng}`,
            radius: 5000,
          },
        }
      );
      setPlaces(response.data.results);
    } catch (error) {
      console.error("Error fetching places: ", error);
    }
  };

  return (
    <div className="my-4 flex justify-center">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Enter keyword (e.g., coffee shop)"
        className="p-2 border border-gray-300 rounded-lg w-4/5"
      />
      <button
        onClick={handleSearch}
        className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Search Places
      </button>
    </div>
  );
}

export default SearchBar;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ResultsList from './ResultsList';

function ResultsPage({ midpoint, keyword, setKeyword }) {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    if (keyword) {
      handleSearch(keyword);
    }
  }, [keyword]);

  const handleSearch = async (searchKeyword = keyword) => {
    if (!midpoint) return;

    try {
      const response = await axios.get('http://localhost:3001/api/places', {
        params: {
          query: searchKeyword,
          location: `${midpoint.lat},${midpoint.lng}`,
          radius: 5000,
        },
      });
      setPlaces(response.data.results);
    } catch (error) {
      console.error('Error fetching places: ', error);
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/')}
        className="mb-4 text-blue-500 underline"
      >
        &larr; Back to Location Page
      </button>
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter keyword to search (e.g. coffee shop)"
          className="border p-2 w-full"
        />
        <button
          onClick={() => handleSearch()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Search Places
        </button>
      </div>
      <ResultsList places={places} />
    </div>
  );
}

export default ResultsPage;

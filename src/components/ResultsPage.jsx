import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ResultsList from './ResultsList';

function ResultsPage() {
  const [keyword, setKeyword] = useState('');
  const [places, setPlaces] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const midpoint = location.state?.midpoint;

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/places', {
        params: {
          query: keyword,
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
          onClick={handleSearch}
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

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ResultsList from './ResultsList';
import { FaSort } from 'react-icons/fa';

function ResultsPage({ midpoint, keyword, setKeyword }) {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [sortOption, setSortOption] = useState('nearest');
  const [filters, setFilters] = useState({});

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
      let fetchedPlaces = response.data.results;

      fetchedPlaces = sortPlaces(fetchedPlaces, sortOption);

      setPlaces(fetchedPlaces);
    } catch (error) {
      console.error('Error fetching places: ', error);
    }
  };

  const sortPlaces = (places, option) => {
    if (option === 'nearest') {
      return [...places].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    } else if (option === 'highest_rating') {
      return [...places].sort((a, b) => b.rating - a.rating);
    } else {
      return places;
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setPlaces(sortPlaces(places, e.target.value));
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/')}
        className="mb-4 text-primary flex items-center"
      >
        &larr; Back to Location Page
      </button>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="flex items-center space-x-4 mb-4 md:mb-0 w-full md:w-2/3">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter keyword to search (e.g. coffee shop)"
            className="border p-2 w-full rounded-lg"
          />
        </div>

        <div className="flex items-center space-x-4 w-full md:w-1/3">
          <label className="font-bold flex items-center">
            <FaSort className="mr-0 ml-7 text-primary" />
          </label>
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="border ml-0 p-2 rounded-lg"
          >
            <option value="nearest">Nearest to midpoint</option>
            <option value="highest_rating">Highest Rating</option>
          </select>
        </div>
      </div>

      <ResultsList places={places} />
    </div>
  );
}

export default ResultsPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ResultsList from './ResultsList';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';

export default function ResultsPage({ midpoint, keyword, setKeyword, onPlaceSelect }) {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [sortOption, setSortOption] = useState('highest_rating');
  const [selectedPlace, setSelectedPlace] = useState(null);

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

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    onPlaceSelect(place);
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-6 relative">
      <button
        onClick={() => navigate('/')}
        className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium mb-6"
      >
        <FaArrowLeft className="mr-2 h-4 w-4" />
        Back to Location Page
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center">Choose meet Place</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter keyword to search"
          className="w-full sm:w-[280px] px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="w-full sm:w-[200px] px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
        >
          <option value="nearest">Nearest to midpoint</option>
          <option value="highest_rating">Highest Rating</option>
        </select>
      </div>

      <ResultsList
        places={places}
        onPlaceSelect={handlePlaceSelect}
        selectedPlace={selectedPlace}
      />

{selectedPlace && (
  <button
    onClick={() => navigate('/invite')}
    className="fixed bottom-10 right-10 px-6 py-3 m-8 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out animate-bounce flex items-center gap-2"
  >
    <FaPaperPlane className="h-5 w-5" />
    Send Invitation
  </button>
)}
    </div>
  );
}

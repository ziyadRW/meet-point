import React, { useEffect, useState } from 'react';
import LocationInput from './LocationInput';
import LocationList from './LocationList';
import MidpointCalculator from './MidpointCalculator';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaArrowLeft, FaUsers } from 'react-icons/fa';

function LocationPage({
  locations,
  setLocations,
  peopleCount,
  setPeopleCount,
  setMidpoint,
  keyword,
  setKeyword,
}) {
  const navigate = useNavigate();
  const [midpointAddress, setMidpointAddress] = useState('');

  useEffect(() => {
    if (locations.length === peopleCount && peopleCount > 0) {
      const midpointCoords = MidpointCalculator(locations);
      setMidpoint(midpointCoords);
      fetchMidpointAddress(midpointCoords);
    }
  }, [locations, peopleCount, setMidpoint]);


  const handlePeopleCountChange = (e) => {
    const value = Number(e.target.value);
    if (value <= 100) {
      setPeopleCount(value);
      }};

  const handleLocationSelect = (location) => {
    setLocations((prevLocations) => [...prevLocations, location]);
  };

  const fetchMidpointAddress = async (coords) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      if (response.data.results.length > 0) {
        const addressComponents = response.data.results[0].address_components;
        const city = addressComponents.find((component) =>
          component.types.includes('administrative_area_level_1')
        );
        const district = addressComponents.find((component) =>
          component.types.includes('sublocality_level_1')
        );
        setMidpointAddress(
          `${district ? district.long_name : ''}, ${city ? city.long_name : ''}`
        );
      }
    } catch (error) {
      console.error('Error fetching midpoint address:', error);
    }
  };

  const handleSearchSubmit = () => {
    if (keyword.trim() !== '') {
      navigate('/results');
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl text-center">
      <h1 className="text-4xl font-bold mb-6 text-primary">MeetPoint - Meetup Organizer App</h1>
      <div className="flex items-center gap-4 justify-center mb-6">
      <div className="relative w-1/4">
        <FaUsers className="absolute left-3 top-3 text-primary" />
        <input
          type="number"
          min="1"
          value={peopleCount}
          onChange={handlePeopleCountChange}
          className="w-full p-2 pl-10 border border-gray-300 rounded-lg"
          placeholder="Number of people"
        />
      </div>
      <div className="relative w-full">
        <LocationInput onSelectLocation={handleLocationSelect} />
      </div>
    </div>

      <LocationList locations={locations} setLocations={setLocations} />

      {locations.length < peopleCount && peopleCount > 0 && (
        <p className="mt-4 text-gray-500">
          Remaining locations to enter: {peopleCount - locations.length}
        </p>
      )}

      {locations.length === peopleCount && peopleCount > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold">Approximate Meetpoint:</h2>
          <p className="text-lg">
            {midpointAddress ? midpointAddress : 'Calculating midpoint address...'}
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter keyword (e.g., coffee shop)"
              className="p-2 border border-gray-300 rounded-lg w-3/4"
            />
            <button
              onClick={handleSearchSubmit}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
              <FaSearch className="mr-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationPage;

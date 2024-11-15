import React, { useState } from 'react';
import LocationInput from './components/LocationInput';
import LocationList from './components/LocationList';
import SearchBar from './components/SearchBar';
import MidpointCalculator from './components/MidpointCalculator';
import { useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';

const libraries = ['places'];

function App() {
  const [peopleCount, setPeopleCount] = useState(0);
  const [locations, setLocations] = useState([]);
  const [midpoint, setMidpoint] = useState(null);
  const [places, setPlaces] = useState([]);
  const [midpointAddress, setMidpointAddress] = useState('');

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const handlePeopleCountChange = (e) => {
    const count = Number(e.target.value);
    setPeopleCount(count);
  };

  const handleLocationSelect = (location) => {
    const updatedLocations = [...locations, location];
    setLocations(updatedLocations);

    // Calculate midpoint if all locations are added
    if (updatedLocations.length === peopleCount) {
      const midpointCoords = MidpointCalculator(updatedLocations);
      setMidpoint(midpointCoords);
      fetchMidpointAddress(midpointCoords);
    }
  };

  const fetchMidpointAddress = async (coords) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      if (response.data.results.length > 0) {
        setMidpointAddress(response.data.results[0].formatted_address);
      }
    } catch (error) {
      console.error('Error fetching midpoint address:', error);
    }
  };

  return (
    <div className="App p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">MeetPoint - Meetup Organizer App</h1>
      <div className="flex items-center gap-4 mb-6">
        <input
          type="number"
          min="1"
          value={peopleCount}
          onChange={handlePeopleCountChange}
          className="w-1/5 p-2 border border-gray-300 rounded-lg"
          placeholder="Number of people"
        />
        {isLoaded && <LocationInput onSelectLocation={handleLocationSelect} />}
      </div>
      {isLoaded && <LocationList locations={locations} setLocations={setLocations} />}

      {locations.length < peopleCount && (
        <p className="mt-4 text-gray-500">Remaining locations to enter: {peopleCount - locations.length}</p>
      )}

      {midpoint && (
        <>
          <h2 className="text-2xl font-bold mt-8">Approximate Meetpoint:</h2>
          <p className="text-lg mb-4">
            {midpointAddress ? midpointAddress : `Latitude: ${midpoint.lat}, Longitude: ${midpoint.lng}`}
          </p>
          <SearchBar midpoint={midpoint} setPlaces={setPlaces} />
        </>
      )}

      {places.length > 0 && (
        <div className="mt-6">
          <h3 className="text-2xl font-bold mb-4">Nearby Places:</h3>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {places.map((place, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-lg">
                <h4 className="font-bold text-xl mb-2">{place.name}</h4>
                <p>Rating: {place.rating}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat},${place.geometry.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View on Google Maps
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

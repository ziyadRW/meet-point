import React, { useState } from 'react';
import LocationSelector from './LocationSelector';
import LocationList from './LocationList';
import { useNavigate } from 'react-router-dom';

function LocationPage() {
  const [peopleCount, setPeopleCount] = useState(0);
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  const handlePeopleCountChange = (e) => {
    setPeopleCount(Number(e.target.value));
  };

  const handleLocationSelect = (location, address) => {
    setLocations([...locations, { location, address }]);
  };

  const handleProceedToSearch = () => {
    navigate('/results', { state: { midpoint: calculateMidpoint() } });
  };

  const calculateMidpoint = () => {
    const latitudes = locations.map(loc => loc.location.lat);
    const longitudes = locations.map(loc => loc.location.lng);
    const midpointLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
    const midpointLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
    return { lat: midpointLat, lng: midpointLng };
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">MeetPoint - Meetup Organizer App</h1>
      <div className="flex space-x-4 mb-4">
        <input
          type="number"
          value={peopleCount}
          onChange={handlePeopleCountChange}
          placeholder="Enter number of people"
          className="border p-2 w-1/5"
        />
        <LocationSelector
          onSelectLocation={handleLocationSelect}
          disabled={locations.length >= peopleCount}
        />
      </div>
      <LocationList locations={locations} setLocations={setLocations} />
      {locations.length === peopleCount && (
        <button
          onClick={handleProceedToSearch}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Proceed to Search for Places
        </button>
      )}
    </div>
  );
}

export default LocationPage;

import React, { useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

function LocationList({ locations, setLocations }) {
  const [viewingLocationIndex, setViewingLocationIndex] = useState(null);

  const handleRemove = (index) => {
    const updatedLocations = locations.filter((_, i) => i !== index);
    setLocations(updatedLocations);
  };

  return (
    <div className="mt-4">
      <h3 className="text-2xl font-bold mb-4">Current Locations:</h3>
      {locations.length === 0 ? (
        <p>No locations added yet.</p>
      ) : (
        locations.map((location, index) => (
          <div key={index} className="flex flex-col justify-between items-start mb-4 p-4 border rounded-md">
            <p>Person {index + 1} - Lat: {location.lat}, Lng: {location.lng}</p>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => handleRemove(index)}
                className="text-red-500 underline"
              >
                Remove
              </button>
              <button
                className="text-blue-500 underline"
                onClick={() => setViewingLocationIndex(viewingLocationIndex === index ? null : index)}
              >
                {viewingLocationIndex === index ? 'Hide Map' : 'View & Edit on Map'}
              </button>
            </div>
            {viewingLocationIndex === index && (
              <div className="w-full mt-4">
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '300px' }}
                  center={location}
                  zoom={12}
                >
                  <Marker position={location} />
                </GoogleMap>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default LocationList;

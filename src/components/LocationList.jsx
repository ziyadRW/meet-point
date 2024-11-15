import React, { useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { FaTrash, FaMapMarkerAlt, FaMapMarkedAlt } from 'react-icons/fa';
import axios from 'axios';

function LocationList({ locations, setLocations }) {
  const [viewingLocationIndex, setViewingLocationIndex] = useState(null);

  const handleRemove = (index) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const handleMapClick = async (index, event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const updatedLocations = [...locations];
    updatedLocations[index] = { ...updatedLocations[index], lat, lng };
    setLocations(updatedLocations);

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      if (response.data.results.length > 0) {
        const address = response.data.results[0].formatted_address;
        updatedLocations[index] = { ...updatedLocations[index], address };
        setLocations(updatedLocations);
      }
    } catch (error) {
      console.error('Error fetching updated address:', error);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-2xl font-bold text-primary mb-4">Current Locations:</h3>
      {locations.map((location, index) => (
        <div key={index} className="flex flex-col mb-4 p-4 border rounded-md">
          <p className="flex items-center">
            <FaMapMarkerAlt className="mr-2 text-primary" />
            Person {index + 1} - Address: {location.address}
          </p>
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => handleRemove(index)}
              className="text-red-500 flex items-center"
            >
              <FaTrash className="mr-2" /> Remove
            </button>
            <button
              onClick={() =>
                setViewingLocationIndex(
                  viewingLocationIndex === index ? null : index
                )
              }
              className="text-blue-500 flex items-center"
            >
              <FaMapMarkedAlt className="mr-1" />
              {viewingLocationIndex === index ? 'Hide Map' : 'View & Edit on Map'}
            </button>
          </div>
          {viewingLocationIndex === index && (
            <div className="w-full mt-4">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '300px' }}
                center={{ lat: location.lat, lng: location.lng }}
                zoom={12}
                onClick={(event) => handleMapClick(index, event)}
              >
                <Marker position={{ lat: location.lat, lng: location.lng }} />
              </GoogleMap>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default LocationList;

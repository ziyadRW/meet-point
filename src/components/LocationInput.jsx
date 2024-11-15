import React, { useRef } from 'react';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { FaMapMarkerAlt } from 'react-icons/fa';

const libraries = ['places'];

function LocationInput({ onSelectLocation }) {
  const autocompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address,
      };
      onSelectLocation(location);
      autocompleteRef.current.input.value = '';
    }
  };

  return (
    <div className="relative w-full">
      {isLoaded ? (
        <Autocomplete
          onLoad={(autocomplete) => {
            autocompleteRef.current = autocomplete;
          }}
          onPlaceChanged={handlePlaceChanged}
        >
          <div className="relative w-full">
            <FaMapMarkerAlt className="absolute left-3 top-3 text-primary" />
            <input
              type="text"
              placeholder="Search for a location"
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg"
              ref={(input) => {
                if (autocompleteRef.current) {
                  autocompleteRef.current.input = input;
                }
              }}
            />
          </div>
        </Autocomplete>
      ) : (
        <p>Loading map...</p>
      )}
            <FaMapMarkerAlt className="absolute left-3 top-3 text-primary" />
    </div>
  );
}

export default LocationInput;

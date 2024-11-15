import React, { useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';

function LocationInput({ onSelectLocation }) {
  const autocompleteRef = useRef(null);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address,
      };
      onSelectLocation(location);
      
      // Clear the input value after selecting a location
      autocompleteRef.current.input.value = '';
    }
  };

  return (
    <div className="w-4/5 ml-4">
      <Autocomplete
        onLoad={(autocomplete) => {
          autocompleteRef.current = autocomplete;
        }}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="text"
          placeholder="Search for a location"
          className="w-full p-2 border border-gray-300 rounded-lg"
          ref={(input) => {
            if (autocompleteRef.current) {
              autocompleteRef.current.input = input;
            }
          }}
        />
      </Autocomplete>
    </div>
  );
}

export default LocationInput;
import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

function LocationSelector({ peopleCount, locations, setLocations }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const autocompleteRefs = useRef([]);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);

  useEffect(() => {
    if (peopleCount > locations.length) {
      setLocations((prevLocations) => [
        ...prevLocations,
        { address: '', lat: null, lng: null },
      ]);
    }
  }, [peopleCount, setLocations, locations.length]);

  const handlePlaceChange = (index) => {
    const place = autocompleteRefs.current[index].getPlace();
    if (place.geometry) {
      const location = {
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      updateLocation(index, location);
    }
  };

  const updateLocation = (index, updatedLocation) => {
    const updatedLocations = [...locations];
    updatedLocations[index] = updatedLocation;
    setLocations(updatedLocations);
  };

  const handleMapClick = (index, event) => {
    const location = {
      ...locations[index],
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    updateLocation(index, location);
  };

  return (
    <div>
      {locations.map((location, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-lg font-semibold">Person {index + 1} Location</h3>
          {isLoaded && currentEditIndex !== index ? (
            <div className="flex items-center gap-2">
              <span className="font-medium">{location.address || 'No location set yet'}</span>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setCurrentEditIndex(index)}
              >
                View/Edit on Map
              </button>
            </div>
          ) : isLoaded ? (
            <>
              <Autocomplete
                onLoad={(autocomplete) => (autocompleteRefs.current[index] = autocomplete)}
                onPlaceChanged={() => handlePlaceChange(index)}
              >
                <input
                  type="text"
                  placeholder="Search for a location"
                  className="w-full p-2 mb-2 border rounded"
                  defaultValue={location.address}
                />
              </Autocomplete>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '300px' }}
                center={{ lat: location.lat || 24.7136, lng: location.lng || 46.6753 }}
                zoom={location.lat && location.lng ? 15 : 10}
                onClick={(event) => handleMapClick(index, event)}
              >
                {location.lat && location.lng && <Marker position={{ lat: location.lat, lng: location.lng }} />}
              </GoogleMap>
              <button
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => setCurrentEditIndex(null)}
              >
                Confirm Location
              </button>
            </>
          ) : (
            <p>Loading map...</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default LocationSelector;

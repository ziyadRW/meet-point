import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

function MapContainer({ center, markers }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  return (
    <div className="map-container">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '400px' }}
          center={center}
          zoom={12}
        >
          {markers.map((marker, index) => (
            <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }} />
          ))}
        </GoogleMap>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
}

export default MapContainer;
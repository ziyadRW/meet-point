import React from 'react';

function PlaceItem({ place }) {
  return (
    <div className="place-item p-4 border rounded-lg shadow-lg">
      <h4 className="text-lg font-bold mb-2">{place.name}</h4>
      <p className="mb-1">Rating: {place.rating}</p>
      <p className="mb-1">Price Level: {place.price_level}</p>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat},${place.geometry.location.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        View on Map
      </a>
    </div>
  );
}

export default PlaceItem;

import React from 'react';
import PlaceItem from './PlaceItem';

function ResultsList({ places }) {
  return (
    <div className="results-list">
      <h3 className="text-2xl font-bold mb-4">Search Results</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place, index) => (
          <PlaceItem key={index} place={place} />
        ))}
      </div>
    </div>
  );
}

export default ResultsList;

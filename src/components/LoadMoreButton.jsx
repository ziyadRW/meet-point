import React from 'react';

function LoadMoreButton({ onLoadMore }) {
  return (
    <div className="text-center mt-6">
      <button
        className="bg-blue-500 text-white px-6 py-2 rounded-lg"
        onClick={onLoadMore}
      >
        Load More
      </button>
    </div>
  );
}

export default LoadMoreButton;
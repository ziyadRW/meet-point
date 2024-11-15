import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

function LoadMoreButton({ onLoadMore }) {
  return (
    <div className="text-center mt-6">
      <button
        className="bg-primary text-white px-6 py-2 rounded-lg flex items-center justify-center hover:bg-primary-dark"
        onClick={onLoadMore}
      >
        <FaChevronDown className="mr-2" />
        Load More
      </button>
    </div>
  );
}

export default LoadMoreButton;

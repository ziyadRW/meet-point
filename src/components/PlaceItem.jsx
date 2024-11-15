import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PlaceItem({ place }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [photos, setPhotos] = useState(place.photos || []);
  const [details, setDetails] = useState({});
  const [isOpen, setIsOpen] = useState(null);
  const [closingTime, setClosingTime] = useState('');

  const ratingStars = Math.round(place.rating || 0);

  const fetchPlaceDetails = async (placeId) => {
    try {
      console.log(`Fetching place details for place_id: ${placeId}`);
      const response = await axios.get(`http://localhost:3001/api/placeDetails`, {
        params: {
          placeId: placeId,
        },
      });
      console.log('Place details fetched:', response.data);
      return response.data.result || {};
    } catch (error) {
      console.error('Error fetching place details:', error);
      return {};
    }
  };

  useEffect(() => {
    const fetchAdditionalDetails = async () => {
      if (place.place_id) {
        const placeDetails = await fetchPlaceDetails(place.place_id);
        setDetails(placeDetails);
        if (placeDetails.photos && placeDetails.photos.length > 1) {
          setPhotos(placeDetails.photos);
        }

        if (placeDetails.opening_hours && placeDetails.opening_hours.periods) {
          const today = new Date().getDay(); // 0 is Sunday, 6 is Saturday
          const currentTime = new Date();
          const todayPeriods = placeDetails.opening_hours.periods.find(
            (period) => period.open && period.open.day === today
          );

          if (todayPeriods) {
            const openTime = new Date(currentTime);
            const closeTime = new Date(currentTime);

            openTime.setHours(todayPeriods.open.time.substring(0, 2));
            openTime.setMinutes(todayPeriods.open.time.substring(2, 4));

            closeTime.setHours(todayPeriods.close.time.substring(0, 2));
            closeTime.setMinutes(todayPeriods.close.time.substring(2, 4));

            if (currentTime >= openTime && currentTime < closeTime) {
              setIsOpen(true);
              setClosingTime(
                `Closes at ${todayPeriods.close.time.substring(0, 2)}:${todayPeriods.close.time.substring(2, 4)}`
              );
            } else {
              setIsOpen(false);
              setClosingTime(
                `Closed at ${todayPeriods.close.time.substring(0, 2)}:${todayPeriods.close.time.substring(2, 4)}`
              );
            }
          }
        }
      }
    };

    fetchAdditionalDetails();
  }, [place.place_id]);

  const handleNextImage = () => {
    if (photos.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }
  };

  const handlePrevImage = () => {
    if (photos.length > 1) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? photos.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <div className="place-item p-4 border rounded-lg shadow-lg bg-white relative">
      {/* Image Carousel */}
      {photos.length > 0 && (
        <div className="relative mb-4">
          <img
            src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photos[currentImageIndex].photo_reference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
            alt={place.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          {photos.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              >
                &larr;
              </button>
              <button
                onClick={handleNextImage}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              >
                &rarr;
              </button>
            </>
          )}
        </div>
      )}

      {/* Place Name */}
      <h4 className="text-lg font-bold mb-2">{place.name}</h4>

      {/* Rating Stars */}
      {place.rating && (
        <div className="mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${i < ratingStars ? 'text-yellow-500' : 'text-gray-300'}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.562 4.79a1 1 0 00.95.69h5.064c.97 0 1.372 1.24.588 1.81l-4.105 2.987a1 1 0 00-.364 1.118l1.563 4.79c.3.921-.755 1.688-1.538 1.118l-4.105-2.987a1 1 0 00-1.175 0l-4.105 2.987c-.783.57-1.838-.197-1.538-1.118l1.563-4.79a1 1 0 00-.364-1.118L2.926 9.217c-.784-.57-.382-1.81.588-1.81h5.064a1 1 0 00.95-.69l1.562-4.79z" />
              </svg>
            ))}
          </div>
          <p className="text-gray-500 text-sm">{`Rating: ${place.rating}`}</p>
        </div>
      )}

      {/* Distance from Midpoint */}
      {place.distance && (
        <p className="text-sm text-gray-600 mb-2">{`Distance from midpoint: ${place.distance} km`}</p>
      )}

      {/* Address */}
      {details.formatted_address && (
        <p className="text-sm text-gray-600 mb-2">{details.formatted_address}</p>
      )}

      {/* Opening Hours Status */}
      {isOpen !== null && (
        <p
          className={`text-sm mb-2 ${
            isOpen ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {closingTime}
        </p>
      )}

      {/* Phone Number */}
      {details.formatted_phone_number && (
        <p className="text-sm text-gray-600 mb-2">{`Phone: ${details.formatted_phone_number}`}</p>
      )}

      {/* Website */}
      {details.website && (
        <a
          href={details.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline block mb-2"
        >
          Visit Website
        </a>
      )}

      {/* View on Google Maps */}
      {place.geometry && place.geometry.location && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat},${place.geometry.location.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          View on Google Maps
        </a>
      )}
    </div>
  );
}

export default PlaceItem;

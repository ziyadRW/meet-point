const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 3001;

require("dotenv").config();

app.use(cors());

app.use(express.json());

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; 
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

app.get("/api/places", async (req, res) => {
  const { query, location, radius } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${location}&radius=${radius}&key=${apiKey}`
    );

    const [midLat, midLng] = location.split(",");

    const placesWithDistance = response.data.results.map((place) => {
      const distance = calculateDistance(
        parseFloat(midLat),
        parseFloat(midLng),
        place.geometry.location.lat,
        place.geometry.location.lng
      );
      return { ...place, distance: distance.toFixed(2) }; // Distance in km, rounded to 2 decimal places
    });

    res.json({ results: placesWithDistance });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching places data", details: error.message });
  }
});

app.get("/api/placeDetails", async (req, res) => {
  const { placeId } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos,formatted_phone_number,opening_hours,website,price_level,user_ratings_total,business_status,reviews,formatted_address,geometry&key=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching place details", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});

// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 3001;

// Load environment variables from .env file
require("dotenv").config();

// Use CORS to allow requests from any origin
app.use(cors());

app.use(express.json());

app.get("/api/places", async (req, res) => {
  const { query, location, radius } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${location}&radius=${radius}&key=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching places data", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});


app.get("/api/placeDetails", async (req, res) => {
  const { placeId } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching place details", details: error.message });
  }
});

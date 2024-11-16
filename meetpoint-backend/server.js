const express = require("express");
const mailgun = require("mailgun-js");
const axios = require("axios");
const cors = require("cors");
const { createEvent } = require("ics");
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
  const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;

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
      return { ...place, distance: distance.toFixed(2) };
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
  const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;

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
app.post("/api/sendInvitations", async (req, res) => {
  const { participants, meetingDate, meetingTime, invitationMessage, selectedPlace } = req.body;

  if (!selectedPlace || !selectedPlace.formatted_address) {
    return res.status(400).json({ error: "Missing selectedPlace details" });
  }

  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

  try {
    const [year, month, day] = meetingDate.split("-");
    const [hour, minute] = meetingTime.split(":");
    const encodedUrl = encodeURI(`https://maps.google.com/?q=${selectedPlace.formatted_address}`);

    const event = {
      start: [parseInt(year), parseInt(month), parseInt(day), parseInt(hour), parseInt(minute)],
      duration: { hours: 1 }, 
      title: "MeetPoint Invitation",
      description: invitationMessage,
      location: selectedPlace.formatted_address,
      url: encodedUrl,
      status: 'CONFIRMED',
      method: 'REQUEST',
    };

    createEvent(event, (error, value) => {
      if (error) {
        console.error("ICS Error:", error);
        return res.status(500).json({ error: "Error creating calendar event", details: error.message });
      }

      for (const participant of participants) {
        const data = {
          from: `MeetPoint Team <no-reply@${process.env.MAILGUN_DOMAIN}>`,
          to: participant.email,
          subject: "MeetPoint Invitation",
          text: invitationMessage,
          html: `<p>${invitationMessage}</p><p><a href="${encodedUrl}">View Location</a></p>`,
          attachment: new mg.Attachment({
            data: Buffer.from(value),
            filename: "invite.ics",
            contentType: "text/calendar; charset=UTF-8; method=REQUEST",
            knownLength: Buffer.from(value).length,
            disposition: "inline",
          }),
        };

        mg.messages().send(data, (err, body) => {
          if (err) {
            console.error("Mailgun Error:", err);
            return res.status(500).json({ error: "Error sending invitations", details: err.message });
          } else {
            console.log("Email sent to:", participant.email);
          }
        });
      }

      res.status(200).json({ message: "Invitations sent successfully" });
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ error: "Error sending invitations", details: error.message });
  }
});


app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});

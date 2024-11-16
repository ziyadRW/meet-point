import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LocationPage from "./components/LocationPage";
import ResultsPage from "./components/ResultsPage";
import InvitationPage from "./components/InvitationPage";

export default function Component() {
  const [peopleCount, setPeopleCount] = useState(() => {
    const saved = localStorage.getItem("meetpoint_peopleCount");
    return saved ? parseInt(saved) : 0;
  });

  const [locations, setLocations] = useState(() => {
    const saved = localStorage.getItem("meetpoint_locations");
    return saved ? JSON.parse(saved) : [];
  });

  const [midpoint, setMidpoint] = useState(() => {
    const saved = localStorage.getItem("meetpoint_midpoint");
    return saved ? JSON.parse(saved) : null;
  });

  const [keyword, setKeyword] = useState(() => {
    const saved = localStorage.getItem("meetpoint_keyword");
    return saved || "";
  });

  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    localStorage.setItem("meetpoint_peopleCount", peopleCount.toString());
    localStorage.setItem("meetpoint_locations", JSON.stringify(locations));
    localStorage.setItem("meetpoint_midpoint", JSON.stringify(midpoint));
    localStorage.setItem("meetpoint_keyword", keyword);
  }, [peopleCount, locations, midpoint, keyword]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="container mx-auto px-4 py-8 flex-grow">
          <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
            MeetPoint
          </h1>
          <Routes>
            <Route
              path="/"
              element={
                <LocationPage
                  locations={locations}
                  setLocations={setLocations}
                  peopleCount={peopleCount}
                  setPeopleCount={setPeopleCount}
                  setMidpoint={setMidpoint}
                  keyword={keyword}
                  setKeyword={setKeyword}
                />
              }
            />
            <Route
              path="/results"
              element={
                <ResultsPage
                  midpoint={midpoint}
                  keyword={keyword}
                  setKeyword={setKeyword}
                  onPlaceSelect={setSelectedPlace}
                />
              }
            />
            <Route
              path="/invite"
              element={
                <InvitationPage
                  locations={locations}
                  selectedPlace={selectedPlace}
                />
              }
            />
          </Routes>
        </div>
        <footer className="bg-white shadow-sm mt-8 py-4">
          <div className="container mx-auto px-4 text-center">
            By{" "}
            <a
              href="https://www.linkedin.com/in/ziyad-alruwaished-5bb28924a/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out"
            >
              Ziyad
            </a>
          </div>
        </footer>
      </div>
    </Router>
  );
}

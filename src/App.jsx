import React, { useState } from 'react';
import LocationPage from './components/LocationPage';
import ResultsPage from './components/ResultsPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [peopleCount, setPeopleCount] = useState(0);
  const [locations, setLocations] = useState([]);
  const [midpoint, setMidpoint] = useState(null);
  const [keyword, setKeyword] = useState('');

  return (
    <Router>
      <div className="App">
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
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

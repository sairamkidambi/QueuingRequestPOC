import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import LocationList from "./Components/locationDetails";

function App() {
  const [locations, setLocations] = useState([]);
  const [locationDetails, setLocationDetails] = useState([]);
  const [queue, setQueue] = useState([]);
  const [allFetched, setAllFetched] = useState(false); //To make sure all the items are shown at once in UI
  const activeRequests = useRef(0);

  // Fetch the initial list of location codes
  const fetchLocations = async () => {
    try {
      // To resolve the CORS issue, added middleware proxy
      const response = await fetch("http://localhost:3001/locations");
      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }
      const data = await response.json();
      setLocations(data);

      setQueue(data.map((loc) => loc.Location)); // Initialize the queue with location codes
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  // Fetch details for a specific location
  const fetchLocationDetails = async (location) => {
    try {
      activeRequests.current += 1; // Increment active requests count
      const response = await fetch(
        `http://localhost:3001/location/${location}` // To resolve the CORS issue, added middleware proxy
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch details for location ${location}`);
      }
      const data = await response.json();
      setLocationDetails((prevDetails) => [...prevDetails, data]);
    } catch (error) {
      console.error(`Error fetching details for location ${location}:`, error);
    } finally {
      activeRequests.current -= 1; // Decrement active requests count
      handleLocationRequests();
    }
  };

  // Process the queue to ensure only two requests are active at any time
  const handleLocationRequests = () => {
    while (queue.length > 0 && activeRequests.current < 2) {
      const nextLocation = queue.shift(); // Fetch the next location from the queue
      fetchLocationDetails(nextLocation);
    }
    if (queue.length === 0 && activeRequests.current === 0) {
      setAllFetched(true);
    }
  };

  useEffect(() => {
    // Fetch initial location codes
    fetchLocations();
    console.log(0);
  }, []);

  // Trigger processing of the queue whenever it changes
  useEffect(() => {
    if (queue.length > 0) {
      handleLocationRequests();
    }
  }, [queue]);

  // Extracted mapping logic into a constant variable
  const locationListItems = locationDetails.map((detail) => (
    <LocationList key={detail.Location} locationDetails={detail} />
  ));

  return (
    <div className="App">
      <div>
        <h1>Location Details</h1>
        {allFetched ? (
          <ul>
            <div className="App__location-container">{locationListItems}</div>
          </ul>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default App;

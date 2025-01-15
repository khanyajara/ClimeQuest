import React, { useState, useEffect } from "react";
import { getPlacesData, getWeatherData, getForecastData } from '../../apiService/apiService'; // Import your functions

function Attractions() {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState(10000); // 10 km radius by default

  // Function to get user's geolocation
  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (err) => {
          setError("Geolocation failed. Please enable location access.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  // Fetching attractions when location is available
  useEffect(() => {
    if (location) {
      const fetchAttractions = async () => {
        try {
          const lat = location.latitude;
          const lon = location.longitude;

          // Define the bounding box (a simple example)
          const sw = {
            lat: lat - (radius / 111320), // Subtract from latitude (convert meters to degrees)
            lng: lon - (radius / (40008000 / 360)) // Subtract from longitude (convert meters to degrees)
          };
          const ne = {
            lat: lat + (radius / 111320), // Add to latitude
            lng: lon + (radius / (40008000 / 360)) // Add to longitude
          };

          // Fetch the places data from the API
          const places = await getPlacesData("restaurants", sw, ne, { lat, lon }, radius);
          setAttractions(places); // Store the fetched attractions
          setLoading(false);
        } catch (err) {
          console.error("Error fetching attractions:", err);
          setError("Error fetching attractions.");
          setLoading(false);
        }
      };

      fetchAttractions();
    }
  }, [location, radius]); // Re-run if location or radius changes

  // Call geolocation function when the component mounts
  useEffect(() => {
    getGeolocation();
  }, []);

  // Loading and error handling
  if (loading) {
    return <p>Loading attractions...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="attractions-list">
      <h2>Nearby Attractions</h2>
      <ul>
        {attractions.map((attraction, index) => (
          <li key={index}>
            <h3>{attraction.name}</h3>
            <p>{attraction.description}</p>
            <p><strong>Category:</strong> {attraction.category}</p>
            <p><strong>Location:</strong> {attraction.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Attractions;

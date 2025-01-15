import React, { useState } from "react";
import axios from "axios";
import Map from "./map";
import css from './Attraction.css'

const AttractionsPage = () => {
  const [city, setCity] = useState(""); 
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(""); // For error handling
  const [coordinates, setCoordinates] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [childClicked, setChildClicked] = useState(null);

  const handleSearch = async () => {
    if (!city) return; 
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://climateroutebackend.onrender.com/api/search?city=${city}`
      );
      if (response.data && response.data.attractions) {
        setAttractions(response.data.attractions);
      } else {
        setError("No attractions found.");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data", err);
      setError("Failed to load attractions. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="Attractions-container">
      <h1>Search Attractions</h1>
      <div className="Container-search" >
        <input
          type="text"
          className="search-container"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleSearch} className="search-Button">Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {attractions.length > 0 && !loading && (
        <div className="Map-size">
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            setChildClicked={setChildClicked}
            weatherData={null}
            attractions={attractions}
            
          />
          <div className="Attraction-card">
            
              {attractions.map((attraction) => (
                <p key={attraction.place_id}>
                  <div className="Attractions-Cards">
                    <h3>{attraction.name}</h3>
                    <p>{attraction.photo_reference}</p>
                    <p>Rating: {attraction.rating || "N/A"} (Based on {attraction.user_ratings_total} ratings)</p>
                    <p>Location: {attraction.vicinity}</p>
                    <p>{attraction.icon}</p>
                    <p>Types:{attraction.types}</p>
                    {attraction.photos && attraction.photos.length > 0 && (
                      <img
                        src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${attraction.photos[0].photo_reference}&key=REACT_APP_GOOGLE_MAPS_API_KEY`}
                        alt={attraction.name}
                        style={{ width: "200px", height: "auto" }}
                      />
                    )}
                    <p>
                      <strong>Opening hours: </strong>
                      {attraction.opening_hours?.open_now ? "Open Now" : "Closed"}
                    </p>
                  </div>
                </p>
              ))}
            
          </div>
        </div>
      )}
    </div>
  );
};

export default AttractionsPage;

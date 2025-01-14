import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './Components/Navbar';
import Map from './Components/map/map';
import WeatherCard from './Components/Weather/weatherCard';

function App() {
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });  // Ensure initial coordinates are set
  const [places, setPlaces] = useState([]);
  const [bounds, setBounds] = useState({});
  const [childClicked, setChildClicked] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      if (!coordinates.lat || !coordinates.lng) return;  // Prevent fetch when no coordinates
      const radius = 8000;  // 8 km radius
      const placesApiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.lat},${coordinates.lng}&radius=${radius}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;

      try {
        const { data } = await axios.get(placesApiUrl);
        setPlaces(data.results); // Set the places
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };

    fetchPlaces();
  }, [coordinates]);

  return (
    <div className="App">
      <NavBar />
      <Map
        setCoordinates={setCoordinates}
        setBounds={setBounds}
        coordinates={coordinates}
        places={places}
        setChildClicked={setChildClicked}
        weatherData={weatherData}
      />
      <WeatherCard coordinates={coordinates} /> 
    </div>
  );
}

export default App;

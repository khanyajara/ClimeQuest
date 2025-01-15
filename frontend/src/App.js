import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Home from './Components/Home/Home'
import UserProfile from './Components/Auth/Profile';
import Login from './Components/Auth/Login';
import ForgotPassword from './Components/Auth/ForgotPassword';
import Register from './Components/Auth/Register';
import ResetPassword from './Components/Auth/ResetPassword';
import NavBar from './Components/Navbar';





function App() {
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [bounds, setBounds] = useState({});
  const [childClicked, setChildClicked] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef(null);

  
  

  // Get user's location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  // Filter places based on rating
  useEffect(() => {
    if (places) {
      const filtered = places.filter((place) => place.rating > rating);
      setFilteredPlaces(filtered);
    }
  }, [rating, places]);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      if (coordinates.lat && coordinates.lng) {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lng}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`;
        try {
          const { data } = await axios.get(weatherUrl);
          setWeatherData(data);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      }
    };

    fetchWeather();
  }, [coordinates]);

  return (
    
      <div className="App">
        <NavBar />
      <Routes>
          <Route path="/" element={<Home /> }/>
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
        </Routes>

      </div>
    
  );
}

export default App;

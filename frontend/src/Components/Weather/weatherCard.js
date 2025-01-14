import React, { useState, useEffect } from "react";
import weatherCss from "./Weather.css"
import weatherIconImg from "../../assess/images/weather-icon.webp";
import humidityIconImg from "../../assess/images/humidity-icon.png";
import windIconImg from "../../assess/images/wind-icon.png";
import weatherClearIcon from "../../assess/images/weather-clear.png";
import weatherCloudsIcon from "../../assess/images/weather-clouds.png";
import weatherDrizzleIcon from "../../assess/images/weather-drizzle.png";
import weatherMistIcon from "../../assess/images/weather-mist.webp";
import weatherRainIcon from "../../assess/images/weather-rain.webp";
import weatherSmokeIcon from "../../assess/images/weather-smoke.png";
import weatherSnowIcon from "../../assess/images/weather-snow.webp";
import { getWeatherData } from "../../apiService/apiService"; // Import the API service

const WeatherCard = ({ coordinates }) => {
  const [city, setCity] = useState("");
  const [temp, setTemp] = useState("");
  const [humidity, setHumidity] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [weatherIcon, setWeatherIcon] = useState(weatherIconImg);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getIconForWeather = (main) => {
    switch (main) {
      case "Clouds":
        return weatherCloudsIcon;
      case "Clear":
        return weatherClearIcon;
      case "Mist":
        return weatherMistIcon;
      case "Rain":
        return weatherRainIcon;
      case "Drizzle":
        return weatherDrizzleIcon;
      case "Smoke":
        return weatherSmokeIcon;
      case "Snow":
        return weatherSnowIcon;
      default:
        return weatherIconImg;
    }
  };

  useEffect(() => {
    if (!coordinates.lat || !coordinates.lng) return;

    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        // Call the API to get weather data
        const data = await getWeatherData(coordinates.lat, coordinates.lng);

        if (data) {
          setCity(data.name || "Unknown");
          setTemp(`${data.main.temp}°C`);
          setHumidity(`${data.main.humidity}%`);
          setWindSpeed(`${data.wind.speed} km/h`);
          setWeatherIcon(getIconForWeather(data.weather[0].main));
        }
      } catch (error) {
        setError("Error fetching weather data.");
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [coordinates]); // Fetch weather when coordinates change

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="weather-card">
      <div className="weather">
        <img className="weather-icon" src={weatherIcon} alt="weather icon" />
        <h1 className="temp">{temp}</h1>
        <h2 className="city">{city}</h2>
        <div className="details">
          <div style={{ display: "flex" }} className="col">
            <img className="humi" src={humidityIconImg} alt="humidity icon" />
            <div className="info">
              <p className="humidity">{humidity}</p>
              <p>Humidity</p>
            </div>
          </div>
          <div className="col">
            <img src={windIconImg} alt="wind icon" />
            <div className="info">
              <p className="wind">{windSpeed}</p>
              <p>Wind Speed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;

import axios from "axios";

// Travel Advisor API (RapidApi)
export const getPlacesData = async (type, sw, ne) => {
  if (process.env.REACT_APP_ENV !== "development") {
    try {
      const {
        data: { data },
      } = await axios.get(
        `https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`,
        {
          params: {
            bl_latitude: sw.lat,
            tr_latitude: ne.lat,
            bl_longitude: sw.lng,
            tr_longitude: ne.lng,
          },
          headers: {
            "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
            "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
          },
        }
      );

      return data;
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Development environment detected"); // for limiting api requests
  }
};

const API_KEY = "47dd65ecabe0cf32fae0116841fa5da5";
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

export const getWeatherData = async (lat, lon) => {
  try {
    const response = await fetch(
      `${WEATHER_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const data = await response.json();
    return data; // This should return the weather data object
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error; // Handle error if the request fails
  }
};


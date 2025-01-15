import axios from "axios";

const API_KEY = "47dd65ecabe0cf32fae0116841fa5da5";
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

export const getPlacesData = async (type, sw, ne, coordinates, radius) => {
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
      console.error("Error fetching places:", error);
      throw error; // Throw error to handle it in the calling code
    }
  } else {
    console.log("Development environment detected");
    return [];
  }
};





export const getWeatherData = async (lat, lon) => {
  try {
    const { data } = await axios.get(
      `${WEATHER_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error; // Handle error if the request fails
  }
};

export const getForecastData = async (lat, lon) => {
  try {
    const { data } = await axios.get(
      `${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    return data;
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    throw error; // Handle error if the request fails
  }
};

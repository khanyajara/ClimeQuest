import React, { useState, useEffect } from "react";
import axios from "axios";
import { getPlacesData } from '../../apiService/apiService'; // Import your functions

function Attractions() {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState(10000); 

  const getGeolocation = () => {
    if (!location) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
            setLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });

          try {
           
            const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
              params: {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
                format: 'json',
                addressdetails: 1,
              },
            });
            console.log('GeoResponse:', geoResponse.data); 

            
            let city = geoResponse.data.address.city || geoResponse.data.address.town || geoResponse.data.address.village;
            if (!city) {
              throw new Error("City not found in geolocation response");
            }

           
            const adjustedCity = city.includes('Municipality') ? city.split(' ')[0] : city;
            console.log('Adjusted City:', adjustedCity); 

           
            const response = await axios.get('https://climateroutebackend.onrender.com/api/search', {
              params: { city: adjustedCity }
            });
            console.log('Climate API Response:', response.data); 

          } catch (err) {
            console.error("Error fetching geolocation or climate data:", err.response?.data || err.message);
            setError("Failed to get location or attractions data.");
            setLoading(false);
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Failed to get geolocation.");
          setLoading(false);
        }
      );
    }
  };

  useEffect(() => {
    getGeolocation(); 
  }, []);

  useEffect(() => {
    if (location) {
      const fetchAttractions = async () => {
        try {
          const lat = location.latitude;
          const lon = location.longitude;

         
          const sw = {
            lat: lat - (radius / 111320), 
            lng: lon - (radius / (40008000 / 360)) 
          };
          const ne = {
            lat: lat + (radius / 111320), 
            lng: lon + (radius / (40008000 / 360)) 
          };

          
          const places = await getPlacesData("restaurants", sw, ne, { lat, lon }, radius);
          setAttractions(places); 
          setLoading(false);
        } catch (err) {
          console.error("Error fetching attractions:", err);
          setError("Error fetching attractions.");
          setLoading(false);
        }
      };

      fetchAttractions();
    }
  }, [location, radius]); 

 
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

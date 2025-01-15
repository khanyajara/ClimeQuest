import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { Paper, Typography, useMediaQuery } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Rating } from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";

const Map = ({
  setCoordinates,
  setBounds,
  setChildClicked,
  weatherData,
}) => {
  const [userCoordinates, setUserCoordinates] = useState(null);
  
  const [places, setPlaces] = useState([]); // State to store the fetched places
  const classes = useStyles();
  const isDesktop = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoordinates({ lat: latitude, lng: longitude });
        },
        () => {
          console.error("Error fetching the location");
        }
      );
    }
  }, []);

  const fetchPlaces = async (query, lat, lon) => {
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;  
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${lat},${lon}&key=${GOOGLE_API_KEY}`;
    
    try {
      const response = await axios.get(url);
      setPlaces(response.data.results); 
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  useEffect(() => {
    if (userCoordinates) {
      fetchPlaces("restaurants", userCoordinates.lat, userCoordinates.lng);
    }
  }, [userCoordinates]); // Fetch places when userCoordinates changes

  if (!userCoordinates) {
    return <div>Loading...</div>;
  }

  return (
    <div className={classes.mapContainer}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.GOOGLE_API_KEY }}
        defaultCenter={userCoordinates}
        center={userCoordinates}
        defaultZoom={14}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
        onChange={(e) => {
          setCoordinates({ lat: e.center.lat, lng: e.center.lng });
          setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
        }}
        onChildClick={(child) => setChildClicked(child)}
      >
        {places?.map((place, i) => (
          <div
            className={classes.markerContainer}
            lat={Number(place.geometry.location.lat)}
            lng={Number(place.geometry.location.lng)}
            key={i}
          >
            {!isDesktop ? (
              <LocationOnOutlinedIcon color="primary" fontSize="large" />
            ) : (
              <Paper elevation={3} className={classes.paper}>
                <Typography className={classes.typography} variant="subtitle2" gutterBottom>
                  {place.name}
                </Typography>
                <img
                  className={classes.pointer}
                  src={
                    place.photos
                      ? place.photos[0].getUrl({ maxWidth: 400, maxHeight: 400 })
                      : "https://www.travelxp.com/_next/image?url=https%3A%2F%2Fimages.travelxp.com%2Fimages%2Findia%2Fmandvi%2Fbastian.png&w=1920&q=75"
                  }
                  alt={place.name}
                />
                <Rating size="small" value={Number(place.rating)} readOnly />
              </Paper>
            )}
          </div>
        ))}
      </GoogleMapReact>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  mapContainer: {
    marginTop: -290,
    height: "70vh",
    width: "60%",
    background: "linear-gradient(to bottom, #3a1c71, #d76d77, #ffaf7b)",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  markerContainer: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    zIndex: 1,
    "&:hover": { zIndex: 2 },
  },
  paper: {
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "120px",
    background: "linear-gradient(to top, #ff7e5f, #feb47b)",
    color: theme.palette.common.white,
  },
  pointer: {
    cursor: "pointer",
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    color: theme.palette.common.white,
  },
}));

export default Map;

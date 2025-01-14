import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { Paper, Typography, useMediaQuery } from "@mui/material";  // Update here
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";  // Update here
import Rating from "@mui/lab/Rating";  // Keep as is, but ensure you have @mui/lab installed
import { makeStyles } from "@mui/styles";  // Update here

import mapStyles from "./mapStyles";

const Map = ({
  setCoordinates,
  setBounds,
  places,
  setChildClicked,
  weatherData,
}) => {
  const [userCoordinates, setUserCoordinates] = useState(null);
  const classes = useStyles();
  const isDesktop = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    // Get user's current location using the Geolocation API
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

  if (!userCoordinates) {
    return <div>Loading...</div>;  // Show loading message until user's location is fetched
  }

  return (
    <div className={classes.mapContainer}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
        defaultCenter={userCoordinates}  // Use user's location as default center
        center={userCoordinates}  // Center the map on user's location
        defaultZoom={14}
        margin={[50, 50, 50, 50]}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: mapStyles,
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
            lat={Number(place.latitude)}
            lng={Number(place.longitude)}
            key={i}
          >
            {!isDesktop ? (
              <LocationOnOutlinedIcon color="primary" fontSize="large" />
            ) : (
              <Paper elevation={3} className={classes.paper}>
                <Typography
                  className={classes.typography}
                  variant="subtitle2"
                  gutterBottom
                >
                  {place.name}
                </Typography>
                <img
                  className={classes.pointer}
                  src={
                    place.photo
                      ? place.photo.images.large.url
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
    marginTop:40,
    height: "70vh",
    width: "60%",
    background: "linear-gradient(to bottom, #3a1c71, #d76d77, #ffaf7b)", // Gradient background
    borderRadius: "8px", // Rounded corners for modern look
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
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
    background: "linear-gradient(to top, #ff7e5f, #feb47b)", // Gradient for paper
    color: theme.palette.common.white, // White text color for contrast
  },
  pointer: {
    cursor: "pointer",
  },
  typography: {
    fontFamily: "'Poppins', sans-serif", // Modern font
    fontWeight: 600,
    color: theme.palette.common.white, // White text color for contrast
  },
}));

export default Map;

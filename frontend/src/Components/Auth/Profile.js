import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()



  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://climateroutebackend.onrender.com/api/profile');
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching user data');
        setLoading(false);
      }
    };
    fetchUserData();
   }, []);
   
   const toLogin=()=>{
    navigate('/login')
   }



  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;







  return (
    <div>
      <h2>User Profile</h2>
      {userData && (
        <div>
          <p>Email: {userData.email}</p>
          <p>Phone Number: {userData.phonenumber}</p>
          <p>Username: {userData.username}</p>
          <p>Joined: {new Date(userData.createdAt).toLocaleDateString()}</p>
          <h3>Favorites</h3>
          <div>
            {userData.favorites && userData.favorites.length > 0 ? (
              <ul>
                {userData.favorites.map((favorite) => (
                  <li key={favorite.itemId}>
                    <h4>{favorite.name}</h4>
                    <p>Location: {favorite.location}</p>
                    <p>{favorite.description}</p>
                    <img src={favorite.imageUrl} alt={favorite.name} style={{ width: '200px' }} />
                    <p><strong>Weather Suggestion:</strong> {favorite.weatherSuggestion}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No favorites added yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default UserProfile;
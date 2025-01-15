import React, { useState,useEffect } from 'react';
import axios from 'axios';
const ResetPassword = ({ match }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  useEffect (() => {
    const form = document.querySelector('.ResetForm');
    setTimeout(() => {
        form.classList.add('show');
    },100)
  },[])
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = match.params;
      const response = await axios.post('https://climateroutebackend.onrender.com/api/reset-password/${token}', { password });
      setMessage(response.data.message);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error resetting your password');
    }
  };
  return (
    <div className="ResetForm slide-in">
      <h2>Reset Password</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {message && <div style={{ color: 'skyblue' }}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div classname="NewPassword-input">
          <label>New Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};
export default ResetPassword;
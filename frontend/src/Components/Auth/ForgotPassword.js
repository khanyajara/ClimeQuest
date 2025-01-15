import React, { useState ,useEffect} from 'react';
import axios from 'axios';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    const form = document.querySelector('.ForgotForm');
    setTimeout(() => {
        form.classList.add('show');
    },100);
  },[]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://climateroutebackend.onrender.com/api/forgot-password', { email });
      setMessage(response.data.message);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error processing request');
    }
  };
  return (
    <div className='ForgotForm slide-in'>
      <h2>Forgot Password</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {message && <div style={{ color: 'skyblue' }}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className='email-input'>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};
export default ForgotPassword;
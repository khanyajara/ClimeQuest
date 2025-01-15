import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import css from './auth.css'
const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate()
 
  useEffect(() => {
    const form = document.querySelector('.RegisterForm');
    setTimeout(() => {
      form.classList.add('show');
    }, 100);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://climateroutebackend.onrender.com/api/register', { email, password, username });
      setMessage(response.data.message);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error registering user');
    }
  };

  const toLogin=()=>{
    navigate('/login')
   }

  return (
    <div className="RegisterForm">
      <h2>Register</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {message && <div style={{ color: 'green' }}>{message}</div>}
      <form onSubmit={handleSubmit} className="form-container">
        <div className="input-container">
          
          <input
          placeholder='Email'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='Input'
          />
        </div>
        <div className="input-container">
          
          <input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='Input'
          />
        </div>
        <div className="input-container">
         
          <input
            type="text"
            placeholder='UserName'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className='Input'
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p className='Account-link' onClick={toLogin}>Already have an account?</p>
    </div>
  );
};
export default Register;
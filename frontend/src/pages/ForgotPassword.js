// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setMessage('');
      setError('');
      setLoading(true);
      
      // Send the reset email
      await resetPassword(email);
      setMessage('Check your inbox for further instructions.');
    } catch {
      setError('Failed to reset password. Make sure the email is correct.');
    }
    setLoading(false);
  };

  return (
    <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ padding: '40px', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '400px', width: '100%', background: 'white' }}>
        <h2 style={{ textAlign: 'center' }}>Password Reset</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '10px', textAlign:'center' }}>{error}</div>}
        {message && <div style={{ color: 'green', marginBottom: '10px', textAlign:'center' }}>{message}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '10px', fontSize: '16px' }}
            required 
          />
          
          <button disabled={loading} type="submit" style={{ padding: '10px', background: '#333', color: 'white', border: 'none', cursor: 'pointer', fontWeight:'bold' }}>
            Reset Password
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
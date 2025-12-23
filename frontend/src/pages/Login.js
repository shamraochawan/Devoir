import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginEmail, loginGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await loginEmail(email, password);
      navigate('/'); // Go home after login
    } catch (err) {
      setError('Failed to log in. Check email/password.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginGoogle();
      navigate('/');
    } catch (err) {
      setError('Google sign in failed.');
    }
  };

  return (
    <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ padding: '40px', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '400px', width: '100%', background: 'white' }}>
        <h2 style={{ textAlign: 'center' }}>Sign In</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        
        <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* ✅ FIXED: Added Label and ID for Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor="login-email" style={{ fontWeight: 'bold', fontSize: '14px' }}>Email</label>
            <input 
              id="login-email"
              name="email"
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '10px', fontSize: '16px' }} 
              required
            />
          </div>

          {/* ✅ FIXED: Added Label and ID for Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor="login-password" style={{ fontWeight: 'bold', fontSize: '14px' }}>Password</label>
            <input 
              id="login-password"
              name="password"
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '10px', fontSize: '16px' }} 
              required
            />
          </div>

          <button type="submit" style={{ padding: '10px', background: '#333', color: 'white', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
            Log In
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Link to="/forgot-password" style={{ fontSize: '14px', color: '#4285F4', textDecoration: 'none' }}>
            Forgot Password?
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}>Sign Up</Link>
        </div>

        <div style={{ margin: '20px 0', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <p>Or</p>
          <button onClick={handleGoogleLogin} style={{ padding: '10px', background: '#4285F4', color: 'white', border: 'none', cursor: 'pointer', width: '100%' }}>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
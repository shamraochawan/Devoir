import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/'); // Go to home page after successful signup
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
          setError('This email is already registered.');
      } else if (err.code === 'auth/weak-password') {
          setError('Password should be at least 6 characters.');
      } else {
          setError('Failed to create an account.');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ padding: '40px', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '400px', width: '100%', background: 'white' }}>
        <h2 style={{ textAlign: 'center' }}>Create Account</h2>
        {error && <div style={{ color: 'red', marginBottom: '10px', textAlign:'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* ✅ FIXED: Email Label & ID */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor="signup-email" style={{ fontWeight: 'bold', fontSize: '14px' }}>Email</label>
            <input 
              id="signup-email"
              name="email"
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '10px', fontSize: '16px' }} 
              required 
            />
          </div>

          {/* ✅ FIXED: Password Label & ID */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor="signup-password" style={{ fontWeight: 'bold', fontSize: '14px' }}>Password</label>
            <input 
              id="signup-password"
              name="password"
              type="password" 
              placeholder="Create a password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '10px', fontSize: '16px' }} 
              required 
            />
          </div>

          {/* ✅ FIXED: Confirm Password Label & ID */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor="signup-confirm" style={{ fontWeight: 'bold', fontSize: '14px' }}>Confirm Password</label>
            <input 
              id="signup-confirm"
              name="confirmPassword"
              type="password" 
              placeholder="Confirm your password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ padding: '10px', fontSize: '16px' }} 
              required 
            />
          </div>
          
          <button disabled={loading} type="submit" style={{ padding: '10px', background: '#333', color: 'white', border: 'none', cursor: 'pointer', fontWeight:'bold', marginTop:'10px' }}>
            Sign Up
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          Already have an account? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
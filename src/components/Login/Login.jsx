import React, { useState } from 'react';
import { auth, googleProvider, signInWithPopup } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import StarryBackground from '../Star/StarryBackground';
import TypingText from '../TypingText/TypingText'; // Importa el componente TypingText
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Email:', email, 'Password:', password);
    navigate('/dashboard', { state: { user: { email } } });
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('Google Login Success:', user);
      navigate('/dashboard', { state: { user } });
    } catch (error) {
      console.error('Google Login Error:', error);
    }
  };

  return (
    <>
      <StarryBackground />
      <div className="login-page">
        <TypingText /> {/* Texto con efecto de typing en el lado izquierdo */}
        <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          <button onClick={handleGoogleLogin} className="google-login">
            Sign in with Google
          </button>
          <p className="forgot-password" onClick={() => alert('Forgot Password clicked')}>
            Forgot Password?
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
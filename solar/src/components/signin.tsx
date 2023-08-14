import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './signin.module.css';

interface LoginProps {
  onLogin: (username: string, password: string) => void;
  onSignUp: (username: string, password: string) => void;
}

const SigninPage: React.FC<LoginProps> = ({ onLogin, onSignUp }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);

  const navigate = useNavigate(); // Hook to handle navigation

  const handleLogin = () => {
    onLogin(username, password);
    navigate(`/welcome/${username}`); // Navigate to welcome page
  };

  const handleSignUp = () => {
    onSignUp(username, password);
    navigate(`/welcome/${username}`); // Navigate to welcome page
  };

  return (
    <div className={styles['login-container']}>
      <h1 className={styles['login-title']}>{isSigningUp ? 'Sign Up' : 'Log In'}</h1>
      <label className={styles['login-label']}>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles['login-input']}
        />
      </label>
      <label className={styles['login-label']}>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles['login-input']}
        />
      </label>
      {isSigningUp ? (
        <button onClick={handleSignUp} className={styles['login-button']}>
          Sign Up
        </button>
      ) : (
        <button onClick={handleLogin} className={styles['login-button']}>
          Login
        </button>
      )}
      <div className={styles['login-toggle']}>
        <button
          onClick={() => setIsSigningUp(!isSigningUp)}
          className={styles['login-toggle-button']}
        >
          {isSigningUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default SigninPage;
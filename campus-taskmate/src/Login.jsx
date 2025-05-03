import React, { useState } from 'react';
import './Login.css';

function Login({onLogin}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('https://68143536225ff1af162829e7.mockapi.io/campus-taskmate/users');
            const users = await response.json();

            const user = users.find(
                (u) => u.username === username && u.password === password
            );

            if (user) {
                onLogin(user);
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('An error occurred.');
        }
    };

    return (
        <div className="login-page">
          <header className="login-header">
            <h1>Campus Taskmate</h1>
            <p>Planning for students made easy</p>
          </header>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      );
    }
    
    export default Login;

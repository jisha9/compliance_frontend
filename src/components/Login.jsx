import { useState } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({ setUser }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', form);
      setUser({ username: res.data.username });
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Compliance Advisor</h1>
      </div>
      <div className="form">
        <form onSubmit={handleLogin}>
          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({...form, username: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            required
          />
          <button type="submit">Login</button>
        <p style={{textAlign: 'center', marginTop: '20px'}}>
          <Link to="/register" className="link">Create new account</Link>
        </p>
        </form>
      </div>
    </div>
  );
}
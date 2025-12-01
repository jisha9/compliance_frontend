import { useState } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/register', form);
      alert('Registration successful! Please login.');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Create Account</h1>
      </div>
      <div className="form">
        <form onSubmit={handleRegister}>
          <input
            placeholder="Choose Username"
            value={form.username}
            onChange={(e) => setForm({...form, username: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Choose Password"
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            required
          />
          <button type="submit">Register</button>
        </form>
        <p style={{textAlign: 'center', marginTop: '20px'}}>
          <Link to="/" className="link">Already have an account? Login</Link>
        </p>
      </div>
    </div>
  );
}
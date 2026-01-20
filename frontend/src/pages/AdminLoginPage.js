import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/admin/login`, {
        username,
        password,
      });
      adminLogin(response.data.token, response.data.username);
      toast.success('Admin login successful!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] noise-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold" style={{ fontFamily: 'Outfit' }}>
            <span className="text-[#00F0FF]">Stream</span>Count.live
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-[#7000FF]">Admin Panel</h2>
          <p className="mt-2 text-gray-400">Administrator login</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-[#171717] border-[#262626] text-white"
                placeholder="admin"
                data-testid="admin-username-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#171717] border-[#262626] text-white"
                placeholder="••••••••"
                data-testid="admin-password-input"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7000FF] hover:bg-[#6000EE] text-white font-semibold"
              data-testid="admin-login-button"
            >
              {loading ? 'Logging in...' : 'Admin Login'}
            </Button>
          </form>

          <p className="mt-6 text-center text-gray-400 text-sm">
            Default credentials: admin / admin123
          </p>
        </div>
      </div>
    </div>
  );
}

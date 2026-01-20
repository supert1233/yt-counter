import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Maximize2, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import LiveCounter from '../components/LiveCounter';
import AdBanner from '../components/AdBanner';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function CounterPage() {
  const [url, setUrl] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fontSettings, setFontSettings] = useState(null);
  const [settings, setSettings] = useState({ ads_enabled: true, streamer_mode: false });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSettings();
    if (user) {
      fetchFontSettings();
    }
  }, [user]);

  useEffect(() => {
    if (stats) {
      const interval = setInterval(() => {
        fetchStats(false);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [stats]);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      setSettings(response.data);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  const fetchFontSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/user/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFontSettings(response.data.font_settings);
    } catch (err) {
      console.error('Failed to fetch font settings:', err);
    }
  };

  const fetchStats = async (showLoading = true) => {
    if (!url.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    if (showLoading) setLoading(true);
    setError(null);

    try {
      const parseResponse = await axios.get(`${API}/youtube/parse`, {
        params: { url },
      });

      const { type, id } = parseResponse.data;

      let response;
      if (type === 'video') {
        response = await axios.get(`${API}/youtube/video/${id}`);
      } else {
        response = await axios.get(`${API}/youtube/channel/${id}`);
      }

      setStats({ ...response.data, type });
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to fetch stats';
      setError(message);
      if (showLoading) toast.error(message);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleFullscreen = () => {
    const params = new URLSearchParams();
    if (stats.type === 'video') {
      params.append('video', stats.video_id);
    } else {
      params.append('channel', stats.channel_id);
    }
    navigate(`/obs?${params.toString()}`);
  };

  const showAds = settings.ads_enabled && !settings.streamer_mode;

  return (
    <div className="min-h-screen bg-[#050505] noise-bg">
      {showAds && <AdBanner position="header" />}

      <nav className="border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold" style={{ fontFamily: 'Outfit' }}>
              <span className="text-[#00F0FF]">Stream</span>Count.live
            </Link>
            <div className="flex gap-4">
              {user ? (
                <>
                  <Link to="/settings">
                    <Button variant="ghost" className="text-white hover:text-[#00F0FF]">
                      Settings
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('email');
                      navigate('/');
                    }}
                    variant="ghost"
                    className="text-white hover:text-[#00F0FF]"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button className="bg-[#00F0FF] hover:bg-[#00D0DD] text-black font-semibold">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8" style={{ fontFamily: 'Outfit' }}>
            YouTube Live Counter
          </h1>

          <div className="flex gap-3 mb-8" data-testid="counter-input-section">
            <Input
              type="text"
              placeholder="Paste YouTube video or channel URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchStats()}
              className="flex-1 bg-[#171717] border-[#262626] text-white"
              data-testid="youtube-url-input"
            />
            <Button
              onClick={() => fetchStats()}
              disabled={loading}
              className="bg-[#00F0FF] hover:bg-[#00D0DD] text-black font-semibold"
              data-testid="fetch-stats-btn"
            >
              {loading ? 'Loading...' : 'Go'}
            </Button>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 rounded-lg p-4 mb-8">
              {error}
            </div>
          )}

          {stats && (
            <div className="space-y-6" data-testid="counter-display">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {stats.thumbnail && (
                    <img
                      src={stats.thumbnail}
                      alt={stats.title}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <h2 className="font-semibold text-lg">{stats.title}</h2>
                    <p className="text-sm text-gray-400">
                      {stats.type === 'video' ? 'Video' : 'Channel'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleFullscreen}
                  variant="outline"
                  className="border-[#00F0FF] text-[#00F0FF] hover:bg-[#00F0FF] hover:text-black"
                >
                  <Maximize2 className="mr-2 w-4 h-4" />
                  Fullscreen
                </Button>
              </div>

              <LiveCounter stats={stats} fontSettings={fontSettings} />

              <p className="text-center text-sm text-gray-500">
                Auto-refreshing every 5 seconds
              </p>
            </div>
          )}

          {showAds && <AdBanner position="below-counter" />}

          {!user && stats && (
            <div className="mt-8 glass rounded-lg p-6 text-center">
              <p className="text-gray-300 mb-4">
                Want to customize counter fonts? Create a free account!
              </p>
              <Link to="/register">
                <Button className="bg-[#00F0FF] hover:bg-[#00D0DD] text-black font-semibold">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {showAds && <AdBanner position="footer" />}
    </div>
  );
}

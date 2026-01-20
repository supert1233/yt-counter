import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { Eye, EyeOff, Save, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminPanel() {
  const { admin, adminLogout } = useAuth();
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [streamerMode, setStreamerMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    fetchSettings();
  }, [admin, navigate]);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API}/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHasApiKey(response.data.has_api_key);
      setAdsEnabled(response.data.ads_enabled);
      setStreamerMode(response.data.streamer_mode);
    } catch (err) {
      toast.error('Failed to load settings');
    }
  };

  const handleApiKeySave = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API}/admin/api-key`,
        { api_key: apiKey },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('API key updated successfully!');
      setApiKey('');
      setHasApiKey(true);
    } catch (err) {
      toast.error('Failed to update API key');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API}/admin/settings`,
        {
          ads_enabled: adsEnabled,
          streamer_mode: streamerMode,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Settings updated successfully!');
    } catch (err) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/');
  };

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-[#050505] noise-bg">
      <nav className="border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold" style={{ fontFamily: 'Outfit' }}>
              <span className="text-[#7000FF]">Admin</span> Panel
            </Link>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-white hover:text-[#00F0FF]"
            >
              <LogOut className="mr-2 w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Outfit' }}>
          Administrator Dashboard
        </h1>

        <div className="space-y-6">
          {/* YouTube API Key Section */}
          <div className="glass rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Outfit' }}>
              YouTube API Configuration
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Manage the YouTube Data API v3 key. Users cannot view or edit this key.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  API Key Status:
                  <span className={hasApiKey ? 'text-green-400 ml-2' : 'text-red-400 ml-2'}>
                    {hasApiKey ? 'Configured' : 'Not Configured'}
                  </span>
                </label>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter new YouTube API Key..."
                    className="bg-[#171717] border-[#262626] text-white pr-10"
                    data-testid="admin-api-key-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button
                  onClick={handleApiKeySave}
                  disabled={loading}
                  className="bg-[#7000FF] hover:bg-[#6000EE] text-white"
                >
                  <Save className="mr-2 w-4 h-4" />
                  Update Key
                </Button>
              </div>

              <p className="text-xs text-gray-500">
                Get your API key from{' '}
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00F0FF] hover:underline"
                >
                  Google Cloud Console
                </a>
              </p>
            </div>
          </div>

          {/* Ad Settings Section */}
          <div className="glass rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Outfit' }}>
              Advertisement Settings
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium">Enable Ads</label>
                  <p className="text-gray-400 text-sm">Show advertisement banners on the site</p>
                </div>
                <Switch checked={adsEnabled} onCheckedChange={setAdsEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium">Streamer Mode</label>
                  <p className="text-gray-400 text-sm">
                    Hide all ads for clean OBS streaming experience
                  </p>
                </div>
                <Switch checked={streamerMode} onCheckedChange={setStreamerMode} />
              </div>

              <Button
                onClick={handleSettingsSave}
                disabled={loading}
                className="w-full bg-[#00F0FF] hover:bg-[#00D0DD] text-black font-semibold"
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>

          {/* Info Section */}
          <div className="glass rounded-2xl p-6 border-l-4 border-[#00F0FF]">
            <h3 className="font-bold mb-2">Admin Panel Features</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Manage YouTube Data API v3 key (hidden from users)</li>
              <li>• Enable/disable advertisement display globally</li>
              <li>• Toggle streamer mode to hide all ads</li>
              <li>• All settings are applied in real-time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

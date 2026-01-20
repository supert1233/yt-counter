import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import axios from 'axios';
import LiveCounter from '../components/LiveCounter';
import { Button } from '../components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ObsView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [fontSettings, setFontSettings] = useState(null);
  const videoId = searchParams.get('video');
  const channelId = searchParams.get('channel');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchFontSettings(token);
    }
  }, []);

  useEffect(() => {
    if (videoId || channelId) {
      fetchStats();
      const interval = setInterval(fetchStats, 5000);
      return () => clearInterval(interval);
    }
  }, [videoId, channelId]);

  const fetchFontSettings = async (token) => {
    try {
      const response = await axios.get(`${API}/user/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFontSettings(response.data.font_settings);
    } catch (err) {
      console.error('Failed to fetch font settings:', err);
    }
  };

  const fetchStats = async () => {
    try {
      let response;
      if (videoId) {
        response = await axios.get(`${API}/youtube/video/${videoId}`);
        setStats({ ...response.data, type: 'video' });
      } else if (channelId) {
        response = await axios.get(`${API}/youtube/channel/${channelId}`);
        setStats({ ...response.data, type: 'channel' });
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-8">
      <Button
        onClick={() => navigate('/counter')}
        className="fixed top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white"
        size="icon"
      >
        <X className="w-6 h-6" />
      </Button>

      {stats ? (
        <div className="w-full">
          <LiveCounter stats={stats} fontSettings={fontSettings} obsMode />
        </div>
      ) : (
        <div className="text-white text-2xl">Loading...</div>
      )}
    </div>
  );
}

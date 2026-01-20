import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdBanner({ position }) {
  const [settings, setSettings] = useState({ ads_enabled: true, streamer_mode: false });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      setSettings(response.data);
    } catch (err) {
      console.error('Failed to fetch ad settings:', err);
    }
  };

  if (!settings.ads_enabled || settings.streamer_mode) {
    return null;
  }

  const heights = {
    header: 'h-20',
    'below-counter': 'h-32',
    footer: 'h-24',
  };

  const positions = {
    header: 'Header Advertisement',
    'below-counter': 'Advertisement',
    footer: 'Footer Advertisement',
  };

  return (
    <div
      className={`w-full ${heights[position]} bg-[#1A1A1A]/30 border border-[#262626]/50 rounded-lg flex items-center justify-center my-6`}
      data-testid={`ad-banner-${position}`}
    >
      <div className="text-center">
        <p className="text-gray-600 text-xs uppercase tracking-widest">
          {positions[position]}
        </p>
        <p className="text-gray-700 text-xs mt-1">Your AdSense code here</p>
      </div>
    </div>
  );
}

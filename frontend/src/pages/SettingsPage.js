import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const GOOGLE_FONTS = [
  'JetBrains Mono',
  'Roboto Mono',
  'Source Code Pro',
  'Fira Code',
  'IBM Plex Mono',
  'Space Mono',
  'Courier Prime',
  'Anonymous Pro',
  'Ubuntu Mono',
  'Inconsolata',
  'PT Mono',
  'Overpass Mono',
  'Oxygen Mono',
  'Red Hat Mono',
  'DM Mono',
];

export default function SettingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fontFamily, setFontFamily] = useState('JetBrains Mono');
  const [fontSize, setFontSize] = useState(64);
  const [fontWeight, setFontWeight] = useState(700);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSettings();
  }, [user, navigate]);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/user/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const settings = response.data.font_settings;
      setFontFamily(settings.font_family);
      setFontSize(settings.font_size);
      setFontWeight(settings.font_weight);
    } catch (err) {
      toast.error('Failed to load settings');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/user/font-settings`,
        {
          font_family: fontFamily,
          font_size: fontSize,
          font_weight: fontWeight,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Settings saved successfully!');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050505] noise-bg">
      <nav className="border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold" style={{ fontFamily: 'Outfit' }}>
              <span className="text-[#00F0FF]">Stream</span>Count.live
            </Link>
            <Link to="/counter">
              <Button variant="ghost" className="text-white hover:text-[#00F0FF]">
                Back to Counter
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Outfit' }}>
          Font Customization
        </h1>

        <div className="glass rounded-2xl p-8 space-y-8">
          <div>
            <label className="block text-sm font-medium mb-3">Font Family</label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger className="w-full bg-[#171717] border-[#262626] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0A0A0A] border-[#262626] text-white">
                {GOOGLE_FONTS.map((font) => (
                  <SelectItem key={font} value={font} className="hover:bg-[#171717]">
                    <span style={{ fontFamily: font }}>{font}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              Font Size: {fontSize}px
            </label>
            <Slider
              value={[fontSize]}
              onValueChange={(values) => setFontSize(values[0])}
              min={32}
              max={128}
              step={4}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              Font Weight: {fontWeight}
            </label>
            <Slider
              value={[fontWeight]}
              onValueChange={(values) => setFontWeight(values[0])}
              min={400}
              max={900}
              step={100}
              className="w-full"
            />
          </div>

          <div className="border-t border-[#262626] pt-6">
            <p className="text-sm text-gray-400 mb-4">Preview:</p>
            <div
              className="text-center py-8 bg-[#0A0A0A] rounded-lg"
              style={{
                fontFamily: fontFamily,
                fontSize: `${Math.min(fontSize, 48)}px`,
                fontWeight: fontWeight,
              }}
            >
              123,456
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-[#00F0FF] hover:bg-[#00D0DD] text-black font-semibold"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}

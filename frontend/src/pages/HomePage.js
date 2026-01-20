import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Users, Eye, ThumbsUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import AdBanner from '../components/AdBanner';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#050505] noise-bg">
      {/* Header Ad */}
      <AdBanner position="header" />

      {/* Navigation */}
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
                      window.location.reload();
                    }}
                    variant="ghost"
                    className="text-white hover:text-[#00F0FF]"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-white hover:text-[#00F0FF]">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-[#00F0FF] hover:bg-[#00D0DD] text-black font-semibold">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1762278804821-0dbf2b16ddaf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHwzfHxhYnN0cmFjdCUyMGRpZ2l0YWwlMjB0ZWNobm9sb2d5JTIwYmFja2dyb3VuZCUyMGRhcmslMjBtaW5pbWFsaXN0fGVufDB8fHx8MTc2ODcxNzQ1Nnww&ixlib=rb-4.1.0&q=85)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(0, 240, 255, 0.15) 0%, rgba(5, 5, 5, 0) 70%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
              style={{ fontFamily: 'Outfit' }}
            >
              Live YouTube Counter
              <br />
              <span className="text-[#00F0FF]">For Streamers</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Display real-time subscriber counts, views, and likes during your livestreams.
              Fullscreen mode. OBS ready. Professional design.
            </p>
            <Button
              onClick={() => navigate('/counter')}
              size="lg"
              className="bg-[#00F0FF] hover:bg-[#00D0DD] text-black font-bold text-lg px-8 py-6 rounded-lg"
              data-testid="get-started-btn"
            >
              <Play className="mr-2" />
              Start Counter
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: 'Outfit' }}>
          Features Built for Streamers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Users className="w-8 h-8 text-[#00F0FF]" />}
            title="Subscriber Count"
            description="Track live subscriber growth"
          />
          <FeatureCard
            icon={<Eye className="w-8 h-8 text-[#00F0FF]" />}
            title="View Counter"
            description="Monitor total views in real-time"
          />
          <FeatureCard
            icon={<ThumbsUp className="w-8 h-8 text-[#00F0FF]" />}
            title="Like Counter"
            description="See engagement as it happens"
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8 text-[#00F0FF]" />}
            title="Auto Refresh"
            description="Updates automatically every 5s"
          />
        </div>
      </div>

      {/* Below Counter Ad */}
      <AdBanner position="below-counter" />

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="glass rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Outfit' }}>
            Ready to elevate your stream?
          </h2>
          <p className="text-gray-400 mb-8">
            {user
              ? 'Go to settings to customize your counter fonts and appearance'
              : 'Sign up to unlock custom fonts and save your preferences'}
          </p>
          <Button
            onClick={() => navigate(user ? '/settings' : '/register')}
            size="lg"
            className="bg-[#00F0FF] hover:bg-[#00D0DD] text-black font-bold"
          >
            {user ? 'Customize Fonts' : 'Create Free Account'}
          </Button>
        </div>
      </div>

      {/* Footer Ad */}
      <AdBanner position="footer" />

      {/* Footer */}
      <footer className="border-t border-[#262626] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>&copy; 2025 StreamCount.live. Built for content creators.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-6 hover:border-[#00F0FF] transition-colors"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Outfit' }}>
        {title}
      </h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </motion.div>
  );
}

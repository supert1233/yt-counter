import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveCounter({ stats, fontSettings, obsMode = false }) {
  const defaultFont = {
    font_family: 'JetBrains Mono',
    font_size: 64,
    font_weight: 700,
  };

  const font = fontSettings || defaultFont;

  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toLocaleString();
  };

  const containerClass = obsMode
    ? 'w-full'
    : 'bg-[#0A0A0A] border border-[#262626] rounded-xl p-8';

  if (stats.type === 'channel') {
    return (
      <div className={containerClass}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard
            label="Subscribers"
            value={formatNumber(stats.subscriber_count)}
            font={font}
            color="#00F0FF"
            hidden={stats.hidden_subscriber_count}
          />
          <StatCard
            label="Total Views"
            value={formatNumber(stats.view_count)}
            font={font}
            color="#7000FF"
          />
          <StatCard
            label="Videos"
            value={formatNumber(stats.video_count)}
            font={font}
            color="#00F0FF"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          label="Views"
          value={formatNumber(stats.view_count)}
          font={font}
          color="#00F0FF"
        />
        <StatCard
          label="Likes"
          value={formatNumber(stats.like_count)}
          font={font}
          color="#7000FF"
        />
        <StatCard
          label="Comments"
          value={formatNumber(stats.comment_count)}
          font={font}
          color="#00F0FF"
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, font, color, hidden = false }) {
  return (
    <div className="text-center" data-testid={`stat-${label.toLowerCase()}`}>
      <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider">{label}</p>
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: 'circOut' }}
          style={{
            fontFamily: font.font_family,
            fontSize: `${font.font_size}px`,
            fontWeight: font.font_weight,
            color: color,
            textShadow: `0 0 20px ${color}40`,
          }}
          className="leading-none"
        >
          {hidden ? 'Hidden' : value}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

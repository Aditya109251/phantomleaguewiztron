import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Shield, Users } from 'lucide-react';
import { GAMES_CONFIG } from '../constants';

export const StatsSection = () => {
  const [stats, setStats] = useState([
    { label: 'Total Players', value: '0', icon: <Shield className="w-5 h-5" /> },
    { label: 'Slots Left', value: 'Loading...', icon: <Users className="w-5 h-5" /> },
    { label: 'Total Registrations', value: '0', icon: <Trophy className="w-5 h-5" /> },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/registrations/count');
        const result = await response.json();

        if (!result.success) throw new Error(result.error);

        const data = result.data;
        const totalPlayers = data.length;
        
        // Total slots across all games: 320
        const totalSlots = 320; 
        const slotsLeft = Math.max(0, totalSlots - totalPlayers);

        setStats([
          { label: 'Total Players', value: totalPlayers.toString(), icon: <Shield className="w-5 h-5" /> },
          { label: 'Slots Left', value: slotsLeft.toString(), icon: <Users className="w-5 h-5" /> },
          { label: 'Total Registrations', value: totalPlayers.toString(), icon: <Trophy className="w-5 h-5" /> },
        ]);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: true }}
          className="glass-card p-6 text-center border-white/5 hover:border-cyber-blue/30 transition-colors group"
        >
          <div className="inline-flex p-3 rounded-xl bg-white/5 text-cyber-blue mb-4 group-hover:scale-110 transition-transform">
            {stat.icon}
          </div>
          <div className="text-2xl md:text-3xl font-display font-black neon-text-blue mb-1">
            {stat.value}
          </div>
          <div className="text-[10px] md:text-xs uppercase tracking-widest text-white/40 font-display">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

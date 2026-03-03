import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Alex 'Shadow' Rivera",
    role: "Pro BGMI Player",
    text: "Phantom League is where the real competition happens. The organization and the skill level are unmatched in the collegiate scene.",
    avatar: "https://picsum.photos/seed/player1/100/100"
  },
  {
    name: "Sarah Jenkins",
    role: "COD Mobile Champion",
    text: "I've played in many tournaments, but the futuristic vibe and smooth execution of Phantom League make it my favorite.",
    avatar: "https://picsum.photos/seed/player2/100/100"
  },
  {
    name: "Vikram Singh",
    role: "Free Fire Strategist",
    text: "The 1v1 challenges are a game-changer. It's pure adrenaline and a great way to prove your individual skill.",
    avatar: "https://picsum.photos/seed/player3/100/100"
  }
];

export const Testimonials = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {testimonials.map((t, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="glass-card p-8 relative group"
        >
          <Quote className="absolute top-6 right-8 w-12 h-12 text-white/5 group-hover:text-cyber-blue/10 transition-colors" />
          <div className="flex items-center gap-4 mb-6">
            <img 
              src={t.avatar} 
              alt={t.name} 
              className="w-12 h-12 rounded-full border-2 border-cyber-blue/30"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 className="font-display text-sm text-white">{t.name}</h4>
              <p className="text-[10px] uppercase tracking-widest text-cyber-blue">{t.role}</p>
            </div>
          </div>
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-cyber-blue text-cyber-blue" />
            ))}
          </div>
          <p className="text-sm text-white/60 italic leading-relaxed">
            "{t.text}"
          </p>
        </motion.div>
      ))}
    </div>
  );
};

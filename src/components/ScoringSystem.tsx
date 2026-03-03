import React from 'react';
import { Trophy, Target } from 'lucide-react';

const points = [
  { pos: '1st', pts: 10 },
  { pos: '2nd', pts: 6 },
  { pos: '3rd', pts: 5 },
  { pos: '4th', pts: 4 },
  { pos: '5th', pts: 3 },
  { pos: '6th', pts: 2 },
  { pos: '7th', pts: 1 },
  { pos: '8th', pts: 1 },
];

export const ScoringSystem = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="glass-card p-6 border-cyber-blue/20">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-cyber-blue" />
          <h3 className="text-xl font-display">Placement Points</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {points.map((item) => (
            <div key={item.pos} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
              <span className="font-display text-white/60">{item.pos}</span>
              <span className="font-display font-bold text-cyber-blue">{item.pts} PTS</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6 border-cyber-purple/20">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-cyber-purple" />
          <h3 className="text-xl font-display">Kill Points</h3>
        </div>
        <div className="flex flex-col items-center justify-center h-[240px] bg-white/5 rounded-lg border border-white/5 text-center p-6">
          <div className="text-6xl font-display font-black neon-text-purple mb-4">1</div>
          <div className="text-xl font-display uppercase tracking-widest text-white/80">Point Per Kill</div>
          <p className="mt-4 text-sm text-white/50 max-w-[200px]">
            Aggression is rewarded. Every elimination counts towards your total score.
          </p>
        </div>
      </div>
    </div>
  );
};

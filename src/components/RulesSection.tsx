import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Shield, Smartphone, Zap, AlertTriangle } from 'lucide-react';

const rules = [
  {
    title: 'General Rules',
    icon: <Zap className="w-5 h-5 text-cyber-blue" />,
    content: [
      'Tournament Mode: On-site',
      'Entry Fee: ₹100 per game/category/person (₹50 for 1v1)',
      'Each player must register individually. For team games, use the same Squad Name.',
      'Game settings will be shared after registration',
      'Reporting time is mandatory (15 mins before match)',
      'Internet and device stability is the player\'s responsibility',
      'Organizers reserve the right to modify rules if necessary',
      'All decisions by organizers are final and binding'
    ]
  },
  {
    title: 'Device Policy',
    icon: <Smartphone className="w-5 h-5 text-cyber-purple" />,
    content: [
      'Only mobile devices (Android/iOS) are allowed',
      'No Emulators allowed (Immediate disqualification)',
      'No iPads or Tablets allowed for competitive integrity'
    ]
  },
  {
    title: 'Fair Play',
    icon: <Shield className="w-5 h-5 text-cyber-blue" />,
    content: [
      'No hacks, scripts, or third-party tools allowed',
      'Teaming with other squads will lead to immediate ban',
      'Toxic behavior or abusive language will not be tolerated',
      'Players must use their registered IGN and UID'
    ]
  },
  {
    title: 'Disconnection Policy',
    icon: <AlertTriangle className="w-5 h-5 text-cyber-pink" />,
    content: [
      'Squads may continue at a disadvantage if a player disconnects',
      'If more than 50% of the lobby disconnects due to server issues, a rematch will be considered',
      'No rematches for individual connection issues'
    ]
  }
];

export const RulesSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {rules.map((rule, index) => (
        <div key={index} className="glass-card overflow-hidden border-white/5">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              {rule.icon}
              <h3 className="text-lg font-display text-white/90">{rule.title}</h3>
            </div>
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-6 pb-6 pt-2">
                  <ul className="space-y-3">
                    {rule.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/70 text-sm">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyber-blue shadow-[0_0_5px_rgba(0,242,255,0.8)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

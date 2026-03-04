/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { 
  Zap, 
  Trophy, 
  Target, 
  Gamepad2, 
  ChevronRight, 
  ShieldCheck,
  Users,
  Timer,
  ArrowRight,
  Smartphone
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CountdownTimer } from './components/CountdownTimer';
import { RegistrationForm } from './components/RegistrationForm';
import { RulesSection } from './components/RulesSection';
import { ScoringSystem } from './components/ScoringSystem';
import { StatsSection } from './components/StatsSection';
import { Testimonials } from './components/Testimonials';
import { GAMES_CONFIG } from './constants';
import { cn } from './lib/utils';

export default function App() {
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Fetch pictures on mount
  useEffect(() => {
    fetchPictures();
  }, []);

  const fetchPictures = async () => {
    try {
      const response = await fetch('/api/pictures');
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error('Server returned non-JSON response:', text);
        return;
      }
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      const data = result.data;
      if (data) {
        setOrganizers(data.filter((p: any) => p.keyword === 'main'));
        setSponsors(data.filter((p: any) => p.keyword === 'Sponsors'));
      }
    } catch (err) {
      console.error('Error fetching pictures:', err);
    }
  };

  return (
    <div className="relative overflow-x-hidden">
      <Navbar />

      {/* Cinematic Background */}
      <div className="fixed inset-0 -z-10 bg-cyber-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.05),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyber-blue/20 blur-[120px] rounded-full animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyber-purple/20 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent:80%)]" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
        <motion.div 
          style={{ opacity, scale }}
          className="text-center z-10 max-w-5xl mx-auto"
        >
          {/* Organizers in Header */}
          {organizers.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-6 mb-8"
            >
              {organizers.map((org, i) => (
                <img 
                  key={i} 
                  src={org.url} 
                  alt="Organizer" 
                  className="h-12 md:h-16 object-contain opacity-70 hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse shadow-[0_0_8px_rgba(0,242,255,1)]" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-display text-white/70">Wiztron Club Presents</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-6xl md:text-9xl font-display font-black mb-6 leading-none tracking-tighter"
          >
            PHANTOM<br />
            <span className="neon-text-blue">LEAGUE</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-2xl font-display uppercase tracking-[0.4em] text-white/50 mb-12"
          >
            Only Skill. <span className="text-cyber-purple">No Luck.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <button 
              onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary group"
            >
              <span className="flex items-center gap-2">
                REGISTER NOW
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button 
              onClick={() => document.getElementById('rules')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary"
            >
              VIEW RULES
            </button>
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full border-dashed"
          />
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
        >
          <span className="text-[10px] uppercase tracking-widest font-display">Scroll to Explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-cyber-blue to-transparent" />
        </motion.div>
      </section>

      {/* Countdown Section */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-sm font-display uppercase tracking-[0.5em] text-cyber-blue mb-4">Battle Begins In</h2>
            <CountdownTimer />
          </div>
          <StatsSection />
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <h2 className="text-4xl md:text-6xl font-display font-black mb-4">
                THE <span className="neon-text-purple">ARENAS</span>
              </h2>
              <p className="text-white/50 max-w-xl">
                Compete in the most popular mobile titles. High stakes, professional production, and pure skill-based matchmaking.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-display uppercase tracking-widest text-white/40">
              <span className="flex items-center gap-2"><Smartphone className="w-4 h-4" /> Mobile Only</span>
              <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Anti-Cheat</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {GAMES_CONFIG.map((game, idx) => (
              <GameCard 
                key={game.name}
                title={game.name} 
                image={game.image}
                categories={game.categories.map(c => c.name)}
                color={idx === 0 ? 'blue' : idx === 1 ? 'purple' : 'pink'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="register" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-cyber-blue/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-black mb-6">
              SECURE YOUR <span className="neon-text-blue">SLOT</span>
            </h2>
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-cyber-blue/10 border border-cyber-blue/20 text-cyber-blue font-display text-xs uppercase tracking-widest">
              <Timer className="w-4 h-4 animate-pulse" />
              Limited Slots Left. Register Immediately.
            </div>
          </div>
          <RegistrationForm />
        </div>
      </section>

      {/* Rules & Scoring */}
      <section id="rules" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-4xl font-display font-black mb-10">
                TOURNAMENT <span className="neon-text-blue">RULES</span>
              </h2>
              <RulesSection />
            </div>
            <div id="scoring">
              <h2 className="text-4xl font-display font-black mb-10">
                SCORING <span className="neon-text-purple">SYSTEM</span>
              </h2>
              <ScoringSystem />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-display font-black mb-4">PLAYER <span className="neon-text-blue">VOICES</span></h2>
            <p className="text-white/40 uppercase tracking-widest text-xs">What the community says about us</p>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* Sponsors Section */}
      {sponsors.length > 0 && (
        <section className="py-32 px-6 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-display font-black mb-4">OUR <span className="neon-text-purple">SPONSORS</span></h2>
              <div className="w-24 h-1 bg-cyber-purple mx-auto rounded-full" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
              {sponsors.map((sponsor, i) => (
                <motion.img 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  src={sponsor.url} 
                  alt="Sponsor" 
                  className="h-12 md:h-20 object-contain grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto glass-card p-12 md:p-20 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/10 to-cyber-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-display font-black mb-8 leading-tight">
              READY TO BECOME<br />A <span className="neon-text-blue">LEGEND?</span>
            </h2>
            <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
              Don't just watch from the sidelines. Step into the arena and prove your worth against the best.
            </p>
            <button 
              onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary px-12 py-6 text-xl"
            >
              JOIN THE LEAGUE
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const GameCard: React.FC<{ title: string; image: string; categories: string[]; color: 'blue' | 'purple' | 'pink' }> = ({ title, image, categories, color }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass-card group overflow-hidden border-white/5 hover:border-white/20 transition-all duration-500"
  >
    <div className="relative h-64 overflow-hidden">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark to-transparent" />
      <div className="absolute bottom-6 left-6">
        <h3 className={cn(
          "text-3xl font-display font-black",
          color === 'blue' ? "neon-text-blue" : color === 'purple' ? "neon-text-purple" : "text-cyber-pink drop-shadow-[0_0_8px_rgba(255,0,255,0.5)]"
        )}>
          {title}
        </h3>
      </div>
    </div>
    <div className="p-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((cat, i) => (
          <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-white/60">
            {cat}
          </span>
        ))}
      </div>
      <button 
        onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
        className="mt-8 flex items-center gap-2 text-xs font-display uppercase tracking-widest text-white/40 group-hover:text-white transition-colors"
      >
        Register Now <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
      </button>
    </div>
  </motion.div>
);

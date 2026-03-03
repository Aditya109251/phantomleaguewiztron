import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  ShieldCheck, 
  LayoutDashboard, 
  Menu, 
  X,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Games', href: '#games' },
    { name: 'Rules', href: '#rules' },
    { name: 'Scoring', href: '#scoring' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b",
      isScrolled 
        ? "bg-cyber-dark/80 backdrop-blur-lg py-3 border-white/10" 
        : "bg-transparent py-6 border-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 bg-cyber-blue rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(0,242,255,0.4)]">
            <Zap className="text-black w-6 h-6 fill-black" />
          </div>
          <span className="text-xl font-display font-black tracking-tighter">
            PHANTOM<span className="text-cyber-blue">LEAGUE</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-sm font-display uppercase tracking-widest text-white/70 hover:text-cyber-blue transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full text-xs font-display uppercase tracking-widest transition-all"
          >
            Register
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cyber-dark border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-display uppercase tracking-widest text-white/70"
                >
                  {link.name}
                </a>
              ))}
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary w-full"
              >
                Register Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const AnimatePresenceWrapper = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone 
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-cyber-dark border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cyber-blue rounded flex items-center justify-center">
                <Zap className="text-black w-5 h-5 fill-black" />
              </div>
              <span className="text-xl font-display font-black">
                PHANTOM<span className="text-cyber-blue">LEAGUE</span>
              </span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              The ultimate collegiate esports experience. Organized by Wiztron Club, CGC University Mohali.
            </p>
            <div className="flex gap-4">
              <SocialIcon 
                icon={<Instagram className="w-5 h-5" />} 
                href="https://www.instagram.com/cgcuniversity_wiztron?igsh=MWpsbXg0eTRlcDFiNA==" 
              />
              <SocialIcon 
                icon={<Facebook className="w-5 h-5" />} 
                href="https://www.facebook.com/share/18JwBeiqwW/" 
              />
              <SocialIcon 
                icon={<Linkedin className="w-5 h-5" />} 
                href="https://www.linkedin.com/in/wiztron-club-85870b370?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-display mb-6 text-white">Quick Links</h4>
            <ul className="space-y-4">
              <FooterLink label="Registration" href="#register" />
              <FooterLink label="Tournament Rules" href="#rules" />
              <FooterLink label="Scoring System" href="#scoring" />
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-display mb-6 text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/40">
                <Mail className="w-4 h-4 text-cyber-blue mt-1" />
                <span>wiztronclub@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/40">
                <Phone className="w-4 h-4 text-cyber-blue mt-1" />
                <span>+91 96229 27636</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/40">
                <MapPin className="w-4 h-4 text-cyber-blue mt-1" />
                <span>CGC University, Mohali, Punjab</span>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-display mb-6 text-white">Event Info</h4>
            <p className="text-xs text-white/40 mb-4 uppercase tracking-widest">Join our community for live updates</p>
            <div className="space-y-2">
              <p className="text-[10px] text-white/30 uppercase tracking-tighter">Follow us on Instagram for latest announcements and match schedules.</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-white/20 font-display">
          <p>© 2026 Phantom League. All Rights Reserved.</p>
          <p>Designed by Wiztron Club</p>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, href }: { icon: React.ReactNode; href: string }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-cyber-blue hover:border-cyber-blue transition-all"
  >
    {icon}
  </a>
);

const FooterLink = ({ label, href }: { label: string; href: string }) => (
  <li>
    <a href={href} className="text-sm text-white/40 hover:text-cyber-blue transition-colors">
      {label}
    </a>
  </li>
);

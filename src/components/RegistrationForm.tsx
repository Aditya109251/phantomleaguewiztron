import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';
import { CheckCircle2, Loader2, Users, User, CreditCard, Trophy, ChevronRight, ExternalLink, AlertTriangle } from 'lucide-react';
import { GAMES_CONFIG, Game, Category } from '../constants';
import { cn, formatCurrency } from '../lib/utils';
import ReactConfetti from 'react-confetti';

interface FormData {
  game: Game;
  category: Category;
  teamName: string;
  playerName: string;
  contactNumber: string;
  email: string;
  uid: string;
  university: string;
  college: string;
  rollNo: string;
  branch: string;
  section: string;
}

export const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [regId, setRegId] = useState('');
  const [slotCounts, setSlotCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchSlotCounts();
    
    // Check if returning from payment
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');
    if (orderId) {
      setRegId(orderId);
      setIsSuccess(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchSlotCounts = async () => {
    try {
      const response = await fetch('/api/registrations/count');
      const result = await response.json();
      
      if (!result.success) throw new Error(result.error);

      const counts: Record<string, number> = {};
      result.data.forEach((reg: any) => {
        const key = `${reg.game}-${reg.category}`;
        counts[key] = (counts[key] || 0) + 1;
      });
      setSlotCounts(counts);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const { register, handleSubmit, watch, setValue, reset, trigger, formState: { errors } } = useForm<FormData>();

  const gameConfig = GAMES_CONFIG.find(g => g.name === selectedGame);
  const categoryConfig = gameConfig?.categories.find(c => c.name === selectedCategory);

  const totalFee = categoryConfig?.fee || 0;

  const onSubmit = async (data: FormData) => {
    console.log('onSubmit triggered with data:', data);
    setIsSubmitting(true);
    try {
      const uniqueId = `PL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      // 1. Save to Neon DB via backend
      console.log('Saving to Neon DB...');
      const dbResponse = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: uniqueId,
          game: selectedGame,
          category: selectedCategory,
          team_name: data.teamName || data.playerName,
          player_name: data.playerName,
          contact_number: data.contactNumber,
          email: data.email,
          uid: data.uid,
          university: data.university,
          college: data.college,
          roll_no: data.rollNo,
          branch: data.branch,
          section: data.section,
          payment_status: 'PENDING'
        })
      });

      const dbResult = await dbResponse.json();
      if (!dbResult.success) {
        console.error('DB Error:', dbResult.error);
        throw new Error(`Database Error: ${dbResult.error}. Please ensure your Neon DB table 'registrations' is created.`);
      }

      // 2. Create Cashfree Order
      try {
        console.log('Initiating Cashfree order for:', uniqueId);
        const cfResponse = await fetch('/api/create-cashfree-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: totalFee,
            customerName: data.playerName,
            customerEmail: data.email,
            customerPhone: data.contactNumber,
            orderId: uniqueId
          })
        });

        if (!cfResponse.ok) {
          const errorData = await cfResponse.json().catch(() => ({}));
          throw new Error(errorData.error || `Server Error: ${cfResponse.statusText}`);
        }

        const cfData = await cfResponse.json();
        console.log('Cashfree API response:', cfData);
        
        if (cfData.success && cfData.payment_session_id) {
          // Use Cashfree SDK (loaded in index.html)
          const Cashfree = (window as any).Cashfree;
          if (Cashfree) {
            const cashfree = Cashfree({
              mode: cfData.is_production ? 'production' : 'sandbox'
            });
            console.log('Opening Cashfree checkout...');
            await cashfree.checkout({
              paymentSessionId: cfData.payment_session_id,
              redirectTarget: "_self"
            });
          } else {
            throw new Error("Cashfree SDK not loaded. Please refresh and try again.");
          }
        } else {
          throw new Error(cfData.error || "Failed to initiate payment session");
        }
      } catch (cfErr: any) {
        console.error('Cashfree initiation failed:', cfErr);
        throw new Error(`Payment Error: ${cfErr.message}`);
      }

      setRegId(uniqueId);
      setIsSuccess(true);
    } catch (error: any) {
      console.error('Registration failed:', error);
      alert(error.message || 'An unexpected error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-8 text-center border-cyber-blue/50"
      >
        <ReactConfetti numberOfPieces={200} recycle={false} />
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-cyber-blue/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-cyber-blue" />
          </div>
        </div>
        <h2 className="text-3xl font-display mb-2">Registration Confirmed!</h2>
        <p className="text-white/60 mb-8">Your spot has been secured. Welcome to the Phantom League!</p>
        
        <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-8">
          <div className="text-xs uppercase tracking-widest text-white/40 mb-1">Registration ID</div>
          <div className="text-2xl font-display neon-text-blue">{regId}</div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-sm border-b border-white/5 pb-2">
            <span className="text-white/50">Payment Status</span>
            <span className="font-bold text-emerald-400 uppercase tracking-widest">Verified</span>
          </div>
          <p className="text-xs text-white/40 italic">
            * Check your email for further tournament details.
          </p>
        </div>

        <button 
          onClick={() => {
            setIsSuccess(false);
            setStep(1);
            setSelectedGame(null);
            setSelectedCategory(null);
            reset();
          }}
          className="btn-primary w-full mt-8"
        >
          REGISTER ANOTHER
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 md:p-10 border-white/5">
      {/* Global Notice */}
      <div className="mb-8 p-4 bg-cyber-blue/5 border border-cyber-blue/20 rounded-xl flex items-start gap-4">
        <div className="p-2 bg-cyber-blue/10 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-cyber-blue" />
        </div>
        <div>
          <p className="text-xs font-display uppercase tracking-widest text-cyber-blue mb-1">Registration Notice</p>
          <p className="text-[11px] text-white/60 leading-relaxed">
            Register as an <span className="text-white font-bold">individual player</span>. 
            For team games, ensure all members use the <span className="text-white font-bold">exact same Squad Name</span> to be grouped together.
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-10">
        {[1, 2, 3, 4].map((s) => (
          <div 
            key={s} 
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-500",
              step >= s ? "bg-cyber-blue shadow-[0_0_10px_rgba(0,242,255,0.5)]" : "bg-white/10"
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-display mb-2">Select Your Game</h3>
              <p className="text-white/50">Choose the battlefield where you reign supreme.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {GAMES_CONFIG.map((game) => (
                <button
                  key={game.name}
                  type="button"
                  onClick={() => {
                    setSelectedGame(game.name);
                    setSelectedCategory(null);
                    setStep(2);
                  }}
                  className={cn(
                    "group relative overflow-hidden p-6 rounded-xl border-2 transition-all duration-300 text-left",
                    selectedGame === game.name 
                      ? "border-cyber-blue bg-cyber-blue/10" 
                      : "border-white/5 bg-white/5 hover:border-white/20"
                  )}
                >
                  <div className="relative z-10">
                    <h4 className="text-xl font-display mb-1">{game.name}</h4>
                    <p className="text-xs text-white/40 uppercase tracking-tighter">
                      {game.categories.length} Categories Available
                    </p>
                  </div>
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
                    <img 
                      src={game.image} 
                      alt={game.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-display mb-2">{selectedGame} Categories</h3>
              <p className="text-white/50">Select your preferred tournament format.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {gameConfig?.categories.map((cat) => {
                const currentSlots = slotCounts[`${selectedGame}-${cat.name}`] || 0;
                const isFull = currentSlots >= cat.maxSlots;

                return (
                  <button
                    key={cat.name}
                    type="button"
                    disabled={isFull}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setStep(3);
                    }}
                    className={cn(
                      "flex items-center justify-between p-5 rounded-xl border-2 transition-all duration-300",
                      selectedCategory === cat.name 
                        ? "border-cyber-purple bg-cyber-purple/10" 
                        : isFull 
                          ? "border-white/5 bg-white/5 opacity-50 cursor-not-allowed"
                          : "border-white/5 bg-white/5 hover:border-white/20"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        cat.isTeam ? "bg-cyber-blue/20 text-cyber-blue" : "bg-cyber-purple/20 text-cyber-purple"
                      )}>
                        {cat.isTeam ? <Users className="w-5 h-5" /> : <User className="w-5 h-5" />}
                      </div>
                      <div className="text-left">
                        <h4 className="font-display text-lg">{cat.name}</h4>
                        <p className={cn(
                          "text-xs uppercase tracking-widest font-bold",
                          isFull ? "text-red-500" : "text-cyber-blue"
                        )}>
                          {isFull ? "Slots Full" : `${cat.maxSlots - currentSlots} Slots Left`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-display neon-text-blue">{formatCurrency(cat.fee)}</div>
                      <div className="text-[10px] uppercase text-white/30">Entry Fee</div>
                    </div>
                  </button>
                );
              })}
            </div>
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="text-white/40 hover:text-white text-sm font-display uppercase tracking-widest w-full text-center mt-4"
            >
              ← Back to Games
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-display">{selectedGame}</h3>
                <p className="text-sm text-cyber-blue uppercase font-display">{selectedCategory}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/40 uppercase">Total Payable</p>
                <p className="text-2xl font-display neon-text-blue">{formatCurrency(totalFee)}</p>
              </div>
            </div>

            {/* Instruction Callout */}
            <div className="p-4 bg-cyber-blue/10 border border-cyber-blue/30 rounded-lg mb-6 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-cyber-blue shrink-0 mt-0.5" />
              <div className="text-xs text-white/80 leading-relaxed">
                <span className="text-cyber-blue font-bold uppercase block mb-1">Important Note:</span>
                Each registration is for a <span className="text-cyber-blue font-bold">single player</span> only. For team-based games, ensure all teammates use the <span className="text-cyber-blue font-bold">exact same Squad Name</span> to be grouped together.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/50 font-display">Team Name</label>
                <input 
                  {...register('teamName', { required: categoryConfig?.isTeam ? 'Team name is required' : false })}
                  className={cn(
                    "w-full bg-white/5 border rounded-lg px-4 py-3 focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue outline-none transition-all",
                    errors.teamName ? "border-red-500" : "border-white/10"
                  )}
                  placeholder={categoryConfig?.isTeam ? "Enter Squad Name (Teammates must use same name)" : "Enter 'Solo' or Team Name (Optional)"}
                />
                {errors.teamName && <p className="text-red-500 text-[10px] uppercase tracking-widest">{errors.teamName.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/50 font-display">Full Name</label>
                <input 
                  {...register('playerName', { required: 'Full name is required' })}
                  className={cn(
                    "w-full bg-white/5 border rounded-lg px-4 py-3 focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue outline-none transition-all",
                    errors.playerName ? "border-red-500" : "border-white/10"
                  )}
                  placeholder="Your full name"
                />
                {errors.playerName && <p className="text-red-500 text-[10px] uppercase tracking-widest">{errors.playerName.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/50 font-display">Contact Number (WhatsApp)</label>
                <input 
                  {...register('contactNumber', { 
                    required: 'Contact number is required',
                    pattern: { value: /^[0-9]{10}$/, message: 'Enter a valid 10-digit number' }
                  })}
                  className={cn(
                    "w-full bg-white/5 border rounded-lg px-4 py-3 focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue outline-none transition-all",
                    errors.contactNumber ? "border-red-500" : "border-white/10"
                  )}
                  placeholder="10-digit mobile number"
                />
                {errors.contactNumber && <p className="text-red-500 text-[10px] uppercase tracking-widest">{errors.contactNumber.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/50 font-display">Email Address</label>
                <input 
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email address' }
                  })}
                  className={cn(
                    "w-full bg-white/5 border rounded-lg px-4 py-3 focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue outline-none transition-all",
                    errors.email ? "border-red-500" : "border-white/10"
                  )}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-[10px] uppercase tracking-widest">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/50 font-display">University</label>
                <input 
                  {...register('university', { required: 'University is required' })}
                  className={cn(
                    "w-full bg-white/5 border rounded-lg px-4 py-3 focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue outline-none transition-all",
                    errors.university ? "border-red-500" : "border-white/10"
                  )}
                  placeholder="University name"
                />
                {errors.university && <p className="text-red-500 text-[10px] uppercase tracking-widest">{errors.university.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/50 font-display">College</label>
                <input 
                  {...register('college', { required: 'College is required' })}
                  className={cn(
                    "w-full bg-white/5 border rounded-lg px-4 py-3 focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue outline-none transition-all",
                    errors.college ? "border-red-500" : "border-white/10"
                  )}
                  placeholder="College name"
                />
                {errors.college && <p className="text-red-500 text-[10px] uppercase tracking-widest">{errors.college.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/50 font-display">Roll Number</label>
                <input 
                  {...register('rollNo', { required: 'Roll number is required' })}
                  className={cn(
                    "w-full bg-white/5 border rounded-lg px-4 py-3 focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue outline-none transition-all",
                    errors.rollNo ? "border-red-500" : "border-white/10"
                  )}
                  placeholder="Your roll no"
                />
                {errors.rollNo && <p className="text-red-500 text-[10px] uppercase tracking-widest">{errors.rollNo.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/50 font-display">Branch</label>
                <input 
                  {...register('branch', { required: 'Branch is required' })}
                  className={cn(
                    "w-full bg-white/5 border rounded-lg px-4 py-3 focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue outline-none transition-all",
                    errors.branch ? "border-red-500" : "border-white/10"
                  )}
                  placeholder="e.g. CSE, ECE"
                />
                {errors.branch && <p className="text-red-500 text-[10px] uppercase tracking-widest">{errors.branch.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/50 font-display">Section</label>
                <input 
                  {...register('section', { required: 'Section is required' })}
                  className={cn(
                    "w-full bg-white/5 border rounded-lg px-4 py-3 focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue outline-none transition-all",
                    errors.section ? "border-red-500" : "border-white/10"
                  )}
                  placeholder="e.g. A, B, C"
                />
                {errors.section && <p className="text-red-500 text-[10px] uppercase tracking-widest">{errors.section.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/50 font-display">Character ID (UID)</label>
                <input 
                  {...register('uid', { required: 'Game UID is required' })}
                  className={cn(
                    "w-full bg-white/5 border rounded-lg px-4 py-3 focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue outline-none transition-all",
                    errors.uid ? "border-red-500" : "border-white/10"
                  )}
                  placeholder="Your Game UID"
                />
                {errors.uid && <p className="text-red-500 text-[10px] uppercase tracking-widest">{errors.uid.message}</p>}
              </div>
            </div>

            <div className="pt-6 flex flex-col gap-4">
              {Object.keys(errors).length > 0 && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-xs uppercase tracking-widest text-center">
                  Please fix the errors in the form above
                </div>
              )}
              <button 
                type="button"
                onClick={async () => {
                  try {
                    const isValid = await trigger(['teamName', 'playerName', 'contactNumber', 'email', 'uid', 'university', 'college', 'rollNo', 'branch', 'section']);
                    if (isValid) {
                      setStep(4);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                      // Scroll to the first error
                      const firstError = document.querySelector('.text-red-500');
                      if (firstError) {
                        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }
                  } catch (err) {
                    console.error('Validation trigger failed');
                  }
                }}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                PROCEED TO PAYMENT <ChevronRight className="w-5 h-5" />
              </button>
              <button 
                type="button"
                onClick={() => setStep(2)}
                className="text-white/40 hover:text-white text-sm font-display uppercase tracking-widest w-full text-center"
              >
                ← Back to Categories
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-display mb-2">Final Step: Payment</h3>
              <p className="text-white/50">Click below to pay the entry fee and complete your registration.</p>
            </div>

            <div className="p-8 bg-white/5 rounded-2xl border border-white/10 text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-cyber-blue/10 rounded-full">
                  <CreditCard className="w-12 h-12 text-cyber-blue" />
                </div>
              </div>
              
              <div>
                <div className="text-4xl font-display neon-text-blue mb-1">₹{totalFee}</div>
                <p className="text-xs text-white/40 uppercase tracking-widest font-display">Entry Fee for {selectedGame}</p>
              </div>

              <div className="pt-4 space-y-4">
                {Object.keys(errors).length > 0 && (
                  <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-xs uppercase tracking-widest text-center">
                    Please fix the errors in the form
                  </div>
                )}
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,242,255,0.3)]"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      PAY NOW & REGISTER <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                
                <p className="text-[10px] text-white/30 uppercase tracking-widest leading-relaxed">
                  Clicking "Pay Now" will save your details and open the secure payment gateway.
                </p>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => setStep(3)}
              className="text-white/40 hover:text-white text-sm font-display uppercase tracking-widest w-full text-center"
            >
              ← Back to Details
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

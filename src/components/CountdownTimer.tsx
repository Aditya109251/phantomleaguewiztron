import React, { useState, useEffect } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { EVENT_DATE } from '../constants';

export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const days = differenceInDays(EVENT_DATE, now);
      const hours = differenceInHours(EVENT_DATE, now) % 24;
      const minutes = differenceInMinutes(EVENT_DATE, now) % 60;
      const seconds = differenceInSeconds(EVENT_DATE, now) % 60;

      if (differenceInSeconds(EVENT_DATE, now) <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-4 md:gap-8 justify-center items-center">
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Mins" />
      <TimeUnit value={timeLeft.seconds} label="Secs" />
    </div>
  );
};

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="glass-card w-16 h-16 md:w-24 md:h-24 flex items-center justify-center border-cyber-blue/30">
      <span className="text-2xl md:text-4xl font-display font-black neon-text-blue">
        {value.toString().padStart(2, '0')}
      </span>
    </div>
    <span className="mt-2 text-[10px] md:text-xs uppercase tracking-widest text-white/50 font-display">
      {label}
    </span>
  </div>
);

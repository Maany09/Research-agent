import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import glanceFeather from '../assets/glance-feather.png';

const steps = [
  "Understanding the question...",
  "Searching relevant information...",
  "Analyzing findings...",
  "Preparing your research report...",
];

export default function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center relative z-10">
      <motion.div 
        className="mb-10 relative"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
      >
        {/* Subtle glow directly behind the feather */}
        <div className="absolute inset-0 bg-brand-primary/10 rounded-full blur-2xl transform scale-150"></div>
        <img src={glanceFeather} alt="Loading" className="w-24 h-24 object-contain relative z-10 opacity-90 drop-shadow-sm" />
      </motion.div>

      <h2 className="font-display text-4xl text-brand-primary mb-6 drop-shadow-sm">Researching...</h2>
      
      <div className="h-8 relative w-full max-w-sm mx-auto overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-brand-text/70 text-lg font-medium absolute tracking-wide"
          >
            {steps[currentStep]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

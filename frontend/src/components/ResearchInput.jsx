import React, { useState } from 'react';
import { Search } from 'lucide-react';
import logoFeather from '../assets/logo-feather.png';

export default function ResearchInput({ onSubmit, isResearching }) {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim() && !isResearching) {
      onSubmit(topic.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col pt-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl text-brand-primary mb-4 font-medium tracking-tight">
          What do you want to <span className="relative inline-block whitespace-nowrap">
            research?
            <svg className="absolute -bottom-4 left-0 w-full h-4 text-brand-accent/90" viewBox="0 0 100 24" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2,20 Q50,-8 98,16" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </span>
        </h1>
        <p className="text-brand-muted text-lg mt-8 font-medium">
          Ask anything. The agent will search, analyze, and deliver comprehensive research.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative bg-brand-surface border border-brand-border/60 rounded-3xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-brand-primary/10 focus-within:border-brand-primary/40 transition-all duration-300">
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isResearching}
            placeholder="E.g., What are the latest advancements in quantum computing and how will it impact cybersecurity in the next decade?"
            className="w-full p-8 pb-24 min-h-[220px] text-lg bg-transparent resize-none outline-none disabled:opacity-50 placeholder:text-brand-muted/50 leading-relaxed font-medium"
          />
          
          <div className="absolute bottom-6 right-6 left-8 flex items-center justify-between">
            <div className="flex items-center gap-2 text-brand-muted/70 text-sm font-medium">
              <img src={logoFeather} alt="Enter" className="w-4 h-4 object-contain opacity-50 grayscale" />
              <span>Press Enter to research</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-xs text-brand-muted/50 font-medium tracking-wide">
                {topic.length} / 2000
              </span>
              <button
                type="submit"
                disabled={!topic.trim() || isResearching}
                className="flex items-center gap-2 bg-brand-accent hover:bg-brand-accent/90 text-white px-8 py-3 rounded-xl font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span>Research</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

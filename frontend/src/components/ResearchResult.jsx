import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Database, Link as LinkIcon, FileText, Lightbulb, Settings, Clock, Check, Plus } from 'lucide-react';
import glanceFeather from '../assets/glance-feather.png';

export default function ResearchResult({ result, onNewResearch }) {
  if (!result) return null;

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;  
    }
  };

  const completedDate = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
  const completedTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-accent" />
          <h2 className="text-xl font-bold text-brand-text">Research Results</h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold tracking-wide">
          <Check className="w-3.5 h-3.5" />
          <span>Research Completed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Main Content (Left Column) */}
        <div className="lg:col-span-8 flex flex-col bg-brand-surface border border-brand-border/60 rounded-3xl overflow-hidden shadow-sm">
          
          {/* Topic */}
          <div className="flex gap-6 p-8 border-b border-brand-border/40">
            <div className="w-12 h-12 rounded-full bg-brand-primary/5 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-brand-primary" />
            </div>
            <div className="pt-1">
              <h3 className="text-sm font-bold uppercase tracking-widest text-brand-muted mb-2">Topic</h3>
              <p className="text-xl font-medium text-brand-text leading-snug">{result.topic}</p>
            </div>
          </div>

          {/* Summary */}
          <div className="flex gap-6 p-8 border-b border-brand-border/40 bg-brand-primary/5">
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-brand-primary" />
            </div>
            <div className="pt-1 w-full">
              <h3 className="text-sm font-bold uppercase tracking-widest text-brand-muted mb-3">Summary</h3>
              <div className="prose prose-lg max-w-none text-brand-text leading-relaxed font-medium">
                {result.summary.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Sources */}
          {result.sources && result.sources.length > 0 && (
            <div className="flex gap-6 p-8 border-b border-brand-border/40">
              <div className="w-12 h-12 rounded-full bg-brand-accent/5 flex items-center justify-center flex-shrink-0">
                <LinkIcon className="w-5 h-5 text-brand-accent" />
              </div>
              <div className="pt-1 w-full">
                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-muted mb-4">Sources</h3>
                <ul className="space-y-3">
                  {result.sources.map((source, idx) => {
                    const isUrl = isValidUrl(source);
                    return (
                      <li key={idx}>
                        {isUrl ? (
                          <a
                            href={source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-brand-accent hover:text-brand-accent/80 transition-colors group text-sm font-medium"
                          >
                            <span className="break-all line-clamp-1">{source}</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 flex-shrink-0" />
                          </a>
                        ) : (
                          <div className="flex items-start gap-2 text-brand-text text-sm font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-muted/30 mt-1.5 flex-shrink-0"></span>
                            <span>{source}</span>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          {/* Analysis */}
          {result.analysis && (
            <div className="flex gap-6 p-8 border-b border-brand-border/40">
              <div className="w-12 h-12 rounded-full bg-brand-primary/5 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-brand-primary" />
              </div>
              <div className="pt-1 w-full">
                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-muted mb-3">Analysis</h3>
                <div className="text-brand-text/90 leading-relaxed font-medium text-sm">
                  {result.analysis.split('\n').map((paragraph, idx) => (
                    <p key={idx} className={idx !== 0 ? 'mt-4' : ''}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tools Used */}
          {result.tools_used && result.tools_used.length > 0 && (
            <div className="flex gap-6 p-8">
              <div className="w-12 h-12 rounded-full bg-brand-accent/5 flex items-center justify-center flex-shrink-0">
                <Settings className="w-5 h-5 text-brand-accent" />
              </div>
              <div className="pt-1 w-full flex flex-col justify-center">
                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-muted mb-3">Tools Used</h3>
                <div className="flex flex-wrap gap-2">
                  {result.tools_used.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-brand-bg border border-brand-border/60 text-brand-muted rounded-lg text-xs font-bold"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Aside Content (Right Column) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-brand-surface border border-brand-border/60 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center">
            
            <div className="mb-6 relative w-48 h-48 flex items-center justify-center">
              <div className="absolute inset-0 bg-brand-primary/5 rounded-full blur-2xl"></div>
              <img src={glanceFeather} alt="Research Graphic" className="w-full h-full object-contain relative z-10" />
            </div>

            <h3 className="font-display text-3xl text-brand-text mb-8">
              Research at a glance
            </h3>

            <div className="w-full space-y-6 text-left">
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-brand-muted mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-brand-text">Completed</p>
                  <p className="text-sm text-brand-muted mt-0.5">{completedDate} &middot; {completedTime}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <FileText className="w-5 h-5 text-brand-accent mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-brand-text">Sources Found</p>
                  <p className="text-sm text-brand-muted mt-0.5">{result.sources?.length || 0}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Settings className="w-5 h-5 text-brand-muted mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-brand-text">Tools Used</p>
                  <p className="text-sm text-brand-muted mt-0.5">{result.tools_used?.length || 0}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={onNewResearch}
              className="mt-10 w-full flex items-center justify-center gap-2 bg-transparent border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>New Research</span>
            </button>
          </div>
          
          <div className="bg-brand-accent/5 border border-brand-accent/10 rounded-2xl p-5 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
            <p className="text-xs text-brand-text font-medium leading-relaxed">
              <span className="font-bold text-brand-accent block mb-1">Tip:</span>
              Click on any source link to explore more details. Save this research for future reference.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

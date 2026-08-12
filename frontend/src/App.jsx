import React, { useState } from 'react';
import ResearchInput from './components/ResearchInput';
import LoadingState from './components/LoadingState';
import ResearchResult from './components/ResearchResult';
import { submitResearch, saveResearch } from './services/api';
import { AlertCircle, Search, Clock, Bookmark, Sun, Menu, X } from 'lucide-react';
import logoFeather from './assets/logo-feather.png';

function App() {
  const [isResearching, setIsResearching] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleResearch = async (topic) => {
    setIsResearching(true);
    setError(null);
    setResult(null);
    setSaveMessage('');
    setMobileMenuOpen(false);

    try {
      const response = await submitResearch(topic);
      setResult(response);
    } catch (err) {
      setError(err.message || 'Something went wrong while researching this topic. Please try again.');
    } finally {
      setIsResearching(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      const textToSave = `## Topic\n${result.topic}\n\n## Summary\n${result.summary}\n\n## Sources\n${result.sources.join('\n')}\n\n## Analysis\n${result.analysis}\n\n## Tools Used\n${result.tools_used.join('\n')}`;
      await saveResearch(textToSave);
      setSaveMessage('Research saved successfully.');
    } catch (err) {
      setSaveMessage('Failed to save research.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleNewResearch = () => {
    setResult(null);
    setError(null);
    setSaveMessage('');
    setMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-brand-bg px-6 py-8">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-12 cursor-pointer" onClick={handleNewResearch}>
        <img src={logoFeather} alt="Research Agent Logo" className="w-10 h-10 object-contain flex-shrink-0" />
        <span className="font-display text-3xl text-brand-primary mt-2">Research Agent</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <button 
          onClick={handleNewResearch}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-primary/5 text-brand-primary font-medium border border-brand-primary/10 transition-all hover:bg-brand-primary/10"
        >
          <Search className="w-4 h-4" />
          <span>New Research</span>
        </button>
      </nav>
      
      {/* Decorative Quote (Optional, subtle) */}
      <div className="mt-auto pt-8 border-t border-brand-border/40">
        <div className="bg-brand-primary/5 p-5 rounded-2xl border border-brand-border/30">
          <p className="text-sm text-brand-text leading-relaxed font-medium">
            "Research is creating new knowledge."
          </p>
          <p className="text-brand-primary font-display text-lg mt-2 text-right opacity-80">
            - Neil Armstrong
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-surface flex font-sans text-brand-text overflow-hidden selection:bg-brand-primary/20">
      
      {/* Mobile Header & Menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-brand-bg border-b border-brand-border/50 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleNewResearch}>
          <img src={logoFeather} alt="Research Agent Logo" className="w-8 h-8 object-contain" />
          <span className="font-display text-2xl text-brand-primary mt-1">Research Agent</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-brand-text">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-brand-surface pt-16 flex flex-col animate-in slide-in-from-left-8 duration-300">
          <SidebarContent />
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 h-screen flex-shrink-0 border-r border-brand-border/50 overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto relative pt-16 lg:pt-0">
        
        {/* Top Action Bar */}
        <div className="sticky top-0 z-30 bg-brand-surface/80 backdrop-blur-md border-b border-brand-border/30 px-6 py-4 flex items-center justify-end gap-4 h-16">
          <button className="p-2 text-brand-muted hover:text-brand-text transition-colors rounded-full hover:bg-brand-bg">
            <Sun className="w-5 h-5" />
          </button>
          
          <button 
            onClick={handleNewResearch}
            className="flex items-center gap-2 text-brand-text hover:text-brand-primary transition-colors text-sm font-medium px-2 py-2"
          >
            <span>New Research</span>
          </button>

          {result && (
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primaryHover text-white transition-colors text-sm font-medium px-5 py-2 rounded-lg disabled:opacity-50"
            >
              <span>{isSaving ? 'Saving...' : 'Save Research'}</span>
            </button>
          )}
        </div>

        {/* Dynamic Content Area */}
        <div className="w-full max-w-6xl mx-auto px-6 lg:px-12 py-10 lg:py-16">
          
          {!result && !isResearching && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ResearchInput onSubmit={handleResearch} isResearching={isResearching} />
              
              {error && (
                <div className="mt-8 max-w-2xl mx-auto w-full p-4 bg-brand-destructive/5 border border-brand-destructive/20 rounded-xl flex items-start gap-3 text-brand-destructive">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}
            </div>
          )}

          {isResearching && (
            <div className="py-20">
              <LoadingState />
            </div>
          )}

          {result && !isResearching && (
            <ResearchResult 
              result={result} 
              onNewResearch={handleNewResearch}
              saveMessage={saveMessage}
            />
          )}

        </div>
      </main>
    </div>
  );
}

export default App;

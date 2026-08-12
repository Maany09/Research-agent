import React, { useState, useEffect } from 'react';
import ResearchInput from './components/ResearchInput';
import LoadingState from './components/LoadingState';
import ResearchResult from './components/ResearchResult';
import { submitResearch, saveResearch } from './services/api';
import { saveToHistory, getHistory, clearHistory, deleteFromHistory } from './services/history';
import { AlertCircle, Search, Clock, Sun, Menu, X, ChevronLeft, ChevronRight, FileText, CheckCircle, Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoFeather from './assets/logo-feather.png';

function App() {
  const [isResearching, setIsResearching] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // Keyboard shortcut for toggling sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle sidebar with Alt + ArrowLeft or Alt + ArrowRight
      if (e.altKey && e.key === 'ArrowLeft') {
        setIsSidebarOpen(false);
      } else if (e.altKey && e.key === 'ArrowRight') {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleResearch = async (topic) => {
    setIsResearching(true);
    setError(null);
    setResult(null);
    setSaveMessage('');
    setIsSaved(false);
    setMobileMenuOpen(false);
    setIsSidebarOpen(false); // Automatically collapse sidebar while researching

    try {
      const response = await submitResearch(topic);
      setResult(response);
      const updatedHistory = saveToHistory(response);
      setHistory(updatedHistory);
      setIsSidebarOpen(true); // Re-open sidebar when output is generated
    } catch (err) {
      setError(err.message || 'Something went wrong while researching this topic. Please try again.');
      setIsSidebarOpen(true); // Re-open on error as well
    } finally {
      setIsResearching(false);
    }
  };

  const loadHistoryItem = (item) => {
    setResult(item);
    setError(null);
    setIsResearching(false);
    setMobileMenuOpen(false);
    setIsSaved(false);
  };

  const handleSave = async () => {
    if (!result) return;
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      const textToSave = `## Topic\n${result.topic}\n\n## Summary\n${result.summary}\n\n## Sources\n${result.sources.join('\n')}\n\n## Analysis\n${result.analysis}\n\n## Tools Used\n${result.tools_used.join('\n')}`;
      await saveResearch(textToSave);
      setSaveMessage('Report saved to research_output.txt');
      setIsSaved(true);
    } catch (err) {
      setSaveMessage('Failed to save research report.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3500);
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const handleDeleteItem = (e, id) => {
    e.stopPropagation();
    const updated = deleteFromHistory(id);
    setHistory(updated);
  };

  const handleNewResearch = () => {
    setResult(null);
    setError(null);
    setSaveMessage('');
    setIsSaved(false);
    setMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-brand-bg px-6 py-8">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={handleNewResearch}>
        <img src={logoFeather} alt="Research Agent Logo" className="w-10 h-10 object-contain flex-shrink-0" />
        <span className="font-display text-3xl text-brand-primary mt-2 whitespace-nowrap">Research Agent</span>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 mb-8">
        <button 
          onClick={handleNewResearch}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-primary/5 text-brand-primary font-medium border border-brand-primary/10 transition-all hover:bg-brand-primary/10"
        >
          <Search className="w-4 h-4" />
          <span>New Research</span>
        </button>
      </nav>

      {/* History */}
      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        {history.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4 pl-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-muted">Recent Topics</h3>
              <button 
                onClick={handleClearHistory}
                className="text-brand-muted hover:text-brand-destructive transition-colors p-1 rounded"
                title="Clear all history"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <ul className="space-y-1">
              {history.map((item) => (
                <li key={item.id}>
                  <div className="relative group rounded-lg transition-colors hover:bg-brand-primary/5">
                    <button
                      onClick={() => loadHistoryItem(item)}
                      className="w-full flex items-start gap-3 px-3 py-2.5 text-left"
                    >
                      <FileText className="w-4 h-4 text-brand-muted group-hover:text-brand-primary mt-0.5 flex-shrink-0 transition-colors" />
                      <span className="text-sm font-medium text-brand-text/90 group-hover:text-brand-primary line-clamp-2 leading-tight transition-colors pr-6">
                        {item.topic}
                      </span>
                    </button>
                    <button
                      onClick={(e) => handleDeleteItem(e, item.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-brand-muted opacity-0 group-hover:opacity-100 hover:text-brand-destructive hover:bg-brand-destructive/10 rounded transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-surface flex font-sans text-brand-text overflow-hidden selection:bg-brand-primary/20">
      
      {/* Save Toast Notification */}
      <AnimatePresence>
        {saveMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-8 right-8 bg-brand-primary text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 z-50 border border-white/20"
          >
            <CheckCircle className="w-5 h-5 text-white/90" />
            <span className="font-medium text-sm tracking-wide">{saveMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

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
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden fixed inset-0 z-40 bg-brand-surface pt-16 flex flex-col"
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar Spacer */}
      <div className={`hidden lg:block h-screen flex-shrink-0 transition-all duration-500 ease-in-out ${isSidebarOpen ? 'w-72' : 'w-0'}`}></div>

      {/* Desktop Sidebar (Translating) */}
      <aside className={`hidden lg:block fixed left-0 top-0 h-screen w-72 border-r border-brand-border/50 bg-brand-bg z-40 transition-transform duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Sidebar Toggle Button (Fixed) */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`hidden lg:flex fixed top-24 z-50 w-7 h-7 bg-brand-surface border border-brand-border shadow-sm rounded-full items-center justify-center text-brand-muted hover:text-brand-primary transition-all duration-500 ease-in-out ${isSidebarOpen ? 'left-[274px]' : 'left-4'}`}
        title={isSidebarOpen ? 'Collapse Sidebar (Alt+Left)' : 'Expand Sidebar (Alt+Right)'}
      >
        {isSidebarOpen ? <ChevronLeft className="w-4 h-4 ml-[-1px]"/> : <ChevronRight className="w-4 h-4 ml-[1px]"/>}
      </button>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto relative pt-16 lg:pt-0">
        
        {/* Top Action Bar */}
        <div className="sticky top-0 z-30 bg-brand-surface/80 backdrop-blur-md border-b border-brand-border/30 px-6 py-4 flex items-center justify-end gap-4 h-16 transition-all duration-300">
          
          <button className="p-2 text-brand-muted hover:text-brand-text transition-colors rounded-full hover:bg-brand-bg">
            <Sun className="w-5 h-5" />
          </button>
          
          <button 
            onClick={handleNewResearch}
            className="flex items-center gap-2 text-brand-text hover:text-brand-primary transition-colors text-sm font-medium px-2 py-2"
          >
            <span>New Research</span>
          </button>

          <AnimatePresence>
            {result && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleSave}
                disabled={isSaving || isSaved}
                className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primaryHover text-white transition-colors text-sm font-medium px-5 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaved && <Check className="w-4 h-4" />}
                <span>{isSaved ? 'Saved' : isSaving ? 'Saving...' : 'Save Research'}</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Content Area */}
        <div className="w-full max-w-6xl mx-auto px-6 lg:px-12 py-10 lg:py-16">
          <AnimatePresence mode="wait">
            {!result && !isResearching && (
              <motion.div 
                key="input"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <ResearchInput onSubmit={handleResearch} isResearching={isResearching} />
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 max-w-2xl mx-auto w-full p-4 bg-brand-destructive/5 border border-brand-destructive/20 rounded-xl flex items-start gap-3 text-brand-destructive"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{error}</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {isResearching && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="py-20"
              >
                <LoadingState />
              </motion.div>
            )}

            {result && !isResearching && (
              <motion.div 
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <ResearchResult 
                  result={result} 
                  onNewResearch={handleNewResearch}
                  saveMessage={saveMessage}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;

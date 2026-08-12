const HISTORY_KEY = 'research_agent_history';

export const saveToHistory = (result) => {
  try {
    const existingHistory = getHistory();
    
    // Create a concise version of the result to save space
    const historyItem = {
      id: Date.now().toString(),
      topic: result.topic,
      summary: result.summary,
      sources: result.sources,
      analysis: result.analysis,
      tools_used: result.tools_used,
      timestamp: new Date().toISOString()
    };

    // Add to beginning and keep only the last 20 researches
    const newHistory = [historyItem, ...existingHistory].slice(0, 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    
    return newHistory;
  } catch (error) {
    console.error('Failed to save to history:', error);
    return [];
  }
};

export const getHistory = () => {
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Failed to get history:', error);
    return [];
  }
};

export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};

export const deleteFromHistory = (id) => {
  try {
    const existing = getHistory();
    const updated = existing.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to delete from history:', error);
    return getHistory();
  }
};

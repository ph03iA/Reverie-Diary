import React, { useState, useEffect } from 'react';
import { Moon, Sparkles, BarChart3, Calendar } from 'lucide-react';
import DreamEntry from './components/DreamEntry';
import DreamHistory from './components/DreamHistory';
import MoodTracker from './components/MoodTracker';
import Dashboard from './components/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('entry');
  const [dreams, setDreams] = useState([]);

  // Load dreams from localStorage on component mount
  useEffect(() => {
    const savedDreams = localStorage.getItem('reverie-dreams');
    if (savedDreams) {
      setDreams(JSON.parse(savedDreams));
    }
  }, []);

  // Save dreams to localStorage whenever dreams array changes
  useEffect(() => {
    localStorage.setItem('reverie-dreams', JSON.stringify(dreams));
  }, [dreams]);

  const addDream = (dream) => {
    const newDream = {
      id: Date.now(),
      ...dream,
      createdAt: new Date().toISOString(),
    };
    setDreams(prev => [newDream, ...prev]);
  };

  const deleteDream = (dreamId) => {
    setDreams(prev => prev.filter(dream => dream.id !== dreamId));
  };

  const tabs = [
    { id: 'entry', label: 'New Dream', icon: Moon },
    { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
    { id: 'history', label: 'History', icon: Calendar },
    { id: 'tracking', label: 'Insights', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen w-full bg-black relative">
      {/* Midnight Mist */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 100%, rgba(70, 85, 110, 0.5) 0%, transparent 60%),
            radial-gradient(circle at 50% 100%, rgba(99, 102, 241, 0.4) 0%, transparent 70%),
            radial-gradient(circle at 50% 100%, rgba(181, 184, 208, 0.3) 0%, transparent 80%)
          `,
        }}
      />
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Moon className="w-6 h-6 mr-3 text-minimal-accent" />
                          <h1 className="text-3xl font-display-bold text-minimal-text">
                Reverie Diary
              </h1>
          </div>
                        <p className="text-minimal-muted text-base font-mono-light">
                Your personal dream journal
              </p>
        </header>

        {/* Navigation */}
        <nav className="flex justify-center mb-8">
          <div className="minimal-surface rounded-xl p-1">
            <div className="flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-minimal-accent text-white'
                        : 'text-minimal-muted hover:text-minimal-text hover:bg-minimal-surface'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto">
          {activeTab === 'entry' && (
            <DreamEntry onAddDream={addDream} />
          )}
          {activeTab === 'dashboard' && (
            <Dashboard dreams={dreams} />
          )}
          {activeTab === 'history' && (
            <DreamHistory dreams={dreams} onDeleteDream={deleteDream} />
          )}
          {activeTab === 'tracking' && (
            <MoodTracker dreams={dreams} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
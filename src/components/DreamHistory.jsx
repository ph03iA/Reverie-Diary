import React, { useState, useMemo } from 'react';
import { Calendar, Search, Trash2, Eye, Tag, Clock, Sparkles } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const DreamHistory = ({ dreams, onDeleteDream }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [selectedDream, setSelectedDream] = useState(null);

  const moodOptions = [
    { emoji: '😴', label: 'Peaceful' },
    { emoji: '😊', label: 'Happy' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😰', label: 'Anxious' },
    { emoji: '😨', label: 'Frightening' },
    { emoji: '🤔', label: 'Confusing' },
    { emoji: '✨', label: 'Magical' },
    { emoji: '💭', label: 'Vivid' },
  ];

  const allTags = useMemo(() => {
    const tagSet = new Set();
    dreams.forEach(dream => {
      dream.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [dreams]);

  const filteredDreams = useMemo(() => {
    return dreams.filter(dream => {
      const matchesSearch = !searchTerm || 
        dream.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dream.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesMood = !selectedMood || dream.mood?.label === selectedMood;
      
      const matchesTag = !selectedTag || dream.tags?.includes(selectedTag);

      return matchesSearch && matchesMood && matchesTag;
    });
  }, [dreams, searchTerm, selectedMood, selectedTag]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedMood('');
    setSelectedTag('');
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return format(new Date(dateString), 'MMM dd, yyyy');
    }
  };

  const formatTime = (dateString) => {
    try {
      return format(parseISO(dateString), 'HH:mm');
    } catch {
      return format(new Date(dateString), 'HH:mm');
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="aesthetic-card p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
                     <h2 className="text-xl font-display-bold text-minimal-text flex items-center">
             <Calendar className="w-5 h-5 mr-2" />
             Dream History ({filteredDreams.length})
           </h2>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-minimal-accent text-white' 
                  : 'bg-minimal-surface text-minimal-muted hover:bg-minimal-border'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'calendar' 
                  ? 'bg-minimal-accent text-white' 
                  : 'bg-minimal-surface text-minimal-muted hover:bg-minimal-border'
              }`}
            >
              Calendar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-minimal-muted" />
            <input
              type="text"
              placeholder="Search dreams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-minimal-surface border border-minimal-border rounded-lg text-minimal-text placeholder-minimal-muted focus:ring-2 focus:ring-minimal-accent focus:border-minimal-accent transition-colors"
            />
          </div>

          {/* Mood Filter */}
          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            className="px-4 py-2 bg-minimal-surface border border-minimal-border rounded-lg text-minimal-text focus:ring-2 focus:ring-minimal-accent focus:border-minimal-accent transition-colors"
          >
            <option value="">All Moods</option>
            {moodOptions.map(mood => (
              <option key={mood.label} value={mood.label} className="bg-minimal-surface">
                {mood.emoji} {mood.label}
              </option>
            ))}
          </select>

          {/* Tag Filter */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-4 py-2 bg-minimal-surface border border-minimal-border rounded-lg text-minimal-text focus:ring-2 focus:ring-minimal-accent focus:border-minimal-accent transition-colors"
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag} className="bg-minimal-surface capitalize">
                {tag}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-minimal-surface hover:bg-minimal-border rounded-lg text-minimal-muted hover:text-minimal-text transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Dreams List */}
      {filteredDreams.length === 0 ? (
        <div className="aesthetic-card p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-minimal-muted" />
                     <h3 className="text-xl font-display-bold text-minimal-muted mb-2">No dreams found</h3>
          <p className="text-minimal-muted">Try adjusting your filters or record your first dream!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDreams.map((dream) => (
            <div key={dream.id} className="aesthetic-card p-6">
              <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{dream.mood?.emoji}</div>
                    <div>
                      <div className="flex items-center text-minimal-muted text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(dream.createdAt)} at {formatTime(dream.createdAt)}
                      </div>
                      <div className="text-minimal-muted text-sm">{dream.mood?.label}</div>
                    </div>
                  </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedDream(dream)}
                    className="p-2 text-minimal-muted hover:text-minimal-accent transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteDream(dream.id)}
                    className="p-2 text-minimal-muted hover:text-red-400 transition-colors"
                    title="Delete dream"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-minimal-text mb-4 line-clamp-3">{dream.text}</p>

              {dream.tags && dream.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <Tag className="w-4 h-4 text-minimal-muted mt-1" />
                  {dream.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-minimal-accent/20 text-minimal-accent text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {dream.interpretation && (
                <div className="glass-effect rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Sparkles className="w-4 h-4 mr-2 text-minimal-accent" />
                    <span className="text-sm font-medium text-minimal-accent">AI Interpretation</span>
                  </div>
                  <p className="text-minimal-muted text-sm line-clamp-3">
                    {dream.interpretation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dream Detail Modal */}
      {selectedDream && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="aesthetic-card p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{selectedDream.mood?.emoji}</div>
                <div>
                                     <h3 className="text-xl font-display-bold text-minimal-text">{selectedDream.mood?.label} Dream</h3>
                  <p className="text-minimal-muted">
                    {formatDate(selectedDream.createdAt)} at {formatTime(selectedDream.createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDream(null)}
                className="text-minimal-muted hover:text-minimal-text p-2"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div>
                                 <h4 className="font-display text-minimal-text mb-3">Dream Description</h4>
                <p className="text-minimal-text leading-relaxed">{selectedDream.text}</p>
              </div>

              {selectedDream.tags && selectedDream.tags.length > 0 && (
                <div>
                                     <h4 className="font-display text-minimal-text mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDream.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-minimal-accent/20 text-minimal-accent rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedDream.interpretation && (
                <div>
                  <div className="flex items-center mb-3">
                    <Sparkles className="w-5 h-5 mr-2 text-minimal-accent" />
                                         <h4 className="font-display text-minimal-text">AI Interpretation</h4>
                  </div>
                  <div className="glass-effect rounded-lg p-4">
                    <p className="text-minimal-text leading-relaxed whitespace-pre-wrap">
                      {selectedDream.interpretation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DreamHistory;
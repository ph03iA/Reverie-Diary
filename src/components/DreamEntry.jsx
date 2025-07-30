import React, { useState } from 'react';
import { Send, Tag, Heart, Cloud } from 'lucide-react';
import AIInterpretation from './AIInterpretation';
import TextShimmer from './ui/text-shimmer';

const moodEmojis = [
  { emoji: '😴', label: 'Peaceful', value: 1 },
  { emoji: '😊', label: 'Happy', value: 2 },
  { emoji: '😐', label: 'Neutral', value: 3 },
  { emoji: '😰', label: 'Anxious', value: 4 },
  { emoji: '😨', label: 'Frightening', value: 5 },
  { emoji: '🤔', label: 'Confusing', value: 6 },
  { emoji: '✨', label: 'Magical', value: 7 },
  { emoji: '💭', label: 'Vivid', value: 8 },
];

const suggestedTags = [
  'water', 'flying', 'falling', 'running', 'family', 'friends', 'animals',
  'house', 'school', 'work', 'travel', 'colors', 'music', 'food', 'darkness',
  'light', 'ocean', 'forest', 'city', 'childhood', 'future', 'past'
];

const DreamEntry = ({ onAddDream }) => {
  const [dreamText, setDreamText] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showInterpretation, setShowInterpretation] = useState(false);

  const handleAddTag = (tag) => {
    if (tag && !tags.includes(tag.toLowerCase())) {
      setTags([...tags, tag.toLowerCase()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dreamText.trim() || !selectedMood) return;

    setIsLoading(true);
    setShowInterpretation(true);

    const dreamData = {
      text: dreamText,
      mood: selectedMood,
      tags: tags,
      date: new Date().toISOString().split('T')[0],
    };

    try {
      // Get AI interpretation
      const interpretationResult = await getAIInterpretation(dreamText);
      setInterpretation(interpretationResult);
      
      // Add interpretation to dream data
      dreamData.interpretation = interpretationResult;
    } catch (error) {
      console.error('Error getting AI interpretation:', error);
      setInterpretation('AI interpretation is currently unavailable. Please check your API key configuration.');
    }

    // Save dream
    onAddDream(dreamData);
    setIsLoading(false);
  };

  const getAIInterpretation = async (dreamText) => {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY; 
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = `You are a symbolic dream analyst with expertise in Jungian psychology. Interpret the following dream symbolically and provide insights about possible emotional meanings, common archetypes, and inner conflicts. Keep your response thoughtful but concise (2-3 paragraphs).

Dream:
"${dreamText}"

Provide a symbolic interpretation that explores:
1. Key symbols and their potential meanings
2. Emotional themes and psychological insights
3. Possible connections to the dreamer's inner world

Please provide a meaningful and insightful interpretation.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 500,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to get AI interpretation: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Gemini API Response:', data);
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error('Unexpected response format:', data);
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to get AI interpretation from Gemini');
    }
  };

  const resetForm = () => {
    setDreamText('');
    setSelectedMood(null);
    setTags([]);
    setNewTag('');
    setInterpretation('');
    setShowInterpretation(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="aesthetic-card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dream Text Input */}
          <div>
                         <label className="block text-sm font-medium text-minimal-text mb-3 font-display">
               <Cloud className="w-4 h-4 inline mr-2" />
               Describe your dream
             </label>
            <textarea
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
              placeholder="I was flying through a purple sky, when suddenly..."
              className="w-full h-40 bg-minimal-surface border border-minimal-border rounded-xl px-4 py-3 text-minimal-text placeholder-minimal-muted focus:ring-2 focus:ring-minimal-accent focus:border-minimal-accent resize-none transition-colors"
              required
            />
          </div>

          {/* Mood Selector */}
          <div>
                         <label className="block text-sm font-medium text-minimal-text mb-3 font-display">
               <Heart className="w-4 h-4 inline mr-2" />
               How did the dream feel?
             </label>
            <div className="grid grid-cols-4 gap-3">
              {moodEmojis.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(mood)}
                  className={`p-3 rounded-xl border text-center transition-all duration-200 minimal-hover ${
                    selectedMood?.value === mood.value
                      ? 'border-minimal-accent bg-minimal-accent/20'
                      : 'border-minimal-border bg-minimal-surface'
                  }`}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <div className="text-xs text-minimal-muted">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
                         <label className="block text-sm font-medium text-minimal-text mb-3 font-display">
               <Tag className="w-4 h-4 inline mr-2" />
               Tags (optional)
             </label>
            
            {/* Current Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-minimal-accent/20 text-minimal-accent rounded-full text-sm border border-minimal-accent/30 cursor-pointer hover:bg-minimal-accent/30 transition-colors"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} ×
                  </span>
                ))}
              </div>
            )}

            {/* Add New Tag */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag(newTag))}
                placeholder="Add a tag..."
                className="flex-1 bg-minimal-surface border border-minimal-border rounded-lg px-3 py-2 text-minimal-text placeholder-minimal-muted focus:ring-2 focus:ring-minimal-accent focus:border-minimal-accent transition-colors"
              />
              <button
                type="button"
                onClick={() => handleAddTag(newTag)}
                className="px-4 py-2 bg-minimal-accent hover:bg-minimal-hover text-white rounded-lg transition-colors"
              >
                Add
              </button>
            </div>

            {/* Suggested Tags */}
            <div className="flex flex-wrap gap-2">
              {suggestedTags.filter(tag => !tags.includes(tag)).slice(0, 8).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  className="px-2 py-1 text-xs bg-minimal-surface text-minimal-muted rounded-full hover:bg-minimal-border hover:text-minimal-text transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!dreamText.trim() || !selectedMood || isLoading}
                           className="w-full bg-minimal-accent hover:bg-minimal-hover py-4 px-6 rounded-xl font-display-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <TextShimmer className="text-white font-display" duration={1.5}>
                Getting Interpretation...
              </TextShimmer>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Capture Dream & Get Interpretation
              </>
            )}
          </button>
        </form>

        {/* AI Interpretation */}
        {showInterpretation && (
          <AIInterpretation 
            interpretation={interpretation}
            isLoading={isLoading}
            onReset={resetForm}
          />
        )}
      </div>
    </div>
  );
};

export default DreamEntry;
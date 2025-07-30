import React from 'react';
import { Sparkles, RefreshCw, CheckCircle } from 'lucide-react';
import TextShimmer from './ui/text-shimmer';

const AIInterpretation = ({ interpretation, isLoading, onReset }) => {
  return (
    <div className="mt-8 pt-8 border-t border-minimal-border">
      <div className="flex items-center mb-4">
        <Sparkles className="w-5 h-5 mr-2 text-minimal-accent" />
                 <h3 className="text-xl font-display-bold text-minimal-text">Dream Interpretation</h3>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <TextShimmer className="text-minimal-muted font-display text-lg" duration={1.2}>
            Analyzing your dream symbols...
          </TextShimmer>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="glass-effect rounded-xl p-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-minimal-text leading-relaxed whitespace-pre-wrap">
                {interpretation}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center text-green-400">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">Dream saved successfully!</span>
            </div>
            
            <button
              onClick={onReset}
              className="flex items-center px-4 py-2 bg-minimal-surface hover:bg-minimal-border rounded-lg transition-colors text-minimal-muted hover:text-minimal-text"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Record Another Dream
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInterpretation;
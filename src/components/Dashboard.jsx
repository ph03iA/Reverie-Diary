import React, { useMemo } from 'react';
import { Calendar, TrendingUp, Tag, Moon, Star, BarChart3 } from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';

const Dashboard = ({ dreams }) => {
  const stats = useMemo(() => {
    const last30Days = dreams.filter(dream => 
      isAfter(new Date(dream.createdAt), subDays(new Date(), 30))
    );

    const moodCounts = dreams.reduce((acc, dream) => {
      const moodLabel = dream.mood?.label || 'Unknown';
      acc[moodLabel] = (acc[moodLabel] || 0) + 1;
      return acc;
    }, {});

    const tagCounts = dreams.reduce((acc, dream) => {
      dream.tags?.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {});

    const topTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    const mostCommonMood = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      totalDreams: dreams.length,
      last30Days: last30Days.length,
      mostCommonMood: mostCommonMood || ['No dreams yet', 0],
      topTags,
      avgTagsPerDream: dreams.length > 0 ? (dreams.reduce((sum, dream) => sum + (dream.tags?.length || 0), 0) / dreams.length).toFixed(1) : 0,
    };
  }, [dreams]);

  const recentDreams = dreams.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="aesthetic-card p-6 text-center">
          <Moon className="w-8 h-8 mx-auto mb-3 text-minimal-accent" />
                     <div className="text-2xl font-display-bold text-minimal-text">{stats.totalDreams}</div>
           <div className="text-minimal-muted text-sm font-mono-light">Total Dreams</div>
        </div>

        <div className="aesthetic-card p-6 text-center">
          <TrendingUp className="w-8 h-8 mx-auto mb-3 text-green-400" />
                     <div className="text-2xl font-display-bold text-minimal-text">{stats.last30Days}</div>
           <div className="text-minimal-muted text-sm font-mono-light">Last 30 Days</div>
        </div>

        <div className="aesthetic-card p-6 text-center">
          <Star className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
                     <div className="text-2xl font-display-bold text-minimal-text">{stats.mostCommonMood[1]}</div>
           <div className="text-minimal-muted text-sm font-mono-light">{stats.mostCommonMood[0]} Dreams</div>
        </div>

        <div className="aesthetic-card p-6 text-center">
          <Tag className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                     <div className="text-2xl font-display-bold text-minimal-text">{stats.avgTagsPerDream}</div>
           <div className="text-minimal-muted text-sm font-mono-light">Avg Tags/Dream</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Dream Symbols */}
        <div className="aesthetic-card p-6">
          <div className="flex items-center mb-4">
            <BarChart3 className="w-5 h-5 mr-2 text-minimal-accent" />
                         <h3 className="text-xl font-display-bold text-minimal-text">Top Dream Symbols</h3>
          </div>
          
          {stats.topTags.length > 0 ? (
            <div className="space-y-3">
              {stats.topTags.map(([tag, count], index) => (
                <div key={tag} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-minimal-accent text-white text-xs flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                    <span className="text-minimal-text capitalize">{tag}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-minimal-border rounded-full h-2 mr-3">
                      <div 
                        className="h-2 bg-minimal-accent rounded-full"
                        style={{ width: `${(count / stats.topTags[0][1]) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-minimal-muted text-sm w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-minimal-muted">
              <Tag className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No dream symbols tracked yet</p>
            </div>
          )}
        </div>

        {/* Recent Dreams */}
        <div className="aesthetic-card p-6">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 mr-2 text-minimal-accent" />
                         <h3 className="text-xl font-display-bold text-minimal-text">Recent Dreams</h3>
          </div>
          
          {recentDreams.length > 0 ? (
            <div className="space-y-4">
              {recentDreams.map((dream) => (
                <div key={dream.id} className="glass-effect rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{dream.mood?.emoji}</span>
                      <span className="text-minimal-muted text-sm">
                        {format(new Date(dream.createdAt), 'MMM dd')}
                      </span>
                    </div>
                  </div>
                  <p className="text-minimal-text text-sm line-clamp-2 mb-2">
                    {dream.text.substring(0, 120)}...
                  </p>
                  {dream.tags && dream.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {dream.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-minimal-accent/20 text-minimal-accent text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {dream.tags.length > 3 && (
                        <span className="px-2 py-1 bg-minimal-border text-minimal-muted text-xs rounded-full">
                          +{dream.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-minimal-muted">
              <Moon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No dreams recorded yet</p>
              <p className="text-sm mt-1">Start by capturing your first dream!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
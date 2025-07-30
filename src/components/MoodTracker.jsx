import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Calendar, Tag, Sparkles } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const MoodTracker = ({ dreams }) => {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#e5e7eb',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#e5e7eb',
        borderColor: '#3b82f6',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  const moodTrendData = useMemo(() => {
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    });

    const dailyMoods = last30Days.map(day => {
      const dayString = format(day, 'yyyy-MM-dd');
      const dayDreams = dreams.filter(dream => {
        try {
          const dreamDate = format(parseISO(dream.createdAt), 'yyyy-MM-dd');
          return dreamDate === dayString;
        } catch {
          const dreamDate = format(new Date(dream.createdAt), 'yyyy-MM-dd');
          return dreamDate === dayString;
        }
      });

      if (dayDreams.length === 0) return { date: dayString, mood: null, count: 0 };

      // Convert mood to numeric value for trending
      const moodValues = dayDreams.map(dream => {
        switch (dream.mood?.label) {
          case 'Peaceful': return 5;
          case 'Happy': return 4;
          case 'Magical': return 4;
          case 'Vivid': return 3;
          case 'Neutral': return 3;
          case 'Confusing': return 2;
          case 'Anxious': return 1;
          case 'Frightening': return 0;
          default: return 3;
        }
      });

      const avgMood = moodValues.reduce((sum, val) => sum + val, 0) / moodValues.length;
      return { date: dayString, mood: avgMood, count: dayDreams.length };
    });

    return {
      labels: dailyMoods.map(day => format(new Date(day.date), 'MMM dd')),
      datasets: [
        {
          label: 'Dream Mood Trend',
          data: dailyMoods.map(day => day.mood),
          borderColor: '#7209b7',
          backgroundColor: 'rgba(114, 9, 183, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [dreams]);

  const moodDistribution = useMemo(() => {
    const moodCounts = dreams.reduce((acc, dream) => {
      const mood = dream.mood?.label || 'Unknown';
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});

    const colors = {
      'Peaceful': '#10b981',
      'Happy': '#f59e0b',
      'Magical': '#8b5cf6',
      'Vivid': '#06b6d4',
      'Neutral': '#6b7280',
      'Confusing': '#f97316',
      'Anxious': '#ef4444',
      'Frightening': '#dc2626',
      'Unknown': '#4b5563',
    };

    return {
      labels: Object.keys(moodCounts),
      datasets: [
        {
          data: Object.values(moodCounts),
          backgroundColor: Object.keys(moodCounts).map(mood => colors[mood] || '#4b5563'),
          borderColor: '#1a1a2e',
          borderWidth: 2,
        },
      ],
    };
  }, [dreams]);

  const tagFrequency = useMemo(() => {
    const tagCounts = dreams.reduce((acc, dream) => {
      dream.tags?.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {});

    const sortedTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    return {
      labels: sortedTags.map(([tag]) => tag),
      datasets: [
        {
          label: 'Frequency',
          data: sortedTags.map(([,count]) => count),
                  backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3b82f6',
          borderWidth: 1,
        },
      ],
    };
  }, [dreams]);

  const weeklyStats = useMemo(() => {
    const thisWeekStart = startOfWeek(new Date());
    const thisWeekEnd = endOfWeek(new Date());
    
    const thisWeekDreams = dreams.filter(dream => {
      try {
        const dreamDate = parseISO(dream.createdAt);
        return dreamDate >= thisWeekStart && dreamDate <= thisWeekEnd;
      } catch {
        const dreamDate = new Date(dream.createdAt);
        return dreamDate >= thisWeekStart && dreamDate <= thisWeekEnd;
      }
    });

    const lastWeekStart = subDays(thisWeekStart, 7);
    const lastWeekEnd = subDays(thisWeekEnd, 7);
    
    const lastWeekDreams = dreams.filter(dream => {
      try {
        const dreamDate = parseISO(dream.createdAt);
        return dreamDate >= lastWeekStart && dreamDate <= lastWeekEnd;
      } catch {
        const dreamDate = new Date(dream.createdAt);
        return dreamDate >= lastWeekStart && dreamDate <= lastWeekEnd;
      }
    });

    const thisWeekCount = thisWeekDreams.length;
    const lastWeekCount = lastWeekDreams.length;
    const change = lastWeekCount > 0 ? ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100 : 0;

    return {
      thisWeek: thisWeekCount,
      lastWeek: lastWeekCount,
      change: change.toFixed(1),
    };
  }, [dreams]);

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="aesthetic-card p-6 text-center">
          <TrendingUp className="w-8 h-8 mx-auto mb-3 text-green-400" />
                     <div className="text-2xl font-display-bold text-minimal-text">{weeklyStats.thisWeek}</div>
           <div className="text-minimal-muted text-sm font-mono-light">Dreams This Week</div>
          {weeklyStats.change !== '0.0' && (
            <div className={`text-xs mt-1 ${
              parseFloat(weeklyStats.change) > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {parseFloat(weeklyStats.change) > 0 ? '+' : ''}{weeklyStats.change}% from last week
            </div>
          )}
        </div>

        <div className="aesthetic-card p-6 text-center">
          <Calendar className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                     <div className="text-2xl font-display-bold text-minimal-text">
             {dreams.length > 0 ? (dreams.length / Math.max(1, Math.ceil((new Date() - new Date(dreams[dreams.length - 1].createdAt)) / (1000 * 60 * 60 * 24)))).toFixed(1) : '0.0'}
           </div>
           <div className="text-minimal-muted text-sm font-mono-light">Dreams per Day</div>
        </div>

        <div className="aesthetic-card p-6 text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                     <div className="text-2xl font-display-bold text-minimal-text">
             {dreams.filter(dream => dream.interpretation).length}
           </div>
           <div className="text-minimal-muted text-sm font-mono-light">AI Interpretations</div>
        </div>
      </div>

      {dreams.length === 0 ? (
        <div className="aesthetic-card p-12 text-center">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-minimal-muted" />
                     <h3 className="text-xl font-display-bold text-minimal-muted mb-2">No data to analyze yet</h3>
          <p className="text-minimal-muted">Record some dreams to see insights and trends!</p>
        </div>
      ) : (
        <>
          {/* Mood Trend Chart */}
          <div className="aesthetic-card p-6">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-5 h-5 mr-2 text-minimal-accent" />
                             <h3 className="text-xl font-display-bold text-minimal-text">Mood Trend (Last 30 Days)</h3>
            </div>
            <div className="h-64">
              <Line data={moodTrendData} options={chartOptions} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mood Distribution */}
            <div className="aesthetic-card p-6">
              <div className="flex items-center mb-6">
                <BarChart3 className="w-5 h-5 mr-2 text-minimal-accent" />
                                 <h3 className="text-xl font-display-bold text-minimal-text">Mood Distribution</h3>
              </div>
              <div className="h-64">
                <Doughnut 
                  data={moodDistribution} 
                  options={{
                    ...chartOptions,
                    scales: undefined,
                  }} 
                />
              </div>
            </div>

            {/* Top Dream Symbols */}
            <div className="aesthetic-card p-6">
              <div className="flex items-center mb-6">
                <Tag className="w-5 h-5 mr-2 text-minimal-accent" />
                                 <h3 className="text-xl font-display-bold text-minimal-text">Most Common Symbols</h3>
              </div>
              <div className="h-64">
                <Bar data={tagFrequency} options={chartOptions} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MoodTracker;
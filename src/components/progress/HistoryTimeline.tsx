import React, { useState } from 'react';
import { History, CheckCircle2, Clock, Calendar, Sparkles } from 'lucide-react';
import { LearningSession } from '../../types';

interface HistoryTimelineProps {
  sessions: LearningSession[];
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ sessions }) => {
  const [selectedSession, setSelectedSession] = useState<LearningSession | null>(null);

  if (sessions.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200/80 text-center">
        <div className="text-4xl mb-2">🌱</div>
        <h4 className="font-bold text-stone-800">Your first quest is waiting</h4>
        <p className="text-stone-500 text-sm mt-1">
          Whenever you're ready, take one tiny step and it will be recorded here.
        </p>
      </div>
    );
  }

  // Sort descending by completion date
  const sorted = [...sessions].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
        <History className="w-5 h-5 text-emerald-600" />
        <span>Learning History Timeline</span>
      </h3>

      <div className="space-y-3">
        {sorted.map((sess) => {
          const date = new Date(sess.completedAt);
          const dateStr = date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            weekday: 'short',
          });
          const timeStr = date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={sess.id}
              onClick={() => setSelectedSession(selectedSession?.id === sess.id ? null : sess)}
              className="p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-emerald-300 hover:shadow-sm transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                      {sess.skillName}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">{dateStr} • {timeStr}</span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base mt-1">
                    {sess.questTitle}
                  </h4>
                  {sess.notes && (
                    <p className="text-xs text-stone-600 mt-1 italic">
                      "{sess.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="flex items-center gap-1 text-xs text-stone-500">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  {sess.durationMinutes}m
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100">
                  +{sess.earnedXp} XP
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

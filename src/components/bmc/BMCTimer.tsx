import React, { useState, useEffect, useCallback } from 'react';
import { Timer, Pause, Play, RotateCcw } from 'lucide-react';

interface BMCTimerProps {
  durationSeconds?: number;
}

const BMCTimer: React.FC<BMCTimerProps> = ({ durationSeconds = 300 }) => {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const interval = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(interval);
  }, [running, remaining]);

  const reset = useCallback(() => {
    setRemaining(durationSeconds);
    setRunning(false);
  }, [durationSeconds]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isWarning = remaining <= 60 && remaining > 0;
  const isExpired = remaining <= 0;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        isExpired
          ? 'bg-red-100 text-red-700'
          : isWarning
          ? 'bg-amber-100 text-amber-700'
          : 'bg-gray-100 text-gray-700'
      }`}
    >
      <Timer className="w-4 h-4" />
      <span className="font-mono tabular-nums">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
      <button
        onClick={() => setRunning((r) => !r)}
        className="p-1 rounded-full hover:bg-white/50 transition-colors"
        title={running ? 'Pause' : 'Démarrer'}
      >
        {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      </button>
      <button
        onClick={reset}
        className="p-1 rounded-full hover:bg-white/50 transition-colors"
        title="Réinitialiser"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default BMCTimer;

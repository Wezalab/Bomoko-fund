import React from "react";

interface ProgressBarProps {
  value: number; // Current progress value
  max: number;   // Maximum progress value
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max }) => {
  // Calculate the percentage
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className="bg-blue-500 h-full text-center text-white text-sm leading-6 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      >
      </div>
    </div>
  );
};

export default ProgressBar;
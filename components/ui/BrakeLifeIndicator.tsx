import React from 'react';

interface BrakeLifeIndicatorProps {
  percentage: number; // 0-100
}

const BrakeLifeIndicator: React.FC<BrakeLifeIndicatorProps> = ({ percentage }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getStrokeColor = () => {
    if (percentage < 25) return '#ef4444'; // red-500
    if (percentage < 50) return '#f59e0b'; // amber-500
    return '#22c55e'; // green-500
  };

  return (
    <div className="w-32 h-32 relative flex items-center justify-center" aria-label={`Vida de frenos: ${percentage}%`}>
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle
          className="text-gray-700"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={getStrokeColor()}
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          transform="rotate(-90 60 60)"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-kia-light">{percentage}%</span>
        <span className="text-xs text-kia-gray">Vida Útil</span>
      </div>
    </div>
  );
};

export default BrakeLifeIndicator;

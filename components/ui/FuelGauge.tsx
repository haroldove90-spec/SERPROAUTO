
import React from 'react';

interface FuelGaugeProps {
  level: '1/4' | '1/2' | '3/4' | 'Lleno' | '';
}

const levelToAngle: Record<FuelGaugeProps['level'], number> = {
  '': -90,
  '1/4': -45,
  '1/2': 0,
  '3/4': 45,
  'Lleno': 90,
};

const FuelGauge: React.FC<FuelGaugeProps> = ({ level }) => {
  const angle = levelToAngle[level] || -90;

  return (
    <div className="w-40 h-24 relative flex flex-col items-center justify-end" aria-label={`Nivel de combustible: ${level || 'Vacío'}`}>
      <svg viewBox="0 0 100 50" className="w-full h-auto absolute bottom-4 left-0">
        {/* Gauge Background */}
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#4a4a4a" strokeWidth="10" />
        {/* Gauge Fill */}
        <path 
          d="M 10 50 A 40 40 0 0 1 90 50" 
          fill="none" 
          stroke="url(#fuelGradient)" 
          strokeWidth="10" 
          strokeDasharray="125.6" 
          strokeDashoffset="0"
        />
        <defs>
            <linearGradient id="fuelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: '#ef4444'}} />
                <stop offset="50%" style={{stopColor: '#f59e0b'}} />
                <stop offset="100%" style={{stopColor: '#22c55e'}} />
            </linearGradient>
        </defs>
      </svg>
      {/* Needle */}
      <div 
        className="absolute bottom-6 left-1/2 w-px h-[45px] bg-kia-primary transform origin-bottom transition-transform duration-500 ease-in-out" 
        style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
      >
        <div className="w-2 h-2 bg-kia-primary rounded-full absolute -top-1 -left-1"></div>
      </div>
      {/* Center circle */}
      <div className="absolute bottom-4 left-1/2 w-4 h-4 bg-kia-dark-2 border-2 border-gray-500 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
      {/* Labels */}
      <span className="absolute bottom-4 left-0 text-xs font-bold text-red-500">E</span>
      <span className="absolute bottom-4 right-0 text-xs font-bold text-green-500">F</span>
       <span className="text-sm font-bold text-kia-light mt-2 absolute bottom-[-10px]">{level || 'Vacío'}</span>
    </div>
  );
};

export default FuelGauge;

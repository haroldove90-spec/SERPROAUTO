import React from 'react';

interface BatteryGaugeProps {
  health: number; // 0-100
}

const BatteryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5v2.25c0 .621.504 1.125 1.125 1.125H5.25v-4.5H4.5v1.125c0 .621-.504 1.125-1.125 1.125H3.375c-.621 0-1.125-.504-1.125-1.125v-2.25c0-.621.504-1.125 1.125-1.125h1.125c.621 0 1.125.504 1.125 1.125v1.125z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 14.25v-6.75a2.25 2.25 0 00-2.25-2.25h-6.5A2.25 2.25 0 007 7.5v6.75a2.25 2.25 0 002.25 2.25h6.5A2.25 2.25 0 0018 14.25z" />
    </svg>
);


const BatteryGauge: React.FC<BatteryGaugeProps> = ({ health }) => {
  const getHealthColor = () => {
    if (health < 30) return 'bg-red-500';
    if (health < 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const healthColor = getHealthColor();

  return (
    <div className="w-48 h-24 relative flex items-center justify-center" aria-label={`Salud de la batería: ${health}%`}>
      <div className="relative w-full h-full flex items-center justify-center">
        <BatteryIcon className="w-28 h-28 text-gray-600" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[68px] h-[34px] bg-kia-dark overflow-hidden">
             <div 
                className={`h-full transition-all duration-500 ${healthColor}`}
                style={{ width: `${health}%` }}
             ></div>
        </div>
        <span className="absolute text-lg font-bold text-kia-light">{health}%</span>
      </div>
    </div>
  );
};

export default BatteryGauge;

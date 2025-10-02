
import React from 'react';
import { VehicleStatus } from '../../types';

interface VehicleStatusChartProps {
  data: Record<VehicleStatus | string, number>;
}

const VehicleStatusChart: React.FC<VehicleStatusChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Servicio', value: data[VehicleStatus.InService] || 0, color: 'bg-blue-500' },
    { name: 'Diagnóstico', value: data[VehicleStatus.InDiagnosis] || 0, color: 'bg-yellow-500' },
    { name: 'Reparación', value: data[VehicleStatus.InRepair] || 0, color: 'bg-orange-500' },
    { name: 'Entrega', value: data[VehicleStatus.ReadyForDelivery] || 0, color: 'bg-green-500' },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value), 1); // Avoid division by zero

  return (
    <div className="w-full h-[300px] flex items-end justify-around p-4 pt-8" role="figure" aria-label="Gráfico de estado de vehículos">
      {chartData.map(item => (
        <div key={item.name} className="flex flex-col items-center h-full w-1/4 group" title={`${item.name}: ${item.value}`}>
          <div className="relative flex-1 flex items-end w-1/2 justify-center">
            <div 
              className={`w-full ${item.color} rounded-t-md transition-all duration-300 ease-in-out transform group-hover:opacity-80`}
              style={{ height: `${(item.value / maxValue) * 100}%` }}
              aria-label={`${item.value} vehículos en ${item.name}`}
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-kia-light font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                {item.value}
              </span>
            </div>
          </div>
          <span className="text-xs text-kia-gray mt-2 whitespace-nowrap">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default VehicleStatusChart;

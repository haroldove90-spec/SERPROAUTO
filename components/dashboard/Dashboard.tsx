
import React, { useMemo } from 'react';
import { Vehicle, VehicleStatus, Role } from '../../types';
import KPICard from './KPICard';
import VehicleStatusChart from './VehicleStatusChart';
import { useAuth } from '../../context/AuthContext';
import MechanicDashboard from './MechanicDashboard';

interface DashboardProps {
  vehicles: Vehicle[];
  onAddVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  onUpdateVehicle: (vehicle: Vehicle) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ vehicles, onAddVehicle, onUpdateVehicle }) => {
  const { user } = useAuth();

  const stats = useMemo(() => {
    return vehicles.reduce((acc, vehicle) => {
      acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
      acc.total = (acc.total || 0) + 1;
      return acc;
    }, {} as Record<VehicleStatus | 'total', number>);
  }, [vehicles]);

  const isJefeDeTaller = user?.role === Role.JefeDeTaller;
  const isAsesor = user?.role === Role.Asesor;
  const isMecanico = user?.role === Role.Mecanico;

  const renderRecentActivity = () => (
    <div className="bg-kia-dark p-6 rounded-lg shadow-lg h-full">
      <h3 className="text-xl font-semibold mb-4 text-kia-light">Actividad Reciente</h3>
      {vehicles.length > 0 ? (
        <ul className="space-y-4">
          {vehicles.slice(0, 5).map(v => (
            <li key={v.id} className="flex items-start space-x-3 text-sm">
              <span className={`mt-1 block h-2 w-2 flex-shrink-0 rounded-full ${v.status === VehicleStatus.ReadyForDelivery ? 'bg-green-400' : 'bg-kia-primary'}`}></span>
              <div className="flex-1">
                <p className="font-semibold text-kia-light">{v.make} {v.model} ({v.licensePlate})</p>
                <p className="text-kia-gray">{v.status}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-kia-gray">No hay actividad reciente.</p>
      )}
    </div>
  );

  return (
    <>
      {isJefeDeTaller && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-kia-light">Panel de Control</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard title="Vehículos en Servicio" value={stats[VehicleStatus.InService] || 0} />
            <KPICard title="Vehículos en Diagnóstico" value={stats[VehicleStatus.InDiagnosis] || 0} />
            <KPICard title="Vehículos en Reparación" value={stats[VehicleStatus.InRepair] || 0} />
            <KPICard title="Listos para Entrega" value={stats[VehicleStatus.ReadyForDelivery] || 0} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-kia-dark p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-kia-light">Estado de Vehículos</h3>
              <VehicleStatusChart data={stats} />
            </div>
            <div className="lg:col-span-2">
              {renderRecentActivity()}
            </div>
          </div>
        </div>
      )}

      {isAsesor && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {renderRecentActivity()}
        </div>
      )}

      {isMecanico && (
         <MechanicDashboard 
            vehicles={vehicles}
            onAddVehicle={onAddVehicle}
            onUpdateVehicle={onUpdateVehicle}
         />
      )}
    </>
  );
};

export default Dashboard;
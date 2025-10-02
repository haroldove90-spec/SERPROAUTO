
import React from 'react';
import { Vehicle } from '../../types';
import StatusBadge from './StatusBadge';

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  showAllColumns?: boolean;
}

const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles, onEdit, showAllColumns = true }) => {
  return (
    <div className="bg-kia-dark rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-black text-kia-gray uppercase tracking-wider text-xs">
            <tr>
              <th className="p-4">Cliente</th>
              <th className="p-4">Vehículo</th>
              <th className="p-4">Placa</th>
              {showAllColumns && <th className="p-4">Fecha Ingreso</th>}
              <th className="p-4">Estado</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-kia-dark-2">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-kia-dark-2 transition-colors duration-200">
                <td className="p-4 whitespace-nowrap">
                  <div className="font-semibold text-kia-light">{vehicle.customer.name}</div>
                  <div className="text-kia-gray">{vehicle.customer.phone}</div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="font-semibold text-kia-light">{vehicle.make} {vehicle.model}</div>
                  <div className="text-kia-gray">{vehicle.year}</div>
                </td>
                <td className="p-4 whitespace-nowrap text-kia-light">{vehicle.licensePlate}</td>
                {showAllColumns && <td className="p-4 whitespace-nowrap text-kia-gray">{vehicle.entryDate}</td>}
                <td className="p-4 whitespace-nowrap">
                  <StatusBadge status={vehicle.status} />
                </td>
                <td className="p-4 whitespace-nowrap text-right">
                  <button 
                    onClick={() => onEdit(vehicle)}
                    className="text-kia-primary hover:underline font-semibold"
                  >
                    Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleTable;

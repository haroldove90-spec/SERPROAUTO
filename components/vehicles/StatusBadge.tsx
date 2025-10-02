
import React from 'react';
import { VehicleStatus } from '../../types';

interface StatusBadgeProps {
  status: VehicleStatus;
}

const statusColors: Record<VehicleStatus, string> = {
  [VehicleStatus.InService]: 'bg-blue-500/20 text-blue-300',
  [VehicleStatus.InDiagnosis]: 'bg-yellow-500/20 text-yellow-300',
  [VehicleStatus.InRepair]: 'bg-orange-500/20 text-orange-300',
  [VehicleStatus.ReadyForDelivery]: 'bg-green-500/20 text-green-300',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[status]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;


import React from 'react';

interface KPICardProps {
  title: string;
  value: number | string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value }) => {
  return (
    <div className="bg-kia-dark p-6 rounded-lg shadow-lg border-l-4 border-kia-primary">
      <h4 className="text-md font-medium text-kia-gray">{title}</h4>
      <p className="text-4xl font-bold mt-2 text-kia-light">{value}</p>
    </div>
  );
};

export default KPICard;

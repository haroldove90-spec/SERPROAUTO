
import React, { useState, useEffect } from 'react';
import { Vehicle, VehicleStatus, PriorityLevel, Role } from './types';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import Vehicles from './components/vehicles/Vehicles';
import Diagnostics from './components/diagnostics/Diagnostics';
import WorkOrders from './components/workorders/WorkOrders';
import { v4 as uuidv4 } from 'uuid';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './components/auth/LoginScreen';
import { getAllowedNavItems } from './components/layout/navItems';

const initialVehicles: Vehicle[] = [
  {
    id: '1',
    make: 'Kia',
    model: 'Forte',
    year: 2022,
    vin: 'KMFG54H87NB123456',
    licensePlate: 'RST-7890',
    status: VehicleStatus.InRepair,
    customer: { id: 'c1', name: 'Ana García', phone: '55-1234-5678', email: 'ana.garcia@email.com' },
    entryDate: '2023-10-26',
    estimatedCompletionDate: '2023-11-05',
    technician: 'Carlos Pérez',
    priority: PriorityLevel.High,
    workOrderNotes: 'Reemplazo de pastillas de freno y rectificación de discos.',
    inspection: {},
  },
  {
    id: '2',
    make: 'Kia',
    model: 'Seltos',
    year: 2023,
    vin: 'KNDJX3A42P7654321',
    licensePlate: 'JKL-1234',
    status: VehicleStatus.InDiagnosis,
    customer: { id: 'c2', name: 'Juan Martínez', phone: '55-8765-4321', email: 'juan.martinez@email.com' },
    entryDate: '2023-10-28',
    technician: 'mecanico',
    priority: PriorityLevel.Medium,
    inspection: {},
  },
  {
    id: '3',
    make: 'Kia',
    model: 'Rio',
    year: 2021,
    vin: 'KNADM5A34M1231231',
    licensePlate: 'XYZ-5678',
    status: VehicleStatus.ReadyForDelivery,
    customer: { id: 'c3', name: 'Sofía Rodríguez', phone: '55-5555-5555', email: 'sofia.r@email.com' },
    entryDate: '2023-10-25',
    estimatedCompletionDate: '2023-10-30',
    technician: 'mecanico',
    inspection: {},
  },
  {
    id: '4',
    make: 'Kia',
    model: 'Sportage',
    year: 2023,
    vin: 'KNHPC3A56P5432109',
    licensePlate: 'MNO-9012',
    status: VehicleStatus.InService,
    customer: { id: 'c4', name: 'Luis Hernández', phone: '55-2345-6789', email: 'luis.h@email.com' },
    entryDate: '2023-10-29',
    inspection: {},
  }
];

// FIX: Removed React.FC to allow for better type inference and resolve issue with AuthProvider.
const MainApp = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);

  useEffect(() => {
    if (user) {
      const allowedViews = getAllowedNavItems(user.role).map(item => item.id);
      if (!allowedViews.includes(activeView)) {
        setActiveView('dashboard');
      }
    }
  }, [user, activeView]);
  
  const addVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: uuidv4(),
    };
    setVehicles(prevVehicles => [newVehicle, ...prevVehicles]);
  };

  const updateVehicle = (updatedVehicle: Vehicle) => {
    setVehicles(prevVehicles => 
      prevVehicles.map(v => v.id === updatedVehicle.id ? updatedVehicle : v)
    );
  };
  
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard vehicles={vehicles} onAddVehicle={addVehicle} onUpdateVehicle={updateVehicle} />;
      case 'vehicles':
        return <Vehicles vehicles={vehicles} onAddVehicle={addVehicle} onUpdateVehicle={updateVehicle} />;
      case 'diagnostics':
        return <Diagnostics vehicles={vehicles} onUpdateVehicle={updateVehicle} />;
      case 'workorders':
        return <WorkOrders vehicles={vehicles} onUpdateVehicle={updateVehicle} />;
      default:
        return <Dashboard vehicles={vehicles} onAddVehicle={addVehicle} onUpdateVehicle={updateVehicle} />;
    }
  };

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {renderContent()}
    </Layout>
  );
}


// FIX: Removed React.FC to allow for better type inference and resolve issue where AuthProvider's children prop was not being correctly identified.
const App = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;